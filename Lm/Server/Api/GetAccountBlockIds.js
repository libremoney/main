/*
import nxt.Account;
import nxt.Block;
import nxt.Nxt;
import nxt.NxtException;
import nxt.util.DbIterator;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.JSONStreamAware;
*/

function Main(req, res) {
	res.send('This is not implemented');    
	/*
	static final GetAccountBlockIds instance = new GetAccountBlockIds();

	private GetAccountBlockIds() {
		super("account", "timestamp");
	}

	JSONStreamAware processRequest(HttpServletRequest req) throws NxtException {
		Account account = ParameterParser.getAccount(req);
		int timestamp = ParameterParser.getTimestamp(req);

		JSONArray blockIds = new JSONArray();
		try (DbIterator<? extends Block> iterator = Nxt.getBlockchain().getBlocks(account, timestamp)) {
			while (iterator.hasNext()) {
				Block block = iterator.next();
				blockIds.add(block.getStringId());
			}
		}
		JSONObject response = new JSONObject();
		response.put("blockIds", blockIds);
		return response;
	}
	*/
}

module.exports = Main;
