/*!
 * LibreMoney 0.1
 * Copyright(c) 2014 LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */


function Offer(priceMilliLm, buyerId) {
	this.priceMilliLm = priceMilliLm;
	this.buyerId = buyerId;
}

function GetPriceMilliLm() {
	return this.priceMilliLm;
}

function GetBuyerId() {
	return this.buyerId;
}


Offer.prototype.GetPriceMilliLm = GetPriceMilliLm;
Offer.prototype.GetBuyerId = GetBuyerId;


module.exports = Offer;
