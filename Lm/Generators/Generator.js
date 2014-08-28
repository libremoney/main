/*!
 * LibreMoney Generator 0.1
 * Copyright(c) 2014 LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

/*
import nxt.crypto.Crypto;
import nxt.util.Convert;
import nxt.util.Listener;
import nxt.util.Listeners;
import nxt.util.Logger;
import nxt.util.ThreadPool;
*/

var BlockchainProcessor = require(__dirname + '/../BlockchainProcessor');


var lastTimestamp;


function Generator(secretPhrase, publicKey, account) {
	this.secretPhrase = secretPhrase;
	this.publicKey = publicKey;
	// need to store publicKey in addition to accountId, because the account may not have had its publicKey set yet
	this.accountId = account.getId();
	this.Forge(Convert.getEpochTime()); // initialize deadline
}

function Forge(timestamp) {
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
		while (! BlockchainProcessorImpl.getInstance().generateBlock(secretPhrase, timestamp)) {
			if (Convert.getEpochTime() - timestamp > 10) {
				break;
			}
		 }
	 }
	*/
}

function GetAccountId() {
	return this.accountId;
}

function GetDeadline() {
	return this.deadline;
}

function GetPublicKey() {
	return this.publicKey;
}


Generator.prototype.Clear = Clear;
Generator.prototype.Forge = Forge;
Generator.prototype.GetAccountId = GetAccountId;
Generator.prototype.GetDeadline = GetDeadline;
Generator.prototype.GetPublicKey = GetPublicKey;

module.exports = Generator;
