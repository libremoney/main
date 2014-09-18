/**!
 * LibreMoney GetBidOrders api 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

/*
import nxt.NxtException;
import nxt.Order;
*/

//super(new APITag[] {APITag.AE}, "asset", "limit");
function GetBidOrders(req, res) {
	res.send('This is not implemented');
	/*
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
	*/
}

module.exports = GetBidOrders;
