/**!
 * LibreMoney ArbitraryMessageTrType 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

if (typeof module !== "undefined") {
	var Constants = require(__dirname + '/../../Lib/Constants');
	var Messaging = require(__dirname + '/MessagingTrType');
	var TransactionType = require(__dirname + '/../../Core/Transactions/TransactionType');
}


function ArbitraryMessage() {
	return this;
}

ArbitraryMessage.prototype = new Messaging();

ArbitraryMessage.prototype.ApplyAttachment = function(transaction, senderAccount, recipientAccount) {
}

ArbitraryMessage.prototype.GetSubtype = function() {
	// TODO
	return TransactionType.SUBTYPE_MESSAGING_ARBITRARY_MESSAGE;
}

ArbitraryMessage.prototype.HasRecipient = function() {
	return true;
}

ArbitraryMessage.prototype.ParseAttachment_Buf = function(buffer, transactionVersion) {
	// TODO
	return Attachment.ARBITRARY_MESSAGE;
}

ArbitraryMessage.prototype.ParseAttachment_Json = function(attachmentData) {
	// TODO
	return Attachment.ARBITRARY_MESSAGE;
}

ArbitraryMessage.prototype.UndoAttachment = function(transaction, senderAccount, recipientAccount) {
}

ArbitraryMessage.prototype.ValidateAttachment = function(transaction) {
	var attachment = transaction.GetAttachment();
	if (transaction.GetAmountMilliLm() != 0) {
		throw new Error("Invalid arbitrary message: " + attachment.GetJsonObject());
	}
}


if (typeof module !== "undefined") {
	module.exports = ArbitraryMessage;
}
