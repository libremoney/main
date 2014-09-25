/**!
 * LibreMoney GetAccountId api 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var Accounts = require(__dirname + '/../Accounts');
var Convert = require(__dirname + '/../../../Lib/Util/Convert');
var Crypto = require(__dirname + '/../../../Lib/Crypto/Crypto');
var JsonResponses = require(__dirname + '/../../Server/JsonResponses');


//super(new APITag[] {APITag.ACCOUNTS}, "secretPhrase", "publicKey");
// POST
function GetAccountId(req, res) {
	var accountId;
	var secretPhrase = Convert.EmptyToNull(req.query.secretPhrase);
	var publicKeyString = Convert.EmptyToNull(req.query.publicKey);
	if (secretPhrase) {
		var publicKey = Crypto.GetPublicKey(secretPhrase);
		accountId = Accounts.GetId(publicKey);
		publicKeyString = Convert.ToHexString(publicKey);
	} else if (publicKeyString) {
		accountId = Accounts.GetId(Convert.ParseHexString(publicKeyString));
	} else {
		res.send(JsonResponses.MissingSecretPhraseOrPublicKey);
		return;
	}
	var response = {};
	var accountId = Accounts.GetId(publicKey);
	JsonData.PutAccount(response, "account", accountId);
	response.publicKey = publicKeyString;
	res.send(response);
}

module.exports = GetAccountId;
