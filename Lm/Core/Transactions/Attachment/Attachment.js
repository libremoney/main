/**!
 * LibreMoney 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var Appendix = require(__dirname + '/../Appendix');


function Attachment() {
	obj = new Appendix();


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
