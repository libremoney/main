/**!
 * LibreMoney Blockchain 0.0
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

/*
import nxt.util.DbIterator;
import nxt.util.DbUtils;
*/


var lastBlock; // AtomicReference<BlockImpl>


function GetLastBlock() {
	return lastBlock;
}

function SetLastBlock(block) {
	lastBlock = block;
}

function SetLastBlock(previousBlock, block) {
	throw new Error('Not implementted');
	/*
	if (! lastBlock.compareAndSet(previousBlock, block)) {
		throw new IllegalStateException("Last block is no longer previous block");
	}
	*/
}

function GetHeight() {
	throw new Error('Not implementted');
	/*
	BlockImpl last = lastBlock.get();
	return last == null ? 0 : last.getHeight();
	*/
}

function GetBlock(blockId) {
	throw new Error('Not implementted');
	/*
	return BlockDb.findBlock(blockId);
	*/
}

function HasBlock(blockId) {
	throw new Error('Not implementted');
	/*
	return BlockDb.hasBlock(blockId);
	*/
}

function GetAllBlocks() {
	throw new Error('Not implementted');
	/*
	Connection con = null;
	try {
		con = Db.getConnection();
		PreparedStatement pstmt = con.prepareStatement("SELECT * FROM block ORDER BY db_id ASC");
		return getBlocks(con, pstmt);
	} catch (SQLException e) {
		DbUtils.close(con);
		throw new RuntimeException(e.toString(), e);
	}
	*/
}

function GetBlocks1(account, timestamp) {
	throw new Error('Not implementted');
	/*
	Connection con = null;
	try {
		con = Db.getConnection();
		PreparedStatement pstmt = con.prepareStatement("SELECT * FROM block WHERE timestamp >= ? AND generator_id = ? ORDER BY db_id ASC");
		pstmt.setInt(1, timestamp);
		pstmt.setLong(2, account.getId());
		return getBlocks(con, pstmt);
	} catch (SQLException e) {
		DbUtils.close(con);
		throw new RuntimeException(e.toString(), e);
	}
	*/
}

function GetBlocks2(con, pstmt) {
	throw new Error('Not implementted');
	/*
	return new DbIterator<>(con, pstmt, new DbIterator.ResultSetReader<BlockImpl>() {
		@Override
		public BlockImpl get(Connection con, ResultSet rs) throws NxtException.ValidationException {
			return BlockDb.loadBlock(con, rs);
		}
	});
	*/
}

function GetBlockIdsAfter(blockId, limit) {
	throw new Error('Not implementted');
	/*
	if (limit > 1440) {
		throw new IllegalArgumentException("Can't get more than 1440 blocks at a time");
	}
	try (Connection con = Db.getConnection();
		 PreparedStatement pstmt1 = con.prepareStatement("SELECT db_id FROM block WHERE id = ?");
		 PreparedStatement pstmt2 = con.prepareStatement("SELECT id FROM block WHERE db_id > ? ORDER BY db_id ASC LIMIT ?")) {
		pstmt1.setLong(1, blockId);
		ResultSet rs = pstmt1.executeQuery();
		if (! rs.next()) {
			rs.close();
			return Collections.emptyList();
		}
		List<Long> result = new ArrayList<>();
		int dbId = rs.getInt("db_id");
		pstmt2.setInt(1, dbId);
		pstmt2.setInt(2, limit);
		rs = pstmt2.executeQuery();
		while (rs.next()) {
			result.add(rs.getLong("id"));
		}
		rs.close();
		return result;
	} catch (SQLException e) {
		throw new RuntimeException(e.toString(), e);
	}
	*/
}

function GetBlocksAfter(blockId, limit) {
	throw new Error('Not implementted');
	/*
	if (limit > 1440) {
		throw new IllegalArgumentException("Can't get more than 1440 blocks at a time");
	}
	try (Connection con = Db.getConnection();
		 PreparedStatement pstmt = con.prepareStatement("SELECT * FROM block WHERE db_id > (SELECT db_id FROM block WHERE id = ?) ORDER BY db_id ASC LIMIT ?")) {
		List<BlockImpl> result = new ArrayList<>();
		pstmt.setLong(1, blockId);
		pstmt.setInt(2, limit);
		ResultSet rs = pstmt.executeQuery();
		while (rs.next()) {
			result.add(BlockDb.loadBlock(con, rs));
		}
		rs.close();
		return result;
	} catch (NxtException.ValidationException|SQLException e) {
		throw new RuntimeException(e.toString(), e);
	}
	*/
}

function GetBlockIdAtHeight(height) {
	throw new Error('Not implementted');
	/*
	Block block = lastBlock.get();
	if (height > block.getHeight()) {
		throw new IllegalArgumentException("Invalid height " + height + ", current blockchain is at " + block.getHeight());
	}
	if (height == block.getHeight()) {
		return block.getId();
	}
	return BlockDb.findBlockIdAtHeight(height);
	*/
}

