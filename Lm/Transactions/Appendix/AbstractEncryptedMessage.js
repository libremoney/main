/**!
 * LibreMoney 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var AbstractAppendix = require(__dirname + '/AbstractAppendix');
var Constants = require(__dirname + '/../../Constants');


function AbstractEncryptedMessage(data) {

	if (typeof data.buffer != 'undefined' && data.transactionVersion != 'undefind') {
		this.prototype = new AbstractAppendix({
			buffer: data.buffer,
			transactionVersion: data.transactionVersion
		});
		var length = buffer.GetInt();
		this.isText = length < 0;
		if (length < 0) {
			length &= Constants.MaxInt;
		}
		this.encryptedData = EncryptedData.ReadEncryptedData(buffer, length, Constants.MaxEncryptedMessageLength);
	} else if (typeof data.attachmentJson != 'undefined' && typeof data.encryptedMessageJson != 'undefined') {
		throw new Error('Not implementted AbstractEncryptedMessage');
		/*
		super(attachmentJSON);
		byte[] data = Convert.parseHexString((String)encryptedMessageJSON.get("data"));
		byte[] nonce = Convert.parseHexString((String)encryptedMessageJSON.get("nonce"));
		this.encryptedData = new EncryptedData(data, nonce);
		this.isText = Boolean.TRUE.equals(encryptedMessageJSON.get("isText"));
		*/
	} else if (typeof data.encryptedData != 'undefined' && typeof data.isText != 'undefined') {
		throw new Error('Not implementted AbstractEncryptedMessage');
		/*
		this.encryptedData = encryptedData;
		this.isText = isText;
		*/
	} else
		throw new Error('Unknown params AbstractEncryptedMessage');


	/*
	private final EncryptedData encryptedData;
	private final boolean isText;
	*/


	/*
	int getMySize() {
		return 4 + encryptedData.getSize();
	}
	*/

	/*
	void putMyBytes(ByteBuffer buffer) {
		buffer.putInt(isText ? (encryptedData.getData().length | Integer.MIN_VALUE) : encryptedData.getData().length);
		buffer.put(encryptedData.getData());
		buffer.put(encryptedData.getNonce());
	}
	*/

	/*
	void putMyJSON(JSONObject json) {
		json.put("data", Convert.toHexString(encryptedData.getData()));
		json.put("nonce", Convert.toHexString(encryptedData.getNonce()));
		json.put("isText", isText);
	}
	*/

	/*
	void validate(Transaction transaction) throws NxtException.ValidationException {
		if (encryptedData.getData().length > Constants.MAX_ENCRYPTED_MESSAGE_LENGTH) {
			throw new NxtException.NotValidException("Max encrypted message length exceeded");
		}
		if ((encryptedData.getNonce().length != 32 && encryptedData.getData().length > 0)
				|| (encryptedData.getNonce().length != 0 && encryptedData.getData().length == 0)) {
			throw new NxtException.NotValidException("Invalid nonce length " + encryptedData.getNonce().length);
		}
	}
	*/

	/*
	void apply(Transaction transaction, Account senderAccount, Account recipientAccount) {}
	*/

	/*
	void undo(Transaction transaction, Account senderAccount, Account recipientAccount) {}
	*/

	/*
	public final EncryptedData getEncryptedData() {
		return encryptedData;
	}
	*/

	/*
	public final boolean isText() {
		return isText;
	}
	*/


	return obj;
}
