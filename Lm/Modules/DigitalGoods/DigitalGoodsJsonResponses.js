/**!
 * LibreMoney DigitalGoodsJsonResponses 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */


var JsonResponses = function() {

	var GOODS_NOT_DELIVERED = {
		errorCode: 8,
		errorDescription: "Goods have not been delivered yet"
	}


	return {
		GOODS_NOT_DELIVERED: GOODS_NOT_DELIVERED
	}
}();


if (typeof module !== "undefined") {
	module.exports = JsonResponses;
}
