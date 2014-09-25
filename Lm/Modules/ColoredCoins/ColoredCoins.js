/**!
 * LibreMoney DigitalGoods 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var Convert = require(__dirname + '/../Util/Convert');
var ColoredCoinsAskOrderCancellationAttachment = require(__dirname + '/Attachment/ColoredCoinsAskOrderCancellation');
//var ColoredCoinsTrType = require(__dirname + '/ColoredCoinsTrType');
var Core = require(__dirname + '/../Core');


var assets = new Array();
var accountAssets = new Array();
var allAssets = new Array();


function AddAsset(assetId, senderAccountId, name, description, quantityMilliLm, decimals) {
	throw 'Not implementted';
	/*
	Asset asset = new Asset(assetId, senderAccountId, name, description, quantityQNT, decimals);
	if (Asset.assets.putIfAbsent(assetId, asset) != null) {
		throw new IllegalStateException("Asset with id " + Convert.toUnsignedLong(assetId) + " already exists");
	}
	List<Asset> accountAssetsList = accountAssets.get(senderAccountId);
	if (accountAssetsList == null) {
		accountAssetsList = new CopyOnWriteArrayList<>();
		accountAssets.put(senderAccountId, accountAssetsList);
	}
	accountAssetsList.add(asset);
	*/
}

function Clear() {
	assets.length = 0;
	accountAssets.length = 0;
}

function CreateColoredCoinsAskOrderCancellationAttachment() {
	return new ColoredCoinsAskOrderCancellationAttachment();
}

function GetAllAssets() {
	return allAssets;
}

function GetAsset(id) {
	return assets[id];
}

function GetAssetsIssuedBy(accountId) {
	throw 'Not implementted';
	/*
	List<Asset> assets = accountAssets.get(accountId);
	if (assets == null) {
		return Collections.emptyList();
	}
	return Collections.unmodifiableList(assets);
	*/
}

function Init() {
	Core.AddListener(Core.Event.Clear, OnClear);
	Core.AddListener(Core.Event.GetState, OnGetState);
	Core.AddListener(Core.Event.InitServer, OnInitServer);
	//ColoredCoinsTrType.Init();
}

function OnClear() {
	Clear();
}

function OnGetState() {
	response.numberOfAssets = allAssets.length;
	response.numberOfOrders = Orders.Ask.GetAllAskOrders().length + Orders.Bid.GetAllBidOrders().length;
}

function OnInitServer(app) {
	var Api = require(__dirname + "/Api");
	// Assets
	app.get("/api/getAllAssets", Api.GetAllAssets);
	app.get("/api/getAsset", Api.GetAsset);
	app.get("/api/getAssetIds", Api.GetAssetIds);
	app.get("/api/getAssets", Api.GetAssets);
	app.get("/api/getAssetsByIssuer", Api.GetAssetsByIssuer);
	app.get("/api/issueAsset", Api.IssueAsset);
	// ColoredCoins
	app.get("/api/cancelAskOrder", Api.CancelAskOrder);
	app.get("/api/cancelBidOrder", Api.CancelBidOrder);
	// Orders
	app.get("/api/getAccountCurrentAskOrderIds", Api.GetAccountCurrentAskOrderIds);
	app.get("/api/getAccountCurrentBidOrderIds", Api.GetAccountCurrentBidOrderIds);
	app.get("/api/getAllOpenOrders", Api.GetAllOpenOrders);
	app.get("/api/getAskOrder", Api.GetAskOrder);
	app.get("/api/getAskOrderIds", Api.GetAskOrderIds);
	app.get("/api/getAskOrders", Api.GetAskOrders);
	app.get("/api/getBidOrder", Api.GetBidOrder);
	app.get("/api/getBidOrderIds", Api.GetBidOrderIds);
	app.get("/api/getBidOrders", Api.GetBidOrders);
	app.get("/api/placeAskOrder", Api.PlaceAskOrder);
	app.get("/api/placeBidOrder", Api.PlaceBidOrder);
	app.get("/api/transferAsset", Api.TransferAsset);
}

function RemoveAsset(assetId) {
	throw 'Not implementted';
	/*
	var asset = assets.remove(assetId);
	var accountAssetList = accountAssets[asset.GetAccountId()];
	accountAssetList.remove(asset);
	*/
}


exports.AddAsset = AddAsset;
exports.Clear = Clear;
exports.CreateColoredCoinsAskOrderCancellationAttachment = CreateColoredCoinsAskOrderCancellationAttachment;
exports.GetAllAssets = GetAllAssets;
exports.GetAsset = GetAsset;
exports.GetAssetsIssuedBy = GetAssetsIssuedBy;
exports.Init = Init;
exports.RemoveAsset = RemoveAsset;

exports.SUBTYPE_COLORED_COINS_ASSET_ISSUANCE = 0;
exports.SUBTYPE_COLORED_COINS_ASSET_TRANSFER = 1;
exports.SUBTYPE_COLORED_COINS_ASK_ORDER_PLACEMENT = 2;
exports.SUBTYPE_COLORED_COINS_BID_ORDER_PLACEMENT = 3;
exports.SUBTYPE_COLORED_COINS_ASK_ORDER_CANCELLATION = 4;
exports.SUBTYPE_COLORED_COINS_BID_ORDER_CANCELLATION = 5;
