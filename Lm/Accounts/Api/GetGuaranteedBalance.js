/**!
 * LibreMoney GetGuaranteedBalance 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var ParameterParser = require(__dirname + '/../../Server/ParameterParser');


//super(new APITag[] {APITag.ACCOUNTS, APITag.FORGING}, "account", "numberOfConfirmations");
function GetGuaranteedBalance(req, res) {
	var account = ParameterParser.GetAccount(req);
	var numberOfConfirmations = ParameterParser.GetNumberOfConfirmations(req);
	var response = {};
	if (account == null) {
		response.guaranteedBalanceMilliLm = "0";
	} else {
		response.guaranteedBalanceMilliLm = account.GetGuaranteedBalanceMilliLm(numberOfConfirmations);
	}
	res.send(response);
}


module.exports = GetGuaranteedBalance;
