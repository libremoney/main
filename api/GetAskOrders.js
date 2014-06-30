/*
import nxt.NxtException;
import nxt.Order;
*/

function Main(req, res) {
	res.send('This is not implemented');
	/*
	static final GetAskOrders instance = new GetAskOrders();

	private GetAskOrders() {
		super("asset", "limit");
	}

	JSONStreamAware processRequest(HttpServletRequest req) throws NxtException {
		Long assetId = ParameterParser.getAsset(req).getId();
		int limit;
		try {
			limit = Integer.parseInt(req.getParameter("limit"));
		} catch (NumberFormatException e) {
			limit = Integer.MAX_VALUE;
		}
		JSONArray orders = new JSONArray();
		Iterator<Order.Ask> askOrders = Order.Ask.getSortedOrders(assetId).iterator();
		while (askOrders.hasNext() && limit-- > 0) {
			orders.add(JSONData.askOrder(askOrders.next()));
		}
		JSONObject response = new JSONObject();
		response.put("askOrders", orders);
		return response;
	}
	*/
}

module.exports = Main;
