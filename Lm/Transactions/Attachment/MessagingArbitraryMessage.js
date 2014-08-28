/**!
 * LibreMoney 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */


/*
public final static class Attachment_MessagingArbitraryMessage implements Attachment, Serializable {

	static final long serialVersionUID = 0;

	private final byte[] message;

	public MessagingArbitraryMessage(byte[] message) {
		this.message = message;
	}

	public int getSize() {
		return 4 + message.length;
	}

	public byte[] getBytes() {
		ByteBuffer buffer = ByteBuffer.allocate(getSize());
		buffer.order(ByteOrder.LITTLE_ENDIAN);
		buffer.putInt(message.length);
		buffer.put(message);
		return buffer.array();
	}

	public JSONObject getJSONObject() {
		JSONObject attachment = new JSONObject();
		attachment.put("message", message == null ? null : Convert.toHexString(message));
		return attachment;
	}

	public TransactionType getTransactionType() {
		return TransactionType.Messaging.ARBITRARY_MESSAGE;
	}

	public byte[] getMessage() {
		return message;
	}
}

*/