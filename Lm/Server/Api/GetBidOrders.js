/*
import nxt.NxtException;
import nxt.Order;
*/

function Main(req, res) {
	res.send('This is not implemented');
	/*
	static final GetBidOrders instance = new GetBidOrders();

	private GetBidOrders() {
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
		Iterator<Order.Bid> bidOrders = Order.Bid.getSortedOrders(assetId).iterator();
		while (bidOrders.hasNext() && limit-- > 0) {
			orders.add(JSONData.bidOrder(bidOrders.next()));
		}

		JSONObject response = new JSONObject();
		response.put("bidOrders", orders);
		return response;
	}
	*/
}

module.exports = Main;
