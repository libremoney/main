/*!
 * LibreMoney 0.0
 * Copyright(c) 2014 LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var LmTrType = require(__dirname + '/LmTransactionType');


var ASSET_ISSUANCE; // Выпуск актива
var ASSET_TRANSFER; // Передача актива
var ASK_ORDER_PLACEMENT; // Запрос размещения заказа
var BID_ORDER_PLACEMENT; // Ставка размещения заказа
var ASK_ORDER_CANCELLATION; // Запрос отмены заказа
var BID_ORDER_CANCELLATION; // Ставка отмены заказа


function CreateColoredCoins() {
	var obj = LmTrType.CreateTransactionType();

	function GetType() {
		return LmTrType.TYPE_COLORED_COINS;
	}

	obj.GetType = GetType;
	return obj;
}

function CreateAssetIssuance() {
	var obj = CreateColoredCoins();

	function GetName() {
		return 'ColoredCoins.AssetIssuance';
	}

	function GetSubtype() {
		return LmTrType.SUBTYPE_COLORED_COINS_ASSET_ISSUANCE;
	}

	function DoLoadAttachment_Buf(Transaction, Buffer) {
		/*
		int nameLength = buffer.get();
		if (nameLength > 3 * Constants.MaxAssetNameLength) {
			throw new NxtException.ValidationException("Max asset name length exceeded");
		}
		byte[] name = new byte[nameLength];
		buffer.get(name);
		int descriptionLength = buffer.getShort();
		if (descriptionLength > 3 * Constants.MaxAssetDescriptionLength) {
			throw new NxtException.ValidationException("Max asset description length exceeded");
		}
		byte[] description = new byte[descriptionLength];
		buffer.get(description);
		long quantityQNT = buffer.getLong();
		byte decimals = buffer.get();
		try {
			transaction.setAttachment(new Attachment.ColoredCoinsAssetIssuance(new String(name, "UTF-8").intern(),
					new String(description, "UTF-8").intern(), quantityQNT, decimals));
		} catch (UnsupportedEncodingException e) {
			throw new NxtException.ValidationException("Error in asset issuance", e);
		}
		*/
	}

	function DoLoadAttachment_Json(Transaction, AttachmentData) {
		/*
		String name = (String)attachmentData.get("name");
		String description = (String)attachmentData.get("description");
		long quantityQNT = (Long)attachmentData.get("quantityQNT");
		byte decimals = ((Long)attachmentData.get("decimals")).byteValue();
		transaction.setAttachment(new Attachment.ColoredCoinsAssetIssuance(name.trim(), description.trim(),
				quantityQNT, decimals));
		*/
	}

	function ApplyAttachmentUnconfirmed(Transaction, SenderAccount) {
		return true;
	}

	function ApplyAttachment(Transaction, SenderAccount, RecipientAccount) {
		/*
		Attachment.ColoredCoinsAssetIssuance attachment = (Attachment.ColoredCoinsAssetIssuance)transaction.getAttachment();
		Long assetId = transaction.getId();
		Asset.addAsset(assetId, transaction.getSenderId(), attachment.getName(), attachment.getDescription(),
				attachment.getQuantityQNT(), attachment.getDecimals());
		senderAccount.addToAssetAndUnconfirmedAssetBalanceQNT(assetId, attachment.getQuantityQNT());
		*/
	}

	function UndoAttachment(Transaction, SenderAccount, RecipientAccount) {
		/*
		Attachment.ColoredCoinsAssetIssuance attachment = (Attachment.ColoredCoinsAssetIssuance)transaction.getAttachment();
		Long assetId = transaction.getId();
		senderAccount.addToAssetAndUnconfirmedAssetBalanceQNT(assetId, -attachment.getQuantityQNT());
		Asset.removeAsset(assetId);
		*/
	}

	function UndoAttachmentUnconfirmed(Transaction, SenderAccount) {}

	function ValidateAttachment(Transaction) {
		/*
		Attachment.ColoredCoinsAssetIssuance attachment = (Attachment.ColoredCoinsAssetIssuance)transaction.getAttachment();
		if (! Genesis.CREATOR_ID.equals(transaction.getRecipientId()) || transaction.getAmountNQT() != 0
				|| transaction.getFeeNQT() < Constants.AssetIssuanceFeeMilliLm
				|| attachment.getName().length() < Constants.MinAssetNameLength
				|| attachment.getName().length() > Constants.MaxAssetNameLength
				|| attachment.getDescription().length() > Constants.MaxAssetDescriptionLength
				|| attachment.getDecimals() < 0 || attachment.getDecimals() > 8
				|| attachment.getQuantityQNT() <= 0
				|| attachment.getQuantityQNT() > Constants.MaxAssetQuantityQnt
				) {
			throw new NxtException.ValidationException("Invalid asset issuance: " + attachment.getJSONObject());
		}
		String normalizedName = attachment.getName().toLowerCase();
		for (int i = 0; i < normalizedName.length(); i++) {
			if (Constants.Alphabet.indexOf(normalizedName.charAt(i)) < 0) {
				throw new NxtException.ValidationException("Invalid asset name: " + normalizedName);
			}
		}
		*/
	}

	obj.GetName = GetName;
	obj.GetSubtype = GetSubtype;
	obj.DoLoadAttachment_Buf = DoLoadAttachment_Buf;
	obj.DoLoadAttachment_Json = DoLoadAttachment_Json;
	obj.ApplyAttachmentUnconfirmed = ApplyAttachmentUnconfirmed;
	obj.ApplyAttachment = ApplyAttachment;
	obj.UndoAttachment = UndoAttachment;
	obj.UndoAttachmentUnconfirmed = UndoAttachmentUnconfirmed;
	obj.ValidateAttachment = ValidateAttachment;
	return obj;
};

