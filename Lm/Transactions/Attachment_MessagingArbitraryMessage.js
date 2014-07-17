
/*

    public final static class Attachment_MessagingArbitraryMessage implements Attachment, Serializable {

        static final long serialVersionUID = 0;

        private final byte[] message;

        public MessagingArbitraryMessage(byte[] message) {

            this.message = message;

        }

        @Override
        public int getSize() {
            return 4 + message.length;
        }

        @Override
        public byte[] getBytes() {

            ByteBuffer buffer = ByteBuffer.allocate(getSize());
            buffer.order(ByteOrder.LITTLE_ENDIAN);
            buffer.putInt(message.length);
            buffer.put(message);

            return buffer.array();

        }

        @Override
        public JSONObject getJSONObject() {

            JSONObject attachment = new JSONObject();
            attachment.put("message", message == null ? null : Convert.toHexString(message));

            return attachment;

        }

        @Override
        public TransactionType getTransactionType() {
            return TransactionType.Messaging.ARBITRARY_MESSAGE;
        }

        public byte[] getMessage() {
            return message;
        }
    }

*/