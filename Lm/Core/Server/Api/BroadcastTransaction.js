/**!
 * LibreMoney BroadcastTransaction api 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var Convert = require(__dirname + '/../../../Lib/Util/Convert');
var JsonResponses = require(__dirname + '/../JsonResponses');
var Logger = require(__dirname + '/../../../Lib/Util/Logger').GetLogger(module);
var TransactionProcessor = require(__dirname + '/../../TransactionProcessor');


//super(new APITag[] {APITag.TRANSACTIONS}, "transactionBytes", "transactionJSON");
function BroadcastTransaction(req, res) {
	var transactionBytes = Convert.EmptyToNull(req.query.transactionBytes);
	var transactionJson = Convert.EmptyToNull(req.query.transactionJson);
	if (!transactionBytes && !transactionJson) {
		res.send(JsonResponses.MissingTransactionBytesOrJson);
		return;
	}
	try {
		var transaction;
		if (transactionBytes) {
			var bytes = Convert.ParseHexString(transactionBytes);
			transaction = TransactionProcessor.ParseTransaction1(bytes);
		} else {
			transaction = TransactionProcessor.ParseTransaction2(transactionJson);
		}
		transaction.Validate();

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
