/**!
 * LibreMoney GetAskOrder api 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

/*
import nxt.NxtException;
import nxt.Order;
import static nxt.http.JSONResponses.UNKNOWN_ORDER;
*/

//super(new APITag[] {APITag.AE}, "order");
function GetAskOrder(req, res) {
	res.send('This is not implemented');
	/*
	Long orderId = ParameterParser.getOrderId(req);
	Order.Ask askOrder = Order.Ask.getAskOrder(orderId);
	if (askOrder == null) {
		return UNKNOWN_ORDER;
	}
	return JSONData.askOrder(askOrder);
	*/
}

module.exports = GetAskOrder;
