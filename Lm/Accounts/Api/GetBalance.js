/**!
 * LibreMoney GetBalance api 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var JsonData = require(__dirname + '/../../Server/JsonData');
var ParameterParser = require(__dirname + '/../../Server/ParameterParser');


//super(new APITag[] {APITag.ACCOUNTS}, "account");
function GetBalance(req, res) {
	res.send(JsonData.AccountBalance(ParameterParser.GetAccount(req)));
	return true;
}


module.exports = GetBalance;
