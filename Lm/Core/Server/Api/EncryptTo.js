/**!
 * LibreMoney EncryptTo api 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var Accounts = require(__dirname + '/../../Accounts');
var Core = require(__dirname + '/../../Core');
var JsonData = require(__dirname + '/../../Server/JsonData');
var JsonResponses = require(__dirname + '/../../Server/JsonResponses');
var ParameterParser = require(__dirname + '/../../Server/ParameterParser');


//super(new APITag[] {APITag.MESSAGES}, "recipient", "messageToEncrypt", "messageToEncryptIsText", "secretPhrase");
function EncryptTo(req, res) {
	Core.GetRecipientId(req.query.recipient, function(err, recipientId) {
		if (err) {
			res.send();
		}
		var recipientAccount = Accounts.GetAccount(recipientId);
		if (!recipientAccount || !recipientAccount.GetPublicKey()) {
			res.send(JsonResponses.IncorrectRecipient);
			return;
		}

		var encryptedData = ParameterParser.GetEncryptedMessage(req, recipientAccount);
		res.send(JsonData.EncryptedData(encryptedData));
		return;
	});
}


module.exports = EncryptTo;
