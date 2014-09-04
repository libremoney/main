/**!
 * LibreMoney SignTransaction 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

// deprecated

var Crypto = require(__dirname + '/../../Crypto/Crypto');
var Convert = require(__dirname + '/../../Util/Convert');
var JsonResponses = require(__dirname + '/../JsonResponses');
var Logger = require(__dirname + '/../../Logger').GetLogger(module);
var TransactionProcessor = require(__dirname + '/../../TransactionProcessor');


//super("unsignedTransactionBytes", "secretPhrase");
function SignTransaction(req, res) {
	var transactionBytes = Convert.EmptyToNull(req.query.unsignedTransactionBytes);
	if (!transactionBytes) {
		return JsonResponses.MissingUnsignedBytes;
	}
	var secretPhrase = Convert.EmptyToNull(req.query.secretPhrase);
	if (!secretPhrase) {
		return JsonResponses.MissingSecretPhrase;
	}

	try {
		var bytes = Convert.ParseHexString(transactionBytes);
		var transaction = TransactionProcessor.ParseTransaction(bytes);
		transaction.ValidateAttachment();
		if (transaction.GetSignature() != null) {
			var response = {};
			response.errorCode = 4;
			response.errorDescription = "Incorrect \"unsignedTransactionBytes\" - transaction is already signed";
			return response;
		}
		transaction.Sign(secretPhrase);
		var response = {};
		response.transaction = transaction.GetStringId();
		response.fullHash = transaction.GetFullHash();
		response.transactionBytes = Convert.ToHexString(transaction.GetBytes());
		response.signatureHash = Convert.ToHexString(Crypto.Sha256().digest(transaction.GetSignature()));
		response.verify = transaction.Verify();
		return response;
	} catch (e) {
		Logger.error(e);
		return JsonResponses.IncorrectUnsignedBytes;
	}
}

module.exports = SignTransaction;
