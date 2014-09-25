/**!
 * LibreMoney BlockDb 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

if (typeof module !== "undefined") {
	var Db = require(__dirname + '/../../Db');
	var Logger = require(__dirname + '/../../Lib/Util/Logger').GetLogger(module);
	var Transactions = require(__dirname + '/../Transactions');
}


var BlockDb = function() {
	function AddConfirmation(blockId, callback) {
		var blockModel = Db.GetModel('block');
		blockModel.find({id: blockId}, function(err, docs) {
			if (err) {
				Logger.info("Find BlockTransactions ERROR!!!", err);
				if (typeof callback === "function") {
					callback(err);
				}
			}
			if (typeof callback === "function") {
				var block = false;
				if (docs.length > 0) {
					block = docs[0];
					var confirmations = block.confirmations + 1;
					blockModel.update({id: blockId}, {
						$set: {
							confirmations: confirmations
						}
					}, {}, function() {
						callback(null, true);
					})
				} else {
					callback(null, false);
				}
			}
		});
	}

	function DeleteAll(callback) {
		var blockModel = Db.GetModel('block');
		blockModel.remove({}, {}, function(err, numRemoved) {
			if (err) {
				Logger.info("Error drop DB", err);
				if (typeof callback === "function") {
					callback(err);
				}
			}
			if (typeof callback === "function") {
				callback(null);
			}
		});
	}

	function DeleteBlockAtHeight(height, callback) {
		height = parseInt(height);
		var blockModel = Db.GetModel('block');
		blockModel.remove({height: height}, {
			multi: true
		}, function(err, numRemoved) {
			if (typeof callback === "function") {
				if (err) {
					callback(err);
				} else {
					callback(null, numRemoved);
				}
			}
		});
	}

	// relying on cascade triggers in the database to delete the transactions for all deleted blocks
	function DeleteBlocksFrom(blockId) {
		throw new Error('Not implementted');
		/*
		try (Connection con = Db.getConnection();
			 PreparedStatement pstmtSelect = con.prepareStatement("SELECT db_id FROM block WHERE db_id >= "
					 + "(SELECT db_id FROM block WHERE id = ?) ORDER BY db_id DESC");
			 PreparedStatement pstmtDelete = con.prepareStatement("DELETE FROM block WHERE db_id = ?")) {
			try {
				pstmtSelect.setLong(1, blockId);
				try (ResultSet rs = pstmtSelect.executeQuery()) {
					con.commit();
					while (rs.next()) {
						pstmtDelete.setInt(1, rs.getInt("db_id"));
						pstmtDelete.executeUpdate();
						con.commit();
					}
				}
			} catch (SQLException e) {
				con.rollback();
				throw e;
			}
		} catch (SQLException e) {
			throw new RuntimeException(e.toString(), e);
		}
		*/
	}

	function FindBlock(blockId, callback) {
		var blockModel = Db.GetModel('block');
		blockModel.find({id: blockId}).exec(function(err, docs) {
			if (err) {
				Logger.info("Find BlockTransactions ERROR!!!", err);
				return;
			}
			if (typeof callback === "function") {
				var block = false;
				if (docs.length > 0) {
					block = new Block(docs[0]);
					BlockDb.FindRelatedTransactions(block, callback);
				} else {
					callback(null, block);
				}
			}
		});
	}

	function FindBlockAtHeight(height) {
		/*
		try (Connection con = Db.getConnection();
			 PreparedStatement pstmt = con.prepareStatement("SELECT * FROM block WHERE height = ?")) {
			pstmt.setInt(1, height);
			try (ResultSet rs = pstmt.executeQuery()) {
				BlockImpl block;
				if (rs.next()) {
					block = loadBlock(con, rs);
				} else {
					throw new RuntimeException("Block at height " + height + " not found in database!");
				}
				return block;
			}
		} catch (SQLException e) {
			throw new RuntimeException(e.toString(), e);
		} catch (NxtException.ValidationException e) {
			throw new RuntimeException("Block already in database at height " + height + ", does not pass validation!");
		}
		*/
	}

	function FindBlockByRs(rs, callback) {
		var blockModel = Db.GetModel('block');
		blockModel.find(rs).exec(function(err, docs) {
			if (!err) {
				if (typeof callback === "function") {
					var block = false;
					if (docs.length > 0) {
						block = new Block(docs[0]);
						BlockDb.FindRelatedTransactions(block, callback);
					} else {
						callback(null, block);
					}
				}
			} else {
				Logger.info("Find transaction ERROR!!!", err);
				if (typeof callback === "function") {
					callback(err);
				}
			}
		});
	}

	function FindBlockIdAtHeight(height, callback) {
		var blockModel = Db.GetModel('block');
		blockModel.find({height: height}).exec(function(err, docs) {
			if (err) {
				Logger.info("Find BlockTransactions ERROR!!!", err);
				if (typeof callback === "function") {
					callback(err, false);
				}
				return;
			}
			if (typeof callback === "function") {
				var block = false;
				if (docs.length > 0) {
					block = new Block(docs[0]);
					BlockDb.FindRelatedTransactions(block, callback);
				} else {
					Logger.error("Block at height " + height + " not found in database!");
					callback(null, block);
				}
			}
		});
	}

	function FindRelatedTransactions(block, callback) {
		Transactions.FindBlockTransactions(block.id.toString(), function(txs) {
			if (txs === null) {
				txs = {
					count: 0
				}
			}
			block.blockTransactions = txs;
			callback(null, block);
		});
	}

	function GetAllBlockList(callback) {
		var q = {
			tbl: "block"
		};
		var blockModel = Db.GetModel('block');
		blockModel.find(q).sort({
			height: 1
		}).exec(function(err, docs) {
			if (err) {
				Logger.info("Find BlockTransactions ERROR!!!", err);
				if (typeof callback === "function") {
					callback(err);
				}
				return;
			}
			if (typeof callback === "function") {
				callback(null, docs);
			}
		});
	}

	function GetLastBlock(callback) {
		var q = {
			tbl: "block"
		};
		var blockModel = Db.GetModel('block');
		blockModel.find(q).limit(1).sort({
			height: -1
		}).exec(function(err, docs) {
			if (!err) {
				Logger.info("Find BlockTransactions ERROR!!!", err);
				if (typeof callback === "function") {
					callback(err);
				}
				return;
			}
			if (typeof callback === "function") {
				if (docs.length > 0) {
					var block = new Block(docs[0]);
					BlockDb.FindRelatedTransactions(block, callback);
				} else {
					callback(null);
				}
			}
		});
	}

	function GetLastBlocksList(n, callback) {
		var q = {
			tbl: "block"
		};
		var blockModel = Db.GetModel('block');
		blockModel.find(q).limit(n).sort({
			height: -1
		}).exec(function(err, docs) {
			if (err) {
				Logger.info("Find BlockTransactions ERROR!!!", err);
				if (typeof callback === "function") {
					callback(err);
				}
				return;
			}
			if (typeof callback === "function") {
				callback(null, docs);
			}
		});
	}

	function HasBlock(blockId, callback) {
		if (!callback) return;
		var blockModel = Db.GetModel('block');
		blockModel.findOne({id: blockId}).exec(function(err, block) {
			Logger.debug('HasBlock: err='+err+' block='+block);
			if (err) {
				Logger.info("Find transaction ERROR!!!", err);
				callback(err);
				return;
			}
			if (typeof callback === "function") {
				if (block)
					callback(null, true)
				else
					callback(null, false);
			}
		});
	}

	function LoadBlock(con, rs) {
		throw new Error('Not implementted');
		/*
		try {
			int version = rs.getInt("version");
			int timestamp = rs.getInt("timestamp");
			Long previousBlockId = rs.getLong("previous_block_id");
			if (rs.wasNull()) {
				previousBlockId = null;
			}
			long totalAmountNQT = rs.getLong("total_amount");
			long totalFeeNQT = rs.getLong("total_fee");
			int payloadLength = rs.getInt("payload_length");
			byte[] generatorPublicKey = rs.getBytes("generator_public_key");
			byte[] previousBlockHash = rs.getBytes("previous_block_hash");
			BigInteger cumulativeDifficulty = new BigInteger(rs.getBytes("cumulative_difficulty"));
			long baseTarget = rs.getLong("base_target");
			Long nextBlockId = rs.getLong("next_block_id");
			if (rs.wasNull()) {
				nextBlockId = null;
			}
			int height = rs.getInt("height");
			byte[] generationSignature = rs.getBytes("generation_signature");
			byte[] blockSignature = rs.getBytes("block_signature");
			byte[] payloadHash = rs.getBytes("payload_hash");

			Long id = rs.getLong("id");
			List<TransactionImpl> transactions = Transactions.FindBlockTransactions(con, id);

			BlockImpl block = new BlockImpl(version, timestamp, previousBlockId, totalAmountNQT, totalFeeNQT, payloadLength, payloadHash,
					generatorPublicKey, generationSignature, blockSignature, previousBlockHash, transactions,
					cumulativeDifficulty, baseTarget, nextBlockId, height, id);

			for (TransactionImpl transaction : transactions) {
				transaction.setBlock(block);
			}

			return block;

		} catch (SQLException e) {
			throw new RuntimeException(e.toString(), e);
		}
		*/
	}

	function SaveBlock(block, callback) {
		if (block instanceof Block) {
			var blockModel = Db.GetModel('block');
			var tmpBlock = block.GetData();
			if (block.blockTransactions.count > 0 || block.blockTransactions.length > 0) {
				Transactions.DeleteTransactions(block.blockTransactions);
				UnconfirmedTransactions.DeleteTransactions(block.blockTransactions);
				Transactions.SaveTransactions(block.blockTransactions);
			}
			blockModel.insert(tmpBlock, function(err, newDoc) {
				if (err) {
					Logger.info("Transaction insert ERROR", err);
					if (typeof calback === "function") {
						callback(err);
					}
					return;
				}
				if (typeof callback === "function") {
					callback(null);
				}
			});

			// Update PreviousBlock
			if (block.GetPreviousBlockId()) {
				blockModel.findOne({id: block.GetPreviousBlockId()}, function(err, b) {
					b.next_block_id = block.GetId();
					b.save();
				});
			}
		}
	}

	function SetNextBlockId(blockId, nextBlockId, callback) {
		if (blockId === 0) {
			if (typeof callback === "function") {
				callback(null);
			}
			return;
		}
		var blockModel = Db.GetModel('block');
		blockModel.update({id: blockId}, {
			$set: {
				nextBlockId: nextBlockId
			}
		}, {}, function(err, numReplaced) {
			if (err) {
				Logger.info("setNextBlockId error");
				if (typeof callback === "function") {
					callback(err);
				}
				return;
			}
			if (typeof callback === "function") {
				callback(numReplaced)
			}
		});
	}

	return {
		AddConfirmation: AddConfirmation,
		DeleteAll: DeleteAll,
		DeleteBlockAtHeight: DeleteBlockAtHeight,
		DeleteBlocksFrom: DeleteBlocksFrom,
		FindBlock: FindBlock,
		FindBlockAtHeight: FindBlockAtHeight,
		FindBlockByRs: FindBlockByRs,
		FindBlockIdAtHeight: FindBlockIdAtHeight,
		GetAllBlockList: GetAllBlockList,
		GetLastBlock: GetLastBlock,
		GetLastBlocksList: GetLastBlocksList,
		HasBlock: HasBlock,
		LoadBlock: LoadBlock,
		SaveBlock: SaveBlock,
		SetNextBlockId: SetNextBlockId
	}
}();


if (typeof module !== "undefined") {
	module.exports = BlockDb;
}
