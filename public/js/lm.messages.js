var Lm = (function(Lm, $, undefined) {
	Lm.Messages = {};


	function MessagesPage(callback) {
		Lm.PageLoading();

		$(".content.content-stretch:visible").width($(".page:visible").width());

		Lm.SendRequest("getAccountTransactionIds+", {
			"account": Lm.Account,
			"timestamp": 0,
			"type": 1,
			"subtype": 0
		}, function(response) {
			if (response.transactionIds && response.transactionIds.length) {
				var transactionIds = response.transactionIds.reverse().slice(0, 100);
				var nrTransactions = transactionIds.length;

				Lm.Messages = {};

				var transactionsChecked = 0;

				for (var i = 0; i < nrTransactions; i++) {
					Lm.SendRequest("getTransaction+", {
						"transaction": transactionIds[i]
					}, function(response) {
						//check if error.

						if (Lm.CurrentPage != "messages") {
							return;
						}

						transactionsChecked++;

						var otherUser = (response.recipient == Lm.Account ? response.sender : response.recipient);

						if (!(otherUser in Lm.Messages)) {
							Lm.Messages[otherUser] = [];
						}

						Lm.Messages[otherUser].push(response);

						if (transactionsChecked == nrTransactions) {
							var rows = "";
							var menu = "";

							var sortedMessages = [];

							for (var otherUser in Lm.Messages) {
								Lm.Messages[otherUser].sort(function(a, b) {
									if (a.timestamp > b.timestamp) {
										return 1;
									} else if (a.timestamp < b.timestamp) {
										return -1;
									} else {
										return 0;
									}
								});

								var otherUserRS = (otherUser == Lm.Messages[otherUser][0].sender ? Lm.Messages[otherUser][0].senderRS :
									Lm.Messages[otherUser][0].recipientRS);

								sortedMessages.push({
									"timestamp": Lm.Messages[otherUser][Lm.Messages[otherUser].length - 1].timestamp,
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
									extra = " data-contact='" + Lm.GetAccountTitle(sortedMessage, "user") +
										"' data-context='messages_sidebar_update_context'";
								}

								rows += "<a href='#' class='list-group-item' data-account='" + Lm.GetAccountFormatted(sortedMessage, "user") +
									"' data-account-id='" + Lm.GetAccountFormatted(sortedMessage.user) + "'" + extra + ">"+
									"<h4 class='list-group-item-heading'>" + Lm.GetAccountTitle(sortedMessage, "user") + "</h4>"+
									"<p class='list-group-item-text'>" + Lm.FormatTimestamp(sortedMessage.timestamp) + "</p></a>";
							}

							$("#messages_sidebar").empty().append(rows);

							Lm.PageLoaded(callback);
						}
					});

					if (Lm.CurrentPage != "messages") {
						return;
					}
				}
			} else {
				$("#no_message_selected").hide();
				$("#no_messages_available").show();
				$("#messages_sidebar").empty();
				Lm.PageLoaded(callback);
			}
		});
	}

	function IncomingMessages(transactions) {
		if (transactions || Lm.UnconfirmedTransactionsChange || Lm.State.isScanning) {
			//save current scrollTop    	
			var activeAccount = $("#messages_sidebar a.active");

			if (activeAccount.length) {
				activeAccount = activeAccount.data("account");
			} else {
				activeAccount = -1;
			}

			Lm.Pages.Messages(function() {
				$("#messages_sidebar a[data-account=" + activeAccount + "]").trigger("click");
			});
		}
	}

	function MessagesSidebar_OnClick(event, th) {
		event.preventDefault();

		$("#messages_sidebar a.active").removeClass("active");
		th.addClass("active");

		var otherUser = th.data("account-id");

		$("#no_message_selected, #no_messages_available").hide();

		$("#inline_message_recipient").val(otherUser);
		$("#inline_message_form").show();

		var last_day = "";
		var output = "<dl class='chat'>";

		var messages = Lm.Messages[otherUser];

		var otherUserPublicKey = null;

		if (messages) {
			for (var i = 0; i < messages.length; i++) {
				var hex = messages[i].attachment.message;
				var decoded, extra;

				if (hex.indexOf("4352595054454421") === 0) { //starts with CRYPTED!
					if (!otherUserPublicKey) {
						Lm.SendRequest("getAccountPublicKey", {
							"account": otherUser
						}, function(response) {
							if (!response.publicKey) {
								otherUserPublicKey = -1;
							} else {
								otherUserPublicKey = response.publicKey;
							}
						}, false);
					}

					if (otherUserPublicKey != -1) {
						decoded = Lm.DecryptMessage(sessionStorage.getItem("secret"), otherUserPublicKey, hex);
					}
				} else {
					try {
						decoded = converters.hexStringToString(hex);
					} catch (err) {
						//legacy...
						if (hex.indexOf("feff") === 0) {
							decoded = Lm.ConvertFromHex16(hex);
						} else {
							decoded = Lm.ConvertFromHex8(hex);
						}
					}
				}

				if (decoded) {
					decoded = decoded.escapeHTML().nl2br();
				} else {
					decoded = "<i class='fa fa-warning'></i> Could not decrypt message.";
					extra = "decryption_failed";

				}

				var day = Lm.FormatTimestamp(messages[i].timestamp, true);

				if (day != last_day) {
					output += "<dt><strong>" + day + "</strong></dt>";
					last_day = day;
				}

				output += "<dd class='" + (messages[i].recipient == Lm.Account ? "from" : "to") + "'><p class='" + extra + "'>" + decoded + "</p></dd>";
			}
		}

		if (Lm.UnconfirmedTransactions.length) {
			for (var i = 0; i < Lm.UnconfirmedTransactions.length; i++) {
				var unconfirmedTransaction = Lm.UnconfirmedTransactions[i];

				if (unconfirmedTransaction.type == 1 && unconfirmedTransaction.subtype == 0 && unconfirmedTransaction.recipient == otherUser) {
					var hex = unconfirmedTransaction.attachment.message;
					if (hex.indexOf("feff") === 0) {
						var decoded = Lm.ConvertFromHex16(hex);
					} else {
						var decoded = Lm.ConvertFromHex8(hex);
					}

					output += "<dd class='to tentative'><p>" + decoded.escapeHTML().nl2br() + "</p></dd>";
				}
			}
		}

		output += "</dl>";

		$("#message_details").empty().append(output);
	}

	function MessagesSidebarContext_OnClick(e, th) {
		e.preventDefault();

		var account = Lm.GetAccountFormatted(Lm.SelectedContext.data("account"));
		var option = th.data("option");

		Lm.CloseContextMenu();

		if (option == "add_contact") {
			$("#add_contact_account_id").val(account).trigger("blur");
			$("#add_contact_modal").modal("show");
		} else if (option == "send_nxt") {
			$("#send_money_recipient").val(account).trigger("blur");
			$("#send_money_modal").modal("show");
		} else if (option == "account_info") {
			Lm.ShowAccountModal(account);
		}
	}

	function MessagesSidebarUpdateContext_OnClick(e, th) {
		e.preventDefault();

		var account = Lm.GetAccountFormatted(Lm.SelectedContext.data("account"));
		var option = th.data("option");

		Lm.CloseContextMenu();

		if (option == "update_contact") {
			$("#update_contact_modal").modal("show");
		} else if (option == "send_nxt") {
			$("#send_money_recipient").val(Lm.SelectedContext.data("contact")).trigger("blur");
			$("#send_money_modal").modal("show");
		}
	}

	function EncryptMessage(secretPhrase, publicKey, message) {
		try {
			var privateKey = converters.hexStringToByteArray(nxtCrypto.getPrivateKey(secretPhrase));
			var publicKey = converters.hexStringToByteArray(publicKey);

			var messageBytes = converters.stringToByteArray(message);

			var xored = new XoredData().encrypt(messageBytes, privateKey, publicKey);

			return converters.stringToHexString("CRYPTED!") + converters.byteArrayToHexString(xored.nonce) + converters.byteArrayToHexString(xored.data);
		} catch (e) {
			return null;
		}
	}

	function DecryptMessage(secretPhrase, publicKey, message) {
		if (typeof secretPhrase == "string") {
			var privateKey = converters.hexStringToByteArray(nxtCrypto.getPrivateKey(secretPhrase));
		} else {
			var privateKey = secretPhrase;
		}
		if (typeof publicKey == "string") {
			publicKey = converters.hexStringToByteArray(publicKey);
		}

		if (message.indexOf("4352595054454421") === 0) { //starts with CRYPTED!
			try {
				var xored = new XoredData();

				var byteArray = converters.hexStringToByteArray(message);

				xored.nonce = byteArray.slice(8, 40);
				xored.data = byteArray.slice(40);

				var decrypt = xored.decrypt(privateKey, publicKey);

				return converters.byteArrayToString(decrypt);
			} catch (e) {
				return null;
			}
		} else {
			return message;
		}
	}

	function SendMessageForm($modal) {
		var data = {
			"recipient": $.trim($("#send_message_recipient").val()),
			"feeNXT": $.trim($("#send_message_fee").val()),
			"deadline": $.trim($("#send_message_deadline").val()),
			"secretPhrase": $.trim($("#send_message_password").val())
		};

		var message = $.trim($("#send_message_message").val());

		if (!message) {
			return {
				"error": "Message is a required field."
			};
		}

		var hex = "";
		var error = "";

		if ($("#send_message_encrypt").is(":checked")) {
			Lm.SendRequest("getAccountPublicKey", {
				"account": $("#send_message_recipient").val()
			}, function(response) {
				if (!response.publicKey) {
					error = "Could not find public key for recipient, which is necessary for sending encrypted messages.";
					return;
				}

				hex = Lm.EncryptMessage(Lm.RememberPassword ? sessionStorage.getItem("secret") : data.secretPhrase, response.publicKey, message);
			}, false);
		} else {
			hex = converters.stringToHexString("") + converters.stringToHexString(message);
		}

		data["_extra"] = {
			"message": message
		};
		data["message"] = hex;

		if (error) {
			return {
				"error": error
			};
		}

		return {
			"requestType": "sendMessage",
			"data": data
		};
	}

	function InlineMessageForm_OnSubmit(e) {
		e.preventDefault();

		var data = {
			"recipient": $.trim($("#inline_message_recipient").val()),
			"feeNXT": "1",
			"deadline": "1440",
			"secretPhrase": $.trim($("#inline_message_password").val())
		};

		if (!Lm.RememberPassword) {
			if ($("#inline_message_password").val() == "") {
				$.growl("Secret phrase is a required field.", {
					"type": "danger"
				});
				return;
			}

			var accountId = Lm.GenerateAccountId(data.secretPhrase);

			if (accountId != Lm.Account) {
				$.growl("Incorrect secret phrase.", {
					"type": "danger"
				});
				return;
			}
		}

		var message = $.trim($("#inline_message_text").val());

		if (!message) {
			$.growl("Message is a required field.", {
				"type": "danger"
			});
			return;
		}

		var $btn = $("#inline_message_submit");

		$btn.button("loading");

		var hex = "";
		var error = "";

		if ($("#inline_message_encrypt").is(":checked")) {
			Lm.SendRequest("getAccountPublicKey", {
				"account": $("#inline_message_recipient").val()
			}, function(response) {
				if (!response.publicKey) {
					$.growl("Could not find public key for recipient, which is necessary for sending encrypted messages.", {
						"type": "danger"
					});
				}

				hex = Lm.EncryptMessage(Lm.RememberPassword ? sessionStorage.getItem("secret") : data.secretPhrase, response.publicKey, message);
			}, false);
		} else {
			hex = converters.stringToHexString("") + converters.stringToHexString(message); //todo
		}

		data["_extra"] = {
			"message": message
		};
		data["message"] = hex;

		Lm.SendRequest("sendMessage", data, function(response, input) {
			if (response.errorCode) {
				$.growl(response.errorDescription ? response.errorDescription.escapeHTML() : "Unknown error occured.", {
					type: "danger"
				});
			} else if (response.fullHash) {
				$.growl("Message sent.", {
					type: "success"
				});

				$("#inline_message_text").val("");

				Lm.AddUnconfirmedTransaction(response.transaction, function(alreadyProcessed) {
					if (!alreadyProcessed) {
						$("#message_details dl.chat").append("<dd class='to tentative'><p>" + data["_extra"].message.escapeHTML() + "</p></dd>");
					}
				});

				//leave password alone until user moves to another page.
			} else {
				$.growl("An unknown error occured. Your message may or may not have been sent.", {
					type: "danger"
				});
			}
			$btn.button("reset");
		});
	}

	function SendMessageCompleteForm(response, data) {
		data.message = data._extra.message;

		if (!(data["_extra"] && data["_extra"].convertedAccount)) {
			$.growl("Your message has been sent! <a href='#' data-account='" + Lm.GetAccountFormatted(data, "recipient") +
					"' data-toggle='modal' data-target='#add_contact_modal' style='text-decoration:underline'>Add recipient to contacts?</a>", {
				"type": "success"
			});
		} else {
			$.growl("Your message has been sent!", {
				"type": "success"
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

				if ($existing.hasClass("active")) {
					$("#message_details dl.chat").append("<dd class='to tentative'><p>" + data.message.escapeHTML() + "</p></dd>");
				}
			} else {
				var accountTitle = Lm.GetAccountTitle(data, "recipient");

				var extra = "";

				if (accountTitle != data.recipient) {
					extra = " data-context='messages_sidebar_update_context'";
				}

				var listGroupItem = "<a href='#' class='list-group-item' data-account='" + Lm.GetAccountFormatted(data, "recipient") + "'" + extra + ">"+
					"<h4 class='list-group-item-heading'>" + accountTitle + "</h4><p class='list-group-item-text'>" + Lm.FormatTimestamp(now) + "</p></a>";
				$("#messages_sidebar").prepend(listGroupItem);
			}
		}
	}


	$("#messages_sidebar").on("click", "a", function(event) {
		MessagesSidebar_OnClick(event, $(this));
	});

	$("#messages_sidebar_context").on("click", "a", function(e) {
		MessagesSidebarContext_OnClick(e, $(this));
	});

	$("#messages_sidebar_update_context").on("click", "a", function(e) {
		MessagesSidebarUpdateContext_OnClick(e, $(this));
	});

	$("#inline_message_form").submit(function(e) {
		InlineMessageForm_OnSubmit(e);
	});


	Lm.Pages.Messages = MessagesPage;
	Lm.Incoming.Messages = IncomingMessages;
	Lm.EncryptMessage = EncryptMessage;
	Lm.DecryptMessage = DecryptMessage;
	Lm.Forms.SendMessage = SendMessageForm;
	Lm.Forms.SendMessageComplete = SendMessageCompleteForm;
	return Lm;
}(Lm || {}, jQuery));