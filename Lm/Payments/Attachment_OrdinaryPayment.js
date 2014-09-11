/**!
 * LibreMoney OrdinaryPayment 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var EmptyAttachment = require(__dirname + '/../Transactions/Attachment/EmptyAttachment');
var PaymentTrType = require(__dirname + '/PaymentTrType');


function OrdinaryPayment() {
	this.prototype = new EmptyAttachment();

	function GetAppendixName() {
		return "OrdinaryPayment";
	}

	function GetTransactionType() {
		return PaymentTrType.GetOrdinary();
	}

	this.GetAppendixName = GetAppendixName;
	this.GetTransactionType = GetTransactionType;
	return this;
}


module.exports = OrdinaryPayment;
