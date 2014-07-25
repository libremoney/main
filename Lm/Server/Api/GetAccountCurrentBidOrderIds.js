/**!
 * LibreMoney 0.0
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

/*
import nxt.Order;
import nxt.util.Convert;
*/

var Convert = require(__dirname + '/../../Util/Convert');
var JsonResponses = require(__dirname + '/../JsonResponses');
var ParameterParser = require(__dirname + '/../ParameterParser');


//super("account", "asset");
function GetAccountCurrentBidOrderIds(req, res) {
	var accountId = ParameterParser.GetAccount(req).GetId();
	var assetId;
	try {
		assetId = Convert.ParseUnsignedLong(req.query.asset);
	} catch (e) {
		// ignored
	}
	/*
	JSONArray orderIds = new JSONArray();
	for (Order.Bid bidOrder : Order.Bid.getAllBidOrders()) {
		if ((assetId == null || bidOrder.getAssetId().equals(assetId)) && bidOrder.getAccount().getId().equals(accountId)) {
			orderIds.add(Convert.toUnsignedLong(bidOrder.getId()));
		}
	}
	JSONObject response = new JSONObject();
	response.put("bidOrderIds", orderIds);
	return response;
	*/
	res.send('This is not implemented');
}

module.exports = GetAccountCurrentBidOrderIds;
