/*
import nxt.Order;
import nxt.util.Convert;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.JSONStreamAware;
*/

function Main(req, res) {
	//static final GetAccountCurrentBidOrderIds instance = new GetAccountCurrentBidOrderIds();
	res.send('This is not implemented');
	/*
	private GetAccountCurrentBidOrderIds() {
		super("account", "asset");
	}

	JSONStreamAware processRequest(HttpServletRequest req) throws ParameterException {
		Long accountId = ParameterParser.getAccount(req).getId();
		Long assetId = null;
		try {
			assetId = Convert.parseUnsignedLong(req.getParameter("asset"));
		} catch (RuntimeException e) {
			// ignored
		}
		JSONArray orderIds = new JSONArray();
		for (Order.Bid bidOrder : Order.Bid.getAllBidOrders()) {
			if ((assetId == null || bidOrder.getAssetId().equals(assetId)) && bidOrder.getAccount().getId().equals(accountId)) {
				orderIds.add(Convert.toUnsignedLong(bidOrder.getId()));
			}
		}
		JSONObject response = new JSONObject();
		response.put("bidOrderIds", orderIds);
		return response;
	}
	*/
}

module.exports = Main;
