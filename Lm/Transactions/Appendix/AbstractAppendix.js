/**!
 * LibreMoney 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var Appendix = require(__dirname + '/Appendix');
var Convert = require(__dirname + '/../../Util/Convert');


function AbstractAppendix(data) {
	if (typeof data.attachmentData != 'undefined') {
		this.prototype = new Appendix();
		this.version = Convert.NullToZero(attachmentData["version." + GetAppendixName()]);
	} else if (typeof data.buffer != 'undefined' && data.transactionVersion != 'undefined') {
		this.prototype = new Appendix();
		if (data.transactionVersion == 0) {
			this.version = 0;
		} else {
			this.version = data.buffer[0];
		}
	} else if (typeof data.version != 'undefined') {
		this.prototype = new Appendix();
		this.version = data.version;
	} else
		this.version = 1;


	function Apply(transaction, senderAccount, recipientAccount) {
	}

	function GetAppendixName() {
		return '';
	}

	function GetJsonObject() {
		var json = {};
		json["version." + this.GetAppendixName()] = version;
		this.putMyJson(json);
		return json;
	}

	function GetMySize() {
		return 0;
	}

	function GetSize() {
		return this.GetMySize() + 1;
	}

	function GetVersion() {
		return this.version;
	}

	function PutMyBytes(buffer) {
	}

	function PutMyJson(json) {
	}

	function PutBytes(buffer) {
		buffer.push(version);
		this.PutMyBytes(buffer);
	}

	function Undo(transaction, senderAccount, recipientAccount) {
	}

	function Validate(transaction) {
	}

	function VerifyVersion(transactionVersion) {
		return transactionVersion == 0 ? this.version == 0 : this.version > 0;
	}


	this.Apply = Apply;
	this.GetAppendixName = GetAppendixName;
	this.GetJsonObject = GetJsonObject;
	this.GetMySize = GetMySize;
	this.GetSize = GetSize;
	this.GetVersion = GetVersion;
	this.PutMyBytes = PutMyBytes;
	this.PutMyJson = PutMyJson;
	this.PutBytes = PutBytes;
	this.Undo = Undo;
	this.Validate = Validate;
	this.VerifyVersion = VerifyVersion;
	return this;
}


module.exports = AbstractAppendix;
