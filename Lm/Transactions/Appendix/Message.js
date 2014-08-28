/**!
 * LibreMoney 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var AbstractAppendix = require(__dirname + '/AbstractAppendix');


/*
public static class Message extends AbstractAppendix {
	private final byte[] message;
	private final boolean isText;
}
*/

/*
static Message parse(JSONObject attachmentData) throws NxtException.NotValidException {
	if (attachmentData.get("message") == null) {
		return null;
	}
	return new Message(attachmentData);
}
*/

// message - bytes[] or string
function Message(version, message) {
	var obj = new AbstractAppendix(version);
	if (message instanceof Array) {
		obj.message = message;
		obj.isText = false;
	} else {
		obj.message = Convert.toBytes(string);
		obj.isText = true;
	}


	function GetAppendixName() {
		return "Message";
	}

	function GetMySize() {
		return 4 + this.message.length;
	}

	function PutMyBytes(buffer) {
		throw new Error('Not implementted');
		/*
		buffer.putInt(isText ? (message.length | Integer.MIN_VALUE) : message.length);
		buffer.put(message);
		*/
	}

	function PutMyJson(json) {
		throw new Error('Not implementted');
		/*
		json.put("message", isText ? Convert.toString(message) : Convert.toHexString(message));
		json.put("messageIsText", isText);
		*/
	}

	function Validate(transaction) {
		throw new Error('Not implementted');
		/*
		if (this.isText && transaction.getVersion() == 0) {
			throw new NxtException.NotValidException("Text messages not yet enabled");
		}
		if (transaction.getVersion() == 0 && transaction.getAttachment() != Attachment.ARBITRARY_MESSAGE) {
			throw new NxtException.NotValidException("Message attachments not enabled for version 0 transactions");
		}
		if (message.length > Constants.MAX_ARBITRARY_MESSAGE_LENGTH) {
			throw new NxtException.NotValidException("Invalid arbitrary message length: " + message.length);
		}
		*/
	}

	function Apply(transaction, senderAccount, recipientAccount) {}

	function Undo(transaction, senderAccount, recipientAccount) {}

	function GetMessage() {
		return this.message;
	}

	function IsText() {
		return this.isText;
	}


	obj.GetAppendixName = GetAppendixName;
	obj.GetMySize = GetMySize;
	obj.PutMyBytes = PutMyBytes;
	obj.PutMyJson = PutMyJson;
	obj.Validate = Validate;
	obj.Apply = Apply;
	obj.Undo = Undo;
	obj.GetMessage = GetMessage;
	obj.IsText = IsText;
	return obj;
}

/*
Message(ByteBuffer buffer, byte transactionVersion) throws NxtException.NotValidException {
	super(buffer, transactionVersion);
	int messageLength = buffer.getInt();
	this.isText = messageLength < 0; // ugly hack
	if (messageLength < 0) {
		messageLength &= Integer.MAX_VALUE;
	}
	if (messageLength > Constants.MAX_ARBITRARY_MESSAGE_LENGTH) {
		throw new NxtException.NotValidException("Invalid arbitrary message length: " + messageLength);
	}
	this.message = new byte[messageLength];
	buffer.get(this.message);
}
*/

/*
Message(JSONObject attachmentData) throws NxtException.NotValidException {
	super(attachmentData);
	String messageString = (String)attachmentData.get("message");
	this.isText = Boolean.TRUE.equals((Boolean)attachmentData.get("messageIsText"));
	this.message = isText ? Convert.toBytes(messageString) : Convert.parseHexString(messageString);
}
*/


module.exports = Message;
