/**!
 * LibreMoney GetGuaranteedBalance 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var Core = require(__dirname + '/../../Core');
var ParameterParser = require(__dirname + '/../../Server/ParameterParser');


//super(new APITag[] {APITag.ACCOUNTS, APITag.FORGING}, "account", "numberOfConfirmations");
function GetGuaranteedBalance(req, res) {
	Core.GetAccount(req.query.account, function() {
		if (err) {
			res.send(err);
			return;
		}
		var numberOfConfirmations = ParameterParser.GetNumberOfConfirmations(req);
		var response = {};
		if (account == null) {
			response.guaranteedBalanceMilliLm = "0";
		} else {
			response.guaranteedBalanceMilliLm = account.GetGuaranteedBalanceMilliLm(numberOfConfirmations);
		}
		res.send(response);
	});
}


module.exports = GetGuaranteedBalance;
