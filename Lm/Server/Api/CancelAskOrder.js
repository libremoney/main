/**!
 * LibreMoney 0.0
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var ColoredCoins = require(__dirname + '/../../ColoredCoins');
var CreateTransaction = require(__dirname + '/../CreateTransaction');
var JsonResponses = require(__dirname + '/../JsonResponses');


//super("order");
function CancelAskOrder(req, res) {
	var orderId = ParameterParser.GetOrderId(req);
	var account = ParameterParser.GetSenderAccount(req);
	var orderData = Order.Ask.GetAskOrder(orderId);
	if (!orderData || !orderData.GetAccount().GetId() == account.GetId()) {
		return JsonResponses.UnknownOrder;
	}
	var attachment = ColoredCoins.CreateColoredCoinsAskOrderCancellationAttachment(orderId);
	return CreateTransaction(req, res, account, null, null, attachment);
}

module.exports = CancelAskOrder;
