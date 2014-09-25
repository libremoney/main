/**!
 * LibreMoney BlockchainProcessor 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

if (typeof module !== "undefined") {
	var async = require('async');
	var Block = require(__dirname + '/../Blocks/Block');
	var Blockchain = require(__dirname + '/../Blockchain');
	var BlockDb = require(__dirname + '/../Blocks/BlockDb');
	var Blocks = require(__dirname + '/../Blocks');
	var Config = require(__dirname + '/../../Config');
	var Constants = require(__dirname + '/../../Lib/Constants');
	var Convert = require(__dirname + '/../../Lib/Util/Convert');
	var Crypto = require(__dirname + '/../../Lib/Crypto/Crypto');
	var Genesis = require(__dirname + '/../Genesis');
	var GetMoreBlocksThread = require(__dirname + '/GetMoreBlocksThread');
	var Listeners = require(__dirname + '/../../Lib/Util/Listeners');
	var Logger = require(__dirname + '/../../Lib/Util/Logger').GetLogger(module);
	var ThreadPool = require(__dirname + '/../ThreadPool');
	var Transactions = require(__dirname + '/../Transactions');
	var TransactionProcessor = require(__dirname + '/../TransactionProcessor');
}


var BlockchainProcessor = function() {
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


	function AddBlock(block, withoutBalanceChange, callback) {
		BlockDb.SaveBlock(block, function(err) {
			if (err) {
				if (typeof callback === "function") {
					callback(err);
				}
				return;
			}
			if (typeof withoutBalanceChange === "undefined" || !withoutBalanceChange) {
				block.AddConfirmedAmounts();
				block.AddUnconfirmedFee()
			}
			Blockchain.SetLastBlock(block);
			block.RemoveUnconfirmedTxs();
			NodeServer.BroadcastNewBlock(block);
			if (typeof callback === "function") {
				callback(null);
			}
		});
	}

	function AddGenesisBlock(callback) {
		Blocks.HasBlock(Genesis.GENESIS_BLOCK_ID, function(err, res) {
			Logger.info('AddGenesisBlock: err='+err+' res='+res);
			if (res) {
				Logger.info("AddGenesisBlock: Genesis block already in database");
				if (typeof callback === "function") {
					callback();
				}
				return;
			} else {
				Logger.info("AddGenesisBlock: Genesis block not in database, starting from scratch");
				try {
					var Payments = require(__dirname + '/../../Modules/Payments');
					var transactionsMap = {
						count: 0
					};

					for (var i = 0; i < Genesis.Recipients.length; i++) {
						var transaction = Payments.NewOrdinaryPaymentTransaction({
							timestamp: 0,
							deadline: 0,
							senderPublicKey: Genesis.CreatorPublicKey,
							recipientId: Genesis.Recipients[i],
							amount: Genesis.Amounts[i] * Constants.OneLm,
							fee: 0,
							//referencedTransactionId: 0,
							referencedTransactionFullHash: null,
							signature: Genesis.Signatures[i]
						});
						var id = transaction.GetId().toString();
						transactionsMap[id] = transaction;
						transactionsMap.count++;
					}

					var digest = Crypto.Sha256();
					for (var transactionId in transactionsMap) {
						if (transactionsMap.hasOwnProperty(transactionId) && transactionId != "count") {
							transaction = transactionsMap[transactionId];
							digest.update(transaction.GetBytes());
						}
					}

					var genesisBlock = Blocks.NewBlock({
						version: -1,
						timestamp: 0,
						previousBlockId: null,
						totalAmount: Constants.MaxBalanceMilliLm,
						totalFee: 0,
						//payloadLength: transactionsMap.length * 128,
						payloadHash: digest.digest(),
						generatorPublicKey: Genesis.CreatorPublicKey,
						generationSignature: null, //NULL_HASH
						blockSignature: Genesis.BlockSignature,
						previousBlockHash: null,
						transactions: transactionsMap
					});
					genesisBlock.SetPrevious(null);
					Logger.info("genesisBlock.verifyBlockSignature()", genesisBlock.VerifyBlockSignature());
					AddBlock(genesisBlock, true);
					if (typeof callback === "function") {
						callback();
					}
				} catch (e) {
					Logger.error(e.stack ? e.stack : e.toString());
					throw new Error(e);
				}
			}
		});
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
			 DbIterator<TransactionImpl> iterator = Blockchain.GetTransactions(con, pstmt)) {
			while (iterator.hasNext()) {
				digest.update(iterator.next().getBytes());
			}
		} catch (SQLException e) {
			throw new RuntimeException(e.toString(), e);
		}
		return digest.digest();
		*/
	}

	function CheckExistBlock(block, _callback) {
		function blockTransactionsCheck() {
			var txs = block.GetTransactionsAsArray();
			async.each(txs, function(transaction, callback) {
				BlockchainProcessor.CheckExistTransaction(transaction, callback);
			}, function(err) {
				if (err) {
					_callback(err);
				} else {
					_callback(null);
				}
			})
		}
		if (!block.VerifyBlockSignature()) {
			_callback("Signature verifyBlockSignature verification failed: block height " + block.height);
			return;
		}
		if (parseInt(block.version) > 0) {
			var prevHeight = block.height - 1;
			BlockDb.FindBlockIdAtHeight(prevHeight, function(prevBlock) {
				if (!prevBlock) {
					_callback("Error no prev block find: block height " + block.height);
				} else {
					if (prevBlock.GetId().toString() != block.previousBlockId.toString()) {
						_callback("Previous block id doesn't match: block height " + block.height);
						return;
					}
					if (Crypto.Sha256(prevBlock.GetBytes()).toString("hex") != block.previousBlockHash.toString("hex")) {
						_callback("Previous block hash doesn't match: block height " + block.height);
						return;
					}
					block.VerifyGenerationSignature(function(res) {
						if (!res) {
							_callback("Signature verifyGenerationSignature verification failed: block height " + block.height);
						} else {
							blockTransactionsCheck();
						}
					});
				}
			});
		} else {
			blockTransactionsCheck();
		}
	}

	function CheckExistTransaction(tx, _callback) {
		function txVerify(tx, _callback) {
			if (!tx.Verify()) {
				_callback("Signature verification failed for transaction " + transaction.GetStringId());
				return
			}
			if (tx.GetId().equals(new long(0))) {
				_callback("Invalid transaction id");
				return;
			}
			_callback();
		}
		if (tx.blockId.toString() == Genesis.GenesisBlockId) {
			txVerify(tx, _callback);
			return;
		}
		TransactionDb.hasTransaction(tx.referencedTransactionId.toString(), function(res) {
			if (!res) {
				_callback("Wrong referenced transaction ID");
				return;
			} else {
				txVerify(tx, _callback);
			}
		});
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
		try {
			UnconfirmedTransactions.GetAll(function(transactionsArr) {
				if (transactionsArr.count > 0) {
					var previousBlock = Blockchain.GetLastBlock();
					/*
					if (previousBlock.getHeight() < Constants.DIGITAL_GOODS_STORE_BLOCK) {
						return true;
					}
					*/

					var totalFee = 0;
					var totalAmount = 0;

					var digest = crypto.createHash("sha256");
					for (var transactionId in transactionsArr) {
						if (transactionsArr.hasOwnProperty(transactionId) && transactionId != "count") {
							var transaction = transactionsArr[transactionId];
							digest.update(transaction.GetBytes());
							totalAmount += Convert.RoundTo5Float(transaction.amount);
							totalFee += Convert.RoundTo5Float(transaction.fee);
						}
					}
					/*
					SortedMap<Long, TransactionImpl> newTransactions = new TreeMap<>();
					Map<TransactionType, Set<String>> duplicates = new HashMap<>();

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
							totalAmount += transaction.getAmountNQT();
							totalFee += transaction.getFeeNQT();

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
					*/

					var previousBlockHash = Crypto.Sha256Mesage(previousBlock.GetBytes());
					var generatorPublicKey = LmCrypto.GetPublicKey(secretPhrase);
					var generationSignature = null;
					if (previousBlock.height < Constants.TRANSPARENT_FORGING_BLOCK) {
						generationSignature = LmCrypto.Sign(previousBlock.GenerationSignature.toString("hex"), secretPhrase);
					} else {
						digest.update(previousBlock.generationSignature);
						digest.update(generatorPublicKey);
						generationSignature = digest.digest();
					}
					var block = new Block({
						version: 1,
						timestamp: new Date().getTime(),
						previousBlockId: previousBlock.id,
						totalAmount: Convert.RoundTo5Float(totalAmount),
						totalFee: Convert.RoundTo5Float(totalFee),
						payloadLength: transactionsArr.length * 128,
						payloadHash: digest.digest(),
						generatorPublicKey: generatorPublicKey,
						generationSignature: generationSignature,
						blockSignature: null,
						previousBlockHash: previousBlockHash,
						blockTransactions: transactionsArr
					});
					block.Sign(secretPhrase);
					block.SetPrevious(previousBlock);
					Logger.info("Generating block", block.GetId().toString());
					try {
						Logger.info(block.VerifyBlockSignature());
						block.VerifyGenerationSignature(function(res) {
							Logger.info(res);
						});
						if (block.VerifyBlockSignature()) {
							block.VerifyGenerationSignature(function(res) {
								if (!res) {
									Logger.error("Account " + block.GetGeneratorId() + " generated an incorrect block.");
								}
								BlockchainProcessor.PushBlock(block, function() {
									BlockDb.SetNextBlockId(previousBlock.GetId().toString(), block.GetId().toString(), function() {
										BlockchainProcessor.AddBlock(block, false)
									})
								});
								Logger.info("Account " + block.GetGeneratorId() + " generated block " + block.GetStringId());
							})
						} else {
							Logger.error("Account " + block.GetGeneratorId() + " generated an incorrect block.");
						}
					} catch (err) {
						Logger.error("BlockchainProcessor.generateBlock error");
						Logger.error(err.toString());
					}
					/*
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
				} else {
					Logger.info("No new transactions to generate block.");
				}
			});
		} catch (e) {
			Logger.error("Create block ERROR:", e);
			throw new Error(e);
		}
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

	function Init(callback) {
		events.EventEmitter.call(this);
		//util.inherits(BlockchainProcessor, events.EventEmitter);

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

	function IsScanning() {
		return isScanning;
	}

	function On1(callback) {
		BlockDb.GetLastBlock(function(res) {
			Blockchain.SetLastBlock(res);
			Logger.info("Last block set on height " + res.height);
			callback();
		});
	}

	function On2(callback) {
		TransactionDb.GetLastTransaction(function(res) {
			Blockchain.SetLastTransaction(res);
			Logger.info("Last Transaction id is " + res.id)
		});
		callback();
	}

	function On3(callback) {
		var curHeight = 0;
		var lastHeight = Blockchain.GetLastBlock().height;
		BlockDb.GetAllBlockList(function(err, blocks) {
			if (err) {
				throw Error("GetAllBlockList error. err=" + err + " No block finded at height " + curHeight);
				return;
			}
			if (!blocks) {
				throw Error("No block finded at height " + curHeight);
			}
			async.eachSeries(blocks, function(blockData, _callback) {
				var block = new Block(blockData);
				BlockDb.FindRelatedTransactions(block, function(err, block) {
					if (err) return;
					CheckExistBlock(block, function(err) {
						if (err) {
							_callback(err);
						} else {
							block.AddConfirmedAndUnconfirmedAmounts();
							setImmediate(function() {
								_callback();
							});
						}
					});
				});
			}, function(err) {
				if (err) {
					callback(err);
				} else {
					callback(null);
				}
			});
		});
		/*
		rs ==== SELECT * FROM block ORDER BY db_id ASC
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
					if (currentBlock.getVersion() != getBlockVersion(Blockchain.GetHeight())) {
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
						if (transaction.getVersion() != transactionProcessor.getTransactionVersion(Blockchain.GetHeight())) {
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
				Blockchain.SetLastBlock(currentBlock);
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
		transactionProcessor.processTransactions(lostTransactions, true);
		*/
	}

	function ParseBlock(blockData) {
		return Blocks.ParseBlock(blockData);
	}

	function PopLastBlock(callback) {
		var block = Blockchain.GetLastBlock();
		Logger.LogDebugMessage("Will pop block " + block.GetStringId() + " at height " + block.GetHeight());
		if (block.GetId() == Genesis.GENESIS_BLOCK_ID) {
			throw new Error("Cannot pop off genesis block");
		}
		Blocks.FindBlock(block.GetPreviousBlockId(), function(err, previousBlock) {
			if (err) {
				Logger.debug("Error popping last block: " + e.toString(), e);
				if (typeof callback === "function") {
					callback(err);
				}
				return;
			}
			blockListeners.Notify(Event.BEFORE_BLOCK_UNDO, block);
			Blockchain.SetLastBlock(block, previousBlock);
			TransactionProcessor.Undo(block);
			Blocks.DeleteBlocksFrom(block.getId());
			blockListeners.Notify(Event.BLOCK_POPPED, block);
			if (typeof callback === "function") {
				callback(null, previousBlock.GetId());
			}
		});
	}

	function ProcessPeerBlock(request) {
		throw new Error('Not implementted');
		/*
		BlockImpl block = parseBlock(request);
		pushBlock(block);
		*/
	}

	function PushBlock(block, _callback) {
		var curTime = new Date().getTime();
		var previousLastBlock = Blockchain.GetLastBlock();
		if (previousLastBlock.GetId().toString() != block.PreviousBlockId.toString()) {
			throw new Error("Previous block id doesn't match");
		}
		if (Crypto.Sha256Message(previousLastBlock.GetBytes()).toString("hex") != block.previousBlockHash.toString("hex")) {
			throw new Error("Previous block hash doesn't match");
		}
		/*
		if (block.getVersion() != getBlockVersion(previousLastBlock.getHeight())) {
			throw new BlockNotAcceptedException("Invalid version " + block.getVersion());
		}
		if (block.getVersion() != 1 && ! Arrays.equals(Crypto.sha256().digest(previousLastBlock.getBytes()), block.getPreviousBlockHash())) {
			throw new BlockNotAcceptedException("Previous block hash doesn't match");
		}
		*/
		if (parseInt(block.timestamp) > curTime + 15 || parseInt(block.timestamp) <= parseInt(previousLastBlock.timestamp)) {
			throw new Error("Invalid timestamp: " + block.timestamp + " current time is " + curTime + ", previous block timestamp is " + previousLastBlock.timestamp);
		}

		if (block.GetId().equals(long.fromInt(0))) {
			throw new Error("Invalid id");
		}
		BlockDb.HasBlock(block.GetId(), function(res) {
			if (res) {
				throw new Error("Duplicate ID");
			}
			if (!block.verifyBlockSignature()) {
				throw new Error("Signature verifyBlockSignature verification failed"); // Block signature verification failed
			}
			block.verifyGenerationSignature(function(res) {
				if (!res) {
					throw new Error("Signature verifyGenerationSignature verification failed"); // Generation signature verification failed
				}
				var calculatedTotalAmount = 0,
					calculatedTotalFee = 0,
					duplicates = null,
					accumulatedAmounts = {},
					accumulatedAssetQuantities = null,
					digest = crypto.createHash("sha256");
				var transactionsArr = block.getTransactionsAsArray();
				/*
				Set<Long> unappliedUnconfirmed = transactionProcessor.undoAllUnconfirmed();
				Set<Long> appliedUnconfirmed = new HashSet<>();
				*/
				async.eachSeries(transactionsArr, function(transaction, callback) {
					PushBlock_EachSeries1(transaction, calculatedTotalAmount, calculatedTotalFee, duplicates, accumulatedAmounts, accumulatedAssetQuantities, digest, callback);
				}, function(err) {
					if (err) {
						logger.error(err);
						throw new Error(err)
					} else {
						PushBlock_EachSeries2(block, calculatedTotalAmount, calculatedTotalFee, digest, accumulatedAmounts, _callback);
					}
				})

			});
		});

		/*
		} catch (RuntimeException e) {
			Logger.logMessage("Error pushing block", e);
			Blocks.deleteBlocksFrom(block.getId());
			scan();
			throw new BlockNotAcceptedException(e.toString());
		}
		*/

		/*
		if (block.getTimestamp() >= Convert.getEpochTime() - 15) {
			Peers.sendToSomePeers(block);
		}
		*/
	}

	function PushBlock_EachSeries1(transaction, calculatedTotalAmount, calculatedTotalFee, duplicates, accumulatedAmounts, accumulatedAssetQuantities, digest, callback) {
		if (transaction.GetExpiration() < block.timestamp) {
			callback("Invalid transaction timestamp " + transaction.timestamp + " for transaction " + transaction.GetStringId() + ", current time is " + curTime + ", block timestamp is " + block.timestamp)
		}
		TransactionDb.HasTransaction(transaction.GetId(), function(res) {
			if (res) {
				callback("Transaction " + transaction.GetStringId() + " is already in the blockchain");
			}
			TransactionDb.HasTransaction(transaction.ReferencedTransactionId.toString(), function(res) {
				if (!res && transaction.referencedTransactionId != null && block.GetTransactionIds().indexOf(transaction.referencedTransactionId.toString()) === -1) {
					callback("Missing referenced transaction " + transaction.referencedTransactionId.toString() + " for transaction " + transaction.getStringId())
				}
				if (!transaction.Verify()) {
					callback("Signature verification failed for transaction " + transaction.GetStringId());
				}
				if (transaction.GetId().equals(new long(0))) {
					callback("Invalid transaction id");
				}
				if (transaction.IsDuplicate(duplicates)) {
					callback("Transaction is a duplicate: " + transaction.GetStringId());
				}
				try {
					transaction.ValidateAttachment();
				} catch (e) {
					callback(e);
				}
				calculatedTotalAmount += Convert.RoundTo5Float(transaction.amount);
				transaction.UpdateTotals(accumulatedAmounts, accumulatedAssetQuantities);
				calculatedTotalFee += Convert.RoundTo5Float(transaction.fee);
				digest.update(transaction.GetBytes());
				callback();
			});
		});
		/*
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
		*/
	}

	function PushBlock_EachSeries2(block, calculatedTotalAmount, calculatedTotalFee, digest, accumulatedAmounts, _callback) {
		Logger.info("All transactions passed async verification");
		if (Convert.RoundTo5Float(calculatedTotalAmount) != Convert.RoundTo5Float(block.totalAmount) || Convert.RoundTo5Float(calculatedTotalFee) != Convert.RoundTo5Float(block.totalFee)) {
			throw new Error("Total amount or fee don't match transaction totals");
		}
		var digestStr = digest.digest().toString("hex");
		if (digestStr != block.payloadHash.toString("hex")) {
			Logger.error("Payload hash doesn't match block ID: " + block.id.toString());
			throw new Error("Payload hash doesn't match");
		}
		var accumulatedAmountsArr = [];
		for (var accumulatedAmountEntryId in accumulatedAmounts) {
			if (accumulatedAmounts.hasOwnProperty(accumulatedAmountEntryId)) {
				accumulatedAmountsArr.push({
					key: accumulatedAmountEntryId,
					amount: accumulatedAmounts[accumulatedAmountEntryId]
				});
			}
		}
		async.each(accumulatedAmountsArr, function(accumulatedAmountEntry, callback) {
			var senderAccount = Account.getAccounts(accumulatedAmountEntry.key, function(senderAccauntNums) {
				if (senderAccauntNums.nxtlAccount.amount < accumulatedAmountEntry.amount) {
					callback("Not enough funds in sender account: " + Convert.ToUnsignedLong(senderAccount.GetId()));
				} else {
					callback();
				}
			});
		}, function(err) {
			if (err) {
				throw new Error(err);
			}
			if (typeof _callback === "function") {
				_callback();
			}
		});
		/*
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
		*/
	}

	function RemoveListener(eventType, listener) {
		return blockListeners.RemoveListener(eventType, listener);
	}

	function Run(callback) {
		Accounts.AddOrGetAccount("7684489094182123925");
		AddGenesisBlock(function() {
			Scan(function() {
				Logger.info("blockchain run end");
				if (typeof callback == "function") {
					callback();
				}
			});
		});
	}

	function Scan(callback) {
		isScanning = true;
		Logger.info("Scanning blockchain...");
		if (validateAtScan) {
			Logger.debug("Also verifying signatures and validating transactions...");
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
		*/

		/*
		-- On1 --
		Blockchain.SetLastBlock(BlockDb.findBlock(Genesis.GENESIS_BLOCK_ID));
		Account.addOrGetAccount(Genesis.CREATOR_ID).apply(Genesis.CREATOR_PUBLIC_KEY, 0);
		*/

		async.waterfall([On1, On2, On3], function(err, result) {
			if (err) {
				Logger.error("Scan blockchain ERROR", err);
				throw new Error(err);
			}
			if (typeof _callback == "function") {
				callback();
			}
		});


		validateAtScan = false;
		Logger.info("...Scanning blockchain done");
		isScanning = false;
	}

	function ValidateAtNextScan() {
		validateAtScan = true;
	}

	// TODO: Remove (prof1983)
	function VerifyVersion(block, currentHeight) {
		return block.GetVersion() == 3;
	}


	return {
		Event: Event,

		AddBlock: AddBlock,
		AddListener: AddListener,
		CheckExistBlock: CheckExistBlock,
		CheckExistTransaction: CheckExistTransaction,
		GenerateBlock1: GenerateBlock1,
		GenerateBlock2: GenerateBlock2,
		GetLastBlockchainFeeder: GetLastBlockchainFeeder,
		GetLastBlockchainFeederHeight: GetLastBlockchainFeederHeight,
		FullReset: FullReset,
		Init: Init,
		IsScanning: IsScanning,
		ProcessPeerBlock: ProcessPeerBlock,
		RemoveListener: RemoveListener,
		Run: Run,
		Scan: Scan,
		ValidateAtNextScan: ValidateAtNextScan
	}
}();


if (typeof module !== "undefined") {
	module.exports = BlockchainProcessor;
}
