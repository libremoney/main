/**!
 * LibreMoney 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */


var Constants = require(__dirname + '/../Constants');
var TransactionType = require(__dirname + '/../Transactions/TransactionType');


function Payment() {
	this.prototype = new TransactionType();

	function GetType() {
		return Constants.TYPE_PAYMENT;
	}

	this.GetType = GetType
	return this;
}


module.exports = Payment;
