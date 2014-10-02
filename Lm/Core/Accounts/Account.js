/**!
 * LibreMoney Account 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

if (typeof module !== "undefined") {
	var Blockchain = require(__dirname + '/../Blockchain');
	var Collections = require(__dirname + '/../Collections');
	var Constants = require(__dirname + '/../../Lib/Constants');
	var Convert = require(__dirname + '/../../Lib/Util/Convert');
	var ConvertAccount = require(__dirname + '/../../Lib/Util/ConvertAccount');
	var Crypto = require(__dirname + '/../../Lib/Crypto/Crypto');
	var EncryptedData = require(__dirname + '/../../Lib/Crypto/EncryptedData');
	var GuaranteedBalance = require(__dirname + '/GuaranteedBalance');
	var Logger = require(__dirname + '/../../Lib/Util/Logger').GetLogger(module);
}


var maxTrackedBalanceConfirmations = 2881;


function Account(id) {
	this.id = id; // BigInt
	if (id != ConvertAccount.RsDecode(Crypto.RsEncode(id))) {
		Logger.LogMessage("CRITICAL ERROR: Reed-Solomon encoding fails for " + id);
	}
	this.height = Blockchain.GetLastBlock().GetHeight();
	this.currentLeasingHeightFrom = Constants.MaxInt;

	this.publicKey = null;
	this.keyHeight = null;
	this.balance = 0; // MilliLm
	this.unconfirmedBalance = 0; // MilliLm
	this.forgedBalance = 0; // MilliLm
	this.guaranteedBalances = {};

	this.currentLeasingHeightTo;
	this.currentLesseeId;
	this.nextLeasingHeightFrom;
	this.nextLeasingHeightTo;
	this.nextLesseeId;
	this.lessorIds = new Array(); //Collections.newSetFromMap(new ConcurrentHashMap<Long,Boolean>());

	this.assetBalances = {};
	this.unconfirmedAssetBalances = {};

	this.accountTypes = {}

	return this;
}

Account.prototype.AddToBalance = function(amount) {
	this.balance += amount;

	/*
	synchronized (this) {
		this.balance = Convert.SafeAdd(this.balance, amount);
		this.AddToGuaranteedBalance(amount);
	}
	if (amount != 0) {
		listeners.Notify(Event.BALANCE, this);
	}
	*/
}

// deprecated
Account.prototype.AddToBalanceMilliLm = function(amount) {
	return this.AddToBalance(amount);
}

Account.prototype.AddToUnconfirmedBalance = function(amount) {
	this.unconfirmedBalance += amount;

	/*
	if (amount == 0) {
		return;
	}
	synchronized (this) {
		this.unconfirmedBalance = Convert.SafeAdd(this.unconfirmedBalance, amount);
	}
	listeners.Notify(Event.UNCONFIRMED_BALANCE, this);
	*/
}

// deprecated
Account.prototype.AddToUnconfirmedBalanceMilliLm = function(amount) {
	return this.AddToUnconfirmedBalance(amount);
}

Account.prototype.AddToBalanceAndUnconfirmedBalance = function(amount) {
	this.balance += amount;
	this.unconfirmedBalance += amount

	/*
	synchronized (this) {
		this.balance = Convert.safeAdd(this.balance, amount);
		this.unconfirmedBalance = Convert.safeAdd(this.unconfirmedBalance, amount);
		addToGuaranteedBalance(amount);
	}
	if (amount != 0) {
		listeners.Notify(Event.BALANCE, this);
		listeners.Notify(Event.UNCONFIRMED_BALANCE, this);
	}
	*/
}

// deprecated
Account.prototype.AddToBalanceAndUnconfirmedBalanceMilliLm = function(amount) {
	return this.AddToBalanceAndUnconfirmedBalance(amount);
}

Account.prototype.AddToForgedBalance = function(amount) {
	this.forgedBalance = Convert.SafeAdd(this.forgedBalance, amount);
}

// deprecated
Account.prototype.AddToForgedBalanceMilliLm = function(amount) {
	AddToForgedBalance(amount);
}

