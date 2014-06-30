/*
import nxt.NxtException;
import nxt.Trade;
*/

function Main(req, res) {
	res.send('This is not implemented');
	/*
	static final GetAllTrades instance = new GetAllTrades();

	private GetAllTrades() {
		super("timestamp");
	}
	
	JSONStreamAware processRequest(HttpServletRequest req) throws NxtException {
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
	}
	*/
}

module.exports = Main;
