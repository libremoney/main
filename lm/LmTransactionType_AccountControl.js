
LmTrType = require(__dirname + '/LmTransactionType');

function TransactionType_AccountControl() {

	this.GetType = function () {
		return LmTrType.TYPE_ACCOUNT_CONTROL;
	}

	this.ApplyAttachmentUnconfirmed = function (Transaction, SenderAccount) {
		return true;
	}

	this.UndoAttachmentUnconfirmed = function (Transaction, SenderAccount) {}

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
}

module.exports = TransactionType_AccountControl;
