var Lm = (function(Lm, $, undefined) {
	Lm.LastTransactionsTimestamp = 0;
	Lm.LastTransactions = "";

	Lm.UnconfirmedTransactions = [];
	Lm.UnconfirmedTransactionIds = "";
	Lm.UnconfirmedTransactionsChange = true;

	Lm.TransactionsPageType = null;


	function GetInitialTransactions() {
		Lm.SendRequest("getAccountTransactionIds", {
			"account": Lm.Account,
			"timestamp": 0
		}, function(response) {
			if (response.transactionIds && response.transactionIds.length) {
				var transactionIds = response.transactionIds.reverse().slice(0, 10);
				var nrTransactions = 0;
				var transactions = [];

				for (var i = 0; i < transactionIds.length; i++) {
					Lm.SendRequest("getTransaction", {
						"transaction": transactionIds[i]
					}, function(transaction, input) {
						nrTransactions++;

						transaction.transaction = input.transaction;
						transaction.confirmed = true;
						transactions.push(transaction);

						if (nrTransactions == transactionIds.length) {
							Lm.GetUnconfirmedTransactions(function(unconfirmedTransactions) {
								Lm.HandleInitialTransactions(transactions.concat(unconfirmedTransactions), transactionIds);
							});
						}
					});
				}
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

			if (transactions.length >= 1) {
				Lm.LastTransactions = transactionIds.toString();

				for (var i = transactions.length - 1; i >= 0; i--) {
					if (transactions[i].confirmed) {
						Lm.LastTransactionsTimestamp = transactions[i].timestamp;
						break;
					}
				}
			}

			for (var i = 0; i < transactions.length; i++) {
				var transaction = transactions[i];

				var receiving = transaction.recipient == Lm.Account;

				var account = (receiving ? "sender" : "recipient");

				if (transaction.amountNQT) {
					transaction.amount = new BigInteger(transaction.amountNQT);
					transaction.fee = new BigInteger(transaction.feeNQT);
				}

				rows += "<tr class='" + (!transaction.confirmed ? "tentative" : "confirmed") + "'>"+
					"<td><a href='#' data-transaction='" +
					String(transaction.transaction).escapeHTML() + "'>" +
					Lm.FormatTimestamp(transaction.timestamp) + "</a></td><td style='width:5px;padding-right:0;'>" +
					(transaction.type == 0 ? (receiving ? "<i class='fa fa-plus-circle' style='color:#65C62E'></i>" :
						"<i class='fa fa-minus-circle' style='color:#E04434'></i>") : "") +
					"</td>"+
					"<td><span" + (transaction.type == 0 && receiving ? " style='color:#006400'" :
						(!receiving && transaction.amount > 0 ? " style='color:red'" : "")) +
						">" + Lm.FormatAmount(transaction.amount) + "</span> "+
						"<span" + ((!receiving && transaction.type == 0) ? " style='color:red'" : "") + ">+</span> "+
						"<span" + (!receiving ? " style='color:red'" : "") + ">" + Lm.FormatAmount(transaction.fee) + "</span></td>"+
					"<td>" + (transaction[account] != Lm.Genesis ? "<a href='#' data-user='" + Lm.GetAccountFormatted(transaction, account) +
						"' data-user-id='" + String(transaction[account]).escapeHTML() + "' data-user-rs='" +
						String(transaction[account + "RS"]).escapeHTML() + "' class='user_info'>" +
						Lm.GetAccountTitle(transaction, account) + "</a>" : "Genesis") + "</td>"+
					"<td class='confirmations' data-confirmations='" + String(transaction.confirmations).escapeHTML() + "' data-content='" +
						Lm.FormatAmount(transaction.confirmations) + " confirmations' data-container='body' data-initial='true'>" +
						(transaction.confirmations > 10 ? "10+" : String(transaction.confirmations).escapeHTML()) +
					"</td></tr>";
			}

			$("#dashboard_transactions_table tbody").empty().append(rows);
		}

		Lm.DataLoadFinished($("#dashboard_transactions_table"));
	}

	function GetNewTransactions() {
		Lm.SendRequest("getAccountTransactionIds", {
			"account": Lm.Account,
			"timestamp": Lm.LastTransactionsTimestamp
		}, function(response) {
			if (response.transactionIds && response.transactionIds.length) {
				var transactionIds = response.transactionIds.reverse().slice(0, 10);

				if (transactionIds.toString() == Lm.LastTransactions) {
					Lm.GetUnconfirmedTransactions(function(unconfirmedTransactions) {
						Lm.HandleIncomingTransactions(unconfirmedTransactions);
					});
					return;
				}

				Lm.TransactionIds = transactionIds;

				var nrTransactions = 0;

				var newTransactions = [];

				//if we have a new transaction, we just get them all.. (10 max)
				for (var i = 0; i < transactionIds.length; i++) {
					Lm.SendRequest('getTransaction', {
						"transaction": transactionIds[i]
					}, function(transaction, input) {
						nrTransactions++;

						transaction.transaction = input.transaction;
						transaction.confirmed = true;
						newTransactions.push(transaction);

						if (nrTransactions == transactionIds.length) {
							Lm.GetUnconfirmedTransactions(function(unconfirmedTransactions) {
								Lm.HandleIncomingTransactions(newTransactions.concat(unconfirmedTransactions), transactionIds);
							});
						}
					});
				}
			} else {
				Lm.GetUnconfirmedTransactions(function(unconfirmedTransactions) {
					Lm.HandleIncomingTransactions(unconfirmedTransactions);
				});
			}
		});
	}

	function GetUnconfirmedTransactions(callback) {
		Lm.SendRequest("getUnconfirmedTransactionIds", {
			"account": Lm.Account
		}, function(response) {
			if (response.unconfirmedTransactionIds && response.unconfirmedTransactionIds.length) {
				var unconfirmedTransactionIds = response.unconfirmedTransactionIds.reverse();

				var nr_transactions = 0;

				var unconfirmedTransactions = [];
				var unconfirmedTransactionIdArray = [];

				for (var i = 0; i < unconfirmedTransactionIds.length; i++) {
					Lm.SendRequest('getTransaction', {
						"transaction": unconfirmedTransactionIds[i]
					}, function(transaction, input) {
						nr_transactions++;

						transaction.transaction = input.transaction;
						transaction.confirmed = false;
						transaction.unconfirmed = true;
						transaction.confirmations = "/";

						if (transaction.attachment) {
							for (var key in transaction.attachment) {
								if (!transaction.hasOwnProperty(key)) {
									transaction[key] = transaction.attachment[key];
								}
							}
						}

						unconfirmedTransactions.push(transaction);
						unconfirmedTransactionIdArray.push(transaction.transaction);

						if (nr_transactions == unconfirmedTransactionIds.length) {
							Lm.UnconfirmedTransactions = unconfirmedTransactions;

							var unconfirmedTransactionIdString = unconfirmedTransactionIdArray.toString();

							if (unconfirmedTransactionIdString != Lm.UnconfirmedTransactionIds) {
								Lm.UnconfirmedTransactionsChange = true;
								Lm.UnconfirmedTransactionIds = unconfirmedTransactionIdString;
							} else {
								Lm.UnconfirmedTransactionsChange = false;
							}

							if (callback) {
								callback(unconfirmedTransactions);
							} else if (Lm.UnconfirmedTransactionsChange) {
								Lm.Incoming.updateDashboardTransactions(unconfirmedTransactions, true);
							}
						}
					});
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
					Lm.Incoming.updateDashboardTransactions([], true);
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

			for (var i = transactions.length - 1; i >= 0; i--) {
				if (transactions[i].confirmed) {
					Lm.LastTransactionsTimestamp = transactions[i].timestamp;
					break;
				}
			}
		}

		if (confirmedTransactionIds.length || Lm.UnconfirmedTransactionsChange) {
			transactions.sort(Lm.SortArray);

			Lm.Incoming.updateDashboardTransactions(transactions, confirmedTransactionIds.length == 0);
		}

		//always refresh peers and unconfirmed transactions..
		if (Lm.CurrentPage == "peers" || (Lm.CurrentPage == "transactions" && Lm.TransactionsPageType == "unconfirmed")) {
			Lm.Incoming.UnconfirmedTransactions();
		} else {
			if (!oldBlock || Lm.UnconfirmedTransactionsChange || Lm.State.isScanning) {
				if (Lm.Incoming[Lm.CurrentPage]) {
					Lm.Incoming[Lm.CurrentPage](transactions);
				}
			}
		}
	}

	function SortArray(a, b) {
		return b.timestamp - a.timestamp;
	}

	function UpdateDashboardTransactions(newTransactions, unconfirmed) {
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

				if (transaction.amountNQT) {
					transaction.amount = new BigInteger(transaction.amountNQT);
					transaction.fee = new BigInteger(transaction.feeNQT);
				}

				rows += "<tr class='" + (!transaction.confirmed ? "tentative" : "confirmed") + "'>"+
					"<td><a href='#' data-transaction='" + String(transaction.transaction).escapeHTML() + "'>" +
					Lm.FormatTimestamp(transaction.timestamp) + "</a></td>"+
					"<td style='width:5px;padding-right:0;'>" + (transaction.type == 0 ?
						(receiving ? "<i class='fa fa-plus-circle' style='color:#65C62E'></i>" :
							"<i class='fa fa-minus-circle' style='color:#E04434'></i>") : "") +
					"</td>"+
					"<td><span" + (transaction.type == 0 && receiving ? " style='color:#006400'" :
						(!receiving && transaction.amount > 0 ? " style='color:red'" : "")) + ">" + Lm.FormatAmount(transaction.amount) + "</span> "+
					"<span" + ((!receiving && transaction.type == 0) ? " style='color:red'" : "") + ">+</span> "+
					"<span" + (!receiving ? " style='color:red'" : "") + ">" + Lm.FormatAmount(transaction.fee) + "</span></td>"+
					"<td>" + (transaction[account] != Lm.Genesis ? "<a href='#' data-user='" + Lm.GetAccountFormatted(transaction, account) +
						"' data-user-id='" + String(transaction[account]).escapeHTML() + "' data-user-rs='" +
						String(transaction[account + "RS"]).escapeHTML() + "' class='user_info'>" +
						Lm.GetAccountTitle(transaction, account) + "</a>" : "Genesis") +
					"</td>"+
					"<td class='confirmations' data-confirmations='" + String(transaction.confirmations).escapeHTML() +
						"' data-content='" + (transaction.confirmed ? Lm.FormatAmount(transaction.confirmations) +
							" confirmations" : "Unconfirmed transaction") +
						"' data-container='body' data-initial='true'>" + (transaction.confirmations > 10 ? "10+" :
							String(transaction.confirmations).escapeHTML()) + "</td></tr>";
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

				Lm.Incoming.updateDashboardTransactions(Lm.UnconfirmedTransactions, true);

				Lm.GetAccountInfo();
			} else if (callback) {
				callback(false);
			}
		});
	}

	function TransactionsPage() {
		if (Lm.TransactionsPageType == "unconfirmed") {
			Lm.Pages.UnconfirmedTransactions();
			return;
		}

		Lm.PageLoading();

		var params = {
			"account": Lm.Account,
			"timestamp": 0
		};

		if (Lm.TransactionsPageType) {
			params.type = Lm.TransactionsPageType.type;
			params.subtype = Lm.TransactionsPageType.subtype;
		}

		var rows = "";

		if (Lm.UnconfirmedTransactions.length) {
			for (var j = 0; j < Lm.UnconfirmedTransactions.length; j++) {
				var unconfirmedTransaction = Lm.UnconfirmedTransactions[j];

				if (Lm.TransactionsPageType) {
					if (unconfirmedTransaction.type != params.type || unconfirmedTransaction.subtype != params.subtype) {
						continue;
					}
				}

				rows += Lm.GetTransactionRowHtml(unconfirmedTransaction);
			}
		}

		Lm.SendRequest("getAccountTransactionIds+", params, function(response) {
			TransactionsPage_Refresh(response, rows);
		});
	}

	function TransactionsPage_Refresh(response, rows) {
		if (response.transactionIds && response.transactionIds.length) {
			var transactions = {};
			var nr_transactions = 0;

			var transactionIds = response.transactionIds.reverse().slice(0, 100);

			for (var i = 0; i < transactionIds.length; i++) {
				Lm.SendRequest("getTransaction+", {
					"transaction": transactionIds[i]
				}, function(transaction, input) {
					if (Lm.CurrentPage != "transactions") {
						transactions = {};
						return;
					}

					transaction.transaction = input.transaction;
					transaction.confirmed = true;

					transactions[input.transaction] = transaction;
					nr_transactions++;

					if (nr_transactions == transactionIds.length) {
						for (var i = 0; i < nr_transactions; i++) {
							var transaction = transactions[transactionIds[i]];
							rows += Lm.GetTransactionRowHtml(transaction);
						}

						$("#transactions_table tbody").empty().append(rows);
						Lm.DataLoadFinished($("#transactions_table"));

						Lm.PageLoaded();
					}
				});

				if (Lm.CurrentPage != "transactions") {
					transactions = {};
					return;
				}
			}
		} else {
			$("#transactions_table tbody").empty().append(rows);
			Lm.DataLoadFinished($("#transactions_table"));
			Lm.PageLoaded();
		}
	}

	function IncomingTransactions(transactions) {
		Lm.Pages.Transactions();
	}

	function UnconfirmedTransactionsPage() {
		Lm.PageLoading();
		Lm.SendRequest("getUnconfirmedTransactions", function(response) {
			if (response.unconfirmedTransactions && response.unconfirmedTransactions.length) {
				rows = "";
				for (var i = 0; i < response.unconfirmedTransactions.length; i++) {
					var unconfirmedTransaction = response.unconfirmedTransactions[i];
					rows += Lm.GetTransactionRowHtml(unconfirmedTransaction);
				}
				$("#transactions_table tbody").empty().append(rows);
				Lm.DataLoadFinished($("#transactions_table"));
				Lm.PageLoaded();
			} else {
				$("#transactions_table tbody").empty();
				Lm.DataLoadFinished($("#transactions_table"));
				Lm.PageLoaded();
			}
		});
	}

	function IncomingUnconfirmedTransactions() {
		Lm.Pages.UnconfirmedTransactions();
	}

	function GetTransactionRowHtml(transaction) {
		var transactionType = "Unknown";

		if (transaction.type == 0) {
			transactionType = "Ordinary payment";
		} else if (transaction.type == 1) {
			switch (transaction.subtype) {
				case 0:
					transactionType = "Arbitrary message";
					break;
				case 1:
					transactionType = "Alias assignment";
					break;
				case 2:
					transactionType = "Poll creation";
					break;
				case 3:
					transactionType = "Vote casting";
					break;
				case 4:
					transactionType = "Hub Announcement";
					break;
				case 5:
					transactionType = "Account Info";
					break;
			}
		} else if (transaction.type == 2) {
			switch (transaction.subtype) {
				case 0:
					transactionType = "Asset issuance";
					break;
				case 1:
					transactionType = "Asset transfer";
					break;
				case 2:
					transactionType = "Ask order placement";
					break;
				case 3:
					transactionType = "Bid order placement";
					break;
				case 4:
					transactionType = "Ask order cancellation";
					break;
				case 5:
					transactionType = "Bid order cancellation";
					break;
			}
		} else if (transaction.type == 3) {
			switch (transaction.subtype) {
				case 0:
					transactionType = "Digital Goods Listing";
					break;
				case 1:
					transactionType = "Digital Goods Delisting";
					break;
				case 2:
					transactionType = "Digtal Goods Price Change";
					break;
				case 3:
					transactionType = "Digital Goods Quantity Change";
					break;
				case 4:
					transactionType = "Digital Goods Purchase";
					break;
				case 5:
					transactionType = "Digital Goods Delivery";
					break;
				case 6:
					transactionType = "Digital Goods Feedback";
					break;
				case 7:
					transactionType = "Digital Goods Refund";
					break;
			}
		} else if (transaction.type == 4) {
			switch (transaction.subtype) {
				case 0:
					transactionType = "Balance Leasing";
					break;
			}
		}

		var receiving = transaction.recipient == Lm.Account;
		var account = (receiving ? "sender" : "recipient");

		if (transaction.amountNQT) {
			transaction.amount = new BigInteger(transaction.amountNQT);
			transaction.fee = new BigInteger(transaction.feeNQT);
		}

		return "<tr " + (!transaction.confirmed && (transaction.recipient == Lm.Account || transaction.sender == Lm.Account) ? " class='tentative'" : "") + ">"+
			"<td><a href='#' data-transaction='" + String(transaction.transaction).escapeHTML() + "'>" +
				String(transaction.transaction).escapeHTML() + "</a></td>"+
			"<td>" + Lm.FormatTimestamp(transaction.timestamp) + "</td>"+
			"<td>" + transactionType + "</td>"+
			"<td style='width:5px;padding-right:0;'>" + (transaction.type == 0 ?
				(receiving ? "<i class='fa fa-plus-circle' style='color:#65C62E'></i>" : "<i class='fa fa-minus-circle' style='color:#E04434'></i>") : "") +
			"</td>"+
			"<td " + (transaction.type == 0 && receiving ? " style='color:#006400;'" :
				(!receiving && transaction.amount > 0 ? " style='color:red'" : "")) + ">" + Lm.FormatAmount(transaction.amount) + "</td>"+
			"<td " + (!receiving ? " style='color:red'" : "") + ">" + Lm.FormatAmount(transaction.fee) + "</td>"+
			"<td>" + (transaction[account] != Lm.Genesis ? "<a href='#' data-user='" + Lm.GetAccountFormatted(transaction, account) +
				"' class='user_info'>" + Lm.GetAccountTitle(transaction, account) + "</a>" : "Genesis") + "</td>"+
			"<td class='confirmations' data-content='" + (transaction.confirmed ? Lm.FormatAmount(transaction.confirmations) + " confirmations" :
				"Unconfirmed transaction") + "' data-container='body' data-placement='left'>" +
				(!transaction.confirmed ? "/" : (transaction.confirmations > 1440 ? "1440+" : Lm.FormatAmount(transaction.confirmations))) +
			"</td></tr>";
	}

	function TransactionsPageTypeLi_OnClick(e, th) {
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

		Lm.Pages.Transactions();
	}


	$("#transactions_page_type li a").click(function(e) {
		TransactionsPageTypeLi_OnClick(e, $(this));
	});


	Lm.GetInitialTransactions = GetInitialTransactions;
	Lm.HandleInitialTransactions = HandleInitialTransactions;
	Lm.GetNewTransactions = GetNewTransactions;
	Lm.GetUnconfirmedTransactions = GetUnconfirmedTransactions;
	Lm.HandleIncomingTransactions = HandleIncomingTransactions;
	Lm.SortArray = SortArray;
	Lm.AddUnconfirmedTransaction = AddUnconfirmedTransaction;
	Lm.Incoming.Transactions = IncomingTransactions;
	Lm.Incoming.UnconfirmedTransactions = IncomingUnconfirmedTransactions
	Lm.Incoming.UpdateDashboardTransactions = UpdateDashboardTransactions;
	Lm.Pages.Transactions = TransactionsPage;
	Lm.Pages.UnconfirmedTransactions = UnconfirmedTransactionsPage;
	Lm.GetTransactionRowHtml = GetTransactionRowHtml;
	return Lm;
}(Lm || {}, jQuery));