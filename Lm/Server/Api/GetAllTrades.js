/**!
 * LibreMoney GetAllTrades api 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

/*
import nxt.NxtException;
import nxt.Trade;
*/

//super("timestamp");
function GetAllTrades(req, res) {
	res.send('This is not implemented');
	/*
	int timestamp = ParameterParser.getTimestamp(req);
	JSONObject response = new JSONObject();
	JSONArray tradesData = new JSONArray();
	try {
		Collection<List<Trade>> trades = Trade.getAllTrades();
		for (List<Trade> assetTrades : trades) {
			for (Trade trade : assetTrades) {
				if (trade.getTimestamp() >= timestamp) {
					tradesData.add(JSONData.trade(trade));
				}
			}
		}
	} catch (RuntimeException e) {
		response.put("error", e.toString());
	}
	response.put("trades", tradesData);
	return response;
	*/
}

module.exports = GetAllTrades;
