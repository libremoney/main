/**!
 * LibreMoney 0.0.1
 * Author: Prof1983 <prof1983@yandex.ru>
 * License: CC0
 */

/*
import nxt.crypto.Crypto;
import nxt.util.Convert;
import nxt.util.Listener;
import nxt.util.Listeners;
import nxt.util.Logger;
import nxt.util.ThreadPool;
*/

var LmGeneratorEventEnum = {
	GenerationDealline: 0, //GENERATION_DEADLINE: 0,
	StartForgin: 1, //START_FORGING: 1,
	StopForgin: 2 //STOP_FORGING: 2
}

/*
private static final Listeners<Generator,Event> listeners = new Listeners<>();
private static final ConcurrentMap<Long, Block> lastBlocks = new ConcurrentHashMap<>();
private static final ConcurrentMap<Long, BigInteger> hits = new ConcurrentHashMap<>();
private static final ConcurrentMap<String, Generator> generators = new ConcurrentHashMap<>();
*/
var AllGenerators = new Array(); //Collections.unmodifiableCollection(generators.values());

var AccountId;
var SecretPhrase;
var PublicKey;
var Deadline;

/*
private static final Runnable generateBlockThread = new Runnable() {

	@Override
	public void run() {

		try {
			try {
				for (Generator generator : generators.values()) {
					generator.forge();
				}
			} catch (Exception e) {
				Logger.logDebugMessage("Error in block generation thread", e);
			}
		} catch (Throwable t) {
			Logger.logMessage("CRITICAL ERROR. PLEASE REPORT TO THE DEVELOPERS.\n" + t.toString());
			t.printStackTrace();
			System.exit(1);
		}

	}

};

static {
	ThreadPool.scheduleThread(generateBlockThread, 1);
}
*/

function Init() {
}

function Clear() {
	//lastBlocks.clear();
	//hits.clear();
}

/*
public static boolean addListener(Listener<Generator> listener, Event eventType) {
	return listeners.addListener(listener, eventType);
}

public static boolean removeListener(Listener<Generator> listener, Event eventType) {
	return listeners.removeListener(listener, eventType);
}
*/

function StartForging1(SecretPhrase) {
	//byte[] publicKey = Crypto.getPublicKey(secretPhrase);
	//return startForging(secretPhrase, publicKey);
}

function StartForging2(SecretPhrase, PublicKey) {
/*
	Account account = Account.getAccount(publicKey);
	if (account == null) {
		return null;
	}
	Generator generator = new Generator(secretPhrase, publicKey, account);
	Generator old = generators.putIfAbsent(secretPhrase, generator);
	if (old != null) {
		Logger.logDebugMessage("Account " + Convert.toUnsignedLong(account.getId()) + " is already forging");
		return old;
	}
	listeners.notify(generator, Event.START_FORGING);
	Logger.logDebugMessage("Account " + Convert.toUnsignedLong(account.getId()) + " started forging, deadline "
			+ generator.getDeadline() + " seconds");
	return generator;
*/
}

function StopForging(SecretPhrase) {
/*
	Generator generator = generators.remove(secretPhrase);
	if (generator != null) {
		lastBlocks.remove(generator.accountId);
		hits.remove(generator.accountId);
		Logger.logDebugMessage("Account " + Convert.toUnsignedLong(generator.getAccountId()) + " stopped forging");
		listeners.notify(generator, Event.STOP_FORGING);
	}
	return generator;
*/
}

function GetGenerator(SecretPhrase) {
	//return generators.get(secretPhrase);
}

function GetAllGenerators() {
	return AllGenerators;
}

function GetHit(PublicKey, Block) {
/*
	if (block.getHeight() < Constants.TRANSPARENT_FORGING_BLOCK) {
		throw new IllegalArgumentException("Not supported below Transparent Forging Block");
	}
	MessageDigest digest = Crypto.sha256();
	digest.update(block.getGenerationSignature());
	byte[] generationSignatureHash = digest.digest(publicKey);
	return new BigInteger(1, new byte[] {generationSignatureHash[7], generationSignatureHash[6], generationSignatureHash[5], generationSignatureHash[4], generationSignatureHash[3], generationSignatureHash[2], generationSignatureHash[1], generationSignatureHash[0]});
*/
}

function GetHitTime1(Account, Block) {
	//return getHitTime(account.getEffectiveBalanceNXT(), getHit(account.getPublicKey(), block), block);
}

function GetHitTime2(EffectiveBalanceNXT, Hit, Block) {
/*
	return block.getTimestamp()
			+ hit.divide(BigInteger.valueOf(block.getBaseTarget())
			.multiply(BigInteger.valueOf(effectiveBalanceNXT))).longValue();
*/
}

/*
private Generator(String secretPhrase, byte[] publicKey, Account account) {
	this.secretPhrase = secretPhrase;
	this.publicKey = publicKey;
	// need to store publicKey in addition to accountId, because the account may not have had its publicKey set yet
	this.accountId = account.getId();
	forge(); // initialize deadline
}

public byte[] getPublicKey() {
	return publicKey;
}

public Long getAccountId() {
	return accountId;
}

public long getDeadline() {
	return deadline;
}

private void forge() {

	if (Nxt.getBlockchainProcessor().isScanning()) {
		return;
	}

	Account account = Account.getAccount(accountId);
	if (account == null) {
		return;
	}
	long effectiveBalance = account.getEffectiveBalanceNXT();
	if (effectiveBalance <= 0) {
		return;
	}

	Block lastBlock = Nxt.getBlockchain().getLastBlock();

	if (lastBlock.getHeight() < Constants.ASSET_EXCHANGE_BLOCK) {
		return;
	}

	if (! lastBlock.equals(lastBlocks.get(accountId))) {

		BigInteger hit = getHit(publicKey, lastBlock);

		lastBlocks.put(accountId, lastBlock);
		hits.put(accountId, hit);

		deadline = Math.max(getHitTime(account.getEffectiveBalanceNXT(), hit, lastBlock) - Convert.getEpochTime(), 0);

		listeners.notify(this, Event.GENERATION_DEADLINE);

	}

	int elapsedTime = Convert.getEpochTime() - lastBlock.getTimestamp();
	if (elapsedTime > 0) {
		BigInteger target = BigInteger.valueOf(lastBlock.getBaseTarget())
				.multiply(BigInteger.valueOf(effectiveBalance))
				.multiply(BigInteger.valueOf(elapsedTime));
		if (hits.get(accountId).compareTo(target) < 0) {
			BlockchainProcessorImpl.getInstance().generateBlock(secretPhrase);
		}
	}

}
*/


exports.Clear = Clear;
exports.GetAllGenerators = GetAllGenerators;
exports.GetGenerator = GetGenerator;
exports.GetHit = GetHit;
exports.GetHitTime1 = GetHitTime1;
exports.GetHitTime2 = GetHitTime2;
exports.Init = Init;
exports.StartForging1 = StartForging1;
exports.StartForging2 = StartForging2;
exports.StopForging = StopForging;
