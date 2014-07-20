/**!
 * LibreMoney BlockchainProcessor 0.0
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

/*
import nxt.peer.Peer;
import nxt.util.Observable;
import org.json.simple.JSONObject;
*/
/*
import nxt.crypto.Crypto;
import nxt.peer.Peer;
import nxt.peer.Peers;
import nxt.util.Convert;
import nxt.util.DbIterator;
import nxt.util.JSON;
import nxt.util.Listener;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.JSONStreamAware;
*/

var GetMoreBlocksThread = require(__dirname + '/GetMoreBlocksThread');
var Config = require(__dirname + '/../Config');
var Blockchain = require(__dirname + '/../Blockchain');
var BlockDb = require(__dirname + '/../BlockDb');
var Constants = require(__dirname + '/../Constants');
var Genesis = require(__dirname + '/../Genesis');
var Listeners = require(__dirname + '/../Util/Listeners');
var Logger = require(__dirname + '/../Logger').GetLogger(module);
var ThreadPool = require(__dirname + '/../Util/ThreadPool');
//var Transaction = require(__dirname + '/../Transaction');
//var TransactionType = require(__dirname + '/LmTransactionType');
var TransactionProcessor = require(__dirname + '/../TransactionProcessor');


var Event = {
	BLOCK_PUSHED:0,
	BLOCK_POPPED:1,
	BLOCK_GENERATED:2,
	BLOCK_SCANNED:3,
	RESCAN_BEGIN:4,
	RESCAN_END:5,
	BEFORE_BLOCK_APPLY:6,
	AFTER_BLOCK_APPLY:7,
	BEFORE_BLOCK_UNDO:8
}


/*
public static class TransactionNotAcceptedException extends BlockNotAcceptedException {
	private final TransactionImpl transaction;

	TransactionNotAcceptedException(String message, TransactionImpl transaction) {
		super(message  + " transaction: " + transaction.getJSONObject().toJSONString());
		this.transaction = transaction;
	}

	public Transaction getTransaction() {
		return transaction;
	}
}
*/

/*
public static class BlockOutOfOrderException extends BlockNotAcceptedException {
	BlockOutOfOrderException(String message) {
		super(message);
	}
}
*/



var CHECKSUM_TRANSPARENT_FORGING = new Array(27, -54, -59, -98, 49, -42, 48, -68, -112, 49, 41, 94, -41, 78, -84, 27, -87, -22, -28, 36, -34, -90, 112, -50, -9, 5, 89, -35, 80, -121, -128, 112);

var blockListeners = new Listeners();
var lastBlockchainFeeder;
var lastBlockchainFeederHeight;
var isScanning;
var validateAtScan;


function AddBlock(block) {
	throw new Error('Not implementted');
	/*
	try (Connection con = Db.getConnection()) {
		try {
			BlockDb.saveBlock(con, block);
			blockchain.setLastBlock(block);
			con.commit();
		} catch (SQLException e) {
			con.rollback();
			throw e;
		}
	} catch (SQLException e) {
		throw new RuntimeException(e.toString(), e);
	}
	*/
}

function AddGenesisBlock() {
	if (BlockDb.HasBlock(Genesis.GENESIS_BLOCK_ID)) {
		Logger.info("Genesis block already in database");
		return;
	}
	Logger.info("Genesis block not in database, starting from scratch");
	//try {
		/*
		var transactionsMap = new Array(); //TreeMap<>();

		for (var i = 0; i < Genesis.GenesisRecipients.length; i++) {
			var transaction = new LmTransaction(LmTransactionType.Payment.Ordinary, 0, 0, Genesis.CreatorPublicKey,
					Genesis.GenesisRecipients[i], Genesis.GENESIS_AMOUNTS[i] * Constants.OneLm, 0, (String)null, Genesis.GENESIS_SIGNATURES[i]);
			transactionsMap.put(transaction.getId(), transaction);
		}

		MessageDigest digest = Crypto.sha256();
		for (Transaction transaction : transactionsMap.values()) {
			digest.update(transaction.getBytes());
		}

		BlockImpl genesisBlock = new BlockImpl(-1, 0, null, Constants.MaxBalanceMilliLm, 0, transactionsMap.size() * 128, digest.digest(),
				Genesis.CreatorPublicKey, new byte[64], Genesis.GENESIS_BLOCK_SIGNATURE, null, new ArrayList<>(transactionsMap.values()));

		genesisBlock.setPrevious(null);

		addBlock(genesisBlock);
		*/
	//} catch (e) {
	//	Logger.logMessage(e.getMessage());
	//	throw new RuntimeException(e.toString(), e);
	//}
	throw new Error('Not implementted');
}

