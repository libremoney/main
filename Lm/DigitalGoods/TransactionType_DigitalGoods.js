function TransactionType_DigitalGoods() {
	/*
	public final byte getType() {
		return TransactionType.TYPE_DIGITAL_GOODS;
	}

	boolean applyAttachmentUnconfirmed(Transaction transaction, Account senderAccount) {
		return true;
	}

	void undoAttachmentUnconfirmed(Transaction transaction, Account senderAccount) {}

	final void validateAttachment(Transaction transaction) throws NxtException.ValidationException {
		if (Nxt.getBlockchain().getLastBlock().getHeight() < Constants.DIGITAL_GOODS_STORE_BLOCK) {
			throw new NotYetEnabledException("Digital goods listing not yet enabled at height " + Nxt.getBlockchain().getLastBlock().getHeight());
		}
		if (! Genesis.CREATOR_ID.equals(transaction.getRecipientId())
				|| transaction.getAmountNQT() != 0) {
			throw new NxtException.ValidationException("Invalid digital goods transaction");
		}
		doValidateAttachment(transaction);
	}

	abstract void doValidateAttachment(Transaction transaction) throws NxtException.ValidationException;


	public static final TransactionType LISTING = new DigitalGoods() {

		public final byte getSubtype() {
			return TransactionType.SUBTYPE_DIGITAL_GOODS_LISTING;
		}

		void LoadAttachment(TransactionImpl transaction, ByteBuffer buffer) throws NxtException.ValidationException {
			try {
				int nameBytesLength = buffer.getShort();
				if (nameBytesLength > 3 * Constants.MAX_DIGITAL_GOODS_LISTING_NAME_LENGTH) {
					throw new NxtException.ValidationException("Invalid name length: " + nameBytesLength);
				}
				byte[] nameBytes = new byte[nameBytesLength];
				buffer.get(nameBytes);
				String name = new String(nameBytes, "UTF-8");
				int descriptionBytesLength = buffer.getShort();
				if (descriptionBytesLength > 3 * Constants.MAX_DIGITAL_GOODS_LISTING_DESCRIPTION_LENGTH) {
					throw new NxtException.ValidationException("Invalid description length: " + descriptionBytesLength);
				}
				byte[] descriptionBytes = new byte[descriptionBytesLength];
				buffer.get(descriptionBytes);
				String description = new String(descriptionBytes, "UTF-8");
				int tagsBytesLength = buffer.getShort();
				if (tagsBytesLength > 3 * Constants.MAX_DIGITAL_GOODS_LISTING_TAGS_LENGTH) {
					throw new NxtException.ValidationException("Invalid tags length: " + tagsBytesLength);
				}
				byte[] tagsBytes = new byte[tagsBytesLength];
				buffer.get(tagsBytes);
				String tags = new String(tagsBytes, "UTF-8");
				int quantity = buffer.getInt();
				long priceNQT = buffer.getLong();
				transaction.setAttachment(new Attachment.DigitalGoodsListing(name, description, tags, quantity, priceNQT));
			} catch (UnsupportedEncodingException e) {
				throw new NxtException.ValidationException("Error parsing goods listing", e);
			}
		}

		void LoadAttachment(TransactionImpl transaction, JSONObject attachmentData) throws NxtException.ValidationException {
			String name = (String)attachmentData.get("name");
			String description = (String)attachmentData.get("description");
			String tags = (String)attachmentData.get("tags");
			int quantity = ((Long)attachmentData.get("quantity")).intValue();
			long priceNQT = (Long)attachmentData.get("priceNQT");
			transaction.setAttachment(new Attachment.DigitalGoodsListing(name, description, tags, quantity, priceNQT));
		}

		void applyAttachment(Transaction transaction, Account senderAccount, Account recipientAccount) {
			Attachment.DigitalGoodsListing attachment = (Attachment.DigitalGoodsListing)transaction.getAttachment();
			DigitalGoodsStore.listGoods(transaction.getId(), transaction.getSenderId(), attachment.getName(), attachment.getDescription(),
					attachment.getTags(), attachment.getQuantity(), attachment.getPriceNQT());
		}

		void undoAttachment(Transaction transaction, Account senderAccount, Account recipientAccount) throws UndoNotSupportedException {
			DigitalGoodsStore.undoListGoods(transaction.getId());
		}

		void doValidateAttachment(Transaction transaction) throws NxtException.ValidationException {
			Attachment.DigitalGoodsListing attachment = (Attachment.DigitalGoodsListing)transaction.getAttachment();
			if (attachment.getName().length() == 0
					|| attachment.getName().length() > Constants.MAX_DIGITAL_GOODS_LISTING_NAME_LENGTH
					|| attachment.getDescription().length() > Constants.MAX_DIGITAL_GOODS_LISTING_DESCRIPTION_LENGTH
					|| attachment.getTags().length() > Constants.MAX_DIGITAL_GOODS_LISTING_TAGS_LENGTH
					|| attachment.getQuantity() < 0 || attachment.getQuantity() > Constants.MAX_DIGITAL_GOODS_QUANTITY
					|| attachment.getPriceNQT() <= 0 || attachment.getPriceNQT() > Constants.MAX_BALANCE_NQT) {
				throw new NxtException.ValidationException("Invalid digital goods listing: " + attachment.getJSONObject());
			}
		}

	};

	public static final TransactionType DELISTING = new DigitalGoods() {

		public final byte getSubtype() {
			return TransactionType.SUBTYPE_DIGITAL_GOODS_DELISTING;
		}

		void LoadAttachment(TransactionImpl transaction, ByteBuffer buffer) throws NxtException.ValidationException {
			Long goodsId = buffer.getLong();
			transaction.setAttachment(new Attachment.DigitalGoodsDelisting(goodsId));
		}

		void LoadAttachment(TransactionImpl transaction, JSONObject attachmentData) throws NxtException.ValidationException {
			Long goodsId = (Long)attachmentData.get("goods");
			transaction.setAttachment(new Attachment.DigitalGoodsDelisting(goodsId));
		}

		void applyAttachment(Transaction transaction, Account senderAccount, Account recipientAccount) {
			Attachment.DigitalGoodsDelisting attachment = (Attachment.DigitalGoodsDelisting)transaction.getAttachment();
			DigitalGoodsStore.delistGoods(attachment.getGoodsId());
		}

		void undoAttachment(Transaction transaction, Account senderAccount, Account recipientAccount) throws UndoNotSupportedException {
			DigitalGoodsStore.undoDelistGoods(transaction.getId());
		}

		void doValidateAttachment(Transaction transaction) throws NxtException.ValidationException {
			Attachment.DigitalGoodsDelisting attachment = (Attachment.DigitalGoodsDelisting)transaction.getAttachment();
			DigitalGoodsStore.Goods goods = DigitalGoodsStore.getGoods(attachment.getGoodsId());
			if (goods == null || goods.isDelisted()
					|| ! transaction.getSenderId().equals(goods.getSellerId())) {
				throw new NxtException.ValidationException("Invalid digital goods delisting: " + attachment.getJSONObject());
			}
		}

	};

	public static final TransactionType PRICE_CHANGE = new DigitalGoods() {

		public final byte getSubtype() {
			return TransactionType.SUBTYPE_DIGITAL_GOODS_PRICE_CHANGE;
		}

		void LoadAttachment(TransactionImpl transaction, ByteBuffer buffer) throws NxtException.ValidationException {
			Long goodsId = buffer.getLong();
			long priceNQT = buffer.getLong();
			transaction.setAttachment(new Attachment.DigitalGoodsPriceChange(goodsId, priceNQT));
		}

		void LoadAttachment(TransactionImpl transaction, JSONObject attachmentData) throws NxtException.ValidationException {
			Long goodsId = (Long)attachmentData.get("goods");
			long priceNQT = (Long)attachmentData.get("priceNQT");
			transaction.setAttachment(new Attachment.DigitalGoodsPriceChange(goodsId, priceNQT));
		}

		void applyAttachment(Transaction transaction, Account senderAccount, Account recipientAccount) {
			Attachment.DigitalGoodsPriceChange attachment = (Attachment.DigitalGoodsPriceChange)transaction.getAttachment();
			DigitalGoodsStore.changePrice(attachment.getGoodsId(), attachment.getPriceNQT());
		}

		void undoAttachment(Transaction transaction, Account senderAccount, Account recipientAccount) throws UndoNotSupportedException {
			throw new UndoNotSupportedException("Reversal of digital goods price change not supported");
		}

		void doValidateAttachment(Transaction transaction) throws NxtException.ValidationException {
			Attachment.DigitalGoodsPriceChange attachment = (Attachment.DigitalGoodsPriceChange)transaction.getAttachment();
			DigitalGoodsStore.Goods goods = DigitalGoodsStore.getGoods(attachment.getGoodsId());
			if (attachment.getPriceNQT() <= 0 || attachment.getPriceNQT() > Constants.MAX_BALANCE_NQT
					|| goods == null || goods.isDelisted()
					|| ! transaction.getSenderId().equals(goods.getSellerId())) {
				throw new NxtException.ValidationException("Invalid digital goods price change: " + attachment.getJSONObject());
			}
		}

	};

	public static final TransactionType QUANTITY_CHANGE = new DigitalGoods() {

		public final byte getSubtype() {
			return TransactionType.SUBTYPE_DIGITAL_GOODS_QUANTITY_CHANGE;
		}

		void LoadAttachment(TransactionImpl transaction, ByteBuffer buffer) throws NxtException.ValidationException {
			Long goodsId = buffer.getLong();
			int deltaQuantity = buffer.getInt();
			transaction.setAttachment(new Attachment.DigitalGoodsQuantityChange(goodsId, deltaQuantity));
		}

		void LoadAttachment(TransactionImpl transaction, JSONObject attachmentData) throws NxtException.ValidationException {
			Long goodsId = (Long)attachmentData.get("goods");
			int deltaQuantity = ((Long)attachmentData.get("deltaQuantity")).intValue();
			transaction.setAttachment(new Attachment.DigitalGoodsQuantityChange(goodsId, deltaQuantity));
		}

		void applyAttachment(Transaction transaction, Account senderAccount, Account recipientAccount) {
			Attachment.DigitalGoodsQuantityChange attachment = (Attachment.DigitalGoodsQuantityChange)transaction.getAttachment();
			DigitalGoodsStore.changeQuantity(attachment.getGoodsId(), attachment.getDeltaQuantity());
		}

		void undoAttachment(Transaction transaction, Account senderAccount, Account recipientAccount) throws UndoNotSupportedException {
			throw new UndoNotSupportedException("Reversal of digital goods quantity change not supported");
		}

		void doValidateAttachment(Transaction transaction) throws NxtException.ValidationException {
			Attachment.DigitalGoodsQuantityChange attachment = (Attachment.DigitalGoodsQuantityChange)transaction.getAttachment();
			DigitalGoodsStore.Goods goods = DigitalGoodsStore.getGoods(attachment.getGoodsId());
			if (goods == null
					|| attachment.getDeltaQuantity() < -Constants.MAX_DIGITAL_GOODS_QUANTITY
					|| attachment.getDeltaQuantity() > Constants.MAX_DIGITAL_GOODS_QUANTITY
					|| ! transaction.getSenderId().equals(goods.getSellerId())) {
				throw new NxtException.ValidationException("Invalid digital goods quantity change: " + attachment.getJSONObject());
			}
		}

	};

	public static final TransactionType PURCHASE = new DigitalGoods() {

		public final byte getSubtype() {
			return TransactionType.SUBTYPE_DIGITAL_GOODS_PURCHASE;
		}

		void LoadAttachment(TransactionImpl transaction, ByteBuffer buffer) throws NxtException.ValidationException {
			Long goodsId = buffer.getLong();
			int quantity = buffer.getInt();
			long priceNQT = buffer.getLong();
			int deliveryDeadline = buffer.getInt();
			int noteBytesLength = buffer.getShort();
			if (noteBytesLength > Constants.MAX_DIGITAL_GOODS_NOTE_LENGTH) {
				throw new NxtException.ValidationException("Invalid note length: " + noteBytesLength);
			}
			byte[] noteBytes = new byte[noteBytesLength];
			buffer.get(noteBytes);
			byte[] noteNonceBytes = new byte[32];
			buffer.get(noteNonceBytes);
			XoredData note = new XoredData(noteBytes, noteNonceBytes);
			transaction.setAttachment(new Attachment.DigitalGoodsPurchase(goodsId, quantity, priceNQT, deliveryDeadline, note));
		}

		void LoadAttachment(TransactionImpl transaction, JSONObject attachmentData) throws NxtException.ValidationException {
			Long goodsId = (Long)attachmentData.get("goods");
			int quantity = ((Long)attachmentData.get("quantity")).intValue();
			long priceNQT = (Long)attachmentData.get("priceNQT");
			int deliveryDeadline = ((Long)attachmentData.get("deliveryDeadline")).intValue();
			XoredData note = new XoredData(Convert.parseHexString((String)attachmentData.get("note")),
					Convert.parseHexString((String)attachmentData.get("noteNonce")));

			transaction.setAttachment(new Attachment.DigitalGoodsPurchase(goodsId, quantity, priceNQT, deliveryDeadline, note));
		}

		boolean applyAttachmentUnconfirmed(Transaction transaction, Account senderAccount) {
			Attachment.DigitalGoodsPurchase attachment = (Attachment.DigitalGoodsPurchase) transaction.getAttachment();
			if (senderAccount.getUnconfirmedBalanceNQT() >= Convert.safeMultiply(attachment.getQuantity(), attachment.getPriceNQT())) {
				senderAccount.addToUnconfirmedBalanceNQT(- Convert.safeMultiply(attachment.getQuantity(), attachment.getPriceNQT()));
				return true;
			}
			return false;
		}

		void undoAttachmentUnconfirmed(Transaction transaction, Account senderAccount) {
			Attachment.DigitalGoodsPurchase attachment = (Attachment.DigitalGoodsPurchase) transaction.getAttachment();
			senderAccount.addToUnconfirmedBalanceNQT(Convert.safeMultiply(attachment.getQuantity(), attachment.getPriceNQT()));
		}

		void applyAttachment(Transaction transaction, Account senderAccount, Account recipientAccount) {
			Attachment.DigitalGoodsPurchase attachment = (Attachment.DigitalGoodsPurchase)transaction.getAttachment();
			DigitalGoodsStore.purchase(transaction.getId(), transaction.getSenderId(), attachment.getGoodsId(),
					attachment.getQuantity(), attachment.getPriceNQT(), attachment.getDeliveryDeadline(), attachment.getNote());
		}

		void undoAttachment(Transaction transaction, Account senderAccount, Account recipientAccount) throws UndoNotSupportedException {
			Attachment.DigitalGoodsPurchase attachment = (Attachment.DigitalGoodsPurchase)transaction.getAttachment();
			DigitalGoodsStore.undoPurchase(transaction.getId(), transaction.getSenderId(),
					attachment.getQuantity(), attachment.getPriceNQT());
		}

		void doValidateAttachment(Transaction transaction) throws NxtException.ValidationException {
			Attachment.DigitalGoodsPurchase attachment = (Attachment.DigitalGoodsPurchase)transaction.getAttachment();
			DigitalGoodsStore.Goods goods = DigitalGoodsStore.getGoods(attachment.getGoodsId());
			if (attachment.getQuantity() <= 0 || attachment.getQuantity() > Constants.MAX_DIGITAL_GOODS_QUANTITY
					|| attachment.getPriceNQT() <= 0 || attachment.getPriceNQT() > Constants.MAX_BALANCE_NQT
					|| attachment.getNote().getData().length > Constants.MAX_DIGITAL_GOODS_NOTE_LENGTH
					|| attachment.getNote().getNonce().length != 32
					|| goods == null || goods.isDelisted()
					|| attachment.getQuantity() > goods.getQuantity()
					|| attachment.getPriceNQT() != goods.getPriceNQT()
					|| attachment.getDeliveryDeadline() <= Nxt.getBlockchain().getLastBlock().getTimestamp()) {
				throw new NxtException.ValidationException("Invalid digital goods purchase: " + attachment.getJSONObject());
			}
		}

	};

	public static final TransactionType DELIVERY = new DigitalGoods() {

		public final byte getSubtype() { return TransactionType.SUBTYPE_DIGITAL_GOODS_DELIVERY; }

		void LoadAttachment(TransactionImpl transaction, ByteBuffer buffer) throws NxtException.ValidationException {
			Long purchaseId = buffer.getLong();
			int goodsBytesLength = buffer.getShort();
			if (goodsBytesLength > Constants.MAX_DIGITAL_GOODS_LENGTH) {
				throw new NxtException.ValidationException("Invalid goods length: " + goodsBytesLength);
			}
			byte[] goodsBytes = new byte[goodsBytesLength];
			buffer.get(goodsBytes);
			byte[] goodsNonceBytes = new byte[32];
			buffer.get(goodsNonceBytes);
			XoredData goods = new XoredData(goodsBytes, goodsNonceBytes);
			long discountNQT = buffer.getLong();
			transaction.setAttachment(new Attachment.DigitalGoodsDelivery(purchaseId, goods, discountNQT));
		}

		void LoadAttachment(TransactionImpl transaction, JSONObject attachmentData) throws NxtException.ValidationException {
			Long purchaseId = (Long)attachmentData.get("purchase");
			XoredData goods = new XoredData(Convert.parseHexString((String)attachmentData.get("goods")),
					Convert.parseHexString((String)attachmentData.get("goodsNonce")));
			long discountNQT = (Long)attachmentData.get("discountNQT");

			transaction.setAttachment(new Attachment.DigitalGoodsDelivery(purchaseId, goods, discountNQT));
		}

		void applyAttachment(Transaction transaction, Account senderAccount, Account recipientAccount) {
			Attachment.DigitalGoodsDelivery attachment = (Attachment.DigitalGoodsDelivery)transaction.getAttachment();
			DigitalGoodsStore.deliver(transaction.getSenderId(), attachment.getPurchaseId(), attachment.getDiscountNQT());
		}

		void undoAttachment(Transaction transaction, Account senderAccount, Account recipientAccount) throws UndoNotSupportedException {
			Attachment.DigitalGoodsDelivery attachment = (Attachment.DigitalGoodsDelivery)transaction.getAttachment();
			DigitalGoodsStore.undoDeliver(transaction.getSenderId(), attachment.getPurchaseId(), attachment.getDiscountNQT());
		}

		void doValidateAttachment(Transaction transaction) throws NxtException.ValidationException {
			Attachment.DigitalGoodsDelivery attachment = (Attachment.DigitalGoodsDelivery)transaction.getAttachment();
			DigitalGoodsStore.Purchase purchase = DigitalGoodsStore.getPendingPurchase(attachment.getPurchaseId());
			if (attachment.getGoods().getData().length > Constants.MAX_DIGITAL_GOODS_LENGTH
					|| attachment.getGoods().getNonce().length != 32
					|| attachment.getDiscountNQT() < 0 || attachment.getDiscountNQT() > Constants.MAX_BALANCE_NQT
					|| purchase == null
					|| ! transaction.getSenderId().equals(purchase.getSellerId())) {
				throw new NxtException.ValidationException("Invalid digital goods delivery: " + attachment.getJSONObject());
			}
		}

	};

	public static final TransactionType FEEDBACK = new DigitalGoods() {

		public final byte getSubtype() { return TransactionType.SUBTYPE_DIGITAL_GOODS_FEEDBACK; }

		void LoadAttachment(TransactionImpl transaction, ByteBuffer buffer) throws NxtException.ValidationException {
			Long purchaseId = buffer.getLong();
			int noteBytesLength = buffer.getShort();
			if (noteBytesLength > Constants.MAX_DIGITAL_GOODS_NOTE_LENGTH) {
				throw new NxtException.ValidationException("Invalid note length: " + noteBytesLength);
			}
			byte[] noteBytes = new byte[noteBytesLength];
			buffer.get(noteBytes);
			byte[] noteNonceBytes = new byte[32];
			buffer.get(noteNonceBytes);
			XoredData note = new XoredData(noteBytes, noteNonceBytes);
			transaction.setAttachment(new Attachment.DigitalGoodsFeedback(purchaseId, note));
		}

		void LoadAttachment(TransactionImpl transaction, JSONObject attachmentData) throws NxtException.ValidationException {
			Long purchaseId = (Long)attachmentData.get("purchase");
			XoredData note = new XoredData(Convert.parseHexString((String)attachmentData.get("note")),
					Convert.parseHexString((String)attachmentData.get("noteNonce")));

			transaction.setAttachment(new Attachment.DigitalGoodsFeedback(purchaseId, note));
		}

		void applyAttachment(Transaction transaction, Account senderAccount, Account recipientAccount) {
			// cfb: No action required
		}

		void undoAttachment(Transaction transaction, Account senderAccount, Account recipientAccount) throws UndoNotSupportedException {}

		void doValidateAttachment(Transaction transaction) throws NxtException.ValidationException {
			Attachment.DigitalGoodsFeedback attachment = (Attachment.DigitalGoodsFeedback)transaction.getAttachment();
			DigitalGoodsStore.Purchase purchase = DigitalGoodsStore.getPurchase(attachment.getPurchaseId());
			if (attachment.getNote().getData().length > Constants.MAX_DIGITAL_GOODS_NOTE_LENGTH
					|| attachment.getNote().getNonce().length != 32
					|| purchase == null
					|| ! transaction.getSenderId().equals(purchase.getBuyerId())) {
				throw new NxtException.ValidationException("Invalid digital goods feedback: " + attachment.getJSONObject());
			}
		}

	};

	public static final TransactionType REFUND = new DigitalGoods() {

		public final byte getSubtype() { return TransactionType.SUBTYPE_DIGITAL_GOODS_REFUND; }

		void LoadAttachment(TransactionImpl transaction, ByteBuffer buffer) throws NxtException.ValidationException {
			Long purchaseId = buffer.getLong();
			long refundNQT = buffer.getLong();
			int noteBytesLength = buffer.getShort();
			if (noteBytesLength > Constants.MAX_DIGITAL_GOODS_NOTE_LENGTH) {
				throw new NxtException.ValidationException("Invalid note length: " + noteBytesLength);
			}
			byte[] noteBytes = new byte[noteBytesLength];
			buffer.get(noteBytes);
			byte[] noteNonceBytes = new byte[32];
			buffer.get(noteNonceBytes);
			XoredData note = new XoredData(noteBytes, noteNonceBytes);
			transaction.setAttachment(new Attachment.DigitalGoodsRefund(purchaseId, refundNQT, note));
		}

		void LoadAttachment(TransactionImpl transaction, JSONObject attachmentData) throws NxtException.ValidationException {
			Long purchaseId = (Long)attachmentData.get("purchase");
			long refundNQT = (Long)attachmentData.get("refundNQT");
			XoredData note = new XoredData(Convert.parseHexString((String)attachmentData.get("note")),
					Convert.parseHexString((String)attachmentData.get("noteNonce")));

			transaction.setAttachment(new Attachment.DigitalGoodsRefund(purchaseId, refundNQT, note));
		}

		boolean applyAttachmentUnconfirmed(Transaction transaction, Account senderAccount) {
			Attachment.DigitalGoodsRefund attachment = (Attachment.DigitalGoodsRefund)transaction.getAttachment();
			if (senderAccount.getUnconfirmedBalanceNQT() >= attachment.getRefundNQT()) {
				senderAccount.addToUnconfirmedBalanceNQT(- attachment.getRefundNQT());
				return true;
			}
			return false;
		}

		void undoAttachmentUnconfirmed(Transaction transaction, Account senderAccount) {
			Attachment.DigitalGoodsRefund attachment = (Attachment.DigitalGoodsRefund)transaction.getAttachment();
			senderAccount.addToUnconfirmedBalanceNQT(attachment.getRefundNQT());
		}

		void applyAttachment(Transaction transaction, Account senderAccount, Account recipientAccount) {
			Attachment.DigitalGoodsRefund attachment = (Attachment.DigitalGoodsRefund)transaction.getAttachment();
			DigitalGoodsStore.refund(transaction.getSenderId(), attachment.getPurchaseId(),
					attachment.getRefundNQT());
		}

		void undoAttachment(Transaction transaction, Account senderAccount, Account recipientAccount) throws UndoNotSupportedException {
			Attachment.DigitalGoodsRefund attachment = (Attachment.DigitalGoodsRefund)transaction.getAttachment();
			DigitalGoodsStore.undoRefund(transaction.getSenderId(), attachment.getPurchaseId(), attachment.getRefundNQT());
		}

		void doValidateAttachment(Transaction transaction) throws NxtException.ValidationException {
			Attachment.DigitalGoodsRefund attachment = (Attachment.DigitalGoodsRefund)transaction.getAttachment();
			DigitalGoodsStore.Purchase purchase = DigitalGoodsStore.getPurchase(attachment.getPurchaseId());
			if (attachment.getRefundNQT() < 0 || attachment.getRefundNQT() > Constants.MAX_BALANCE_NQT
					|| attachment.getNote().getData().length > Constants.MAX_DIGITAL_GOODS_NOTE_LENGTH
					|| attachment.getNote().getNonce().length != 32
					|| purchase == null
					|| ! transaction.getSenderId().equals(purchase.getSellerId())) {
				throw new NxtException.ValidationException("Invalid digital goods refund: " + attachment.getJSONObject());
			}
		}

	};
	*/
}
