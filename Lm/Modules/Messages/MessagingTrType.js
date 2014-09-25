/**!
 * LibreMoney MessagingTrType 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

if (typeof module !== "undefined") {
	var Constants = require(__dirname + '/../../Lib/Constants');
	var TransactionType = require(__dirname + '/../../Core/Transactions/TransactionType');
}


function Messaging() {
	return this;
}

Messaging.prototype = new TransactionType();

Messaging.prototype.ApplyAttachmentUnconfirmed = function(transaction, senderAccount) {
	return true;
}

Messaging.prototype.GetType = function() {
	return TransactionType.TrTypeMessaging;
}

Messaging.prototype.UndoAttachmentUnconfirmed = function(transaction, senderAccount) {
}


if (typeof module !== "undefined") {
	module.exports = Messaging;
}
