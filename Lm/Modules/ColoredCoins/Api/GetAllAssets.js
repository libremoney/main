/**!
 * LibreMoney GetAllAssets api 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

/*
import nxt.Asset;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.JSONStreamAware;
*/

//super(new APITag[] {APITag.AE});
function GetAllAssets(req, res) {
	res.send('This is not implemented');
	/*
	JSONObject response = new JSONObject();
	JSONArray assetsJSONArray = new JSONArray();
	response.put("assets", assetsJSONArray);
	for (Asset asset : Asset.getAllAssets()) {
		assetsJSONArray.add(JSONData.asset(asset));
	}
	return response;
	*/
}

module.exports = GetAllAssets;
