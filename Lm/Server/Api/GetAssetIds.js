/**!
 * LibreMoney GetAssetIds api 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

/*
import nxt.Asset;
import nxt.util.Convert;
*/

//super(new APITag[] {APITag.AE});
function GetAssetIds(req, res) {
	res.send('This is not implemented');
	/*
	JSONArray assetIds = new JSONArray();
	for (Asset asset : Asset.getAllAssets()) {
		assetIds.add(Convert.toUnsignedLong(asset.getId()));
	}

	JSONObject response = new JSONObject();
	response.put("assetIds", assetIds);
	return response;
	*/
}

module.exports = GetAssetIds;
