/**!
 * LibreMoney GetAccountTransactions api 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var Blockchain = require(__dirname + '/../../Blockchain');
var JsonData = require(__dirname + '/../JsonData');
var ParameterParser = require(__dirname + '/../ParameterParser');


//super(new APITag[] {APITag.ACCOUNTS}, "account", "timestamp", "type", "subtype", "firstIndex", "lastIndex", "numberOfConfirmations");
function GetAccountTransactions(req, res) {
	var account = ParameterParser.GetAccount(req);
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
		for (var i in trs) {
			var transaction = trs[i];
			transactions.push(JsonData.Transaction(transaction));
		}
	});


	var response = {};
	response.transactions = transactions;
	res.send(response);
}


module.exports = GetAccountTransactions;
