/**!
 * LibreMoney Assets 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

//import nxt.util.Convert;

var assets = new Array();
var accountAssets = new Array();
var allAssets = new Array();


function GetAllAssets() {
	return allAssets;
}

function GetAsset(id) {
	throw 'Not';
	/*
	return assets.get(id);
	*/
}

function GetAssetsIssuedBy(accountId) {
	throw 'Not';
	/*
	List<Asset> assets = accountAssets.get(accountId);
	if (assets == null) {
		return Collections.emptyList();
	}
	return Collections.unmodifiableList(assets);
	*/
}

function AddAsset(assetId, senderAccountId, name, description, quantityMilliLm, decimals) {
	throw 'Not';
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

function RemoveAsset(assetId) {
	throw 'Not';
	/*
	Asset asset = Asset.assets.remove(assetId);
	List<Asset> accountAssetList = accountAssets.get(asset.getAccountId());
	accountAssetList.remove(asset);
	*/
}

function Clear() {
	assets = new Array();
	accountAssets = new Array();
}


exports.AddAsset = AddAsset;
exports.Clear = Clear;
exports.GetAllAssets = GetAllAssets;
exports.GetAsset = GetAsset;
exports.GetAssetsIssuedBy = GetAssetsIssuedBy;
exports.RemoveAsset = RemoveAsset;
