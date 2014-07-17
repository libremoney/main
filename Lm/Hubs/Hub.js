/**!
 * LibreMoney hub 0.0
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */


function Hub(accountId, minFeePerByteMilliLm, uris) {
	var obj = {};
	var AccountId;
	var MinFeePerByteMilliLm;
	var uris = new Array(); // List<String>
	/*
	this.accountId = accountId;
	this.minFeePerByteMilliLm = minFeePerByteMilliLm;
	this.uris = Collections.unmodifiableList(Arrays.asList(uris));
	*/
	return obj;
}

function Hub_GetAccountId() {
	throw 'Not';
	/*
	return accountId;
	*/
}

function Hub_GetMinFeePerByteMilliLm() {
	throw 'Not';
	/*
	return minFeePerByteMilliLm;
	*/
}

function Hub_GetUris() {
	throw 'Not';
	/*
	return uris;
	*/
}

Hub.prototype.GetAccountId = Hub_GetAccountId;
Hub.prototype.GetMinFeePerByteMilliLm = Hub_GetMinFeePerByteMilliLm;
Hub.prototype.GetUris = Hub_GetUris;

module.exports = Hub();
