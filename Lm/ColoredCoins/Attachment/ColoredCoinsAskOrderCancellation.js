/**!
 * LibreMoney 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var Constants = require(__dirname + '/../../Constants');


//static final long serialVersionUID = 0;

function ColoredCoinsAskOrderCancellation(orderId) {
	var obj = new ColoredCoinsOrderCancellation(orderId);

	function GetTransactionType() {
		return Constants.SUBTYPE_COLORED_COINS_ASK_ORDER_CANCELLATION; //Transactions.Types.ColoredCoins.ASK_ORDER_CANCELLATION;
	}

	obj.GetTransactionType = GetTransactionType;
}


module.exports = ColoredCoinsAskOrderCancellation;
