
/*

public final static class DigitalGoodsDelisting implements Attachment, Serializable {

	static final long serialVersionUID = 0;

	private final Long goodsId;

	public DigitalGoodsDelisting(Long goodsId) {
		this.goodsId = goodsId;
	}

	@Override
	public int getSize() {
		return 8;
	}

	@Override
	public byte[] getBytes() {
		try {
			ByteBuffer buffer = ByteBuffer.allocate(getSize());
			buffer.order(ByteOrder.LITTLE_ENDIAN);
			buffer.putLong(goodsId);
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
		return attachment;
	}

	@Override
	public TransactionType getTransactionType() {
		return TransactionType.DigitalGoods.DELISTING;
	}

	public Long getGoodsId() { return goodsId; }

}

*/
