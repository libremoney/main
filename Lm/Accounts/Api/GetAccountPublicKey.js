/**!
 * LibreMoney GetAccountPublicKey api 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var Convert = require(__dirname + '/../../Util/Convert');
var JsonResponses = require(__dirname + '/../../Server/JsonResponses');
var ParameterParser = require(__dirname + '/../../Server/ParameterParser');


//super(new APITag[] {APITag.ACCOUNTS}, "account");
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
