/**!
 * LibreMoney SendMoney api 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var ParameterParser = require(__dirname + "/../../Server/ParameterParser");
var CreateTransaction = require(__dirname + "/../../Server/CreateTransaction");


//super(new APITag[] {APITag.ACCOUNTS, APITag.CREATE_TRANSACTION}, "recipient", "amountNQT");
function SendMoney(req, res) {
	var recipient = ParameterParser.GetRecipientId(req);
	var amountMilliLm = ParameterParser.GetAmountMilliLm(req);
	var account = ParameterParser.GetSenderAccount(req);
	return CreateTransaction(req, res, account, recipient, amountMilliLm);
}

module.exports = SendMoney;
