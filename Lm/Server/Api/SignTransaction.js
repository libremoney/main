/**!
 * LibreMoney SignTransaction api 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

// deprecated

var Crypto = require(__dirname + '/../../Crypto/Crypto');
var Convert = require(__dirname + '/../../Util/Convert');
var JsonResponses = require(__dirname + '/../JsonResponses');
var Logger = require(__dirname + '/../../Logger').GetLogger(module);
var TransactionProcessor = require(__dirname + '/../../TransactionProcessor');
//JsonValue


//super(new APITag[] {APITag.TRANSACTIONS}, "unsignedTransactionBytes", "unsignedTransactionJSON", "secretPhrase");
function SignTransaction(req, res) {
	var transactionBytes = Convert.EmptyToNull(req.query.unsignedTransactionBytes);
	var transactionJson = Convert.EmptyToNull(req.query.unsignedTransactionJson);
	if (!transactionBytes && !transactionJson) {		
		res.send(JsonResponses.MissingUnsignedBytes);
		return;
	}
	var secretPhrase = Convert.EmptyToNull(req.query.secretPhrase);
	if (!secretPhrase) {
		res.send(JsonResponses.MissingSecretPhrase);
		return;
	}

	try {
		var transaction;
		if (transactionBytes) {
			var bytes = Convert.ParseHexString(transactionBytes);
			transaction = TransactionProcessor.ParseTransaction1(bytes);
		} else {
			transaction = TransactionProcessor.ParseTransaction(transactionJson);
		}
		transaction.Validate();
		if (transaction.GetSignature() != null) {
			var response = {};
			response.errorCode = 4;
			response.errorDescription = "Incorrect \"unsignedTransactionBytes\" - transaction is already signed";
			res.send(response);
			return;
		}
		transaction.Sign(secretPhrase);
		var response = {};
		response.transaction = transaction.GetStringId();
		response.fullHash = transaction.GetFullHash();
		response.transactionBytes = Convert.ToHexString(transaction.GetBytes());
		response.signatureHash = Convert.ToHexString(Crypto.Sha256().digest(transaction.GetSignature()));
		response.verify = transaction.VerifySignature();
		res.send(response);
		return;
	} catch (e) {
		Logger.error(e);
		res.send(JsonResponses.IncorrectUnsignedBytes);
		return;
	}
}


module.exports = SignTransaction;