function GetBlocksFromHeight(height) {
	throw new Error('Not implementted');
	/*
	if (height < 0 || lastBlock.get().getHeight() - height > 1440) {
		throw new IllegalArgumentException("Can't go back more than 1440 blocks");
	}
	try (Connection con = Db.getConnection();
		 PreparedStatement pstmt = con.prepareStatement("SELECT * FROM block WHERE height >= ? ORDER BY height ASC")) {
		pstmt.setInt(1, height);
		ResultSet rs = pstmt.executeQuery();
		List<BlockImpl> result = new ArrayList<>();
		while (rs.next()) {
			result.add(BlockDb.loadBlock(con, rs));
		}
		return result;
	} catch (SQLException|NxtException.ValidationException e) {
		throw new RuntimeException(e.toString(), e);
	}
	*/
}

function GetTransaction(transactionId) {
	throw new Error('Not implementted');
	/*
	return TransactionDb.findTransaction(transactionId);
	*/
}

function GetTransactionByFullHash(fullHash) {
	throw new Error('Not implementted');
	/*
	return TransactionDb.findTransactionByFullHash(fullHash);
	*/
}

function HasTransaction(transactionId) {
	throw new Error('Not implementted');
	/*
	return TransactionDb.hasTransaction(transactionId);
	*/
}

function HasTransactionByFullHash(fullHash) {
	throw new Error('Not implementted');
	/*
	return TransactionDb.hasTransactionByFullHash(fullHash);
	*/
}

function GetTransactionCount() {
	throw new Error('Not implementted');
	/*
	try (Connection con = Db.getConnection(); PreparedStatement pstmt = con.prepareStatement("SELECT COUNT(*) FROM transaction")) {
		ResultSet rs = pstmt.executeQuery();
		rs.next();
		return rs.getInt(1);
	} catch (SQLException e) {
		throw new RuntimeException(e.toString(), e);
	}
	*/
}

function GetAllTransactions() {
	throw new Error('Not implementted');
	/*
	Connection con = null;
	try {
		con = Db.getConnection();
		PreparedStatement pstmt = con.prepareStatement("SELECT * FROM transaction ORDER BY db_id ASC");
		return getTransactions(con, pstmt);
	} catch (SQLException e) {
		DbUtils.close(con);
		throw new RuntimeException(e.toString(), e);
	}
	*/
}

function GetTransactions1(account, type, subtype, timestamp, orderAscending) {
	if (typeof orderAscending == 'undefined') orderAscending = true;
	/*
	Connection con = null;
	try {
		StringBuilder buf = new StringBuilder();
		buf.append("SELECT * FROM transaction WHERE (recipient_id = ? OR sender_id = ?) ");
		if (timestamp > 0) {
			buf.append("AND timestamp >= ? ");
		}
		if (type >= 0) {
			buf.append("AND type = ? ");
			if (subtype >= 0) {
				buf.append("AND subtype = ? ");
			}
		}
		if (Boolean.TRUE.equals(orderAscending)) {
			buf.append("ORDER BY timestamp ASC");
		} else if (Boolean.FALSE.equals(orderAscending)) {
			buf.append("ORDER BY timestamp DESC");
		}
		con = Db.getConnection();
		PreparedStatement pstmt;
		int i = 0;
		pstmt = con.prepareStatement(buf.toString());
		pstmt.setLong(++i, account.getId());
		if (timestamp > 0) {
			pstmt.setInt(++i, timestamp);
		}
		if (type >= 0) {
			pstmt.setByte(++i, type);
			if (subtype >= 0) {
				pstmt.setByte(++i, subtype);
			}
		}
		pstmt.setLong(++i, account.getId());
		return getTransactions(con, pstmt);
	} catch (SQLException e) {
		DbUtils.close(con);
		throw new RuntimeException(e.toString(), e);
	}
	*/
	throw new Error('Not implementted');
}

function GetTransactions2(con, pstmt) {
	throw new Error('Not implementted');
	/*
	return new DbIterator<>(con, pstmt, new DbIterator.ResultSetReader<TransactionImpl>() {
		@Override
		public TransactionImpl get(Connection con, ResultSet rs) throws NxtException.ValidationException {
			return TransactionDb.loadTransaction(con, rs);
		}
	});
	*/
}


exports.GetAllBlocks = GetAllBlocks;
exports.GetAllTransactions = GetAllTransactions;
exports.GetBlock = GetBlock;
exports.GetBlockIdAtHeight = GetBlockIdAtHeight;
exports.GetBlockIdsAfter = GetBlockIdsAfter;
exports.GetBlocks1 = GetBlocks1;
exports.GetBlocks2 = GetBlocks2;
exports.GetBlocksAfter = GetBlocksAfter;
exports.GetBlocksFromHeight = GetBlocksFromHeight;
exports.GetHeight = GetHeight;
exports.GetLastBlock = GetLastBlock;
exports.GetTransaction = GetTransaction;
exports.GetTransactionByFullHash = GetTransactionByFullHash;
exports.GetTransactionCount = GetTransactionCount;
exports.GetTransactions1 = GetTransactions1;
exports.GetTransactions2 = GetTransactions2;
exports.HasBlock = HasBlock;
exports.HasTransaction = HasTransaction;
exports.HasTransactionByFullHash = HasTransactionByFullHash;
