/**!
 * LibreMoney account 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var Blockchain = require(__dirname + '/../Blockchain');
var Constants = require(__dirname + '/../Constants');
var Convert = require(__dirname + '/../Util/Convert');
var Crypto = require(__dirname + '/../Crypto/Crypto');
var Logger = require(__dirname + '/../Util/Logger').GetLogger(module);


function Account(id) {
	this.id = id; // BigInt
	if (id != Crypto.RsDecode(Crypto.RsEncode(id))) {
		Logger.LogMessage("CRITICAL ERROR: Reed-Solomon encoding fails for " + id);
	}
	this.height = Blockchain.GetLastBlock().GetHeight();
	this.currentLeasingHeightFrom = Constants.MaxInt;

	this.publicKey;
	this.keyHeight;
	this.balanceMilliLm;
	this.unconfirmedBalanceMilliLm;
	this.forgedBalanceMilliLm;
	this.guaranteedBalances = new Array();

	this.currentLeasingHeightTo;
	this.currentLesseeId;
	this.nextLeasingHeightFrom;
	this.nextLeasingHeightTo;
	this.nextLesseeId;
	this.lessorIds = new Array(); //Collections.newSetFromMap(new ConcurrentHashMap<Long,Boolean>());

	this.assetBalances = new Array(); //HashMap<>();
	this.unconfirmedAssetBalances = new Array(); //HashMap<>();

	this.name;
	this.description;

	return this;
}

function DecryptFrom(encryptedData, recipientSecretPhrase) {
	throw new Error('Not implementted');
	/*
	if (getPublicKey() == null) {
		throw new IllegalArgumentException("Sender account doesn't have a public key set");
	}
	return encryptedData.decrypt(Crypto.getPrivateKey(recipientSecretPhrase), publicKey);
	*/
}

function EncryptTo(data, senderSecretPhrase) {
	throw new Error('Not implementted');
	/*
	if (getPublicKey() == null) {
		throw new IllegalArgumentException("Recipient account doesn't have a public key set");
	}
	return EncryptedData.encrypt(data, Crypto.getPrivateKey(senderSecretPhrase), publicKey);
	*/
}

function GetBalanceMilliLm() {
	return this.balanceMilliLm;
}

function GetDescription() {
	return this.description;
}

function GetEffectiveBalanceLm() {
	var lastBlock = Blockchain.GetLastBlock();

	if (lastBlock.GetHeight() >= Constants.TransparentForgingBlock6
			&& (this.GetPublicKey() == null || lastBlock.GetHeight() - this.keyHeight <= 1440)) {
		return 0; // cfb: Accounts with the public key revealed less than 1440 blocks ago are not allowed to generate blocks
	}

	if (lastBlock.GetHeight() < Constants.TransparentForgingBlock3 && this.height < Constants.TransparentForgingBlock2) {
		if (this.height == 0) {
			return this.GetBalanceMilliLm() / Constants.OneLm;
		}
		if (lastBlock.GetHeight() - this.height < 1440) {
			return 0;
		}
		var receivedInlastBlock = 0;
		var transactions = lastBlock.GetTransactions();
		for (transaction in transactions) {
			if (this.id.equals(transaction.GetRecipientId())) {
				receivedInlastBlock += transaction.GetAmountMilliLm();
			}
		}
		return (this.GetBalanceMilliLm() - receivedInlastBlock) / Constants.OneLm;
	}

	if (lastBlock.GetHeight() < this.currentLeasingHeightFrom) {
		return (this.GetGuaranteedBalanceMilliLm(1440) + this.GetLessorsGuaranteedBalanceMilliLm()) / Constants.OneLm;
	}

	return this.GetLessorsGuaranteedBalanceMilliLm() / Constants.OneLm;
}

function GetForgedBalanceMilliLm() {
	return this.forgedBalanceMilliLm;
}

function GetId() {
	return this.id;
}

function GetName() {
	return this.name;
}

function GetPublicKey() {
	if (this.keyHeight == -1) {
		return null;
	}
	return publicKey;
}

function GetUnconfirmedBalanceMilliLm() {
	return this.unconfirmedBalanceMilliLm;
}

function SetAccountInfo(name, description) {
	this.name = Convert.EmptyToNull(name.trim());
	this.description = Convert.EmptyToNull(description.trim());
}

function GetLessorsGuaranteedBalanceMilliLm() {
	throw new Error('Not implementted');
	/*
	long lessorsGuaranteedBalanceNQT = 0;
	for (Long accountId : lessorIds) {
		lessorsGuaranteedBalanceNQT += Account.getAccount(accountId).getGuaranteedBalanceNQT(1440);
	}
	return lessorsGuaranteedBalanceNQT;
	*/
}

