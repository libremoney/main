/**!
 * LibreMoney ConvertAccount 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

if (typeof module !== "undefined") {
	var Convert = require(__dirname + '/Convert');
	var ReedSolomon = require(__dirname + '/ReedSolomon');
}


var ConvertAccount = function() {
}();

ConvertAccount.ParseAccountId = function(account) {
	if (typeof account == 'undefined' || account == null) {
		return null;
	}
	account = account.toUpperCase();
	if (account.startsWith("LMA-")) {
		return Convert.ZeroToNull(RsDecode(account.substring(4)));
	} else {
		return Convert.ParseUnsignedLong(account);
	}
}

ConvertAccount.RsAccount = function(accountId) {
	return "LMA-" + RsEncode(Convert.NullToZero(accountId));
}

ConvertAccount.RsDecode = function(rsString) {
	rsString = rsString.toUpperCase();
	id = ReedSolomon.Decode(rsString);
	if (rsString != ReedSolomon.Encode(id)) {
		throw new Error("ERROR: Reed-Solomon decoding of " + rsString + " not reversible, decoded to " + id);
	}
	return id;
}

// id - BigInt
ConvertAccount.RsEncode = function(id) {
	return ReedSolomon.EncodeBigInt(id);
}



if (typeof module !== "undefined") {
	module.exports = ConvertAccount;
}
