
/*

public final static class DigitalGoodsPurchase implements Attachment, Serializable {

	static final long serialVersionUID = 0;

	private final Long goodsId;
	private final int quantity;
	private final long priceNQT;
	private final int deliveryDeadline;
	private final XoredData note;

	public DigitalGoodsPurchase(Long goodsId, int quantity, long priceNQT, int deliveryDeadline, XoredData note) {
		this.goodsId = goodsId;
		this.quantity = quantity;
		this.priceNQT = priceNQT;
		this.deliveryDeadline = deliveryDeadline;
		this.note = note;
	}

	@Override
	public int getSize() {
		return 8 + 4 + 8 + 4 + 2 + note.getData().length + 32;
	}

	@Override
	public byte[] getBytes() {
		try {
			ByteBuffer buffer = ByteBuffer.allocate(getSize());
			buffer.order(ByteOrder.LITTLE_ENDIAN);
			buffer.putLong(goodsId);
			buffer.putInt(quantity);
			buffer.putLong(priceNQT);
			buffer.putInt(deliveryDeadline);
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
		attachment.put("goods", Convert.toUnsignedLong(goodsId));
		attachment.put("quantity", quantity);
		attachment.put("priceNQT", priceNQT);
		attachment.put("deliveryDeadline", deliveryDeadline);
		attachment.put("note", Convert.toHexString(note.getData()));
		attachment.put("noteNonce", Convert.toHexString(note.getNonce()));
		return attachment;
	}

	@Override
	public TransactionType getTransactionType() {
		return TransactionType.DigitalGoods.PURCHASE;
	}

	public Long getGoodsId() { return goodsId; }

	public int getQuantity() { return quantity; }

	public long getPriceNQT() { return priceNQT; }

	public int getDeliveryDeadline() { return deliveryDeadline; }

	public XoredData getNote() { return note; }

}

*/
