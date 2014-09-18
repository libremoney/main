/**!
 * LibreMoney 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

function AccountAsset(AccountId, AssetId, QuantityQNT) {
	this.AccountId = AccountId;
	this.AssetId = AssetId;
	this.QuantityQNT = QuantityQNT;
}

module.exports = AccountAsset;
