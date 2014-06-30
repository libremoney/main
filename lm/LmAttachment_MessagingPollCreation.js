
/*

    public final static class Attachment_MessagingPollCreation implements Attachment, Serializable {

        static final long serialVersionUID = 0;

        private final String pollName;
        private final String pollDescription;
        private final String[] pollOptions;
        private final byte minNumberOfOptions, maxNumberOfOptions;
        private final boolean optionsAreBinary;

        public MessagingPollCreation(String pollName, String pollDescription, String[] pollOptions, byte minNumberOfOptions, byte maxNumberOfOptions, boolean optionsAreBinary) {

            this.pollName = pollName;
            this.pollDescription = pollDescription;
            this.pollOptions = pollOptions;
            this.minNumberOfOptions = minNumberOfOptions;
            this.maxNumberOfOptions = maxNumberOfOptions;
            this.optionsAreBinary = optionsAreBinary;

        }

        @Override
        public int getSize() {
            try {
                int size = 2 + pollName.getBytes("UTF-8").length + 2 + pollDescription.getBytes("UTF-8").length + 1;
                for (String pollOption : pollOptions) {
                    size += 2 + pollOption.getBytes("UTF-8").length;
                }
                size +=  1 + 1 + 1;
                return size;
            } catch (RuntimeException|UnsupportedEncodingException e) {
                Logger.logMessage("Error in getBytes", e);
                return 0;
            }
        }

        @Override
        public byte[] getBytes() {

            try {

                byte[] name = this.pollName.getBytes("UTF-8");
                byte[] description = this.pollDescription.getBytes("UTF-8");
                byte[][] options = new byte[this.pollOptions.length][];
                for (int i = 0; i < this.pollOptions.length; i++) {
                    options[i] = this.pollOptions[i].getBytes("UTF-8");
                }

                ByteBuffer buffer = ByteBuffer.allocate(getSize());
                buffer.order(ByteOrder.LITTLE_ENDIAN);
                buffer.putShort((short)name.length);
                buffer.put(name);
                buffer.putShort((short)description.length);
                buffer.put(description);
                buffer.put((byte)options.length);
                for (byte[] option : options) {
                    buffer.putShort((short) option.length);
                    buffer.put(option);
                }
                buffer.put(this.minNumberOfOptions);
                buffer.put(this.maxNumberOfOptions);
                buffer.put(this.optionsAreBinary ? (byte)1 : (byte)0);

                return buffer.array();

            } catch (RuntimeException | UnsupportedEncodingException e) {

                Logger.logMessage("Error in getBytes", e);
                return null;

            }

        }

        @Override
        public JSONObject getJSONObject() {

            JSONObject attachment = new JSONObject();
            attachment.put("name", this.pollName);
            attachment.put("description", this.pollDescription);
            JSONArray options = new JSONArray();
            if (this.pollOptions != null) {
                Collections.addAll(options, this.pollOptions);
            }
            attachment.put("options", options);
            attachment.put("minNumberOfOptions", this.minNumberOfOptions);
            attachment.put("maxNumberOfOptions", this.maxNumberOfOptions);
            attachment.put("optionsAreBinary", this.optionsAreBinary);

            return attachment;

        }

        @Override
        public TransactionType getTransactionType() {
            return TransactionType.Messaging.POLL_CREATION;
        }

        public String getPollName() { return pollName; }

        public String getPollDescription() { return pollDescription; }

        public String[] getPollOptions() { return pollOptions; }

        public byte getMinNumberOfOptions() { return minNumberOfOptions; }

        public byte getMaxNumberOfOptions() { return maxNumberOfOptions; }

        public boolean isOptionsAreBinary() { return optionsAreBinary; }

    }

*/
