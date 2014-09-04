/**!
 * LibreMoney 0.0
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var ColoredCoinsOrderCancellation = require(__dirname + '/ColoredCoinsOrderCancellation');
var Constants = require(__dirname + '/../Constants');


//static final long serialVersionUID = 0;

function ColoredCoinsBidOrderCancellation(orderId) {
	obj = new ColoredCoinsOrderCancellation(orderId);

	function GetTransactionType() {
		return Constants.SUBTYPE_COLORED_COINS_BID_ORDER_CANCELLATION; //TransactionType.ColoredCoins.BID_ORDER_CANCELLATION;
	}

	obj.GetTransactionType = GetTransactionType;
	return obj;
}


module.exports = ColoredCoinsBidOrderCancellation;