function AddListener(listener, eventType) {
	return blockListeners.AddListener(listener, eventType);
}

function CalculateTransactionsChecksum() {
	throw new Error('Not implementted');
	/*
	MessageDigest digest = Crypto.sha256();
	try (Connection con = Db.getConnection();
		 PreparedStatement pstmt = con.prepareStatement(
				 "SELECT * FROM transaction ORDER BY id ASC, timestamp ASC");
		 DbIterator<TransactionImpl> iterator = blockchain.getTransactions(con, pstmt)) {
		while (iterator.hasNext()) {
			digest.update(iterator.next().getBytes());
		}
	} catch (SQLException e) {
		throw new RuntimeException(e.toString(), e);
	}
	return digest.digest();
	*/
}

function Init() {
	validateAtScan = Config.GetBooleanProperty("forceValidate");
	blockListeners.AddListener(function(block) {
		if (block.GetHeight() % 5000 == 0) {
			Logger.info("processed block " + block.GetHeight());
		}
	}, Event.BLOCK_SCANNED);

	ThreadPool.RunBeforeStart(function() {
		AddGenesisBlock();
		Scan();
	});

	ThreadPool.ScheduleThread(GetMoreBlocksThread, 1);
}

function FullReset() {
	throw new Error('Not implementted');
	/*
	synchronized (blockchain) {
		Logger.logMessage("Deleting blockchain...");
		//BlockDb.deleteBlock(Genesis.GENESIS_BLOCK_ID); // fails with stack overflow in H2
		BlockDb.deleteAll();
		addGenesisBlock();
		scan();
	}
	*/
}

