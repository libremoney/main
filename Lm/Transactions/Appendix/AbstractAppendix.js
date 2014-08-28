/**!
 * LibreMoney 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var Appendix = require(__dirname + '/Appendix');


/*
static abstract class AbstractAppendix implements Appendix {
	private final byte version;
}
*/

function AbstractAppendix(version) {
	obj = new Appendix();
	obj.version = version;

	/*
	abstract String getAppendixName();
	*/

	/*
	public final int getSize() {
		return getMySize() + (version > 0 ? 1 : 0);
	}
	*/

	/*
	abstract int getMySize();
	*/

	/*
	public final void putBytes(ByteBuffer buffer) {
		if (version > 0) {
			buffer.put(version);
		}
		putMyBytes(buffer);
	}
	*/

	/*
	abstract void putMyBytes(ByteBuffer buffer);
	*/

	/*
	public final JSONObject getJSONObject() {
		JSONObject json = new JSONObject();
		if (version > 0) {
			json.put("version." + getAppendixName(), version);
		}
		putMyJSON(json);
		return json;
	}
	*/

	/*
	abstract void putMyJSON(JSONObject json);
	*/

	/*
	public final byte getVersion() {
		return version;
	}
	*/

	/*
	boolean verifyVersion(byte transactionVersion) {
		return transactionVersion == 0 ? version == 0 : version > 0;
	}
	*/

	/*
	abstract void validate(Transaction transaction) throws NxtException.ValidationException;

	abstract void apply(Transaction transaction, Account senderAccount, Account recipientAccount);

	abstract void undo(Transaction transaction, Account senderAccount, Account recipientAccount) throws TransactionType.UndoNotSupportedException;
	*/

	return obj;
}

/*
function AbstractAppendix(attachmentData) {
	version = (byte)Convert.nullToZero(((Long) attachmentData.get("version." + getAppendixName())));
}
*/

/*
AbstractAppendix(ByteBuffer buffer, byte transactionVersion) {
	if (transactionVersion == 0) {
		version = 0;
	} else {
		version = buffer.get();
	}
}
*/

/*
AbstractAppendix(int version) {
	this.version = (byte) version;
}
*/

/*
AbstractAppendix() {
	this.version = 1;
}
*/


module.exports = AbstractAppendix;
