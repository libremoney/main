/*
import nxt.NxtException;
import nxt.Order;
import static nxt.http.JSONResponses.UNKNOWN_ORDER;
*/

function Main(req, res) {
	res.send('This is not implemented');
	/*
	static final GetAskOrder instance = new GetAskOrder();

	private GetAskOrder() {
		super("order");
	}

	JSONStreamAware processRequest(HttpServletRequest req) throws NxtException {
		Long orderId = ParameterParser.getOrderId(req);
		Order.Ask askOrder = Order.Ask.getAskOrder(orderId);
		if (askOrder == null) {
			return UNKNOWN_ORDER;
		}
		return JSONData.askOrder(askOrder);
	}
	*/
}

module.exports = Main;
