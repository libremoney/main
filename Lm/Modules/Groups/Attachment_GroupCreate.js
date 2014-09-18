/*!
 * LibreMoney 0.1
 * Copyright(c) 2014 LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var Transactions = require(__dirname + '/../../Core/Transactions');


function GroupCreateAttachment(Name, Description) {
	var obj = Transactions.CreateAttachment();
	obj.Name = Name;
	obj.Description = Description;
	return obj;
}

function GetSize() {
	throw new Error('Not implementted');
	/*
	try {
		return 1 + name.getBytes("UTF-8").length + 2 + description.getBytes("UTF-8").length + 8 + 1;
	} catch (RuntimeException|UnsupportedEncodingException e) {
		Logger.logMessage("Error in getBytes", e);
		return 0;
	}
	*/
}

function GetBytes() {
	throw new Error('Not implementted');
	/*
	try {
		byte[] name = this.name.getBytes("UTF-8");
		byte[] description = this.description.getBytes("UTF-8");

		ByteBuffer buffer = ByteBuffer.allocate(1 + name.length + 2 + description.length + 8 + 1);
		buffer.order(ByteOrder.LITTLE_ENDIAN);
		buffer.put((byte)name.length);
		buffer.put(name);
		buffer.putShort((short)description.length);
		buffer.put(description);
		buffer.putLong(quantityQNT);
		buffer.put(decimals);

		return buffer.array();
	} catch (RuntimeException|UnsupportedEncodingException e) {
		Logger.logMessage("Error in getBytes", e);
		return null;
	}
	*/
}

function GetJsonObject() {
	throw new Error('Not implementted');
	/*
	JSONObject attachment = new JSONObject();
	attachment.put("name", name);
	attachment.put("description", description);
	attachment.put("quantityQNT", quantityQNT);
	attachment.put("decimals", decimals);
	return attachment;
	*/
}

function GetTransactionType() {
	return GroupTrType.GetIssuance();
}

function GetName() {
	return this.Name;
}

function GetDescription() {
	return this.Description;
}


GroupCreateAttachment.prototype.GetBytes = GetBytes;
GroupCreateAttachment.prototype.GetDescription = GetDescription;
GroupCreateAttachment.prototype.GetJsonObject = GetJsonObject;
GroupCreateAttachment.prototype.GetName = GetName;
GroupCreateAttachment.prototype.GetSize = GetSize;
GroupCreateAttachment.prototype.GetTransactionType = GetTransactionType;


exports.Create = GroupCreateAttachment;
