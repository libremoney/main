
LmAttachment = require(__dirname + '/LmAttachment');

function CreateColoredCoinsOrderCancellation() {
	var obj = LmAttachment.CreateAttachment();

	/*
	static final long serialVersionUID = 0;
	private final Long orderId;

	private ColoredCoinsOrderCancellation(Long orderId) {
		this.orderId = orderId;
	}

	public int getSize() {
		return 8;
	}

	public byte[] getBytes() {
		ByteBuffer buffer = ByteBuffer.allocate(getSize());
		buffer.order(ByteOrder.LITTLE_ENDIAN);
		buffer.putLong(Convert.nullToZero(orderId));
		return buffer.array();
	}

	public JSONObject getJSONObject() {
		JSONObject attachment = new JSONObject();
		attachment.put("order", Convert.toUnsignedLong(orderId));
		return attachment;
	}

	public Long getOrderId() {
		return orderId;
	}
	*/

	return obj;
}


function CreateColoredCoinsBidOrderCancellation() {
	obj = CreateColoredCoinsOrderCancellation();

	/*
	static final long serialVersionUID = 0;

	public ColoredCoinsBidOrderCancellation(Long orderId) {
		super(orderId);
	}

	@Override
	public TransactionType getTransactionType() {
		return TransactionType.ColoredCoins.BID_ORDER_CANCELLATION;
	}
	*/

	return obj;
}


exports.CreateColoredCoinsOrderCancellation = CreateColoredCoinsOrderCancellation;
exports.CreateColoredCoinsBidOrderCancellation = CreateColoredCoinsBidOrderCancellation;
