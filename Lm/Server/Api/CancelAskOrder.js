/**!
 * LibreMoney 0.0
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


//super("order");
function CancelAskOrder(req, res) {
	res.send('This is not implemented');    
	/*
	Long orderId = ParameterParser.getOrderId(req);
	Account account = ParameterParser.getSenderAccount(req);
	Order.Ask orderData = Order.Ask.getAskOrder(orderId);
	if (orderData == null || !orderData.getAccount().getId().equals(account.getId())) {
		return JsonResponsesUnknownOrder;
	}
	Attachment attachment = new Attachment.ColoredCoinsAskOrderCancellation(orderId);
	return createTransaction(req, account, attachment);
	*/
}

module.exports = CancelAskOrder;
