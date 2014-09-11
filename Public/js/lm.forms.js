/**
 * @depends {lm.js}
 */
var Lm = (function(Lm, $, undefined) {
	Lm.ConfirmedFormWarning = false;

	Lm.Forms = {};


	function GetSuccessMessage(requestType) {
		var ignore = ["asset_exchange_change_group_name", "asset_exchange_group", "add_contact", "update_contact", "delete_contact",
			"send_message", "decrypt_messages", "start_forging", "stop_forging", "generate_token", "send_money", "set_alias", "add_asset_bookmark", "sell_alias"
		];

		if (ignore.indexOf(requestType) != -1) {
			return "";
		} else {
			var key = "success_" + requestType;

			if ($.i18n.exists(key)) {
				return $.t(key);
			} else {
				return "";
			}
		}
	}

	function GetErrorMessage(requestType) {
		var ignore = ["start_forging", "stop_forging", "generate_token", "validate_token"];

		if (ignore.indexOf(requestType) != -1) {
			return "";
		} else {
			var key = "error_" + requestType;

			if ($.i18n.exists(key)) {
				return $.t(key);
			} else {
				return "";
			}
		}
	}

	function AddMessageData(data, requestType) {
		if (requestType == "sendMessage") {
			data.add_message = true;
		}

		if (!data.add_message && !data.add_note_to_self) {
			delete data.message;
			delete data.note_to_self;
			delete data.encrypt_message;
			delete data.add_message;
			delete data.add_note_to_self;

			return data;
		} else if (!data.add_message) {
			delete data.message;
			delete data.encrypt_message;
			delete data.add_message;
		} else if (!data.add_note_to_self) {
			delete data.note_to_self;
			delete data.add_note_to_self;
		}

		data["_extra"] = {
			"message": data.message,
			"note_to_self": data.note_to_self
		};

		if (data.add_message && data.message) {
			if (data.encrypt_message) {
				try {
					var options = {};

					if (data.recipient) {
						options.account = data.recipient;
					} else if (data.encryptedMessageRecipient) {
						options.account = data.encryptedMessageRecipient;
						delete data.encryptedMessageRecipient;
					}

					if (data.recipientPublicKey) {
						options.publicKey = data.recipientPublicKey;
					}

					var encrypted = Lm.EncryptNote(data.message, options, data.secretPhrase);

					data.encryptedMessageData = encrypted.message;
					data.encryptedMessageNonce = encrypted.nonce;
					data.messageToEncryptIsText = "true";

					delete data.message;
				} catch (err) {
					throw err;
				}
			} else {
				data.messageIsText = "true";
			}
		} else {
			delete data.message;
		}

		if (data.add_note_to_self && data.note_to_self) {
			try {
				var options = {};

				var encrypted = Lm.EncryptNote(data.note_to_self, {
					"publicKey": converters.hexStringToByteArray(Lm.GeneratePublicKey(data.secretPhrase))
				}, data.secretPhrase);

				data.encryptToSelfMessageData = encrypted.message;
				data.encryptToSelfMessageNonce = encrypted.nonce;
				data.messageToEncryptToSelfIsText = "true";

				delete data.note_to_self;
			} catch (err) {
				throw err;
			}
		} else {
			delete data.note_to_self;
		}

		delete data.add_message;
		delete data.encrypt_message;
		delete data.add_note_to_self;

		return data;
	}

	function SubmitForm($modal, $btn) {
		if (!$btn) {
			$btn = $modal.find("button.btn-primary:not([data-dismiss=modal])");
		}

		var $modal = $btn.closest(".modal");

		$modal.modal("lock");
		$modal.find("button").prop("disabled", true);
		$btn.button("loading");

		if ($btn.data("form")) {
			var $form = $modal.find("form#" + $btn.data("form"));
			if (!$form.length) {
				$form = $modal.find("form:first");
			}
		} else {
			var $form = $modal.find("form:first");
		}

		var requestType = $form.find("input[name=request_type]").val();
		var requestTypeKey = requestType.replace(/([A-Z])/g, function($1) {
			return "_" + $1.toLowerCase();
		});

		var successMessage = GetSuccessMessage(requestTypeKey);
		var errorMessage = GetErrorMessage(requestTypeKey);

		var data = null;

		var formFunction = Lm["forms"][requestType];
		var formErrorFunction = Lm["forms"][requestType + "Error"];

		if (typeof formErrorFunction != "function") {
			formErrorFunction = false;
		}

		var originalRequestType = requestType;

		if (Lm.DownloadingBlockchain) {
			$form.find(".error_message").html($.t("error_blockchain_downloading")).show();
			if (formErrorFunction) {
				formErrorFunction();
			}
			Lm.UnlockForm($modal, $btn);
			return;
		} else if (Lm.State.isScanning) {
			$form.find(".error_message").html($.t("error_form_blockchain_rescanning")).show();
			if (formErrorFunction) {
				formErrorFunction();
			}
			Lm.UnlockForm($modal, $btn);
			return;
		}

		var invalidElement = false;

		//TODO
		$form.find(":input").each(function() {
			if ($(this).is(":invalid")) {
				var error = "";
				var name = String($(this).attr("name")).replace("MilliLm", "").replace("Lm", "").capitalize();
				var value = $(this).val();

				if ($(this).hasAttr("max")) {
					if (!/^[\-\d\.]+$/.test(value)) {
						error = $.t("error_not_a_number", {
							"field": Lm.GetTranslatedFieldName(name).toLowerCase()
						}).capitalize();
					} else {
						var max = $(this).attr("max");

						if (value > max) {
							error = $.t("error_max_value", {
								"field": Lm.GetTranslatedFieldName(name).toLowerCase(),
								"max": max
							}).capitalize();
						}
					}
				}

				if ($(this).hasAttr("min")) {
					if (!/^[\-\d\.]+$/.test(value)) {
						error = $.t("error_not_a_number", {
							"field": Lm.GetTranslatedFieldName(name).toLowerCase()
						}).capitalize();
					} else {
						var min = $(this).attr("min");

						if (value < min) {
							error = $.t("error_min_value", {
								"field": Lm.GetTranslatedFieldName(name).toLowerCase(),
								"min": min
							}).capitalize();
						}
					}
				}

				if (!error) {
					error = $.t("error_invalid_field", {
						"field": Lm.GetTranslatedFieldName(name).toLowerCase()
					}).capitalize();
				}

				$form.find(".error_message").html(error).show();

				if (formErrorFunction) {
					formErrorFunction();
				}

				Lm.UnlockForm($modal, $btn);
				invalidElement = true;
				return false;
			}
		});

		if (invalidElement) {
			return;
		}

		if (typeof formFunction == "function") {
			var output = formFunction($modal);

			if (!output) {
				return;
			} else if (output.error) {
				$form.find(".error_message").html(output.error.escapeHTML()).show();
				if (formErrorFunction) {
					formErrorFunction();
				}
				Lm.UnlockForm($modal, $btn);
				return;
			} else {
				if (output.requestType) {
					requestType = output.requestType;
				}
				if (output.data) {
					data = output.data;
				}
				if ("successMessage" in output) {
					successMessage = output.successMessage;
				}
				if ("errorMessage" in output) {
					errorMessage = output.errorMessage;
				}
				if (output.stop) {
					Lm.UnlockForm($modal, $btn, true);
					return;
				}
			}
		}

		if (!data) {
			data = Lm.GetFormData($form);
		}

		if (data.recipient) {
			data.recipient = $.trim(data.recipient);
			if (/^\d+$/.test(data.recipient)) {
				$form.find(".error_message").html($.t("error_numeric_ids_not_allowed")).show();
				if (formErrorFunction) {
					formErrorFunction(false, data);
				}
				Lm.UnlockForm($modal, $btn);
				return;
			} else if (!/^LMA\-[A-Z0-9]+\-[A-Z0-9]+\-[A-Z0-9]+\-[A-Z0-9]+/i.test(data.recipient)) {
				var convertedAccountId = $modal.find("input[name=converted_account_id]").val();
				if (!convertedAccountId || (!/^\d+$/.test(convertedAccountId) && !/^LMA\-[A-Z0-9]+\-[A-Z0-9]+\-[A-Z0-9]+\-[A-Z0-9]+/i.test(convertedAccountId))) {
					$form.find(".error_message").html($.t("error_account_id")).show();
					if (formErrorFunction) {
						formErrorFunction(false, data);
					}
					Lm.UnlockForm($modal, $btn);
					return;
				} else {
					data.recipient = convertedAccountId;
					data["_extra"] = {
						"convertedAccount": true
					};
				}
			}
		}

		if (requestType == "sendMoney" || requestType == "transferAsset") {
			var merchantInfo = $modal.find("input[name=merchant_info]").val();

			var result = merchantInfo.match(/#merchant:(.*)#/i);

			if (result && result[1]) {
				merchantInfo = $.trim(result[1]);

				if (!data.add_message || !data.message) {
					$form.find(".error_message").html($.t("info_merchant_message_required")).show();
					if (formErrorFunction) {
						formErrorFunction(false, data);
					}
					Lm.UnlockForm($modal, $btn);
					return;
				}

				if (merchantInfo == "numeric") {
					merchantInfo = "[0-9]+";
				} else if (merchantInfo == "alphanumeric") {
					merchantInfo = "[a-zA-Z0-9]+";
				}

				var regexParts = merchantInfo.match(/^\/(.*?)\/(.*)$/);

				if (!regexParts) {
					regexParts = ["", merchantInfo, ""];
				}

				var strippedRegex = regexParts[1].replace(/^[\^\(]*/, "").replace(/[\$\)]*$/, "");

				if (regexParts[1].charAt(0) != "^") {
					regexParts[1] = "^" + regexParts[1];
				}

				if (regexParts[1].slice(-1) != "$") {
					regexParts[1] = regexParts[1] + "$";
				}

				if (regexParts[2].indexOf("i") !== -1) {
					var regexp = new RegExp(regexParts[1], "i");
				} else {
					var regexp = new RegExp(regexParts[1]);
				}

				if (!regexp.test(data.message)) {
					var regexType;
					var errorMessage;
					var lengthRequirement = strippedRegex.match(/\{(.*)\}/);

					if (lengthRequirement) {
						strippedRegex = strippedRegex.replace(lengthRequirement[0], "+");
					}

					if (strippedRegex == "[0-9]+") {
						regexType = "numeric";
					} else if (strippedRegex == "[a-z0-9]+" || strippedRegex.toLowerCase() == "[a-za-z0-9]+" || strippedRegex == "[a-z0-9]+") {
						regexType = "alphanumeric";
					} else {
						regexType = "custom";
					}

					if (lengthRequirement) {
						var minLength, maxLength, requiredLength;

						if (lengthRequirement[1].indexOf(",") != -1) {
							lengthRequirement = lengthRequirement[1].split(",");
							var minLength = parseInt(lengthRequirement[0], 10);
							if (lengthRequirement[1]) {
								var maxLength = parseInt(lengthRequirement[1], 10);
								errorMessage = $.t("error_merchant_message_" + regexType + "_range_length", {
									"minLength": minLength,
									"maxLength": maxLength
								});
							} else {
								errorMessage = $.t("error_merchant_message_" + regexType + "_min_length", {
									"minLength": minLength
								});
							}
						} else {
							var requiredLength = parseInt(lengthRequirement[1], 10);
							errorMessage = $.t("error_merchant_message_" + regexType + "_length", {
								"length": requiredLength
							});
						}
					} else {
						errorMessage = $.t("error_merchant_message_" + regexType);
					}

					$form.find(".error_message").html(errorMessage).show();
					if (formErrorFunction) {
						formErrorFunction(false, data);
					}
					Lm.UnlockForm($modal, $btn);
					return;
				}
			}
		}

		try {
			data = Lm.AddMessageData(data, requestType);
		} catch (err) {
			$form.find(".error_message").html(String(err.message).escapeHTML()).show();
			if (formErrorFunction) {
				formErrorFunction();
			}
			Lm.UnlockForm($modal, $btn);
			return;
		}

		if (data.deadline) {
			data.deadline = String(data.deadline * 60); //hours to minutes
		}

		if ("secretPhrase" in data && !data.secretPhrase.length && !Lm.RememberPassword) {
			$form.find(".error_message").html($.t("error_passphrase_required")).show();
			if (formErrorFunction) {
				formErrorFunction(false, data);
			}
			Lm.UnlockForm($modal, $btn);
			return;
		}

		if (!Lm.ShowedFormWarning) {
			if ("amountLm" in data && Lm.Settings["amount_warning"] && Lm.Settings["amount_warning"] != "0") {
				if (new BigInteger(Lm.ConvertToMilliLm(data.amountLm)).compareTo(new BigInteger(Lm.Settings["amount_warning"])) > 0) {
					Lm.ShowedFormWarning = true;
					$form.find(".error_message").html($.t("error_max_amount_warning", {
						"lm": Lm.FormatAmount(Lm.Settings["amount_warning"])
					})).show();
					if (formErrorFunction) {
						formErrorFunction(false, data);
					}
					Lm.UnlockForm($modal, $btn);
					return;
				}
			}

			if ("feeLm" in data && Lm.Settings["fee_warning"] && Lm.Settings["fee_warning"] != "0") {
				if (new BigInteger(Lm.ConvertToMilliLm(data.feeLm)).compareTo(new BigInteger(Lm.Settings["fee_warning"])) > 0) {
					Lm.ShowedFormWarning = true;
					$form.find(".error_message").html($.t("error_max_fee_warning", {
						"lm": Lm.FormatAmount(Lm.Settings["fee_warning"])
					})).show();
					if (formErrorFunction) {
						formErrorFunction(false, data);
					}
					Lm.UnlockForm($modal, $btn);
					return;
				}
			}
		}

		if (data.doNotBroadcast) {
			data.broadcast = "false";
			delete data.doNotBroadcast;
		}

		Lm.SendRequest(requestType, data, function(response) {
			//todo check again.. response.error
			if (response.fullHash) {
				Lm.UnlockForm($modal, $btn);

				if (!$modal.hasClass("modal-no-hide")) {
					$modal.modal("hide");
				}

				if (successMessage) {
					$.growl(successMessage.escapeHTML(), {
						type: "success"
					});
				}

				var formCompleteFunction = Lm["forms"][originalRequestType + "Complete"];

				if (requestType != "parseTransaction") {
					if (typeof formCompleteFunction == "function") {
						data.requestType = requestType;

						if (response.transaction) {
							Lm.AddUnconfirmedTransaction(response.transaction, function(alreadyProcessed) {
								response.alreadyProcessed = alreadyProcessed;
								formCompleteFunction(response, data);
							});
						} else {
							response.alreadyProcessed = false;
							formCompleteFunction(response, data);
						}
					} else {
						Lm.AddUnconfirmedTransaction(response.transaction);
					}
				} else {
					if (typeof formCompleteFunction == "function") {
						data.requestType = requestType;
						formCompleteFunction(response, data);
					}
				}

				if (Lm.AccountInfo && !Lm.AccountInfo.publicKey) {
					$("#dashboard_message").hide();
				}
			} else if (response.errorCode) {
				$form.find(".error_message").html(response.errorDescription.escapeHTML()).show();

				if (formErrorFunction) {
					formErrorFunction(response, data);
				}

				Lm.UnlockForm($modal, $btn);
			} else {
				var sentToFunction = false;

				if (!errorMessage) {
					var formCompleteFunction = Lm["forms"][originalRequestType + "Complete"];

					if (typeof formCompleteFunction == 'function') {
						sentToFunction = true;
						data.requestType = requestType;

						Lm.UnlockForm($modal, $btn);

						if (!$modal.hasClass("modal-no-hide")) {
							$modal.modal("hide");
						}
						formCompleteFunction(response, data);
					} else {
						errorMessage = $.t("error_unknown");
					}
				}

				if (!sentToFunction) {
					Lm.UnlockForm($modal, $btn, true);

					$.growl(errorMessage.escapeHTML(), {
						type: 'danger'
					});
				}
			}
		});
	}

	function UnlockForm($modal, $btn, hide) {
		$modal.find("button").prop("disabled", false);
		if ($btn) {
			$btn.button("reset");
		}
		$modal.modal("unlock");
		if (hide) {
			$modal.modal("hide");
		}
	}


	$(".modal form input").keydown(function(e) {
		if (e.which == "13") {
			e.preventDefault();
			if (Lm.Settings["submit_on_enter"] && e.target.type != "textarea") {
				$(this).submit();
			} else {
				return false;
			}
		}
	});

	$(".modal button.btn-primary:not([data-dismiss=modal]):not([data-ignore=true])").click(function() {
		Lm.SubmitForm($(this).closest(".modal"), $(this));
	});


	Lm.AddMessageData = AddMessageData;
	Lm.SubmitForm = SubmitForm;
	Lm.UnlockForm = UnlockForm;
	return Lm;
}(Lm || {}, jQuery));