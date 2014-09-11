/**!
 * LibreMoney CancelAskOrder api 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var ColoredCoins = require(__dirname + '/../../ColoredCoins');
var CreateTransaction = require(__dirname + '/../CreateTransaction');
var JsonResponses = require(__dirname + '/../JsonResponses');


//super(new APITag[] {APITag.AE, APITag.CREATE_TRANSACTION}, "order");
function CancelAskOrder(req, res) {
	var orderId = ParameterParser.GetOrderId(req);
	var account = ParameterParser.GetSenderAccount(req);
	var orderData = Order.Ask.GetAskOrder(orderId);
	if (!orderData || !orderData.GetAccount().GetId() == account.GetId()) {
		res.send(JsonResponses.UnknownOrder);
		return;
	}
	var attachment = ColoredCoins.CreateColoredCoinsAskOrderCancellationAttachment(orderId);
	res.send(CreateTransaction(req, res, account, null, null, attachment));
}

module.exports = CancelAskOrder;
