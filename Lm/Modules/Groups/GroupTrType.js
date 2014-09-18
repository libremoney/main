/*!
 * LibreMoney 0.1
 * Copyright(c) 2014 LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var Constants = require(__dirname + '/../../Constants');
var Transactions = require(__dirname + '/../../Core/Transactions');


var groupCreateTrType;


function GroupTrType() {
	this.prototype = Transactions.CreateTransactionType();
	return this;
}

function GroupTrType_GetType() {
	return Constants.TYPE_Group;
}

GroupTrType.prototype.GetType = GroupTrType_GetType;


function GroupCreateTrType() {
	this.prototype = new GroupTrType();
	return this;
}

function GroupCreateTrType_GetName() {
	return 'Group.Create';
}

function GroupCreateTrType_GetSubtype() {
	return Constants.SUBTYPE_GROUP_CREATE;
}

function GroupCreateTrType_DoLoadAttachment_Buf(Transaction, Buffer) {
	throw new Error('Not implementted');
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

function GroupCreateTrType_DoLoadAttachment_Json(Transaction, AttachmentData) {
	throw new Error('Not implementted');
	/*
	String name = (String)attachmentData.get("name");
	String description = (String)attachmentData.get("description");
	long quantityQNT = (Long)attachmentData.get("quantityQNT");
	byte decimals = ((Long)attachmentData.get("decimals")).byteValue();
	transaction.setAttachment(new Attachment.ColoredCoinsAssetIssuance(name.trim(), description.trim(),
			quantityQNT, decimals));
	*/
}

function GroupCreateTrType_ApplyAttachmentUnconfirmed(Transaction, SenderAccount) {
	return true;
}

function GroupCreateTrType_ApplyAttachment(Transaction, SenderAccount, RecipientAccount) {
	throw new Error('Not implementted');
	/*
	Attachment.ColoredCoinsAssetIssuance attachment = (Attachment.ColoredCoinsAssetIssuance)transaction.getAttachment();
	Long assetId = transaction.getId();
	Asset.addAsset(assetId, transaction.getSenderId(), attachment.getName(), attachment.getDescription(),
			attachment.getQuantityQNT(), attachment.getDecimals());
	senderAccount.addToAssetAndUnconfirmedAssetBalanceQNT(assetId, attachment.getQuantityQNT());
	*/
}

function GroupCreateTrType_UndoAttachment(Transaction, SenderAccount, RecipientAccount) {
	throw new Error('Not implementted');
	/*
	Attachment.ColoredCoinsAssetIssuance attachment = (Attachment.ColoredCoinsAssetIssuance)transaction.getAttachment();
	Long assetId = transaction.getId();
	senderAccount.addToAssetAndUnconfirmedAssetBalanceQNT(assetId, -attachment.getQuantityQNT());
	Asset.removeAsset(assetId);
	*/
}

function GroupCreateTrType_UndoAttachmentUnconfirmed(Transaction, SenderAccount) {
}

function GroupCreateTrType_ValidateAttachment(Transaction) {
	throw new Error('Not implementted');
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

GroupCreateTrType.prototype.GetName = GroupCreateTrType_GetName;
GroupCreateTrType.prototype.GetSubtype = GroupCreateTrType_GetSubtype;
GroupCreateTrType.prototype.DoLoadAttachment_Buf = GroupCreateTrType_DoLoadAttachment_Buf;
GroupCreateTrType.prototype.DoLoadAttachment_Json = GroupCreateTrType_DoLoadAttachment_Json;
GroupCreateTrType.prototype.ApplyAttachmentUnconfirmed = GroupCreateTrType_ApplyAttachmentUnconfirmed;
GroupCreateTrType.prototype.ApplyAttachment = GroupCreateTrType_ApplyAttachment;
GroupCreateTrType.prototype.UndoAttachment = GroupCreateTrType_UndoAttachment;
GroupCreateTrType.prototype.UndoAttachmentUnconfirmed = GroupCreateTrType_UndoAttachmentUnconfirmed;
GroupCreateTrType.prototype.ValidateAttachment = GroupCreateTrType_ValidateAttachment;


function GetGroupCreateTrType() {
	if (!groupCreateTrType)
		groupCreateTrType = new GroupCreateTrType();
	return groupCreateTrType;
}


exports.GetGroupCreate = GetGroupCreateTrType;
