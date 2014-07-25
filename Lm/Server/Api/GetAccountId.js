/**!
 * LibreMoney 0.0
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var Accounts = require(__dirname + '/../../Accounts');
var Convert = require(__dirname + '/../../Util/Convert');
var Crypto = require(__dirname + '/../../Crypto/Crypto');
var JsonResponses = require(__dirname + '/../JsonResponses');


//super("secretPhrase");
// POST
function GetAccountId(req, res) {
	var secretPhrase = req.query.secretPhrase;
	if (!secretPhrase) {
		res.send(JsonResponses.MissingSecretPhrase);
		return;
	}
	var publicKey = Crypto.GetPublicKey(secretPhrase);
	var response = {};
	var accountId = Accounts.GetId(publicKey);
	response.accountId = Convert.ToUnsignedLong(accountId);
	response.accountRS = Convert.RsAccount(accountId);
	res.send(response);
}

module.exports = GetAccountId;
