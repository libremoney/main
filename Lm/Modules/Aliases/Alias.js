/*!
 * LibreMoney Alias 0.2
 * Copyright(c) 2014 LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

// id - int
function Alias(account, id, aliasName, aliasUri, timestamp) {
	this.accountId = account.GetId();
	this.id = id;
	this.aliasName = aliasName;
	this.aliasUri = aliasUri;
	this.timestamp = timestamp;
}

Alias.prototype.GetAccountId = function() {
	return this.accountId;
}

Alias.prototype.GetAliasName = function() {
	return this.aliasName;
}

Alias.prototype.GetAliasUri = function() {
	return this.aliasUri;
}

Alias.prototype.GetId = function() {
	return this.id;
}

Alias.prototype.GetTimestamp = function() {
	return this.timestamp;
}


module.exports = Alias;
