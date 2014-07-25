/**!
 * LibreMoney JsonResponses 0.0
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var Convert = require(__dirname + '/../../Util/Convert');
var JsonData = require(__dirname + '/../JsonData');
var JsonResponses = require(__dirname + '/../JsonResponses');
var Logger = require(__dirname + '/../../Logger').GetLogger(module);
var TransactionProcessor = require(__dirname + '/../../TransactionProcessor');


//super("transactionBytes");
function ParseTransaction(req, res) {
	var transactionBytes = req.query.transactionBytes;
	if (!transactionBytes) {
		return JsonResponses.MissingTransactionBytes;
	}
	var response;
	try {
		var bytes = Convert.ParseHexString(transactionBytes);
		var transaction = TransactionProcessor.ParseTransaction(bytes);
		transaction.ValidateAttachment();
		response = JsonData.UnconfirmedTransaction(transaction);
		response.verify = transaction.verify();
	} catch (e) {
		return JsonResponses.IncorrectTransactionBytes;
		Logger.error('ParseTransaction: Error');
	}
	return response;
}

module.exports = ParseTransaction;
