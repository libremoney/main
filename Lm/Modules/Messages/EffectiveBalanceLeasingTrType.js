/**!
 * LibreMoney EffectiveBalanceLeasing 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

if (typeof module !== "undefined") {
	var AccountControl = require(__dirname + '/AccountControl');
}


var EffectiveBalanceLeasing = function() {
	return this;
}

EffectiveBalanceLeasing.prototype = new AccountControl();

EffectiveBalanceLeasing.prototype.GetSubtype = function() {
	/*
	return TransactionType.SUBTYPE_ACCOUNT_CONTROL_EFFECTIVE_BALANCE_LEASING;
	*/
}

EffectiveBalanceLeasing.prototype.ParseAttachment = function(buffer, transactionVersion) {
	/*
	return new Attachment.AccountControlEffectiveBalanceLeasing(buffer, transactionVersion);
	*/
}

EffectiveBalanceLeasing.prototype.ParseAttachment = function(attachmentData) {
	/*
	return new Attachment.AccountControlEffectiveBalanceLeasing(attachmentData);
	*/
}

EffectiveBalanceLeasing.prototype.ApplyAttachment = function(transaction, senderAccount, recipientAccount) {
	/*
	Attachment.AccountControlEffectiveBalanceLeasing attachment = (Attachment.AccountControlEffectiveBalanceLeasing) transaction.getAttachment();
	Account.getAccount(transaction.getSenderId()).leaseEffectiveBalance(transaction.getRecipientId(), attachment.getPeriod());
	*/
}

EffectiveBalanceLeasing.prototype.UndoAttachment = function(transaction, senderAccount, recipientAccount) {
	/*
	throw new UndoNotSupportedException("Reversal of effective balance leasing not supported");
	*/
}

EffectiveBalanceLeasing.prototype.ValidateAttachment = function(transaction) {
	/*
	Attachment.AccountControlEffectiveBalanceLeasing attachment = (Attachment.AccountControlEffectiveBalanceLeasing)transaction.getAttachment();
	Account recipientAccount = Account.getAccount(transaction.getRecipientId());
	if (transaction.getSenderId().equals(transaction.getRecipientId())
			|| transaction.getAmountNQT() != 0
			|| attachment.getPeriod() < 1440) {
		throw new NxtException.NotValidException("Invalid effective balance leasing: "
				+ transaction.getJSONObject() + " transaction " + transaction.getStringId());
	}
	if (recipientAccount == null
			|| (recipientAccount.getPublicKey() == null && ! transaction.getStringId().equals("5081403377391821646"))) {
		throw new NxtException.NotCurrentlyValidException("Invalid effective balance leasing: "
				+ " recipient account " + transaction.getRecipientId() + " not found or no public key published");
	}
	*/
}

EffectiveBalanceLeasing.prototype.HasRecipient = function() {
	return true;
}


if (typeof module !== "undefined") {
	module.exports = EffectiveBalanceLeasing;
}
