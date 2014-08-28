/**!
 * LibreMoney BlockchainProcessor 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

/*
import nxt.util.Observable;
import nxt.peer.Peer;
import nxt.peer.Peers;
import nxt.util.Convert;
import nxt.util.DbIterator;
*/

var GetMoreBlocksThread = require(__dirname + '/GetMoreBlocksThread');
var Config = require(__dirname + '/../Config');
var Crypto = require(__dirname + '/../Crypto/Crypto');
var Blockchain = require(__dirname + '/../Blockchain');
var Blocks = require(__dirname + '/../Blocks');
var Constants = require(__dirname + '/../Constants');
var Genesis = require(__dirname + '/../Genesis');
var Listeners = require(__dirname + '/../Util/Listeners');
var Logger = require(__dirname + '/../Logger').GetLogger(module);
var ThreadPool = require(__dirname + '/../ThreadPool');
var Transactions = require(__dirname + '/../Transactions');
//var TransactionType = require(__dirname + '/LmTransactionType');
var TransactionProcessor = require(__dirname + '/../TransactionProcessor');


var Event = {
	BLOCK_PUSHED:0,
	BLOCK_POPPED:1,
	BLOCK_GENERATED:2,
	BLOCK_SCANNED:3,
	RESCAN_BEGIN:4,
	RESCAN_END:5,
	BEFORE_BLOCK_ACCEPT:6,
	BEFORE_BLOCK_APPLY:7,
	AFTER_BLOCK_APPLY:8,
	BEFORE_BLOCK_UNDO:9
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



var CHECKSUM_TRANSPARENT_FORGING = new Array(27, -54, -59, -98, 49, -42, 48, -68, -112, 49, 41, 94,
	-41, 78, -84, 27, -87, -22, -28, 36, -34, -90, 112, -50, -9, 5, 89, -35, 80, -121, -128, 112);

var blockListeners = new Listeners();
var lastBlockchainFeeder;
var lastBlockchainFeederHeight;
var isScanning;
var validateAtScan;


function AddBlock(block) {
	Blocks.SaveBlock(block);
	Blockchain.SetLastBlock(block);
}

function AddGenesisBlock(callback) {
	Blocks.HasBlock(Genesis.GENESIS_BLOCK_ID, function(err, res) {
		Logger.info('AddGenesisBlock: err='+err+' res='+res);
		if (res) {
			Logger.info("AddGenesisBlock: Genesis block already in database");
			return;
		} else {
			Logger.info("AddGenesisBlock: Genesis block not in database, starting from scratch");
			var transactionsMap = [];

			for (var i = 0; i < Genesis.Recipients.length; i++) {
				var transaction = Transactions.NewOrdinaryPaymentTransaction({
					timestamp: 0,
					deadline: 0,
					senderPublicKey: Genesis.CreatorPublicKey,
					recipientId: Genesis.Recipients[i],
					amountMilliLm: Genesis.Amounts[i] * Constants.OneLm,
					feeMilliLm: 0,
					referencedTransactionFullHash: null,
					signature: Genesis.Signatures[i]
				});
				var id = transaction.GetId();
				transactionsMap[id] = transaction;
			}

			var digest = Crypto.Sha256();
			for (var id in transactionsMap) {
				var transaction = transactionsMap[id];
				digest.update(transaction.GetBytes());
			}

			var genesisBlock = Blocks.NewBlock({
				version: -1,
				timestamp: 0,
				previousBlockId: null,
				totalAmountMilliLm: Constants.MaxBalanceMilliLm,
				totalFeeMilliLm: 0,
				payloadLength: transactionsMap.length * 128,
				payloadHash: digest.digest(),
				generatorPublicKey: Genesis.CreatorPublicKey,
				generationSignature: null, //new byte[64],
				blockSignature: Genesis.BlockSignature,
				previousBlockHash: null,
				transactions: transactionsMap
			});
			genesisBlock.SetPrevious(null);
			AddBlock(genesisBlock);
		}
	});

	//} catch (e) {
	//	Logger.logMessage(e.getMessage());
	//	throw new RuntimeException(e.toString(), e);
	//}
}

function AddListener(eventType, listener) {
	return blockListeners.AddListener(eventType, listener);
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

function Init(callback) {
	validateAtScan = Config.GetBooleanProperty("forceValidate");
	blockListeners.AddListener(Event.BLOCK_SCANNED, function(block) {
		if (block.GetHeight() % 1 == 0) {
			Logger.info("processed block " + block.GetHeight());
		}
	});

	ThreadPool.RunBeforeStart(function() {
		AddGenesisBlock(function() {
			Scan();
		});
	}, false);

	//ThreadPool.ScheduleThread(GetMoreBlocksThread.Run, 1000, 'GetMoreBlocksThread');

	if (callback) callback(null);
}

function FullReset() {
	Blocks.DeleteAll();
	AddGenesisBlock(function() {
		Scan();
	});
}

function GenerateBlock1(previousBlockHeight) {
	return previousBlockHeight < Constants.TRANSPARENT_FORGING_BLOCK ? 1
			: previousBlockHeight < Constants.NQT_BLOCK ? 2
			: 3;
}

function GenerateBlock2(secretPhrase, blockTimestamp) {
	throw new Error('Not implementted');
	/*
	Set<TransactionImpl> sortedTransactions = new TreeSet<>();

	for (TransactionImpl transaction : transactionProcessor.getAllUnconfirmedTransactions()) {
		if (hasAllReferencedTransactions(transaction, transaction.getTimestamp(), 0)) {
			sortedTransactions.add(transaction);
		}
	}

	BlockImpl previousBlock = blockchain.getLastBlock();
	if (previousBlock.getHeight() < Constants.DIGITAL_GOODS_STORE_BLOCK) {
		return true;
	}

	SortedMap<Long, TransactionImpl> newTransactions = new TreeMap<>();
	Map<TransactionType, Set<String>> duplicates = new HashMap<>();

	long totalAmountNQT = 0;
	long totalFeeNQT = 0;
	int payloadLength = 0;

	while (payloadLength <= Constants.MAX_PAYLOAD_LENGTH && newTransactions.size() <= Constants.MAX_NUMBER_OF_TRANSACTIONS) {

		int prevNumberOfNewTransactions = newTransactions.size();

		for (TransactionImpl transaction : sortedTransactions) {

			int transactionLength = transaction.getSize();
			if (newTransactions.get(transaction.getId()) != null || payloadLength + transactionLength > Constants.MAX_PAYLOAD_LENGTH) {
				continue;
			}

			if (transaction.getVersion() != transactionProcessor.getTransactionVersion(previousBlock.getHeight())) {
				continue;
			}

			if (transaction.getTimestamp() > blockTimestamp + 15 || (transaction.getExpiration() < blockTimestamp)) {
				continue;
			}

			if (transaction.isDuplicate(duplicates)) {
				continue;
			}

			try {
				transaction.validate();
			} catch (NxtException.NotCurrentlyValidException e) {
				continue;
			} catch (NxtException.ValidationException e) {
				transactionProcessor.removeUnconfirmedTransactions(Collections.singletonList(transaction));
				continue;
			}

			if (!EconomicClustering.verifyFork(transaction)) {
				Logger.logDebugMessage("Including transaction that was generated on a fork: " + transaction.getStringId()
						+ " ecBlockHeight " + transaction.getECBlockHeight() + " ecBlockId " + Convert.toUnsignedLong(transaction.getECBlockId()));
				//continue;
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

	digest.update(previousBlock.getGenerationSignature());
	byte[] generationSignature = digest.digest(publicKey);

	BlockImpl block;
	byte[] previousBlockHash = Crypto.sha256().digest(previousBlock.getBytes());

	try {

		block = new BlockImpl(getBlockVersion(previousBlock.getHeight()), blockTimestamp, previousBlock.getId(), totalAmountNQT, totalFeeNQT, payloadLength,
				payloadHash, publicKey, generationSignature, null, previousBlockHash, new ArrayList<>(newTransactions.values()));

	} catch (NxtException.ValidationException e) {
		// shouldn't happen because all transactions are already validated
		Logger.logMessage("Error generating block", e);
		return true;
	}

	block.sign(secretPhrase);

	if (isScanning) {
		return true;
	}

	block.setPrevious(previousBlock);

	try {
		pushBlock(block);
		blockListeners.notify(block, Event.BLOCK_GENERATED);
		Logger.logDebugMessage("Account " + Convert.toUnsignedLong(block.getGeneratorId()) + " generated block " + block.getStringId()
				+ " at height " + block.getHeight());
		return true;
	} catch (TransactionNotAcceptedException e) {
		Logger.logDebugMessage("Generate block failed: " + e.getMessage());
		Transaction transaction = e.getTransaction();
		Logger.logDebugMessage("Removing invalid transaction: " + transaction.getStringId());
		transactionProcessor.removeUnconfirmedTransactions(Collections.singletonList((TransactionImpl)transaction));
		return false;
	} catch (BlockNotAcceptedException e) {
		Logger.logDebugMessage("Generate block failed: " + e.getMessage());
	}
	return true;
	*/
}

function GetLastBlockchainFeeder() {
	return lastBlockchainFeeder;
}

function GetLastBlockchainFeederHeight() {
	return lastBlockchainFeederHeight;
}

function HasAllReferencedTransactions(transaction, timestamp, count) {
	throw new Error('Not implementted');
	/*
	if (transaction.getReferencedTransactionFullHash() == null) {
		return timestamp - transaction.getTimestamp() < 60 * 1440 * 60 && count < 10;
	}
	transaction = Transactions.FindTransactionByFullHash(transaction.getReferencedTransactionFullHash());
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

			if (block.getVersion() != getBlockVersion(previousLastBlock.getHeight())) {
				throw new BlockNotAcceptedException("Invalid version " + block.getVersion());
			}

			if (block.getVersion() != 1 && ! Arrays.equals(Crypto.sha256().digest(previousLastBlock.getBytes()), block.getPreviousBlockHash())) {
				throw new BlockNotAcceptedException("Previous block hash doesn't match");
			}
			if (block.getTimestamp() > curTime + 15 || block.getTimestamp() <= previousLastBlock.getTimestamp()) {
				throw new BlockOutOfOrderException("Invalid timestamp: " + block.getTimestamp()
						+ " current time is " + curTime + ", previous block timestamp is " + previousLastBlock.getTimestamp());
			}
			if (block.getId().equals(Long.valueOf(0L)) || Blocks.HasBlock(block.GetId(), xxxx)) {
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
						throw new TransactionNotAcceptedException("Invalid transaction timestamp " + transaction.getTimestamp() +
								" for transaction " + transaction.getStringId() + ", current time is " + curTime +
								", block timestamp is " + block.getTimestamp(), transaction);
					}
					if (Transactions.HasTransaction(transaction.getId())) {
						throw new TransactionNotAcceptedException("Transaction " + transaction.getStringId() +
								" is already in the blockchain", transaction);
					}
					if (transaction.getVersion() != transactionProcessor.getTransactionVersion(previousLastBlock.getHeight())) {
						throw new TransactionNotAcceptedException("Invalid transaction version " + transaction.getVersion() +
								" at height " + previousLastBlock.getHeight(), transaction);
					}
					if (!transaction.verifySignature()) {
						throw new TransactionNotAcceptedException("Signature verification failed for transaction " +
						transaction.getStringId() + " at height " + previousLastBlock.getHeight(), transaction);
					}
					if (!EconomicClustering.verifyFork(transaction)) {
						Logger.logDebugMessage("Block " + block.getStringId() + " height " + (previousLastBlock.getHeight() + 1) +
								" contains transaction that was generated on a fork: " +
								transaction.getStringId() + " ecBlockHeight " + transaction.getECBlockHeight() + " ecBlockId " +
								Convert.toUnsignedLong(transaction.getECBlockId()));
					}
					if (transaction.getId().equals(Long.valueOf(0L))) {
						throw new TransactionNotAcceptedException("Invalid transaction id", transaction);
					}
					if (transaction.isDuplicate(duplicates)) {
						throw new TransactionNotAcceptedException("Transaction is a duplicate: " +
								transaction.getStringId(), transaction);
					}
					try {
						transaction.validate();
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
				blockListeners.notify(block, Event.BEFORE_BLOCK_ACCEPT);
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

			blockListeners.Notify(Event.BEFORE_BLOCK_APPLY, block);
			transactionProcessor.apply(block);
			blockListeners.Notify(Event.AFTER_BLOCK_APPLY, block);
			blockListeners.Notify(Event.BLOCK_PUSHED, block);
			transactionProcessor.updateUnconfirmedTransactions(block);

		} catch (RuntimeException e) {
			Logger.logMessage("Error pushing block", e);
			Blocks.deleteBlocksFrom(block.getId());
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
	var block = Blockchain.GetLastBlock();
	Logger.LogDebugMessage("Will pop block " + block.GetStringId() + " at height " + block.GetHeight());
	if (block.GetId() == Genesis.GENESIS_BLOCK_ID) {
		throw new Error("Cannot pop off genesis block");
	}
	var previousBlock = Blocks.FindBlock(block.GetPreviousBlockId());
	blockListeners.Notify(Event.BEFORE_BLOCK_UNDO, block);
	Blockchain.SetLastBlock(block, previousBlock);
	TransactionProcessor.Undo(block);
	Blocks.DeleteBlocksFrom(block.getId());
	blockListeners.Notify(Event.BLOCK_POPPED, block);
	return previousBlock.GetId();

	/*
	} catch (RuntimeException e) {
		Logger.logDebugMessage("Error popping last block: " + e.toString(), e);
		throw new TransactionType.UndoNotSupportedException(e.toString());
	}
	*/
}

function RemoveListener(eventType, listener) {
	return blockListeners.RemoveListener(eventType, listener);
}

function ParseBlock(blockData) {
	return Blocks.ParseBlock(blockData);
}

function Scan() {
	isScanning = true;
	Logger.LogMessage("Scanning blockchain...");
	if (validateAtScan) {
		Logger.LogDebugMessage("Also verifying signatures and validating transactions...");
	}
	Core.Clear();
	/*
	Account.clear();
	Alias.clear();
	Asset.clear();
	Order.clear();
	Poll.clear();
	Trade.clear();
	Vote.clear();
	DigitalGoodsStore.clear();
	Set<TransactionImpl> lostTransactions = new HashSet<>(transactionProcessor.getAllUnconfirmedTransactions());
	transactionProcessor.clear();
	Generator.clear();
	blockchain.setLastBlock(BlockDb.findBlock(Genesis.GENESIS_BLOCK_ID));
	Account.addOrGetAccount(Genesis.CREATOR_ID).apply(Genesis.CREATOR_PUBLIC_KEY, 0);
	try (Connection con = Db.getConnection();
		 PreparedStatement pstmt = con.prepareStatement("SELECT * FROM block ORDER BY db_id ASC");
		 ResultSet rs = pstmt.executeQuery()) {
		Long currentBlockId = Genesis.GENESIS_BLOCK_ID;
		BlockImpl currentBlock = null;
		while (rs.next()) {
			try {
				currentBlock = BlockDb.loadBlock(con, rs);
				if (! currentBlock.getId().equals(currentBlockId)) {
					throw new NxtException.NotValidException("Database blocks in the wrong order!");
				}
				if (validateAtScan && ! currentBlockId.equals(Genesis.GENESIS_BLOCK_ID)) {
					if (!currentBlock.verifyBlockSignature() || !currentBlock.verifyGenerationSignature()) {
						throw new NxtException.NotValidException("Invalid block signature");
					}
					if (currentBlock.getVersion() != getBlockVersion(blockchain.getHeight())) {
						throw new NxtException.NotValidException("Invalid block version");
					}
					byte[] blockBytes = currentBlock.getBytes();
					JSONObject blockJSON = (JSONObject) JSONValue.parse(currentBlock.getJSONObject().toJSONString());
					if (! Arrays.equals(blockBytes, parseBlock(blockJSON).getBytes())) {
						throw new NxtException.NotValidException("Block JSON cannot be parsed back to the same block");
					}
					for (TransactionImpl transaction : currentBlock.getTransactions()) {
						if (!transaction.verifySignature()) {
							throw new NxtException.NotValidException("Invalid transaction signature");
						}
						if (transaction.getVersion() != transactionProcessor.getTransactionVersion(blockchain.getHeight())) {
							throw new NxtException.NotValidException("Invalid transaction version");
						}
						if (! EconomicClustering.verifyFork(transaction)) {
							Logger.logDebugMessage("Found transaction that was generated on a fork: " + transaction.getStringId()
									+ " in block " + currentBlock.getStringId() + " at height " + currentBlock.getHeight()
									+ " ecBlockHeight " + transaction.getECBlockHeight() + " ecBlockId " + Convert.toUnsignedLong(transaction.getECBlockId()));
							//throw new NxtException.NotValidException("Invalid transaction fork");
						}
						transaction.validate();
						byte[] transactionBytes = transaction.getBytes();
						if (currentBlock.getHeight() > Constants.NQT_BLOCK
								&& ! Arrays.equals(transactionBytes, transactionProcessor.parseTransaction(transactionBytes).getBytes())) {
							throw new NxtException.NotValidException("Transaction bytes cannot be parsed back to the same transaction");
						}
						JSONObject transactionJSON = (JSONObject) JSONValue.parse(transaction.getJSONObject().toJSONString());
						if (! Arrays.equals(transactionBytes, transactionProcessor.parseTransaction(transactionJSON).getBytes())) {
							throw new NxtException.NotValidException("Transaction JSON cannot be parsed back to the same transaction");
						}
					}
				}
				for (TransactionImpl transaction : currentBlock.getTransactions()) {
					if (! transaction.applyUnconfirmed()) {
						throw new TransactionNotAcceptedException("Double spending transaction: "
								+ transaction.getStringId(), transaction);
					}
				}
				blockListeners.notify(currentBlock, Event.BEFORE_BLOCK_ACCEPT);
				blockchain.setLastBlock(currentBlock);
				blockListeners.notify(currentBlock, Event.BEFORE_BLOCK_APPLY);
				currentBlock.apply();
				for (TransactionImpl transaction : currentBlock.getTransactions()) {
					transaction.apply();
				}
				blockListeners.notify(currentBlock, Event.AFTER_BLOCK_APPLY);
				blockListeners.notify(currentBlock, Event.BLOCK_SCANNED);
				currentBlockId = currentBlock.getNextBlockId();
			} catch (NxtException|RuntimeException e) {
				Logger.logDebugMessage(e.toString(), e);
				Logger.logDebugMessage("Applying block " + Convert.toUnsignedLong(currentBlockId) + " at height "
						+ (currentBlock == null ? 0 : currentBlock.getHeight()) + " failed, deleting from database");
				if (currentBlock != null) {
					lostTransactions.addAll(currentBlock.getTransactions());
				}
				while (rs.next()) {
					try {
						currentBlock = BlockDb.loadBlock(con, rs);
						lostTransactions.addAll(currentBlock.getTransactions());
					} catch (NxtException.ValidationException ignore) {}
				}
				BlockDb.deleteBlocksFrom(currentBlockId);
				scan();
			}
		}
	} catch (SQLException e) {
		throw new RuntimeException(e.toString(), e);
	}
	transactionProcessor.processTransactions(lostTransactions, true);
	validateAtScan = false;
	Logger.logMessage("...done");
	isScanning = false;
	*/
	throw new Error('Not implementted');
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
exports.GenerateBlock1 = GenerateBlock1;
exports.GenerateBlock2 = GenerateBlock2;
exports.GetLastBlockchainFeeder = GetLastBlockchainFeeder;
exports.GetLastBlockchainFeederHeight = GetLastBlockchainFeederHeight;
exports.FullReset = FullReset;
exports.Init = Init;
exports.IsScanning = IsScanning;
exports.ProcessPeerBlock = ProcessPeerBlock;
exports.RemoveListener = RemoveListener;
exports.ValidateAtNextScan = ValidateAtNextScan;