function GenerateBlock(secretPhrase) {
	throw new Error('Not implementted');
	/*
	Set<TransactionImpl> sortedTransactions = new TreeSet<>();

	for (TransactionImpl transaction : transactionProcessor.getAllUnconfirmedTransactions()) {
		if (hasAllReferencedTransactions(transaction, transaction.getTimestamp(), 0)) {
			sortedTransactions.add(transaction);
		}
	}

	SortedMap<Long, TransactionImpl> newTransactions = new TreeMap<>();
	Map<TransactionType, Set<String>> duplicates = new HashMap<>();

	long totalAmountNQT = 0;
	long totalFeeNQT = 0;
	int payloadLength = 0;

	int blockTimestamp = Convert.getEpochTime();

	while (payloadLength <= Constants.MaxPayloadLength) {

		int prevNumberOfNewTransactions = newTransactions.size();

		for (TransactionImpl transaction : sortedTransactions) {

			int transactionLength = transaction.getSize();
			if (newTransactions.get(transaction.getId()) != null || payloadLength + transactionLength > Constants.MaxPayloadLength) {
				continue;
			}

			if (transaction.getTimestamp() > blockTimestamp + 15 || (transaction.getExpiration() < blockTimestamp)) {
				continue;
			}

			if (transaction.isDuplicate(duplicates)) {
				continue;
			}

			try {
				transaction.validateAttachment();
			} catch (NxtException.ValidationException e) {
				continue;
			}

			newTransactions.put(transaction.getId(), transaction);
			payloadLength += transactionLength;
			totalAmountNQT += transaction.getAmountNQT();
			totalFeeNQT += transaction.getFeeNQT();

		}

		if (newTransactions.size() == prevNumberOfNewTransactions) {
			break;
		}
	}

	final byte[] publicKey = Crypto.getPublicKey(secretPhrase);

	MessageDigest digest = Crypto.sha256();
	for (Transaction transaction : newTransactions.values()) {
		digest.update(transaction.getBytes());
	}

	byte[] payloadHash = digest.digest();

	BlockImpl previousBlock = blockchain.getLastBlock();
	if (previousBlock.getHeight() < Constants.ASSET_EXCHANGE_BLOCK) {
		return;
	}

	digest.update(previousBlock.getGenerationSignature());
	byte[] generationSignature = digest.digest(publicKey);

	BlockImpl block;
	int version = 3;
	byte[] previousBlockHash = Crypto.sha256().digest(previousBlock.getBytes());

	try {

		block = new BlockImpl(version, blockTimestamp, previousBlock.getId(), totalAmountNQT, totalFeeNQT, payloadLength,
					payloadHash, publicKey, generationSignature, null, previousBlockHash, new ArrayList<>(newTransactions.values()));

	} catch (NxtException.ValidationException e) {
		// shouldn't happen because all transactions are already validated
		Logger.logMessage("Error generating block", e);
		return;
	}

	block.sign(secretPhrase);

	if (isScanning) {
		return;
	}

	block.setPrevious(previousBlock);

	try {
		pushBlock(block);
		blockListeners.notify(block, Event.BLOCK_GENERATED);
		Logger.logDebugMessage("Account " + Convert.toUnsignedLong(block.getGeneratorId()) + " generated block " + block.getStringId());
	} catch (TransactionNotAcceptedException e) {
		Logger.logDebugMessage("Generate block failed: " + e.getMessage());
		Transaction transaction = e.getTransaction();
		Logger.logDebugMessage("Removing invalid transaction: " + transaction.getStringId());
		transactionProcessor.removeUnconfirmedTransactions(Collections.singletonList((TransactionImpl)transaction));
	} catch (BlockNotAcceptedException e) {
		Logger.logDebugMessage("Generate block failed: " + e.getMessage());
	}
	*/
}

function GetLastBlockchainFeeder() {
	throw new Error('Not implementted');
	/*
	return lastBlockchainFeeder;
	*/
}

function GetLastBlockchainFeederHeight() {
	throw new Error('Not implementted');
	/*
	return lastBlockchainFeederHeight;
	*/
}

function HasAllReferencedTransactions(transaction, timestamp, count) {
	throw new Error('Not implementted');
	/*
	if (transaction.getReferencedTransactionFullHash() == null) {
		return timestamp - transaction.getTimestamp() < 60 * 1440 * 60 && count < 10;
	}
	transaction = TransactionDb.findTransactionByFullHash(transaction.getReferencedTransactionFullHash());
	return transaction != null && hasAllReferencedTransactions(transaction, timestamp, count + 1);
	*/
}

function IsScanning() {
	throw new Error('Not implementted');
	/*
	return isScanning;
	*/
}

function ProcessPeerBlock(request) {
	throw new Error('Not implementted');
	/*
	BlockImpl block = parseBlock(request);
	pushBlock(block);
	*/
}

