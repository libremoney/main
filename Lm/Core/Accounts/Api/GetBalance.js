/**!
 * LibreMoney GetBalance api 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var Core = require(__dirname + '/../../Core');
var JsonData = require(__dirname + '/../../Server/JsonData');


//super(new APITag[] {APITag.ACCOUNTS}, "account");
function GetBalance(req, res) {
	Core.GetAccount(req.query.account, function(err, account) {
		if (err) {
			res.send(err);
			return;
		}
		res.send(JsonData.AccountBalance(account));
	});
	return true;
}


module.exports = GetBalance;
