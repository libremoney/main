/**!
 * LibreMoney Blockchain 0.0
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var Blocks = require(__dirname + '/../Blocks');
var Db = require(__dirname + '/../Db');
var DbIterator = require(__dirname + '/../Util/DbIterator');
var Logger = require(__dirname + '/../Logger').GetLogger(module);
var Transactions = require(__dirname + '/../Transactions');


var lastBlock; // AtomicReference<BlockImpl>


function GetAllBlocks() {
	var con = null;
	try {
		con = Db.GetConnection();
		var pstmt = con.PrepareStatement("SELECT * FROM block ORDER BY db_id ASC");
		return GetBlocks(con, pstmt);
	} catch (e) {
		con.close();
		throw new Error(e);
	}
}

function GetAllTransactions() {
	var con = null;
	try {
		con = Db.GetConnection();
		var pstmt = con.PrepareStatement("SELECT * FROM transaction ORDER BY db_id ASC");
		return GetTransactions(con, pstmt);
	} catch (e) {
		con.close();
		throw new Error(e);
	}
}

function GetBlock(blockId) {
	return Blocks.FindBlock(blockId);
}

function GetBlockIdAtHeight(height) {
	var block = lastBlock;
	if (height > block.GetHeight()) {
		throw new Error("IllegalArgumentException: Invalid height " + height + ", current blockchain is at " + block.GetHeight());
	}
	if (height == block.GetHeight()) {
		return block.GetId();
	}
	return Blocks.FindBlockIdAtHeight(height);
}

function GetBlockIdsAfter(blockId, limit) {
	if (limit > 1440) {
		throw new Error("IllegalArgumentException: Can't get more than 1440 blocks at a time");
	}
	var con = Db.GetConnection();
	var pstmt1 = con.PrepareStatement("SELECT db_id FROM block WHERE id = ?");
	var pstmt2 = con.PrepareStatement("SELECT id FROM block WHERE db_id > ? ORDER BY db_id ASC LIMIT ?");

	try {
		pstmt1.SetLong(1, blockId);
		var rs = pstmt1.ExecuteQuery();
		if (!rs.next()) {
			rs.close();
			return []; //Collections.emptyList();
		}
		var result = [];
		var dbId = rs.getInt("db_id");
		pstmt2.setInt(1, dbId);
		pstmt2.setInt(2, limit);
		rs = pstmt2.executeQuery();
		while (rs.next()) {
			result.push(rs.getLong("id"));
		}
		rs.close();
		return result;
	} catch (e) {
		throw new Error(e);
	}
}

function GetBlocks1(account, timestamp) {
	var con = null;
	try {
		con = Db.GetConnection();
		var pstmt = con.PrepareStatement("SELECT * FROM block WHERE timestamp >= ? AND generator_id = ? ORDER BY db_id ASC");
		pstmt.setInt(1, timestamp);
		pstmt.setLong(2, account.getId());
		return getBlocks(con, pstmt);
	} catch (e) {
		con.close();
		throw new Error(e);
	}
}

function GetBlocks2(con, pstmt) {
	return new DbIterator(con, pstmt, function(con, rs) {
		return Blocks.LoadBlock(con, rs);
	});
}

function GetBlocksAfter(blockId, limit) {
	if (limit > 1440) {
		throw new Error("IllegalArgumentException: Can't get more than 1440 blocks at a time");
	}
	var con = Db.GetConnection();
	var pstmt = con.PrepareStatement("SELECT * FROM block WHERE db_id > (SELECT db_id FROM block WHERE id = ?) ORDER BY db_id ASC LIMIT ?");
	try {
		var result = [];
		pstmt.setLong(1, blockId);
		pstmt.setInt(2, limit);
		var rs = pstmt.ExecuteQuery();
		while (rs.next()) {
			result.push(Blocks.LoadBlock(con, rs));
		}
		rs.close();
		return result;
	} catch (e) {
		throw new Error(e);
	}
}

function GetBlocksFromHeight(height) {
	if (height < 0 || lastBlock.GetHeight() - height > 1440) {
		throw new Error("IllegalArgumentException: Can't go back more than 1440 blocks");
	}
	var con = Db.GetConnection();
	var pstmt = con.PrepareStatement("SELECT * FROM block WHERE height >= ? ORDER BY height ASC");
	try {
		pstmt.setInt(1, height);
		var rs = pstmt.ExecuteQuery();
		var result = [];
		while (rs.next()) {
			result.push(Blocks.LoadBlock(con, rs));
		}
		return result;
	} catch (e) {
		throw new Error(e);
	}
}

function GetHeight() {
	var last = lastBlock;
	return last == null ? 0 : last.GetHeight();
}

function GetLastBlock() {
	return lastBlock;
}

function GetTransaction(transactionId, callback) {
	return Transactions.FindTransaction(transactionId, callback);
}

function GetTransactionByFullHash(fullHash, callback) {
	return Transactions.FindTransactionByFullHash(fullHash, callback);
}

function GetTransactionCount(callback) {
	Db.GetModel('transaction').count({}, function(err, count) {
		callback(err, count);
	});
}

function GetTransactions1(account, type, subtype, timestamp, orderAscending) {
	throw 'Not implemented';
	//Logger.info('GetTransactions1: account='+account+' type='+type+' subtype='+subtype+' timestamp='+timestamp+' orderAscending='+orderAscending);
	if (typeof orderAscending == 'undefined') orderAscending = true;
	var con = Db.GetConnection();
	try {
		console.log('GetTransactions1: 1');
		/*
		var buf = '';
		buf += "SELECT * FROM transaction WHERE (recipient_id = ? OR sender_id = ?) ";
		if (timestamp > 0) {
			buf += "AND timestamp >= ? ";
		}
		if (type >= 0) {
			buf += "AND type = ? ";
			if (subtype >= 0) {
				buf += "AND subtype = ? ";
			}
		}
		if (orderAscending == true) {
			buf += "ORDER BY timestamp ASC";
		} else if (orderAscending == false) {
			buf += "ORDER BY timestamp DESC";
		}
		con = Db.GetConnection();
		var pstmt;
		var i = 0;
		pstmt = con.PrepareStatement(buf);
		pstmt.SetLong(++i, account.GetId());
		if (timestamp > 0) {
			pstmt.SetInt(++i, timestamp);
		}
		if (type >= 0) {
			pstmt.SetByte(++i, type);
			if (subtype >= 0) {
				pstmt.SetByte(++i, subtype);
			}
		}
		pstmt.SetLong(++i, account.GetId());
		return GetTransactions(con, pstmt);
		*/
	} catch (e) {
		con.close();
		throw new Error(e);
	}
}