function PushBlock(block) {
	throw new Error('Not implementted');
	/*
	int curTime = Convert.getEpochTime();

	synchronized (blockchain) {
		try {

			BlockImpl previousLastBlock = blockchain.getLastBlock();

			if (! previousLastBlock.getId().equals(block.getPreviousBlockId())) {
				throw new BlockOutOfOrderException("Previous block id doesn't match");
			}

			if (! verifyVersion(block, previousLastBlock.getHeight())) {
				throw new BlockNotAcceptedException("Invalid version " + block.getVersion());
			}

			if (block.getVersion() != 1 && ! Arrays.equals(Crypto.sha256().digest(previousLastBlock.getBytes()), block.getPreviousBlockHash())) {
				throw new BlockNotAcceptedException("Previous block hash doesn't match");
			}
			if (block.getTimestamp() > curTime + 15 || block.getTimestamp() <= previousLastBlock.getTimestamp()) {
				throw new BlockOutOfOrderException("Invalid timestamp: " + block.getTimestamp()
						+ " current time is " + curTime + ", previous block timestamp is " + previousLastBlock.getTimestamp());
			}
			if (block.getId().equals(Long.valueOf(0L)) || BlockDb.hasBlock(block.getId())) {
				throw new BlockNotAcceptedException("Duplicate block or invalid id");
			}
			if (! block.verifyGenerationSignature()) {
				throw new BlockNotAcceptedException("Generation signature verification failed");
			}
			if (! block.verifyBlockSignature()) {
				throw new BlockNotAcceptedException("Block signature verification failed");
			}

			Map<TransactionType, Set<String>> duplicates = new HashMap<>();
			long calculatedTotalAmount = 0;
			long calculatedTotalFee = 0;
			MessageDigest digest = Crypto.sha256();

			Set<Long> unappliedUnconfirmed = transactionProcessor.undoAllUnconfirmed();
			Set<Long> appliedUnconfirmed = new HashSet<>();

			try {

				for (TransactionImpl transaction : block.getTransactions()) {

					// cfb: Block 303 contains a transaction which expired before the block timestamp
					if (transaction.getTimestamp() > curTime + 15 || transaction.getTimestamp() > block.getTimestamp() + 15
							|| (transaction.getExpiration() < block.getTimestamp() && previousLastBlock.getHeight() != 303)) {
						throw new TransactionNotAcceptedException("Invalid transaction timestamp " + transaction.getTimestamp()
								+ " for transaction " + transaction.getStringId() + ", current time is " + curTime
								+ ", block timestamp is " + block.getTimestamp(), transaction);
					}
					if (TransactionDb.hasTransaction(transaction.getId())) {
						throw new TransactionNotAcceptedException("Transaction " + transaction.getStringId()
								+ " is already in the blockchain", transaction);
					}
					if (!transaction.verify()) {
						throw new TransactionNotAcceptedException("Signature verification failed for transaction "
								+ transaction.getStringId() + " at height " + previousLastBlock.getHeight(), transaction);
					}
					if (transaction.getId().equals(Long.valueOf(0L))) {
						throw new TransactionNotAcceptedException("Invalid transaction id", transaction);
					}
					if (transaction.isDuplicate(duplicates)) {
						throw new TransactionNotAcceptedException("Transaction is a duplicate: "
								+ transaction.getStringId(), transaction);
					}
					try {
						transaction.validateAttachment();
					} catch (NxtException.ValidationException e) {
						throw new TransactionNotAcceptedException(e.getMessage(), transaction);
					}

					if (transaction.applyUnconfirmed()) {
						appliedUnconfirmed.add(transaction.getId());
					} else {
						throw new TransactionNotAcceptedException("Double spending transaction: " + transaction.getStringId(), transaction);
					}

					calculatedTotalAmount += transaction.getAmountNQT();

					calculatedTotalFee += transaction.getFeeNQT();

					digest.update(transaction.getBytes());

				}

				if (calculatedTotalAmount != block.getTotalAmountNQT() || calculatedTotalFee != block.getTotalFeeNQT()) {
					throw new BlockNotAcceptedException("Total amount or fee don't match transaction totals");
				}
				if (!Arrays.equals(digest.digest(), block.getPayloadHash())) {
					throw new BlockNotAcceptedException("Payload hash doesn't match");
				}

				block.setPrevious(previousLastBlock);

				addBlock(block);

				unappliedUnconfirmed.removeAll(appliedUnconfirmed);

			} catch (TransactionNotAcceptedException | RuntimeException e) {
				for (TransactionImpl transaction : block.getTransactions()) {
					if (appliedUnconfirmed.contains(transaction.getId())) {
						transaction.undoUnconfirmed();
					}
				}
				throw e;
			} finally {
				transactionProcessor.applyUnconfirmed(unappliedUnconfirmed);
			}

			blockListeners.notify(block, Event.BEFORE_BLOCK_APPLY);
			transactionProcessor.apply(block);
			blockListeners.notify(block, Event.AFTER_BLOCK_APPLY);
			blockListeners.notify(block, Event.BLOCK_PUSHED);
			transactionProcessor.updateUnconfirmedTransactions(block);

		} catch (RuntimeException e) {
			Logger.logMessage("Error pushing block", e);
			BlockDb.deleteBlocksFrom(block.getId());
			scan();
			throw new BlockNotAcceptedException(e.toString());
		}

	} // synchronized

	if (block.getTimestamp() >= Convert.getEpochTime() - 15) {
		Peers.sendToSomePeers(block);
	}
	*/
}

