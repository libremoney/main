/**
 * @depends {lm.js}
 */
var Lm = (function(Lm, $, undefined) {
	Lm.LastTransactions = "";

	Lm.UnconfirmedTransactions = [];
	Lm.UnconfirmedTransactionIds = "";
	Lm.UnconfirmedTransactionsChange = true;

	Lm.TransactionsPageType = null;


	function GetInitialTransactions() {
		Lm.SendRequest("getAccountTransactions", {
			"account": Lm.Account,
			"firstIndex": 0,
			"lastIndex": 9
		}, function(response) {
			if (response.transactions && response.transactions.length) {
				var transactions = [];
				var transactionIds = [];

				for (var i = 0; i < response.transactions.length; i++) {
					var transaction = response.transactions[i];

					transaction.confirmed = true;
					transactions.push(transaction);

					transactionIds.push(transaction.transaction);
				}

				Lm.GetUnconfirmedTransactions(function(unconfirmedTransactions) {
					Lm.HandleInitialTransactions(transactions.concat(unconfirmedTransactions), transactionIds);
				});
			} else {
				Lm.GetUnconfirmedTransactions(function(unconfirmedTransactions) {
					Lm.HandleInitialTransactions(unconfirmedTransactions, []);
				});
			}
		});
	}

	function HandleInitialTransactions(transactions, transactionIds) {
		if (transactions.length) {
			var rows = "";

			transactions.sort(Lm.SortArray);

			if (transactions.length) {
				Lm.LastTransactions = transactionIds.toString();
			}

			for (var i = 0; i < transactions.length; i++) {
				var transaction = transactions[i];

				var receiving = transaction.recipient == Lm.Account;

				var account = (receiving ? "sender" : "recipient");

				if (transaction.amountMilliLm) {
					transaction.amount = new BigInteger(transaction.amountMilliLm);
					transaction.fee = new BigInteger(transaction.feeMilliLm);
				}

				rows += "<tr class='" + (!transaction.confirmed ? "tentative" : "confirmed") + "'>" +
					"<td><a href='#' data-transaction='" + String(transaction.transaction).escapeHTML() + "' data-timestamp='" +
					String(transaction.timestamp).escapeHTML() + "'>" + Lm.FormatTimestamp(transaction.timestamp) + "</a></td>" +
					"<td style='width:5px;padding-right:0;'>" + (transaction.type == 0 ?
						(receiving ? "<i class='fa fa-plus-circle' style='color:#65C62E'></i>" :
							"<i class='fa fa-minus-circle' style='color:#E04434'></i>") : "") + "</td>" +
					"<td><span" + (transaction.type == 0 && receiving ? " style='color:#006400'" :
						(!receiving && transaction.amount > 0 ? " style='color:red'" : "")) + ">" +
					Lm.FormatAmount(transaction.amount) + "</span> " +
					"<span" + ((!receiving && transaction.type == 0) ? " style='color:red'" : "") + ">+</span> " +
					"<span" + (!receiving ? " style='color:red'" : "") + ">" + Lm.FormatAmount(transaction.fee) + "</span></td>" +
					"<td>" + Lm.GetAccountLink(transaction, account) + "</td>" +
					"<td class='confirmations' data-confirmations='" + String(transaction.confirmations).escapeHTML() +
					"' data-content='" + Lm.FormatAmount(transaction.confirmations) + " confirmations' data-container='body' data-initial='true'>" +
					(transaction.confirmations > 10 ? "10+" : String(transaction.confirmations).escapeHTML()) + "</td></tr>";
			}

			$("#dashboard_transactions_table tbody").empty().append(rows);
		}

		Lm.DataLoadFinished($("#dashboard_transactions_table"));
	}

	function GetNewTransactions() {
		Lm.SendRequest("getAccountTransactionIds", {
			"account": Lm.Account,
			"timestamp": Lm.Blocks[0].timestamp + 1,
			"firstIndex": 0,
			"lastIndex": 0
		}, function(response) {
			//if there is, get latest 10 transactions
			if (response.transactionIds && response.transactionIds.length) {
				Lm.SendRequest("getAccountTransactions", {
					"account": Lm.Account,
					"firstIndex": 0,
					"lastIndex": 9
				}, function(response) {
					if (response.transactions && response.transactions.length) {
						var transactionIds = [];

						$.each(response.transactions, function(key, transaction) {
							transactionIds.push(transaction.transaction);
							response.transactions[key].confirmed = true;
						});

						Lm.GetUnconfirmedTransactions(function(unconfirmedTransactions) {
							Lm.HandleIncomingTransactions(response.transactions.concat(unconfirmedTransactions), transactionIds);
						});
					} else {
						Lm.GetUnconfirmedTransactions(function(unconfirmedTransactions) {
							Lm.HandleIncomingTransactions(unconfirmedTransactions);
						});
					}
				});
			} else {
				Lm.GetUnconfirmedTransactions(function(unconfirmedTransactions) {
					Lm.HandleIncomingTransactions(unconfirmedTransactions);
				});
			}
		});
	}

	function GetUnconfirmedTransactions(callback) {
		Lm.SendRequest("getUnconfirmedTransactions", {
			"account": Lm.Account
		}, function(response) {
			if (response.unconfirmedTransactions && response.unconfirmedTransactions.length) {
				var unconfirmedTransactions = [];
				var unconfirmedTransactionIds = [];

				response.unconfirmedTransactions.sort(function(x, y) {
					if (x.timestamp < y.timestamp) {
						return 1;
					} else if (x.timestamp > y.timestamp) {
						return -1;
					} else {
						return 0;
					}
				});

				for (var i = 0; i < response.unconfirmedTransactions.length; i++) {
					var unconfirmedTransaction = response.unconfirmedTransactions[i];

					unconfirmedTransaction.confirmed = false;
					unconfirmedTransaction.unconfirmed = true;
					unconfirmedTransaction.confirmations = "/";

					if (unconfirmedTransaction.attachment) {
						for (var key in unconfirmedTransaction.attachment) {
							if (!unconfirmedTransaction.hasOwnProperty(key)) {
								unconfirmedTransaction[key] = unconfirmedTransaction.attachment[key];
							}
						}
					}

					unconfirmedTransactions.push(unconfirmedTransaction);
					unconfirmedTransactionIds.push(unconfirmedTransaction.transaction);
				}

				Lm.UnconfirmedTransactions = unconfirmedTransactions;

				var unconfirmedTransactionIdString = unconfirmedTransactionIds.toString();

				if (unconfirmedTransactionIdString != Lm.UnconfirmedTransactionIds) {
					Lm.UnconfirmedTransactionsChange = true;
					Lm.UnconfirmedTransactionIds = unconfirmedTransactionIdString;
				} else {
					Lm.UnconfirmedTransactionsChange = false;
				}

				if (callback) {
					callback(unconfirmedTransactions);
				} else if (Lm.UnconfirmedTransactionsChange) {
					Lm.Incoming.UpdateDashboardTransactions(unconfirmedTransactions, true);
				}
			} else {
				Lm.UnconfirmedTransactions = [];

				if (Lm.UnconfirmedTransactionIds) {
					Lm.UnconfirmedTransactionsChange = true;
				} else {
					Lm.UnconfirmedTransactionsChange = false;
				}

				Lm.UnconfirmedTransactionIds = "";

				if (callback) {
					callback([]);
				} else if (Lm.UnconfirmedTransactionsChange) {
					Lm.Incoming.UpdateDashboardTransactions([], true);
				}
			}
		});
	}

	function HandleIncomingTransactions(transactions, confirmedTransactionIds) {
		var oldBlock = (confirmedTransactionIds === false); //we pass false instead of an [] in case there is no new block..

		if (typeof confirmedTransactionIds != "object") {
			confirmedTransactionIds = [];
		}

		if (confirmedTransactionIds.length) {
			Lm.LastTransactions = confirmedTransactionIds.toString();
		}

		if (confirmedTransactionIds.length || Lm.UnconfirmedTransactionsChange) {
			transactions.sort(Lm.SortArray);

			Lm.Incoming.UpdateDashboardTransactions(transactions, confirmedTransactionIds.length == 0);
		}

		//always refresh peers and unconfirmed transactions..
		if (Lm.CurrentPage == "peers") {
			Lm.Incoming.Peers();
		} else if (Lm.CurrentPage == "transactions" && Lm.TransactionsPageType == "unconfirmed") {
			Lm.Incoming.Transactions();
		} else {
			if (!oldBlock || Lm.UnconfirmedTransactionsChange) {
				if (Lm.Incoming[Lm.CurrentPage]) {
					Lm.Incoming[Lm.CurrentPage](transactions);
				}
			}
		}
	}

	function SortArray(a, b) {
		return b.timestamp - a.timestamp;
	}

	function UpdateDashboardTransactionsIncoming(newTransactions, unconfirmed) {
		var newTransactionCount = newTransactions.length;

		if (newTransactionCount) {
			var rows = "";

			var onlyUnconfirmed = true;

			for (var i = 0; i < newTransactionCount; i++) {
				var transaction = newTransactions[i];

				var receiving = transaction.recipient == Lm.Account;
				var account = (receiving ? "sender" : "recipient");

				if (transaction.confirmed) {
					onlyUnconfirmed = false;
				}

				if (transaction.amountMilliLm) {
					transaction.amount = new BigInteger(transaction.amountMilliLm);
					transaction.fee = new BigInteger(transaction.feeMilliLm);
				}

				rows += "<tr class='" + (!transaction.confirmed ? "tentative" : "confirmed") + "'>" +
					"<td><a href='#' data-transaction='" + String(transaction.transaction).escapeHTML() +
					"' data-timestamp='" + String(transaction.timestamp).escapeHTML() + "'>" + Lm.FormatTimestamp(transaction.timestamp) + "</a></td>" +
					"<td style='width:5px;padding-right:0;'>" + (transaction.type == 0 ?
						(receiving ? "<i class='fa fa-plus-circle' style='color:#65C62E'></i>" :
							"<i class='fa fa-minus-circle' style='color:#E04434'></i>") : "") + "</td>" +
					"<td><span" + (transaction.type == 0 && receiving ? " style='color:#006400'" :
						(!receiving && transaction.amount > 0 ? " style='color:red'" : "")) + ">" +
					Lm.FormatAmount(transaction.amount) + "</span> " +
					"<span" + ((!receiving && transaction.type == 0) ? " style='color:red'" : "") + ">+</span> " +
					"<span" + (!receiving ? " style='color:red'" : "") + ">" + Lm.FormatAmount(transaction.fee) + "</span></td>" +
					"<td>" + Lm.GetAccountLink(transaction, account) + "</td>" +
					"<td class='confirmations' data-confirmations='" + String(transaction.confirmations).escapeHTML() +
					"' data-content='" + (transaction.confirmed ? Lm.FormatAmount(transaction.confirmations) + " " +$.t("confirmations") :
						$.t("unconfirmed_transaction")) + "' data-container='body' data-initial='true'>" +
					(transaction.confirmations > 10 ? "10+" : String(transaction.confirmations).escapeHTML()) + "</td></tr>";
			}

			if (onlyUnconfirmed) {
				$("#dashboard_transactions_table tbody tr.tentative").remove();
				$("#dashboard_transactions_table tbody").prepend(rows);
			} else {
				$("#dashboard_transactions_table tbody").empty().append(rows);
			}

			var $parent = $("#dashboard_transactions_table").parent();

			if ($parent.hasClass("data-empty")) {
				$parent.removeClass("data-empty");
				if ($parent.data("no-padding")) {
					$parent.parent().addClass("no-padding");
				}
			}
		} else if (unconfirmed) {
			$("#dashboard_transactions_table tbody tr.tentative").remove();
		}
	}

	//todo: add to dashboard? 
	function AddUnconfirmedTransaction(transactionId, callback) {
		Lm.SendRequest("getTransaction", {
			"transaction": transactionId
		}, function(response) {
			if (!response.errorCode) {
				response.transaction = transactionId;
				response.confirmations = "/";
				response.confirmed = false;
				response.unconfirmed = true;

				if (response.attachment) {
					for (var key in response.attachment) {
						if (!response.hasOwnProperty(key)) {
							response[key] = response.attachment[key];
						}
					}
				}

				var alreadyProcessed = false;

				try {
					var regex = new RegExp("(^|,)" + transactionId + "(,|$)");

					if (regex.exec(Lm.LastTransactions)) {
						alreadyProcessed = true;
					} else {
						$.each(Lm.UnconfirmedTransactions, function(key, unconfirmedTransaction) {
							if (unconfirmedTransaction.transaction == transactionId) {
								alreadyProcessed = true;
								return false;
							}
						});
					}
				} catch (e) {}

				if (!alreadyProcessed) {
					Lm.UnconfirmedTransactions.unshift(response);
				}

				if (callback) {
					callback(alreadyProcessed);
				}

				Lm.Incoming.UpdateDashboardTransactions(Lm.UnconfirmedTransactions, true);

				Lm.GetAccountInfo();
			} else if (callback) {
				callback(false);
			}
		});
	}

	function TransactionsPage() {
		if (Lm.TransactionsPageType == "unconfirmed") {
			Lm.DisplayUnconfirmedTransactions();
			return;
		}

		var rows = "";

		var params = {
			"account": Lm.Account,
			"firstIndex": 0,
			"lastIndex": 100
		};

		if (Lm.TransactionsPageType) {
			params.type = Lm.TransactionsPageType.type;
			params.subtype = Lm.TransactionsPageType.subtype;
			var unconfirmedTransactions = Lm.GetUnconfirmedTransactionsFromCache(params.type, params.subtype);
		} else {
			var unconfirmedTransactions = Lm.UnconfirmedTransactions;
		}

		if (unconfirmedTransactions) {
			for (var i = 0; i < unconfirmedTransactions.length; i++) {
				rows += Lm.GetTransactionRowHTML(unconfirmedTransactions[i]);
			}
		}

		Lm.SendRequest("getAccountTransactions+", params, function(response) {
			if (response.transactions && response.transactions.length) {
				for (var i = 0; i < response.transactions.length; i++) {
					var transaction = response.transactions[i];

					transaction.confirmed = true;

					rows += Lm.GetTransactionRowHTML(transaction);
				}

				Lm.DataLoaded(rows);
			} else {
				Lm.DataLoaded(rows);
			}
		});
	}

	function TransactionsIncoming(transactions) {
		Lm.LoadPage("transactions");
	}

	function DisplayUnconfirmedTransactions() {
		Lm.SendRequest("getUnconfirmedTransactions", function(response) {
			var rows = "";

			if (response.unconfirmedTransactions && response.unconfirmedTransactions.length) {
				for (var i = 0; i < response.unconfirmedTransactions.length; i++) {
					rows += Lm.GetTransactionRowHTML(response.unconfirmedTransactions[i]);
				}
			}

			Lm.DataLoaded(rows);
		});
	}

	function GetTransactionRowHtml(transaction) {
		var transactionType = $.t("unknown");

		if (transaction.type == 0) {
			transactionType = $.t("ordinary_payment");
		} else if (transaction.type == 1) {
			switch (transaction.subtype) {
				case 0:
					transactionType = $.t("arbitrary_message");
					break;
				case 1:
					transactionType = $.t("alias_assignment");
					break;
				case 2:
					transactionType = $.t("poll_creation");
					break;
				case 3:
					transactionType = $.t("vote_casting");
					break;
				case 4:
					transactionType = $.t("hub_announcements");
					break;
				case 5:
					transactionType = $.t("account_info");
					break;
				case 6:
					if (transaction.attachment.priceMilliLm == "0") {
						if (transaction.sender == Lm.Account && transaction.recipient == Lm.Account) {
							transactionType = $.t("alias_sale_cancellation");
						} else {
							transactionType = $.t("alias_transfer");
						}
					} else {
						transactionType = $.t("alias_sale");
					}
					break;
				case 7:
					transactionType = $.t("alias_buy");
					break;
			}
		} else if (transaction.type == 2) {
			switch (transaction.subtype) {
				case 0:
					transactionType = $.t("asset_issuance");
					break;
				case 1:
					transactionType = $.t("asset_transfer");
					break;
				case 2:
					transactionType = $.t("ask_order_placement");
					break;
				case 3:
					transactionType = $.t("bid_order_placement");
					break;
				case 4:
					transactionType = $.t("ask_order_cancellation");
					break;
				case 5:
					transactionType = $.t("bid_order_cancellation");
					break;
			}
		} else if (transaction.type == 3) {
			switch (transaction.subtype) {
				case 0:
					transactionType = $.t("marketplace_listing");
					break;
				case 1:
					transactionType = $.t("marketplace_removal");
					break;
				case 2:
					transactionType = $.t("marketplace_price_change");
					break;
				case 3:
					transactionType = $.t("marketplace_quantity_change");
					break;
				case 4:
					transactionType = $.t("marketplace_purchase");
					break;
				case 5:
					transactionType = $.t("marketplace_delivery");
					break;
				case 6:
					transactionType = $.t("marketplace_feedback");
					break;
				case 7:
					transactionType = $.t("marketplace_refund");
					break;
			}
		} else if (transaction.type == 4) {
			switch (transaction.subtype) {
				case 0:
					transactionType = $.t("balance_leasing");
					break;
			}
		}

		var receiving = transaction.recipient == Lm.Account;
		var account = (receiving ? "sender" : "recipient");

		if (transaction.amountMilliLm) {
			transaction.amount = new BigInteger(transaction.amountMilliLm);
			transaction.fee = new BigInteger(transaction.feeMilliLm);
		}

		var hasMessage = false;

		if (transaction.attachment) {
			if (transaction.attachment.encryptedMessage || transaction.attachment.message) {
				hasMessage = true;
			} else if (transaction.sender == Lm.Account && transaction.attachment.encryptToSelfMessage) {
				hasMessage = true;
			}
		}

		return "<tr " + (!transaction.confirmed && (transaction.recipient == Lm.Account || transaction.sender == Lm.Account) ? " class='tentative'" : "") + ">" +
			"<td><a href='#' data-transaction='" + String(transaction.transaction).escapeHTML() + "'>" +
			String(transaction.transaction).escapeHTML() + "</a></td>" +
			"<td>" + (hasMessage ? "<i class='fa fa-envelope-o'></i>&nbsp;" : "/") + "</td>" +
			"<td>" + Lm.FormatTimestamp(transaction.timestamp) + "</td>" +
			"<td>" + transactionType + "</td>" +
			"<td style='width:5px;padding-right:0;'>" + (transaction.type == 0 ?
				(receiving ? "<i class='fa fa-plus-circle' style='color:#65C62E'></i>" : "<i class='fa fa-minus-circle' style='color:#E04434'></i>") : "") + "</td>" +
			"<td " + (transaction.type == 0 && receiving ? " style='color:#006400;'" : (!receiving && transaction.amount > 0 ? " style='color:red'" : "")) + ">" +
			Lm.FormatAmount(transaction.amount) + "</td>" +
			"<td " + (!receiving ? " style='color:red'" : "") + ">" + Lm.FormatAmount(transaction.fee) + "</td>" +
			"<td>" + Lm.GetAccountLink(transaction, account) + "</td>" +
			"<td class='confirmations' data-content='" + (transaction.confirmed ? Lm.FormatAmount(transaction.confirmations) + " " +
				$.t("confirmations") : $.t("unconfirmed_transaction")) + "' data-container='body' data-placement='left'>" +
			(!transaction.confirmed ? "/" : (transaction.confirmations > 1440 ? "1440+" : Lm.FormatAmount(transaction.confirmations))) + "</td></tr>";
	}

	function TransactionsPageTypeLi_OnClick(th, e) {
		e.preventDefault();

		var type = th.data("type");

		if (!type) {
			Lm.TransactionsPageType = null;
		} else if (type == "unconfirmed") {
			Lm.TransactionsPageType = "unconfirmed";
		} else {
			type = type.split(":");
			Lm.TransactionsPageType = {
				"type": type[0],
				"subtype": type[1]
			};
		}

		th.parents(".btn-group").find(".text").text(th.text());

		$(".popover").remove();

		Lm.LoadPage("transactions");
	}


	$("#transactions_page_type li a").click(function(e) {
		TransactionsPageTypeLi_OnClick($(this), e);
	});


	Lm.GetInitialTransactions = GetInitialTransactions;
	Lm.HandleInitialTransactions = HandleInitialTransactions;
	Lm.GetNewTransactions = GetNewTransactions;
	Lm.GetUnconfirmedTransactions = GetUnconfirmedTransactions;
	Lm.HandleIncomingTransactions = HandleIncomingTransactions;
	Lm.SortArray = SortArray;
	Lm.Incoming.UpdateDashboardTransactions = UpdateDashboardTransactionsIncoming;
	Lm.AddUnconfirmedTransaction = AddUnconfirmedTransaction;
	Lm.Pages.Transactions = TransactionsPage;
	Lm.Incoming.Transactions = TransactionsIncoming;
	Lm.DisplayUnconfirmedTransactions = DisplayUnconfirmedTransactions;
	Lm.GetTransactionRowHtml = GetTransactionRowHtml;
	return Lm;
}(Lm || {}, jQuery));