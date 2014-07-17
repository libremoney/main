
/*

	public final static class Attachment_MessagingAliasAssignment implements Attachment, Serializable {

		static final long serialVersionUID = 0;

		private final String aliasName;
		private final String aliasURI;

		public MessagingAliasAssignment(String aliasName, String aliasURI) {

			this.aliasName = aliasName.trim().intern();
			this.aliasURI = aliasURI.trim().intern();

		}

		@Override
		public int getSize() {
			try {
				return 1 + aliasName.getBytes("UTF-8").length + 2 + aliasURI.getBytes("UTF-8").length;
			} catch (RuntimeException|UnsupportedEncodingException e) {
				Logger.logMessage("Error in getBytes", e);
				return 0;
			}
		}

		@Override
		public byte[] getBytes() {

			try {

				byte[] alias = this.aliasName.getBytes("UTF-8");
				byte[] uri = this.aliasURI.getBytes("UTF-8");

				ByteBuffer buffer = ByteBuffer.allocate(1 + alias.length + 2 + uri.length);
				buffer.order(ByteOrder.LITTLE_ENDIAN);
				buffer.put((byte)alias.length);
				buffer.put(alias);
				buffer.putShort((short)uri.length);
				buffer.put(uri);

				return buffer.array();

			} catch (RuntimeException|UnsupportedEncodingException e) {
				Logger.logMessage("Error in getBytes", e);
				return null;

			}

		}

		@Override
		public JSONObject getJSONObject() {

			JSONObject attachment = new JSONObject();
			attachment.put("alias", aliasName);
			attachment.put("uri", aliasURI);

			return attachment;

		}

		@Override
		public TransactionType getTransactionType() {
			return TransactionType.Messaging.ALIAS_ASSIGNMENT;
		}

		public String getAliasName() {
			return aliasName;
		}

		public String getAliasURI() {
			return aliasURI;
		}
	}

*/
