/*!
 * LibreMoney CreateColoredCoinsTrType 0.2
 * Copyright(c) 2014 LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var LmTrType = require(__dirname + '/../Transactions/TransactionType');


var ASSET_ISSUANCE;
var ASSET_TRANSFER;
var ASK_ORDER_PLACEMENT;
var BID_ORDER_PLACEMENT;
var ASK_ORDER_CANCELLATION;
var BID_ORDER_CANCELLATION;


function CreateColoredCoins() {
	var obj = LmTrType.CreateTransactionType();

	function GetType() {
		return Constants.TrTypeColoredCoins;
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

	function HasRecipient() {
		return false;
	}

	function ParseAttachment_Buf(buffer, transactionVersion) {
		//return new Attachment.ColoredCoinsAssetIssuance(buffer, transactionVersion);
	}

	function ParseAttachment_Json(attachmentData) {
		//return new Attachment.ColoredCoinsAssetIssuance(attachmentData);
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
		if (transaction.getFeeNQT() < Constants.ASSET_ISSUANCE_FEE_NQT
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

	obj.ApplyAttachment = ApplyAttachment;
	obj.ApplyAttachmentUnconfirmed = ApplyAttachmentUnconfirmed;
	obj.GetName = GetName;
	obj.GetSubtype = GetSubtype;
	obj.HasRecipient = HasRecipient;
	obj.ParseAttachment_Buf = ParseAttachment_Buf;
	obj.ParseAttachment_Json = ParseAttachment_Json;
	obj.UndoAttachment = UndoAttachment;
	obj.UndoAttachmentUnconfirmed = UndoAttachmentUnconfirmed;
	obj.ValidateAttachment = ValidateAttachment;
	return obj;
}

function CreateAssetTransfer() {
	var obj = CreateColoredCoins();

	function GetName() {
		return 'ColoredCoins.AssetTransfer';
	}

	function GetSubtype() {
		return LmTrType.SUBTYPE_COLORED_COINS_ASSET_TRANSFER;
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

	function HasRecipient() {
		return true;
	}

	function ParseAttachment_Buf(buffer, transactionVersion) {
		//return new Attachment.ColoredCoinsAssetTransfer(buffer, transactionVersion);
	}

	function ParseAttachment_Json(attachmentData) {
		//return new Attachment.ColoredCoinsAssetTransfer(attachmentData);
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
				|| attachment.getComment() != null && attachment.getComment().length() > Constants.MAX_ASSET_TRANSFER_COMMENT_LENGTH
				|| attachment.getAssetId() == null) {
			throw new NxtException.NotValidException("Invalid asset transfer amount or comment: " + attachment.getJSONObject());
		}
		if (transaction.getVersion() > 0 && attachment.getComment() != null) {
			throw new NxtException.NotValidException("Asset transfer comments no longer allowed, use message " +
					"or encrypted message appendix instead");
		}
		Asset asset = Asset.getAsset(attachment.getAssetId());
		if (attachment.getQuantityQNT() <= 0 || (asset != null && attachment.getQuantityQNT() > asset.getQuantityQNT())) {
			throw new NxtException.NotValidException("Invalid asset transfer asset or quantity: " + attachment.getJSONObject());
		}
		if (asset == null) {
			throw new NxtException.NotCurrentlyValidException("Asset " + Convert.toUnsignedLong(attachment.getAssetId()) +
					" does not exist yet");
		}
		*/
	}

	obj.ApplyAttachment = ApplyAttachment;
	obj.ApplyAttachmentUnconfirmed = ApplyAttachmentUnconfirmed;
	obj.GetName = GetName;
	obj.GetSubtype = GetSubtype;
	obj.HasRecipient = HasRecipient;
	obj.ParseAttachment_Buf = ParseAttachment_Buf;
	obj.ParseAttachment_Json = ParseAttachment_Json;
	obj.UndoAttachment = UndoAttachment;
	obj.UndoAttachmentUnconfirmed = UndoAttachmentUnconfirmed;
	obj.ValidateAttachment = ValidateAttachment;
	return obj;
}

