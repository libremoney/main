/*!
 * LibreMoney GetTransactionBytes api 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var Convert = require(__dirname + '/../../../Lib/Util/Convert');
var JsonResponses = require(__dirname + '/../JsonResponses');
var TransactionProcessor = require(__dirname + '/../../TransactionProcessor');


//super(new APITag[] {APITag.TRANSACTIONS}, "transaction");
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
