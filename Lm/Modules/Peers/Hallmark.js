/**!
 * LibreMoney Hallmark 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

if (typeof module !== "undefined") {
	var Accounts = require(__dirname + '/../../Core/Accounts');
}


function Hallmark(hallmarkString, publicKey, signature, host, weight, date, isValid) {
	this.hallmarkString = hallmarkString;
	this.host = host;
	this.publicKey = publicKey;
	this.accountId = Accounts.GetId(publicKey);
	this.signature = signature;
	this.weight = weight;
	this.date = date;
	this.isValid = isValid;
	return this;
}

Hallmark.prototype.GetAccountId = function() {
	return this.accountId;
}

Hallmark.prototype.GetDate = function() {
	return this.date;
}

Hallmark.prototype.GetHallmarkString = function() {
	return this.hallmarkString;
}

Hallmark.prototype.GetHost = function() {
	return this.host;
}

Hallmark.prototype.GetPublicKey = function() {
	return this.publicKey;
}

Hallmark.prototype.GetSignature = function() {
	return this.signature;
}

Hallmark.prototype.GetWeight = function() {
	return this.weight;
}

Hallmark.prototype.IsValid = function() {
	return this.isValid;
}


if (typeof module !== "undefined") {
	module.exports = Hallmark;
}
