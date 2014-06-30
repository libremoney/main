
/*

    public final static class Attachment_ColoredCoinsAssetTransfer implements Attachment, Serializable {

        static final long serialVersionUID = 0;

        private final Long assetId;
        private final long quantityQNT;
        private final String comment;

        public ColoredCoinsAssetTransfer(Long assetId, long quantityQNT, String comment) {

            this.assetId = assetId;
            this.quantityQNT = quantityQNT;
            this.comment = Convert.nullToEmpty(comment);

        }

        @Override
        public int getSize() {
            try {
                return 8 + 8 + 2 + comment.getBytes("UTF-8").length;
            } catch (RuntimeException|UnsupportedEncodingException e) {
                Logger.logMessage("Error in getBytes", e);
                return 0;
            }
        }

        @Override
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

        @Override
        public JSONObject getJSONObject() {

            JSONObject attachment = new JSONObject();
            attachment.put("asset", Convert.toUnsignedLong(assetId));
            attachment.put("quantityQNT", quantityQNT);
            attachment.put("comment", comment);

            return attachment;

        }

        @Override
        public TransactionType getTransactionType() {
            return TransactionType.ColoredCoins.ASSET_TRANSFER;
        }

        public Long getAssetId() {
            return assetId;
        }

        public long getQuantityQNT() {
            return quantityQNT;
        }

        public String getComment() {
            return comment;
        }

    }

*/
