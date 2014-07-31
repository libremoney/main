/**!
 * LibreMoney GetAccountTransactionIds api 0.0
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */


var ParameterParser = require(__dirname + '/../ParameterParser');
var Blockchain = require(__dirname + '/../../Blockchain');


//super("account", "timestamp", "type", "subtype");
function GetAccountTransactionIds(req, res) {
	var account = ParameterParser.GetAccount(req);
	var timestamp = ParameterParser.GetTimestamp(req);
	var type = req.query.type;
	var subtype = req.query.subtype;
	var transactionIds = [];
	Blockchain.GetTransactions3(account, type, subtype, timestamp, null, function(err, transactions) {
		for (var i in transactions) {
			transaction = transactions[i];
			transactionIds.push(transaction.GetStringId());
		}
		console.log('GetAccountTransactionIds: transactionIds='+transactionIds);
		res.send({
			transactionIds: transactionIds
		});
	});
}


module.exports = GetAccountTransactionIds;
