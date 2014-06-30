/*
import nxt.NxtException;
import nxt.Order;
import nxt.util.Convert;
*/

function Main(req, res) {
	res.send('This is not implemented');
	/*
	static final GetBidOrderIds instance = new GetBidOrderIds();

	private GetBidOrderIds() {
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

		JSONArray orderIds = new JSONArray();
		Iterator<Order.Bid> bidOrders = Order.Bid.getSortedOrders(assetId).iterator();
		while (bidOrders.hasNext() && limit-- > 0) {
			orderIds.add(Convert.toUnsignedLong(bidOrders.next().getId()));
		}

		JSONObject response = new JSONObject();
		response.put("bidOrderIds", orderIds);
		return response;
	}
	*/
}

module.exports = Main;
