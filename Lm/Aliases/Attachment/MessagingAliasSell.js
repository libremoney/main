/**!
 * LibreMoney 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */


/*
public final static class MessagingAliasSell extends AbstractAttachment {

	private final String aliasName;
	private final long priceNQT;

	MessagingAliasSell(ByteBuffer buffer, byte transactionVersion) throws NxtException.NotValidException {
		super(buffer, transactionVersion);
		this.aliasName = Convert.readString(buffer, buffer.get(), Constants.MAX_ALIAS_LENGTH);
		this.priceNQT = buffer.getLong();
	}

	MessagingAliasSell(JSONObject attachmentData) {
		super(attachmentData);
		this.aliasName = Convert.nullToEmpty((String) attachmentData.get("alias"));
		this.priceNQT = Convert.parseLong(attachmentData.get("priceNQT"));
	}

	public MessagingAliasSell(String aliasName, long priceNQT) {
		this.aliasName = aliasName;
		this.priceNQT = priceNQT;
	}

	@Override
	String getAppendixName() {
		return "AliasSell";
	}

	@Override
	public TransactionType getTransactionType() {
		return TransactionType.Messaging.ALIAS_SELL;
	}

	@Override
	int getMySize() {
		return 1 + Convert.toBytes(aliasName).length + 8;
	}

	@Override
	void putMyBytes(ByteBuffer buffer) {
		byte[] aliasBytes = Convert.toBytes(aliasName);
		buffer.put((byte)aliasBytes.length);
		buffer.put(aliasBytes);
		buffer.putLong(priceNQT);
	}

	@Override
	void putMyJSON(JSONObject attachment) {
		attachment.put("alias", aliasName);
		attachment.put("priceNQT", priceNQT);
	}

	public String getAliasName(){
		return aliasName;
	}

	public long getPriceNQT(){
		return priceNQT;
	}
}
*/