function CreateColoredCoinsOrderPlacement() {
	var obj = CreateColoredCoins();

	function HasRecipient() {
		return false;
	}

	function ValidateAttachment(transaction) {
		/*
		Attachment.ColoredCoinsOrderPlacement attachment = (Attachment.ColoredCoinsOrderPlacement)transaction.getAttachment();
		if (attachment.getPriceNQT() <= 0 || attachment.getPriceNQT() > Constants.MAX_BALANCE_NQT
				|| attachment.getAssetId() == null) {
			throw new NxtException.NotValidException("Invalid asset order placement: " + attachment.getJSONObject());
		}
		Asset asset = Asset.getAsset(attachment.getAssetId());
		if (attachment.getQuantityQNT() <= 0 || (asset != null && attachment.getQuantityQNT() > asset.getQuantityQNT())) {
			throw new NxtException.NotValidException("Invalid asset order placement asset or quantity: " + attachment.getJSONObject());
		}
		if (asset == null) {
			throw new NxtException.NotCurrentlyValidException("Asset " + Convert.toUnsignedLong(attachment.getAssetId()) +
					" does not exist yet");
		}
		*/
	}

	obj.HasRecipient = HasRecipient;
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

	function ParseAttachment_Buf(buffer, transactionVersion) {
		//return new Attachment.ColoredCoinsAskOrderPlacement(buffer, transactionVersion);
	}

	function ParseAttachment_Json(attachmentData) {
		//return new Attachment.ColoredCoinsAskOrderPlacement(attachmentData);
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

	obj.ApplyAttachment = ApplyAttachment;
	obj.ApplyAttachmentUnconfirmed = ApplyAttachmentUnconfirmed;
	obj.GetName = GetName;
	obj.GetSubtype = GetSubtype;
	obj.ParseAttachment_Buf = ParseAttachment_Buf;
	obj.ParseAttachment_Json = ParseAttachment_Json;
	obj.UndoAttachment = UndoAttachment;
	obj.UndoAttachmentUnconfirmed = UndoAttachmentUnconfirmed;
	return obj;
}

function CreateBidOrderPlacement() {
	var obj = CreateColoredCoinsOrderPlacement();

	function GetName() {
		return 'ColoredCoins.BidOrderPlacement';
	}

	function GetSubtype() {
		return LmTrType.SUBTYPE_COLORED_COINS_BID_ORDER_PLACEMENT;
	}

	function ParseAttachment_Buf(buffer, transactionVersion) {
		//return new Attachment.ColoredCoinsBidOrderPlacement(buffer, transactionVersion);
	}

	function ParseAttachment_Json(attachmentData) {
		//return new Attachment.ColoredCoinsBidOrderPlacement(attachmentData);
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

	obj.ApplyAttachment = ApplyAttachment;
	obj.ApplyAttachmentUnconfirmed = ApplyAttachmentUnconfirmed;
	obj.GetName = GetName;
	obj.GetSubtype = GetSubtype;
	obj.ParseAttachment_Buf = ParseAttachment_Buf;
	obj.ParseAttachment_Json = ParseAttachment_Json;
	obj.UndoAttachment = UndoAttachment;
	obj.UndoAttachmentUnconfirmed = UndoAttachmentUnconfirmed;
	return obj;
}

function CreateColoredCoinsOrderCancellation() {
	var obj = CreateColoredCoins();

	function ValidateAttachment(Transaction) {
		/*
		Attachment.ColoredCoinsOrderCancellation attachment = (Attachment.ColoredCoinsOrderCancellation) transaction.getAttachment();
		if (attachment.getOrderId() == null) {
			throw new NxtException.NotValidException("Invalid order cancellation attachment: " + attachment.getJSONObject());
		}
		doValidateAttachment(transaction);
		*/
	}

	function DoValidateAttachment(Transaction) {}

	function ApplyAttachmentUnconfirmed(Transaction, SenderAccount) {
		return true;
	}

	function HasRecipient() {
		return false;
	}

	function UndoAttachment(Transaction, SenderAccount, RecipientAccount) {
		//throw new UndoNotSupportedException("Reversal of order cancellation not supported");
		return false;
	}

	function UndoAttachmentUnconfirmed(Transaction, SenderAccount) {}

	obj.ApplyAttachmentUnconfirmed = ApplyAttachmentUnconfirmed;
	obj.DoValidateAttachment = DoValidateAttachment;
	obj.HasRecipient = HasRecipient;
	obj.ValidateAttachment = ValidateAttachment;
	obj.UndoAttachment = UndoAttachment;
	obj.UndoAttachmentUnconfirmed = UndoAttachmentUnconfirmed;
	return obj;
}

function CreateAskOrderCancellation() {
	var obj = CreateColoredCoinsOrderCancellation();

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

	function GetName() {
		return 'ColoredCoins.AskOrderCancellation';
	}

	function GetSubtype() {
		return LmTrType.SUBTYPE_COLORED_COINS_ASK_ORDER_CANCELLATION;
	}

	function ParseAttachment(buffer, transactionVersion) {
		//return new Attachment.ColoredCoinsAskOrderCancellation(buffer, transactionVersion);
	}

	function ParseAttachment(attachmentData) {
		//return new Attachment.ColoredCoinsAskOrderCancellation(attachmentData);
	}

	obj.ApplyAttachment = ApplyAttachment;
	obj.DoValidateAttachment = DoValidateAttachment;
	obj.GetName = GetName;
	obj.GetSubtype = GetSubtype;
	obj.ParseAttachment_Buf = ParseAttachment_Buf;
	obj.ParseAttachment_Json = ParseAttachment_Json;
	return obj;
}

function CreateBidOrderCancellation() {
	var obj = CreateColoredCoinsOrderCancellation();

	function GetName() {
		return 'ColoredCoins.BidOrderCancellation';
	}

	function GetSubtype() {
		return LmTrType.SUBTYPE_COLORED_COINS_BID_ORDER_CANCELLATION;
	}

	function ParseAttachment(buffer, transactionVersion) {
		//return new Attachment.ColoredCoinsBidOrderCancellation(buffer, transactionVersion);
	}

	function ParseAttachment(attachmentData) {
		//return new Attachment.ColoredCoinsBidOrderCancellation(attachmentData);
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

	obj.ApplyAttachment = ApplyAttachment;
	obj.DoValidateAttachment = DoValidateAttachment;
	obj.GetName = GetName;
	obj.GetSubtype = GetSubtype;
	obj.ParseAttachment_Buf = ParseAttachment_Buf;
	obj.ParseAttachment_Json = ParseAttachment_Json;
	return obj;
}

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
