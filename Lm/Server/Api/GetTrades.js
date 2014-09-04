/**!
 * LibreMoney GetTrades api 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

/*
import nxt.NxtException;
import nxt.Trade;
*/

//super("asset", "firstIndex", "lastIndex");
function GetTrades(req, res) {
	res.send('This is not implemented');
	/*
	Long assetId = ParameterParser.getAsset(req).getId();

	int firstIndex, lastIndex;
	try {
		firstIndex = Integer.parseInt(req.getParameter("firstIndex"));
		if (firstIndex < 0) {
			firstIndex = 0;
		}
	} catch (NumberFormatException e) {
		firstIndex = 0;
	}
	try {
		lastIndex = Integer.parseInt(req.getParameter("lastIndex"));
	} catch (NumberFormatException e) {
		lastIndex = Integer.MAX_VALUE;
	}

	JSONObject response = new JSONObject();

	JSONArray tradesData = new JSONArray();
	try {
		List<Trade> trades = Trade.getTrades(assetId);
		for (int i = firstIndex; i <= lastIndex && i < trades.size(); i++) {
			tradesData.add(JSONData.trade(trades.get(trades.size() - 1 - i)));
		}
	} catch (RuntimeException e) {
		response.put("error", e.toString());
	}
	response.put("trades", tradesData);

	return response;
	*/
}

module.exports = GetTrades;
