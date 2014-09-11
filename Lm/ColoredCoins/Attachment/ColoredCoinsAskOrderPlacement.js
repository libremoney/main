/**!
 * LibreMoney 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var ColoredCoinsTrType = require(__dirname + '/../ColoredCoinsTrType');


function ColoredCoinsAskOrderPlacement(assetId, quantityQNT, priceMilliLm) {
	this.prototype = ColoredCoinsOrderPlacement(assetId, quantityQNT, priceMilliLm);

	/*
	static final long serialVersionUID = 0;
	*/

	function GetTransactionType() {
		return ColoredCoinsTrType.GetAskOrderPlacement();
	}

	this.GetTransactionType = GetTransactionType;
	return this;
}


module.exports = ColoredCoinsAskOrderPlacement();
