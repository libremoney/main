/**!
 * LibreMoney Ordinary 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */


var Constants = require(__dirname + '/../../Constants');
var Payment = require(__dirname + '/PaymentTrType');


function Ordinary() {
	this.prototype = new Payment();

	function ApplyAttachment(transaction, senderAccount, recipientAccount) {
		recipientAccount.AddToBalanceAndUnconfirmedBalanceMilliLm(transaction.GetAmountMilliLm());
	}

	function ApplyAttachmentUnconfirmed(transaction, senderAccount) {
		return true;
	}

	function HasRecipient() {
		return true;
	}

	function GetName() {
		return 'Payment.Ordinary';
	}

	function GetSubtype() {
		return Constants.SUBTYPE_PAYMENT_ORDINARY_PAYMENT;
	}

	function ParseAttachment_Buf(buffer, transactionVersion) {
		return Attachment.ORDINARY_PAYMENT;
	}

	function ParseAttachment_Json(attachmentData) {
		return Attachment.ORDINARY_PAYMENT;
	}

	function UndoAttachment(transaction, senderAccount, recipientAccount) {
		recipientAccount.AddToBalanceAndUnconfirmedBalanceMilliLm(-transaction.GetAmountMilliLm());
	}

	function UndoAttachmentUnconfirmed(transaction, senderAccount) {
	}

	function ValidateAttachment(transaction) {
		if (transaction.GetAmountMilliLm() <= 0 || transaction.GetAmountMilliLm() >= Constants.MaxBalanceMilliLm) {
			return false; //throw new NxtException.ValidationException("Invalid ordinary payment");
		}
		return true;
	}

	this.ApplyAttachment = ApplyAttachment;
	this.ApplyAttachmentUnconfirmed = ApplyAttachmentUnconfirmed;
	this.HasRecipient = HasRecipient;
	this.GetName = GetName;
	this.GetSubtype = GetSubtype;
	this.ParseAttachment_Buf = ParseAttachment_Buf;
	this.ParseAttachment_Json = ParseAttachment_Json;
	this.UndoAttachment = UndoAttachment;
	this.UndoAttachmentUnconfirmed = UndoAttachmentUnconfirmed;
	this.ValidateAttachment = ValidateAttachment;
	return this;
}


module.exports = Ordinary;