function GetTransactions2(con, pstmt) {
	return new DbIterator(con, pstmt, function(con, rs) {
		return Transactions.LoadTransaction(con, rs);
	});
}

function GetTransactions3(account, type, subtype, timestamp, orderAscending, work) {
	if (typeof orderAscending == 'undefined') orderAscending = true;

	trModel = Db.GetModel('transaction');


	q = trModel.find().exec(function(err, data) {
		if (err){
			work(err);
			return;
		}
		var transactions = [];
		for (var i in data) {
			transactions.push(Transactions.LoadTransaction(data[i]));
		}
		work(null, transactions);
	});

	/*
	q = trModel.where();
	if (account) {
		var accId = account.GetId();
		q = trModel.or([{recipient_id: accId}, {sender_id: accId}]); //buf += "SELECT * FROM transaction WHERE (recipient_id = ? OR sender_id = ?) ";
	}
	var accId = 1;
	console.log('GetTransactions3: accId='+accId);
	q = q.or([{recipient_id: accId}, {sender_id: accId}]);
	console.log('GetTransactions3: q='+q);

	if (timestamp > 0) {
		q = q.and('timestamp').gte(timestamp); //buf += "AND timestamp >= ? ";
	}

	if (type >= 0) {
		q = q.and('type').equals(type); //buf += "AND type = ? ";
		if (subtype >= 0) {
			q = q.and('subtype').equals(0); //buf += "AND subtype = ? ";
		}
	}

	if (orderAscending == true) {
		q = q.sort({timestamp:'asc'}); //buf += "ORDER BY timestamp ASC";
	} else if (orderAscending == false) {
		q = q.sort({timestamp:'desc'}); //buf += "ORDER BY timestamp DESC";
	}

	var promise = q.exec(function(err, data) {
		console.log('GetTransactions3: err='+err+' data='+data);
		work(err, data);
	});
	return promise;

	console.log('GetTransactions3: 2');
	*/

	/*
	while (iterator.HasNext()) {
		var transaction = iterator.Next();
		transactionIds.push(transaction.GetStringId());
	}
	*/
}

function HasBlock(blockId, callback) {
	return Blocks.HasBlock(blockId, callback);
}

function HasTransaction(transactionId) {
	return Transactions.HasTransaction(transactionId);
}

function HasTransactionByFullHash(fullHash) {
	return Transactions.HasTransactionByFullHash(fullHash);
}

function Init() {
}

function SetLastBlock1(block) {
	lastBlock = block;
}

function SetLastBlock2(previousBlock, block) {
	if (!lastBlock.CompareAndSet(previousBlock, block)) {
		throw new Error("IllegalStateException: Last block is no longer previous block");
	}
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
exports.GetTransactions3 = GetTransactions3;
exports.HasBlock = HasBlock;
exports.HasTransaction = HasTransaction;
exports.HasTransactionByFullHash = HasTransactionByFullHash;
exports.Init = Init;
exports.SetLastBlock1 = SetLastBlock1;
exports.SetLastBlock2 = SetLastBlock2;
