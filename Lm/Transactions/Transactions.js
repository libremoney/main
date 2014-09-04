/**!
 * LibreMoney transactions 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var Attachment = require(__dirname + "/Attachment");
var Convert = require(__dirname + "/../Util/Convert");
//var Core = require(__dirname + "/../Core");
var Transaction = require(__dirname + "/Transaction");
var TransactionDb = require(__dirname + "/TransactionDb");
var TransactionType = require(__dirname + "/TransactionType");
var TransactionTypes = require(__dirname + "/TransactionTypes");
var PaymentTrType = require(__dirname + '/PaymentTrType');
var AccountControlTrType = require(__dirname + '/AccountControlTrType');
var MessagingTrType = require(__dirname + '/MessagingTrType');


var transactions = []; // deprecated

/*
// deprecated
function AddNewTransaction(type, timestamp, deadline, senderPublicKey, recipientId,
		amountMilliLm, feeMilliLm, referencedTransactionFullHash, signature,
		blockId, height, id, senderId, blockTimestamp, fullHash) {
	var tr = new Transaction({
		type: type,
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
	transactions.push(tr);
	return tr;
}
*/

function CreateAttachment() {
	return new Attachment();
}

/*
type,
timestamp,
deadline,
senderPublicKey,
recipientId,
amountMilliLm,
feeMilliLm,
referencedTransactionFullHash,
signature,
blockId,
height,
id,
senderId,
blockTimestamp,
fullHash
*/
function CreateTransaction(data) {
	var tr = new Transaction(data);
	transactions.push(tr);
	return tr;
}

function CreateTransactionType() {
	return new TransactionType();
}

function Init() {
	/*
	Core.AddListener(Core.Event.Clear, function() {
		Clear();
	});
	*/
	PaymentTrType.Init();
	AccountControlTrType.Init();
	MessagingTrType.Init();
}

/*
deadline,
senderPublicKey,
recipientId,
amountMilliLm,
feeMilliLm,
referencedTransactionFullHash,
attachment,
signature
*/
function NewOrdinaryPaymentTransaction(data) {
	var transaction = CreateTransaction({
		type: TransactionTypes.Payment.Ordinary,
		timestamp: 0, //Convert.GetEpochTime(),
		deadline: data.deadline,
		senderPublicKey: data.senderPublicKey,
		recipientId: data.recipientId,
		amountMilliLm: data.amountMilliLm,
		feeMilliLm: data.feeMilliLm,
		referencedTransactionFullHash: data.referencedTransactionFullHash,
		signature: data.signature
		/*blockId,
		height,
		id,
		senderId,
		blockTimestamp,
		fullHash*/
	});
	if (data.attachment)
		transaction.SetAttachment(data.attachment);
	transaction.ValidateAttachment();
	return transaction;
}

function NewTransactionBuilder(senderPublicKey, amountMilliLm, feeMilliLm, deadline, attachment) {
	/*
	byte version = (byte) getTransactionVersion(Nxt.getBlockchain().getHeight());
	int timestamp = Convert.getEpochTime();
	TransactionImpl.BuilderImpl builder = new TransactionImpl.BuilderImpl(version, senderPublicKey, amountNQT, feeNQT, timestamp,
			deadline, (Attachment.AbstractAttachment)attachment);
	if (version > 0) {
		Block ecBlock = EconomicClustering.getECBlockId(timestamp);
		builder.ecBlockHeight(ecBlock.getHeight());
		builder.ecBlockId(ecBlock.getId());
	}
	return builder;
	*/
}

function ParseTransaction1(bytes) {
	throw new Error('Not implementted');
	/*
	ByteBuffer buffer = ByteBuffer.wrap(bytes);
	buffer.order(ByteOrder.LITTLE_ENDIAN);
	byte type = buffer.get();
	byte subtype = buffer.get();
	byte version = (byte) ((subtype & 0xF0) >> 4);
	subtype = (byte) (subtype & 0x0F);
	int timestamp = buffer.getInt();
	short deadline = buffer.getShort();
	byte[] senderPublicKey = new byte[32];
	buffer.get(senderPublicKey);
	Long recipientId = Convert.zeroToNull(buffer.getLong());
	long amountNQT = buffer.getLong();
	long feeNQT = buffer.getLong();
	String referencedTransactionFullHash = null;
	byte[] referencedTransactionFullHashBytes = new byte[32];
	buffer.get(referencedTransactionFullHashBytes);
	if (Convert.emptyToNull(referencedTransactionFullHashBytes) != null) {
		referencedTransactionFullHash = Convert.toHexString(referencedTransactionFullHashBytes);
	}
	byte[] signature = new byte[64];
	buffer.get(signature);
	signature = Convert.emptyToNull(signature);
	int flags = 0;
	int ecBlockHeight = 0;
	Long ecBlockId = null;
	if (version > 0) {
		flags = buffer.getInt();
		ecBlockHeight = buffer.getInt();
		ecBlockId = buffer.getLong();
	}
	TransactionType transactionType = TransactionType.findTransactionType(type, subtype);
	TransactionImpl.BuilderImpl builder = new TransactionImpl.BuilderImpl(version, senderPublicKey, amountNQT, feeNQT,
			timestamp, deadline, transactionType.parseAttachment(buffer, version))
			.referencedTransactionFullHash(referencedTransactionFullHash)
			.signature(signature)
			.ecBlockHeight(ecBlockHeight)
			.ecBlockId(ecBlockId);
	if (transactionType.hasRecipient()) {
		builder.recipientId(recipientId);
	}
	int position = 1;
	if ((flags & position) != 0 || (version == 0 && transactionType == TransactionType.Messaging.ARBITRARY_MESSAGE)) {
		builder.message(new Appendix.Message(buffer, version));
	}
	position <<= 1;
	if ((flags & position) != 0) {
		builder.encryptedMessage(new Appendix.EncryptedMessage(buffer, version));
	}
	position <<= 1;
	if ((flags & position) != 0) {
		builder.publicKeyAnnouncement(new Appendix.PublicKeyAnnouncement(buffer, version));
	}
	position <<= 1;
	if ((flags & position) != 0) {
		builder.encryptToSelfMessage(new Appendix.EncryptToSelfMessage(buffer, version));
	}
	return builder.build();
	*/

	/*
	} catch (NxtException.NotValidException|RuntimeException e) {
		Logger.logDebugMessage("Failed to parse transaction bytes: " + Convert.toHexString(bytes));
		throw e;
	}
	*/
}

