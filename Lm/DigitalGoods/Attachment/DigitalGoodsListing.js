
/*

public final static class DigitalGoodsListing implements Attachment, Serializable {

	static final long serialVersionUID = 0;

	private final String name;
	private final String description;
	private final String tags;
	private final int quantity;
	private final long priceNQT;

	public DigitalGoodsListing(String name, String description, String tags, int quantity, long priceNQT) {
		this.name = name;
		this.description = description;
		this.tags = tags;
		this.quantity = quantity;
		this.priceNQT = priceNQT;
	}

	@Override
	public int getSize() {
		try {
			return 2 + name.getBytes("UTF-8").length + 2 + description.getBytes("UTF-8").length + 2
					+ tags.getBytes("UTF-8").length + 4 + 8;
		} catch (RuntimeException|UnsupportedEncodingException e) {
			Logger.logMessage("Error in getBytes", e);
			return 0;
		}
	}

	@Override
	public byte[] getBytes() {
		try {
			ByteBuffer buffer = ByteBuffer.allocate(getSize());
			buffer.order(ByteOrder.LITTLE_ENDIAN);
			byte[] nameBytes = name.getBytes("UTF-8");
			buffer.putShort((short)nameBytes.length);
			buffer.put(nameBytes);
			byte[] descriptionBytes = description.getBytes("UTF-8");
			buffer.putShort((short)descriptionBytes.length);
			buffer.put(descriptionBytes);
			byte[] tagsBytes = tags.getBytes("UTF-8");
			buffer.putShort((short)tagsBytes.length);
			buffer.put(tagsBytes);
			buffer.putInt(quantity);
			buffer.putLong(priceNQT);
			return buffer.array();
		} catch (RuntimeException|UnsupportedEncodingException e) {
			Logger.logMessage("Error in getBytes", e);
			return null;
		}
	}

	@Override
	public JSONObject getJSONObject() {
		JSONObject attachment = new JSONObject();
		attachment.put("name", name);
		attachment.put("description", description);
		attachment.put("tags", tags);
		attachment.put("quantity", quantity);
		attachment.put("priceNQT", priceNQT);
		return attachment;
	}

	@Override
	public TransactionType getTransactionType() {
		return TransactionType.DigitalGoods.LISTING;
	}

	public String getName() { return name; }

	public String getDescription() { return description; }

	public String getTags() { return tags; }

	public int getQuantity() { return quantity; }

	public long getPriceNQT() { return priceNQT; }

}

*/
