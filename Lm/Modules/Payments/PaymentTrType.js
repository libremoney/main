/**!
 * LibreMoney PaymentTrType 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */


var Constants = require(__dirname + '/../../Constants');
var TransactionType = require(__dirname + '/../../Core/Transactions/TransactionType');


function Payment() {
	this.prototype = new TransactionType();

	function GetType() {
		return Constants.TrTypePayment;
	}

	this.GetType = GetType
	return this;
}


module.exports = Payment;
