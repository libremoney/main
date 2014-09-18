/**!
 * LibreMoney 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */


/*
public final static class MessagingAliasAssignment extends AbstractAttachment {

	private final String aliasName;
	private final String aliasURI;

	MessagingAliasAssignment(ByteBuffer buffer, byte transactionVersion) throws NxtException.NotValidException {
		super(buffer, transactionVersion);
		aliasName = Convert.readString(buffer, buffer.get(), Constants.MAX_ALIAS_LENGTH).trim().intern();
		aliasURI = Convert.readString(buffer, buffer.getShort(), Constants.MAX_ALIAS_URI_LENGTH).trim().intern();
	}

	MessagingAliasAssignment(JSONObject attachmentData) {
		super(attachmentData);
		aliasName = (Convert.nullToEmpty((String) attachmentData.get("alias"))).trim().intern();
		aliasURI = (Convert.nullToEmpty((String) attachmentData.get("uri"))).trim().intern();
	}

	public MessagingAliasAssignment(String aliasName, String aliasURI) {
		this.aliasName = aliasName.trim().intern();
		this.aliasURI = aliasURI.trim().intern();
	}

	String getAppendixName() {
		return "AliasAssignment";
	}

	int getMySize() {
		return 1 + Convert.toBytes(aliasName).length + 2 + Convert.toBytes(aliasURI).length;
	}

	void putMyBytes(ByteBuffer buffer) {
		byte[] alias = Convert.toBytes(this.aliasName);
		byte[] uri = Convert.toBytes(this.aliasURI);
		buffer.put((byte)alias.length);
		buffer.put(alias);
		buffer.putShort((short) uri.length);
		buffer.put(uri);
	}

	void putMyJSON(JSONObject attachment) {
		attachment.put("alias", aliasName);
		attachment.put("uri", aliasURI);
	}

	public TransactionType getTransactionType() {
		return TransactionType.Messaging.ALIAS_ASSIGNMENT;
	}

	public String getAliasName() {
		return aliasName;
	}

	public String getAliasURI() {
		return aliasURI;
	}
}
*/
