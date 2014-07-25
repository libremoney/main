/**!
 * LibreMoney 0.0
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var Convert = require(__dirname + '/../../Util/Convert');
var JsonResponses = require(__dirname + '/../JsonResponses');
var ParameterParser = require(__dirname + '/../ParameterParser');


//super("account");
function GetAccountPublicKey(req, res) {
	var account = ParameterParser.GetAccount(req);
	if (account.GetPublicKey() != null) {
		var response = {};
		response.publicKey = Convert.ToHexString(account.GetPublicKey());
		res.send(response);
	} else {
		res.send({});
	}
}

module.exports = GetAccountPublicKey;
