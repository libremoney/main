/**!
 * LibreMoney 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var Constants = require(__dirname + '/../Constants');
var Messaging = require(__dirname + '/MessagingTrType');
var TransactionType = require(__dirname + '/../Transactions/TransactionType');


function ArbitraryMessage() {
	var obj = new Messaging();

	function ApplyAttachment(transaction, senderAccount, recipientAccount) {
	}

	function GetSubtype() {
		// TODO
		return TransactionType.SUBTYPE_MESSAGING_ARBITRARY_MESSAGE;
	}

	function HasRecipient() {
		return true;
	}

	function ParseAttachment_Buf(buffer, transactionVersion) {
		// TODO
		return Attachment.ARBITRARY_MESSAGE;
	}

	function ParseAttachment_Json(attachmentData) {
		// TODO
		return Attachment.ARBITRARY_MESSAGE;
	}

	function UndoAttachment(transaction, senderAccount, recipientAccount) {
	}

	function ValidateAttachment(transaction) {
		var attachment = transaction.GetAttachment();
		if (transaction.GetAmountMilliLm() != 0) {
			throw new Error("Invalid arbitrary message: " + attachment.GetJsonObject());
		}
	}

	obj.ApplyAttachment = ApplyAttachment;
	obj.GetSubtype = GetSubtype;
	obj.HasRecipient = HasRecipient;
	obj.ParseAttachment_Buf = ParseAttachment_Buf;
	obj.ParseAttachment_Json = ParseAttachment_Json
	obj.UndoAttachment = UndoAttachment;
	obj.ValidateAttachment = ValidateAttachment;
	return obj;
}


module.exports = ArbitraryMessage;
