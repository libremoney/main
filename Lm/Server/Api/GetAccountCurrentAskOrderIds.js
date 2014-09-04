/**!
 * LibreMoney GetAccountCurrentAskOrderIds api 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

/*
import nxt.Order;
*/

var Convert = require(__dirname + '/../../Util/Convert');
var JsonResponses = require(__dirname + '/../JsonResponses');
var ParameterParser = require(__dirname + '/../ParameterParser');


//super("account", "asset");
function GetAccountCurrentAskOrderIds(req, res) {
	var accountId = ParameterParser.GetAccount(req).GetId();
	var assetId;
	try {
		assetId = Convert.parseUnsignedLong(req.query.asset);
	} catch (e) {
		// ignore
	}

	/*
	var orderIds = new Array();
	for (Order.Ask askOrder : Order.Ask.getAllAskOrders()) {
		if ((assetId == null || askOrder.getAssetId().equals(assetId)) && askOrder.getAccount().getId().equals(accountId)) {
			orderIds.add(Convert.toUnsignedLong(askOrder.getId()));
		}
	}

	JSONObject response = new JSONObject();
	response.put("askOrderIds", orderIds);
	return response;
	*/
	res.send('This is not implemented');
}

module.exports = GetAccountCurrentAskOrderIds;
