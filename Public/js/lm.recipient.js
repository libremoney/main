/**
 * @depends {lm.js}
 */
var Lm = (function(Lm, $, undefined) {

	function AutomaticallyCheckRecipient() {
		var $recipientFields = $("#send_money_recipient, #transfer_asset_recipient, #send_message_recipient, #add_contact_account_id, #update_contact_account_id, #lease_balance_recipient, #transfer_alias_recipient, #sell_alias_recipient");

		$recipientFields.on("blur", function() {
			$(this).trigger("checkRecipient");
		});

		$recipientFields.on("checkRecipient", function() {
			var value = $(this).val();
			var modal = $(this).closest(".modal");

			if (value && value != "LMA-____-____-____-_____") {
				Lm.CheckRecipient(value, modal);
			} else {
				modal.find(".account_info").hide();
			}
		});

		$recipientFields.on("oldRecipientPaste", function() {
			var modal = $(this).closest(".modal");

			var callout = modal.find(".account_info").first();

			callout.removeClass("callout-info callout-danger callout-warning").addClass("callout-danger").html($.t("error_numeric_ids_not_allowed")).show();
		});
	}

	function RecipientSelectorButton_OnClick(th, e) {
		var $invoker = $(e.relatedTarget);

		var account = $invoker.data("account");

		if (!account) {
			account = $invoker.data("contact");
		}

		if (account) {
			var $inputField = th.find("input[name=recipient], input[name=account_id]").not("[type=hidden]");

			if (!/LMA\-/i.test(account)) {
				$inputField.addClass("noMask");
			}

			$inputField.val(account).trigger("checkRecipient");
		}
	}

	function SendMoneyAmount_Input(th, e) {
		var amount = parseInt(th.val(), 10);
		var fee = isNaN(amount) ? 1 : (amount < 500 ? 1 : Math.round(amount / 1000));

		$("#send_money_fee").val(fee);

		th.closest(".modal").find(".advanced_fee").html(Lm.FormatAmount(Lm.ConvertToMilliLm(fee)) + " LMA");
	}

	//todo later: http://twitter.github.io/typeahead.js/
	function RecipientSelectorButton_OnClick(th, e) {
		if (!Object.keys(Lm.Contacts).length) {
			e.preventDefault();
			e.stopPropagation();
			return;
		}

		var $list = th.parent().find("ul");

		$list.empty();

		for (var accountId in Lm.Contacts) {
			$list.append("<li><a href='#' data-contact='" + String(Lm.Contacts[accountId].name).escapeHTML() + "'>" +
				String(Lm.Contacts[accountId].name).escapeHTML() + "</a></li>");
		}
	}

	function RecipientSelectorClick(th, e) {
		e.preventDefault();
		th.closest("form").find("input[name=converted_account_id]").val("");
		th.closest("form").find("input[name=recipient],input[name=account_id]").not("[type=hidden]").trigger("unmask")
			.val(th.data("contact")).trigger("blur");
	}

	function SendMoneyCompleteForm(response, data) {
		if (!(data["_extra"] && data["_extra"].convertedAccount) && !(data.recipient in Lm.Contacts)) {
			$.growl($.t("success_send_money") + " <a href='#' data-account='" + Lm.GetAccountFormatted(data, "recipient") + "' data-toggle='modal' data-target='#add_contact_modal' style='text-decoration:underline'>" + $.t("add_recipient_to_contacts_q") + "</a>", {
				"type": "success"
			});
		} else {
			$.growl($.t("success_send_money"), {
				"type": "success"
			});
		}
	}

	function SendMoneyShowAccountInformation(accountId) {
		Lm.GetAccountError(accountId, function(response) {
			if (response.type == "success") {
				$("#send_money_account_info").hide();
			} else {
				$("#send_money_account_info").html(response.message).show();

			}
		});
	}

	function GetAccountError(accountId, callback) {
		Lm.SendRequest("getAccount", {
			"account": accountId
		}, function(response) {
			if (response.publicKey) {
				callback({
					"type": "info",
					"message": $.t("recipient_info", {
						"lm": Lm.FormatAmount(response.unconfirmedBalanceMilliLm, false, true)
					}),
					"account": response
				});
			} else {
				if (response.errorCode) {
					if (response.errorCode == 4) {
						callback({
							"type": "danger",
							"message": $.t("recipient_malformed") + (!/^(LMA\-)/i.test(accountId) ? " " + $.t("recipient_alias_suggestion") : ""),
							"account": null
						});
					} else if (response.errorCode == 5) {
						callback({
							"type": "warning",
							"message": $.t("recipient_unknown_pka"),
							"account": null,
							"noPublicKey": true
						});
					} else {
						callback({
							"type": "danger",
							"message": $.t("recipient_problem") + " " + String(response.errorDescription).escapeHTML(),
							"account": null
						});
					}
				} else {
					callback({
						"type": "warning",
						"message": $.t("recipient_no_public_key_pka", {
							"lm": Lm.FormatAmount(response.unconfirmedBalanceMilliLm, false, true)
						}),
						"account": response,
						"noPublicKey": true
					});
				}
			}
		});
	}

	function CorrectAddressMistake(el) {
		$(el).closest(".modal-body").find("input[name=recipient],input[name=account_id]").val($(el).data("address")).trigger("blur");
	}

	function CheckRecipient(account, modal) {
		var classes = "callout-info callout-danger callout-warning";

		var callout = modal.find(".account_info").first();
		var accountInputField = modal.find("input[name=converted_account_id]");
		var merchantInfoField = modal.find("input[name=merchant_info]");
		var recipientPublicKeyField = modal.find("input[name=recipientPublicKey]");

		accountInputField.val("");
		merchantInfoField.val("");

		account = $.trim(account);

		//solomon reed. Btw, this regex can be shortened..
		if (/^(LMA\-)?[A-Z0-9]+\-[A-Z0-9]+\-[A-Z0-9]+\-[A-Z0-9]+/i.test(account)) {
			var address = new LmAddress();

			if (address.set(account)) {
				Lm.GetAccountError(account, function(response) {
					if (response.noPublicKey) {
						modal.find(".recipient_public_key").show();
					} else {
						modal.find("input[name=recipientPublicKey]").val("");
						modal.find(".recipient_public_key").hide();
					}
					if (response.account && response.account.description) {
						CheckForMerchant(response.account.description, modal);
					}

					var message = response.message.escapeHTML();

					callout.removeClass(classes).addClass("callout-" + response.type).html(message).show();
				});
			} else {
				if (address.guess.length == 1) {
					callout.removeClass(classes).addClass("callout-danger").html($.t("recipient_malformed_suggestion", {
						"recipient": "<span class='malformed_address' data-address='" + String(address.guess[0]).escapeHTML() + "' onclick='Lm.CorrectAddressMistake(this);'>" + address.format_guess(address.guess[0], account) + "</span>"
					})).show();
				} else if (address.guess.length > 1) {
					var html = $.t("recipient_malformed_suggestion", {
						"count": address.guess.length
					}) + "<ul>";
					for (var i = 0; i < address.guess.length; i++) {
						html += "<li><span clas='malformed_address' data-address='" + String(address.guess[i]).escapeHTML() + "' onclick='Lm.CorrectAddressMistake(this);'>" + address.format_guess(address.guess[i], account) + "</span></li>";
					}

					callout.removeClass(classes).addClass("callout-danger").html(html).show();
				} else {
					callout.removeClass(classes).addClass("callout-danger").html($.t("recipient_malformed")).show();
				}
			}
		} else if (!(/^\d+$/.test(account))) {
			if (Lm.DatabaseSupport && account.charAt(0) != '@') {
				Lm.Database.select("contacts", [{
					"name": account
				}], function(error, contact) {
					if (!error && contact.length) {
						contact = contact[0];
						Lm.GetAccountError(contact.accountRS, function(response) {
							if (response.noPublicKey) {
								modal.find(".recipient_public_key").show();
							} else {
								modal.find("input[name=recipientPublicKey]").val("");
								modal.find(".recipient_public_key").hide();
							}
							if (response.account && response.account.description) {
								CheckForMerchant(response.account.description, modal);
							}

							callout.removeClass(classes).addClass("callout-" + response.type).html($.t("contact_account_link", {
								"account_id": Lm.GetAccountFormatted(contact, "account")
							}) + " " + response.message.escapeHTML()).show();

							if (response.type == "info" || response.type == "warning") {
								accountInputField.val(contact.accountRS);
							}
						});
					} else if (/^[a-z0-9]+$/i.test(account)) {
						Lm.CheckRecipientAlias(account, modal);
					} else {
						callout.removeClass(classes).addClass("callout-danger").html($.t("recipient_malformed")).show();
					}
				});
			} else if (/^[a-z0-9@]+$/i.test(account)) {
				if (account.charAt(0) == '@') {
					account = account.substring(1);
					Lm.CheckRecipientAlias(account, modal);
				}
			} else {
				callout.removeClass(classes).addClass("callout-danger").html($.t("recipient_malformed")).show();
			}
		} else {
			callout.removeClass(classes).addClass("callout-danger").html($.t("error_numeric_ids_not_allowed")).show();
		}
	}

	function CheckRecipientAlias(account, modal) {
		var classes = "callout-info callout-danger callout-warning";
		var callout = modal.find(".account_info").first();
		var accountInputField = modal.find("input[name=converted_account_id]");

		accountInputField.val("");

		Lm.SendRequest("getAlias", {
			"aliasName": account
		}, function(response) {
			if (response.errorCode) {
				callout.removeClass(classes).addClass("callout-danger").html($.t("error_invalid_account_id")).show();
			} else {
				if (response.aliasURI) {
					var alias = String(response.aliasURI);
					var timestamp = response.timestamp;

					var regex_1 = /acct:(.*)@lm/;
					var regex_2 = /nacc:(.*)/;

					var match = alias.match(regex_1);

					if (!match) {
						match = alias.match(regex_2);
					}

					if (match && match[1]) {
						match[1] = String(match[1]).toUpperCase();

						if (/^\d+$/.test(match[1])) {
							var address = new LmAddress();

							if (address.set(match[1])) {
								match[1] = address.toString();
							} else {
								accountInputField.val("");
								callout.html("Invalid account alias.");
							}
						}

						Lm.GetAccountError(match[1], function(response) {
							if (response.noPublicKey) {
								modal.find(".recipient_public_key").show();
							} else {
								modal.find("input[name=recipientPublicKey]").val("");
								modal.find(".recipient_public_key").hide();
							}
							if (response.account && response.account.description) {
								CheckForMerchant(response.account.description, modal);
							}

							accountInputField.val(match[1].escapeHTML());
							callout.html($.t("alias_account_link", {
								"account_id": String(match[1]).escapeHTML()
							}) + ". " + $.t("recipient_unknown_pka") + " " + $.t("alias_last_adjusted", {
								"timestamp": Lm.FormatTimestamp(timestamp)
							})).removeClass(classes).addClass("callout-" + response.type).show();
						});
					} else {
						callout.removeClass(classes).addClass("callout-danger").html($.t("alias_account_no_link") + (!alias ? $.t("error_uri_empty") : $.t("uri_is", {
							"uri": String(alias).escapeHTML()
						}))).show();
					}
				} else if (response.aliasName) {
					callout.removeClass(classes).addClass("callout-danger").html($.t("error_alias_empty_uri")).show();
				} else {
					callout.removeClass(classes).addClass("callout-danger").html(response.errorDescription ? $.t("error") + ": " + String(response.errorDescription).escapeHTML() : $.t("error_alias")).show();
				}
			}
		});
	}

	function CheckForMerchant(accountInfo, modal) {
		var requestType = modal.find("input[name=request_type]").val();

		if (requestType == "sendMoney" || requestType == "transferAsset") {
			if (accountInfo.match(/merchant/i)) {
				modal.find("input[name=merchant_info]").val(accountInfo);
				var checkbox = modal.find("input[name=add_message]");
				if (!checkbox.is(":checked")) {
					checkbox.prop("checked", true).trigger("change");
				}
			}
		}
	}


	$("#send_message_modal, #send_money_modal, #add_contact_modal").on("show.bs.modal", function(e) {
		RecipientSelectorButton_OnClick($(this), e);
	});

	$("#send_money_amount").on("input", function(e) {
		SendMoneyAmount_Input($(this), e);
	});

	$("span.recipient_selector button").on("click", function(e) {
		RecipientSelectorButton_OnClick($(this), e);
	});

	$("span.recipient_selector").on("click", "ul li a", function(e) {
		RecipientSelectorClick($(this), e);
	});


	Lm.AutomaticallyCheckRecipient = AutomaticallyCheckRecipient;
	Lm.Forms.SendMoneyComplete = SendMoneyCompleteForm;
	Lm.SendMoneyShowAccountInformation = SendMoneyShowAccountInformation;
	Lm.GetAccountError = GetAccountError;
	Lm.CorrectAddressMistake = CorrectAddressMistake;
	Lm.CheckRecipient = CheckRecipient;
	Lm.CheckRecipientAlias = CheckRecipientAlias;
	return Lm;
}(Lm || {}, jQuery));