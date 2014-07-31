/*!
 * LibreMoney 0.0
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var Convert = require(__dirname + '/../Util/Convert');
var Db = require(__dirname + '/../Db');
var Logger = require(__dirname + '/../Logger').GetLogger(module);
var Transaction = require(__dirname + '/Transaction');
var Transactions = require(__dirname + '/Transactions');


function FindTransaction(transactionId, callback) {
	var trModel = Db.GetModel('transaction');
	trModel.findOne({id:transactionId}).exec(function(err, data) {
		if (err) {
			if (callback) callback(err);
			return;
		}
		var transaction = LoadTransaction(data);
		if (callback) callback(null, transaction);
	});
	return true;
}

function FindTransactionByFullHash(fullHash, callback) {
	var trModel = Db.GetModel('transaction');
	trModel.findOne({full_hash:Convert.ParseHexString(fullHash)}).exec(function(err, data) {
		if (err) {
			if (callback) callback(err);
			return;
		}
		new transaction = LoadTransaction(data);
		if (callback) callback(null, transaction);
	});
	return true;
}

function HasTransaction(transactionId) {
	throw new Error('Not implemented');
	/*
	try (Connection con = Db.getConnection();
		 PreparedStatement pstmt = con.prepareStatement("SELECT 1 FROM transaction WHERE id = ?")) {
		pstmt.setLong(1, transactionId);
		ResultSet rs = pstmt.executeQuery();
		return rs.next();
	} catch (SQLException e) {
		throw new RuntimeException(e.toString(), e);
	}
	*/
}

function HasTransactionByFullHash(fullHash) {
	throw new Error('Not implemented');
	/*
	try (Connection con = Db.getConnection();
		 PreparedStatement pstmt = con.prepareStatement("SELECT 1 FROM transaction WHERE full_hash = ?")) {
		pstmt.setBytes(1, Convert.parseHexString(fullHash));
		ResultSet rs = pstmt.executeQuery();
		return rs.next();
	} catch (SQLException e) {
		throw new RuntimeException(e.toString(), e);
	}
	*/
}

function LoadTransaction(tr) {
	var type = tr.type; // Byte
	var subtype = tr.subtype; // Byte
	var timestamp = tr.timestamp; // Int
	var deadline = tr.deadline; // Short
	var senderPublicKey = tr.sender_public_key; // Bytes
	var recipientId = tr.recipient_id; // Long
	var amountMilliLm = tr.amount; // Long
	var feeMilliLm = tr.fee; // Long
	var referencedTransactionFullHash = tr.referenced_transaction_full_hash; // Bytes
	var signature = tr.signature; // Bytes
	var blockId = tr.block_id; // Long
	var height = tr.height; // Int
	var id = tr.id; // Long
	var senderId = tr.sender_id; // Long
	var attachmentBytes = tr.attachment_bytes; // Bytes
	var blockTimestamp = tr.block_timestamp; // Int
	var fullHash = tr.full_hash; // Bytes

	var transactionType = Transactions.Types.Find(type, subtype);
	var transaction = new Transaction({
		type: transactionType,
		timestamp: timestamp,
		deadline: deadline,
		senderPublicKey: senderPublicKey,
		recipientId: recipientId,
		amountMilliLm: amountMilliLm,
		feeMilliLm: feeMilliLm,
		referencedTransactionFullHash: referencedTransactionFullHash,
		signature: signature,
		blockId: blockId,
		height: height,
		id: id,
		senderId: senderId,
		blockTimestamp: blockTimestamp,
		fullHash: fullHash
		});
	/* TODO
	if (attachmentBytes) {
		ByteBuffer buffer = ByteBuffer.wrap(attachmentBytes);
		buffer.order(ByteOrder.LITTLE_ENDIAN);
		transactionType.loadAttachment(transaction, buffer); // this does not do validate
	}
	*/
	return transaction;
}

