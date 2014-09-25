/**!
 * LibreMoney ReadMessage api 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var Accounts = require(__dirname + '/../../Accounts');
var Blockchain = require(__dirname + '/../../Blockchain');
var Convert = require(__dirname + '/../../Util/Convert');
var Crypto = require(__dirname + '/../../Crypto/Crypto');
var JsonResponses = require(__dirname + '/../JsonResponses');
var Logger = require(__dirname + "/../../Logger").GetLogger(module);


//super(new APITag[] {APITag.MESSAGES}, "transaction", "secretPhrase");
function ReadMessage() {
	var transactionIdString = Convert.EmptyToNull(req.query.transaction);
	if (transactionIdString == null) {
		return JsonResponses.MissingTransaction;
	}

	var transaction;
	try {
		transaction = Blockchain.GetTransaction(Convert.ParseUnsignedLong(transactionIdString));
		if (transaction == null) {
			return JsonResponses.UnknownTransaction;
		}
	} catch (e) {
		return JsonResponses.IncorrectTransaction;
	}

	var response = {};
	var senderAccount = Accounts.GetAccount(transaction.GetSenderId());
	var message = transaction.GetMessage();
	var encryptedMessage = transaction.GetEncryptedMessage();
	var encryptToSelfMessage = transaction.GetEncryptToSelfMessage();
	if (message == null && encryptedMessage == null && encryptToSelfMessage == null) {
		return {
			errorCode: 8,
			errorDescription: "No attached message found"
		}
	}
	if (message != null) {
		response.message = message.IsText() ? Convert.ToString(message.GetMessage()) : Convert.ToHexString(message.GetMessage());
	}
	var secretPhrase = Convert.EmptyToNull(req.query.secretPhrase);
	if (secretPhrase != null) {
		if (encryptedMessage != null) {
			var readerAccountId = Accounts.GetId(Crypto.GetPublicKey(secretPhrase));
			var account = senderAccount.GetId() == readerAccountId ? Accounts.GetAccount(transaction.GetRecipientId()) : senderAccount;
			if (account != null) {
				try {
					var decrypted = account.DecryptFrom(encryptedMessage.GetEncryptedData(), secretPhrase);
					response.decryptedMessage = encryptedMessage.IsText() ? Convert.ToString(decrypted) : Convert.ToHexString(decrypted);
				} catch (e) {
					Logger.debug("Decryption of message to recipient failed: " + e);
				}
			}
		}
		if (encryptToSelfMessage != null) {
			var account = Accounts.GetAccount(Crypto.GetPublicKey(secretPhrase));
			if (account != null) {
				try {
					var decrypted = account.DecryptFrom(encryptToSelfMessage.GetEncryptedData(), secretPhrase);
					response.decryptedMessageToSelf = encryptToSelfMessage.IsText() ? Convert.ToString(decrypted) : Convert.ToHexString(decrypted);
				} catch (e) {
					Logger.debug("Decryption of message to self failed: " + e);
				}
			}
		}
	}
	res.send(response);
}


module.exports = ReadMessage;
