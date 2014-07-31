/*!
 * LibreMoney Trade 0.0
 * Copyright(c) 2014 LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var Listeners = require(__dirname + '/../Util/Listeners');
var Trade = require(__dirname + '/Trade');


var Event = {
	TRADE:0
}

var listeners = new Listeners();
var trades = [];
var allTrades = []; //Collections.unmodifiableCollection(trades.values());


function AddListener(eventType, listener) {
	return listeners.AddListener(eventType, listener);
}

function AddTrade(assetId, timestamp, blockId, askOrderId, bidOrderId, quantityQNT, priceMilliLm) {
	var assetTrades = trades[assetId];
	if (!assetTrades) {
		assetTrades = []; //new CopyOnWriteArrayList<>();
		// cfb: CopyOnWriteArrayList requires a lot of resources to grow but this happens only when a new block is pushed/applied, I can't decide if we should replace it with another class
		trades[assetId] = assetTrades;
	}
	var trade = new Trade(blockId, timestamp, assetId, askOrderId, bidOrderId, quantityQNT, priceMilliLm);
	assetTrades.push(trade);
	listeners.Notify(Event.TRADE, trade);
}

function Clear() {
	trades.length = 0;
}

function GetAllTrades() {
	return allTrades;
}

function GetTrades(assetId) {
	var assetTrades = trades[assetId];
	if (assetTrades) {
		return assetTrades; //Collections.unmodifiableList(assetTrades);
	}
	return []; //Collections.emptyList();
}

function Init(callback) {
	Core.AddListener(Core.Events.Clear, function() {
		Clear();
	});
	if (callback) callback(null);
}

function RemoveListener(eventType, listener) {
	return listeners.removeListener(eventType, listener);
}


exports.AddListener = AddListener;
exports.AddTrade = AddTrade;
exports.Clear = Clear;
exports.GetAllTrades = GetAllTrades;
exports.GetTrades = GetTrades;
exports.Init = Init;
exports.RemoveListener = RemoveListener;
