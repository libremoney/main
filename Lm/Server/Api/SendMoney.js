/**!
 * LibreMoney SendMoney api 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var ParameterParser = require(__dirname + "/../ParameterParser");
var Transactions = require(__dirname + "/../../Transactions");
var CreateTransaction = require(__dirname + "/../CreateTransaction");


//super("recipient", "amountNQT");
function SendMoney(req, res) {
	var recipient = ParameterParser.GetRecipientId(req);
	var amountMilliLm = ParameterParser.GetAmountMilliLm(req);
	var account = ParameterParser.GetSenderAccount(req);
	return CreateTransaction(req, res, account, recipient, amountMilliLm, null);
}

module.exports = SendMoney;