function ParseTransaction2(transactionData) {
	throw new Error('Not implementted');
	/*
	byte type = ((Long) transactionData.get("type")).byteValue();
	byte subtype = ((Long) transactionData.get("subtype")).byteValue();
	int timestamp = ((Long) transactionData.get("timestamp")).intValue();
	short deadline = ((Long) transactionData.get("deadline")).shortValue();
	byte[] senderPublicKey = Convert.parseHexString((String) transactionData.get("senderPublicKey"));
	long amountNQT = Convert.parseLong(transactionData.get("amountNQT"));
	long feeNQT = Convert.parseLong(transactionData.get("feeNQT"));
	String referencedTransactionFullHash = (String) transactionData.get("referencedTransactionFullHash");
	byte[] signature = Convert.parseHexString((String) transactionData.get("signature"));
	Long versionValue = (Long) transactionData.get("version");
	byte version = versionValue == null ? 0 : versionValue.byteValue();
	JSONObject attachmentData = (JSONObject) transactionData.get("attachment");

	TransactionType transactionType = TransactionType.findTransactionType(type, subtype);
	if (transactionType == null) {
		throw new NxtException.NotValidException("Invalid transaction type: " + type + ", " + subtype);
	}
	TransactionImpl.BuilderImpl builder = new TransactionImpl.BuilderImpl(version, senderPublicKey,
			amountNQT, feeNQT, timestamp, deadline,
			transactionType.parseAttachment(attachmentData))
			.referencedTransactionFullHash(referencedTransactionFullHash)
			.signature(signature);
	if (transactionType.hasRecipient()) {
		Long recipientId = Convert.parseUnsignedLong((String) transactionData.get("recipient"));
		builder.recipientId(recipientId);
	}
	if (attachmentData != null) {
		builder.message(Appendix.Message.parse(attachmentData));
		builder.encryptedMessage(Appendix.EncryptedMessage.parse(attachmentData));
		builder.publicKeyAnnouncement((Appendix.PublicKeyAnnouncement.parse(attachmentData)));
		builder.encryptToSelfMessage(Appendix.EncryptToSelfMessage.parse(attachmentData));
	}
	if (version > 0) {
		builder.ecBlockHeight(((Long) transactionData.get("ecBlockHeight")).intValue());
		builder.ecBlockId(Convert.parseUnsignedLong((String) transactionData.get("ecBlockId")));
	}
	return builder.build();
	*/

	/*
	} catch (NxtException.NotValidException|RuntimeException e) {
		Logger.logDebugMessage("Failed to parse transaction: " + transactionData.toJSONString());
		throw e;
	}
	*/
}


exports.AddNewTransaction = AddNewTransaction;
exports.CreateAttachment = CreateAttachment;
exports.CreateTransaction = CreateTransaction;
exports.CreateTransactionType = CreateTransactionType;
exports.Init = Init;
exports.NewOrdinaryPaymentTransaction = NewOrdinaryPaymentTransaction;
exports.NewTransactionBuilder = NewTransactionBuilder;
exports.ParseTransaction1 = ParseTransaction1;
exports.ParseTransaction2 = ParseTransaction2;
exports.Types = TransactionTypes;

exports.FindTransaction = TransactionDb.FindTransaction;
exports.FindTransactionByFullHash = TransactionDb.FindTransactionByFullHash;
exports.HasTransaction = TransactionDb.HasTransaction;
exports.HasTransactionByFullHash = TransactionDb.HasTransactionByFullHash;
exports.LoadTransaction = TransactionDb.LoadTransaction;
exports.FindBlockTransactions = TransactionDb.FindBlockTransactions;
exports.SaveTransaction = TransactionDb.SaveTransaction;
exports.SaveTransactions = TransactionDb.SaveTransactions;
