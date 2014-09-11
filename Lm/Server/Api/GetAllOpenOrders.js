/**!
 * LibreMoney GetAllOpenOrders api 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

/*
import nxt.Order;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.JSONStreamAware;
*/

//super(new APITag[] {APITag.AE});
function GetAllOpenOrders(req, res) {
	res.send('This is not implemented');
	/*
	JSONObject response = new JSONObject();
	JSONArray ordersData = new JSONArray();
	try {
		Collection<Order.Ask> askOrders = Order.Ask.getAllAskOrders();
		Collection<Order.Bid> bidOrders = Order.Bid.getAllBidOrders();

		for (Order.Ask order : askOrders) {
			ordersData.add(JSONData.askOrder(order));
		}
		for (Order.Bid order : bidOrders) {
			ordersData.add(JSONData.bidOrder(order));
		}
	} catch (RuntimeException e) {
		response.put("error", e.toString());
	}
	response.put("openOrders", ordersData);
	return response;
	*/
}

module.exports = GetAllOpenOrders;
