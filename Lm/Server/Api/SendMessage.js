/**!
 * LibreMoney SendMessage api 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var CreateTransaction = require(__dirname + '/../CreateTransaction');
var ParameterParser = require(__dirname + '/../ParameterParser');

//super(new APITag[] {APITag.MESSAGES, APITag.CREATE_TRANSACTION}, "recipient");
function SendMessage(req, res) {
	var recipient = ParameterParser.GetRecipientId(req);
	var account = ParameterParser.GetSenderAccount(req);
	res.send(CreateTransaction(req, account, recipient, 0, Attachment.ARBITRARY_MESSAGE))
}

module.exports = SendMessage;
