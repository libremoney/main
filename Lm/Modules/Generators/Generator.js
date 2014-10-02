/*!
 * LibreMoney Generator 0.2
 * Copyright(c) 2014 LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

if (typeof module !== "undefined") {
	var BlockchainProcessor = require(__dirname + '/../BlockchainProcessor');
}


function Generator(secretPhrase, publicKey, account) {
	this.secretPhrase = secretPhrase;
	this.publicKey = publicKey;
	// need to store publicKey in addition to accountId, because the account may not have had its publicKey set yet
	this.accountId = account.GetId();
	this.Forge(Convert.GetEpochTime()); // initialize deadline
	return this;
}

Generator.prototype.Forge = function(timestamp) {
	if (BlockchainProcessor.IsScanning()) {
		return;
	}

	/*
	Account account = Account.getAccount(accountId);
	if (account == null) {
		return;
	}
	long effectiveBalance = account.getEffectiveBalanceNXT();
	if (effectiveBalance <= 0) {
		return;
	}

	Block lastBlock = Nxt.getBlockchain().getLastBlock();

	if (lastBlock.getHeight() < Constants.DIGITAL_GOODS_STORE_BLOCK) {
		return;
	}

	if (! lastBlock.equals(lastBlocks.get(accountId))) {
		BigInteger hit = getHit(publicKey, lastBlock);
		lastBlocks.put(accountId, lastBlock);
		hits.put(accountId, hit);
		deadline = Math.max(getHitTime(account.getEffectiveBalanceNXT(), hit, lastBlock) - Convert.getEpochTime(), 0);
		listeners.Notify(Event.GENERATION_DEADLINE, this);
	}

	if (verifyHit(hits.get(accountId), effectiveBalance, lastBlock, timestamp)) {
		while (!BlockchainProcessor.GenerateBlock(secretPhrase, timestamp)) {
			if (Convert.getEpochTime() - timestamp > 10) {
				break;
			}
		 }
	 }
	*/
}

Generator.prototype.GetAccountId = function() {
	return this.accountId;
}

Generator.prototype.GetDeadline = function() {
	return this.deadline;
}

Generator.prototype.GetPublicKey = function() {
	return this.publicKey;
}


if (typeof module !== "undefined") {
	module.exports = Generator;
}
