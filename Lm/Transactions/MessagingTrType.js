/**!
 * LibreMoney 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var Constants = require(__dirname + '/../Constants');


function TransactionType_Messaging() {
	/*
	private Messaging() {
	}

	public final byte getType() {
		return TransactionType.TYPE_MESSAGING;
	}

	final boolean applyAttachmentUnconfirmed(Transaction transaction, Account senderAccount) {
		return true;
	}

	final void undoAttachmentUnconfirmed(Transaction transaction, Account senderAccount) {
	}

	public final static TransactionType ARBITRARY_MESSAGE = new Messaging() {

		public final byte getSubtype() {
			return TransactionType.SUBTYPE_MESSAGING_ARBITRARY_MESSAGE;
		}

		Attachment.EmptyAttachment parseAttachment(ByteBuffer buffer, byte transactionVersion) throws NxtException.NotValidException {
			return Attachment.ARBITRARY_MESSAGE;
		}

		Attachment.EmptyAttachment parseAttachment(JSONObject attachmentData) throws NxtException.NotValidException {
			return Attachment.ARBITRARY_MESSAGE;
		}

		void applyAttachment(Transaction transaction, Account senderAccount, Account recipientAccount) {
		}

		void undoAttachment(Transaction transaction, Account senderAccount, Account recipientAccount) {
		}

		void validateAttachment(Transaction transaction) throws NxtException.ValidationException {
			Attachment attachment = transaction.getAttachment();
			if (transaction.getAmountNQT() != 0) {
				throw new NxtException.NotValidException("Invalid arbitrary message: " + attachment.getJSONObject());
			}
		}

		public boolean hasRecipient() {
			return true;
		}

	};

	public static final TransactionType ALIAS_ASSIGNMENT = new Messaging() {

		public final byte getSubtype() {
			return TransactionType.SUBTYPE_MESSAGING_ALIAS_ASSIGNMENT;
		}

		Attachment.MessagingAliasAssignment parseAttachment(ByteBuffer buffer, byte transactionVersion) throws NxtException.NotValidException {
			return new Attachment.MessagingAliasAssignment(buffer, transactionVersion);
		}

		Attachment.MessagingAliasAssignment parseAttachment(JSONObject attachmentData) throws NxtException.NotValidException {
			return new Attachment.MessagingAliasAssignment(attachmentData);
		}

		void applyAttachment(Transaction transaction, Account senderAccount, Account recipientAccount) {
			Attachment.MessagingAliasAssignment attachment = (Attachment.MessagingAliasAssignment) transaction.getAttachment();
			Alias.addOrUpdateAlias(senderAccount, transaction.getId(), attachment.getAliasName(),
					attachment.getAliasURI(), transaction.getBlockTimestamp());
		}

		void undoAttachment(Transaction transaction, Account senderAccount, Account recipientAccount) throws UndoNotSupportedException {
			Attachment.MessagingAliasAssignment attachment = (Attachment.MessagingAliasAssignment) transaction.getAttachment();
			Alias alias = Alias.getAlias(attachment.getAliasName());
			if (alias.getId().equals(transaction.getId())) {
				Alias.remove(alias);
			} else {
				// alias has been updated, can't tell what was its previous uri
				throw new UndoNotSupportedException("Reversal of alias assignment not supported");
			}
		}

		boolean isDuplicate(Transaction transaction, Map<TransactionType, Set<String>> duplicates) {
			Attachment.MessagingAliasAssignment attachment = (Attachment.MessagingAliasAssignment) transaction.getAttachment();
			return isDuplicate(Messaging.ALIAS_ASSIGNMENT, attachment.getAliasName().toLowerCase(), duplicates);
		}

		void validateAttachment(Transaction transaction) throws NxtException.ValidationException {
			Attachment.MessagingAliasAssignment attachment = (Attachment.MessagingAliasAssignment) transaction.getAttachment();
			if (attachment.getAliasName().length() == 0
					|| attachment.getAliasName().length() > Constants.MAX_ALIAS_LENGTH
					|| attachment.getAliasURI().length() > Constants.MAX_ALIAS_URI_LENGTH) {
				throw new NxtException.NotValidException("Invalid alias assignment: " + attachment.getJSONObject());
			}
			String normalizedAlias = attachment.getAliasName().toLowerCase();
			for (int i = 0; i < normalizedAlias.length(); i++) {
				if (Constants.ALPHABET.indexOf(normalizedAlias.charAt(i)) < 0) {
					throw new NxtException.NotValidException("Invalid alias name: " + normalizedAlias);
				}
			}
			Alias alias = Alias.getAlias(normalizedAlias);
			if (alias != null && ! alias.getAccountId().equals(transaction.getSenderId())) {
				throw new NxtException.NotCurrentlyValidException("Alias already owned by another account: " + normalizedAlias);
			}
		}

		public boolean hasRecipient() {
			return false;
		}

	};

	public static final TransactionType ALIAS_SELL = new Messaging() {

		public final byte getSubtype() {
			return TransactionType.SUBTYPE_MESSAGING_ALIAS_SELL;
		}

		Attachment.MessagingAliasSell parseAttachment(ByteBuffer buffer, byte transactionVersion) throws NxtException.NotValidException {
			return new Attachment.MessagingAliasSell(buffer, transactionVersion);
		}

		Attachment.MessagingAliasSell parseAttachment(JSONObject attachmentData) throws NxtException.NotValidException {
			return new Attachment.MessagingAliasSell(attachmentData);
		}

		void applyAttachment(Transaction transaction, Account senderAccount, Account recipientAccount) {
			final Attachment.MessagingAliasSell attachment =
					(Attachment.MessagingAliasSell) transaction.getAttachment();
			final String aliasName = attachment.getAliasName();
			final long priceNQT = attachment.getPriceNQT();
			if (priceNQT > 0) {
				Alias.addSellOffer(aliasName, priceNQT, recipientAccount);
			} else {
				Alias.changeOwner(recipientAccount, aliasName, transaction.getBlockTimestamp());
			}
		}

		void undoAttachment(Transaction transaction, Account senderAccount, Account recipientAccount) throws UndoNotSupportedException {
			throw new UndoNotSupportedException("Reversal of alias sell offer not supported");
		}

		boolean isDuplicate(Transaction transaction, Map<TransactionType, Set<String>> duplicates) {
			Attachment.MessagingAliasSell attachment = (Attachment.MessagingAliasSell) transaction.getAttachment();
			// not a bug, uniqueness is based on Messaging.ALIAS_ASSIGNMENT
			return isDuplicate(Messaging.ALIAS_ASSIGNMENT, attachment.getAliasName().toLowerCase(), duplicates);
		}

		void validateAttachment(Transaction transaction) throws NxtException.ValidationException {
			if (transaction.getAmountNQT() != 0) {
				throw new NxtException.NotValidException("Invalid sell alias transaction: " +
						transaction.getJSONObject());
			}
			final Attachment.MessagingAliasSell attachment =
					(Attachment.MessagingAliasSell) transaction.getAttachment();
			final String aliasName = attachment.getAliasName();
			if (aliasName == null || aliasName.length() == 0) {
				throw new NxtException.NotValidException("Missing alias name");
			}
			long priceNQT = attachment.getPriceNQT();
			if (priceNQT < 0 || priceNQT > Constants.MAX_BALANCE_NQT) {
				throw new NxtException.NotValidException("Invalid alias sell price: " + priceNQT);
			}
			if (priceNQT == 0) {
				if (Genesis.CREATOR_ID.equals(transaction.getRecipientId())) {
					throw new NxtException.NotValidException("Transferring aliases to Genesis account not allowed");
				} else if (transaction.getRecipientId() == null) {
					throw new NxtException.NotValidException("Missing alias transfer recipient");
				}
			}
			final Alias alias = Alias.getAlias(aliasName);
			if (alias == null) {
				throw new NxtException.NotCurrentlyValidException("Alias hasn't been registered yet: " + aliasName);
			} else if (! alias.getAccountId().equals(transaction.getSenderId())) {
				throw new NxtException.NotCurrentlyValidException("Alias doesn't belong to sender: " + aliasName);
			}
		}

		public boolean hasRecipient() {
			return true;
		}

	};

	public static final TransactionType ALIAS_BUY = new Messaging() {

		public final byte getSubtype() {
			return TransactionType.SUBTYPE_MESSAGING_ALIAS_BUY;
		}

		Attachment.MessagingAliasBuy parseAttachment(ByteBuffer buffer, byte transactionVersion) throws NxtException.NotValidException {
			return new Attachment.MessagingAliasBuy(buffer, transactionVersion);
		}

		Attachment.MessagingAliasBuy parseAttachment(JSONObject attachmentData) throws NxtException.NotValidException {
			return new Attachment.MessagingAliasBuy(attachmentData);
		}

		void applyAttachment(Transaction transaction, Account senderAccount, Account recipientAccount) {
			final Attachment.MessagingAliasBuy attachment =
					(Attachment.MessagingAliasBuy) transaction.getAttachment();
			final String aliasName = attachment.getAliasName();
			Alias.changeOwner(senderAccount, aliasName, transaction.getBlockTimestamp());
		}

		void undoAttachment(Transaction transaction, Account senderAccount, Account recipientAccount) throws UndoNotSupportedException {
			throw new UndoNotSupportedException("Reversal of alias buy not supported");
		}

		boolean isDuplicate(Transaction transaction, Map<TransactionType, Set<String>> duplicates) {
			Attachment.MessagingAliasBuy attachment = (Attachment.MessagingAliasBuy) transaction.getAttachment();
			// not a bug, uniqueness is based on Messaging.ALIAS_ASSIGNMENT
			return isDuplicate(Messaging.ALIAS_ASSIGNMENT, attachment.getAliasName().toLowerCase(), duplicates);
		}

		void validateAttachment(Transaction transaction) throws NxtException.ValidationException {
			final Attachment.MessagingAliasBuy attachment =
					(Attachment.MessagingAliasBuy) transaction.getAttachment();
			final String aliasName = attachment.getAliasName();
			final Alias alias = Alias.getAlias(aliasName);
			if (alias == null) {
				throw new NxtException.NotCurrentlyValidException("Alias hasn't been registered yet: " + aliasName);
			} else if (! alias.getAccountId().equals(transaction.getRecipientId())) {
				throw new NxtException.NotCurrentlyValidException("Alias is owned by account other than recipient: "
						+ Convert.toUnsignedLong(alias.getAccountId()));
			}
			Alias.Offer offer = Alias.getOffer(aliasName);
			if (offer == null) {
				throw new NxtException.NotCurrentlyValidException("Alias is not for sale: " + aliasName);
			}
			if (transaction.getAmountNQT() < offer.getPriceNQT()) {
				String msg = "Price is too low for: " + aliasName + " ("
						+ transaction.getAmountNQT() + " < " + offer.getPriceNQT() + ")";
				throw new NxtException.NotCurrentlyValidException(msg);
			}
			if (offer.getBuyerId() != null && ! offer.getBuyerId().equals(transaction.getSenderId())) {
				throw new NxtException.NotCurrentlyValidException("Wrong buyer for " + aliasName + ": "
						+ Convert.toUnsignedLong(transaction.getSenderId()) + " expected: "
						+ Convert.toUnsignedLong(offer.getBuyerId()));
			}
		}

		public boolean hasRecipient() {
			return true;
		}

	};

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

	public static final TransactionType HUB_ANNOUNCEMENT = new Messaging() {

		public final byte getSubtype() {
			return TransactionType.SUBTYPE_MESSAGING_HUB_ANNOUNCEMENT;
		}

		Attachment.MessagingHubAnnouncement parseAttachment(ByteBuffer buffer, byte transactionVersion) throws NxtException.NotValidException {
			return new Attachment.MessagingHubAnnouncement(buffer, transactionVersion);
		}

		Attachment.MessagingHubAnnouncement parseAttachment(JSONObject attachmentData) throws NxtException.NotValidException {
			return new Attachment.MessagingHubAnnouncement(attachmentData);
		}

		void applyAttachment(Transaction transaction, Account senderAccount, Account recipientAccount) {
			Attachment.MessagingHubAnnouncement attachment = (Attachment.MessagingHubAnnouncement) transaction.getAttachment();
			Hub.addOrUpdateHub(senderAccount.getId(), attachment.getMinFeePerByteNQT(), attachment.getUris());
		}

		void undoAttachment(Transaction transaction, Account senderAccount, Account recipientAccount) throws UndoNotSupportedException {
			Hub.removeHub(senderAccount.getId());
		}

		void validateAttachment(Transaction transaction) throws NxtException.ValidationException {
			if (Nxt.getBlockchain().getLastBlock().getHeight() < Constants.TRANSPARENT_FORGING_BLOCK_7) {
				throw new NxtException.NotYetEnabledException("Hub terminal announcement not yet enabled at height " + Nxt.getBlockchain().getLastBlock().getHeight());
			}
			Attachment.MessagingHubAnnouncement attachment = (Attachment.MessagingHubAnnouncement) transaction.getAttachment();
			if (attachment.getMinFeePerByteNQT() < 0 || attachment.getMinFeePerByteNQT() > Constants.MAX_BALANCE_NQT
					|| attachment.getUris().length > Constants.MAX_HUB_ANNOUNCEMENT_URIS) {
				// cfb: "0" is allowed to show that another way to determine the min fee should be used
				throw new NxtException.NotValidException("Invalid hub terminal announcement: " + attachment.getJSONObject());
			}
			for (String uri : attachment.getUris()) {
				if (uri.length() > Constants.MAX_HUB_ANNOUNCEMENT_URI_LENGTH) {
					throw new NxtException.NotValidException("Invalid URI length: " + uri.length());
				}
				//TODO: also check URI validity here?
			}
		}

		public boolean hasRecipient() {
			return false;
		}

	};

	public static final Messaging ACCOUNT_INFO = new Messaging() {

		public byte getSubtype() {
			return TransactionType.SUBTYPE_MESSAGING_ACCOUNT_INFO;
		}

		Attachment.MessagingAccountInfo parseAttachment(ByteBuffer buffer, byte transactionVersion) throws NxtException.NotValidException {
			return new Attachment.MessagingAccountInfo(buffer, transactionVersion);
		}

		Attachment.MessagingAccountInfo parseAttachment(JSONObject attachmentData) throws NxtException.NotValidException {
			return new Attachment.MessagingAccountInfo(attachmentData);
		}

		void validateAttachment(Transaction transaction) throws NxtException.ValidationException {
			Attachment.MessagingAccountInfo attachment = (Attachment.MessagingAccountInfo)transaction.getAttachment();
			if (attachment.getName().length() > Constants.MAX_ACCOUNT_NAME_LENGTH
					|| attachment.getDescription().length() > Constants.MAX_ACCOUNT_DESCRIPTION_LENGTH
					) {
				throw new NxtException.NotValidException("Invalid account info issuance: " + attachment.getJSONObject());
			}
		}

		void applyAttachment(Transaction transaction, Account senderAccount, Account recipientAccount) {
			Attachment.MessagingAccountInfo attachment = (Attachment.MessagingAccountInfo) transaction.getAttachment();
			senderAccount.setAccountInfo(attachment.getName(), attachment.getDescription());
		}

		void undoAttachment(Transaction transaction, Account senderAccount, Account recipientAccount) throws UndoNotSupportedException {
			throw new UndoNotSupportedException("Undoing account info not supported");
		}

		public boolean hasRecipient() {
			return false;
		}

	};

	*/
}

function Init() {
	// xxxx
}


exports.Init = Init;
