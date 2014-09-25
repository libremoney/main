/**!
 * LibreMoney AbstractAppendix 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

if (typeof module !== "undefined") {
	var Appendix = require(__dirname + '/Appendix');
	var Convert = require(__dirname + '/../../../Lib/Util/Convert');
}


function AbstractAppendix(data) {
	this.prototype = new Appendix();
	if (typeof data.attachmentData != 'undefined') {
		this.version = Convert.NullToZero(attachmentData["version." + GetAppendixName()]);
	} else if (typeof data.buffer != 'undefined' && data.transactionVersion != 'undefined') {
		if (data.transactionVersion == 0) {
			this.version = 0;
		} else {
			this.version = data.buffer[0];
		}
	} else if (typeof data.version != 'undefined') {
		this.version = data.version;
	} else
		this.version = 1;
	return this;
}

AbstractAppendix.prototype.Apply = function(transaction, senderAccount, recipientAccount) {
}

AbstractAppendix.prototype.GetAppendixName = function() {
	return '';
}

AbstractAppendix.prototype.GetJsonObject = function() {
	var json = {};
	json["version." + this.GetAppendixName()] = version;
	this.PutMyJson(json);
	return json;
}

AbstractAppendix.prototype.GetMySize = function() {
	return 0;
}

AbstractAppendix.prototype.GetSize = function() {
	return this.GetMySize() + 1;
}

AbstractAppendix.prototype.GetVersion = function() {
	return this.version;
}

AbstractAppendix.prototype.PutMyBytes = function(buffer) {
}

AbstractAppendix.prototype.PutMyJson = function(json) {
}

AbstractAppendix.prototype.PutBytes = function(buffer) {
	buffer.push(version);
	this.PutMyBytes(buffer);
}

AbstractAppendix.prototype.Undo = function(transaction, senderAccount, recipientAccount) {
}

AbstractAppendix.prototype.Validate = function(transaction) {
}

AbstractAppendix.prototype.VerifyVersion = function(transactionVersion) {
	return transactionVersion == 0 ? this.version == 0 : this.version > 0;
}


if (typeof module !== "undefined") {
	module.exports = AbstractAppendix;
}
