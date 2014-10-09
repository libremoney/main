/**!
 * LibreMoney GetAccountTransactions api 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

if (typeof module !== "undefined") {
	var Blockchain = require(__dirname + '/../../Blockchain');
	var Core = require(__dirname + '/../../Core');
	var JsonData = require(__dirname + '/../JsonData');
	var ParameterParser = require(__dirname + '/../ParameterParser');
}


//super(new APITag[] {APITag.ACCOUNTS}, "account", "timestamp", "type", "subtype", "firstIndex", "lastIndex", "numberOfConfirmations");
function GetAccountTransactions(req, res) {
	res.writeHead(200, {
		"Content-Type": "application/json"
	});
	Core.GetAccount(req.query.account, function(err, account) {
		if (err) {
			res.write(err);
			res.end();
			return;
		}
		var timestamp = ParameterParser.GetTimestamp(req);
		var numberOfConfirmations = ParameterParser.GetNumberOfConfirmations(req);

		var type;
		var subtype;
		try {
			type = req.query.type;
		} catch (e) {
			type = -1;
		}
		try {
			subtype = req.query.subtype;
		} catch (e) {
			subtype = -1;
		}

		var firstIndex = ParameterParser.GetFirstIndex(req);
		var lastIndex = ParameterParser.GetLastIndex(req);

		var transactions = [];
		Blockchain.GetTransactions(account, numberOfConfirmations, type, subtype, timestamp, firstIndex, lastIndex, function(err, trs) {
			if (err) {
				res.write(err);
				res.end();
				return;
			}
			for (var i in trs) {
				var transaction = trs[i];
				transactions.push(JsonData.Transaction(transaction));
			}
			res.write(JSON.stringify({
				transactions: transactions
			}));
			res.end();
		});

		/*
		TransactionDb.GetMyAllTransactions(req.query.accountId, function(myTransactions) {
			UnconfirmedTransactions.GetMyAllTransactions(req.query.accountId, function(unconfTrans) {
				UnconfirmedTransactions.GetAllTransactionsList(function(unconfTransAll) {
					myTransactions = unconfTrans.concat(myTransactions);
					recentTransactions = unconfTransAll.concat(recentTransactions);
					ResponseHelper.end200Text(res, JSON.stringify({
						recentTransactions: recentTransactions || [],
						myTransactions: myTransactions
					}));
				});
			});
		});
		*/
	});
}


module.exports = GetAccountTransactions;
