/**!
 * LibreMoney GetAskOrders api 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

/*
import nxt.NxtException;
import nxt.Order;
*/

//super(new APITag[] {APITag.AE}, "asset", "limit");
function GetAskOrders(req, res) {
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
	Iterator<Order.Ask> askOrders = Order.Ask.getSortedOrders(assetId).iterator();
	while (askOrders.hasNext() && limit-- > 0) {
		orders.add(JSONData.askOrder(askOrders.next()));
	}
	JSONObject response = new JSONObject();
	response.put("askOrders", orders);
	return response;
	*/
}

module.exports = GetAskOrders;
