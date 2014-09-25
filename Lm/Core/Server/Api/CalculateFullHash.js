/**!
 * LibreMoney CalculateFullHash api 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var Convert = require(__dirname + '/../../../Lib/Util/Convert');
var Crypto = require(__dirname + '/../../../Lib/Crypto/Crypto');
var JsonResponses = require(__dirname + '/../JsonResponses');


//super(new APITag[] {APITag.TRANSACTIONS}, "unsignedTransactionBytes", "signatureHash");
function CalculateFullHash(req, res) {
	var unsignedBytesString = Convert.EmptyToNull(req.query.unsignedTransactionBytes);
	var signatureHashString = Convert.EmptyToNull(req.query.signatureHash);

	if (!unsignedBytesString) {
		res.send(JsonResponses.MissingUnsignedBytes);
		return;
	} else if (!signatureHashString) {
		res.send(JsonResponses.MissingSignatureHash);
		return;
	}
	var digest = Crypto.Sha256();
	digest.update(Convert.ParseHexString(unsignedBytesString));
	var fullHash = digest.digest(Convert.ParseHexString(signatureHashString));
	var response = {};
	response.fullHash = Convert.ToHexString(fullHash);
	res.send(response);
}


module.exports = CalculateFullHash;
