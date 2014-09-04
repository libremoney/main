/**!
 * LibreMoney CreateTransaction 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var Appendix_EncryptedMessage = require(__dirname + '/../Transactions/Appendix/EncryptedMessage');
var Appendix_EncryptToSelfMessage = require(__dirname + '/../Transactions/Appendix/EncryptToSelfMessage');
var Appendix_Message = require(__dirname + '/../Transactions/Appendix/Message');
var Appendix_PublicKeyAnnouncement = require(__dirname + '/../Transactions/Appendix/PublicKeyAnnouncement');
var Constants = require(__dirname + '/../Constants');
var Convert = require(__dirname + '/../Util/Convert');
var Crypto = require(__dirname + '/../Crypto/Crypto');
var JsonResponses = require(__dirname + '/JsonResponses');
var Logger = require(__dirname + '/../Logger').GetLogger(module);
var ParameterParser = require(__dirname + '/ParameterParser');
var TransactionProcessor = require(__dirname + '/../TransactionProcessor');


/*
var commonParameters = ["secretPhrase", "publicKey", "feeMilliLm",
	"deadline", "referencedTransactionFullHash", "broadcast",
	"message", "messageIsText",
	"messageToEncrypt", "messageToEncryptIsText", "encryptedMessageData", "encryptedMessageNonce",
	"messageToEncryptToSelf", "messageToEncryptToSelfIsText", "encryptToSelfMessageData", "encryptToSelfMessageNonce",
	"recipientPublicKey"];
*/

/*
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
CreateTransaction(APITag[] apiTags, String... parameters) {
	super(apiTags, addCommonParameters(parameters));
}
*/

/*
final JSONStreamAware createTransaction(req, senderAccount, attachment) {
	return createTransaction(req, senderAccount, null, 0, attachment);
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

	var encryptedMessage = null;
	if (attachment.GetTransactionType().HasRecipient()) {
		var encryptedData = ParameterParser.GetEncryptedMessage(req, Accounts.GetAccount(recipientId));
		if (encryptedData) {
			encryptedMessage = new Appendix_EncryptedMessage(encryptedData, !"false".equalsIgnoreCase(req.query.messageToEncryptIsText));
		}
	}
	var encryptToSelfMessage = null;
	var encryptedToSelfData = ParameterParser.GetEncryptToSelfMessage(req);
	if (encryptedToSelfData != null) {
		encryptToSelfMessage = new Appendix_EncryptToSelfMessage(encryptedToSelfData, !"false".equalsIgnoreCase(req.query.messageToEncryptToSelfIsText));
	}
	var message = null; // Appendix.Message
	var messageValue = Convert.EmptyToNull(req.query.message);
	if (messageValue != null) {
		var messageIsText = !"false".equalsIgnoreCase(req.query.messageIsText);
		try {
			message = messageIsText ? new Appendix_Message(messageValue) : new Appendix_Message(Convert.ParseHexString(messageValue));
		} catch (e) {
			throw new Error(JsonResponses.IncorrectArbitraryMessage);
		}
	}
	var publicKeyAnnouncement = null;
	var recipientPublicKey = Convert.EmptyToNull(req.query.recipientPublicKey);
	if (recipientPublicKey != null) {
		publicKeyAnnouncement = new Appendix_PublicKeyAnnouncement(Convert.ParseHexString(recipientPublicKey));
	}

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
		var builder = {
			deadline: deadline,
			senderPublicKey: publicKey,
			amountMilliLm: amountMilliLm,
			feeMilliLm: feeMilliLm,
			referencedTransactionFullHash: referencedTransactionFullHash,
			attachment: attachment
			);
		if (attachment.GetTransactionType().HasRecipient()) {
			builder.recipientId = recipientId;
		}
		if (encryptedMessage != null) {
			builder.encryptedMessage = encryptedMessage;
		}
		if (message != null) {
			builder.message = message;
		}
		if (publicKeyAnnouncement != null) {
			builder.publicKeyAnnouncement = publicKeyAnnouncement;
		}
		if (encryptToSelfMessage != null) {
			builder.encryptToSelfMessage = encryptToSelfMessage;
		}
		var transaction = Transactions.NewOrdinaryPaymentTransaction(builder);
		transaction.Validate();

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
