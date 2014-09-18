/*!
 * LibreMoney Alias 0.1
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

function GetAccountId() {
	return this.accountId;
}

function GetAliasName() {
	return this.aliasName;
}

function GetAliasUri() {
	return this.aliasUri;
}

function GetId() {
	return this.id;
}

function GetTimestamp() {
	return this.timestamp;
}


Alias.prototype.GetAccountId = GetAccountId;
Alias.prototype.GetAliasName = GetAliasName;
Alias.prototype.GetAliasUri = GetAliasUri;
Alias.prototype.GetId = GetId;
Alias.prototype.GetTimestamp = GetTimestamp;


module.exports = Alias;
