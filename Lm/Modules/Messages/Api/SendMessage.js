/**!
 * LibreMoney SendMessage api 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var Core = require(__dirname + '/../../../Core');
var CreateTransaction = require(__dirname + '/../../../Core/ServerCreateTransaction');
var ParameterParser = require(__dirname + '/../../../Core/Server/ParameterParser');


//super(new APITag[] {APITag.MESSAGES, APITag.CREATE_TRANSACTION}, "recipient");
function SendMessage(req, res) {
	Core.GetRecipientId(req.query.recipient, function(err, recipient) {
		if (err) {
			res.send(err);
			return;
		}
		var account = ParameterParser.GetSenderAccount(req);
		res.send(CreateTransaction(req, account, recipient, 0, Attachment.ARBITRARY_MESSAGE))
	});
}


module.exports = SendMessage;
