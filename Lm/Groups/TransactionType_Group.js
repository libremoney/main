
var LmTrType = require(__dirname + '/../Transactions/TransactionType');


var CommunityCreateTrType;


function CreateCommunityTrType() {
	var obj = LmTrType.CreateTransactionType();

	function GetType() {
		return LmTrType.TYPE_COMMUNITY;
	}

	obj.GetType = GetType;
	return obj;
}

function CreateCommunityCreateTrType() {
	var obj = CreateCommunityTrType();

	function GetName() {
		return 'Community.Create';
	}

	function GetSubtype() {
		return LmTrType.SUBTYPE_COMMUNITY_CREATE;
	}

	function DoLoadAttachment_Buf(Transaction, Buffer) {
		/*
		int nameLength = buffer.get();
		if (nameLength > 3 * Constants.MAX_ASSET_NAME_LENGTH) {
			throw new NxtException.ValidationException("Max asset name length exceeded");
		}
		byte[] name = new byte[nameLength];
		buffer.get(name);
		int descriptionLength = buffer.getShort();
		if (descriptionLength > 3 * Constants.MAX_ASSET_DESCRIPTION_LENGTH) {
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
				|| transaction.getFeeNQT() < Constants.ASSET_ISSUANCE_FEE_NQT
				|| attachment.getName().length() < Constants.MIN_ASSET_NAME_LENGTH
				|| attachment.getName().length() > Constants.MAX_ASSET_NAME_LENGTH
				|| attachment.getDescription().length() > Constants.MAX_ASSET_DESCRIPTION_LENGTH
				|| attachment.getDecimals() < 0 || attachment.getDecimals() > 8
				|| attachment.getQuantityQNT() <= 0
				|| attachment.getQuantityQNT() > Constants.MAX_ASSET_QUANTITY_QNT
				) {
			throw new NxtException.ValidationException("Invalid asset issuance: " + attachment.getJSONObject());
		}
		String normalizedName = attachment.getName().toLowerCase();
		for (int i = 0; i < normalizedName.length(); i++) {
			if (Constants.ALPHABET.indexOf(normalizedName.charAt(i)) < 0) {
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


function GetCommunityCreateTrType() {
	if (!CommunityCreateTrType)
		CommunityCreateTrType = CreateCommunityCreateTrType();
	return CommunityCreateTrType;
}


exports.GetCommunityCreate = GetCommunityCreateTrType;
