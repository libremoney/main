/**!
 * LibreMoney GetAccountTransactionIds api 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */


var Blockchain = require(__dirname + '/../../Blockchain');
var Core = require(__dirname + '/../../Core');
var ParameterParser = require(__dirname + '/../ParameterParser');


//super(new APITag[] {APITag.ACCOUNTS}, "account", "timestamp", "type", "subtype", "firstIndex", "lastIndex", "numberOfConfirmations");
function GetAccountTransactionIds(req, res) {
	Core.GetAccount(req.query.account, function(err, account) {
		if (err) {
			res.send(err);
			return;
		}
		var timestamp = ParameterParser.GetTimestamp(req);
		var numberOfConfirmations = ParameterParser.GetNumberOfConfirmations(req);
		var type = req.query.type;
		var subtype = req.query.subtype;
		var firstIndex = ParameterParser.GetFirstIndex(req);
		var lastIndex = ParameterParser.GetLastIndex(req);
		var transactionIds = [];
		Blockchain.GetTransactions1(account, numberOfConfirmations, type, subtype, timestamp, firstIndex, lastIndex, function(err, transactions) {
			for (var i in transactions) {
				transaction = transactions[i];
				transactionIds.push(transaction.GetStringId());
			}
			console.log('GetAccountTransactionIds: transactionIds='+transactionIds);
			res.send({
				transactionIds: transactionIds
			});
		});
	});
}


module.exports = GetAccountTransactionIds;
