/**!
 * LibreMoney 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var Constants = require(__dirname + '/../Constants');
var Messaging = require(__dirname + '/../Messages/MessagingTrType');
var TransactionType = require(__dirname + '/../Transactions/TransactionType');


function AliasAssignment() {
	var obj = new Messaging();

	function ApplyAttachment(transaction, senderAccount, recipientAccount) {
		var attachment = transaction.GetAttachment();
		Aliases.AddOrUpdateAlias(senderAccount, transaction.GetId(), attachment.GetAliasName(),
				attachment.GetAliasUri(), transaction.GetBlockTimestamp());
	}

	function GetSubtype() {
		// TODO
		return TransactionType.SUBTYPE_MESSAGING_ALIAS_ASSIGNMENT;
	}

	function HasRecipient() {
		return false;
	}

	function IsDuplicate(transaction, duplicates) {
		var attachment = transaction.GetAttachment();
		// TODO
		return IsDuplicate3(Messaging.ALIAS_ASSIGNMENT, attachment.getAliasName().toLowerCase(), duplicates);
	}

	function ParseAttachment_Buf(buffer, transactionVersion) {
		// TODO
		return new Attachment.MessagingAliasAssignment(buffer, transactionVersion);
	}

	function ParseAttachment_Json(attachmentData) {
		// TODO
		return new Attachment.MessagingAliasAssignment(attachmentData);
	}

	function UndoAttachment(transaction, senderAccount, recipientAccount) {
		var attachment = transaction.GetAttachment();
		var alias = Aliases.GetAlias(attachment.GetAliasName());
		if (alias.GetId() == transaction.GetId()) {
			Aliases.Remove(alias);
		} else {
			// alias has been updated, can't tell what was its previous uri
			throw new Error("Reversal of alias assignment not supported");
		}
	}

	function ValidateAttachment(transaction) {
		var attachment = transaction.GetAttachment();
		if (attachment.GetAliasName().length == 0
				|| attachment.GetAliasName().length > Constants.MaxAliasLength
				|| attachment.GetAliasUri().length > Constants.MaxAliasUriLength) {
			throw new Error("Invalid alias assignment: " + attachment.GetJsonObject());
		}
		var normalizedAlias = attachment.GetAliasName().toLowerCase();
		for (var i = 0; i < normalizedAlias.length; i++) {
			if (Constants.Alphabet.indexOf(normalizedAlias.charAt(i)) < 0) {
				throw new Error("Invalid alias name: " + normalizedAlias);
			}
		}
		var alias = Aliases.GetAlias(normalizedAlias);
		if (alias != null && ! alias.GetAccountId() == transaction.GetSenderId()) {
			throw new Error("Alias already owned by another account: " + normalizedAlias);
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


module.exports = AliasAssignment;
