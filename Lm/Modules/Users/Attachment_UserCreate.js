/**!
 * LibreMoney 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var Transactions = require(__dirname + '/../../Core/Transactions');
var UserTrType = require(__dirname + '/UserTrType');


// Mentor = Invite = Transaction sender
// NewUser = Recepient = UserPubKey
function UserCreateAttachment(Name, Description) {
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
	return UserTrType.GetIssuance();
}

function GetName() {
	return this.Name;
}

function GetDescription() {
	return this.Description;
}


UserCreateAttachment.prototype.GetSize = GetSize;
UserCreateAttachment.prototype.GetBytes = GetBytes;
UserCreateAttachment.prototype.GetJsonObject = GetJsonObject;
UserCreateAttachment.prototype.GetTransactionType = GetTransactionType;
UserCreateAttachment.prototype.GetName = GetName;
UserCreateAttachment.prototype.GetDescription = GetDescription;


exports.Create = UserCreateAttachment;
