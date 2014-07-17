/*
import nxt.Asset;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.JSONStreamAware;
*/

function Main(req, res) {
	res.send('This is not implemented');
	/*
	static final GetAllAssets instance = new GetAllAssets();

	JSONStreamAware processRequest(HttpServletRequest req) {
		JSONObject response = new JSONObject();
		JSONArray assetsJSONArray = new JSONArray();
		response.put("assets", assetsJSONArray);
		for (Asset asset : Asset.getAllAssets()) {
			assetsJSONArray.add(JSONData.asset(asset));
		}
		return response;
	}
	*/
}

module.exports = Main;
