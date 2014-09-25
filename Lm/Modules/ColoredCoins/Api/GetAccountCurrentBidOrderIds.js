/**!
 * LibreMoney GetAccountCurrentBidOrderIds api 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

/*
import nxt.Order;
import nxt.util.Convert;
*/

var Convert = require(__dirname + '/../../Util/Convert');
var Core = require(__dirname + '/../../Core');


//super(new APITag[] {APITag.ACCOUNTS, APITag.AE}, "account", "asset");
function GetAccountCurrentBidOrderIds(req, res) {
	Core.GetAccount(req.query.account, function(err, account) {
		if (err) {
			res.send(err);
			return;
		}
		var accountId = account.GetId();
		var assetId;
		try {
			assetId = Convert.ParseUnsignedLong(req.query.asset);
		} catch (e) {
			// ignored
		}
		/*
		TODO
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
		res.send({
			errorCode:100,
			errorDescription:'This is not implemented'
		});
	});
}


module.exports = GetAccountCurrentBidOrderIds;
