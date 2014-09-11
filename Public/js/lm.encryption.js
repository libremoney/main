/**
 * @depends {lm.js}
 */
var Lm = (function(Lm, $, undefined) {
	var _password;
	var _decryptionPassword;
	var _decryptedTransactions = {};
	var _encryptedNote = null;
	var _sharedKeys = {};

	var _hash = {
		init: SHA256_init,
		update: SHA256_write,
		getBytes: SHA256_finalize
	};


	function AddDecryptedTransaction(identifier, content) {
		if (!_decryptedTransactions[identifier]) {
			_decryptedTransactions[identifier] = content;
		}
	}

	function AesDecrypt(ivCiphertext, options) {
		if (ivCiphertext.length < 16 || ivCiphertext.length % 16 != 0) {
			throw {
				name: "invalid ciphertext"
			};
		}

		var iv = converters.byteArrayToWordArray(ivCiphertext.slice(0, 16));
		var ciphertext = converters.byteArrayToWordArray(ivCiphertext.slice(16));

		if (!options.sharedKey) {
			var sharedKey = GetSharedKey(options.privateKey, options.publicKey);
		} else {
			var sharedKey = options.sharedKey.slice(0); //clone
		}

		for (var i = 0; i < 32; i++) {
			sharedKey[i] ^= options.nonce[i];
		}

		var key = CryptoJS.SHA256(converters.byteArrayToWordArray(sharedKey));

		var encrypted = CryptoJS.lib.CipherParams.create({
			ciphertext: ciphertext,
			iv: iv,
			key: key
		});

		var decrypted = CryptoJS.AES.decrypt(encrypted, key, {
			iv: iv
		});

		var plaintext = converters.wordArrayToByteArray(decrypted);

		return plaintext;
	}

	function AesEncrypt(plaintext, options) {
		if (!window.crypto && !window.msCrypto) {
			throw {
				"errorCode": -1,
				"message": $.t("error_encryption_browser_support")
			};
		}

		// CryptoJS likes WordArray parameters
		var text = converters.byteArrayToWordArray(plaintext);

		if (!options.sharedKey) {
			var sharedKey = GetSharedKey(options.privateKey, options.publicKey);
		} else {
			var sharedKey = options.sharedKey.slice(0); //clone
		}

		for (var i = 0; i < 32; i++) {
			sharedKey[i] ^= options.nonce[i];
		}

		var key = CryptoJS.SHA256(converters.byteArrayToWordArray(sharedKey));

		var tmp = new Uint8Array(16);

		if (window.crypto) {
			window.crypto.getRandomValues(tmp);
		} else {
			window.msCrypto.getRandomValues(tmp);
		}

		var iv = converters.byteArrayToWordArray(tmp);
		var encrypted = CryptoJS.AES.encrypt(text, key, {
			iv: iv
		});

		var ivOut = converters.wordArrayToByteArray(encrypted.iv);

		var ciphertextOut = converters.wordArrayToByteArray(encrypted.ciphertext);

		return ivOut.concat(ciphertextOut);
	}

	function AreByteArraysEqual(bytes1, bytes2) {
		if (bytes1.length !== bytes2.length)
			return false;

		for (var i = 0; i < bytes1.length; ++i) {
			if (bytes1[i] !== bytes2[i])
				return false;
		}

		return true;
	}

	function ByteArrayToBigInteger(byteArray, startIndex) {
		var value = new BigInteger("0", 10);
		var temp1, temp2;
		for (var i = byteArray.length - 1; i >= 0; i--) {
			temp1 = value.multiply(new BigInteger("256", 10));
			temp2 = temp1.add(new BigInteger(byteArray[i].toString(10), 10));
			value = temp2;
		}

		return value;
	}

	function Curve25519_clamp(curve) {
		curve[0] &= 0xFFF8;
		curve[15] &= 0x7FFF;
		curve[15] |= 0x4000;
		return curve;
	}

	function DecryptAllMessages(messages, password) {
		if (!password) {
			throw {
				"message": $.t("error_passphrase_required"),
				"errorCode": 1
			};
		} else {
			var accountId = Lm.GetAccountId(password);
			if (accountId != Lm.Account) {
				throw {
					"message": $.t("error_incorrect_passphrase"),
					"errorCode": 2
				};
			}
		}

		var success = 0;
		var error = 0;

		for (var i = 0; i < messages.length; i++) {
			var message = messages[i];

			if (message.attachment.encryptedMessage && !_decryptedTransactions[message.transaction]) {
				try {
					var otherUser = (message.sender == Lm.Account ? message.recipient : message.sender);

					var decoded = Lm.DecryptNote(message.attachment.encryptedMessage.data, {
						"nonce": message.attachment.encryptedMessage.nonce,
						"account": otherUser
					}, password);

					_decryptedTransactions[message.transaction] = {
						"encryptedMessage": decoded
					};

					success++;
				} catch (err) {
					_decryptedTransactions[message.transaction] = {
						"encryptedMessage": $.t("error_decryption_unknown")
					};
					error++;
				}
			}
		}

		if (success || !error) {
			return true;
		} else {
			return false;
		}
	}

	function DecryptData(data, options, secretPhrase) {
		try {
			return Lm.DecryptNote(message, options, secretPhrase);
		} catch (err) {
			var mesage = String(err.message ? err.message : err);

			if (err.errorCode && err.errorCode == 1) {
				return false;
			} else {
				if (options.title) {
					var translatedTitle = Lm.GetTranslatedFieldName(options.title).toLowerCase();
					if (!translatedTitle) {
						translatedTitle = String(options.title).escapeHTML().toLowerCase();
					}

					return $.t("error_could_not_decrypt_var", {
						"var": translatedTitle
					}).capitalize();
				} else {
					return $.t("error_could_not_decrypt");
				}
			}
		}
	}

	function DecryptData1(data, options) {
		if (!options.sharedKey) {
			options.sharedKey = GetSharedKey(options.privateKey, options.publicKey);
		}

		var compressedPlaintext = AesDecrypt(data, options);

		var binData = new Uint8Array(compressedPlaintext);

		var data = pako.inflate(binData);

		return converters.byteArrayToString(data);
	}

	function DecryptNote(message, options, secretPhrase) {
		try {
			if (!options.sharedKey) {
				if (!options.privateKey) {
					if (!secretPhrase) {
						if (Lm.RememberPassword) {
							secretPhrase = _password;
						} else if (_decryptionPassword) {
							secretPhrase = _decryptionPassword;
						} else {
							throw {
								"message": $.t("error_decryption_passphrase_required"),
								"errorCode": 1
							};
						}
					}

					options.privateKey = converters.hexStringToByteArray(Lm.GetPrivateKey(secretPhrase));
				}

				if (!options.publicKey) {
					if (!options.account) {
						throw {
							"message": $.t("error_account_id_not_specified"),
							"errorCode": 2
						};
					}

					options.publicKey = converters.hexStringToByteArray(Lm.GetPublicKey(options.account, true));
				}
			}

			options.nonce = converters.hexStringToByteArray(options.nonce);

			return DecryptData1(converters.hexStringToByteArray(message), options);
		} catch (err) {
			if (err.errorCode && err.errorCode < 3) {
				throw err;
			} else {
				throw {
					"message": $.t("error_message_decryption"),
					"errorCode": 3
				};
			}
		}
	}

	function DecryptNoteFormSubmit() {
		var $form = $("#decrypt_note_form_container");

		if (!_encryptedNote) {
			$form.find(".callout").html($.t("error_encrypted_note_not_found")).show();
			return;
		}

		var password = $form.find("input[name=secretPhrase]").val();

		if (!password) {
			if (Lm.RememberPassword) {
				password = _password;
			} else if (_decryptionPassword) {
				password = _decryptionPassword;
			} else {
				$form.find(".callout").html($.t("error_passphrase_required")).show();
				return;
			}
		}

		var accountId = Lm.GetAccountId(password);
		if (accountId != Lm.Account) {
			$form.find(".callout").html($.t("error_incorrect_passphrase")).show();
			return;
		}

		var rememberPassword = $form.find("input[name=rememberPassword]").is(":checked");

		var otherAccount = _encryptedNote.account;

		var output = "";
		var decryptionError = false;
		var decryptedFields = {};

		var inAttachment = ("attachment" in _encryptedNote.transaction);

		var nrFields = Object.keys(_encryptedNote.fields).length;

		$.each(_encryptedNote.fields, function(key, title) {
			var data = "";

			var encrypted = "";
			var nonce = "";
			var nonceField = (typeof title != "string" ? title.nonce : key + "Nonce");

			if (key == "encryptedMessage" || key == "encryptToSelfMessage") {
				encrypted = _encryptedNote.transaction.attachment[key].data;
				nonce = _encryptedNote.transaction.attachment[key].nonce;
			} else if (_encryptedNote.transaction.attachment && _encryptedNote.transaction.attachment[key]) {
				encrypted = _encryptedNote.transaction.attachment[key];
				nonce = _encryptedNote.transaction.attachment[nonceField];
			} else if (_encryptedNote.transaction[key] && typeof _encryptedNote.transaction[key] == "object") {
				encrypted = _encryptedNote.transaction[key].data;
				nonce = _encryptedNote.transaction[key].nonce;
			} else if (_encryptedNote.transaction[key]) {
				encrypted = _encryptedNote.transaction[key];
				nonce = _encryptedNote.transaction[nonceField];
			} else {
				encrypted = "";
			}

			if (encrypted) {
				if (typeof title != "string") {
					title = title.title;
				}

				try {
					data = Lm.DecryptNote(encrypted, {
						"nonce": nonce,
						"account": otherAccount
					}, password);

					decryptedFields[key] = data;
				} catch (err) {
					decryptionError = true;
					var message = String(err.message ? err.message : err);

					$form.find(".callout").html(message.escapeHTML());
					return false;
				}

				output += "<div style='" + (!_encryptedNote.options.noPadding && title ? "padding-left:5px;" : "") + "'>" + (title ? "<label" + (nrFields > 1 ? " style='margin-top:5px'" : "") + "><i class='fa fa-lock'></i> " + String(title).escapeHTML() + "</label>" : "") + "<div>" + String(data).escapeHTML().nl2br() + "</div></div>";
			}
		});

		if (decryptionError) {
			return;
		}

		_decryptedTransactions[_encryptedNote.identifier] = decryptedFields;

		//only save 150 decryptions maximum in cache...
		var decryptionKeys = Object.keys(_decryptedTransactions);

		if (decryptionKeys.length > 150) {
			delete _decryptedTransactions[decryptionKeys[0]];
		}

		Lm.RemoveDecryptionForm();

		var outputEl = (_encryptedNote.options.outputEl ? String(_encryptedNote.options.outputEl).escapeHTML() : "#transaction_info_output_bottom");

		$(outputEl).append(output).show();

		_encryptedNote = null;

		if (rememberPassword) {
			_decryptionPassword = password;
		}
	}

	function EncryptData(plaintext, options) {
		if (!window.crypto && !window.msCrypto) {
			throw {
				"errorCode": -1,
				"message": $.t("error_encryption_browser_support")
			};
		}

		if (!options.sharedKey) {
			options.sharedKey = GetSharedKey(options.privateKey, options.publicKey);
		}

		var compressedPlaintext = pako.gzip(new Uint8Array(plaintext));

		options.nonce = new Uint8Array(32);

		if (window.crypto) {
			window.crypto.getRandomValues(options.nonce);
		} else {
			window.msCrypto.getRandomValues(options.nonce);
		}

		var data = AesEncrypt(compressedPlaintext, options);

		return {
			"nonce": options.nonce,
			"data": data
		};
	}

	function EncryptNote(message, options, secretPhrase) {
		try {
			if (!options.sharedKey) {
				if (!options.privateKey) {
					if (!secretPhrase) {
						if (Lm.RememberPassword) {
							secretPhrase = _password;
						} else {
							throw {
								"message": $.t("error_encryption_passphrase_required"),
								"errorCode": 1
							};
						}
					}

					options.privateKey = converters.hexStringToByteArray(Lm.GetPrivateKey(secretPhrase));
				}

				if (!options.publicKey) {
					if (!options.account) {
						throw {
							"message": $.t("error_account_id_not_specified"),
							"errorCode": 2
						};
					}

					try {
						options.publicKey = converters.hexStringToByteArray(Lm.GetPublicKey(options.account, true));
					} catch (err) {
						var lmAddress = new LmAddress();

						if (!lmAddress.set(options.account)) {
							throw {
								"message": $.t("error_invalid_account_id"),
								"errorCode": 3
							};
						} else {
							throw {
								"message": $.t("error_public_key_not_specified"),
								"errorCode": 4
							};
						}
					}
				} else if (typeof options.publicKey == "string") {
					options.publicKey = converters.hexStringToByteArray(options.publicKey);
				}
			}

			var encrypted = EncryptData(converters.stringToByteArray(message), options);

			return {
				"message": converters.byteArrayToHexString(encrypted.data),
				"nonce": converters.byteArrayToHexString(encrypted.nonce)
			};
		} catch (err) {
			if (err.errorCode && err.errorCode < 5) {
				throw err;
			} else {
				throw {
					"message": $.t("error_message_encryption"),
					"errorCode": 5
				};
			}
		}
	}

	function GeneratePublicKey(secretPhrase) {
		if (!secretPhrase) {
			if (Lm.RememberPassword) {
				secretPhrase = _password;
			} else {
				throw $.t("error_generate_public_key_no_password");
			}
		}

		return Lm.GetPublicKey(converters.stringToHexString(secretPhrase));
	}

	function GetAccountId(secretPhrase) {
		return Lm.GetAccountIdFromPublicKey(Lm.GetPublicKey(converters.stringToHexString(secretPhrase)));
	}

	function GetAccountIdFromPublicKey(publicKey, RSFormat) {
		var hex = converters.hexStringToByteArray(publicKey);

		_hash.init();
		_hash.update(hex);

		var account = _hash.getBytes();

		account = converters.byteArrayToHexString(account);

		var slice = (converters.hexStringToByteArray(account)).slice(0, 8);

		var accountId = ByteArrayToBigInteger(slice).toString();

		if (RSFormat) {
			var address = new LmAddress();

			if (address.set(accountId)) {
				return address.toString();
			} else {
				return "";
			}
		} else {
			return accountId;
		}
	}

	function GetPrivateKey(secretPhrase) {
		SHA256_init();
		SHA256_write(converters.stringToByteArray(secretPhrase));
		return converters.shortArrayToHexString(Curve25519_clamp(converters.byteArrayToShortArray(SHA256_finalize())));
	}

	function GetPublicKey(secretPhrase, isAccountNumber) {
		if (isAccountNumber) {
			var accountNumber = secretPhrase;
			var publicKey = "";

			//synchronous!
			Lm.SendRequest("getAccountPublicKey", {
				"account": accountNumber
			}, function(response) {
				if (!response.publicKey) {
					throw $.t("error_no_public_key");
				} else {
					publicKey = response.publicKey;
				}
			}, false);

			return publicKey;
		} else {
			var secretPhraseBytes = converters.hexStringToByteArray(secretPhrase);
			var digest = SimpleHash(secretPhraseBytes);
			return converters.byteArrayToHexString(curve25519.keygen(digest).p);
		}
	}

	function GetSharedKeyWithAccount(account) {
		try {
			if (account in _sharedKeys) {
				return _sharedKeys[account];
			}

			var secretPhrase;

			if (Lm.RememberPassword) {
				secretPhrase = _password;
			} else if (_decryptionPassword) {
				secretPhrase = _decryptionPassword;
			} else {
				throw {
					"message": $.t("error_passphrase_required"),
					"errorCode": 3
				};
			}

			var privateKey = converters.hexStringToByteArray(Lm.GetPrivateKey(secretPhrase));

			var publicKey = converters.hexStringToByteArray(Lm.GetPublicKey(account, true));

			var sharedKey = GetSharedKey(privateKey, publicKey);

			var sharedKeys = Object.keys(_sharedKeys);

			if (sharedKeys.length > 50) {
				delete _sharedKeys[sharedKeys[0]];
			}

			_sharedKeys[account] = sharedKey;
		} catch (err) {
			throw err;
		}
	}

	function RemoveDecryptionForm($modal) {
		if (($modal && $modal.find("#decrypt_note_form_container").length) || (!$modal && $("#decrypt_note_form_container").length)) {
			$("#decrypt_note_form_container input").val("");
			$("#decrypt_note_form_container").find(".callout").html($.t("passphrase_required_to_decrypt_data"));
			$("#decrypt_note_form_container").hide().detach().appendTo("body");
		}
	}

	function SetDecryptionPassword(password) {
		_decryptionPassword = password;
	}

	function SetEncryptionPassword(password) {
		_password = password;
	}

	function SignBytes(message, secretPhrase) {
		var messageBytes = converters.hexStringToByteArray(message);
		var secretPhraseBytes = converters.hexStringToByteArray(secretPhrase);

		var digest = SimpleHash(secretPhraseBytes);
		var s = curve25519.keygen(digest).s;

		var m = SimpleHash(messageBytes);

		_hash.init();
		_hash.update(m);
		_hash.update(s);
		var x = _hash.getBytes();

		var y = curve25519.keygen(x).p;

		_hash.init();
		_hash.update(m);
		_hash.update(y);
		var h = _hash.getBytes();

		var v = curve25519.sign(h, x, s);

		return converters.byteArrayToHexString(v.concat(h));
	}

	function SimpleHash(message) {
		_hash.init();
		_hash.update(message);
		return _hash.getBytes();
	}

	function TryToDecrypt(transaction, fields, account, options) {
		var showDecryptionForm = false;

		if (!options) {
			options = {};
		}

		var nrFields = Object.keys(fields).length;

		var formEl = (options.formEl ? String(options.formEl).escapeHTML() : "#transaction_info_output_bottom");
		var outputEl = (options.outputEl ? String(options.outputEl).escapeHTML() : "#transaction_info_output_bottom");

		var output = "";

		var identifier = (options.identifier ? transaction[options.identifier] : transaction.transaction);

		//check in cache first..
		if (_decryptedTransactions && _decryptedTransactions[identifier]) {
			var decryptedTransaction = _decryptedTransactions[identifier];

			$.each(fields, function(key, title) {
				if (typeof title != "string") {
					title = title.title;
				}

				if (key in decryptedTransaction) {
					output += "<div style='" + (!options.noPadding && title ? "padding-left:5px;" : "") + "'>" + (title ? "<label" + (nrFields > 1 ? " style='margin-top:5px'" : "") + "><i class='fa fa-lock'></i> " + String(title).escapeHTML() + "</label>" : "") + "<div>" + String(decryptedTransaction[key]).escapeHTML().nl2br() + "</div></div>";
				} else {
					//if a specific key was not found, the cache is outdated..
					output = "";
					delete _decryptedTransactions[identifier];
					return false;
				}
			});
		}

		if (!output) {
			$.each(fields, function(key, title) {
				var data = "";

				var encrypted = "";
				var nonce = "";
				var nonceField = (typeof title != "string" ? title.nonce : key + "Nonce");

				if (key == "encryptedMessage" || key == "encryptToSelfMessage") {
					encrypted = transaction.attachment[key].data;
					nonce = transaction.attachment[key].nonce;
				} else if (transaction.attachment && transaction.attachment[key]) {
					encrypted = transaction.attachment[key];
					nonce = transaction.attachment[nonceField];
				} else if (transaction[key] && typeof transaction[key] == "object") {
					encrypted = transaction[key].data;
					nonce = transaction[key].nonce;
				} else if (transaction[key]) {
					encrypted = transaction[key];
					nonce = transaction[nonceField];
				} else {
					encrypted = "";
				}

				if (encrypted) {
					if (typeof title != "string") {
						title = title.title;
					}

					try {
						data = Lm.DecryptNote(encrypted, {
							"nonce": nonce,
							"account": account
						});
					} catch (err) {
						var mesage = String(err.message ? err.message : err);
						if (err.errorCode && err.errorCode == 1) {
							showDecryptionForm = true;
							return false;
						} else {
							if (title) {
								var translatedTitle = Lm.GetTranslatedFieldName(title).toLowerCase();
								if (!translatedTitle) {
									translatedTitle = String(title).escapeHTML().toLowerCase();
								}

								data = $.t("error_could_not_decrypt_var", {
									"var": translatedTitle
								}).capitalize();
							} else {
								data = $.t("error_could_not_decrypt");
							}
						}
					}

					output += "<div style='" + (!options.noPadding && title ? "padding-left:5px;" : "") + "'>" + (title ? "<label" + (nrFields > 1 ? " style='margin-top:5px'" : "") + "><i class='fa fa-lock'></i> " + String(title).escapeHTML() + "</label>" : "") + "<div>" + String(data).escapeHTML().nl2br() + "</div></div>";
				}
			});
		}

		if (showDecryptionForm) {
			_encryptedNote = {
				"transaction": transaction,
				"fields": fields,
				"account": account,
				"options": options,
				"identifier": identifier
			};

			$("#decrypt_note_form_container").detach().appendTo(formEl);

			$("#decrypt_note_form_container, " + formEl).show();
		} else {
			Lm.RemoveDecryptionForm();
			$(outputEl).append(output).show();
		}
	}

	function TryToDecryptMessage(message) {
		if (_decryptedTransactions && _decryptedTransactions[message.transaction]) {
			return _decryptedTransactions[message.transaction].encryptedMessage;
		}

		try {
			if (!message.attachment.encryptedMessage.data) {
				return $.t("message_empty");
			} else {
				var decoded = Lm.DecryptNote(message.attachment.encryptedMessage.data, {
					"nonce": message.attachment.encryptedMessage.nonce,
					"account": (message.recipient == Lm.Account ? message.sender : message.recipient)
				});
			}

			return decoded;
		} catch (err) {
			throw err;
		}
	}

	function VerifyBytes(signature, message, publicKey) {
		var signatureBytes = converters.hexStringToByteArray(signature);
		var messageBytes = converters.hexStringToByteArray(message);
		var publicKeyBytes = converters.hexStringToByteArray(publicKey);
		var v = signatureBytes.slice(0, 32);
		var h = signatureBytes.slice(32);
		var y = curve25519.verify(v, h, publicKeyBytes);

		var m = SimpleHash(messageBytes);

		_hash.init();
		_hash.update(m);
		_hash.update(y);
		var h2 = _hash.getBytes();

		return AreByteArraysEqual(h, h2);
	}

	$("#decrypt_note_form_container button.btn-primary").click(function() {
		Lm.DecryptNoteFormSubmit();
	});

	$("#decrypt_note_form_container").on("submit", function(e) {
		e.preventDefault();
		Lm.DecryptNoteFormSubmit();
	});

	function GetSharedKey(key1, key2) {
		return converters.shortArrayToByteArray(curve25519_(converters.byteArrayToShortArray(key1), converters.byteArrayToShortArray(key2), null));
	}


	Lm.GeneratePublicKey = GeneratePublicKey;
	Lm.GetPublicKey = GetPublicKey;
	Lm.GetPrivateKey = GetPrivateKey;
	Lm.GetAccountId = GetAccountId;
	Lm.GetAccountIdFromPublicKey = GetAccountIdFromPublicKey;
	Lm.EncryptNote = EncryptNote;
	Lm.DecryptData = DecryptData;
	Lm.DecryptNote = DecryptNote;
	Lm.GetSharedKeyWithAccount = GetSharedKeyWithAccount;
	Lm.SignBytes = SignBytes;
	Lm.VerifyBytes = VerifyBytes;
	Lm.SetEncryptionPassword = SetEncryptionPassword;
	Lm.SetDecryptionPassword = SetDecryptionPassword;
	Lm.AddDecryptedTransaction = AddDecryptedTransaction;
	Lm.TryToDecryptMessage = TryToDecryptMessage;
	Lm.TryToDecrypt = TryToDecrypt;
	Lm.RemoveDecryptionForm = RemoveDecryptionForm;
	Lm.DecryptNoteFormSubmit = DecryptNoteFormSubmit;
	Lm.DecryptAllMessages = DecryptAllMessages;
	return Lm;
}(Lm || {}, jQuery));