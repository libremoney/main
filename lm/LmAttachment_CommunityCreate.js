
LmAttachment = require(__dirname + '/LmAttachment');


function CreateCommunityCreateAttachment(Name, Description) {
	var obj = LmAttachment.Create();


	function GetSize() {
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
		return LmTrTypeUser.GetIssuance();
	}

	function GetName() {
		return this.Name;
	}

	function GetDescription() {
		return this.Description;
	}


	obj.Name = Name;
	obj.Description = Description;

	obj.GetSize = GetSize;
	obj.GetBytes = GetBytes;
	obj.GetJsonObject = GetJsonObject;
	obj.GetTransactionType = GetTransactionType;
	obj.GetName = GetName;
	obj.GetDescription = GetDescription;
	return obj;
}

exports.Create = CreateCommunityCreateAttachment;
