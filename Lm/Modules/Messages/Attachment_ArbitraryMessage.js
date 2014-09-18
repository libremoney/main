/**!
 * LibreMoney 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var EmptyAttachment = require(__dirname + '/Transactions/Attachment/EmptyAttachment');
var Messages = require(__dirname + '/Messages');


// the message payload is in the Appendix
function ArbitraryMessage() {
	var obj = new EmptyAttachment();

	function GetAppendixName() {
		return "ArbitraryMessage";
	}

	function GetTransactionType() {
		// TODO
		return Messages.ArbitraryMessage;
	}

	obj.GetAppendixName = GetAppendixName;
	obj.GetTransactionType = GetTransactionType;
	return obj;
}


module.exports = ArbitraryMessage;
