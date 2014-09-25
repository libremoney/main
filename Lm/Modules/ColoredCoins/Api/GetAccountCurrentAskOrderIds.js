/**!
 * LibreMoney GetAccountCurrentAskOrderIds api 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var Convert = require(__dirname + '/../../Util/Convert');
var Core = require(__dirname + '/../../Core');
var JsonResponses = require(__dirname + '/../../Server/JsonResponses');


//super(new APITag[] {APITag.ACCOUNTS, APITag.AE}, "account", "asset");
function GetAccountCurrentAskOrderIds(req, res) {
	Core.GetAccount(req.query.account, function(err, account) {
		if (err) {
			res.send(err);
			return;
		}
		var accountId = account.GetId()
		var assetId;
		try {
			assetId = Convert.ParseUnsignedLong(req.query.asset);
		} catch (e) {
			// ignore
		}

		/*
		TODO
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
		res.send({
			errorCode:100,
			errorDescription:'This is not implemented'
		});
	});
}


module.exports = GetAccountCurrentAskOrderIds;
