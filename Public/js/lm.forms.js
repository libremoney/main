var Lm = (function(Lm, $, undefined) {
	Lm.ConfirmedFormWarning = false;

	Lm.Forms = {
		"errorMessages": {}
	};


	function ModalFormKeydown(e, th) {
		if (e.which == "13") {
			e.preventDefault();
			if (Lm.Settings["submit_on_enter"] && e.target.type != "textarea") {
				th.submit();
			} else {
				return false;
			}
		}
	}

	function SubmitForm($modal, $btn) {
		if (!$btn) {
			$btn = $modal.find("button.btn-primary:not([data-dismiss=modal])");
		}

		var $modal = $btn.closest(".modal");

		$modal.modal("lock");
		$modal.find("button").prop("disabled", true);
		$btn.button("loading");

		var requestType = $modal.find("input[name=request_type]").val();
		var successMessage = $modal.find("input[name=success_message]").val();
		var errorMessage = $modal.find("input[name=error_message]").val();
		var data = null;

		var formFunction = Lm["forms"][requestType];

		var originalRequestType = requestType;

		var $form = $modal.find("form:first");

		if (Lm.DownloadingBlockchain) {
			$modal.find(".error_message").html("Please wait until the blockchain has finished downloading.").show();
			Lm.UnlockForm($modal, $btn);
			return;
		} else if (Lm.State.isScanning) {
			$modal.find(".error_message").html("The blockchain is currently being rescanned. Please wait a minute and then try submitting again.").show();
			Lm.UnlockForm($modal, $btn);
			return;
		}

		var invalidElement = false;

		$form.find(":input").each(function() {
			if ($(this).is(":invalid")) {
				var error = "";
				var name = String($(this).attr("name")).capitalize();
				var value = $(this).val();

				if ($(this).hasAttr("max")) {
					var max = $(this).attr("max");

					if (value > max) {
						error = name.escapeHTML() + ": Maximum value is " + String(max).escapeHTML() + ".";
					}
				}

				if ($(this).hasAttr("min")) {
					var min = $(this).attr("min");

					if (value < min) {
						error = name.escapeHTML() + ": Minimum value is " + String(min).escapeHTML() + ".";
					}
				}

				if (!error) {
					error = name.escapeHTML() + " is invalid.";
				}

				$modal.find(".error_message").html(error).show();
				Lm.UnlockForm($modal, $btn);
				invalidElement = true;
				return false;
			}
		});

		if (invalidElement) {
			return;
		}

		if (typeof formFunction == 'function') {
			var output = formFunction($modal);

			if (!output) {
				return;
			} else if (output.error) {
				$modal.find(".error_message").html(output.error.escapeHTML()).show();
				Lm.UnlockForm($modal, $btn);
				return;
			} else {
				if (output.requestType) {
					requestType = output.requestType;
				}
				if (output.data) {
					data = output.data;
				}
				if (output.successMessage) {
					successMessage = output.successMessage;
				}
				if (output.errorMessage) {
					errorMessage = output.errorMessage;
				}
				if (output.stop) {
					Lm.UnlockForm($modal, $btn, true);
					return;
				}
			}
		}

		if (!data) {
			data = Lm.GetFormData($modal.find("form:first"));
		}

		if (data.deadline) {
			data.deadline = String(data.deadline * 60); //hours to minutes
		}

		if (data.recipient) {
			data.recipient = $.trim(data.recipient);
			if (!/^\d+$/.test(data.recipient) && !/^LMA\-[A-Z0-9]+\-[A-Z0-9]+\-[A-Z0-9]+\-[A-Z0-9]+/i.test(data.recipient)) {
				var convertedAccountId = $modal.find("input[name=converted_account_id]").val();
				if (!convertedAccountId || (!/^\d+$/.test(convertedAccountId) && !/^LMA\-[A-Z0-9]+\-[A-Z0-9]+\-[A-Z0-9]+\-[A-Z0-9]+/i.test(convertedAccountId))) {
					$modal.find(".error_message").html("Invalid account ID.").show();
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

		if ("secretPhrase" in data && !data.secretPhrase.length && !Lm.RememberPassword) {
			$modal.find(".error_message").html("Secret phrase is a required field.").show();
			Lm.UnlockForm($modal, $btn);
			return;
		}

		if (!Lm.ShowedFormWarning) {
			if ("amountLm" in data && Lm.Settings["amount_warning"] && Lm.Settings["amount_warning"] != "0") {
				if (new BigInteger(Lm.ConvertToMilliLm(data.amountLm)).compareTo(new BigInteger(Lm.Settings["amount_warning"])) > 0) {
					Lm.ShowedFormWarning = true;
					$modal.find(".error_message").html("You amount is higher than " + Lm.FormatAmount(Lm.Settings["amount_warning"]) + " Lm. Are you sure you want to continue? Click the submit button again to confirm.").show();
					Lm.UnlockForm($modal, $btn);
					return;
				}
			}

			if ("feeLm" in data && Lm.Settings["fee_warning"] && Lm.Settings["fee_warning"] != "0") {
				if (new BigInteger(Lm.ConvertToMilliLm(data.feeLm)).compareTo(new BigInteger(Lm.Settings["fee_warning"])) > 0) {
					Lm.ShowedFormWarning = true;
					$modal.find(".error_message").html("You fee is higher than " + Lm.FormatAmount(Lm.Settings["fee_warning"]) +
						" Lm. Are you sure you want to continue? Click the submit button again to confirm.").show();
					Lm.UnlockForm($modal, $btn);
					return;
				}
			}
		}

		Lm.SendRequest(requestType, data, function(response) {
			if (response.errorCode) {
				if (Lm.Forms.ErrorMessages[requestType] && Lm.Forms.ErrorMessages[requestType][response.errorCode]) {
					$modal.find(".error_message").html(Lm.Forms.ErrorMessages[requestType][response.errorCode].escapeHTML()).show();
				} else if (Lm.Forms.ErrorMessages[originalRequestType] && Lm.Forms.ErrorMessages[originalRequestType][response.errorCode]) {
					$modal.find(".error_message").html(Lm.Forms.ErrorMessages[originalRequestType][response.errorCode].escapeHTML()).show();
				} else {
					$modal.find(".error_message").html(response.errorDescription ? response.errorDescription.escapeHTML() : "Unknown error occured.").show();
				}
				Lm.UnlockForm($modal, $btn);
			} else if (response.fullHash) {
				//should we add a fake transaction to the recent transactions?? or just wait until the next block comes!??
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

				if (Lm.AccountInfo && !Lm.AccountInfo.publicKey) {
					$("#dashboard_message").hide();
				}
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
						errorMessage = "An unknown error occured.";
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
		return Lm.ModalFormKeydown(e, $(this));
	});

	$(".modal button.btn-primary:not([data-dismiss=modal])").click(function() {
		Lm.SubmitForm($(this).closest(".modal"), $(this));
	});


	Lm.ModalFormKeydown = ModalFormKeydown;
	Lm.SubmitForm = SubmitForm;
	Lm.UnlockForm = UnlockForm;
	return Lm;
}(Lm || {}, jQuery));