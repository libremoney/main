/**!
 * LibreMoney GetAccountTransactionIds api 0.0
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */


var ParameterParser = require(__dirname + '/ParameterParser');
var Blockchain = require(__dirname + '/../../Blockchain');


//super("account", "timestamp", "type", "subtype");
function Main(req, res) {
	//static final GetAccountTransactionIds instance = new GetAccountTransactionIds();
	var account = ParameterParser.GetAccount(req);
	if (account == null) {
		res.send({
			transactionIds: []
		});
	}

	var timestamp = ParameterParser.GetTimestamp(req);

	var type = req.query.type;
	var subtype = req.query.subtype;

	var transactionIds = new Array();
	var iterator = Blockchain.GetTransactions1(account, type, subtype, timestamp);
	while (iterator.HasNext()) {
		var transaction = iterator.Next();
		transactionIds.push(transaction.GetStringId());
	}

	res.send({
		transactionIds: transactionIds
	});
}


module.exports = Main;
