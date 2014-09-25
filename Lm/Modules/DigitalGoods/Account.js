/**!
 * LibreMoney Account 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var Collections = require(__dirname + '/../Collections');
var Convert = require(__dirname + '/../../Util/Convert');


function Account_GetAssetBalancesQNT() {
	return Collections.UnmodifiableMap(this.assetBalances);
}

function Account_GetUnconfirmedAssetBalanceQNT(assetId) {
	return this.unconfirmedAssetBalances[assetId];
}

function Account_GetUnconfirmedAssetBalancesQNT() {
	return Collections.UnmodifiableMap(this.unconfirmedAssetBalances);
}

function Account_GetAssetBalanceQNT(assetId) {
	throw new Error('Not implementted');
	/*
	return Convert.nullToZero(assetBalances.get(assetId));
	*/
}

function Account_AddToAssetBalanceQNT(assetId, quantityQNT) {
	throw new Error('Not implementted');
	/*
	Long assetBalance;
	synchronized (this) {
		assetBalance = assetBalances.get(assetId);
		assetBalance = assetBalance == null ? quantityQNT : Convert.safeAdd(assetBalance, quantityQNT);
		if (assetBalance > 0) {
			assetBalances.put(assetId, assetBalance);
		} else if (assetBalance == 0) {
			assetBalances.remove(assetId);
		} else {
			throw new DoubleSpendingException("Negative asset balance for account " + Convert.toUnsignedLong(id));
		}
	}
	listeners.notify(this, Event.ASSET_BALANCE);
	assetListeners.notify(new AccountAsset(id, assetId, assetBalance), Event.ASSET_BALANCE);
	*/
}

function Account_AddToUnconfirmedAssetBalanceQNT(assetId, quantityQNT) {
	throw new Error('Not implementted');
	/*
	Long unconfirmedAssetBalance;
	synchronized (this) {
		unconfirmedAssetBalance = unconfirmedAssetBalances.get(assetId);
		unconfirmedAssetBalance = unconfirmedAssetBalance == null ? quantityQNT : Convert.safeAdd(unconfirmedAssetBalance, quantityQNT);
		if (unconfirmedAssetBalance > 0) {
			unconfirmedAssetBalances.put(assetId, unconfirmedAssetBalance);
		} else if (unconfirmedAssetBalance == 0) {
			unconfirmedAssetBalances.remove(assetId);
		} else {
			throw new DoubleSpendingException("Negative unconfirmed asset balance for account " + Convert.toUnsignedLong(id));
		}
	}
	listeners.notify(this, Event.UNCONFIRMED_ASSET_BALANCE);
	assetListeners.notify(new AccountAsset(id, assetId, unconfirmedAssetBalance), Event.UNCONFIRMED_ASSET_BALANCE);
	*/
}

function Account_AddToAssetAndUnconfirmedAssetBalanceQNT(assetId, quantityQNT) {
	throw new Error('Not implementted');
	/*
	Long assetBalance;
	Long unconfirmedAssetBalance;
	synchronized (this) {
		assetBalance = assetBalances.get(assetId);
		assetBalance = assetBalance == null ? quantityQNT : Convert.safeAdd(assetBalance, quantityQNT);
		if (assetBalance > 0) {
			assetBalances.put(assetId, assetBalance);
		} else if (assetBalance == 0) {
			assetBalances.remove(assetId);
		} else {
			throw new DoubleSpendingException("Negative unconfirmed asset balance for account " + Convert.toUnsignedLong(id));
		}
		unconfirmedAssetBalance = unconfirmedAssetBalances.get(assetId);
		unconfirmedAssetBalance = unconfirmedAssetBalance == null ? quantityQNT : Convert.safeAdd(unconfirmedAssetBalance, quantityQNT);
		if (unconfirmedAssetBalance > 0) {
			unconfirmedAssetBalances.put(assetId, unconfirmedAssetBalance);
		} else if (unconfirmedAssetBalance == 0) {
			unconfirmedAssetBalances.remove(assetId);
		} else {
			throw new DoubleSpendingException("Negative unconfirmed asset balance for account " + Convert.toUnsignedLong(id));
		}
	}
	listeners.notify(this, Event.ASSET_BALANCE);
	listeners.notify(this, Event.UNCONFIRMED_ASSET_BALANCE);
	assetListeners.notify(new AccountAsset(id, assetId, assetBalance), Event.ASSET_BALANCE);
	assetListeners.notify(new AccountAsset(id, assetId, unconfirmedAssetBalance), Event.UNCONFIRMED_ASSET_BALANCE);
	*/
}


Account.prototype.AddToAssetAndUnconfirmedAssetBalanceQNT = Account_AddToAssetAndUnconfirmedAssetBalanceQNT;
Account.prototype.AddToAssetBalanceQNT = Account_AddToAssetBalanceQNT;
Account.prototype.AddToUnconfirmedAssetBalanceQNT = Account_AddToUnconfirmedAssetBalanceQNT;
Account.prototype.GetAssetBalanceQNT = Account_GetAssetBalanceQNT;
Account.prototype.GetAssetBalancesQNT = Account_GetAssetBalancesQNT;
Account.prototype.GetUnconfirmedAssetBalanceQNT = Account_GetUnconfirmedAssetBalanceQNT;
Account.prototype.GetUnconfirmedAssetBalancesQNT = Account_GetUnconfirmedAssetBalancesQNT;


module.exports = Account;
