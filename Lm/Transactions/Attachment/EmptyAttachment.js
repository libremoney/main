/**!
 * LibreMoney 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var AbstractAttachment = require(__dirname + '/AbstractAttachment');


function EmptyAttachment() {
	var obj = new AbstractAttachment(0);

	function GetMySize() {
		return 0;
	}

	function PutMyBytes(buffer) {
	}

	function PutMyJson(json) {
	}

	function VerifyVersion(transactionVersion) {
		return true;
	}

	obj.GetMySize = GetMySize;
	obj.PutMyBytes = PutMyBytes;
	obj.PutMyJson = PutMyJson;
	obj.VerifyVersion = VerifyVersion;
	return obj;
}


module.exports = EmptyAttachment;
