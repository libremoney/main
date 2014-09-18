/**!
 * LibreMoney 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

function ColoredCoinsAssetTransfer() {
	// Attachment
	
	/*
	static final long serialVersionUID = 0;

	private final Long assetId;
	private final long quantityQNT;
	private final String comment;
	*/

	/*
	public ColoredCoinsAssetTransfer(Long assetId, long quantityQNT, String comment) {
		this.assetId = assetId;
		this.quantityQNT = quantityQNT;
		this.comment = Convert.nullToEmpty(comment);
	}
	*/

	/*
	public int getSize() {
		try {
			return 8 + 8 + 2 + comment.getBytes("UTF-8").length;
		} catch (RuntimeException|UnsupportedEncodingException e) {
			Logger.logMessage("Error in getBytes", e);
			return 0;
		}
	}
	*/

	/*
	public byte[] getBytes() {
		try {
			byte[] commentBytes = this.comment.getBytes("UTF-8");
			ByteBuffer buffer = ByteBuffer.allocate(8 + 8 + 2 + commentBytes.length);
			buffer.order(ByteOrder.LITTLE_ENDIAN);
			buffer.putLong(Convert.nullToZero(assetId));
			buffer.putLong(quantityQNT);
			buffer.putShort((short) commentBytes.length);
			buffer.put(commentBytes);
			return buffer.array();
		} catch (RuntimeException|UnsupportedEncodingException e) {
			Logger.logMessage("Error in getBytes", e);
			return null;
		}
	}
	*/

	/*
	public JSONObject getJSONObject() {
		JSONObject attachment = new JSONObject();
		attachment.put("asset", Convert.toUnsignedLong(assetId));
		attachment.put("quantityQNT", quantityQNT);
		attachment.put("comment", comment);
		return attachment;
	}
	*/

	/*
	public TransactionType getTransactionType() {
		return TransactionType.ColoredCoins.ASSET_TRANSFER;
	}
	*/

	/*
	public Long getAssetId() {
		return assetId;
	}
	*/

	/*
	public long getQuantityQNT() {
		return quantityQNT;
	}
	*/

	/*
	public String getComment() {
		return comment;
	}
	*/

	return this;
}


module.exports = ColoredCoinsAssetTransfer;
