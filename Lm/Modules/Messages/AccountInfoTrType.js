/**!
 * LibreMoney AccountInfoTrType 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

if (typeof module !== "undefined") {
	var Constants = require(__dirname + '/../../Lib/Constants');
	var Messaging = require(__dirname + '/Messaging');
	var TransactionType = require(__dirname + '/../Transactions/TransactionType');
}


function AccountInfo() {
	return this;
}

AccountInfo.prototype = new TransactionType(); //new Messaging();

AccountInfo.prototype.ApplyAttachment = function(transaction, senderAccount, recipientAccount) {
	var attachment = transaction.GetAttachment();
	senderAccount.SetAccountInfo(attachment.GetName(), attachment.GetDescription());
}

AccountInfo.prototype.ApplyAttachmentUnconfirmed = function(transaction, senderAccount) {
	return true;
}

AccountInfo.prototype.GetSubtype = function() {
	// TODO
	return TransactionType.SUBTYPE_MESSAGING_ACCOUNT_INFO;
}

AccountInfo.prototype.GetType = function() {
	return Constants.TrTypeMessaging;
}

AccountInfo.prototype.HasRecipient = function() {
	return false;
}

AccountInfo.prototype.ParseAttachment_Buf = function(buffer, transactionVersion) {
	return new Error(buffer, transactionVersion);
}

AccountInfo.prototype.ParseAttachment_Json = function(attachmentData) {
	return new Error(attachmentData);
}

AccountInfo.prototype.UndoAttachment = function(transaction, senderAccount, recipientAccount) {
	throw new Error("Undoing account info not supported");
}

AccountInfo.prototype.UndoAttachmentUnconfirmed = function(transaction, senderAccount) {
}

AccountInfo.prototype.ValidateAttachment = function(transaction) {
	var attachment = transaction.GetAttachment();
	if (attachment.GetName().length > Constants.MaxAccountNameLength
			|| attachment.GetDescription().length > Constants.MaxAccountDescriptionLength
			) {
		throw new Error("Invalid account info issuance: " + attachment.GetJsonObject());
	}
}


if (typeof module !== "undefined") {
	module.exports = AccountInfo;
}
