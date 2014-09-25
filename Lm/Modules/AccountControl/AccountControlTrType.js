/**!
 * LibreMoney AccountControlTrType 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

if (typeof module !== "undefined") {
	var Constants = require(__dirname + '/../../Constants');
	var TransactionType = require(__dirname + '/TransactionType');
	var TransactionTypes = require(__dirname + '/TransactionTypes');
}


var AccountControlTrType = function() {
	return this;
}

AccountControlTrType.prototype = new TransactionType();

AccountControlTrType.prototype.ApplyAttachmentUnconfirmed = function(transaction, senderAccount) {
	return true;
}

AccountControlTrType.prototype.GetType = function() {
	return Constants.TrTypeAccountControl;
}

AccountControlTrType.prototype.UndoAttachmentUnconfirmed = function(transaction, senderAccount) {
}


TransactionTypes.Add(accountControl);


if (typeof module !== "undefined") {
	exports.Init = Init;
}
