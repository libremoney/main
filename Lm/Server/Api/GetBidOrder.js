/**!
 * LibreMoney GetBidOrder api 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

/*
import nxt.NxtException;
import nxt.Order;
import org.json.simple.JSONStreamAware;
import static nxt.http.JSONResponses.UNKNOWN_ORDER;
*/

//super(new APITag[] {APITag.AE}, "order");
function GetBidOrder(req, res) {
	res.send('This is not implemented');
	/*
	Long orderId = ParameterParser.getOrderId(req);
	Order.Bid bidOrder = Order.Bid.getBidOrder(orderId);
	if (bidOrder == null) {
		return UNKNOWN_ORDER;
	}
	return JSONData.bidOrder(bidOrder);
	*/
}

module.exports = GetBidOrder;
