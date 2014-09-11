/**!
 * LibreMoney 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var Constants = require(__dirname + '/../Constants');
var Messaging = require(__dirname + '/Messaging');
var TransactionType = require(__dirname + '/../Transactions/TransactionType');


function AccountInfo() {
	var obj = new Messaging();

	function ApplyAttachment(transaction, senderAccount, recipientAccount) {
		var attachment = transaction.GetAttachment();
		senderAccount.SetAccountInfo(attachment.GetName(), attachment.GetDescription());
	}

	function GetSubtype() {
		// TODO
		return TransactionType.SUBTYPE_MESSAGING_ACCOUNT_INFO;
	}

	function HasRecipient() {
		return false;
	}

	function ParseAttachment_Buf(buffer, transactionVersion) {
		return new Error(buffer, transactionVersion);
	}

	function ParseAttachment_Json(attachmentData) {
		return new Error(attachmentData);
	}

	function UndoAttachment(transaction, senderAccount, recipientAccount) {
		throw new Error("Undoing account info not supported");
	}

	function ValidateAttachment(transaction) {
		var attachment = transaction.GetAttachment();
		if (attachment.GetName().length > Constants.MaxAccountNameLength
				|| attachment.GetDescription().length > Constants.MaxAccountDescriptionLength
				) {
			throw new Error("Invalid account info issuance: " + attachment.GetJsonObject());
		}
	}

	obj.ApplyAttachment = ApplyAttachment;
	obj.GetSubtype = GetSubtype;
	obj.HasRecipient = HasRecipient;
	obj.ParseAttachment_Buf = ParseAttachment_Buf;
	obj.ParseAttachment_Json = ParseAttachment_Json;
	obj.UndoAttachment = UndoAttachment;
	obj.ValidateAttachment = ValidateAttachment;
	return obj;
}


module.exports = AccountInfo;
