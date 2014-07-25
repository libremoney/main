/**!
 * LibreMoney 0.0
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var Convert = require(__dirname + '/../../Util/Convert');
var JsonResponses = require(__dirname + '/../JsonResponses');
var Logger = require(__dirname + '/../../Logger').GetLogger(module);
var TransactionProcessor = require(__dirname + '/../../TransactionProcessor');


//super("transactionBytes");
function BroadcastTransaction(req, res) {
	var transactionBytes = req.query.transactionBytes;
	if (!transactionBytes) {
		res.send(JsonResponses.MissingTransactionBytes);
		return;
	}
	try {
		var bytes = Convert.ParseHexString(transactionBytes);
		var transaction = TransactionProcessor.ParseTransaction(bytes);
		transaction.ValidateAttachment();

		var response = {};
		try {
			TransactionProcessor.Broadcast(transaction);
			response.transaction = transaction.GetStringId();
			response.fullHash = transaction.GetFullHash();
		} catch (e) {
			response.error = e;
		}
		res.send(response);
	} catch (e) {
		res.send(JsonResponses.IncorrectTransactionBytes);
	}
}

module.exports = BroadcastTransaction;
