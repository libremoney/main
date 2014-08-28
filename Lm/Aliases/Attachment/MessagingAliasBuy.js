/**!
 * LibreMoney 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

/*
public final static class MessagingAliasBuy extends AbstractAttachment {

	private final String aliasName;

	MessagingAliasBuy(ByteBuffer buffer, byte transactionVersion) throws NxtException.NotValidException {
		super(buffer, transactionVersion);
		this.aliasName = Convert.readString(buffer, buffer.get(), Constants.MAX_ALIAS_LENGTH);
	}

	MessagingAliasBuy(JSONObject attachmentData) {
		super(attachmentData);
		this.aliasName = Convert.nullToEmpty((String) attachmentData.get("alias"));
	}

	public MessagingAliasBuy(String aliasName) {
		this.aliasName = aliasName;
	}

	String getAppendixName() {
		return "AliasBuy";
	}

	public TransactionType getTransactionType() {
		return TransactionType.Messaging.ALIAS_BUY;
	}

	int getMySize() {
		return 1 + Convert.toBytes(aliasName).length;
	}

	void putMyBytes(ByteBuffer buffer) {
		byte[] aliasBytes = Convert.toBytes(aliasName);
		buffer.put((byte)aliasBytes.length);
		buffer.put(aliasBytes);
	}

	void putMyJSON(JSONObject attachment) {
		attachment.put("alias", aliasName);
	}

	public String getAliasName(){
		return aliasName;
	}
}
*/
