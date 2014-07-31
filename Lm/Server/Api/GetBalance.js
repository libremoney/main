/**!
 * LibreMoney 0.0
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var JsonData = require(__dirname + '/../JsonData');
var ParameterParser = require(__dirname + '/../ParameterParser');


//super("account");
function GetBalance(req, res) {
	res.send(JsonData.AccountBalance(ParameterParser.GetAccount(req)));
	return true;
}


module.exports = GetBalance;
