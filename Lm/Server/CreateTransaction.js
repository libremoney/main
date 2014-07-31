/**!
 * LibreMoney 0.0
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var Constants = require(__dirname + '/../Constants');
var Convert = require(__dirname + '/../Util/Convert');
var Crypto = require(__dirname + '/../Crypto/Crypto');
var JsonResponses = require(__dirname + '/JsonResponses');
var Logger = require(__dirname + '/../Logger').GetLogger(module);
var ParameterParser = require(__dirname + '/ParameterParser');
var TransactionProcessor = require(__dirname + '/../TransactionProcessor');


/*
var commonParameters = ["secretPhrase", "publicKey", "feeMilliLm", "deadline", "referencedTransactionFullHash", "broadcast"];
// deprecated
function AddCommonParameters(parameters) {
	var result = [];
	for (var i = 0; i < commonParameters.length; i++) { result.push(commonParameters); }
	//var result = Arrays.copyOf(parameters, parameters.length + commonParameters.length);
	//System.arraycopy(commonParameters, 0, result, parameters.length, commonParameters.length);
	return result;
}
*/

/*
final JSONStreamAware createTransaction(req, senderAccount, attachment) {
	return createTransaction(req, senderAccount, Genesis.CREATOR_ID, 0, attachment);
}
}
*/
// TODO: secretPhrase -> signature
function CreateTransaction(req, res, senderAccount, recipientId, amountMilliLm, attachment) {
	if (!recipientId)
		recipientId = Genesis.CREATOR_ID;
	if (!amountMilliLm)
		amountMilliLm = 0;

	var deadlineValue = req.query.deadline;
	var referencedTransactionFullHash = Convert.EmptyToNull(req.query.referencedTransactionFullHash);
	var referencedTransactionId = Convert.EmptyToNull(req.query.referencedTransaction);
	var secretPhrase = Convert.EmptyToNull(req.query.secretPhrase);
	var publicKeyValue = Convert.EmptyToNull(req.query.publicKey);
	var broadcast = true; //!"false".equalsIgnoreCase(req.getParameter("broadcast"));

	if (!secretPhrase && !publicKeyValue) {
		res.send(JsonResponses.MissingSecretPhrase);
		return false;
	} else if (!deadlineValue) {
		res.send(JsonResponses.MissingDeadline);
		return false;
	}

	var deadline;
	try {
		deadline = parseInt(deadlineValue); // parseShort
		if (deadline < 1 || deadline > 1440) {
			res.send(JsonResponses.IncorrectDeadline);
			return false;
		}
	} catch (e) {
		Logger.error(e);
		res.send(JsonResponses.IncorrectDeadline);
		return false;
	}

	var feeMilliLm = ParameterParser.GetFeeMilliLm(req);
	if (feeMilliLm < Constants.OneLm/*minimumFeeMilliLm()*/) {
		res.send(JsonResponses.IncorrectFee);
		return false;
	}

	try {
		if (Convert.SafeAdd(amountMilliLm, feeMilliLm) > senderAccount.GetUnconfirmedBalanceMilliLm()) {
			res.send(JsonResponses.NotEnoughFunds);
			return false;
		}
	} catch (e) {
		res.send(JsonResponses.NotEnoughFunds);
		return false;
	}

	if (referencedTransactionId != null) {
		res.send(JsonResponses.IncorrectReferencedTransaction);
		return false;
	}

	// shouldn't try to get publicKey from senderAccount as it may have not been set yet
	var publicKey = secretPhrase != null ? Crypto.GetPublicKey(secretPhrase) : Convert.ParseHexString(publicKeyValue);

	try {
		var transaction = Transactions.NewOrdinaryPaymentTransaction({
			deadline: deadline,
			senderPublicKey: publicKey,
			recipientId: recipientId,
			amountMilliLm: amountMilliLm,
			feeMilliLm: feeMilliLm,
			referencedTransactionFullHash: referencedTransactionFullHash,
			attachment: attachment
		});

		if (secretPhrase != null) {
			transaction.Sign(secretPhrase);
			response.transaction = transaction.GetStringId();
			response.fullHash = transaction.GetFullHash();
			response.transactionBytes = Convert.ToHexString(transaction.GetBytes());
			response.signatureHash = Convert.ToHexString(Crypto.Sha256().digest(transaction.GetSignature()));
			if (broadcast) {
				TransactionProcessor.Broadcast(transaction);
				response.broadcasted = true;
			} else {
				response.broadcasted = false;
			}
		} else {
			response.broadcasted = false;
		}
		response.unsignedTransactionBytes = Convert.ToHexString(transaction.GetUnsignedBytes());
	} catch (e) {
		//return JsonResponses.FEATURE_NOT_AVAILABLE;
		response.error = e;
	}
	res.send(response);
	return true;
}


module.exports = CreateTransaction;
