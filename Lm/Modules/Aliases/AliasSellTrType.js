/**!
 * LibreMoney AliasSell 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

if (typeof module !== "undefined") {
	var Constants = require(__dirname + '/../../Lib/Constants');
	var Messaging = require(__dirname + '/../Messages/MessagingTrType');
	var TransactionType = require(__dirname + '/../../../Core/Transactions/TransactionType');
}


function AliasSell() {
}

AliasSell.prototype = new Messaging();

AliasSell.prototype.ApplyAttachment = function(transaction, senderAccount, recipientAccount) {
	var attachment = transaction.GetAttachment();
	var aliasName = attachment.GetAliasName();
	var priceMilliLm = attachment.GetPriceMilliLm();
	if (priceMilliLm > 0) {
		Aliases.AddSellOffer(aliasName, priceMilliLm, recipientAccount);
	} else {
		Aliases.ChangeOwner(recipientAccount, aliasName, transaction.getBlockTimestamp());
	}
}

AliasSell.prototype.GetSubtype = function() {
	// TODO
	return TransactionType.SUBTYPE_MESSAGING_ALIAS_SELL;
}

AliasSell.prototype.HasRecipient = function() {
	return true;
}

AliasSell.prototype.IsDuplicate = function(transaction, duplicates) {
	var attachment = transaction.GetAttachment();
	// not a bug, uniqueness is based on Messaging.ALIAS_ASSIGNMENT
	return IsDuplicate3(Messaging.ALIAS_ASSIGNMENT, attachment.GetAliasName().toLowerCase(), duplicates);
}

AliasSell.prototype.ParseAttachment_Buf = function(buffer, transactionVersion) {
	return new Attachment.MessagingAliasSell(buffer, transactionVersion);
}

AliasSell.prototype.ParseAttachment_Json = function(attachmentData) {
	return new Attachment.MessagingAliasSell(attachmentData);
}

AliasSell.prototype.UndoAttachment = function(transaction, senderAccount, recipientAccount) {
	throw new Error("Reversal of alias sell offer not supported");
}

AliasSell.prototype.ValidateAttachment = function(transaction) {
	if (transaction.GetAmountMilliLm() != 0) {
		throw new Error("Invalid sell alias transaction: " + transaction.getJsonObject());
	}
	var attachment = transaction.GetAttachment();
	var aliasName = attachment.GetAliasName();
	if (aliasName == null || aliasName.length() == 0) {
		throw new Error("Missing alias name");
	}
	var priceMilliLm = attachment.GetPriceMilliLm();
	if (priceMilliLm < 0 || priceMilliLm > Constants.MaxBalanceMilliLm) {
		throw new Error("Invalid alias sell price: " + priceMilliLm);
	}
	if (priceMilliLm == 0) {
		if (Genesis.CREATOR_ID == transaction.GetRecipientId()) {
			throw new Error("Transferring aliases to Genesis account not allowed");
		} else if (transaction.GetRecipientId() == null) {
			throw new Error("Missing alias transfer recipient");
		}
	}
	var alias = Aliases.GetAlias(aliasName);
	if (alias == null) {
		throw new Error("Alias hasn't been registered yet: " + aliasName);
	} else if (! alias.GetAccountId() == transaction.GetSenderId()) {
		throw new Error("Alias doesn't belong to sender: " + aliasName);
	}
}


if (typeof module !== "undefined") {
	module.exports = AliasSell;
}
