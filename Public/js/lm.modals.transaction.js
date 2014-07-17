var Lm = (function(Lm, $, undefined) {

	function TransactionsTable_OnClick(e, th) {
		e.preventDefault();
		var transactionId = th.data("transaction");
		Lm.ShowTransactionModal(transactionId);
	}

	function ShowTransactionModal(transaction) {
		if (Lm.FetchingModalData) {
			return;
		}

		Lm.fetchingModalData = true;

		$("#transaction_info_output").html("").hide();
		$("#transaction_info_callout").hide();
		$("#transaction_info_table").hide();
		$("#transaction_info_table tbody").empty();

		if (typeof transaction != "object") {
			Lm.SendRequest("getTransaction", {
				"transaction": transaction
			}, function(response, input) {
				response.transaction = input.transaction;
				Lm.ProcessTransactionModalData(response);
			});
		} else {
			Lm.ProcessTransactionModalData(transaction);
		}
	}

	function ProcessTransactionModalData(transaction) {
		var async = false;

		var transactionDetails = $.extend({}, transaction);
		delete transactionDetails.attachment;
		if (transactionDetails.referencedTransaction == "0") {
			delete transactionDetails.referencedTransaction;
		}
		delete transactionDetails.transaction;

		$("#transaction_info_modal_transaction").html(String(transaction.transaction).escapeHTML());

		$("#transaction_info_tab_link").tab("show");

		$("#transaction_info_details_table tbody").empty().append(Lm.CreateInfoTable(transactionDetails, true))
		$("#transaction_info_table tbody").empty();

		var incorrect = false;

		if (transaction.type == 0) {
			switch (transaction.subtype) {
				case 0:
					var data = {
						"Type": "Ordinary Payment",
						"Amount": transaction.AmountMilliLm,
						"Fee": transaction.FeeMilliLm,
						"Recipient": Lm.GetAccountTitle(transaction, "recipient"),
						"Sender": Lm.GetAccountTitle(transaction, "sender")
					};

					$("#transaction_info_table tbody").append(Lm.CreateInfoTable(data));
					$("#transaction_info_table").show();

					break;
				default:
					incorrect = true;
					break;
			}
		}
		if (transaction.type == 1) {
			switch (transaction.subtype) {
				case 0:
					var hex = transaction.attachment.message;

					//password: return {"requestType": "sendMessage", "data": data};

					var message;

					if (hex.indexOf("4352595054454421") === 0) { //starts with CRYPTED!
						Lm.SendRequest("getAccountPublicKey", {
							"account": (transaction.recipient == Lm.Account ? transaction.sender : transaction.recipient)
						}, function(response) {
							if (!response.publicKey) {
								$.growl("Could not find public key for recipient, which is necessary for sending encrypted messages.", {
									"type": "danger"
								});
							}

							message = Lm.DecryptMessage("return {\"requestType\": \"sendMessage\", \"data\": data};", response.publicKey, hex);
						}, false);
					} else {
						try {
							message = converters.hexStringToString(hex);
						} catch (err) {
							message = "Could not convert hex to string: " + hex;
						}
					}

					var sender_info = "";

					if (transaction.sender == Lm.Account || transaction.recipient == Lm.Account) {
						if (transaction.sender == Lm.Account) {
							sender_info = "<strong>To</strong>: " + Lm.GetAccountTitle(transaction, "recipient");
						} else {
							sender_info = "<strong>From</strong>: " + Lm.GetAccountTitle(transaction, "sender");
						}
					} else {
						sender_info = "<strong>To</strong>: " + Lm.GetAccountTitle(transaction, "recipient") + "<br />";
						sender_info += "<strong>From</strong>: " + Lm.GetAccountTitle(transaction, "sender");
					}

					$("#transaction_info_output").html(message.escapeHTML().nl2br() + "<br /><br />" + sender_info).show();
					break;
				case 1:
					var data = {
						"Type": "Alias Assignment",
						"Alias": transaction.attachment.alias,
						"DataFormattedHTML": transaction.attachment.uri.autoLink()
					};

					if (transaction.sender != Lm.Account) {
						data["Sender"] = Lm.GetAccountTitle(transaction, "sender");
					}

					$("#transaction_info_table tbody").append(Lm.CreateInfoTable(data));
					$("#transaction_info_table").show();

					break;
				case 2:
					var data = {
						"Type": "Poll Creation",
						"Name": transaction.attachment.name,
						"Description": transaction.attachment.description
					};

					if (transaction.sender != Lm.Account) {
						data["Sender"] = Lm.GetAccountTitle(transaction, "sender");
					}

					$("#transaction_info_table tbody").append(Lm.CreateInfoTable(data));
					$("#transaction_info_table").show();

					break;
				case 3:
					var data = {
						"Type": "Vote Casting"
					};

					if (transaction.sender != Lm.Account) {
						data["Sender"] = Lm.GetAccountTitle(transaction, "sender");
					}

					$("#transaction_info_table tbody").append(Lm.CreateInfoTable(data));
					$("#transaction_info_table").show();

					break;
				case 4:
					var data = {
						"Type": "Hub Announcement"
					};

					$("#transaction_info_table tbody").append(Lm.CreateInfoTable(data));
					$("#transaction_info_table").show();

					break;
				case 5:
					var data = {
						"Type": "Account Info",
						"Name": transaction.attachment.name,
						"Description": transaction.attachment.description
					};

					$("#transaction_info_table tbody").append(Lm.CreateInfoTable(data));
					$("#transaction_info_table").show();

					break;
				default:
					incorrect = true;
					break;
			}
		} else if (transaction.type == 2) {
			switch (transaction.subtype) {
				case 0:
					var data = {
						"Type": "Asset Issuance",
						"Name": transaction.attachment.name,
						"Quantity": [transaction.attachment.quantityQNT, transaction.attachment.decimals],
						"Decimals": transaction.attachment.decimals,
						"Description": transaction.attachment.description
					};

					if (transaction.sender != Lm.Account) {
						data["Sender"] = Lm.GetAccountTitle(transaction, "sender");
					}

					$("#transaction_info_callout").html("<a href='#' data-goto-asset='" + String(transaction.transaction).escapeHTML() + "'>Click here</a> "+
						"to view this asset in the Asset Exchange.").show();

					$("#transaction_info_table tbody").append(Lm.CreateInfoTable(data));
					$("#transaction_info_table").show();

					break;
				case 1:
					async = true;

					Lm.SendRequest("getAsset", {
						"asset": transaction.attachment.asset
					}, function(asset, input) {
						var data = {
							"Type": "Asset Transfer",
							"Asset Name": asset.name,
							"Quantity": [transaction.attachment.quantityQNT, asset.decimals],
							"Comment": transaction.attachment.comment
						};

						data["Sender"] = Lm.GetAccountTitle(transaction, "sender");
						data["Recipient"] = Lm.GetAccountTitle(transaction, "recipient");

						$("#transaction_info_table tbody").append(Lm.CreateInfoTable(data));
						$("#transaction_info_table").show();

						$("#transaction_info_modal").modal("show");
						Lm.FetchingModalData = false;
					});

					break;
				case 2:
					async = true;

					Lm.SendRequest("getAsset", {
						"asset": transaction.attachment.asset
					}, function(asset, input) {
						var data = {
							"Type": "Ask Order Placement",
							"Asset Name": asset.name,
							"Quantity": [transaction.attachment.quantityQNT, asset.decimals],
							"Price": transaction.attachment.PriceMilliLm,
							"Total": Lm.CalculateOrderTotalMilliLm(transaction.Attachment.QuantityQNT, transaction.Attachment.PriceMilliLm, asset.decimals)
						};

						if (transaction.sender != Lm.Account) {
							data["Sender"] = Lm.GetAccountTitle(transaction, "sender");
						}

						$("#transaction_info_table tbody").append(Lm.CreateInfoTable(data));
						$("#transaction_info_table").show();

						$("#transaction_info_modal").modal("show");
						Lm.FetchingModalData = false;
					});

					break;
				case 3:
					async = true;

					Lm.SendRequest("getAsset", {
						"asset": transaction.attachment.asset
					}, function(asset, input) {
						var data = {
							"Type": "Bid Order Placement",
							"Asset Name": asset.name,
							"Quantity": [transaction.attachment.quantityQNT, asset.decimals],
							"Price": transaction.Attachment.PriceMilliLm,
							"Total": Lm.CalculateOrderTotalMilliLm(transaction.Attachment.QuantityQNT, transaction.Attachment.PriceMilliLm, asset.decimals)
						};

						if (transaction.sender != Lm.Account) {
							data["Sender"] = Lm.GetAccountTitle(transaction, "sender");
						}

						$("#transaction_info_table tbody").append(Lm.CreateInfoTable(data));
						$("#transaction_info_table").show();

						$("#transaction_info_modal").modal("show");
						Lm.FetchingModalData = false;
					});

					break;
				case 4:
					async = true;

					Lm.SendRequest("getTransaction", {
						"transaction": transaction.attachment.order
					}, function(transaction, input) {
						if (transaction.attachment.asset) {
							Lm.SendRequest("getAsset", {
								"asset": transaction.attachment.asset
							}, function(asset) {
								var data = {
									"Type": "Ask Order Cancellation",
									"Asset Name": asset.name,
									"Quantity": [transaction.Attachment.QuantityQNT, asset.decimals],
									"Price": transaction.Attachment.PriceMilliLm,
									"Total": Lm.CalculateOrderTotalMilliLm(transaction.Attachment.QuantityQNT, transaction.Attachment.PriceMilliLm, asset.decimals)
								};

								if (transaction.sender != Lm.Account) {
									data["Sender"] = Lm.GetAccountTitle(transaction, "sender");
								}

								$("#transaction_info_table tbody").append(Lm.createInfoTable(data));
								$("#transaction_info_table").show();

								$("#transaction_info_modal").modal("show");
								Lm.FetchingModalData = false;
							});
						} else {
							Lm.FetchingModalData = false;
						}
					});

					break;
				case 5:
					async = true;

					Lm.SendRequest("getTransaction", {
						"transaction": transaction.attachment.order
					}, function(transaction) {
						if (transaction.attachment.asset) {
							Lm.SendRequest("getAsset", {
								"asset": transaction.attachment.asset
							}, function(asset) {
								var data = {
									"Type": "Bid Order Cancellation",
									"Asset Name": asset.name,
									"Quantity": [transaction.Attachment.QuantityQNT, asset.decimals],
									"Price": transaction.Attachment.PriceMilliLm,
									"Total": Lm.CalculateOrderTotalMilliLm(transaction.Attachment.QuantityQNT, transaction.Attachment.PriceMilliLm, asset.decimals),
								};

								if (transaction.sender != Lm.Account) {
									data["Sender"] = Lm.GetAccountTitle(transaction, "sender");
								}

								$("#transaction_info_table tbody").append(Lm.CreateInfoTable(data));
								$("#transaction_info_table").show();

								$("#transaction_info_modal").modal("show");
								Lm.FetchingModalData = false;
							});
						} else {
							Lm.FetchingModalData = false;
						}
					});

					break;
				default:
					incorrect = true;
					break;
			}
		} else if (transaction.type == 4) {
			switch (transaction.subtype) {
				case 0:
					var data = {
						"Type": "Balance Leasing",
						"Period": transaction.attachment.period
					};

					$("#transaction_info_table tbody").append(Lm.CreateInfoTable(data));
					$("#transaction_info_table").show();

					break;

				default:
					incorrect = true;
					break;
			}
		}

		if (incorrect) {
			Lm.FetchingModalData = false;
			return;
		}

		if (!async) {
			$("#transaction_info_modal").modal("show");
			Lm.FetchingModalData = false;
		}
	}


	$("#transactions_table, #dashboard_transactions_table").on("click", "a[data-transaction]", function(e) {
		TransactionsTable_OnClick(e, $(this));
	});


	Lm.ShowTransactionModal = ShowTransactionModal;
	Lm.ProcessTransactionModalData = ProcessTransactionModalData;
	return Lm;
}(Lm || {}, jQuery));