function CreateAssetTransfer() {
	var obj = CreateColoredCoins();

	function GetName() {
		return 'ColoredCoins.AssetTransfer';
	}

	function GetSubtype() {
		return LmTrType.SUBTYPE_COLORED_COINS_ASSET_TRANSFER;
	}

	function DoLoadAttachment_Buf(Transaction, Buffer) {
		/*
		Long assetId = Convert.zeroToNull(buffer.getLong());
		long quantityQNT = buffer.getLong();
		int commentLength = buffer.getShort();
		if (commentLength > 3 * Constants.MaxAssetTransferCommentLength) {
			throw new NxtException.ValidationException("Max asset comment length exceeded");
		}
		byte[] comment = new byte[commentLength];
		buffer.get(comment);
		try {
			transaction.setAttachment(new Attachment.ColoredCoinsAssetTransfer(assetId, quantityQNT,
					new String(comment, "UTF-8").intern()));
		} catch (UnsupportedEncodingException e) {
			throw new NxtException.ValidationException("Error in asset transfer", e);
		}
		*/
	}

	function DoLoadAttachment_Json(Transaction, AttachmentData) {
		/*
		Long assetId = Convert.parseUnsignedLong((String) attachmentData.get("asset"));
		long quantityQNT = (Long)attachmentData.get("quantityQNT");
		String comment = (String)attachmentData.get("comment");
		transaction.setAttachment(new Attachment.ColoredCoinsAssetTransfer(assetId, quantityQNT, comment));
		*/
	}

	function ApplyAttachmentUnconfirmed(Transaction, SenderAccount) {
		/*
		Attachment.ColoredCoinsAssetTransfer attachment = (Attachment.ColoredCoinsAssetTransfer)transaction.getAttachment();
		Long unconfirmedAssetBalance = senderAccount.getUnconfirmedAssetBalanceQNT(attachment.getAssetId());
		if (unconfirmedAssetBalance != null && unconfirmedAssetBalance >= attachment.getQuantityQNT()) {
			senderAccount.addToUnconfirmedAssetBalanceQNT(attachment.getAssetId(), -attachment.getQuantityQNT());
			return true;
		}
		return false;
		*/
	}

	function ApplyAttachment(Transaction, SenderAccount, RecipientAccount) {
		/*
		Attachment.ColoredCoinsAssetTransfer attachment = (Attachment.ColoredCoinsAssetTransfer)transaction.getAttachment();
		senderAccount.addToAssetBalanceQNT(attachment.getAssetId(), -attachment.getQuantityQNT());
		recipientAccount.addToAssetAndUnconfirmedAssetBalanceQNT(attachment.getAssetId(), attachment.getQuantityQNT());
		*/
	}

	function UndoAttachment(Transaction, SenderAccount, RecipientAccount) {
		/*
		Attachment.ColoredCoinsAssetTransfer attachment = (Attachment.ColoredCoinsAssetTransfer)transaction.getAttachment();
		senderAccount.addToAssetBalanceQNT(attachment.getAssetId(), attachment.getQuantityQNT());
		recipientAccount.addToAssetAndUnconfirmedAssetBalanceQNT(attachment.getAssetId(), -attachment.getQuantityQNT());
		*/
	}

	function UndoAttachmentUnconfirmed(Transaction, SenderAccount) {
		/*
		Attachment.ColoredCoinsAssetTransfer attachment = (Attachment.ColoredCoinsAssetTransfer)transaction.getAttachment();
		senderAccount.addToUnconfirmedAssetBalanceQNT(attachment.getAssetId(), attachment.getQuantityQNT());
		*/
	}

	function ValidateAttachment(Transaction) {
		/*
		Attachment.ColoredCoinsAssetTransfer attachment = (Attachment.ColoredCoinsAssetTransfer)transaction.getAttachment();
		if (transaction.getAmountNQT() != 0
				|| attachment.getComment().length() > Constants.MaxAssetTransferCommentLength
				|| attachment.getAssetId() == null) {
			throw new NxtException.ValidationException("Invalid asset transfer amount or comment: " + attachment.getJSONObject());
		}
		Asset asset = Asset.getAsset(attachment.getAssetId());
		if (asset == null || attachment.getQuantityQNT() <= 0 || attachment.getQuantityQNT() > asset.getQuantityQNT()) {
			throw new NxtException.ValidationException("Invalid asset transfer asset or quantity: " + attachment.getJSONObject());
		}
		*/
	}

	obj.GetName = GetName;
	obj.GetSubtype = GetSubtype;
	obj.DoLoadAttachment_Buf = DoLoadAttachment_Buf;
	obj.DoLoadAttachment_Json = DoLoadAttachment_Json;
	obj.ApplyAttachmentUnconfirmed = ApplyAttachmentUnconfirmed;
	obj.ApplyAttachment = ApplyAttachment;
	obj.UndoAttachment = UndoAttachment;
	obj.UndoAttachmentUnconfirmed = UndoAttachmentUnconfirmed;
	obj.ValidateAttachment = ValidateAttachment;
	return obj;
};

