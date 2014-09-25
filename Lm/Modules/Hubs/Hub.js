/**!
 * LibreMoney Hub 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */


function Hub(accountId, minFeePerByteMilliLm, uris) {
	this.accountId = accountId;
	this.minFeePerByteMilliLm = minFeePerByteMilliLm;
	this.uris = uris; //Collections.unmodifiableList(Arrays.asList(uris));
	return this;
}

function Hub_GetAccountId() {
	return this.accountId;
}

function Hub_GetMinFeePerByteMilliLm() {
	return this.minFeePerByteMilliLm;
}

function Hub_GetUris() {
	return this.uris;
}

Hub.prototype.GetAccountId = Hub_GetAccountId;
Hub.prototype.GetMinFeePerByteMilliLm = Hub_GetMinFeePerByteMilliLm;
Hub.prototype.GetUris = Hub_GetUris;

module.exports = Hub();
