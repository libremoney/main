/**!
 * LibreMoney 0.0
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var Constants = require(__dirname + '/../Constants');


function TransactionType_Messaging() {
	/*
	private Messaging() {}

	public final byte getType() {
		return TransactionType.TYPE_MESSAGING;
	}

	final boolean applyAttachmentUnconfirmed(Transaction transaction, Account senderAccount) {
		return true;
	}

	final void undoAttachmentUnconfirmed(Transaction transaction, Account senderAccount) {}

	public final static TransactionType ARBITRARY_MESSAGE = new Messaging() {

		public final byte getSubtype() {
			return TransactionType.SUBTYPE_MESSAGING_ARBITRARY_MESSAGE;
		}

		void LoadAttachment(TransactionImpl transaction, ByteBuffer buffer) throws NxtException.ValidationException {
			int messageLength = buffer.getInt();
			if (messageLength > Constants.MaxArbitraryMessageLength) {
				throw new NxtException.ValidationException("Invalid arbitrary message length: " + messageLength);
			}
			byte[] message = new byte[messageLength];
			buffer.get(message);
			transaction.setAttachment(new Attachment.MessagingArbitraryMessage(message));
		}

		void LoadAttachment(TransactionImpl transaction, JSONObject attachmentData) throws NxtException.ValidationException {
			String message = (String)attachmentData.get("message");
			transaction.setAttachment(new Attachment.MessagingArbitraryMessage(Convert.parseHexString(message)));
		}

		void applyAttachment(Transaction transaction, Account senderAccount, Account recipientAccount) {}

		void undoAttachment(Transaction transaction, Account senderAccount, Account recipientAccount) {}

		void validateAttachment(Transaction transaction) throws NxtException.ValidationException {
			Attachment.MessagingArbitraryMessage attachment = (Attachment.MessagingArbitraryMessage)transaction.getAttachment();
			if (transaction.getAmountNQT() != 0 || attachment.getMessage().length > Constants.MaxArbitraryMessageLength) {
				throw new NxtException.ValidationException("Invalid arbitrary message: " + attachment.getJSONObject());
			}
		}

	};

	public static final TransactionType ALIAS_ASSIGNMENT = new Messaging() {

		public final byte getSubtype() {
			return TransactionType.SUBTYPE_MESSAGING_ALIAS_ASSIGNMENT;
		}

		void LoadAttachment(TransactionImpl transaction, ByteBuffer buffer) throws NxtException.ValidationException {
			int aliasLength = buffer.get();
			if (aliasLength > 3 * Constants.MaxAliasLength) {
				throw new NxtException.ValidationException("Max alias length exceeded");
			}
			byte[] alias = new byte[aliasLength];
			buffer.get(alias);
			int uriLength = buffer.getShort();
			if (uriLength > 3 * Constants.MaxAliasUriLength) {
				throw new NxtException.ValidationException("Max alias URI length exceeded");
			}
			byte[] uri = new byte[uriLength];
			buffer.get(uri);
			try {
				transaction.setAttachment(new Attachment.MessagingAliasAssignment(new String(alias, "UTF-8"),
						new String(uri, "UTF-8")));
			} catch (UnsupportedEncodingException e) {
				throw new NxtException.ValidationException(e.toString());
			}
		}

		void LoadAttachment(TransactionImpl transaction, JSONObject attachmentData) throws NxtException.ValidationException {
			String alias = (String)attachmentData.get("alias");
			String uri = (String)attachmentData.get("uri");
			transaction.setAttachment(new Attachment.MessagingAliasAssignment(alias, uri));
		}

		void applyAttachment(Transaction transaction, Account senderAccount, Account recipientAccount) {
			Attachment.MessagingAliasAssignment attachment = (Attachment.MessagingAliasAssignment)transaction.getAttachment();
			Alias.addOrUpdateAlias(senderAccount, transaction.getId(), attachment.getAliasName(),
					attachment.getAliasURI(), transaction.getBlockTimestamp());
		}

		void undoAttachment(Transaction transaction, Account senderAccount, Account recipientAccount) throws UndoNotSupportedException {
			Attachment.MessagingAliasAssignment attachment = (Attachment.MessagingAliasAssignment) transaction.getAttachment();
			Alias alias = Alias.getAlias(attachment.getAliasName().toLowerCase());
			if (alias.getId().equals(transaction.getId())) {
				Alias.remove(alias);
			} else {
				// alias has been updated, can't tell what was its previous uri
				throw new UndoNotSupportedException("Reversal of alias assignment not supported");
			}
		}

		boolean isDuplicate(Transaction transaction, Map<TransactionType, Set<String>> duplicates) {
			Set<String> myDuplicates = duplicates.get(this);
			if (myDuplicates == null) {
				myDuplicates = new HashSet<>();
				duplicates.put(this, myDuplicates);
			}
			Attachment.MessagingAliasAssignment attachment = (Attachment.MessagingAliasAssignment)transaction.getAttachment();
			return ! myDuplicates.add(attachment.getAliasName().toLowerCase());
		}

		void validateAttachment(Transaction transaction) throws NxtException.ValidationException {
			Attachment.MessagingAliasAssignment attachment = (Attachment.MessagingAliasAssignment)transaction.getAttachment();
			if (! Genesis.CREATOR_ID.equals(transaction.getRecipientId()) || transaction.getAmountNQT() != 0
					|| attachment.getAliasName().length() == 0
					|| attachment.getAliasName().length() > Constants.MaxAliasLength
					|| attachment.getAliasURI().length() > Constants.MaxAliasUriLength) {
				throw new NxtException.ValidationException("Invalid alias assignment: " + attachment.getJSONObject());
			}
			String normalizedAlias = attachment.getAliasName().toLowerCase();
			for (int i = 0; i < normalizedAlias.length(); i++) {
				if (Constants.Alphabet.indexOf(normalizedAlias.charAt(i)) < 0) {
					throw new NxtException.ValidationException("Invalid alias name: " + normalizedAlias);
				}
			}
			Alias alias = Alias.getAlias(normalizedAlias);
			if (alias != null && ! Arrays.equals(alias.getAccount().getPublicKey(), transaction.getSenderPublicKey())) {
				throw new NxtException.ValidationException("Alias already owned by another account: " + normalizedAlias);
			}
		}

	};

	public final static TransactionType POLL_CREATION = new Messaging() {

		public final byte getSubtype() {
			return TransactionType.SUBTYPE_MESSAGING_POLL_CREATION;
		}

		void LoadAttachment(TransactionImpl transaction, ByteBuffer buffer) throws NxtException.ValidationException {
			try {
				int pollNameBytesLength = buffer.getShort();
				if (pollNameBytesLength > 3 * Constants.MaxPollNameLength) {
					throw new NxtException.ValidationException("Invalid poll name length");
				}
				byte[] pollNameBytes = new byte[pollNameBytesLength];
				buffer.get(pollNameBytes);
				String pollName = (new String(pollNameBytes, "UTF-8")).trim();
				int pollDescriptionBytesLength = buffer.getShort();
				if (pollDescriptionBytesLength > 3 * Constants.MaxPollDescriptionLength) {
					throw new NxtException.ValidationException("Invalid poll description length");
				}
				byte[] pollDescriptionBytes = new byte[pollDescriptionBytesLength];
				buffer.get(pollDescriptionBytes);
				String pollDescription = (new String(pollDescriptionBytes, "UTF-8")).trim();
				int numberOfOptions = buffer.get();
				if (numberOfOptions > Constants.MaxPollOptionCount) {
					throw new NxtException.ValidationException("Invalid number of poll options: " + numberOfOptions);
				}
				String[] pollOptions = new String[numberOfOptions];
				for (int i = 0; i < numberOfOptions; i++) {
					int pollOptionBytesLength = buffer.getShort();
					if (pollOptionBytesLength > 3 * Constants.MaxPollOptionLength) {
						throw new NxtException.ValidationException("Error parsing poll options");
					}
					byte[] pollOptionBytes = new byte[pollOptionBytesLength];
					buffer.get(pollOptionBytes);
					pollOptions[i] = (new String(pollOptionBytes, "UTF-8")).trim();
				}
				byte minNumberOfOptions = buffer.get();
				byte maxNumberOfOptions = buffer.get();
				boolean optionsAreBinary = buffer.get() != 0;
				transaction.setAttachment(new Attachment.MessagingPollCreation(pollName, pollDescription, pollOptions,
						minNumberOfOptions, maxNumberOfOptions, optionsAreBinary));
			} catch (UnsupportedEncodingException e) {
				throw new NxtException.ValidationException("Error parsing poll creation parameters", e);
			}
		}

		void LoadAttachment(TransactionImpl transaction, JSONObject attachmentData) throws NxtException.ValidationException {

			String pollName = ((String)attachmentData.get("name")).trim();
			String pollDescription = ((String)attachmentData.get("description")).trim();
			JSONArray options = (JSONArray)attachmentData.get("options");
			String[] pollOptions = new String[options.size()];
			for (int i = 0; i < pollOptions.length; i++) {
				pollOptions[i] = ((String)options.get(i)).trim();
			}
			byte minNumberOfOptions = ((Long)attachmentData.get("minNumberOfOptions")).byteValue();
			byte maxNumberOfOptions = ((Long)attachmentData.get("maxNumberOfOptions")).byteValue();
			boolean optionsAreBinary = (Boolean)attachmentData.get("optionsAreBinary");

			transaction.setAttachment(new Attachment.MessagingPollCreation(pollName, pollDescription, pollOptions,
					minNumberOfOptions, maxNumberOfOptions, optionsAreBinary));
		}

		void applyAttachment(Transaction transaction, Account senderAccount, Account recipientAccount) {
			Attachment.MessagingPollCreation attachment = (Attachment.MessagingPollCreation)transaction.getAttachment();
			Poll.addPoll(transaction.getId(), attachment.getPollName(), attachment.getPollDescription(), attachment.getPollOptions(),
					attachment.getMinNumberOfOptions(), attachment.getMaxNumberOfOptions(), attachment.isOptionsAreBinary());
		}

		void undoAttachment(Transaction transaction, Account senderAccount, Account recipientAccount) throws UndoNotSupportedException {
			throw new UndoNotSupportedException("Reversal of poll creation not supported");
		}

		void validateAttachment(Transaction transaction) throws NxtException.ValidationException {
			Attachment.MessagingPollCreation attachment = (Attachment.MessagingPollCreation)transaction.getAttachment();
			for (int i = 0; i < attachment.getPollOptions().length; i++) {
				if (attachment.getPollOptions()[i].length() > Constants.MaxPollOptionLength) {
					throw new NxtException.ValidationException("Invalid poll options length: " + attachment.getJSONObject());
				}
			}
			if (attachment.getPollName().length() > Constants.MaxPollNameLength
					|| attachment.getPollDescription().length() > Constants.MAX_POLL_DESCRIPTION_LENGTH
					|| attachment.getPollOptions().length > Constants.MaxPollOptionCount
					|| transaction.getAmountNQT() != 0
					|| ! Genesis.CREATOR_ID.equals(transaction.getRecipientId())) {
				throw new NxtException.ValidationException("Invalid poll attachment: " + attachment.getJSONObject());
			}
		}

	};

	public final static TransactionType VOTE_CASTING = new Messaging() {

		public final byte getSubtype() {
			return TransactionType.SUBTYPE_MESSAGING_VOTE_CASTING;
		}

		void LoadAttachment(TransactionImpl transaction, ByteBuffer buffer) throws NxtException.ValidationException {
			Long pollId = buffer.getLong();
			int numberOfOptions = buffer.get();
			if (numberOfOptions > Constants.MaxPollOptionCount) {
				throw new NxtException.ValidationException("Error parsing vote casting parameters");
			}
			byte[] pollVote = new byte[numberOfOptions];
			buffer.get(pollVote);
			transaction.setAttachment(new Attachment.MessagingVoteCasting(pollId, pollVote));
		}

		void LoadAttachment(TransactionImpl transaction, JSONObject attachmentData) throws NxtException.ValidationException {
			Long pollId = (Long)attachmentData.get("pollId");
			JSONArray vote = (JSONArray)attachmentData.get("vote");
			byte[] pollVote = new byte[vote.size()];
			for (int i = 0; i < pollVote.length; i++) {
				pollVote[i] = ((Long)vote.get(i)).byteValue();
			}
			transaction.setAttachment(new Attachment.MessagingVoteCasting(pollId, pollVote));
		}

		void applyAttachment(Transaction transaction, Account senderAccount, Account recipientAccount) {
			Attachment.MessagingVoteCasting attachment = (Attachment.MessagingVoteCasting)transaction.getAttachment();
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
			Attachment.MessagingVoteCasting attachment = (Attachment.MessagingVoteCasting)transaction.getAttachment();
			if (attachment.getPollId() == null || attachment.getPollVote() == null
					|| attachment.getPollVote().length > Constants.MaxPollOptionCount) {
				throw new NxtException.ValidationException("Invalid vote casting attachment: " + attachment.getJSONObject());
			}
			if (Poll.getPoll(attachment.getPollId()) == null) {
				throw new NxtException.ValidationException("Invalid poll: " + Convert.toUnsignedLong(attachment.getPollId()));
			}
			if (transaction.getAmountNQT() != 0 || ! Genesis.CREATOR_ID.equals(transaction.getRecipientId())) {
				throw new NxtException.ValidationException("Invalid vote casting amount or recipient");
			}
		}

	};

	public static final TransactionType HUB_ANNOUNCEMENT = new Messaging() {

		public final byte getSubtype() { return TransactionType.SUBTYPE_MESSAGING_HUB_ANNOUNCEMENT; }

		void LoadAttachment(TransactionImpl transaction, ByteBuffer buffer) throws NxtException.ValidationException {
			try {
				long minFeePerByte = buffer.getLong();
				int numberOfUris = buffer.get();
				if (numberOfUris > Constants.MaxHubAnnouncementUris) {
					throw new NxtException.ValidationException("Invalid number of URIs: " + numberOfUris);
				}
				String[] uris = new String[numberOfUris];
				for (int i = 0; i < uris.length; i++) {
					int uriBytesLength = buffer.getShort();
					if (uriBytesLength > 3 * Constants.MaxHubAnnouncementUriLength) {
						throw new NxtException.ValidationException("Invalid URI length: " + uriBytesLength);
					}
					byte[] uriBytes = new byte[uriBytesLength];
					buffer.get(uriBytes);
					uris[i] = new String(uriBytes, "UTF-8");
				}
				transaction.setAttachment(new Attachment.MessagingHubAnnouncement(minFeePerByte, uris));
			} catch (UnsupportedEncodingException e) {
				throw new NxtException.ValidationException("Error parsing hub terminal announcement parameters", e);
			}
		}

		void LoadAttachment(TransactionImpl transaction, JSONObject attachmentData) throws NxtException.ValidationException {
			long minFeePerByte = (Long)attachmentData.get("minFeePerByte");
			String[] uris;
			try {
				JSONArray urisData = (JSONArray)attachmentData.get("uris");
				uris = new String[urisData.size()];
				for (int i = 0; i < uris.length; i++) {
					uris[i] = (String)urisData.get(i);
				}
			} catch (RuntimeException e) {
				throw new NxtException.ValidationException("Error parsing hub terminal announcement parameters", e);
			}

			transaction.setAttachment(new Attachment.MessagingHubAnnouncement(minFeePerByte, uris));
		}

		void applyAttachment(Transaction transaction, Account senderAccount, Account recipientAccount) {
			Attachment.MessagingHubAnnouncement attachment = (Attachment.MessagingHubAnnouncement)transaction.getAttachment();
			Hub.addOrUpdateHub(senderAccount.getId(), attachment.getMinFeePerByteNQT(), attachment.getUris());
		}

		void undoAttachment(Transaction transaction, Account senderAccount, Account recipientAccount) throws UndoNotSupportedException {
			Hub.removeHub(senderAccount.getId());
		}

		void validateAttachment(Transaction transaction) throws NxtException.ValidationException {
			Attachment.MessagingHubAnnouncement attachment = (Attachment.MessagingHubAnnouncement)transaction.getAttachment();
			if (!Genesis.CREATOR_ID.equals(transaction.getRecipientId())
					|| transaction.getAmountNQT() != 0
					|| attachment.getMinFeePerByteNQT() < 0 || attachment.getMinFeePerByteNQT() > Constants.MaxBalanceMilliLm
					|| attachment.getUris().length > Constants.MaxHubAnnouncementUris) {
				// cfb: "0" is allowed to show that another way to determine the min fee should be used
				throw new NxtException.ValidationException("Invalid hub terminal announcement: " + attachment.getJSONObject());
			}
			for (String uri : attachment.getUris()) {
				if (uri.length() > Constants.MaxHubAnnouncementUriLength) {
					throw new NxtException.ValidationException("Invalid URI length: " + uri.length());
				}
				//TODO: also check URI validity here?
			}
		}

	};

	public static final Messaging ACCOUNT_INFO = new Messaging() {

		public byte getSubtype() {
			return TransactionType.SUBTYPE_MESSAGING_ACCOUNT_INFO;
		}

		void LoadAttachment(TransactionImpl transaction, ByteBuffer buffer) throws NxtException.ValidationException {
			int nameLength = buffer.get();
			if (nameLength > 3 * Constants.MaxAccountNameLength) {
				throw new NxtException.ValidationException("Max account info name length exceeded");
			}
			byte[] name = new byte[nameLength];
			buffer.get(name);
			int descriptionLength = buffer.getShort();
			if (descriptionLength > 3 * Constants.MaxAccountDescriptionLength) {
				throw new NxtException.ValidationException("Max account info description length exceeded");
			}
			byte[] description = new byte[descriptionLength];
			buffer.get(description);
			try {
				transaction.setAttachment(new Attachment.MessagingAccountInfo(new String(name, "UTF-8").intern(),
						new String(description, "UTF-8").intern()));
			} catch (UnsupportedEncodingException e) {
				throw new NxtException.ValidationException("Error in asset issuance", e);
			}
		}

		void LoadAttachment(TransactionImpl transaction, JSONObject attachmentData) throws NxtException.ValidationException {
			String name = (String)attachmentData.get("name");
			String description = (String)attachmentData.get("description");
			transaction.setAttachment(new Attachment.MessagingAccountInfo(name.trim(), description.trim()));
		}

		void validateAttachment(Transaction transaction) throws NxtException.ValidationException {
			Attachment.MessagingAccountInfo attachment = (Attachment.MessagingAccountInfo)transaction.getAttachment();
			if (! Genesis.CREATOR_ID.equals(transaction.getRecipientId()) || transaction.getAmountNQT() != 0
					|| attachment.getName().length() > Constants.MaxAccountNameLength
					|| attachment.getDescription().length() > Constants.MaxAccountDescriptionLength
					) {
				throw new NxtException.ValidationException("Invalid account info issuance: " + attachment.getJSONObject());
			}
		}

		void applyAttachment(Transaction transaction, Account senderAccount, Account recipientAccount) {
			Attachment.MessagingAccountInfo attachment = (Attachment.MessagingAccountInfo)transaction.getAttachment();
			senderAccount.setAccountInfo(attachment.getName(), attachment.getDescription());
		}

		void undoAttachment(Transaction transaction, Account senderAccount, Account recipientAccount) throws UndoNotSupportedException {
			throw new UndoNotSupportedException("Undoing account info not supported");
		}

	};

	*/
}

function Init() {
	// xxxx
}


exports.Init = Init;
