/**!
 * LibreMoney 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var Constants = require(__dirname + '/../Constants');

var Messaging = require(__dirname + '/../Messages/MessagingTrType');
var TransactionType = require(__dirname + '/../Transactions/TransactionType');


/*
public final static TransactionType POLL_CREATION = new Messaging() {
	public final byte getSubtype() {
		return TransactionType.SUBTYPE_MESSAGING_POLL_CREATION;
	}

	Attachment.MessagingPollCreation parseAttachment(ByteBuffer buffer, byte transactionVersion) throws NxtException.NotValidException {
		return new Attachment.MessagingPollCreation(buffer, transactionVersion);
	}

	Attachment.MessagingPollCreation parseAttachment(JSONObject attachmentData) throws NxtException.NotValidException {
		return new Attachment.MessagingPollCreation(attachmentData);
	}

	void applyAttachment(Transaction transaction, Account senderAccount, Account recipientAccount) {
		Attachment.MessagingPollCreation attachment = (Attachment.MessagingPollCreation) transaction.getAttachment();
		Poll.addPoll(transaction.getId(), attachment.getPollName(), attachment.getPollDescription(), attachment.getPollOptions(),
				attachment.getMinNumberOfOptions(), attachment.getMaxNumberOfOptions(), attachment.isOptionsAreBinary());
	}

	void undoAttachment(Transaction transaction, Account senderAccount, Account recipientAccount) throws UndoNotSupportedException {
		throw new UndoNotSupportedException("Reversal of poll creation not supported");
	}

	void validateAttachment(Transaction transaction) throws NxtException.ValidationException {
		if (Nxt.getBlockchain().getLastBlock().getHeight() < Constants.VOTING_SYSTEM_BLOCK) {
			throw new NxtException.NotYetEnabledException("Voting System not yet enabled at height " + Nxt.getBlockchain().getLastBlock().getHeight());
		}
		Attachment.MessagingPollCreation attachment = (Attachment.MessagingPollCreation) transaction.getAttachment();
		for (int i = 0; i < attachment.getPollOptions().length; i++) {
			if (attachment.getPollOptions()[i].length() > Constants.MAX_POLL_OPTION_LENGTH) {
				throw new NxtException.NotValidException("Invalid poll options length: " + attachment.getJSONObject());
			}
		}
		if (attachment.getPollName().length() > Constants.MAX_POLL_NAME_LENGTH
				|| attachment.getPollDescription().length() > Constants.MAX_POLL_DESCRIPTION_LENGTH
				|| attachment.getPollOptions().length > Constants.MAX_POLL_OPTION_COUNT) {
			throw new NxtException.NotValidException("Invalid poll attachment: " + attachment.getJSONObject());
		}
	}

	public boolean hasRecipient() {
		return false;
	}
};
*/

function Init() {
	// xxxx
}


exports.Init = Init;
