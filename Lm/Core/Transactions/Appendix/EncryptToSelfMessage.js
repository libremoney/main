/**!
 * LibreMoney EncryptToSelfMessage 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

if (typeof module !== "undefined") {
	var AbstractEncryptedMessage = require(__dirname + '/AbstractEncryptedMessage');
}


function EncryptToSelfMessage(data) {
	if (typeof data.buffer != 'undefined' && typeof data.transactionVersion != 'undefined') {
		this.prototype = new AbstractEncryptedMessage({
			buffer: data.buffer,
			transactionVersion: data.transactionVersion
		});
	} else if (typeof data.attachmentData != 'undefined') {
		this.prototype = new AbstractEncryptedMessage({
			attachmentJson: data.attachmentData,
			encryptedMessageJson: attachmentData.encryptToSelfMessage
		});
	} else if (typeof data.encryptedData != 'undefined' && typeof isText != 'undefined') {
		this.prototype = new AbstractEncryptedMessage({
			encryptedData: data.encryptedData,
			isText: data.isText
		});
	} else
		throw new Error('Unknown params EncryptToSelfMessage');


	function GetAppendixName() {
		return "EncryptToSelfMessage";
	}

	function PutMyJson(json) {
		throw new Error('Not implementted');
		/*
		JSONObject encryptToSelfMessageJSON = new JSONObject();
		super.putMyJSON(encryptToSelfMessageJSON);
		json.put("encryptToSelfMessage", encryptToSelfMessageJSON);
		*/
	}

	function Validate(transaction) {
		throw new Error('Not implementted');
		/*
		super.validate(transaction);
		if (transaction.getVersion() == 0) {
			throw new NxtException.NotValidException("Encrypt-to-self message attachments not enabled for version 0 transactions");
		}
		*/
	}

	this.GetAppendixName = GetAppendixName;
	this.PutMyJson = PutMyJson;
	this.Validate = Validate;
	return this;
}


if (typeof module !== "undefined") {
	module.exports = EncryptToSelfMessage;
}
