
var LmTrType = require(__dirname + '/../Transactions/TransactionType');


var GroupCreateTrType;


function CreateGroupTrType() {
	var obj = LmTrType.CreateTransactionType();

	function GetType() {
		return LmTrType.TYPE_Group;
	}

	obj.GetType = GetType;
	return obj;
}

function CreateGroupCreateTrType() {
	var obj = CreateGroupTrType();

	function GetName() {
		return 'Group.Create';
	}

	function GetSubtype() {
		return LmTrType.SUBTYPE_GROUP_CREATE;
	}

	function DoLoadAttachment_Buf(Transaction, Buffer) {
		/*
		int nameLength = buffer.get();
		if (nameLength > 3 * Constants.MaxGroupNameLength) {
			throw new NxtException.ValidationException("Max group name length exceeded");
		}
		byte[] name = new byte[nameLength];
		buffer.get(name);
		int descriptionLength = buffer.getShort();
		if (descriptionLength > 3 * Constants.MaxGroupDescriptionLength) {
			throw new NxtException.ValidationException("Max group description length exceeded");
		}
		byte[] description = new byte[descriptionLength];
		buffer.get(description);
		long quantityQNT = buffer.getLong();
		byte decimals = buffer.get();
		try {
			transaction.setAttachment(new Attachment.ColoredCoinsAssetIssuance(new String(name, "UTF-8").intern(),
					new String(description, "UTF-8").intern(), quantityQNT, decimals));
		} catch (UnsupportedEncodingException e) {
			throw new NxtException.ValidationException("Error in group issuance", e);
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
			throw new NxtException.ValidationException("Invalid group issuance: " + attachment.getJSONObject());
		}
		String normalizedName = attachment.getName().toLowerCase();
		for (int i = 0; i < normalizedName.length(); i++) {
			if (Constants.Alphabet.indexOf(normalizedName.charAt(i)) < 0) {
				throw new NxtException.ValidationException("Invalid group name: " + normalizedName);
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


function GetGroupCreateTrType() {
	if (!GroupCreateTrType)
		GroupCreateTrType = CreateGroupCreateTrType();
	return GroupCreateTrType;
}


exports.GetGroupCreate = GetGroupCreateTrType;