function CreateColoredCoinsOrderPlacement() {
	var obj = CreateColoredCoins();

	function MakeAttachment(Asset, QuantityMilliLm, PriceMilliLm) {}

	function DoLoadAttachment_Buf(Transaction, Buffer) {
		/*
		Long assetId = Convert.zeroToNull(buffer.getLong());
		long quantityQNT = buffer.getLong();
		long priceNQT = buffer.getLong();
		transaction.setAttachment(makeAttachment(assetId, quantityQNT, priceNQT));
		*/
	}

	function DoLoadAttachment_Json(Transaction, AttachmentData) {
		/*
		Long assetId = Convert.parseUnsignedLong((String) attachmentData.get("asset"));
		long quantityQNT = (Long)attachmentData.get("quantityQNT");
		long priceNQT = (Long)attachmentData.get("priceNQT");
		transaction.setAttachment(makeAttachment(assetId, quantityQNT, priceNQT));
		*/
	}

	function ValidateAttachment(Transaction) {
		/*
		Attachment.ColoredCoinsOrderPlacement attachment = (Attachment.ColoredCoinsOrderPlacement)transaction.getAttachment();
		if (! Genesis.CREATOR_ID.equals(transaction.getRecipientId()) || transaction.getAmountNQT() != 0
				|| attachment.getPriceNQT() <= 0 || attachment.getPriceNQT() > Constants.MaxBalanceMilliLm
				|| attachment.getAssetId() == null) {
			throw new NxtException.ValidationException("Invalid asset order placement: " + attachment.getJSONObject());
		}
		Asset asset = Asset.getAsset(attachment.getAssetId());
		if (asset == null || attachment.getQuantityQNT() <= 0 || attachment.getQuantityQNT() > asset.getQuantityQNT()) {
			throw new NxtException.ValidationException("Invalid asset order placement asset or quantity: " + attachment.getJSONObject());
		}
		*/
	}

	obj.MakeAttachment = MakeAttachment;
	obj.DoLoadAttachment_Buf = DoLoadAttachment_Buf;
	obj.DoLoadAttachment_Json = DoLoadAttachment_Json;
	obj.ValidateAttachment = ValidateAttachment;
	return obj;
}

