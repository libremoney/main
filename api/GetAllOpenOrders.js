/*
package nxt.http;

import nxt.Order;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.JSONStreamAware;

import javax.servlet.http.HttpServletRequest;
import java.util.Collection;
*/

function Main(req, res) {
	res.send('This is not implemented');
	/*
	static final GetAllOpenOrders instance = new GetAllOpenOrders();

	JSONStreamAware processRequest(HttpServletRequest req) {
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
	}
	*/
}

module.exports = Main;
