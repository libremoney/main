/**!
 * LibreMoney 0.0
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */


var Constants = require(__dirname + '/../Constants');
var Logger = require(__dirname + '/../Logger').GetLogger(module);
var Transactions = require(__dirname + '/Transactions');
var TrType = require(__dirname + '/TransactionType');


var ordinary;


function CreatePayment() {
	var obj = new TrType();

	function GetType() {
		return Constants.TYPE_PAYMENT;
	}

	obj.GetType = GetType
	return obj;
}

function CreateOrdinary() {
	var obj = CreatePayment();

	function ApplyAttachment(Transaction, SenderAccount, RecipientAccount) {
		RecipientAccount.AddToBalanceAndUnconfirmedBalance/*NQT*/(Transaction.GetAmountMilliLm());
	}

	function ApplyAttachmentUnconfirmed(Transaction, SenderAccount) {
		return true;
	}

	function DoLoadAttachment_Buf(Transaction, Buffer) {}

	function DoLoadAttachment_Json(Transaction, AttachmentData) {}

	function GetName() {
		return 'Payment.Ordinary';
	}

	function GetSubtype() {
		return Constants.SUBTYPE_PAYMENT_ORDINARY_PAYMENT;
	}

	function UndoAttachment(Transaction, SenderAccount, RecipientAccount) {
		RecipientAccount.AddToBalanceAndUnconfirmedBalance/*NQT*/(-Transaction.GetAmountMilliLm());
	}

	function UndoAttachmentUnconfirmed(Transaction, SenderAccount) {}

	function ValidateAttachment(Transaction) {
		if (Transaction.GetAmountMilliLm() <= 0 || Transaction.GetAmountMilliLm() >= Constants.MaxBalanceMilliLm) {
			return false; //throw new NxtException.ValidationException("Invalid ordinary payment");
		}
		return true;
	}

	obj.ApplyAttachment = ApplyAttachment;
	obj.ApplyAttachmentUnconfirmed = ApplyAttachmentUnconfirmed;
	obj.DoLoadAttachment_Buf = DoLoadAttachment_Buf;
	obj.DoLoadAttachment_Json = DoLoadAttachment_Json;
	obj.GetName = GetName;
	obj.GetSubtype = GetSubtype;
	obj.UndoAttachment = UndoAttachment;
	obj.UndoAttachmentUnconfirmed = UndoAttachmentUnconfirmed;
	obj.ValidateAttachment = ValidateAttachment;
	return obj;
}

function GetOrdinary() {
	if (!ordinary)
		Init();
	return ordinary;
}

function Init() {
	ordinary = CreateOrdinary();
	if (!Transactions.Types.Payment)
		Transactions.Types.Payment = {};
	if (!Transactions.Types.Payment.Ordinary)
		Transactions.Types.Payment.Ordinary = ordinary;
	Transactions.Types.Add(ordinary);
	Logger.info('Ordinary payment type is created');
}


exports.GetOrdinary = GetOrdinary;
exports.Init = Init;
