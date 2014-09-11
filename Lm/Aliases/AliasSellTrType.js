/**!
 * LibreMoney 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var Constants = require(__dirname + '/../Constants');
var Messaging = require(__dirname + '/../Messages/MessagingTrType');
var TransactionType = require(__dirname + '/../Transactions/TransactionType');


function AliasSell() {
	var obj = new Messaging();

	function ApplyAttachment(transaction, senderAccount, recipientAccount) {
		var attachment = transaction.GetAttachment();
		var aliasName = attachment.GetAliasName();
		var priceMilliLm = attachment.GetPriceMilliLm();
		if (priceMilliLm > 0) {
			Aliases.AddSellOffer(aliasName, priceMilliLm, recipientAccount);
		} else {
			Aliases.ChangeOwner(recipientAccount, aliasName, transaction.getBlockTimestamp());
		}
	}

	function GetSubtype() {
		// TODO
		return TransactionType.SUBTYPE_MESSAGING_ALIAS_SELL;
	}

	function HasRecipient() {
		return true;
	}

	function IsDuplicate(transaction, duplicates) {
		var attachment = transaction.GetAttachment();
		// not a bug, uniqueness is based on Messaging.ALIAS_ASSIGNMENT
		return IsDuplicate3(Messaging.ALIAS_ASSIGNMENT, attachment.GetAliasName().toLowerCase(), duplicates);
	}

	function ParseAttachment_Buf(buffer, transactionVersion) {
		return new Attachment.MessagingAliasSell(buffer, transactionVersion);
	}

	function ParseAttachment_Json(attachmentData) {
		return new Attachment.MessagingAliasSell(attachmentData);
	}

	function UndoAttachment(transaction, senderAccount, recipientAccount) {
		throw new Error("Reversal of alias sell offer not supported");
	}

	function ValidateAttachment(transaction) {
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

	obj.ApplyAttachment = ApplyAttachment;
	obj.GetSubtype = GetSubtype;
	obj.HasRecipient = HasRecipient;
	obj.IsDuplicate = IsDuplicate;
	obj.ParseAttachment_Buf = ParseAttachment_Buf;
	obj.ParseAttachment_Json = ParseAttachment_Json;
	obj.UndoAttachment = UndoAttachment;
	obj.ValidateAttachment = ValidateAttachment;
	return obj;
}


module.exports = AliasSell;
