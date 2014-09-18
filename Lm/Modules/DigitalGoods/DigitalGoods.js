/*!
 * LibreMoney DigitalGoods 0.1
 * Copyright(c) 2014 LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */


function Init() {
	Core.AddListener(Core.Event.InitServer, OnInitServer);
}

function OnInitServer(app) {
	var Api = require(__dirname + "/Api");
	app.get("/api/dgsDelisting", Api.DgsDelisting);
	app.get("/api/dgsDelivery", Api.DgsDelivery);
	app.get("/api/dgsFeedback", Api.DgsFeedback);
	app.get("/api/dgsListing", Api.DgsListing);
	app.get("/api/dgsPriceChange", Api.DgsPriceChange);
	app.get("/api/dgsPurchase", Api.DgsPurchase);
	app.get("/api/dgsQuantityChange", Api.DgsQuantityChange);
	app.get("/api/dgsRefund", Api.DgsRefund);
	app.get("/api/getDgsGood", Api.GetDgsGood);
	app.get("/api/getDgsGoods", Api.GetDgsGoods);
	app.get("/api/getDgsPendingPurchases", Api.GetDgsPendingPurchases);
	app.get("/api/getDgsPurchase", Api.GetDgsPurchase);
	app.get("/api/getDgsPurchases", Api.GetDgsPurchases);
}


exports.Init = Init;

exports.SUBTYPE_DIGITAL_GOODS_LISTING = 0;
exports.SUBTYPE_DIGITAL_GOODS_DELISTING = 1;
exports.SUBTYPE_DIGITAL_GOODS_PRICE_CHANGE = 2;
exports.SUBTYPE_DIGITAL_GOODS_QUANTITY_CHANGE = 3;
exports.SUBTYPE_DIGITAL_GOODS_PURCHASE = 4;
exports.SUBTYPE_DIGITAL_GOODS_DELIVERY = 5;
exports.SUBTYPE_DIGITAL_GOODS_FEEDBACK = 6;
exports.SUBTYPE_DIGITAL_GOODS_REFUND = 7;
