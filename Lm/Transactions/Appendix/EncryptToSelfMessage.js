/**!
 * LibreMoney 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var AbstractEncryptedMessage = require(__dirname + '/AbstractEncryptedMessage');


function EncryptToSelfMessage() {
	var obj = new AbstractEncryptedMessage();

	/*
	static EncryptToSelfMessage parse(JSONObject attachmentData) throws NxtException.NotValidException {
		if (attachmentData.get("encryptToSelfMessage") == null ) {
			return null;
		}
		return new EncryptToSelfMessage(attachmentData);
	}

	EncryptToSelfMessage(ByteBuffer buffer, byte transactionVersion) throws NxtException.ValidationException {
		super(buffer, transactionVersion);
	}

	EncryptToSelfMessage(JSONObject attachmentData) throws NxtException.NotValidException {
		super(attachmentData, (JSONObject)attachmentData.get("encryptToSelfMessage"));
	}

	public EncryptToSelfMessage(EncryptedData encryptedData, boolean isText) {
		super(encryptedData, isText);
	}

	String getAppendixName() {
		return "EncryptToSelfMessage";
	}

	void putMyJSON(JSONObject json) {
		JSONObject encryptToSelfMessageJSON = new JSONObject();
		super.putMyJSON(encryptToSelfMessageJSON);
		json.put("encryptToSelfMessage", encryptToSelfMessageJSON);
	}

	void validate(Transaction transaction) throws NxtException.ValidationException {
		super.validate(transaction);
		if (transaction.getVersion() == 0) {
			throw new NxtException.NotValidException("Encrypt-to-self message attachments not enabled for version 0 transactions");
		}
	}
	*/

	return obj;
}


module.exports = EncryptToSelfMessage;
