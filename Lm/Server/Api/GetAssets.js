/**!
 * LibreMoney 0.0
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var Assets = require(__dirname + '/../../Assets');
var Convert = require(__dirname + '/../../Util/Convert');
var JsonResponses = require(__dirname + '/../JsonResponses');


//super("assets", "assets", "assets"); // limit to 3 for testing
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
			var asset = Assets.GetAsset(Convert.ParseUnsignedLong(assetIdString));
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