function CreateAskOrderPlacement() {
	var obj = CreateColoredCoinsOrderPlacement();

	function GetName() {
		return 'ColoredCoins.AskOrderPlacement';
	}

	function GetSubtype() {
		return LmTrType.SUBTYPE_COLORED_COINS_ASK_ORDER_PLACEMENT;
	}

	function MakeAttachment(AssetId, QuantityMilliLm, PriceMilliLm) {
		/*
		return new Attachment.ColoredCoinsAskOrderPlacement(AssetId, QuantityMilliLm, PriceMilliLm);
		*/
	}

	function ApplyAttachmentUnconfirmed(Transaction, SenderAccount) {
		/*
		Attachment.ColoredCoinsAskOrderPlacement attachment = (Attachment.ColoredCoinsAskOrderPlacement)transaction.getAttachment();
		Long unconfirmedAssetBalance = senderAccount.getUnconfirmedAssetBalanceQNT(attachment.getAssetId());
		if (unconfirmedAssetBalance != null && unconfirmedAssetBalance >= attachment.getQuantityQNT()) {
			senderAccount.addToUnconfirmedAssetBalanceQNT(attachment.getAssetId(), -attachment.getQuantityQNT());
			return true;
		}
		return false;
		*/
	}

	function ApplyAttachment(Transaction, SenderAccount, RecipientAccount) {
		/*
		Attachment.ColoredCoinsAskOrderPlacement attachment = (Attachment.ColoredCoinsAskOrderPlacement)transaction.getAttachment();
		if (Asset.getAsset(attachment.getAssetId()) != null) {
			Order.Ask.addOrder(transaction.getId(), senderAccount, attachment.getAssetId(),
					attachment.getQuantityQNT(), attachment.getPriceNQT());
		}
		*/
	}

	function UndoAttachment(Transaction, SenderAccount, RecipientAccount) {
		/*
		Attachment.ColoredCoinsAskOrderPlacement attachment = (Attachment.ColoredCoinsAskOrderPlacement)transaction.getAttachment();
		Order.Ask askOrder = Order.Ask.removeOrder(transaction.getId());
		if (askOrder == null || askOrder.getQuantityQNT() != attachment.getQuantityQNT()
				|| ! askOrder.getAssetId().equals(attachment.getAssetId())) {
			//undoing of partially filled orders not supported yet
			throw new UndoNotSupportedException("Ask order already filled");
		}
		*/
	}

	function UndoAttachmentUnconfirmed(Transaction, SenderAccount) {
		/*
		Attachment.ColoredCoinsAskOrderPlacement attachment = (Attachment.ColoredCoinsAskOrderPlacement)transaction.getAttachment();
		senderAccount.addToUnconfirmedAssetBalanceQNT(attachment.getAssetId(), attachment.getQuantityQNT());
		*/
	}

	obj.GetName = GetName;
	obj.GetSubtype = GetSubtype;
	obj.MakeAttachment = MakeAttachment;
	obj.ApplyAttachmentUnconfirmed = ApplyAttachmentUnconfirmed;
	obj.ApplyAttachment = ApplyAttachment;
	obj.UndoAttachment = UndoAttachment;
	obj.UndoAttachmentUnconfirmed = UndoAttachmentUnconfirmed;
	return obj;
};

