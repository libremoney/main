/*
import nxt.NxtException;
import nxt.Trade;
*/

function Main(req, res) {
	res.send('This is not implemented');
	/*
	static final GetTrades instance = new GetTrades();

	private GetTrades() {
		super("asset", "firstIndex", "lastIndex");
	}

	JSONStreamAware processRequest(HttpServletRequest req) throws NxtException {

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
	}
	*/
}

module.exports = Main;