function GetGuaranteedBalanceMilliLm(numberOfConfirmations) {
	throw new Error('Not implementted');
	/*
	if (numberOfConfirmations >= Nxt.getBlockchain().getLastBlock().getHeight()) {
		return 0;
	}
	if (numberOfConfirmations > maxTrackedBalanceConfirmations || numberOfConfirmations < 0) {
		throw new IllegalArgumentException("Number of required confirmations must be between 0 and " + maxTrackedBalanceConfirmations);
	}
	if (guaranteedBalances.isEmpty()) {
		return 0;
	}
	int i = Collections.binarySearch(guaranteedBalances, new GuaranteedBalance(Nxt.getBlockchain().getLastBlock().getHeight() - numberOfConfirmations, 0));
	if (i == -1) {
		return 0;
	}
	if (i < -1) {
		i = -i - 2;
	}
	if (i > guaranteedBalances.size() - 1) {
		i = guaranteedBalances.size() - 1;
	}
	GuaranteedBalance result;
	while ((result = guaranteedBalances.get(i)).ignore && i > 0) {
		i--;
	}
	return result.ignore || result.balance < 0 ? 0 : result.balance;
	*/
}

function GetUnconfirmedAssetBalanceQNT(assetId) {
	return this.unconfirmedAssetBalances[assetId];
}

function GetAssetBalancesQNT() {
	throw new Error('Not implementted');
	/*
	return Collections.unmodifiableMap(assetBalances);
	*/
}

function GetUnconfirmedAssetBalancesQNT() {
	throw new Error('Not implementted');
	/*
	return Collections.unmodifiableMap(unconfirmedAssetBalances);
	*/
}

function GetCurrentLesseeId() {
	return this.currentLesseeId;
}

function GetNextLesseeId() {
	return this.nextLesseeId;
}

function GetCurrentLeasingHeightFrom() {
	return this.currentLeasingHeightFrom;
}

function GetCurrentLeasingHeightTo() {
	return this.currentLeasingHeightTo;
}

function GetNextLeasingHeightFrom() {
	return this.nextLeasingHeightFrom;
}

function GetNextLeasingHeightTo() {
	return this.nextLeasingHeightTo;
}

function GetLessorIds() {
	throw new Error('Not implementted');
	/*
	return Collections.unmodifiableSet(lessorIds);
	*/
}

function LeaseEffectiveBalance(lesseeId, period) {
	throw new Error('Not implementted');
	/*
	Account lessee = Account.getAccount(lesseeId);
	if (lessee != null && lessee.getPublicKey() != null) {
		Block lastBlock = Nxt.getBlockchain().getLastBlock();
		leasingAccounts.put(this.getId(), this);
		if (currentLeasingHeightFrom == Integer.MAX_VALUE) {

			currentLeasingHeightFrom = lastBlock.getHeight() + 1440;
			currentLeasingHeightTo = currentLeasingHeightFrom + period;
			currentLesseeId = lesseeId;
			nextLeasingHeightFrom = Integer.MAX_VALUE;
			leaseListeners.Notify(Event.LEASE_SCHEDULED,
					new AccountLease(this.getId(), lesseeId, currentLeasingHeightFrom, currentLeasingHeightTo));

		} else {

			nextLeasingHeightFrom = lastBlock.getHeight() + 1440;
			if (nextLeasingHeightFrom < currentLeasingHeightTo) {
				nextLeasingHeightFrom = currentLeasingHeightTo;
			}
			nextLeasingHeightTo = nextLeasingHeightFrom + period;
			nextLesseeId = lesseeId;
			leaseListeners.Notify(Event.LEASE_SCHEDULED
					new AccountLease(this.getId(), lesseeId, nextLeasingHeightFrom, nextLeasingHeightTo));

		}
	}
	*/
}

// returns true iff:
// this.publicKey is set to null (in which case this.publicKey also gets set to key)
// or
// this.publicKey is already set to an array equal to key
function SetOrVerify(key, height) {
	throw new Error('Not implementted');
	/*
	if (this.publicKey == null) {
		this.publicKey = key;
		this.keyHeight = -1;
		return true;
	} else if (Arrays.equals(this.publicKey, key)) {
		return true;
	} else if (this.keyHeight == -1) {
		Logger.logMessage("DUPLICATE KEY!!!");
		Logger.logMessage("Account key for " + Convert.toUnsignedLong(id) + " was already set to a different one at the same height "
				+ ", current height is " + height + ", rejecting new key");
		return false;
	} else if (this.keyHeight >= height) {
		Logger.logMessage("DUPLICATE KEY!!!");
		Logger.logMessage("Changing key for account " + Convert.toUnsignedLong(id) + " at height " + height
				+ ", was previously set to a different one at height " + keyHeight);
		this.publicKey = key;
		this.keyHeight = height;
		return true;
	}
	Logger.logMessage("DUPLICATE KEY!!!");
	Logger.logMessage("Invalid key for account " + Convert.toUnsignedLong(id) + " at height " + height
			+ ", was already set to a different one at height " + keyHeight);
	return false;
	*/
}

