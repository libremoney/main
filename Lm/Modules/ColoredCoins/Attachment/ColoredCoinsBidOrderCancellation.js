/**!
 * LibreMoney ColoredCoinsBidOrderCancellation 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var ColoredCoinsOrderCancellation = require(__dirname + '/ColoredCoinsOrderCancellation');
var Constants = require(__dirname + '/../Constants');


//static final long serialVersionUID = 0;

function ColoredCoinsBidOrderCancellation(orderId) {
	this.prototype = new ColoredCoinsOrderCancellation(orderId);

	function GetTransactionType() {
		return Constants.SUBTYPE_COLORED_COINS_BID_ORDER_CANCELLATION; //TransactionType.ColoredCoins.BID_ORDER_CANCELLATION;
	}

	this.GetTransactionType = GetTransactionType;
	return this;
}


module.exports = ColoredCoinsBidOrderCancellation;
