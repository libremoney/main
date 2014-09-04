/**!
 * LibreMoney CancelBidOrder api 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

/*
import nxt.Account;
import nxt.Attachment;
import nxt.NxtException;
import nxt.Order;
*/

var JsonResponses = require(__dirname + '/../JsonResponses');


//super(new APITag[] {APITag.AE, APITag.CREATE_TRANSACTION}, "order");
function CancelBidOrder(req, res) {
	//var obj = CreateTransaction();
	res.send('This is not implemented');
	/*
	Long orderId = ParameterParser.getOrderId(req);
	Account account = ParameterParser.getSenderAccount(req);
	Order.Bid orderData = Order.Bid.getBidOrder(orderId);
	if (orderData == null || !orderData.getAccount().getId().equals(account.getId())) {
		return JsonResponses.UnknownOrder;
	}
	Attachment attachment = new Attachment.ColoredCoinsBidOrderCancellation(orderId);
	return createTransaction(req, account, attachment);
	*/
}

module.exports = CancelBidOrder;