function Apply(key, height) {
	throw new Error('Not implementted');
	/*
	if (! setOrVerify(key, this.height)) {
		throw new IllegalStateException("Public key mismatch");
	}
	if (this.publicKey == null) {
		throw new IllegalStateException("Public key has not been set for account " + Convert.toUnsignedLong(id)
				+" at height " + height + ", key height is " + keyHeight);
	}
	if (this.keyHeight == -1 || this.keyHeight > height) {
		this.keyHeight = height;
	}
	*/
}

function Undo(height) {
	throw new Error('Not implementted');
	/*
	if (this.keyHeight >= height) {
		Logger.logDebugMessage("Unsetting key for account " + Convert.toUnsignedLong(id) + " at height " + height
				+ ", was previously set at height " + keyHeight);
		this.publicKey = null;
		this.keyHeight = -1;
	}
	if (this.height == height) {
		Logger.logDebugMessage("Removing account " + Convert.toUnsignedLong(id) + " which was created in the popped off block");
		accounts.remove(this.getId());
	}
	*/
}

function GetAssetBalanceQNT(assetId) {
	throw new Error('Not implementted');
	/*
	return Convert.nullToZero(assetBalances.get(assetId));
	*/
}

function AddToAssetBalanceQNT(assetId, quantityQNT) {
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

function AddToUnconfirmedAssetBalanceQNT(assetId, quantityQNT) {
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

function AddToAssetAndUnconfirmedAssetBalanceQNT(assetId, quantityQNT) {
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

function AddToBalanceMilliLm(amountNQT) {
	throw new Error('Not implementted');
	/*
	synchronized (this) {
		this.balanceNQT = Convert.safeAdd(this.balanceNQT, amountNQT);
		addToGuaranteedBalanceNQT(amountNQT);
	}
	if (amountNQT != 0) {
		listeners.Notify(Event.BALANCE, this);
	}
	*/
}

function AddToUnconfirmedBalanceMilliLm(amountNQT) {
	throw new Error('Not implementted');
	/*
	if (amountNQT == 0) {
		return;
	}
	synchronized (this) {
		this.unconfirmedBalanceNQT = Convert.safeAdd(this.unconfirmedBalanceNQT, amountNQT);
	}
	listeners.Notify(Event.UNCONFIRMED_BALANCE, this);
	*/
}

function AddToBalanceAndUnconfirmedBalanceMilliLm(amountNQT) {
	throw new Error('Not implementted');
	/*
	synchronized (this) {
		this.balanceNQT = Convert.safeAdd(this.balanceNQT, amountNQT);
		this.unconfirmedBalanceNQT = Convert.safeAdd(this.unconfirmedBalanceNQT, amountNQT);
		addToGuaranteedBalanceNQT(amountNQT);
	}
	if (amountNQT != 0) {
		listeners.Notify(Event.BALANCE, this);
		listeners.Notify(Event.UNCONFIRMED_BALANCE, this);
	}
	*/
}

function AddToForgedBalanceMilliLm(amountNQT) {
	throw new Error('Not implementted');
	/*
	synchronized(this) {
		this.forgedBalanceNQT = Convert.safeAdd(this.forgedBalanceNQT, amountNQT);
	}
	*/
}

function AddToGuaranteedBalanceMilliLm(amountNQT) {
	throw new Error('Not implementted');
	/*
	int blockchainHeight = Nxt.getBlockchain().getLastBlock().getHeight();
	GuaranteedBalance last = null;
	if (guaranteedBalances.size() > 0 && (last = guaranteedBalances.get(guaranteedBalances.size() - 1)).height > blockchainHeight) {
		// this only happens while last block is being popped off
		if (amountNQT > 0) {
			// this is a reversal of a withdrawal or a fee, so previous gb records need to be corrected
			for (GuaranteedBalance gb : guaranteedBalances) {
				gb.balance += amountNQT;
			}
		} // deposits don't need to be reversed as they have never been applied to old gb records to begin with
		last.ignore = true; // set dirty flag
		return; // block popped off, no further processing
	}
	int trimTo = 0;
	for (int i = 0; i < guaranteedBalances.size(); i++) {
		GuaranteedBalance gb = guaranteedBalances.get(i);
		if (gb.height < blockchainHeight - maxTrackedBalanceConfirmations
				&& i < guaranteedBalances.size() - 1
				&& guaranteedBalances.get(i + 1).height >= blockchainHeight - maxTrackedBalanceConfirmations) {
			trimTo = i; // trim old gb records but keep at least one at height lower than the supported maxTrackedBalanceConfirmations
		} else if (amountNQT < 0) {
			gb.balance += amountNQT; // subtract current block withdrawals from all previous gb records
		}
		// ignore deposits when updating previous gb records
	}
	if (trimTo > 0) {
		Iterator<GuaranteedBalance> iter = guaranteedBalances.iterator();
		while (iter.hasNext() && trimTo > 0) {
			iter.next();
			iter.remove();
			trimTo--;
		}
	}
	if (guaranteedBalances.size() == 0 || last.height < blockchainHeight) {
		// this is the first transaction affecting this account in a newly added block
		guaranteedBalances.add(new GuaranteedBalance(blockchainHeight, balanceNQT));
	} else if (last.height == blockchainHeight) {
		// following transactions for same account in a newly added block
		// for the current block, guaranteedBalance (0 confirmations) must be same as balance
		last.balance = balanceNQT;
		last.ignore = false;
	} else {
		// should have been handled in the block popped off case
		throw new IllegalStateException("last guaranteed balance height exceeds blockchain height");
	}
	*/
}

function CheckBalance() {
	throw new Error('Not implementted');
	/*
	if (id.equals(Genesis.CREATOR_ID)) {
		return;
	}
	if (balanceNQT < 0) {
		throw new DoubleSpendingException("Negative balance for account " + Convert.toUnsignedLong(id));
	}
	if (unconfirmedBalanceNQT < 0) {
		throw new DoubleSpendingException("Negative unconfirmed balance for account " + Convert.toUnsignedLong(id));
	}
	if (unconfirmedBalanceNQT > balanceNQT) {
		throw new DoubleSpendingException("Unconfirmed balance exceeds balance for account " + Convert.toUnsignedLong(id));
	}
	*/
}


Account.prototype.AddToAssetAndUnconfirmedAssetBalanceQNT = AddToAssetAndUnconfirmedAssetBalanceQNT;
Account.prototype.AddToAssetBalanceQNT = AddToAssetBalanceQNT;
Account.prototype.AddToBalanceAndUnconfirmedBalanceMilliLm = AddToBalanceAndUnconfirmedBalanceMilliLm;
Account.prototype.AddToBalanceMilliLm = AddToBalanceMilliLm;
Account.prototype.AddToForgedBalanceMilliLm = AddToForgedBalanceMilliLm;
Account.prototype.AddToGuaranteedBalanceMilliLm = AddToGuaranteedBalanceMilliLm;
Account.prototype.AddToUnconfirmedAssetBalanceQNT = AddToUnconfirmedAssetBalanceQNT;
Account.prototype.AddToUnconfirmedBalanceMilliLm = AddToUnconfirmedBalanceMilliLm;
Account.prototype.Apply = Apply;
Account.prototype.CheckBalance = CheckBalance;
Account.prototype.EncryptTo = EncryptTo;
Account.prototype.GetId = GetId;
Account.prototype.GetAssetBalanceQNT = GetAssetBalanceQNT;
Account.prototype.GetAssetBalancesQNT = GetAssetBalancesQNT;
Account.prototype.GetBalanceMilliLm = GetBalanceMilliLm;
Account.prototype.GetCurrentLeasingHeightFrom = GetCurrentLeasingHeightFrom;
Account.prototype.GetCurrentLeasingHeightTo = GetCurrentLeasingHeightTo;
Account.prototype.GetCurrentLesseeId = GetCurrentLesseeId;
Account.prototype.GetDescription = GetDescription;
Account.prototype.GetEffectiveBalanceLm = GetEffectiveBalanceLm;
Account.prototype.GetForgedBalanceMilliLm = GetForgedBalanceMilliLm;
Account.prototype.GetGuaranteedBalanceMilliLm = GetGuaranteedBalanceMilliLm;
Account.prototype.GetLessorIds = GetLessorIds;
Account.prototype.GetLessorsGuaranteedBalanceMilliLm = GetLessorsGuaranteedBalanceMilliLm;
Account.prototype.GetName = GetName;
Account.prototype.GetNextLeasingHeightFrom = GetNextLeasingHeightFrom;
Account.prototype.GetNextLeasingHeightTo = GetNextLeasingHeightTo;
Account.prototype.GetNextLesseeId = GetNextLesseeId;
Account.prototype.GetPublicKey = GetPublicKey;
Account.prototype.GetUnconfirmedBalanceMilliLm = GetUnconfirmedBalanceMilliLm;
Account.prototype.GetUnconfirmedAssetBalanceQNT = GetUnconfirmedAssetBalanceQNT;
Account.prototype.GetUnconfirmedAssetBalancesQNT = GetUnconfirmedAssetBalancesQNT;
Account.prototype.LeaseEffectiveBalance = LeaseEffectiveBalance;
Account.prototype.SetOrVerify = SetOrVerify;
Account.prototype.Undo = Undo;


module.exports = Account;
