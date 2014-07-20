/**!
 * LibreMoney transactions 0.0
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var Attachment = require(__dirname + "/Attachment");
var Transaction = require(__dirname + "/Transaction");


var transactions = new Array();


function AddNewTransaction(type, timestamp, deadline, senderPublicKey, recipientId,
		amountMilliLm, feeMilliLm, referencedTransactionFullHash, signature,
		blockId, height, id, senderId, blockTimestamp, fullHash) {
	var tr = new Transaction(type, timestamp, deadline, senderPublicKey, recipientId,
		amountMilliLm, feeMilliLm, referencedTransactionFullHash, signature,
		blockId, height, id, senderId, blockTimestamp, fullHash);
	transactions.push(tr);
	return tr;
}

function CreateAttachment() {
	return new Attachment();
}

function Init() {
}


exports.AddNewTransaction = AddNewTransaction;
exports.CreateAttachment = CreateAttachment;
exports.Init = Init;
