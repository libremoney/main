/**!
 * LibreMoney 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var AbstractEncryptedMessage = require(__dirname + '/AbstractEncryptedMessage');


function EncryptedMessage() {
	var obj = new AbstractEncryptedMessage();

	/*
	static EncryptedMessage parse(JSONObject attachmentData) throws NxtException.NotValidException {
		if (attachmentData.get("encryptedMessage") == null ) {
			return null;
		}
		return new EncryptedMessage(attachmentData);
	}
	*/

	/*
	EncryptedMessage(ByteBuffer buffer, byte transactionVersion) throws NxtException.ValidationException {
		super(buffer, transactionVersion);
	}
	*/

	/*
	EncryptedMessage(JSONObject attachmentData) throws NxtException.NotValidException {
		super(attachmentData, (JSONObject)attachmentData.get("encryptedMessage"));
	}
	*/

	/*
	public EncryptedMessage(EncryptedData encryptedData, boolean isText) {
		super(encryptedData, isText);
	}
	*/

	/*
	String getAppendixName() {
		return "EncryptedMessage";
	}
	*/

	/*
	void putMyJSON(JSONObject json) {
		JSONObject encryptedMessageJSON = new JSONObject();
		super.putMyJSON(encryptedMessageJSON);
		json.put("encryptedMessage", encryptedMessageJSON);
	}
	*/

	/*
	void validate(Transaction transaction) throws NxtException.ValidationException {
		super.validate(transaction);
		if (! transaction.getType().hasRecipient()) {
			throw new NxtException.NotValidException("Encrypted messages cannot be attached to transactions with no recipient");
		}
		if (transaction.getVersion() == 0) {
			throw new NxtException.NotValidException("Encrypted message attachments not enabled for version 0 transactions");
		}
	}
	*/

	return obj;
}


module.exports = EncryptedMessage;
