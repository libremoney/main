/**!
 * LibreMoney Asset 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

function Asset(assetId, accountId, name, description, quantityMilliLm, decimals) {
	this.assetId = assetId;
	this.accountId = accountId;
	this.name = name;
	this.description = description;
	this.quantityMilliLm = quantityMilliLm;
	this.decimals = decimals;
	return this;
}

function GetAccountId() {
	return this.accountId;
}

function GetDecimals() {
	return this.decimals;
}

function GetDescription() {
	return this.description;
}

function GetId() {
	return this.assetId;
}

function GetName() {
	return this.name;
}

function GetQuantityQNT() {
	return this.quantityQNT;
}


Asset.prototype.GetAccountId = GetAccountId;
Asset.prototype.GetDecimals = GetDecimals;
Asset.prototype.GetDescription = GetDescription;
Asset.prototype.GetId = GetId;
Asset.prototype.GetName = GetName;
Asset.prototype.GetQuantityQNT = GetQuantityQNT;


module.exports = Asset;