function FindBlockTransactions(con, blockId) {
	throw new Error('Not implemented');
	/*
	List<TransactionImpl> list = new ArrayList<>();
	try (PreparedStatement pstmt = con.prepareStatement("SELECT * FROM transaction WHERE block_id = ? ORDER BY id")) {
		pstmt.setLong(1, blockId);
		ResultSet rs = pstmt.executeQuery();
		while (rs.next()) {
			list.add(loadTransaction(con, rs));
		}
		rs.close();
		return list;
	} catch (SQLException e) {
		throw new RuntimeException(e.toString(), e);
	} catch (NxtException.ValidationException e) {
		throw new RuntimeException("Transaction already in database for block_id = " + Convert.toUnsignedLong(blockId)
				+ " does not pass validation!", e);
	}
	*/
}

function SaveTransaction(transaction, callback) {
	//console.log(transaction);
	//console.log(transaction.id);

	var trModel = Db.GetModel('transaction');
	tr = new trModel();
	tr.id = transaction.GetId();
	console.log('SaveTransaction: tr.id='+tr.id+' saving...');
	tr.deadline = transaction.GetDeadline();
	tr.sender_public_key = transaction.GetSenderPublicKey();
	tr.recipient_id = transaction.GetRecipientId();
	tr.amount = transaction.GetAmountMilliLm();
	tr.fee = transaction.GetFeeMilliLm();
	if (transaction.GetReferencedTransactionFullHash() != null) {
		tr.referenced_transaction_full_hash = Convert.ParseHexString(transaction.GetReferencedTransactionFullHash());
	} else {
		tr.referenced_transaction_full_hash = Types.BINARY;
	}
	tr.height = transaction.GetHeight();
	tr.block_id = transaction.GetBlockId();
	tr.signature = transaction.GetSignature();
	tr.timestamp = transaction.GetTimestamp();
	tr.type = transaction.GetType().GetType()
	tr.subtype = transaction.GetType().GetSubtype();
	tr.sender_id = transaction.GetSenderId();
	if (transaction.GetAttachment() != null) {
		tr.attachment_bytes = transaction.GetAttachment().GetBytes();
	} else {
		tr.attachment_bytes = 0; //Types.VARBINARY;
	}
	tr.block_timestamp = transaction.GetBlockTimestamp();
	tr.full_hash = Convert.ParseHexString(transaction.GetFullHash());

	//console.log('SaveTransaction: transaction.id='+tr.id);
	/*
	console.log('tr.id='+tr.id);
	console.log('tr.deadline='+tr.deadline);
	console.log('tr.sender_public_key='+tr.sender_public_key);
	console.log('tr.recipient_id='+tr.recipient_id);
	console.log('tr.amount='+tr.amount);
	console.log('tr.fee='+tr.fee);
	console.log('tr.referenced_transaction_full_hash='+tr.referenced_transaction_full_hash);
	console.log('tr.height='+tr.height);
	console.log('tr.block_id='+tr.block_id);
	console.log('tr.signature='+tr.signature);
	console.log('tr.timestamp='+tr.timestamp);
	console.log('tr.type='+tr.type);
	console.log('tr.subtype='+tr.subtype);
	console.log('tr.sender_id='+tr.sender_id);
	console.log('tr.attachment_bytes='+tr.attachment_bytes);
	console.log('tr.block_timestamp='+tr.block_timestamp);
	console.log('tr.full_hash='+tr.full_hash);
	*/

	tr.save(function(err) {
		if (err) {
			Logger.warn('SaveTransaction: non saved. err='+err);
			if (callback)
				callback(err);
			return;
		}
		trModel.findOne({id:tr.id}).exec(function(err, data) {
			if (!err) {
				if (data != null) {
					//console.log('SaveTransaction: data='+data);
					console.log('SaveTransaction: tr.id='+data.id+' saved');
				} else {
					console.log('SaveTransaction: non saved');
				}
			}
			if (callback)
				callback(err);
		});
	});
}

// con, transactions
function SaveTransactions(transactions) {
	for (var transaction in transactions) {
		SaveTransaction(transaction);
	}
}


exports.FindTransaction = FindTransaction;
exports.FindTransactionByFullHash = FindTransactionByFullHash;
exports.HasTransaction = HasTransaction;
exports.HasTransactionByFullHash = HasTransactionByFullHash;
exports.LoadTransaction = LoadTransaction;
exports.FindBlockTransactions = FindBlockTransactions;
exports.SaveTransaction = SaveTransaction;
exports.SaveTransactions = SaveTransactions;
