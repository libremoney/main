/*!
 * LibreMoney Generators 0.1
 * Copyright(c) 2014 LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var Convert = require(__dirname + '/../Util/Convert');
var Core = require(__dirname + '/../Core');
var Crypto = require(__dirname + '/../Crypto/Crypto');
var Listeners = require(__dirname + '/../Util/Listeners');
var ThreadPool = require(__dirname + '/../ThreadPool');


var Event = {
	GenerationDealline: 0, //GENERATION_DEADLINE: 0,
	StartForgin: 1, //START_FORGING: 1,
	StopForgin: 2 //STOP_FORGING: 2
}

var listeners = new Listeners();
var lastBlocks = []; //ConcurrentHashMap();
var hits = []; //ConcurrentHashMap();
var generators = []; //ConcurrentHashMap();

var allGenerators = new Array(); //Collections.unmodifiableCollection(generators.values());


function AddListener(eventType, listener) {
	return listeners.AddListener(eventType, listener);
}

function Clear() {
	lastBlocks.length = 0;
	hits.length = 0;
}

function GenerateBlockThread(){
	throw new Error('Not implementted');
	/*
	try {
		try {
			int timestamp = Convert.getEpochTime();
			if (timestamp != lastTimestamp) {
				lastTimestamp = timestamp;
				for (Generator generator : generators.values()) {
					generator.forge(timestamp);
				}
			}
		} catch (Exception e) {
			Logger.logDebugMessage("Error in block generation thread", e);
		}
	} catch (Throwable t) {
		Logger.logMessage("CRITICAL ERROR. PLEASE REPORT TO THE DEVELOPERS.\n" + t.toString());
		t.printStackTrace();
		System.exit(1);
	}
	*/
}

function GetAllGenerators() {
	return allGenerators;
}

function GetGenerator(secretPhrase) {
	return generators[secretPhrase];
}

function GetHit(publicKey, block) {
	throw new Error('Not implementted');
	/*
	MessageDigest digest = Crypto.sha256();
	digest.update(block.getGenerationSignature());
	byte[] generationSignatureHash = digest.digest(publicKey);
	return new BigInteger(1, new byte[] {generationSignatureHash[7], generationSignatureHash[6], generationSignatureHash[5], generationSignatureHash[4], generationSignatureHash[3], generationSignatureHash[2], generationSignatureHash[1], generationSignatureHash[0]});
	*/
}

function GetHitTime1(account, block) {
	return GetHitTime2(account.GetEffectiveBalanceLm(), GetHit(account.GetPublicKey(), block), block);
}

function GetHitTime2(effectiveBalanceLm, hit, block) {
	return block.GetTimestamp() +
		hit.divide(BigInteger.valueOf(block.GetBaseTarget()).multiply(BigInteger.valueOf(effectiveBalanceLm))).longValue();
}

function Init() {
	ThreadPool.ScheduleThread(GenerateBlockThread, 1000, 'GenerateBlockThread');
	Core.AddListener(Core.Event.GetState, OnGetState);
	Core.AddListener(Core.Event.InitServer, OnInitServer);
}

function OnGetState(response) {
	response.numberOfUnlockedAccounts = allGenerators.length;
}

function OnInitServer(app) {
	var Api = require(__dirname + "/Api");
	app.get("/api/getForging", Api.GetForging); // post
	app.get("/api/startForging", Api.StartForging); // post
	app.get("/api/stopForging", Api.StopForging); // post
}

function RemoveListener(eventType, listener) {
	return listeners.RemoveListener(eventType, listener);
}

function StartForging1(secretPhrase) {
	var publicKey = Crypto.GetPublicKey(secretPhrase);
	return StartForging2(secretPhrase, publicKey);
}

function StartForging2(SecretPhrase, PublicKey) {
	throw new Error('Not implementted');
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
	listeners.Notify(Event.START_FORGING, generator);
	Logger.logDebugMessage("Account " + Convert.toUnsignedLong(account.getId()) + " started forging, deadline "
			+ generator.getDeadline() + " seconds");
	return generator;
	*/
}

function StopForging(SecretPhrase) {
	throw new Error('Not implementted');
	/*
	Generator generator = generators.remove(secretPhrase);
	if (generator != null) {
		lastBlocks.remove(generator.accountId);
		hits.remove(generator.accountId);
		Logger.logDebugMessage("Account " + Convert.toUnsignedLong(generator.getAccountId()) + " stopped forging");
		listeners.Notify(Event.STOP_FORGING, generator);
	}
	return generator;
	*/
}

function VerifyHit(hit, effectiveBalance, previousBlock, timestamp) {
	throw new Error('Not implementted');
	/*
	int elapsedTime = timestamp - previousBlock.getTimestamp();
	if (elapsedTime <= 0) {
		return false;
	}
	BigInteger effectiveBaseTarget = BigInteger.valueOf(previousBlock.getBaseTarget()).multiply(BigInteger.valueOf(effectiveBalance));
	BigInteger prevTarget = effectiveBaseTarget.multiply(BigInteger.valueOf(elapsedTime - 1));
	BigInteger target = prevTarget.add(effectiveBaseTarget);

	return hit.compareTo(target) < 0
			&& (previousBlock.getHeight() < Constants.TRANSPARENT_FORGING_BLOCK_8
			|| hit.compareTo(prevTarget) >= 0
			|| (Constants.isTestnet ? elapsedTime > 300 : elapsedTime > 3600)
			|| Constants.isOffline);
	*/
}


exports.Event = Event;

exports.AddListener = AddListener;
exports.Clear = Clear;
exports.GetAllGenerators = GetAllGenerators;
exports.GetGenerator = GetGenerator;
exports.GetHit = GetHit;
exports.GetHitTime1 = GetHitTime1;
exports.GetHitTime2 = GetHitTime2;
exports.Init = Init;
exports.RemoveListener = RemoveListener;
exports.StartForging1 = StartForging1;
exports.StartForging2 = StartForging2;
exports.StopForging = StopForging;
