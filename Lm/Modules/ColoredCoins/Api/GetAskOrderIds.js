/**!
 * LibreMoney GetAskOrderIds api 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

/*
import nxt.NxtException;
import nxt.Order;
import nxt.util.Convert;
*/

//super(new APITag[] {APITag.AE}, "asset", "limit");
function GetAskOrderIds(req, res) {
	res.send('This is not implemented');
	/*
	Long assetId = ParameterParser.getAsset(req).getId();
	int limit;
	try {
		limit = Integer.parseInt(req.getParameter("limit"));
	} catch (NumberFormatException e) {
		limit = Integer.MAX_VALUE;
	}
	JSONArray orderIds = new JSONArray();
	Iterator<Order.Ask> askOrders = Order.Ask.getSortedOrders(assetId).iterator();
	while (askOrders.hasNext() && limit-- > 0) {
		orderIds.add(Convert.toUnsignedLong(askOrders.next().getId()));
	}
	JSONObject response = new JSONObject();
	response.put("askOrderIds", orderIds);
	return response;
	*/
}

module.exports = GetAskOrderIds;
