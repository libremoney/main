/**!
 * LibreMoney 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */


var serialVersionUID = 0;


function MessagingPollCreationAttachment(pollName, pollDescription, pollOptions, minNumberOfOptions, maxNumberOfOptions, optionsAreBinary) {
	this.pollName = pollName;
	this.pollDescription = pollDescription;
	this.pollOptions = pollOptions;
	this.minNumberOfOptions = minNumberOfOptions;
	this.maxNumberOfOptions = maxNumberOfOptions;
	this.optionsAreBinary = optionsAreBinary;
	return this;
}

function GetSize() {
	throw new Error('This is not implemented');
	/*
	try {
		int size = 2 + pollName.getBytes("UTF-8").length + 2 + pollDescription.getBytes("UTF-8").length + 1;
		for (String pollOption : pollOptions) {
			size += 2 + pollOption.getBytes("UTF-8").length;
		}
		size +=  1 + 1 + 1;
		return size;
	} catch (RuntimeException|UnsupportedEncodingException e) {
		Logger.logMessage("Error in getBytes", e);
		return 0;
	}
	*/
}

function GetBytes() {
	throw new Error('This is not implemented');
	/*
	try {
		byte[] name = this.pollName.getBytes("UTF-8");
		byte[] description = this.pollDescription.getBytes("UTF-8");
		byte[][] options = new byte[this.pollOptions.length][];
		for (int i = 0; i < this.pollOptions.length; i++) {
			options[i] = this.pollOptions[i].getBytes("UTF-8");
		}

		ByteBuffer buffer = ByteBuffer.allocate(getSize());
		buffer.order(ByteOrder.LITTLE_ENDIAN);
		buffer.putShort((short)name.length);
		buffer.put(name);
		buffer.putShort((short)description.length);
		buffer.put(description);
		buffer.put((byte)options.length);
		for (byte[] option : options) {
			buffer.putShort((short) option.length);
			buffer.put(option);
		}
		buffer.put(this.minNumberOfOptions);
		buffer.put(this.maxNumberOfOptions);
		buffer.put(this.optionsAreBinary ? (byte)1 : (byte)0);

		return buffer.array();
	} catch (RuntimeException | UnsupportedEncodingException e) {
		Logger.logMessage("Error in getBytes", e);
		return null;
	}
	*/
}

function GetJsonObject() {
	throw new Error('This is not implemented');
	/*
	JSONObject attachment = new JSONObject();
	attachment.put("name", this.pollName);
	attachment.put("description", this.pollDescription);
	JSONArray options = new JSONArray();
	if (this.pollOptions != null) {
		Collections.addAll(options, this.pollOptions);
	}
	attachment.put("options", options);
	attachment.put("minNumberOfOptions", this.minNumberOfOptions);
	attachment.put("maxNumberOfOptions", this.maxNumberOfOptions);
	attachment.put("optionsAreBinary", this.optionsAreBinary);
	return attachment;
	*/
}

function GetTransactionType() {
	throw new Error('This is not implemented');
	/*
	return TransactionType.Messaging.POLL_CREATION;
	*/
}

function GetPollName() {
	return this.pollName;
}

function GetPollDescription() {
	return this.pollDescription;
}

function GetPollOptions() {
	return this.pollOptions;
}

function GetMinNumberOfOptions() {
	return this.minNumberOfOptions;
}

function GetMaxNumberOfOptions() {
	return this.maxNumberOfOptions;
}

function IsOptionsAreBinary() {
	return this.optionsAreBinary;
}


MessagingPollCreationAttachment.prototype.GetSize = GetSize;
MessagingPollCreationAttachment.prototype.GetBytes = GetBytes;
MessagingPollCreationAttachment.prototype.GetJsonObject = GetJsonObject;
MessagingPollCreationAttachment.prototype.GetTransactionType = GetTransactionType;
MessagingPollCreationAttachment.prototype.GetPollName = GetPollName;
MessagingPollCreationAttachment.prototype.GetPollDescription = GetPollDescription;
MessagingPollCreationAttachment.prototype.GetPollOptions = GetPollOptions;
MessagingPollCreationAttachment.prototype.GetMinNumberOfOptions = GetMinNumberOfOptions;
MessagingPollCreationAttachment.prototype.GetMaxNumberOfOptions = GetMaxNumberOfOptions;
MessagingPollCreationAttachment.prototype.IsOptionsAreBinary = IsOptionsAreBinary;


module.exports = MessagingPollCreationAttachment;