Account.prototype.AddToGuaranteedBalance = function(amountMilliLm) {
	throw new Error('Not implementted');
	/*
	int blockchainHeight = Nxt.getBlockchain().getLastBlock().getHeight();
	GuaranteedBalance last = null;
	if (guaranteedBalances.size() > 0 && (last = guaranteedBalances.get(guaranteedBalances.size() - 1)).height > blockchainHeight) {
		// this only happens while last block is being popped off
		if (amountMilliLm > 0) {
			// this is a reversal of a withdrawal or a fee, so previous gb records need to be corrected
			for (GuaranteedBalance gb : guaranteedBalances) {
				gb.balance += amountMilliLm;
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
		} else if (amountMilliLm < 0) {
			gb.balance += amountMilliLm; // subtract current block withdrawals from all previous gb records
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
		guaranteedBalances.add(new GuaranteedBalance(blockchainHeight, balanceMilliLm));
	} else if (last.height == blockchainHeight) {
		// following transactions for same account in a newly added block
		// for the current block, guaranteedBalance (0 confirmations) must be same as balance
		last.balance = balanceMilliLm;
		last.ignore = false;
	} else {
		// should have been handled in the block popped off case
		throw new IllegalStateException("last guaranteed balance height exceeds blockchain height");
	}
	*/
}

Account.prototype.AddToGuaranteedBalanceMilliLm = function(amount) {
	return this.AddToGuaranteedBalance(amount);
}