function PopLastBlock() {
	throw new Error('Not implementted');
	/*
	try {
		synchronized (blockchain) {
			BlockImpl block = blockchain.getLastBlock();
			Logger.logDebugMessage("Will pop block " + block.getStringId() + " at height " + block.getHeight());
			if (block.getId().equals(Genesis.GENESIS_BLOCK_ID)) {
				throw new RuntimeException("Cannot pop off genesis block");
			}
			BlockImpl previousBlock = BlockDb.findBlock(block.getPreviousBlockId());
			blockListeners.notify(block, Event.BEFORE_BLOCK_UNDO);
			blockchain.setLastBlock(block, previousBlock);
			transactionProcessor.undo(block);
			BlockDb.deleteBlocksFrom(block.getId());
			blockListeners.notify(block, Event.BLOCK_POPPED);
			return previousBlock.getId();
		} // synchronized

	} catch (RuntimeException e) {
		Logger.logDebugMessage("Error popping last block: " + e.getMessage());
		throw new TransactionType.UndoNotSupportedException(e.getMessage());
	}
	*/
}

function RemoveListener(listener, eventType) {
	throw new Error('Not implementted');
	/*
	return blockListeners.removeListener(listener, eventType);
	*/
}

function ParseBlock(blockData) {
	throw new Error('Not implementted');
	/*
	int version = ((Long)blockData.get("version")).intValue();
	int timestamp = ((Long)blockData.get("timestamp")).intValue();
	Long previousBlock = Convert.parseUnsignedLong((String) blockData.get("previousBlock"));
	long totalAmountNQT = ((Long)blockData.get("totalAmountNQT"));
	long totalFeeNQT = ((Long)blockData.get("totalFeeNQT"));
	int payloadLength = ((Long)blockData.get("payloadLength")).intValue();
	byte[] payloadHash = Convert.parseHexString((String) blockData.get("payloadHash"));
	byte[] generatorPublicKey = Convert.parseHexString((String) blockData.get("generatorPublicKey"));
	byte[] generationSignature = Convert.parseHexString((String) blockData.get("generationSignature"));
	byte[] blockSignature = Convert.parseHexString((String) blockData.get("blockSignature"));
	byte[] previousBlockHash = version == 1 ? null : Convert.parseHexString((String) blockData.get("previousBlockHash"));

	SortedMap<Long, TransactionImpl> blockTransactions = new TreeMap<>();
	JSONArray transactionsData = (JSONArray)blockData.get("transactions");
	for (Object transactionData : transactionsData) {
		TransactionImpl transaction = transactionProcessor.parseTransaction((JSONObject) transactionData);
		if (blockTransactions.put(transaction.getId(), transaction) != null) {
			throw new NxtException.ValidationException("Block contains duplicate transactions: " + transaction.getStringId());
		}
	}

	return new BlockImpl(version, timestamp, previousBlock, totalAmountNQT, totalFeeNQT, payloadLength, payloadHash, generatorPublicKey,
			generationSignature, blockSignature, previousBlockHash, new ArrayList<>(blockTransactions.values()));
	*/
}

