/**!
 * LibreMoney TransactionType 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */


function TransactionType() {
	return this;
}


TransactionType.prototype.Apply = function(transaction, senderAccount, recipientAccount) {
	throw new Error('Not implementted');
	/*
	senderAccount.addToBalanceNQT(- (Convert.safeAdd(transaction.getAmountNQT(), transaction.getFeeNQT())));
	if (transaction.getReferencedTransactionFullHash() != null) {
		senderAccount.addToUnconfirmedBalanceNQT(Constants.UnconfirmedPoolDeposit);
	}
	applyAttachment(transaction, senderAccount, recipientAccount);
	*/
}

TransactionType.prototype.ApplyAttachment = function(transaction, senderAccount, recipientAccount) {
}

TransactionType.prototype.ApplyAttachmentUnconfirmed = function(transaction, senderAccount) {
}

// return false iff double spending
TransactionType.prototype.ApplyUnconfirmed = function(transaction, senderAccount) {
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

TransactionType.prototype.GetName = function() {
	return '';
}

TransactionType.prototype.GetSubtype = function() {}

TransactionType.prototype.GetType = function() {}

TransactionType.prototype.HasRecipient = function() {
}

TransactionType.prototype.IsDuplicate = function(transaction, duplicates) {
	return false;
}

TransactionType.prototype.ParseAttachment_Buf = function(buffer, transactionVersion) {
	//validateAttachment(transaction);
}

TransactionType.prototype.ParseAttachment_Json = function(attachmentData) {
	//validateAttachment(transaction);
}

TransactionType.prototype.ToString = function() {
	return "type: " + this.GetType() + ", subtype: " + this.GetSubtype();
}

TransactionType.prototype.Undo = function(transaction, senderAccount, recipientAccount) {
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

TransactionType.prototype.UndoAttachment = function(transaction, senderAccount, recipientAccount) {
}

TransactionType.prototype.UndoAttachmentUnconfirmed = function(transaction, senderAccount) {
}

TransactionType.prototype.UndoUnconfirmed = function(transaction, senderAccount) {
	throw new Error('Not implementted');
	/*
	senderAccount.addToUnconfirmedBalanceNQT(Convert.safeAdd(transaction.getAmountNQT(), transaction.getFeeNQT()));
	if (transaction.getReferencedTransactionFullHash() != null) {
		senderAccount.addToUnconfirmedBalanceNQT(Constants.UnconfirmedPoolDeposit);
	}
	undoAttachmentUnconfirmed(transaction, senderAccount);
	*/
}

TransactionType.prototype.ValidateAttachment = function(transaction) {
}


if (typeof module !== "undefined") {
	module.exports = TransactionType;
}
