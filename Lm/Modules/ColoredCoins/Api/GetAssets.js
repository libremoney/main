/**!
 * LibreMoney GetAssets api 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var ColoredCoins = require(__dirname + '/../ColoredCoins');
var Convert = require(__dirname + '/../../Util/Convert');
var JsonResponses = require(__dirname + '/../../Server/JsonResponses');


//super(new APITag[] {APITag.AE}, "assets", "assets", "assets"); // limit to 3 for testing
function GetAssets(req, res) {
	var assets = req.query.assets;
	var response = {};
	var assetsJsonArray = [];
	response.assets = assetsJsonArray;
	for (var assetIdString in assets) {
		if (!assetIdString || assetIdString == "") {
			continue;
		}
		try {
			var asset = ColoredCoins.GetAsset(Convert.ParseUnsignedLong(assetIdString));
			if (!asset) {
				return JsonResponses.UnknownAsset;
			}
			assetsJsonArray.push(JsonData.Asset(asset));
		} catch (e) {
			return JsonResponses.IncorrectAsset;
		}
	}
	res.send(response);
	return true;
}


module.exports = GetAssets;
