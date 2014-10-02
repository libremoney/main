/**
 * @depends {lm.js}
 */
var Lm = (function(Lm, $, undefined) {
	var _messages = {};

	function MessagesPage(callback) {
		_messages = {};

		$(".content.content-stretch:visible").width($(".page:visible").width());

		Lm.SendRequest("getAccountTransactions+", {
			"account": Lm.Account,
			"firstIndex": 0,
			"lastIndex": 75,
			"type": 1,
			"subtype": 0
		}, function(response) {
			if (response.transactions && response.transactions.length) {
				for (var i = 0; i < response.transactions.length; i++) {
					var otherUser = (response.transactions[i].recipient == Lm.Account ? response.transactions[i].sender : response.transactions[i].recipient);

					if (!(otherUser in _messages)) {
						_messages[otherUser] = [];
					}

					_messages[otherUser].push(response.transactions[i]);
				}

				DisplayMessageSidebar(callback);
			} else {
				$("#no_message_selected").hide();
				$("#no_messages_available").show();
				$("#messages_sidebar").empty();
				Lm.PageLoaded(callback);
			}
		});
	}

	function DisplayMessageSidebar(callback) {
		var activeAccount = false;

		var $active = $("#messages_sidebar a.active");

		if ($active.length) {
			activeAccount = $active.data("account");
		}

		var rows = "";
		var menu = "";

		var sortedMessages = [];

		for (var otherUser in _messages) {
			_messages[otherUser].sort(function(a, b) {
				if (a.timestamp > b.timestamp) {
					return 1;
				} else if (a.timestamp < b.timestamp) {
					return -1;
				} else {
					return 0;
				}
			});

			var otherUserRS = (otherUser == _messages[otherUser][0].sender ? _messages[otherUser][0].senderRS : _messages[otherUser][0].recipientRS);

			sortedMessages.push({
				"timestamp": _messages[otherUser][_messages[otherUser].length - 1].timestamp,
				"user": otherUser,
				"userRS": otherUserRS
			});
		}

		sortedMessages.sort(function(a, b) {
			if (a.timestamp < b.timestamp) {
				return 1;
			} else if (a.timestamp > b.timestamp) {
				return -1;
			} else {
				return 0;
			}
		});

		for (var i = 0; i < sortedMessages.length; i++) {
			var sortedMessage = sortedMessages[i];

			var extra = "";

			if (sortedMessage.user in Lm.Contacts) {
				extra = " data-contact='" + Lm.GetAccountTitle(sortedMessage, "user") + "' data-context='messages_sidebar_update_context'";
			}

			rows += "<a href='#' class='list-group-item' data-account='" + Lm.GetAccountFormatted(sortedMessage, "user") + "' data-account-id='" +
				Lm.GetAccountFormatted(sortedMessage.user) + "'" + extra + "><h4 class='list-group-item-heading'>" +
				Lm.GetAccountTitle(sortedMessage, "user") + "</h4><p class='list-group-item-text'>" +
				Lm.FormatTimestamp(sortedMessage.timestamp) + "</p></a>";
		}

		$("#messages_sidebar").empty().append(rows);

		if (activeAccount) {
			$("#messages_sidebar a[data-account=" + activeAccount + "]").addClass("active").trigger("click");
		}

		Lm.PageLoaded(callback);
	}

	function MessagesIncoming(transactions) {
		if (Lm.HasTransactionUpdates(transactions)) {
			//save current scrollTop    	
			var activeAccount = $("#messages_sidebar a.active");

			if (activeAccount.length) {
				activeAccount = activeAccount.data("account");
			} else {
				activeAccount = -1;
			}

			Lm.LoadPage("messages");
		}
	}

	function MessagesSidebar_OnClick(th, e) {
		e.preventDefault();

		$("#messages_sidebar a.active").removeClass("active");
		th.addClass("active");

		var otherUser = th.data("account-id");

		$("#no_message_selected, #no_messages_available").hide();

		$("#inline_message_recipient").val(otherUser);
		$("#inline_message_form").show();

		var last_day = "";
		var output = "<dl class='chat'>";

		var messages = _messages[otherUser];

		var sharedKey = null;

		if (messages) {
			for (var i = 0; i < messages.length; i++) {
				var decoded = false;
				var extra = "";
				var type = "";

				if (!messages[i].attachment) {
					decoded = $.t("message_empty");
				} else if (messages[i].attachment.encryptedMessage) {
					try {
						decoded = Lm.TryToDecryptMessage(messages[i]);
						extra = "decrypted";
					} catch (err) {
						if (err.errorCode && err.errorCode == 1) {
							decoded = $.t("error_decryption_passphrase_required");
							extra = "to_decrypt";
						} else {
							decoded = $.t("error_decryption_unknown");
						}
					}
				} else {
					if (!messages[i].attachment["version.Message"]) {
						try {
							decoded = Convert.HexStringToString(messages[i].attachment.message);
						} catch (err) {
							//legacy
							if (messages[i].attachment.message.indexOf("feff") === 0) {
								decoded = Lm.ConvertFromHex16(messages[i].attachment.message);
							} else {
								decoded = Lm.ConvertFromHex8(messages[i].attachment.message);
							}
						}
					} else {
						decoded = String(messages[i].attachment.message);
					}
				}

				if (decoded !== false) {
					if (!decoded) {
						decoded = $.t("message_empty");
					}
					decoded = String(decoded).escapeHTML().nl2br();

					if (extra == "to_decrypt") {
						decoded = "<i class='fa fa-warning'></i> " + decoded;
					} else if (extra == "decrypted") {
						if (type == "payment") {
							decoded = "<strong>+" + Lm.FormatAmount(messages[i].amountMilliLm) + " Lm</strong><br />" + decoded;
						}

						decoded = "<i class='fa fa-lock'></i> " + decoded;
					}
				} else {
					decoded = "<i class='fa fa-warning'></i> " + $.t("error_could_not_decrypt_message");
					extra = "decryption_failed";
				}

				var day = Lm.FormatTimestamp(messages[i].timestamp, true);

				if (day != last_day) {
					output += "<dt><strong>" + day + "</strong></dt>";
					last_day = day;
				}

				output += "<dd class='" + (messages[i].recipient == Lm.Account ? "from" : "to") + (extra ? " " + extra : "") + "'><p>" + decoded + "</p></dd>";
			}
		}

		var unconfirmedTransactions = Lm.GetUnconfirmedTransactionsFromCache(1, 0, {
			"recipient": otherUser
		});

		if (!unconfirmedTransactions) {
			unconfirmedTransactions = [];
		} else {
			unconfirmedTransactions = unconfirmedTransactions.reverse();
		}

		for (var i = 0; i < unconfirmedTransactions.length; i++) {
			var unconfirmedTransaction = unconfirmedTransactions[i];

			var decoded = false;
			var extra = "";

			if (!unconfirmedTransaction.attachment) {
				decoded = $.t("message_empty");
			} else if (unconfirmedTransaction.attachment.encryptedMessage) {
				try {
					decoded = Lm.TryToDecryptMessage(unconfirmedTransaction);
					extra = "decrypted";
				} catch (err) {
					if (err.errorCode && err.errorCode == 1) {
						decoded = $.t("error_decryption_passphrase_required");
						extra = "to_decrypt";
					} else {
						decoded = $.t("error_decryption_unknown");
					}
				}
			} else {
				if (!unconfirmedTransaction.attachment["version.Message"]) {
					try {
						decoded = Convert.HexStringToString(unconfirmedTransaction.attachment.message);
					} catch (err) {
						//legacy
						if (unconfirmedTransaction.attachment.message.indexOf("feff") === 0) {
							decoded = Lm.ConvertFromHex16(unconfirmedTransaction.attachment.message);
						} else {
							decoded = Lm.ConvertFromHex8(unconfirmedTransaction.attachment.message);
						}
					}
				} else {
					decoded = String(unconfirmedTransaction.attachment.message);
				}
			}

			if (decoded === false) {
				decoded = "<i class='fa fa-warning'></i> " + $.t("error_could_not_decrypt_message");
				extra = "decryption_failed";
			} else if (!decoded) {
				decoded = $.t("message_empty");
			}

			output += "<dd class='to tentative" + (extra ? " " + extra : "") + "'><p>" + (extra == "to_decrypt" ? "<i class='fa fa-warning'></i> " : (extra == "decrypted" ? "<i class='fa fa-lock'></i> " : "")) + String(decoded).escapeHTML().nl2br() + "</p></dd>";
		}

		output += "</dl>";

		$("#message_details").empty().append(output);
	}

	function MessagesSidebarContext_OnClick(th, e) {
		e.preventDefault();

		var account = Lm.GetAccountFormatted(Lm.SelectedContext.data("account"));
		var option = th.data("option");

		Lm.CloseContextMenu();

		if (option == "add_contact") {
			$("#add_contact_account_id").val(account).trigger("blur");
			$("#add_contact_modal").modal("show");
		} else if (option == "send_lm") {
			$("#send_money_recipient").val(account).trigger("blur");
			$("#send_money_modal").modal("show");
		} else if (option == "account_info") {
			Lm.ShowAccountModal(account);
		}
	}

	function MessagesSidebarUpdateContext_OnClick(th, e) {
		e.preventDefault();

		var account = Lm.GetAccountFormatted(Lm.SelectedContext.data("account"));
		var option = th.data("option");

		Lm.CloseContextMenu();

		if (option == "update_contact") {
			$("#update_contact_modal").modal("show");
		} else if (option == "send_lm") {
			$("#send_money_recipient").val(Lm.SelectedContext.data("contact")).trigger("blur");
			$("#send_money_modal").modal("show");
		}
	}

	function SendMessageForm($modal) {
		var data = Lm.GetFormData($modal.find("form:first"));

		var converted = $modal.find("input[name=converted_account_id]").val();

		if (converted) {
			data.recipient = converted;
		}

		var message = $.trim(data.message);

		return {
			"data": data
		};
	}

	function InlineMessageForm_OnSubmit(e) {
		e.preventDefault();

		var data = {
			"recipient": $.trim($("#inline_message_recipient").val()),
			"feeLm": "1",
			"deadline": "1440",
			"secretPhrase": $.trim($("#inline_message_password").val())
		};

		if (!Lm.RememberPassword) {
			if ($("#inline_message_password").val() == "") {
				$.growl($.t("error_passphrase_required"), {
					"type": "danger"
				});
				return;
			}

			var accountId = Lm.GetAccountId(data.secretPhrase);

			if (accountId != Lm.Account) {
				$.growl($.t("error_passphrase_incorrect"), {
					"type": "danger"
				});
				return;
			}
		}

		data.message = $.trim($("#inline_message_text").val());

		var $btn = $("#inline_message_submit");

		$btn.button("loading");

		var requestType = "sendMessage";

		if ($("#inline_message_encrypt").is(":checked")) {
			data.encrypt_message = true;
		}

		if (data.message) {
			try {
				data = Lm.AddMessageData(data, "sendMessage");
			} catch (err) {
				$.growl(String(err.message).escapeHTMl(), {
					"type": "danger"
				});
				return;
			}
		} else {
			data["_extra"] = {
				"message": data.message
			};
		}

		Lm.SendRequest(requestType, data, function(response, input) {
			if (response.errorCode) {
				$.growl(Lm.TranslateServerError(response).escapeHTML(), {
					type: "danger"
				});
			} else if (response.fullHash) {
				$.growl($.t("success_message_sent"), {
					type: "success"
				});

				$("#inline_message_text").val("");

				if (data["_extra"].message && data.encryptedMessageData) {
					Lm.AddDecryptedTransaction(response.transaction, {
						"encryptedMessage": String(data["_extra"].message)
					});
				}

				Lm.AddUnconfirmedTransaction(response.transaction, function(alreadyProcessed) {
					if (!alreadyProcessed) {
						$("#message_details dl.chat").append("<dd class='to tentative" + (data.encryptedMessageData ? " decrypted" : "") + "'><p>" + (data.encryptedMessageData ? "<i class='fa fa-lock'></i> " : "") + (!data["_extra"].message ? $.t("message_empty") : String(data["_extra"].message).escapeHTML()) + "</p></dd>");
					}
				});

				//leave password alone until user moves to another page.
			} else {
				//TODO
				$.growl($.t("error_send_message"), {
					type: "danger"
				});
			}
			$btn.button("reset");
		});
	}

	function SendMessageCompleteForm(response, data) {
		data.message = data._extra.message;

		if (!(data["_extra"] && data["_extra"].convertedAccount)) {
			$.growl($.t("success_message_sent") + " <a href='#' data-account='" + Lm.GetAccountFormatted(data, "recipient") + "' data-toggle='modal' data-target='#add_contact_modal' style='text-decoration:underline'>" + $.t("add_recipient_to_contacts_q") + "</a>", {
				"type": "success"
			});
		} else {
			$.growl($.t("success_message_sent"), {
				"type": "success"
			});
		}

		if (data.message && data.encryptedMessageData) {
			Lm.AddDecryptedTransaction(response.transaction, {
				"encryptedMessage": String(data["_extra"].message)
			});
		}

		if (Lm.CurrentPage == "messages") {
			var date = new Date(Date.UTC(2013, 10, 24, 12, 0, 0, 0)).getTime();

			var now = parseInt(((new Date().getTime()) - date) / 1000, 10);

			var $sidebar = $("#messages_sidebar");

			var $existing = $sidebar.find("a.list-group-item[data-account=" + Lm.GetAccountFormatted(data, "recipient") + "]");

			if ($existing.length) {
				if (response.alreadyProcesed) {
					return;
				}
				$sidebar.prepend($existing);
				$existing.find("p.list-group-item-text").html(Lm.FormatTimestamp(now));

				var isEncrypted = (data.encryptedMessageData ? true : false);

				if ($existing.hasClass("active")) {
					$("#message_details dl.chat").append("<dd class='to tentative" + (isEncrypted ? " decrypted" : "") + "'><p>" + (isEncrypted ? "<i class='fa fa-lock'></i> " : "") + (data.message ? data.message.escapeHTML() : $.t("message_empty")) + "</p></dd>");
				}
			} else {
				var accountTitle = Lm.GetAccountTitle(data, "recipient");

				var extra = "";

				if (accountTitle != data.recipient) {
					extra = " data-context='messages_sidebar_update_context'";
				}

				var listGroupItem = "<a href='#' class='list-group-item' data-account='" +
					Lm.GetAccountFormatted(data, "recipient") + "'" + extra + "><h4 class='list-group-item-heading'>" +
					accountTitle + "</h4><p class='list-group-item-text'>" + Lm.FormatTimestamp(now) + "</p></a>";
				$("#messages_sidebar").prepend(listGroupItem);
			}
		}
	}

	function DecryptMessagesForm($modal) {
		var data = Lm.GetFormData($modal.find("form:first"));

		var success = false;

		try {
			var messagesToDecrypt = [];

			for (var otherUser in _messages) {
				for (var key in _messages[otherUser]) {
					var message = _messages[otherUser][key];

					if (message.attachment && message.attachment.encryptedMessage) {
						messagesToDecrypt.push(message);
					}
				}
			}

			var unconfirmedMessages = Lm.GetUnconfirmedTransactionsFromCache(1, 0);

			if (unconfirmedMessages) {
				for (var i = 0; i < unconfirmedMessages.length; i++) {
					var unconfirmedMessage = unconfirmedMessages[i];

					if (unconfirmedMessage.attachment && unconfirmedMessage.attachment.encryptedMessage) {
						messagesToDecrypt.push(unconfirmedMessage);
					}
				}
			}

			success = Lm.DecryptAllMessages(messagesToDecrypt, data.secretPhrase);
		} catch (err) {
			if (err.errorCode && err.errorCode <= 2) {
				return {
					"error": err.message.escapeHTML()
				};
			} else {
				return {
					"error": $.t("error_messages_decrypt")
				};
			}
		}

		if (data.rememberPassword) {
			Lm.SetDecryptionPassword(data.secretPhrase);
		}

		$("#messages_sidebar a.active").trigger("click");

		if (success) {
			$.growl($.t("success_messages_decrypt"), {
				"type": "success"
			});
		} else {
			$.growl($.t("error_messages_decrypt"), {
				"type": "danger"
			});
		}

		return {
			"stop": true
		};
	}


	$("#messages_sidebar").on("click", "a", function(e) {
		MessagesSidebar_OnClick($(this), e);
	});

	$("#messages_sidebar_context").on("click", "a", function(e) {
		MessagesSidebarContext_OnClick($(this), e);
	});

	$("#messages_sidebar_update_context").on("click", "a", function(e) {
		MessagesSidebarUpdateContext_OnClick($(this), e);
	});

	$("#inline_message_form").submit(function(e) {
		InlineMessageForm_OnSubmit(e);
	});

	$("#message_details").on("click", "dd.to_decrypt", function(e) {
		$("#messages_decrypt_modal").modal("show");
	});


	Lm.Pages.Messages = MessagesPage;
	Lm.Incoming.Messages = MessagesIncoming;
	Lm.Forms.SendMessage = SendMessageForm;
	Lm.Forms.SendMessageComplete = SendMessageCompleteForm;
	Lm.Forms.DecryptMessages = DecryptMessagesForm;
	return Lm;
}(Lm || {}, jQuery));