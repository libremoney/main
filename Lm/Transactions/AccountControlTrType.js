/**!
 * LibreMoney 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */


var Constants = require(__dirname + '/../Constants');
var TrType = require(__dirname + '/TransactionType');


function CreateAccountControlTransactionType() {
	/*
	public static final TransactionType EFFECTIVE_BALANCE_LEASING = new AccountControl() {

		public final byte getSubtype() {
			return TransactionType.SUBTYPE_ACCOUNT_CONTROL_EFFECTIVE_BALANCE_LEASING;
		}

		void LoadAttachment(TransactionImpl transaction, ByteBuffer buffer) throws NxtException.ValidationException {
			short period = buffer.getShort();
			transaction.setAttachment(new Attachment.AccountControlEffectiveBalanceLeasing(period));
		}

		void LoadAttachment(TransactionImpl transaction, JSONObject attachmentData) throws NxtException.ValidationException {
			short period = ((Long)attachmentData.get("period")).shortValue();
			transaction.setAttachment(new Attachment.AccountControlEffectiveBalanceLeasing(period));
		}

		void applyAttachment(Transaction transaction, Account senderAccount, Account recipientAccount) {
			Attachment.AccountControlEffectiveBalanceLeasing attachment = (Attachment.AccountControlEffectiveBalanceLeasing)transaction.getAttachment();
			Account.getAccount(transaction.getSenderId()).leaseEffectiveBalance(transaction.getRecipientId(), attachment.getPeriod());
		}

		void undoAttachment(Transaction transaction, Account senderAccount, Account recipientAccount) throws UndoNotSupportedException {
			throw new UndoNotSupportedException("Reversal of effective balance leasing not supported");
		}

		void validateAttachment(Transaction transaction) throws NxtException.ValidationException {
			Attachment.AccountControlEffectiveBalanceLeasing attachment = (Attachment.AccountControlEffectiveBalanceLeasing)transaction.getAttachment();
			Account recipientAccount = Account.getAccount(transaction.getRecipientId());
			if (transaction.getRecipientId().equals(transaction.getSenderId())
					|| transaction.getAmountNQT() != 0
					|| attachment.getPeriod() < 1440
					|| recipientAccount == null
					|| (recipientAccount.getPublicKey() == null && ! transaction.getStringId().equals("5081403377391821646"))) {
				throw new NxtException.ValidationException("Invalid effective balance leasing: "
						+ transaction.getJSONObject() + " transaction " + transaction.getStringId());
			}
		}

	};
	*/

	function ApplyAttachmentUnconfirmed(transaction, senderAccount) {
		return true;
	}

	function GetType() {
		return Constants.TYPE_ACCOUNT_CONTROL;
	}

	function UndoAttachmentUnconfirmed(transaction, senderAccount) {
	}

	this.ApplyAttachmentUnconfirmed = ApplyAttachmentUnconfirmed;
	this.GetType = GetType;
	this.UndoAttachmentUnconfirmed = UndoAttachmentUnconfirmed;
	return this;
}

function Init() {
	//accountControl = CreateAccountControlTransactionType();
	//Transactions.Types.Add(accountControl);
}


exports.Init = Init;
