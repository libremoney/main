/*!
 * LibreMoney TransactionDb 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

if (typeof module !== "undefined") {
	var ByteBuffer = require(__dirname + '/../../Lib/Util/ByteBuffer');
	var Convert = require(__dirname + '/../../Lib/Util/Convert');
	var Db = require(__dirname + '/../../Db');
	var Logger = require(__dirname + '/../../Lib/Util/Logger').GetLogger(module);
	var Transaction = require(__dirname + '/Transaction');
	var Transactions = require(__dirname + '/Transactions');
}


var TransactionDb = function() {
}

TransactionDb.FindBlockTransactions = function(con, blockId) {
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

TransactionDb.FindTransaction = function(transactionId, callback) {
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

TransactionDb.FindTransactionByFullHash = function(fullHash, callback) {
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

TransactionDb.HasTransaction = function(transactionId) {
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

TransactionDb.HasTransactionByFullHash = function(fullHash) {
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

TransactionDb.LoadTransaction = function(tr) {
	var type = tr.type; // Byte
	var subtype = tr.subtype; // Byte
	var timestamp = tr.timestamp; // Int
	var deadline = tr.deadline; // Short
	var senderPublicKey = tr.sender_public_key; // Bytes
	var amountMilliLm = tr.amount; // Long
	var feeMilliLm = tr.fee; // Long
	var referencedTransactionFullHash = tr.referenced_transaction_full_hash; // Bytes
	var ecBlockHeight = tr.ec_block_height; // Int
	var ecBlockId = tr.ec_block_id; // Long
	var signature = tr.signature; // Bytes
	var blockId = tr.block_id; // Long
	var height = tr.height; // Int
	var id = tr.id; // Long
	var senderId = tr.sender_id; // Long
	var attachmentBytes = tr.attachment_bytes; // Bytes
	var blockTimestamp = tr.block_timestamp; // Int
	var fullHash = tr.full_hash; // Bytes
	var version = tr.version; // Byte

	var buffer = null;
	if (attachmentBytes) {
		buffer = ByteBuffer.wrap(attachmentBytes);
		buffer.littleEndian();
	}

	var transactionType = Transactions.Find(type, subtype);

	var builder = {
		version: version,
		senderPublicKey: senderPublicKey,
		amountMilliLm: amountMilliLm,
		feeMilliLm: feeMilliLm,
		timestamp: timestamp,
		deadline: deadline,
		attachment: transactionType.ParseAttachment(buffer, version),
		referencedTransactionFullHash: referencedTransactionFullHash,
		signature: signature,
		blockId: blockId,
		height: height,
		id: id,
		senderId: senderId,
		blockTimestamp: blockTimestamp,
		fullHash: fullHash,
	};
	builder.type = builder.attachment.GetTransactionType();
	if (transactionType.hasRecipient()) {
		var recipientId = tr.recipient_id;
		if (!tr.wasNull()) {
			builder.recipientId(recipientId);
		}
	}
	if (tr.has_message) {
		builder.message = new Appendix.Message(buffer, version);
	}
	if (tr.has_encrypted_message) {
		builder.encryptedMessage = new Appendix.EncryptedMessage(buffer, version);
	}
	if (tr.has_public_key_announcement) {
		builder.publicKeyAnnouncement = new Appendix.PublicKeyAnnouncement(buffer, version);
	}
	if (tr.has_encrypttoself_message) {
		builder.encryptToSelfMessage = new Appendix.EncryptToSelfMessage(buffer, version);
	}
	if (ecBlockHeight != 0) {
		builder.ecBlockHeight = ecBlockHeight;
		builder.ecBlockId = ecBlockId;
	}

	var transaction = new Transaction(builder);
	return transaction;
}

TransactionDb.SaveTransaction = function(transaction, callback) {
	//console.log(transaction);
	//console.log(transaction.id);

	var trModel = Db.GetModel('transaction');
	tr = new trModel();
	tr.id = transaction.GetId();
	console.log('SaveTransaction: tr.id='+tr.id+' saving...');
	tr.deadline = transaction.GetDeadline();
	tr.sender_public_key = transaction.GetSenderPublicKey();
	if (transaction.GetType().HasRecipient() && transaction.GetRecipientId() != null) {
		tr.recipient_id = transaction.GetRecipientId();
	} else {
		tr.recipient_id = 0;
	}
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

	var bytesLength = 0;
	for (var appendage in transaction.GetAppendages()) {
		bytesLength += appendage.GetSize();
	}
	if (bytesLength == 0) {
		tr.attachment_bytes = []; //Types.VARBINARY;
	} else {
		var buffer = new ByteBuffer(); //.allocate(bytesLength);
		buffer.littleEndian;
		for (var appendage in transaction.GetAppendages()) {
			appendage.byteArray(buffer);
		}
		tr.attachment_bytes = buffer.array();
	}
	tr.block_timestamp = transaction.GetBlockTimestamp();
	tr.full_hash = Convert.ParseHexString(transaction.GetFullHash());
	tr.version = transaction.GetVersion();
	tr.has_message = (transaction.GetMessage() != null);
	tr.has_encrypted_message = (transaction.GetEncryptedMessage() != null);
	tr.has_public_key_announcement = (transaction.GetPublicKeyAnnouncement() != null);
	tr.has_encrypttoself_message = (transaction.GetEncryptToSelfMessage() != null);
	tr.ec_block_height = transaction.GetECBlockHeight();
	if (transaction.GetECBlockId() != null) {
		tr.ec_block_id = transaction.GetECBlockId();
	} else {
		tr.ec_block_id = 0; //Types.BIGINT;
	}


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
	+ version, has_message, has_encrypted_message, has_public_key_announcement, "
	+ "has_encrypttoself_message, ec_block_height, ec_block_id) "
	+ "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")) {
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
TransactionDb.SaveTransactions = function(transactions) {
	for (var transaction in transactions) {
		SaveTransaction(transaction);
	}
}


if (typeof module !== "undefined") {
	module.exports = TransactionDb;
}