function CreateBidOrderPlacement() {
	var obj = CreateColoredCoinsOrderPlacement();

	function GetName() {
		return 'ColoredCoins.BidOrderPlacement';
	}

	function GetSubtype() {
		return LmTrType.SUBTYPE_COLORED_COINS_BID_ORDER_PLACEMENT;
	}

	function MakeAttachment(AssetId, QuantityMilliLm, PriceMilliLm) {
		/*
		return new Attachment.ColoredCoinsBidOrderPlacement(assetId, quantityQNT, priceNQT);
		*/
	}

	function ApplyAttachmentUnconfirmed(Transaction, SenderAccount) {
		/*
		Attachment.ColoredCoinsBidOrderPlacement attachment = (Attachment.ColoredCoinsBidOrderPlacement) transaction.getAttachment();
		if (senderAccount.getUnconfirmedBalanceNQT() >= Convert.safeMultiply(attachment.getQuantityQNT(), attachment.getPriceNQT())) {
			senderAccount.addToUnconfirmedBalanceNQT(- Convert.safeMultiply(attachment.getQuantityQNT(), attachment.getPriceNQT()));
			return true;
		}
		return false;
		*/
	}

	function ApplyAttachment(Transaction, SenderAccount, RecipientAccount) {
		/*
		Attachment.ColoredCoinsBidOrderPlacement attachment = (Attachment.ColoredCoinsBidOrderPlacement)transaction.getAttachment();
		if (Asset.getAsset(attachment.getAssetId()) != null) {
			Order.Bid.addOrder(transaction.getId(), senderAccount, attachment.getAssetId(),
					attachment.getQuantityQNT(), attachment.getPriceNQT());
		}
		*/
	}

	function UndoAttachment(Transaction, SenderAccount, RecipientAccount) {
		/*
		Attachment.ColoredCoinsBidOrderPlacement attachment = (Attachment.ColoredCoinsBidOrderPlacement)transaction.getAttachment();
		Order.Bid bidOrder = Order.Bid.removeOrder(transaction.getId());
		if (bidOrder == null || bidOrder.getQuantityQNT() != attachment.getQuantityQNT()
				|| ! bidOrder.getAssetId().equals(attachment.getAssetId())) {
			//undoing of partially filled orders not supported yet
			throw new UndoNotSupportedException("Bid order already filled");
		}
		*/
	}

	function UndoAttachmentUnconfirmed(Transaction, SenderAccount) {
		/*
		Attachment.ColoredCoinsBidOrderPlacement attachment = (Attachment.ColoredCoinsBidOrderPlacement) transaction.getAttachment();
		senderAccount.addToUnconfirmedBalanceNQT(Convert.safeMultiply(attachment.getQuantityQNT(), attachment.getPriceNQT()));
		*/
	}

	obj.GetName = GetName;
	obj.GetSubtype = GetSubtype;
	obj.MakeAttachment = MakeAttachment;
	obj.ApplyAttachmentUnconfirmed = ApplyAttachmentUnconfirmed;
	obj.ApplyAttachment = ApplyAttachment;
	obj.UndoAttachment = UndoAttachment;
	obj.UndoAttachmentUnconfirmed = UndoAttachmentUnconfirmed;
	return obj;
};

