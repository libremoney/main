/**!
 * LibreMoney 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var Constants = require(__dirname + '/../Constants');
var Messaging = require(__dirname + '/../Messages/MessagingTrType');
var TransactionType = require(__dirname + '/../Transactions/TransactionType');

/*
public final static TransactionType VOTE_CASTING = new Messaging() {

	public final byte getSubtype() {
		return TransactionType.SUBTYPE_MESSAGING_VOTE_CASTING;
	}

	Attachment.MessagingVoteCasting parseAttachment(ByteBuffer buffer, byte transactionVersion) throws NxtException.NotValidException {
		return new Attachment.MessagingVoteCasting(buffer, transactionVersion);
	}

	Attachment.MessagingVoteCasting parseAttachment(JSONObject attachmentData) throws NxtException.NotValidException {
		return new Attachment.MessagingVoteCasting(attachmentData);
	}

	void applyAttachment(Transaction transaction, Account senderAccount, Account recipientAccount) {
		Attachment.MessagingVoteCasting attachment = (Attachment.MessagingVoteCasting) transaction.getAttachment();
		Poll poll = Poll.getPoll(attachment.getPollId());
		if (poll != null) {
			Vote vote = Vote.addVote(transaction.getId(), attachment.getPollId(), transaction.getSenderId(),
					attachment.getPollVote());
			poll.addVoter(transaction.getSenderId(), vote.getId());
		}
	}

	void undoAttachment(Transaction transaction, Account senderAccount, Account recipientAccount) throws UndoNotSupportedException {
		throw new UndoNotSupportedException("Reversal of vote casting not supported");
	}

	void validateAttachment(Transaction transaction) throws NxtException.ValidationException {
		if (Nxt.getBlockchain().getLastBlock().getHeight() < Constants.VOTING_SYSTEM_BLOCK) {
			throw new NxtException.NotYetEnabledException("Voting System not yet enabled at height " + Nxt.getBlockchain().getLastBlock().getHeight());
		}
		Attachment.MessagingVoteCasting attachment = (Attachment.MessagingVoteCasting) transaction.getAttachment();
		if (attachment.getPollId() == null || attachment.getPollVote() == null
				|| attachment.getPollVote().length > Constants.MAX_POLL_OPTION_COUNT) {
			throw new NxtException.NotValidException("Invalid vote casting attachment: " + attachment.getJSONObject());
		}
		if (Poll.getPoll(attachment.getPollId()) == null) {
			throw new NxtException.NotCurrentlyValidException("Invalid poll: " + Convert.toUnsignedLong(attachment.getPollId()));
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
