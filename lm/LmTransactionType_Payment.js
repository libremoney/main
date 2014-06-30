
LmConstants = require(__dirname + '/LmConstants');
LmTrType = require(__dirname + '/LmTransactionType');


var Ordinary;


function CreatePayment() {
	var obj = LmTrType.CreateTransactionType();

	function GetType() {
		return LmTrType.TYPE_PAYMENT;
	}

	obj.GetType = GetType
	return obj;
}

function CreateOrdinary() {
	var obj = CreatePayment();

	function GetName() {
		return 'Payment.Ordinary';
	}

	function GetSubtype() {
		return LmTrType.SUBTYPE_PAYMENT_ORDINARY_PAYMENT;
	}

	function DoLoadAttachment_Buf(Transaction, Buffer) {}

	function DoLoadAttachment_Json(Transaction, AttachmentData) {}

	function ApplyAttachmentUnconfirmed(Transaction, SenderAccount) {
		return true;
	}

	function ApplyAttachment(Transaction, SenderAccount, RecipientAccount) {
		RecipientAccount.AddToBalanceAndUnconfirmedBalance/*NQT*/(Transaction.GetAmountMilliLm());
	}

	function UndoAttachment(Transaction, SenderAccount, RecipientAccount) {
		RecipientAccount.AddToBalanceAndUnconfirmedBalance/*NQT*/(-Transaction.GetAmountMilliLm());
	}

	function UndoAttachmentUnconfirmed(Transaction, SenderAccount) {}

	function ValidateAttachment(Transaction) {
		if (Transaction.GetAmountMilliLm() <= 0 || Transaction.GetAmountMilliLm() >= LmConstants.MaxBalanceMilliLm) {
			return false; //throw new NxtException.ValidationException("Invalid ordinary payment");
		}
		return true;
	}

	obj.GetName = GetName;
	obj.GetSubtype = GetSubtype;
	obj.DoLoadAttachment_Buf = DoLoadAttachment_Buf;
	obj.DoLoadAttachment_Json = DoLoadAttachment_Json;
	obj.ApplyAttachmentUnconfirmed = ApplyAttachmentUnconfirmed;
	obj.ApplyAttachment = ApplyAttachment;
	obj.UndoAttachment = UndoAttachment;
	obj.UndoAttachmentUnconfirmed = UndoAttachmentUnconfirmed;
	obj.ValidateAttachment = ValidateAttachment;
	return obj;
}

function GetOrdinary() {
	if (!Ordinary)
		Ordinary = CreateOrdinary();
	return Ordinary;
}


exports.GetOrdinary = GetOrdinary;
