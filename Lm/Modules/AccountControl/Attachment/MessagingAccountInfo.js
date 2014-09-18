
/*

    public final static class Attachment_MessagingAccountInfo implements Attachment, Serializable {

        static final long serialVersionUID = 0;

        private final String name;
        private final String description;

        public MessagingAccountInfo(String name, String description) {
            this.name = name;
            this.description = description;
        }

        @Override
        public int getSize() {
            try {
                return 1 + name.getBytes("UTF-8").length + 2 + description.getBytes("UTF-8").length;
            } catch (RuntimeException|UnsupportedEncodingException e) {
                Logger.logMessage("Error in getBytes", e);
                return 0;
            }
        }

        @Override
        public byte[] getBytes() {
            try {
                byte[] name = this.name.getBytes("UTF-8");
                byte[] description = this.description.getBytes("UTF-8");

                ByteBuffer buffer = ByteBuffer.allocate(1 + name.length + 2 + description.length);
                buffer.order(ByteOrder.LITTLE_ENDIAN);
                buffer.put((byte)name.length);
                buffer.put(name);
                buffer.putShort((short)description.length);
                buffer.put(description);

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
            return attachment;
        }

        @Override
        public TransactionType getTransactionType() {
            return TransactionType.Messaging.ACCOUNT_INFO;
        }

        public String getName() {
            return name;
        }

        public String getDescription() {
            return description;
        }

    }

*/
