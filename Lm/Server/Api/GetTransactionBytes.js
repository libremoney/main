/*!
 * LibreMoney 0.0
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var Convert = require(__dirname + '/../../Util/Convert');
var JsonResponses = require(__dirname + '/../JsonResponses');
var TransactionProcessor = require(__dirname + '/../../TransactionProcessor');


//super("transaction");
function GetTransactionBytes(req, res) {
	var transactionValue = req.query.transaction;
	if (!transactionValue) {
		res.send(JsonResponses.MissingTransaction);
		return;
	}

	var transactionId;
	var transaction;
	//try {
		transactionId = Convert.ParseUnsignedLong(transactionValue);
	//} catch (e) {
	//	res.send(JsonResponses.IncorrectTransaction);
	//	return;
	//}

	Blockchain.GetTransaction(transactionId, function(err, transaction) {
		var response = {};
		if (!transaction) {
			transaction = TransactionProcessor.GetUnconfirmedTransaction(transactionId);
			if (!transaction) {
				res.send(JsonResponses.UnknownTransaction);
				return;
			}
		} else {
			response.confirmations = Blockchain.GetLastBlock().GetHeight() - transaction.GetHeight();
		}
		response.transactionBytes = Convert.ToHexString(transaction.GetBytes());
		response.unsignedTransactionBytes = Convert.ToHexString(transaction.GetUnsignedBytes());
		res.send(response);
		return;
	});
}


module.exports = GetTransactionBytes;
