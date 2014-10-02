/**!
 * LibreMoney PaymentTrType 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */


if (typeof module !== "undefined") {
	var Constants = require(__dirname + '/../../Lib/Constants');
	var TransactionType = require(__dirname + '/../../Core/Transactions/TransactionType');
}


function Payment() {
}

Payment.prototype = new TransactionType();

Payment.prototype.GetType = function() {
	return Constants.TrTypePayment;
}


if (typeof module !== "undefined") {
	module.exports = Payment;
}
