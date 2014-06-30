/*
import nxt.Asset;
import nxt.util.Convert;
*/

function Main(req, res) {
	//static final GetAssetIds instance = new GetAssetIds();
	res.send('This is not implemented');
	/*
	JSONStreamAware processRequest(HttpServletRequest req) {

		JSONArray assetIds = new JSONArray();
		for (Asset asset : Asset.getAllAssets()) {
			assetIds.add(Convert.toUnsignedLong(asset.getId()));
		}

		JSONObject response = new JSONObject();
		response.put("assetIds", assetIds);
		return response;
	}
	*/
}

module.exports = Main;
