/**!
 * LibreMoney 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */


function TransactionType() {
	return this;
}


function Apply(transaction, senderAccount, recipientAccount) {
	throw new Error('Not implementted');
	/*
	senderAccount.addToBalanceNQT(- (Convert.safeAdd(transaction.getAmountNQT(), transaction.getFeeNQT())));
	if (transaction.getReferencedTransactionFullHash() != null) {
		senderAccount.addToUnconfirmedBalanceNQT(Constants.UnconfirmedPoolDepositMilliLm);
	}
	applyAttachment(transaction, senderAccount, recipientAccount);
	*/
}

function ApplyAttachment(transaction, senderAccount, recipientAccount) {
}

function ApplyAttachmentUnconfirmed(transaction, senderAccount) {
}

// return false iff double spending
function ApplyUnconfirmed(transaction, senderAccount) {
	throw new Error('Not implementted');
	/*
	long totalAmountNQT = Convert.safeAdd(transaction.getAmountNQT(), transaction.getFeeNQT());
	if (transaction.getReferencedTransactionFullHash() != null
			&& transaction.getTimestamp() > Constants.REFERENCED_TRANSACTION_FULL_HASH_BLOCK_TIMESTAMP) {
		totalAmountNQT = Convert.safeAdd(totalAmountNQT, Constants.UNCONFIRMED_POOL_DEPOSIT_NQT);
	}
	if (senderAccount.getUnconfirmedBalanceNQT() < totalAmountNQT
			&& !(transaction.getTimestamp() == 0 && Arrays.equals(senderAccount.getPublicKey(), Genesis.CREATOR_PUBLIC_KEY))) {
		return false;
	}
	senderAccount.addToUnconfirmedBalanceNQT(-totalAmountNQT);
	if (!applyAttachmentUnconfirmed(transaction, senderAccount)) {
		senderAccount.addToUnconfirmedBalanceNQT(totalAmountNQT);
		return false;
	}
	return true;
	*/
}

function GetName() {
	return '';
}

function GetSubtype() {}

function GetType() {}

function HasRecipient() {
}

function IsDuplicate(transaction, duplicates) {
	return false;
}

function ParseAttachment_Buf(buffer, transactionVersion) {
	//validateAttachment(transaction);
}

function ParseAttachment_Json(attachmentData) {
	//validateAttachment(transaction);
}

function ToString() {
	return "type: " + this.GetType() + ", subtype: " + this.GetSubtype();
}

function Undo(transaction, senderAccount, recipientAccount) {
	throw new Error('Not implementted');
	/*
	senderAccount.addToBalanceNQT(Convert.safeAdd(transaction.getAmountNQT(), transaction.getFeeNQT()));
	if (transaction.getReferencedTransactionFullHash() != null
			&& transaction.getTimestamp() > Constants.REFERENCED_TRANSACTION_FULL_HASH_BLOCK_TIMESTAMP) {
		senderAccount.addToUnconfirmedBalanceNQT(- Constants.UNCONFIRMED_POOL_DEPOSIT_NQT);
	}
	if (recipientAccount != null) {
		recipientAccount.addToBalanceAndUnconfirmedBalanceNQT(-transaction.getAmountNQT());
	}
	undoAttachment(transaction, senderAccount, recipientAccount);
	*/
}

function UndoAttachment(transaction, senderAccount, recipientAccount) {
}

function UndoAttachmentUnconfirmed(transaction, senderAccount) {
}

function UndoUnconfirmed(transaction, senderAccount) {
	throw new Error('Not implementted');
	/*
	senderAccount.addToUnconfirmedBalanceNQT(Convert.safeAdd(transaction.getAmountNQT(), transaction.getFeeNQT()));
	if (transaction.getReferencedTransactionFullHash() != null) {
		senderAccount.addToUnconfirmedBalanceNQT(Constants.UnconfirmedPoolDepositMilliLm);
	}
	undoAttachmentUnconfirmed(transaction, senderAccount);
	*/
}

function ValidateAttachment(transaction) {
}


TransactionType.prototype.Apply = Apply;
TransactionType.prototype.ApplyAttachment = ApplyAttachment;
TransactionType.prototype.ApplyAttachmentUnconfirmed = ApplyAttachmentUnconfirmed;
TransactionType.prototype.ApplyUnconfirmed = ApplyUnconfirmed;
TransactionType.prototype.GetName = GetName;
TransactionType.prototype.GetSubtype = GetSubtype;
TransactionType.prototype.GetType = GetType;
TransactionType.prototype.HasRecipient = HasRecipient;
TransactionType.prototype.IsDuplicate = IsDuplicate;
TransactionType.prototype.ParseAttachment_Buf = ParseAttachment_Buf;
TransactionType.prototype.ParseAttachment_Json = ParseAttachment_Json;
TransactionType.prototype.ToString = ToString;
TransactionType.prototype.Undo = Undo;
TransactionType.prototype.UndoAttachment = UndoAttachment;
TransactionType.prototype.UndoAttachmentUnconfirmed = UndoAttachmentUnconfirmed;
TransactionType.prototype.UndoUnconfirmed = UndoUnconfirmed;
TransactionType.prototype.ValidateAttachment = ValidateAttachment;


module.exports = TransactionType;
