/**!
 * LibreMoney transactions 0.0
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


exports.AddNewTransaction = AddNewTransaction;
exports.CreateAttachment = CreateAttachment;
exports.CreateTransaction = CreateTransaction;
exports.CreateTransactionType = CreateTransactionType;
exports.Init = Init;
exports.NewOrdinaryPaymentTransaction = NewOrdinaryPaymentTransaction;
exports.Types = TransactionTypes;

exports.FindTransaction = TransactionDb.FindTransaction;
exports.FindTransactionByFullHash = TransactionDb.FindTransactionByFullHash;
exports.HasTransaction = TransactionDb.HasTransaction;
exports.HasTransactionByFullHash = TransactionDb.HasTransactionByFullHash;
exports.LoadTransaction = TransactionDb.LoadTransaction;
exports.FindBlockTransactions = TransactionDb.FindBlockTransactions;
exports.SaveTransaction = TransactionDb.SaveTransaction;
exports.SaveTransactions = TransactionDb.SaveTransactions;
