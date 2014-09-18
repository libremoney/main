
/*

    public final static class Attachment_MessagingHubAnnouncement implements Attachment, Serializable {

        static final long serialVersionUID = 0;

        private final long minFeePerByteNQT;
        private final String[] uris;

        public MessagingHubAnnouncement(long minFeePerByteNQT, String[] uris) {
            this.minFeePerByteNQT = minFeePerByteNQT;
            this.uris = uris;
        }

        @Override
        public int getSize() {
            try {
                int size = 8 + 1;
                for (String uri : uris) {
                    size += 2 + uri.getBytes("UTF-8").length;
                }
                return size;
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
                buffer.putLong(minFeePerByteNQT);
                buffer.put((byte) uris.length);
                for (String uri : uris) {
                    byte[] uriBytes = uri.getBytes("UTF-8");
                    buffer.putShort((short)uriBytes.length);
                    buffer.put(uriBytes);
                }
                return buffer.array();
            } catch (RuntimeException|UnsupportedEncodingException e) {
                Logger.logMessage("Error in getBytes", e);
                return null;
            }

        }

        @Override
        public JSONObject getJSONObject() {

            JSONObject attachment = new JSONObject();
            attachment.put("minFeePerByteNQT", minFeePerByteNQT);
            JSONArray uris = new JSONArray();
            Collections.addAll(uris, this.uris);
            attachment.put("uris", uris);
            return attachment;

        }

        @Override
        public TransactionType getTransactionType() {
            return TransactionType.Messaging.HUB_ANNOUNCEMENT;
        }

        public long getMinFeePerByteNQT() {
            return minFeePerByteNQT;
        }

        public String[] getUris() {
            return uris;
        }

    }

*/
