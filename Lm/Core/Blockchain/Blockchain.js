/**!
 * LibreMoney Blockchain 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

if (typeof module !== "undefined") {
	var Blocks = require(__dirname + '/../Blocks');
	var Db = require(__dirname + '/../../Db');
	var DbIterator = require(__dirname + '/../../Lib/Util/DbIterator');
	var Logger = require(__dirname + '/../../Lib/Util/Logger').GetLogger(module);
	var Transactions = require(__dirname + '/../Transactions');
}


var Blockchain = function() {
	this.lastBlock = null;
	this.lastTransaction = null;
}

Blockchain.prototype.GetAllBlocks = function(callback) {
	/*
	var con = null;
	try {
		con = Db.GetConnection();
		var pstmt = con.PrepareStatement("SELECT * FROM block ORDER BY db_id ASC");
		return GetBlocks(con, pstmt);
	} catch (e) {
		con.close();
		throw new Error(e);
	}
	*/
}

Blockchain.prototype.GetAllTransactions = function(callback) {
	/*
	var con = null;
	try {
		con = Db.GetConnection();
		var pstmt = con.PrepareStatement("SELECT * FROM transaction ORDER BY db_id ASC");
		return GetTransactions(con, pstmt);
	} catch (e) {
		con.close();
		throw new Error(e);
	}
	*/
}

Blockchain.prototype.GetBlock = function(blockId, callback) {
	Blocks.FindBlock(blockId, callback);
}

Blockchain.prototype.GetBlockAtHeight = function(height) {
	var block = this.lastBlock;
	if (height > block.GetHeight()) {
		throw new Error("Invalid height " + height + ", current blockchain is at " + block.GetHeight());
	}
	if (height == block.GetHeight()) {
		return block;
	}
	return BlockDb.FindBlockAtHeight(height);
}

Blockchain.prototype.GetBlockIdAtHeight = function(height) {
	var block = this.lastBlock;
	if (height > block.GetHeight()) {
		throw new Error("IllegalArgumentException: Invalid height " + height + ", current blockchain is at " + block.GetHeight());
	}
	if (height == block.GetHeight()) {
		return block.GetId();
	}
	return Blocks.FindBlockIdAtHeight(height);
}

Blockchain.prototype.GetBlockIdsAfter = function(blockId, limit) {
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

Blockchain.prototype.GetBlocks1 = function(account, timestamp) {
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

Blockchain.prototype.GetBlocks2 = function(con, pstmt) {
	return new DbIterator(con, pstmt, function(con, rs) {
		return Blocks.LoadBlock(con, rs);
	});
}

Blockchain.prototype.GetBlocksAfter = function(blockId, limit) {
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

Blockchain.prototype.GetBlocksFromHeight = function(height) {
	if (height < 0 || this.lastBlock.GetHeight() - height > 1440) {
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

Blockchain.prototype.GetHeight = function() {
	var last = this.lastBlock;
	return last == null ? 0 : last.GetHeight();
}

Blockchain.prototype.GetLastBlock = function() {
	return this.lastBlock;
}

Blockchain.prototype.GetTransaction = function(transactionId, callback) {
	return Transactions.FindTransaction(transactionId, callback);
}

Blockchain.prototype.GetTransactionByFullHash = function(fullHash, callback) {
	return Transactions.FindTransactionByFullHash(fullHash, callback);
}

Blockchain.prototype.GetTransactionCount = function(callback) {
	Db.GetModel('transaction').count({}, function(err, count) {
		callback(err, count);
	});
}

Blockchain.prototype.GetTransactions = function(account, numberOfConfirmations, type, subtype, blockTimestamp, from, to, callback) {
	var height = numberOfConfirmations > 0 ? this.GetHeight() - numberOfConfirmations : Constants.MaxInt;
	if (height < 0) {
		if (typeof callback === "function") {
			callback({
				errorCode: 100,
				errorDescription: "Number of confirmations required " + numberOfConfirmations
					+ " exceeds current blockchain height " + this.GetHeight()
			});
		}
		return;
	}

	var q = {
		$or: [{
			recipient_id: account.GetId()
		}, {
			sender_id: account.GetId()
		}],

		//$and: {recipientId: accountId}, 1
		//$not: {senderId: accountId}, 2
		//$not: {blockId: null},
		type: Constants.TrTypePayment
	};

	if (blockTimestamp > 0) {
		q.block_timestamp = {$gte: blockTimestamp};
	}

	if (type >= 0) {
		q.type = type;
		if (subtype >= 0) {
			q.subtype = subtype;
		}
	}

	if (height < Constants.MaxInt) {
		q.height = {$lte: height}
	}

	/*
	if (to >= from && to < Integer.MAX_VALUE) {
		buf.append(" LIMIT " + (to - from + 1));
	}
	if (from > 0) {
		buf.append(" OFFSET " + from);
	}
	*/

	return TransactionDb.GetTransactions(q, function(err, trs) {
		if (err) {
			if (typeof callback === "function") {
				callback({
					errorCode: 100,
					errorDescription: err
				});
			}
			return;
		}
		if (typeof callback === "function") {
			callback(null, trs);
		}
	});
}

Blockchain.prototype.GetTransactions2 = function(con, pstmt) {
	return new DbIterator(con, pstmt, function(con, rs) {
		return Transactions.LoadTransaction(con, rs);
	});
}

// TODO: Use TransactionDb.GetTransactions()
Blockchain.prototype.GetTransactions3 = function(account, type, subtype, blockTimestamp, orderAscending, work) {
	if (typeof orderAscending == 'undefined')
		return getTransactions(account, 0, type, subtype, blockTimestamp, 0, -1);

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

Blockchain.prototype.HasBlock = function(blockId, callback) {
	return Blocks.HasBlock(blockId, callback);
}

Blockchain.prototype.HasTransaction = function(transactionId) {
	return Transactions.HasTransaction(transactionId);
}

Blockchain.prototype.HasTransactionByFullHash = function(fullHash) {
	return Transactions.HasTransactionByFullHash(fullHash);
}

Blockchain.prototype.Init = function() {
}

Blockchain.prototype.SetLastBlock1 = function(block) {
	this.lastBlock = block;
}

Blockchain.prototype.SetLastBlock2 = function(previousBlock, block) {
	if (!lastBlock.CompareAndSet(previousBlock, block)) {
		throw new Error("IllegalStateException: Last block is no longer previous block");
	}
}

Blockchain.prototype.SetLastTransaction = function(transaction) {
	lastTransaction = transaction;
}


if (typeof module !== "undefined") {
	module.exports = new Blockchain();
}
