/**
 * @depends {lm.js}
 * @depends {Lib/Crypto/Crypto.js}
 */
var Lm = (function(Lm, $, undefined) {
	var _password;
	var _decryptionPassword;
	var _decryptedTransactions = {};
	var _encryptedNote = null;
	var _sharedKeys = {};


	function AddDecryptedTransaction(identifier, content) {
		if (!_decryptedTransactions[identifier]) {
			_decryptedTransactions[identifier] = content;
		}
	}

	function AesDecrypt(ivCiphertext, options) {
		return Crypto.AesDecrypt(ivCiphertext, options);
	}

	function AesEncrypt(plaintext, options) {
		return Crypto.AesEncrypt(plaintext, options);
	}

	function AreByteArraysEqual(bytes1, bytes2) {
		return Crypto.AreByteArraysEqual(bytes1, bytes2);
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

	function DecryptData(data, options) {
		if (!options.sharedKey) {
			options.sharedKey = GetSharedKey(options.privateKey, options.publicKey);
		}

		var compressedPlaintext = AesDecrypt(data, options);

		var binData = new Uint8Array(compressedPlaintext);

		var data = pako.inflate(binData);

		return Convert.ByteArrayToString(data);
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

					options.privateKey = Convert.HexStringToByteArray(Lm.GetPrivateKey(secretPhrase));
				}

				if (!options.publicKey) {
					if (!options.account) {
						throw {
							"message": $.t("error_account_id_not_specified"),
							"errorCode": 2
						};
					}

					options.publicKey = Convert.HexStringToByteArray(Lm.GetPublicKey(options.account, true));
				}
			}

			options.nonce = Convert.HexStringToByteArray(options.nonce);

			return DecryptData(Convert.HexStringToByteArray(message), options);
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

					options.privateKey = Convert.HexStringToByteArray(Lm.GetPrivateKey(secretPhrase));
				}

				if (!options.publicKey) {
					if (!options.account) {
						throw {
							"message": $.t("error_account_id_not_specified"),
							"errorCode": 2
						};
					}

					try {
						options.publicKey = Convert.HexStringToByteArray(Lm.GetPublicKey(options.account, true));
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
					options.publicKey = Convert.HexStringToByteArray(options.publicKey);
				}
			}

			var encrypted = EncryptData(Convert.StringToByteArray(message), options);

			return {
				"message": Convert.ByteArrayToHexString(encrypted.data),
				"nonce": Convert.ByteArrayToHexString(encrypted.nonce)
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

		return Lm.GetPublicKey(Convert.StringToHexString(secretPhrase));
	}

	function GetAccountId(secretPhrase) {
		return Crypto.GetAccountId(secretPhrase);
	}

	function GetAccountIdFromPublicKey(publicKey, RsFormat) {
		return Crypto.GetAccountIdFromPublicKey(publicKey, RsFormat);
	}

	function GetPrivateKey(secretPhrase) {
		return Crypto.GetPrivateKey(secretPhrase);
	}

	function GetPublicKey(secretPhrase, isAccountNumber) {
		return Crypto.GetPublicKey(secretPhrase, isAccountNumber);
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

			var privateKey = Convert.HexStringToByteArray(Lm.GetPrivateKey(secretPhrase));

			var publicKey = Convert.HexStringToByteArray(Lm.GetPublicKey(account, true));

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
		return Crypto.SignBytes(message, secretPhrase);
	}

	function SimpleHash(message) {
		return Crypto.SimpleHash(message);
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
		return Crypto.VerifyBytes(signature, message, publicKey);
	}

	$("#decrypt_note_form_container button.btn-primary").click(function() {
		Lm.DecryptNoteFormSubmit();
	});

	$("#decrypt_note_form_container").on("submit", function(e) {
		e.preventDefault();
		Lm.DecryptNoteFormSubmit();
	});

	function GetSharedKey(key1, key2) {
		return Convert.ShortArrayToByteArray(curve25519_(Convert.ByteArrayToShortArray(key1), Convert.ByteArrayToShortArray(key2), null));
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