Account.prototype.Apply = function(key, height) {
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

Account.prototype.CheckBalance = function() {
	throw new Error('Not implementted');
	/*
	if (id.equals(Genesis.CREATOR_ID)) {
		return;
	}
	if (balanceMilliLm < 0) {
		throw new DoubleSpendingException("Negative balance for account " + Convert.toUnsignedLong(id));
	}
	if (unconfirmedBalanceMilliLm < 0) {
		throw new DoubleSpendingException("Negative unconfirmed balance for account " + Convert.toUnsignedLong(id));
	}
	if (unconfirmedBalanceMilliLm > balanceMilliLm) {
		throw new DoubleSpendingException("Unconfirmed balance exceeds balance for account " + Convert.toUnsignedLong(id));
	}
	*/
}

Account.prototype.DecryptFrom = function(encryptedData, recipientSecretPhrase) {
	if (this.GetPublicKey() == null) {
		throw new Error("Sender account doesn't have a public key set");
	}
	return encryptedData.Decrypt(Crypto.GetPrivateKey(recipientSecretPhrase), this.publicKey);
}

Account.prototype.EncryptTo = function(data, senderSecretPhrase) {
	if (this.GetPublicKey() == null) {
		throw new Error("Recipient account doesn't have a public key set");
	}
	return EncryptedData.Encrypt(data, Crypto.GetPrivateKey(senderSecretPhrase), this.publicKey);
}

Account.prototype.GetBalance = function() {
	return this.balance;
}

// deprecated
Account.prototype.GetBalanceMilliLm = function() {
	return this.balance;
}

Account.prototype.GetCurrentLeasingHeightFrom = function() {
	return this.currentLeasingHeightFrom;
}

Account.prototype.GetCurrentLeasingHeightTo = function() {
	return this.currentLeasingHeightTo;
}

Account.prototype.GetCurrentLesseeId = function() {
	return this.currentLesseeId;
}

Account.prototype.GetEffectiveBalanceLm = function() {
	var lastBlock = Blockchain.GetLastBlock();

	if (lastBlock.GetHeight() >= Constants.TransparentForgingBlock6
			&& (this.GetPublicKey() == null || lastBlock.GetHeight() - this.keyHeight <= 1440)) {
		return 0; // cfb: Accounts with the public key revealed less than 1440 blocks ago are not allowed to generate blocks
	}

	if (lastBlock.GetHeight() < Constants.TransparentForgingBlock3 && this.height < Constants.TransparentForgingBlock2) {
		if (this.height == 0) {
			return this.GetBalance() / Constants.OneLm;
		}
		if (lastBlock.GetHeight() - this.height < 1440) {
			return 0;
		}
		var receivedInlastBlock = 0;
		var transactions = lastBlock.GetTransactions();
		for (transaction in transactions) {
			if (this.id.equals(transaction.GetRecipientId())) {
				receivedInlastBlock += transaction.GetAmount();
			}
		}
		return (this.GetBalance() - receivedInlastBlock) / Constants.OneLm;
	}

	if (lastBlock.GetHeight() < this.currentLeasingHeightFrom) {
		return (this.GetGuaranteedBalance(1440) + this.GetLessorsGuaranteedBalance()) / Constants.OneLm;
	}

	return this.GetLessorsGuaranteedBalance() / Constants.OneLm;
}

Account.prototype.GetForgedBalance = function() {
	return this.forgedBalance;
}

// deprecated
Account.prototype.GetForgedBalanceMilliLm = function() {
	return this.forgedBalance;
}

Account.prototype.GetGuaranteedBalance = function(numberOfConfirmations) {
	if (numberOfConfirmations >= Blockchain.GetLastBlock().GetHeight()) {
		return 0;
	}
	if (numberOfConfirmations > maxTrackedBalanceConfirmations || numberOfConfirmations < 0) {
		throw new Error("Number of required confirmations must be between 0 and " + maxTrackedBalanceConfirmations);
	}
	if (this.guaranteedBalances.IsEmpty()) {
		return 0;
	}
	var i = Collections.BinarySearch(this.guaranteedBalances, new GuaranteedBalance(Blockchain.GetLastBlock().GetHeight() - numberOfConfirmations, 0));
	if (i == -1) {
		return 0;
	}
	if (i < -1) {
		i = -i - 2;
	}
	if (i > this.guaranteedBalances.length - 1) {
		i = this.guaranteedBalances.length - 1;
	}
	var result;
	while ((result = this.guaranteedBalances[i]).ignore && i > 0) {
		i--;
	}
	return result.ignore || result.balance < 0 ? 0 : result.balance;
}

// deprecated
Account.prototype.GetGuaranteedBalanceMilliLm = function(numberOfConfirmations) {
	return this.GetGuaranteedBalance(numberOfConfirmations);
}

Account.prototype.GetId = function() {
	return this.id;
}

Account.prototype.GetLessorIds = function() {
	return Collections.UnmodifiableSet(this.lessorIds);
}

Account.prototype.GetLessorsGuaranteedBalance = function() {
	var lessorsGuaranteedBalance = 0;
	for (var i in this.lessorIds) {
		accountId = this.lessorIds[i];
		lessorsGuaranteedBalance += Accounts.GetAccount(accountId).GetGuaranteedBalance(1440);
	}
	return lessorsGuaranteedBalance;
}

// deprecated
Account.prototype.GetLessorsGuaranteedBalanceMilliLm = function() {
	return this.GetLessorsGuaranteedBalance();
}

Account.prototype.GetNextLeasingHeightFrom = function() {
	return this.nextLeasingHeightFrom;
}

Account.prototype.GetNextLeasingHeightTo = function() {
	return this.nextLeasingHeightTo;
}

Account.prototype.GetNextLesseeId = function() {
	return this.nextLesseeId;
}

Account.prototype.GetPublicKey = function() {
	if (this.keyHeight == -1) {
		return null;
	}
	return this.publicKey;
}

Account.prototype.GetUnconfirmedBalance = function() {
	return this.unconfirmedBalance;
}

Account.prototype.GetUnconfirmedBalanceMilliLm = function() {
	return this.unconfirmedBalance;
}

Account.prototype.LeaseEffectiveBalance = function(lesseeId, period) {
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
Account.prototype.SetOrVerify = function(key, height) {
	if (this.publicKey == null) {
		this.publicKey = key;
		this.keyHeight = -1;
		return true
	} else if (this.publicKey.toString("hex") == key.toString("hex")) {
		return true
	} else if (this.keyHeight == -1) {
		console.log("DUPLICATE KEY!!!");
		console.log("Account key for " + this.id + " was already set to a different one at the same height " + ", current height is " + height + ", rejecting new key");
		return false
	} else if (this.keyHeight >= height) {
		console.log("DUPLICATE KEY!!!");
		console.log("Changing key for account " + this.id + " at height " + height + ", was previously set to a different one at height " + this.keyHeight);
		this.publicKey = key;
		this.keyHeight = height;
		return true
	}
	console.log("DUPLICATE KEY!!!");
	console.log("Invalid key for account " + this.id + " at height " + height + ", was already set to a different one at height " + this.keyHeight);
	return false
}

Account.prototype.Undo = function(height) {
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


if (typeof module !== "undefined") {
	module.exports = Account;
}
