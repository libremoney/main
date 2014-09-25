/**!
 * LibreMoney AliasBuy 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

if (typeof module !== "undefined") {
	var Constants = require(__dirname + '/../../Lib/Constants');
	var Messaging = require(__dirname + '/../Messages/MessagingTrType');
	var TransactionType = require(__dirname + '/../../Core/Transactions/TransactionType');
}


function AliasBuy() {
	var obj = new Messaging();

	function ApplyAttachment(transaction, senderAccount, recipientAccount) {
		var attachment = transaction.GetAttachment();
		var aliasName = attachment.GetAliasName();
		Aliases.ChangeOwner(senderAccount, aliasName, transaction.getBlockTimestamp());
	}

	function GetSubtype() {
		// TODO
		return TransactionType.SUBTYPE_MESSAGING_ALIAS_BUY;
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
		return new Error(buffer, transactionVersion);
	}

	function ParseAttachment_Json(attachmentData) {
		return new Error(attachmentData);
	}

	function UndoAttachment(transaction, senderAccount, recipientAccount) {
		throw new Error("Reversal of alias buy not supported");
	}

	function ValidateAttachment(transaction) {
		var attachment = transaction.GetAttachment();
		var aliasName = attachment.GetAliasName();
		var alias = Aliases.GetAlias(aliasName);
		if (alias == null) {
			throw new Error("Alias hasn't been registered yet: " + aliasName);
		} else if (!alias.GetAccountId() == transaction.GetRecipientId()) {
			throw new Error("Alias is owned by account other than recipient: "
					+ Convert.ToUnsignedLong(alias.GetAccountId()));
		}
		var offer = Aliases.GetOffer(aliasName);
		if (offer == null) {
			throw new Error("Alias is not for sale: " + aliasName);
		}
		if (transaction.GetAmountMilliLm() < offer.GetPriceMilliLm()) {
			var msg = "Price is too low for: " + aliasName + " ("
					+ transaction.GetAmountMilliLm() + " < " + offer.GetPriceMilliLm() + ")";
			throw new Error(msg);
		}
		if (offer.GetBuyerId() != null && ! offer.GetBuyerId() == transaction.GetSenderId()) {
			throw new Error("Wrong buyer for " + aliasName + ": "
					+ Convert.ToUnsignedLong(transaction.GetSenderId()) + " expected: "
					+ Convert.ToUnsignedLong(offer.GetBuyerId()));
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


if (typeof module !== "undefined") {
	module.exports = AliasBuy;
}