function CreateColoredCoinsOrderCancellation() {
	var obj = CreateColoredCoins();

	function ValidateAttachment(Transaction) {
		/*
		if (! Genesis.CREATOR_ID.equals(transaction.getRecipientId()) || transaction.getAmountNQT() != 0) {
			throw new NxtException.ValidationException("Invalid asset order cancellation amount or recipient");
		}
		Attachment.ColoredCoinsOrderCancellation attachment = (Attachment.ColoredCoinsOrderCancellation)transaction.getAttachment();
		if (attachment.getOrderId() == null) {
			throw new NxtException.ValidationException("Invalid order cancellation attachment: " + attachment.getJSONObject());
		}
		doValidateAttachment(transaction);
		*/
	}

	function DoValidateAttachment(Transaction) {}

	function ApplyAttachmentUnconfirmed(Transaction, SenderAccount) {
		return true;
	}

	function UndoAttachment(Transaction, SenderAccount, RecipientAccount) {
		//throw new UndoNotSupportedException("Reversal of order cancellation not supported");
		return false;
	}

	function UndoAttachmentUnconfirmed(Transaction, SenderAccount) {}

	obj.ValidateAttachment = ValidateAttachment;
	obj.DoValidateAttachment = DoValidateAttachment;
	obj.ApplyAttachmentUnconfirmed = ApplyAttachmentUnconfirmed;
	obj.UndoAttachment = UndoAttachment;
	obj.UndoAttachmentUnconfirmed = UndoAttachmentUnconfirmed;
	return obj;
}

function CreateAskOrderCancellation() {
	var obj = CreateColoredCoinsOrderCancellation();

	function GetName() {
		return 'ColoredCoins.AskOrderCancellation';
	}

	function GetSubtype() {
		return LmTrType.SUBTYPE_COLORED_COINS_ASK_ORDER_CANCELLATION;
	}

	function DoLoadAttachment_Buf(Transaction, Buffer) {
		/*
		Transaction.SetAttachment(new LmAttachment.ColoredCoinsAskOrderCancellation(Convert.zeroToNull(buffer.getLong())));
		*/
	}

	function DoLoadAttachment_Json(Transaction, AttachmentData) {
		/*
		Transaction.SetAttachment(new Attachment.ColoredCoinsAskOrderCancellation(Convert.parseUnsignedLong((String) attachmentData.get("order"))));
		*/
	}

	function ApplyAttachment(Transaction, SenderAccount, RecipientAccount) {
		/*
		Attachment.ColoredCoinsAskOrderCancellation attachment = (Attachment.ColoredCoinsAskOrderCancellation)transaction.getAttachment();
		Order order = Order.Ask.removeOrder(attachment.getOrderId());
		if (order != null) {
			senderAccount.addToUnconfirmedAssetBalanceQNT(order.getAssetId(), order.getQuantityQNT());
		}
		*/
	}

	function DoValidateAttachment(Transaction) {
		/*
		Attachment.ColoredCoinsAskOrderCancellation attachment = (Attachment.ColoredCoinsAskOrderCancellation)transaction.getAttachment();
		if (Order.Ask.getAskOrder(attachment.getOrderId()) == null) {
			throw new NxtException.ValidationException("Invalid ask order: " + Convert.toUnsignedLong(attachment.getOrderId()));
		}
		*/
	}

	obj.GetName = GetName;
	obj.GetSubtype = GetSubtype;
	obj.DoLoadAttachment_Buf = DoLoadAttachment_Buf;
	obj.DoLoadAttachment_Json = DoLoadAttachment_Json;
	obj.ApplyAttachment = ApplyAttachment;
	obj.DoValidateAttachment = DoValidateAttachment;
	return obj;
};

