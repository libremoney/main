
/*

public final static class DigitalGoodsPriceChange implements Attachment, Serializable {

	static final long serialVersionUID = 0;

	private final Long goodsId;
	private final long priceNQT;

	public DigitalGoodsPriceChange(Long goodsId, long priceNQT) {
		this.goodsId = goodsId;
		this.priceNQT = priceNQT;
	}

	@Override
	public int getSize() {
		return 8 + 8;
	}

	@Override
	public byte[] getBytes() {
		try {
			ByteBuffer buffer = ByteBuffer.allocate(getSize());
			buffer.order(ByteOrder.LITTLE_ENDIAN);
			buffer.putLong(goodsId);
			buffer.putLong(priceNQT);
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
		attachment.put("priceNQT", priceNQT);
		return attachment;
	}

	@Override
	public TransactionType getTransactionType() {
		return TransactionType.DigitalGoods.PRICE_CHANGE;
	}

	public Long getGoodsId() { return goodsId; }

	public long getPriceNQT() { return priceNQT; }

}

*/
