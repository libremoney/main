/**!
 * LibreMoney GetAccountPublicKey api 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var Convert = require(__dirname + '/../../../Lib/Util/Convert');
var Core = require(__dirname + '/../../Core');


//super(new APITag[] {APITag.ACCOUNTS}, "account");
function GetAccountPublicKey(req, res) {
	Core.GetAccount(req.query.account, function(err, account) {
		if (err) {
			res.send(err);
			return;
		}
		if (account.GetPublicKey() != null) {
			var response = {};
			response.publicKey = Convert.ToHexString(account.GetPublicKey());
			res.send(response);
		} else {
			res.send({});
		}
	});
}


module.exports = GetAccountPublicKey;
