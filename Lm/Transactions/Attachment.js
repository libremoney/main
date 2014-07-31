/**!
 * LibreMoney 0.0
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */


function Attachment() {
	obj = {};


	function GetBytes() {}

	function GetJsonObject() {}

	function GetSize() {}

	function GetTransactionType() {}


	obj.GetBytes = GetBytes;
	obj.GetJsonObject = GetJsonObject;
	obj.GetSize = GetSize;
	obj.GetTransactionType = GetTransactionType;
	return obj;
}


module.exports = Attachment;
