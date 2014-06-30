
/*

public final static class AccountControlEffectiveBalanceLeasing implements Attachment, Serializable {

	static final long serialVersionUID = 0;

	private final short period;

	public AccountControlEffectiveBalanceLeasing(short period) {
		this.period = period;
	}

	@Override
	public int getSize() {
		return 2;
	}

	@Override
	public byte[] getBytes() {
		try {
			ByteBuffer buffer = ByteBuffer.allocate(getSize());
			buffer.order(ByteOrder.LITTLE_ENDIAN);
			buffer.putShort(period);
			return buffer.array();
		} catch (RuntimeException e) {
			Logger.logMessage("Error in getBytes", e);
			return null;
		}
	}

	@Override
	public JSONObject getJSONObject() {
		JSONObject attachment = new JSONObject();
		attachment.put("period", period);
		return attachment;
	}

	@Override
	public TransactionType getTransactionType() {
		return TransactionType.AccountControl.EFFECTIVE_BALANCE_LEASING;
	}

	public short getPeriod() {
		return period;
	}

}

*/
