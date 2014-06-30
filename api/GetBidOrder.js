/*
package nxt.http;

import nxt.NxtException;
import nxt.Order;
import org.json.simple.JSONStreamAware;

import javax.servlet.http.HttpServletRequest;

import static nxt.http.JSONResponses.UNKNOWN_ORDER;
*/

function Main(req, res) {
	//static final GetBidOrder instance = new GetBidOrder();
	res.send('This is not implemented');
	/*
	private GetBidOrder() {
		super("order");
	}

	JSONStreamAware processRequest(HttpServletRequest req) throws NxtException {
		Long orderId = ParameterParser.getOrderId(req);
		Order.Bid bidOrder = Order.Bid.getBidOrder(orderId);
		if (bidOrder == null) {
			return UNKNOWN_ORDER;
		}
		return JSONData.bidOrder(bidOrder);
	}
	*/
}

module.exports = Main;
