/**!
 * LibreMoney SendMoney api 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var Core = require(__dirname + "/../../../Core");
var CreateTransaction = require(__dirname + "/../../../Core/Server/CreateTransaction");
var ParameterParser = require(__dirname + "/../../../Core/Server/ParameterParser");


//super(new APITag[] {APITag.ACCOUNTS, APITag.CREATE_TRANSACTION}, "recipient", "amountNQT");
function SendMoney(req, res) {
	Core.GetRecipientId(req.query.recipient, function(err, recipient) {
		if (err) {
			res.send(err);
			return;
		}
		var amountMilliLm = ParameterParser.GetAmountMilliLm(req);
		var account = ParameterParser.GetSenderAccount(req);
		res.send(CreateTransaction(req, res, account, recipient, amountMilliLm));
	});
}


module.exports = SendMoney;
