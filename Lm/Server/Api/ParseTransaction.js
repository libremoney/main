/**!
 * LibreMoney ParseTransaction api 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var Convert = require(__dirname + '/../../Util/Convert');
var JsonData = require(__dirname + '/../JsonData');
var JsonResponses = require(__dirname + '/../JsonResponses');
//JsonValue
var Logger = require(__dirname + '/../../Logger').GetLogger(module);
var TransactionProcessor = require(__dirname + '/../../TransactionProcessor');


//super(new APITag[] {APITag.TRANSACTIONS}, "transactionBytes", "transactionJSON");
function ParseTransaction(req, res) {
	var transactionBytes = Convert.EmptyToNull(req.query.transactionBytes);
	var transactionJson = Convert.EmptyToNull(req.query.transactionJson);
	if (!transactionBytes && !transactionJson) {
		return JsonResponses.MissingTransactionBytesOrJson;
	}
	var response;
	try {
		var transaction;
		if (transactionBytes) {
			var bytes = Convert.ParseHexString(transactionBytes);
			transaction = TransactionProcessor.ParseTransaction1(bytes);
		} else {
			transaction = TransactionProcessor.ParseTransaction2(transactionJson);
		}

		transaction.Validate();
		response = JsonData.UnconfirmedTransaction(transaction);
		response.verify = transaction.VerifySignature();
	} catch (e) {
		return JsonResponses.IncorrectTransactionBytes;
		Logger.error('ParseTransaction: Error');
	}
	res.send(response);
}

module.exports = ParseTransaction;
