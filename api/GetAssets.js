/*
import nxt.Asset;
import nxt.util.Convert;
import static nxt.http.JSONResponses.INCORRECT_ASSET;
import static nxt.http.JSONResponses.UNKNOWN_ASSET;
*/

function Main(req, res) {
	res.send('This is not implemented');
	/*
	static final GetAssets instance = new GetAssets();

	private GetAssets() {
		super("assets", "assets", "assets"); // limit to 3 for testing
	}

	JSONStreamAware processRequest(HttpServletRequest req) {
		String[] assets = req.getParameterValues("assets");
		JSONObject response = new JSONObject();
		JSONArray assetsJSONArray = new JSONArray();
		response.put("assets", assetsJSONArray);
		for (String assetIdString : assets) {
			if (assetIdString == null || assetIdString.equals("")) {
				continue;
			}
			try {
				Asset asset = Asset.getAsset(Convert.parseUnsignedLong(assetIdString));
				if (asset == null) {
					return UNKNOWN_ASSET;
				}
				assetsJSONArray.add(JSONData.asset(asset));
			} catch (RuntimeException e) {
				return INCORRECT_ASSET;
			}
		}
		return response;
	}
	*/
}

module.exports = Main;
