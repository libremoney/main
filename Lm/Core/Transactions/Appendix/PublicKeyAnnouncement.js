/**!
 * LibreMoney PublicKeyAnnouncement 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

if (typeof module !== "undefined") {
	var AbstractAppendix = require(__dirname + '/AbstractAppendix');
}


function PublicKeyAnnouncement() {
	var obj = AbstractAppendix();

	/*
	static PublicKeyAnnouncement parse(JSONObject attachmentData) throws NxtException.NotValidException {
		if (attachmentData.get("recipientPublicKey") == null) {
			return null;
		}
		return new PublicKeyAnnouncement(attachmentData);
	}

	private final byte[] publicKey;

	PublicKeyAnnouncement(ByteBuffer buffer, byte transactionVersion) {
		super(buffer, transactionVersion);
		this.publicKey = new byte[32];
		buffer.get(this.publicKey);
	}

	PublicKeyAnnouncement(JSONObject attachmentData) throws NxtException.NotValidException {
		super(attachmentData);
		this.publicKey = Convert.parseHexString((String)attachmentData.get("recipientPublicKey"));
	}

	public PublicKeyAnnouncement(byte[] publicKey) {
		this.publicKey = publicKey;
	}

	String getAppendixName() {
		return "PublicKeyAnnouncement";
	}

	int getMySize() {
		return 32;
	}

	void putMyBytes(ByteBuffer buffer) {
		buffer.put(publicKey);
	}

	void putMyJSON(JSONObject json) {
		json.put("recipientPublicKey", Convert.toHexString(publicKey));
	}

	void validate(Transaction transaction) throws NxtException.ValidationException {
		if (! transaction.getType().hasRecipient()) {
			throw new NxtException.NotValidException("PublicKeyAnnouncement cannot be attached to transactions with no recipient");
		}
		if (publicKey.length != 32) {
			throw new NxtException.NotValidException("Invalid recipient public key length: " + Convert.toHexString(publicKey));
		}
		Long recipientId = transaction.getRecipientId();
		if (! Account.getId(this.publicKey).equals(recipientId)) {
			throw new NxtException.NotValidException("Announced public key does not match recipient accountId");
		}
		if (transaction.getVersion() == 0) {
			throw new NxtException.NotValidException("Public key announcements not enabled for version 0 transactions");
		}
		Account recipientAccount = Account.getAccount(recipientId);
		if (recipientAccount != null && recipientAccount.getPublicKey() != null && ! Arrays.equals(publicKey, recipientAccount.getPublicKey())) {
			throw new NxtException.NotCurrentlyValidException("A different public key for this account has already been announced");
		}
	}

	void apply(Transaction transaction, Account senderAccount, Account recipientAccount) {
		if (recipientAccount.setOrVerify(publicKey, transaction.getHeight())) {
			recipientAccount.apply(this.publicKey, transaction.getHeight());
		}
	}

	void undo(Transaction transaction, Account senderAccount, Account recipientAccount) {
		recipientAccount.undo(transaction.getHeight());
	}

	public byte[] getPublicKey() {
		return publicKey;
	}
	*/

	return obj;
}


if (typeof module !== "undefined") {
	module.exports = PublicKeyAnnouncement;
}
