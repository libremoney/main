/*!
 * LibreMoney Offer 0.2
 * Copyright(c) 2014 LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */


function Offer(price, buyerId) {
	this.price = price; // MilliLm
	this.buyerId = buyerId;
}

// MilliLm
Offer.prototype.GetPrice = function() {
	return this.price;
}

Offer.prototype.GetBuyerId = function() {
	return this.buyerId;
}


if (typeof module !== "undefined") {
	module.exports = Offer;
}