function Scan() {
	throw new Error('Not implementted');
	/*
	synchronized (blockchain) {
		isScanning = true;
		Logger.logMessage("Scanning blockchain...");
		if (validateAtScan) {
			Logger.logDebugMessage("Also verifying signatures and validating transactions...");
		}
		Account.clear();
		Alias.clear();
		Asset.clear();
		Order.clear();
		Poll.clear();
		Trade.clear();
		Vote.clear();
		DigitalGoodsStore.clear();
		transactionProcessor.clear();
		Generator.clear();
		blockchain.setLastBlock(BlockDb.findBlock(Genesis.GENESIS_BLOCK_ID));
		Account.addOrGetAccount(Genesis.CREATOR_ID).apply(Genesis.CreatorPublicKey, 0);
		try (Connection con = Db.getConnection(); PreparedStatement pstmt = con.prepareStatement("SELECT * FROM block ORDER BY db_id ASC")) {
			Long currentBlockId = Genesis.GENESIS_BLOCK_ID;
			BlockImpl currentBlock;
			ResultSet rs = pstmt.executeQuery();
			try {
				while (rs.next()) {
					currentBlock = BlockDb.loadBlock(con, rs);
					if (! currentBlock.getId().equals(currentBlockId)) {
						throw new NxtException.ValidationException("Database blocks in the wrong order!");
					}
					if (validateAtScan && ! currentBlockId.equals(Genesis.GENESIS_BLOCK_ID)) {
						if (!currentBlock.verifyBlockSignature() || !currentBlock.verifyGenerationSignature()) {
							throw new NxtException.ValidationException("Invalid block signature");
						}
						if (! verifyVersion(currentBlock, blockchain.getHeight())) {
							throw new NxtException.ValidationException("Invalid block version");
						}
						for (TransactionImpl transaction : currentBlock.getTransactions()) {
							if (!transaction.verify()) {
								throw new NxtException.ValidationException("Invalid transaction signature");
							}
							transaction.validateAttachment();
						}
					}
					for (TransactionImpl transaction : currentBlock.getTransactions()) {
						if (! transaction.applyUnconfirmed()) {
							throw new TransactionNotAcceptedException("Double spending transaction: "
									+ transaction.getStringId(), transaction);
						}
					}
					blockchain.setLastBlock(currentBlock);
					blockListeners.notify(currentBlock, Event.BEFORE_BLOCK_APPLY);
					currentBlock.apply();
					for (TransactionImpl transaction : currentBlock.getTransactions()) {
						transaction.apply();
					}
					blockListeners.notify(currentBlock, Event.AFTER_BLOCK_APPLY);
					blockListeners.notify(currentBlock, Event.BLOCK_SCANNED);
					currentBlockId = currentBlock.getNextBlockId();
				}
			} catch (NxtException|RuntimeException e) {
				Logger.logDebugMessage(e.toString(), e);
				Logger.logDebugMessage("Applying block " + Convert.toUnsignedLong(currentBlockId) + " failed, deleting from database");
				BlockDb.deleteBlocksFrom(currentBlockId);
				scan();
			}
		} catch (SQLException e) {
			throw new RuntimeException(e.toString(), e);
		}
		validateAtScan = false;
		Logger.logMessage("...done");
		isScanning = false;
	} // synchronized
	*/
}

function ValidateAtNextScan() {
	throw new Error('Not implementted');
	/*
	validateAtScan = true;
	*/
}

// TODO: Remove (prof1983)
function VerifyVersion(block, currentHeight) {
	return block.GetVersion() == 3;
}


exports.Event = Event;

exports.AddBlock = AddBlock;
exports.AddListener = AddListener;
exports.GenerateBlock = GenerateBlock;
exports.GetLastBlockchainFeeder = GetLastBlockchainFeeder;
exports.GetLastBlockchainFeederHeight = GetLastBlockchainFeederHeight;
exports.FullReset = FullReset;
exports.Init = Init;
exports.IsScanning = IsScanning;
exports.ProcessPeerBlock = ProcessPeerBlock;
exports.RemoveListener = RemoveListener;
exports.ValidateAtNextScan = ValidateAtNextScan;


// ---- Init ----

//Init();
//Logger.info('init ok');
