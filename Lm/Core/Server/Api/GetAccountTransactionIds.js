/**!
 * LibreMoney GetAccountTransactionIds api 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */


if (typeof module !== "undefined") {
	var Blockchain = require(__dirname + '/../../Blockchain');
	var Core = require(__dirname + '/../../Core');
	var ParameterParser = require(__dirname + '/../ParameterParser');
}


//super(new APITag[] {APITag.ACCOUNTS}, "account", "timestamp", "type", "subtype", "firstIndex", "lastIndex", "numberOfConfirmations");
function GetAccountTransactionIds(req, res) {
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
		var type = req.query.type;
		var subtype = req.query.subtype;
		var firstIndex = ParameterParser.GetFirstIndex(req);
		var lastIndex = ParameterParser.GetLastIndex(req);
		var transactionIds = [];
		Blockchain.GetTransactions(account, numberOfConfirmations, type, subtype, timestamp, firstIndex, lastIndex, function(err, transactions) {
			if (err) {
				res.write(err);
				res.end();
				return;
			}
			for (var i in transactions) {
				transaction = transactions[i];
				transactionIds.push(transaction.GetStringId());
			}
			console.log('GetAccountTransactionIds: transactionIds='+transactionIds);
			res.write(JSON.stringify({
				transactionIds: transactionIds
			}));
			res.end();
		});
	});
}


module.exports = GetAccountTransactionIds;