function CreateBidOrderCancellation() {
	var obj = CreateColoredCoinsOrderCancellation();

	function GetName() {
		return 'ColoredCoins.BidOrderCancellation';
	}

	function GetSubtype() {
		return LmTrType.SUBTYPE_COLORED_COINS_BID_ORDER_CANCELLATION;
	}

	function DoLoadAttachment_Buf(Transaction, Buffer) {
		Transaction.SetAttachment(new LmAttachment.ColoredCoinsBidOrderCancellation(Convert.zeroToNull(Buffer.getLong())));
	}

	function DoLoadAttachment_Json(Transaction, AttachmentData) {
		/*
		Transaction.SetAttachment(new LmAttachment.ColoredCoinsBidOrderCancellation(
				Convert.parseUnsignedLong((String) attachmentData.get("order"))));
		*/
	}

	function ApplyAttachment(Transaction, SenderAccount, RecipientAccount) {
		/*
		Attachment.ColoredCoinsBidOrderCancellation attachment = (Attachment.ColoredCoinsBidOrderCancellation)transaction.getAttachment();
		Order order = Order.Bid.removeOrder(attachment.getOrderId());
		if (order != null) {
			senderAccount.addToUnconfirmedBalanceNQT(Convert.safeMultiply(order.getQuantityQNT(), order.getPriceNQT()));
		}
		*/
	}

	function DoValidateAttachment(Transaction) {
		/*
		Attachment.ColoredCoinsBidOrderCancellation attachment = (Attachment.ColoredCoinsBidOrderCancellation)transaction.getAttachment();
		if (Order.Bid.getBidOrder(attachment.getOrderId()) == null) {
			throw new NxtException.ValidationException("Invalid bid order: " + Convert.toUnsignedLong(attachment.getOrderId()));
		}
		*/
	}

	obj.GetName = GetName;
	obj.GetSubtype = GetSubtype;
	obj.DoLoadAttachment_Buf = DoLoadAttachment_Buf;
	obj.DoLoadAttachment_Json = DoLoadAttachment_Json;
	obj.ApplyAttachment = ApplyAttachment;
	obj.DoValidateAttachment = DoValidateAttachment;
	return obj;
};

function GetAssetIssuance() {
	if (!ASSET_ISSUANCE)
		ASSET_ISSUANCE = CreateAssetIssuance();
	return ASSET_ISSUANCE;
}

function GetAssetTransfer() {
	if (!ASSET_TRANSFER)
		ASSET_TRANSFER = CreateAssetTransfer();
	return ASSET_TRANSFER;
}

function GetAskOrderPlacement() {
	if (!ASK_ORDER_PLACEMENT)
		ASK_ORDER_PLACEMENT = CreateAskOrderPlacement();
	return ASK_ORDER_PLACEMENT;
}

function GetBidOrderPlacement() {
	if (!BID_ORDER_PLACEMENT)
		BID_ORDER_PLACEMENT = CreateBidOrderPlacement();
	return BID_ORDER_PLACEMENT;
}

function GetAskOrderCancellation() {
	if (!ASK_ORDER_CANCELLATION)
		ASK_ORDER_CANCELLATION = CreateAskOrderCancellation();
	return ASK_ORDER_CANCELLATION;
}

function GetBidOrderCancellation() {
	if (!BID_ORDER_CANCELLATION)
		BID_ORDER_CANCELLATION = CreateBidOrderCancellation();
	return BID_ORDER_CANCELLATION;
}

function Init() {
	ASSET_ISSUANCE = CreateAssetIssuance();
	ASSET_TRANSFER = CreateAssetTransfer();
	ASK_ORDER_PLACEMENT = CreateAskOrderPlacement();
	BID_ORDER_PLACEMENT = CreateBidOrderPlacement();
	ASK_ORDER_CANCELLATION = CreateAskOrderCancellation();
	BID_ORDER_CANCELLATION = CreateBidOrderCancellation();
}

//Init();

/*
exports.ASSET_ISSUANCE = ASSET_ISSUANCE;
exports.ASSET_TRANSFER = ASSET_TRANSFER;
exports.ASK_ORDER_PLACEMENT = ASK_ORDER_PLACEMENT;
exports.BID_ORDER_PLACEMENT = BID_ORDER_PLACEMENT;
exports.ASK_ORDER_CANCELLATION = ASK_ORDER_CANCELLATION;
exports.BID_ORDER_CANCELLATION = BID_ORDER_CANCELLATION;
*/

exports.GetAssetIssuance = GetAssetIssuance;
exports.GetAssetTransfer = GetAssetTransfer;
exports.GetAskOrderPlacement = GetAskOrderPlacement;
exports.GetBidOrderPlacement = GetBidOrderPlacement;
exports.GetAskOrderCancellation = GetAskOrderCancellation;
exports.GetBidOrderCancellation = GetBidOrderCancellation;
exports.Init = Init;
