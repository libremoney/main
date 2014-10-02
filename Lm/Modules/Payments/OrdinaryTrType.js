/**!
 * LibreMoney Ordinary 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */


if (typeof module !== "undefined") {
	var Constants = require(__dirname + '/../../Lib/Constants');
	var Payment = require(__dirname + '/PaymentTrType');
	var PaymentConstants = require(__dirname + '/PaymentConstants');
}


function Ordinary() {
	Ordinary.prototype = new Payment();
	return this;
}();


Ordinary.ApplyAttachment = function(transaction, senderAccount, recipientAccount) {
	recipientAccount.AddToBalanceAndUnconfirmedBalance(transaction.GetAmount());
}

Ordinary.ApplyAttachmentUnconfirmed = function(transaction, senderAccount) {
	return true;
}

Ordinary.HasRecipient = function() {
	return true;
}

Ordinary.GetName = function() {
	return 'Payment.Ordinary';
}

Ordinary.GetSubtype = function() {
	return PaymentConstants.SUBTYPE_PAYMENT_ORDINARY_PAYMENT;
}

/*
Ordinary.LoadAttachment = function(transaction, attachmentData) {
	TransactionType.Payment.validateAttachment(transaction)
}

Ordinary.LoadAttachment_Buf = function(transaction, buffer) {
	return this.ParseAttachment(transaction);
}
*/

Ordinary.ParseAttachment = function(attachmentData) {
	return Attachment.ORDINARY_PAYMENT;
}

Ordinary.ParseAttachment_Buf = function(buffer, transactionVersion) {
	return Attachment.ORDINARY_PAYMENT;
}

Ordinary.UndoAttachment = function(transaction, senderAccount, recipientAccount) {
	recipientAccount.AddToBalanceAndUnconfirmedBalance(-transaction.GetAmount());
}

Ordinary.UndoAttachmentUnconfirmed = function(transaction, senderAccount) {
}

Ordinary.ValidateAttachment = function(transaction) {
	if (transaction.GetAmount() <= 0 || transaction.GetAmount() >= Constants.MaxBalance) {
		return false; //throw new Error("Invalid ordinary payment: " + transaction.attachment.getJSON());
	}
	return true;
}


if (typeof module !== "undefined") {
	module.exports = Ordinary;
}
