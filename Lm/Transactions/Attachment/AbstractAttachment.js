/**!
 * LibreMoney 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */


/*
abstract static class AbstractAttachment extends AbstractAppendix implements Attachment {

	private AbstractAttachment(ByteBuffer buffer, byte transactionVersion) {
		super(buffer, transactionVersion);
	}

	private AbstractAttachment(JSONObject attachmentData) {
		super(attachmentData);
	}

	private AbstractAttachment(int version) {
		super(version);
	}

	private AbstractAttachment() {}

	final void validate(Transaction transaction) throws NxtException.ValidationException {
		getTransactionType().validateAttachment(transaction);
	}

	final void apply(Transaction transaction, Account senderAccount, Account recipientAccount) {
		getTransactionType().apply(transaction, senderAccount, recipientAccount);
	}

	final void undo(Transaction transaction, Account senderAccount, Account recipientAccount)
			throws TransactionType.UndoNotSupportedException {
		getTransactionType().undo(transaction, senderAccount, recipientAccount);
	}

}
*/