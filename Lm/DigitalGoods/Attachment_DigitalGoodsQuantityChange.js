
/*

public final static class DigitalGoodsQuantityChange implements Attachment, Serializable {

	static final long serialVersionUID = 0;

	private final Long goodsId;
	private final int deltaQuantity;

	public DigitalGoodsQuantityChange(Long goodsId, int deltaQuantity) {
		this.goodsId = goodsId;
		this.deltaQuantity = deltaQuantity;
	}

	@Override
	public int getSize() {
		return 8 + 4;
	}

	@Override
	public byte[] getBytes() {
		try {
			ByteBuffer buffer = ByteBuffer.allocate(getSize());
			buffer.order(ByteOrder.LITTLE_ENDIAN);
			buffer.putLong(goodsId);
			buffer.putInt(deltaQuantity);
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
		attachment.put("deltaQuantity", deltaQuantity);
		return attachment;
	}

	@Override
	public TransactionType getTransactionType() {
		return TransactionType.DigitalGoods.QUANTITY_CHANGE;
	}

	public Long getGoodsId() { return goodsId; }

	public int getDeltaQuantity() { return deltaQuantity; }

}

*/
