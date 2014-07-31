/**!
 * LibreMoney 0.0
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */


function TransactionType() {
	return this;
}


function Apply(Transaction, SenderAccount, RecipientAccount) {
	/*
	senderAccount.addToBalanceNQT(- (Convert.safeAdd(transaction.getAmountNQT(), transaction.getFeeNQT())));
	if (transaction.getReferencedTransactionFullHash() != null) {
		senderAccount.addToUnconfirmedBalanceNQT(Constants.UnconfirmedPoolDepositMilliLm);
	}
	applyAttachment(transaction, senderAccount, recipientAccount);
	*/
}

function ApplyAttachment(Transaction, SenderAccount, RecipientAccount) {}

function ApplyAttachmentUnconfirmed(Transaction, SenderAccount) {}

// return false iff double spending
function ApplyUnconfirmed(Transaction, SenderAccount) {
	/*
	long totalAmountNQT = Convert.safeAdd(transaction.getAmountNQT(), transaction.getFeeNQT());
	if (transaction.getReferencedTransactionFullHash() != null) {
		totalAmountNQT = Convert.safeAdd(totalAmountNQT, Constants.UnconfirmedPoolDepositMilliLm);
	}
	if (senderAccount.getUnconfirmedBalanceNQT() < totalAmountNQT
			&& ! (transaction.getTimestamp() == 0 && Arrays.equals(senderAccount.getPublicKey(), LmGenesis.CreatorPublicKey))) {
		return false;
	}
	senderAccount.addToUnconfirmedBalanceNQT(- totalAmountNQT);
	if (! applyAttachmentUnconfirmed(transaction, senderAccount)) {
		senderAccount.addToUnconfirmedBalanceNQT(totalAmountNQT);
		return false;
	}
	return true;
	*/
}

function DoLoadAttachment_Buf(Transaction, Buffer) {}

function DoLoadAttachment_Json(Transaction, AttachmentData) {}

function GetName() {
	return '';
}

function GetSubtype() {}

function GetType() {}

function IsDuplicate(Transaction, Duplicates) {
	return false;
}

function LoadAttachment_Buf(Transaction, Buffer) {
	DoLoadAttachment_Buf(Transaction, Buffer);
	//validateAttachment(transaction);
}

function LoadAttachment_Json(Transaction, AttachmentData) {
	DoLoadAttachment_Json(Transaction, AttachmentData);
	//validateAttachment(transaction);
}

function Undo(Transaction, SenderAccount, RecipientAccount) {
	/*
	senderAccount.addToBalanceNQT(Convert.safeAdd(transaction.getAmountNQT(), transaction.getFeeNQT()));
	if (transaction.getReferencedTransactionFullHash() != null) {
		senderAccount.addToUnconfirmedBalanceNQT(- Constants.UnconfirmedPoolDepositMilliLm);
	}
	undoAttachment(transaction, senderAccount, recipientAccount);
	*/
}

function UndoAttachment(Transaction, SenderAccount, RecipientAccount) {}

function UndoAttachmentUnconfirmed(Transaction, SenderAccount) {}

function UndoUnconfirmed(Transaction, SenderAccount) {
	/*
	senderAccount.addToUnconfirmedBalanceNQT(Convert.safeAdd(transaction.getAmountNQT(), transaction.getFeeNQT()));
	if (transaction.getReferencedTransactionFullHash() != null) {
		senderAccount.addToUnconfirmedBalanceNQT(Constants.UnconfirmedPoolDepositMilliLm);
	}
	undoAttachmentUnconfirmed(transaction, senderAccount);
	*/
}

function ValidateAttachment(Transaction) {}


TransactionType.prototype.Apply = Apply;
TransactionType.prototype.ApplyAttachment = ApplyAttachment;
TransactionType.prototype.ApplyAttachmentUnconfirmed = ApplyAttachmentUnconfirmed;
TransactionType.prototype.ApplyUnconfirmed = ApplyUnconfirmed;
TransactionType.prototype.DoLoadAttachment_Buf = DoLoadAttachment_Buf;
TransactionType.prototype.DoLoadAttachment_Json = DoLoadAttachment_Json;
TransactionType.prototype.GetName = GetName;
TransactionType.prototype.GetSubtype = GetSubtype;
TransactionType.prototype.GetType = GetType;
TransactionType.prototype.IsDuplicate = IsDuplicate;
TransactionType.prototype.LoadAttachment_Buf = LoadAttachment_Buf;
TransactionType.prototype.LoadAttachment_Json = LoadAttachment_Json;
TransactionType.prototype.Undo = Undo;
TransactionType.prototype.UndoAttachment = UndoAttachment;
TransactionType.prototype.UndoAttachmentUnconfirmed = UndoAttachmentUnconfirmed;
TransactionType.prototype.UndoUnconfirmed = UndoUnconfirmed;
TransactionType.prototype.ValidateAttachment = ValidateAttachment;


module.exports = TransactionType;
