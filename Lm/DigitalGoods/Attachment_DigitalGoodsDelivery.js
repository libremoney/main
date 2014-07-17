
/*

public final static class DigitalGoodsDelivery implements Attachment, Serializable {

	static final long serialVersionUID = 0;

	private final Long purchaseId;
	private final XoredData goods;
	private final long discountNQT;

	public DigitalGoodsDelivery(Long purchaseId, XoredData goods, long discountNQT) {
		this.purchaseId = purchaseId;
		this.goods = goods;
		this.discountNQT = discountNQT;
	}

	@Override
	public int getSize() {
		return 8 + 2 + goods.getData().length + 32 + 8;
	}

	@Override
	public byte[] getBytes() {
		try {
			ByteBuffer buffer = ByteBuffer.allocate(getSize());
			buffer.order(ByteOrder.LITTLE_ENDIAN);
			buffer.putLong(purchaseId);
			buffer.putShort((short)goods.getData().length);
			buffer.put(goods.getData());
			buffer.put(goods.getNonce());
			buffer.putLong(discountNQT);
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
		attachment.put("goods", Convert.toHexString(goods.getData()));
		attachment.put("goodsNonce", Convert.toHexString(goods.getNonce()));
		attachment.put("discountNQT", discountNQT);
		return attachment;
	}

	@Override
	public TransactionType getTransactionType() {
		return TransactionType.DigitalGoods.DELIVERY;
	}

	public Long getPurchaseId() { return purchaseId; }

	public XoredData getGoods() { return goods; }

	public long getDiscountNQT() { return discountNQT; }

}

*/
