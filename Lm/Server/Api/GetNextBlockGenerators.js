/*
import nxt.Block;
import nxt.Constants;
import nxt.Hub;
import nxt.Nxt;
import nxt.util.Convert;
*/

function Main(req, res) {
	res.send('This is not implemented');
	/*
	static final GetNextBlockGenerators instance = new GetNextBlockGenerators();

	private GetNextBlockGenerators() {}

	JSONStreamAware processRequest(HttpServletRequest req) {

		Block curBlock = Nxt.getBlockchain().getLastBlock();
		if (curBlock.getHeight() < Constants.TRANSPARENT_FORGING_BLOCK_7) {
			return JSONResponses.FEATURE_NOT_AVAILABLE;
		}


		JSONObject response = new JSONObject();
		response.put("time", Convert.getEpochTime());
		response.put("lastBlock", Convert.toUnsignedLong(curBlock.getId()));
		JSONArray hubs = new JSONArray();

		int limit;
		try {
			limit = Integer.parseInt(req.getParameter("limit"));
		} catch (RuntimeException e) {
			limit = Integer.MAX_VALUE;
		}

		Iterator<Hub.Hit> iterator = Hub.getHubHits(curBlock).iterator();
		while (iterator.hasNext() && hubs.size() < limit) {
			JSONObject hub = new JSONObject();
			Hub.Hit hit = iterator.next();
			hub.put("account", Convert.toUnsignedLong(hit.hub.getAccountId()));
			hub.put("minFeePerByteNQT", hit.hub.getMinFeePerByteNQT());
			hub.put("time", hit.hitTime);
			JSONArray uris = new JSONArray();
			uris.addAll(hit.hub.getUris());
			hub.put("uris", uris);
			hubs.add(hub);
		}
		
		response.put("hubs", hubs);
		return response;
	}
	*/
}

module.exports = Main;
