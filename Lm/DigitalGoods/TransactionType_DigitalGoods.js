function TransactionType_DigitalGoods() {
	/*
	private DigitalGoods() {
	}

	@Override
	public final byte getType() {
		return TransactionType.TYPE_DIGITAL_GOODS;
	}

	@Override
	boolean applyAttachmentUnconfirmed(Transaction transaction, Account senderAccount) {
		return true;
	}

	@Override
	void undoAttachmentUnconfirmed(Transaction transaction, Account senderAccount) {
	}

	@Override
	final void validateAttachment(Transaction transaction) throws NxtException.ValidationException {
		if (transaction.getAmountNQT() != 0) {
			throw new NxtException.NotValidException("Invalid digital goods transaction");
		}
		doValidateAttachment(transaction);
	}

	abstract void doValidateAttachment(Transaction transaction) throws NxtException.ValidationException;


	public static final TransactionType LISTING = new DigitalGoods() {

		@Override
		public final byte getSubtype() {
			return TransactionType.SUBTYPE_DIGITAL_GOODS_LISTING;
		}

		@Override
		Attachment.DigitalGoodsListing parseAttachment(ByteBuffer buffer, byte transactionVersion) throws NxtException.NotValidException {
			return new Attachment.DigitalGoodsListing(buffer, transactionVersion);
		}

		@Override
		Attachment.DigitalGoodsListing parseAttachment(JSONObject attachmentData) throws NxtException.NotValidException {
			return new Attachment.DigitalGoodsListing(attachmentData);
		}

		@Override
		void applyAttachment(Transaction transaction, Account senderAccount, Account recipientAccount) {
			Attachment.DigitalGoodsListing attachment = (Attachment.DigitalGoodsListing) transaction.getAttachment();
			DigitalGoodsStore.listGoods(transaction.getId(), transaction.getSenderId(), attachment.getName(), attachment.getDescription(),
					attachment.getTags(), attachment.getQuantity(), attachment.getPriceNQT());
		}

		@Override
		void undoAttachment(Transaction transaction, Account senderAccount, Account recipientAccount) throws UndoNotSupportedException {
			DigitalGoodsStore.undoListGoods(transaction.getId());
		}

		@Override
		void doValidateAttachment(Transaction transaction) throws NxtException.ValidationException {
			Attachment.DigitalGoodsListing attachment = (Attachment.DigitalGoodsListing) transaction.getAttachment();
			if (attachment.getName().length() == 0
					|| attachment.getName().length() > Constants.MAX_DGS_LISTING_NAME_LENGTH
					|| attachment.getDescription().length() > Constants.MAX_DGS_LISTING_DESCRIPTION_LENGTH
					|| attachment.getTags().length() > Constants.MAX_DGS_LISTING_TAGS_LENGTH
					|| attachment.getQuantity() < 0 || attachment.getQuantity() > Constants.MAX_DGS_LISTING_QUANTITY
					|| attachment.getPriceNQT() <= 0 || attachment.getPriceNQT() > Constants.MAX_BALANCE_NQT) {
				throw new NxtException.NotValidException("Invalid digital goods listing: " + attachment.getJSONObject());
			}
		}

		@Override
		public boolean hasRecipient() {
			return false;
		}

	};

	public static final TransactionType DELISTING = new DigitalGoods() {

		@Override
		public final byte getSubtype() {
			return TransactionType.SUBTYPE_DIGITAL_GOODS_DELISTING;
		}

		@Override
		Attachment.DigitalGoodsDelisting parseAttachment(ByteBuffer buffer, byte transactionVersion) throws NxtException.NotValidException {
			return new Attachment.DigitalGoodsDelisting(buffer, transactionVersion);
		}

		@Override
		Attachment.DigitalGoodsDelisting parseAttachment(JSONObject attachmentData) throws NxtException.NotValidException {
			return new Attachment.DigitalGoodsDelisting(attachmentData);
		}

		@Override
		void applyAttachment(Transaction transaction, Account senderAccount, Account recipientAccount) {
			Attachment.DigitalGoodsDelisting attachment = (Attachment.DigitalGoodsDelisting) transaction.getAttachment();
			DigitalGoodsStore.delistGoods(attachment.getGoodsId());
		}

		@Override
		void undoAttachment(Transaction transaction, Account senderAccount, Account recipientAccount) throws UndoNotSupportedException {
			DigitalGoodsStore.undoDelistGoods(transaction.getId());
		}

		@Override
		void doValidateAttachment(Transaction transaction) throws NxtException.ValidationException {
			Attachment.DigitalGoodsDelisting attachment = (Attachment.DigitalGoodsDelisting) transaction.getAttachment();
			DigitalGoodsStore.Goods goods = DigitalGoodsStore.getGoods(attachment.getGoodsId());
			if (goods != null && ! transaction.getSenderId().equals(goods.getSellerId())) {
				throw new NxtException.NotValidException("Invalid digital goods delisting - seller is different: " + attachment.getJSONObject());
			}
			if (goods == null || goods.isDelisted()) {
				throw new NxtException.NotCurrentlyValidException("Goods " + Convert.toUnsignedLong(attachment.getGoodsId()) +
						"not yet listed or already delisted");
			}
		}

		@Override
		boolean isDuplicate(Transaction transaction, Map<TransactionType, Set<String>> duplicates) {
			Attachment.DigitalGoodsDelisting attachment = (Attachment.DigitalGoodsDelisting) transaction.getAttachment();
			return isDuplicate(DigitalGoods.DELISTING, Convert.toUnsignedLong(attachment.getGoodsId()), duplicates);
		}

		@Override
		public boolean hasRecipient() {
			return false;
		}

	};

	public static final TransactionType PRICE_CHANGE = new DigitalGoods() {

		@Override
		public final byte getSubtype() {
			return TransactionType.SUBTYPE_DIGITAL_GOODS_PRICE_CHANGE;
		}

		@Override
		Attachment.DigitalGoodsPriceChange parseAttachment(ByteBuffer buffer, byte transactionVersion) throws NxtException.NotValidException {
			return new Attachment.DigitalGoodsPriceChange(buffer, transactionVersion);
		}

		@Override
		Attachment.DigitalGoodsPriceChange parseAttachment(JSONObject attachmentData) throws NxtException.NotValidException {
			return new Attachment.DigitalGoodsPriceChange(attachmentData);
		}

		@Override
		void applyAttachment(Transaction transaction, Account senderAccount, Account recipientAccount) {
			Attachment.DigitalGoodsPriceChange attachment = (Attachment.DigitalGoodsPriceChange) transaction.getAttachment();
			DigitalGoodsStore.changePrice(attachment.getGoodsId(), attachment.getPriceNQT());
		}

		@Override
		void undoAttachment(Transaction transaction, Account senderAccount, Account recipientAccount) throws UndoNotSupportedException {
			throw new UndoNotSupportedException("Reversal of digital goods price change not supported");
		}

		@Override
		void doValidateAttachment(Transaction transaction) throws NxtException.ValidationException {
			Attachment.DigitalGoodsPriceChange attachment = (Attachment.DigitalGoodsPriceChange) transaction.getAttachment();
			DigitalGoodsStore.Goods goods = DigitalGoodsStore.getGoods(attachment.getGoodsId());
			if (attachment.getPriceNQT() <= 0 || attachment.getPriceNQT() > Constants.MAX_BALANCE_NQT
					|| (goods != null && ! transaction.getSenderId().equals(goods.getSellerId()))) {
				throw new NxtException.NotValidException("Invalid digital goods price change: " + attachment.getJSONObject());
			}
			if (goods == null || goods.isDelisted()) {
				throw new NxtException.NotCurrentlyValidException("Goods " + Convert.toUnsignedLong(attachment.getGoodsId()) +
						"not yet listed or already delisted");
			}
		}

		@Override
		boolean isDuplicate(Transaction transaction, Map<TransactionType, Set<String>> duplicates) {
			Attachment.DigitalGoodsPriceChange attachment = (Attachment.DigitalGoodsPriceChange) transaction.getAttachment();
			// not a bug, uniqueness is based on DigitalGoods.DELISTING
			return isDuplicate(DigitalGoods.DELISTING, Convert.toUnsignedLong(attachment.getGoodsId()), duplicates);
		}

		@Override
		public boolean hasRecipient() {
			return false;
		}

	};

	public static final TransactionType QUANTITY_CHANGE = new DigitalGoods() {

		@Override
		public final byte getSubtype() {
			return TransactionType.SUBTYPE_DIGITAL_GOODS_QUANTITY_CHANGE;
		}

		@Override
		Attachment.DigitalGoodsQuantityChange parseAttachment(ByteBuffer buffer, byte transactionVersion) throws NxtException.NotValidException {
			return new Attachment.DigitalGoodsQuantityChange(buffer, transactionVersion);
		}

		@Override
		Attachment.DigitalGoodsQuantityChange parseAttachment(JSONObject attachmentData) throws NxtException.NotValidException {
			return new Attachment.DigitalGoodsQuantityChange(attachmentData);
		}

		@Override
		void applyAttachment(Transaction transaction, Account senderAccount, Account recipientAccount) {
			Attachment.DigitalGoodsQuantityChange attachment = (Attachment.DigitalGoodsQuantityChange) transaction.getAttachment();
			DigitalGoodsStore.changeQuantity(attachment.getGoodsId(), attachment.getDeltaQuantity());
		}

		@Override
		void undoAttachment(Transaction transaction, Account senderAccount, Account recipientAccount) throws UndoNotSupportedException {
			throw new UndoNotSupportedException("Reversal of digital goods quantity change not supported");
		}

		@Override
		void doValidateAttachment(Transaction transaction) throws NxtException.ValidationException {
			Attachment.DigitalGoodsQuantityChange attachment = (Attachment.DigitalGoodsQuantityChange) transaction.getAttachment();
			DigitalGoodsStore.Goods goods = DigitalGoodsStore.getGoods(attachment.getGoodsId());
			if (attachment.getDeltaQuantity() < -Constants.MAX_DGS_LISTING_QUANTITY
					|| attachment.getDeltaQuantity() > Constants.MAX_DGS_LISTING_QUANTITY
					|| (goods != null && ! transaction.getSenderId().equals(goods.getSellerId()))) {
				throw new NxtException.NotValidException("Invalid digital goods quantity change: " + attachment.getJSONObject());
			}
			if (goods == null || goods.isDelisted()) {
				throw new NxtException.NotCurrentlyValidException("Goods " + Convert.toUnsignedLong(attachment.getGoodsId()) +
						"not yet listed or already delisted");
			}
		}

		@Override
		boolean isDuplicate(Transaction transaction, Map<TransactionType, Set<String>> duplicates) {
			Attachment.DigitalGoodsQuantityChange attachment = (Attachment.DigitalGoodsQuantityChange) transaction.getAttachment();
			// not a bug, uniqueness is based on DigitalGoods.DELISTING
			return isDuplicate(DigitalGoods.DELISTING, Convert.toUnsignedLong(attachment.getGoodsId()), duplicates);
		}

		@Override
		public boolean hasRecipient() {
			return false;
		}

	};

	public static final TransactionType PURCHASE = new DigitalGoods() {

		@Override
		public final byte getSubtype() {
			return TransactionType.SUBTYPE_DIGITAL_GOODS_PURCHASE;
		}

		@Override
		Attachment.DigitalGoodsPurchase parseAttachment(ByteBuffer buffer, byte transactionVersion) throws NxtException.NotValidException {
			return new Attachment.DigitalGoodsPurchase(buffer, transactionVersion);
		}

		@Override
		Attachment.DigitalGoodsPurchase parseAttachment(JSONObject attachmentData) throws NxtException.NotValidException {
			return new Attachment.DigitalGoodsPurchase(attachmentData);
		}

		@Override
		boolean applyAttachmentUnconfirmed(Transaction transaction, Account senderAccount) {
			Attachment.DigitalGoodsPurchase attachment = (Attachment.DigitalGoodsPurchase) transaction.getAttachment();
			if (senderAccount.getUnconfirmedBalanceNQT() >= Convert.safeMultiply(attachment.getQuantity(), attachment.getPriceNQT())) {
				senderAccount.addToUnconfirmedBalanceNQT(-Convert.safeMultiply(attachment.getQuantity(), attachment.getPriceNQT()));
				return true;
			}
			return false;
		}

		@Override
		void undoAttachmentUnconfirmed(Transaction transaction, Account senderAccount) {
			Attachment.DigitalGoodsPurchase attachment = (Attachment.DigitalGoodsPurchase) transaction.getAttachment();
			senderAccount.addToUnconfirmedBalanceNQT(Convert.safeMultiply(attachment.getQuantity(), attachment.getPriceNQT()));
		}

		@Override
		void applyAttachment(Transaction transaction, Account senderAccount, Account recipientAccount) {
			Attachment.DigitalGoodsPurchase attachment = (Attachment.DigitalGoodsPurchase) transaction.getAttachment();
			DigitalGoodsStore.purchase(transaction.getId(), transaction.getSenderId(), attachment.getGoodsId(),
					attachment.getQuantity(), attachment.getPriceNQT(), attachment.getDeliveryDeadlineTimestamp(),
					transaction.getEncryptedMessage(), transaction.getTimestamp());
		}

		@Override
		void undoAttachment(Transaction transaction, Account senderAccount, Account recipientAccount) throws UndoNotSupportedException {
			Attachment.DigitalGoodsPurchase attachment = (Attachment.DigitalGoodsPurchase) transaction.getAttachment();
			DigitalGoodsStore.undoPurchase(transaction.getId(), transaction.getSenderId(),
					attachment.getQuantity(), attachment.getPriceNQT());
		}

		@Override
		void doValidateAttachment(Transaction transaction) throws NxtException.ValidationException {
			Attachment.DigitalGoodsPurchase attachment = (Attachment.DigitalGoodsPurchase) transaction.getAttachment();
			DigitalGoodsStore.Goods goods = DigitalGoodsStore.getGoods(attachment.getGoodsId());
			if (attachment.getQuantity() <= 0 || attachment.getQuantity() > Constants.MAX_DGS_LISTING_QUANTITY
					|| attachment.getPriceNQT() <= 0 || attachment.getPriceNQT() > Constants.MAX_BALANCE_NQT
					|| (goods != null && ! goods.getSellerId().equals(transaction.getRecipientId()))) {
				throw new NxtException.NotValidException("Invalid digital goods purchase: " + attachment.getJSONObject());
			}
			if (transaction.getEncryptedMessage() != null && ! transaction.getEncryptedMessage().isText()) {
				throw new NxtException.NotValidException("Only text encrypted messages allowed");
			}
			if (goods == null || goods.isDelisted()) {
				throw new NxtException.NotCurrentlyValidException("Goods " + Convert.toUnsignedLong(attachment.getGoodsId()) +
						"not yet listed or already delisted");
			}
			if (attachment.getQuantity() > goods.getQuantity() || attachment.getPriceNQT() != goods.getPriceNQT()) {
				throw new NxtException.NotCurrentlyValidException("Goods price or quantity changed: " + attachment.getJSONObject());
			}
			if (attachment.getDeliveryDeadlineTimestamp() <= Nxt.getBlockchain().getLastBlock().getTimestamp()) {
				throw new NxtException.NotCurrentlyValidException("Delivery deadline has already expired: " + attachment.getDeliveryDeadlineTimestamp());
			}
		}

		@Override
		public boolean hasRecipient() {
			return true;
		}

	};

	public static final TransactionType DELIVERY = new DigitalGoods() {

		@Override
		public final byte getSubtype() {
			return TransactionType.SUBTYPE_DIGITAL_GOODS_DELIVERY;
		}

		@Override
		Attachment.DigitalGoodsDelivery parseAttachment(ByteBuffer buffer, byte transactionVersion) throws NxtException.NotValidException {
			return new Attachment.DigitalGoodsDelivery(buffer, transactionVersion);
		}

		@Override
		Attachment.DigitalGoodsDelivery parseAttachment(JSONObject attachmentData) throws NxtException.NotValidException {
			return new Attachment.DigitalGoodsDelivery(attachmentData);
		}

		@Override
		void applyAttachment(Transaction transaction, Account senderAccount, Account recipientAccount) {
			Attachment.DigitalGoodsDelivery attachment = (Attachment.DigitalGoodsDelivery)transaction.getAttachment();
			DigitalGoodsStore.deliver(transaction.getSenderId(), attachment.getPurchaseId(),
					attachment.getDiscountNQT(), attachment.getGoods(), attachment.goodsIsText());
		}

		@Override
		void undoAttachment(Transaction transaction, Account senderAccount, Account recipientAccount) throws UndoNotSupportedException {
			Attachment.DigitalGoodsDelivery attachment = (Attachment.DigitalGoodsDelivery) transaction.getAttachment();
			DigitalGoodsStore.undoDeliver(transaction.getSenderId(), attachment.getPurchaseId(), attachment.getDiscountNQT());
		}

		@Override
		void doValidateAttachment(Transaction transaction) throws NxtException.ValidationException {
			Attachment.DigitalGoodsDelivery attachment = (Attachment.DigitalGoodsDelivery) transaction.getAttachment();
			DigitalGoodsStore.Purchase purchase = DigitalGoodsStore.getPendingPurchase(attachment.getPurchaseId());
			if (attachment.getGoods().getData().length > Constants.MAX_DGS_GOODS_LENGTH
					|| attachment.getGoods().getData().length == 0
					|| attachment.getGoods().getNonce().length != 32
					|| attachment.getDiscountNQT() < 0 || attachment.getDiscountNQT() > Constants.MAX_BALANCE_NQT
					|| (purchase != null &&
					(! purchase.getBuyerId().equals(transaction.getRecipientId())
							|| ! transaction.getSenderId().equals(purchase.getSellerId())
							|| attachment.getDiscountNQT() > Convert.safeMultiply(purchase.getPriceNQT(), purchase.getQuantity())))) {
				throw new NxtException.NotValidException("Invalid digital goods delivery: " + attachment.getJSONObject());
			}
			if (purchase == null || purchase.getEncryptedGoods() != null) {
				throw new NxtException.NotCurrentlyValidException("Purchase does not exist yet, or already delivered: "
						+ attachment.getJSONObject());
			}
		}

		@Override
		boolean isDuplicate(Transaction transaction, Map<TransactionType, Set<String>> duplicates) {
			Attachment.DigitalGoodsDelivery attachment = (Attachment.DigitalGoodsDelivery) transaction.getAttachment();
			return isDuplicate(DigitalGoods.DELIVERY, Convert.toUnsignedLong(attachment.getPurchaseId()), duplicates);
		}

		@Override
		public boolean hasRecipient() {
			return true;
		}

	};

	public static final TransactionType FEEDBACK = new DigitalGoods() {

		@Override
		public final byte getSubtype() {
			return TransactionType.SUBTYPE_DIGITAL_GOODS_FEEDBACK;
		}

		@Override
		Attachment.DigitalGoodsFeedback parseAttachment(ByteBuffer buffer, byte transactionVersion) throws NxtException.NotValidException {
			return new Attachment.DigitalGoodsFeedback(buffer, transactionVersion);
		}

		@Override
		Attachment.DigitalGoodsFeedback parseAttachment(JSONObject attachmentData) throws NxtException.NotValidException {
			return new Attachment.DigitalGoodsFeedback(attachmentData);
		}

		@Override
		void applyAttachment(Transaction transaction, Account senderAccount, Account recipientAccount) {
			Attachment.DigitalGoodsFeedback attachment = (Attachment.DigitalGoodsFeedback)transaction.getAttachment();
			DigitalGoodsStore.feedback(attachment.getPurchaseId(), transaction.getEncryptedMessage(), transaction.getMessage());
		}

		@Override
		void undoAttachment(Transaction transaction, Account senderAccount, Account recipientAccount)
				throws UndoNotSupportedException {
			Attachment.DigitalGoodsFeedback attachment = (Attachment.DigitalGoodsFeedback)transaction.getAttachment();
			DigitalGoodsStore.undoFeedback(attachment.getPurchaseId(), transaction.getEncryptedMessage(), transaction.getMessage());
		}

		@Override
		void doValidateAttachment(Transaction transaction) throws NxtException.ValidationException {
			Attachment.DigitalGoodsFeedback attachment = (Attachment.DigitalGoodsFeedback) transaction.getAttachment();
			DigitalGoodsStore.Purchase purchase = DigitalGoodsStore.getPurchase(attachment.getPurchaseId());
			if (purchase != null &&
					(! purchase.getSellerId().equals(transaction.getRecipientId())
							|| ! transaction.getSenderId().equals(purchase.getBuyerId()))) {
				throw new NxtException.NotValidException("Invalid digital goods feedback: " + attachment.getJSONObject());
			}
			if (transaction.getEncryptedMessage() == null && transaction.getMessage() == null) {
				throw new NxtException.NotValidException("Missing feedback message");
			}
			if (transaction.getEncryptedMessage() != null && ! transaction.getEncryptedMessage().isText()) {
				throw new NxtException.NotValidException("Only text encrypted messages allowed");
			}
			if (transaction.getMessage() != null && ! transaction.getMessage().isText()) {
				throw new NxtException.NotValidException("Only text public messages allowed");
			}
			if (purchase == null || purchase.getEncryptedGoods() == null) {
				throw new NxtException.NotCurrentlyValidException("Purchase does not exist yet or not yet delivered");
			}
		}

		@Override
		boolean isDuplicate(Transaction transaction, Map<TransactionType, Set<String>> duplicates) {
			Attachment.DigitalGoodsFeedback attachment = (Attachment.DigitalGoodsFeedback) transaction.getAttachment();
			return isDuplicate(DigitalGoods.FEEDBACK, Convert.toUnsignedLong(attachment.getPurchaseId()), duplicates);
		}

		@Override
		public boolean hasRecipient() {
			return true;
		}

	};

	public static final TransactionType REFUND = new DigitalGoods() {

		@Override
		public final byte getSubtype() {
			return TransactionType.SUBTYPE_DIGITAL_GOODS_REFUND;
		}

		@Override
		Attachment.DigitalGoodsRefund parseAttachment(ByteBuffer buffer, byte transactionVersion) throws NxtException.NotValidException {
			return new Attachment.DigitalGoodsRefund(buffer, transactionVersion);
		}

		@Override
		Attachment.DigitalGoodsRefund parseAttachment(JSONObject attachmentData) throws NxtException.NotValidException {
			return new Attachment.DigitalGoodsRefund(attachmentData);
		}

		@Override
		boolean applyAttachmentUnconfirmed(Transaction transaction, Account senderAccount) {
			Attachment.DigitalGoodsRefund attachment = (Attachment.DigitalGoodsRefund) transaction.getAttachment();
			if (senderAccount.getUnconfirmedBalanceNQT() >= attachment.getRefundNQT()) {
				senderAccount.addToUnconfirmedBalanceNQT(-attachment.getRefundNQT());
				return true;
			}
			return false;
		}

		@Override
		void undoAttachmentUnconfirmed(Transaction transaction, Account senderAccount) {
			Attachment.DigitalGoodsRefund attachment = (Attachment.DigitalGoodsRefund) transaction.getAttachment();
			senderAccount.addToUnconfirmedBalanceNQT(attachment.getRefundNQT());
		}

		@Override
		void applyAttachment(Transaction transaction, Account senderAccount, Account recipientAccount) {
			Attachment.DigitalGoodsRefund attachment = (Attachment.DigitalGoodsRefund) transaction.getAttachment();
			DigitalGoodsStore.refund(transaction.getSenderId(), attachment.getPurchaseId(),
					attachment.getRefundNQT(), transaction.getEncryptedMessage());
		}

		@Override
		void undoAttachment(Transaction transaction, Account senderAccount, Account recipientAccount) throws UndoNotSupportedException {
			Attachment.DigitalGoodsRefund attachment = (Attachment.DigitalGoodsRefund) transaction.getAttachment();
			DigitalGoodsStore.undoRefund(transaction.getSenderId(), attachment.getPurchaseId(), attachment.getRefundNQT());
		}

		@Override
		void doValidateAttachment(Transaction transaction) throws NxtException.ValidationException {
			Attachment.DigitalGoodsRefund attachment = (Attachment.DigitalGoodsRefund) transaction.getAttachment();
			DigitalGoodsStore.Purchase purchase = DigitalGoodsStore.getPurchase(attachment.getPurchaseId());
			if (attachment.getRefundNQT() < 0 || attachment.getRefundNQT() > Constants.MAX_BALANCE_NQT
					|| (purchase != null &&
					(! purchase.getBuyerId().equals(transaction.getRecipientId())
							|| ! transaction.getSenderId().equals(purchase.getSellerId())))) {
				throw new NxtException.NotValidException("Invalid digital goods refund: " + attachment.getJSONObject());
			}
			if (transaction.getEncryptedMessage() != null && ! transaction.getEncryptedMessage().isText()) {
				throw new NxtException.NotValidException("Only text encrypted messages allowed");
			}
			if (purchase == null || purchase.getEncryptedGoods() == null || purchase.getRefundNQT() != 0) {
				throw new NxtException.NotCurrentlyValidException("Purchase does not exist or is not delivered or is already refunded");
			}
		}

		@Override
		boolean isDuplicate(Transaction transaction, Map<TransactionType, Set<String>> duplicates) {
			Attachment.DigitalGoodsRefund attachment = (Attachment.DigitalGoodsRefund) transaction.getAttachment();
			return isDuplicate(DigitalGoods.REFUND, Convert.toUnsignedLong(attachment.getPurchaseId()), duplicates);
		}

		@Override
		public boolean hasRecipient() {
			return true;
		}

	};
	*/
}
