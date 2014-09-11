/**!
 * LibreMoney BlockDb 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var Db = require(__dirname + '/../Db');
var Logger = require(__dirname + '/../Logger').GetLogger(module);
var Transactions = require(__dirname + '/../Transactions');


function DeleteAll() {
	throw new Error('Not implementted');
	/*
	try (Connection con = Db.getConnection();
		 Statement stmt = con.createStatement()) {
		try {
			stmt.executeUpdate("SET REFERENTIAL_INTEGRITY FALSE");
			stmt.executeUpdate("TRUNCATE TABLE transaction");
			stmt.executeUpdate("TRUNCATE TABLE block");
			stmt.executeUpdate("SET REFERENTIAL_INTEGRITY TRUE");
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

function FindBlock(blockId) {
	throw new Error('Not implementted');
	/*
	try (Connection con = Db.getConnection();
		 PreparedStatement pstmt = con.prepareStatement("SELECT * FROM block WHERE id = ?")) {
		pstmt.setLong(1, blockId);
		try (ResultSet rs = pstmt.executeQuery()) {
			BlockImpl block = null;
			if (rs.next()) {
				block = loadBlock(con, rs);
			}
			return block;
		}
	} catch (SQLException e) {
		throw new RuntimeException(e.toString(), e);
	} catch (NxtException.ValidationException e) {
		throw new RuntimeException("Block already in database, id = " + blockId + ", does not pass validation!");
	}
	*/
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

function FindBlockIdAtHeight(height) {
	throw new Error('Not implementted');
	/*
	try (Connection con = Db.getConnection();
		 PreparedStatement pstmt = con.prepareStatement("SELECT id FROM block WHERE height = ?")) {
		pstmt.setInt(1, height);
		try (ResultSet rs = pstmt.executeQuery()) {
			if (!rs.next()) {
				throw new RuntimeException("Block at height " + height + " not found in database!");
			}
			return rs.getLong("id");
		}
	} catch (SQLException e) {
		throw new RuntimeException(e.toString(), e);
	}
	*/
}

function HasBlock(blockId, callback) {
	if (!callback) return;
	var blockModel = Db.GetModel('block');
	blockModel.findOne({id: blockId}).exec(function(err, block) {
		Logger.debug('HasBlock: err='+err+' block='+block);
		if (err) {
			callback(err);
			return;
		}
		if (block)
			callback(null, true)
		else
			callback(null, false);
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

// con, block
function SaveBlock(block) {
	blockModel = Db.GetModel('block');
	var b = new blockModel();

	b.id = block.GetId();
	b.version = block.GetVersion();
	b.timestamp = block.GetTimestamp();

	if (block.GetPreviousBlockId() != null) {
		b.previous_block_id = block.GetPreviousBlockId();
	} else {
		b.previous_block_id = 0; //Types.BIGINT;
	}

	b.total_amount = block.GetTotalAmountMilliLm();
	b.total_fee = block.GetTotalFeeMilliLm();
	b.payload_length = block.GetPayloadLength();
	b.generator_public_key = block.GetGeneratorPublicKey();
	b.previous_block_hash = block.GetPreviousBlockHash();
	b.cumulative_difficulty = block.GetCumulativeDifficulty().toByteArray();
	b.base_target = block.GetBaseTarget();

	if (block.GetNextBlockId() != null) {
		b.next_block_id = block.GetNextBlockId();
	} else {
		b.next_block_id = 0; //Types.BIGINT;
	}

	b.height = block.GetHeight();
	b.generation_signature = block.GetGenerationSignature();
	b.block_signature = block.GetBlockSignature();
	b.payload_hash = block.GetPayloadHash();
	b.generator_id = block.GetGeneratorId();

	b.save();

	Transactions.SaveTransactions(block.GetTransactions());

	// Update PreviousBlock
	if (block.GetPreviousBlockId()) {
		blockModel.findOne({id: block.GetPreviousBlockId()}, function(err, b) {
			b.next_block_id = block.GetId();
			b.save();
		});
	}

	/*
	} catch (SQLException e) {
		throw new RuntimeException(e.toString(), e);
	}
	*/
}


exports.DeleteAll = DeleteAll;
exports.DeleteBlocksFrom = DeleteBlocksFrom;
exports.FindBlock = FindBlock;
exports.FindBlockAtHeight = FindBlockAtHeight;
exports.FindBlockIdAtHeight = FindBlockIdAtHeight;
exports.HasBlock = HasBlock;
exports.LoadBlock = LoadBlock;
exports.SaveBlock = SaveBlock;
