
/*

public final static class DigitalGoodsFeedback implements Attachment, Serializable {

	static final long serialVersionUID = 0;

	private final Long purchaseId;
	private final XoredData note;

	public DigitalGoodsFeedback(Long purchaseId, XoredData note) {
		this.purchaseId = purchaseId;
		this.note = note;
	}

	@Override
	public int getSize() {
		try {
			return 8 + 2 + note.getData().length + 32;
		} catch (RuntimeException e) {
			Logger.logMessage("Error in getBytes", e);
			return 0;
		}
	}

	@Override
	public byte[] getBytes() {
		try {
			ByteBuffer buffer = ByteBuffer.allocate(getSize());
			buffer.order(ByteOrder.LITTLE_ENDIAN);
			buffer.putLong(purchaseId);
			buffer.putShort((short)note.getData().length);
			buffer.put(note.getData());
			buffer.put(note.getNonce());
			return buffer.array();
		} catch (RuntimeException e) {
			Logger.logMessage("Error in getBytes", e);
			return null;
		}
	}

	@Override
	public JSONObject getJSONObject() {
		JSONObject attachment = new JSONObject();
		attachment.put("purchase", Convert.toUnsignedLong(purchaseId));
		attachment.put("note", Convert.toHexString(note.getData()));
		attachment.put("noteNonce", Convert.toHexString(note.getNonce()));
		return attachment;
	}

	@Override
	public TransactionType getTransactionType() {
		return TransactionType.DigitalGoods.FEEDBACK;
	}

	public Long getPurchaseId() { return purchaseId; }

	public XoredData getNote() { return note; }

}

*/
