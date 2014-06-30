/*
import nxt.Account;
import nxt.Nxt;
import nxt.NxtException;
import nxt.Transaction;
import nxt.util.DbIterator;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.JSONStreamAware;
*/

function Main(req, res) {
	//static final GetAccountTransactionIds instance = new GetAccountTransactionIds();
	res.send('This is not implemented');
	/*
	private GetAccountTransactionIds() {
		super("account", "timestamp", "type", "subtype");
	}

	JSONStreamAware processRequest(HttpServletRequest req) throws NxtException {

		Account account = ParameterParser.getAccount(req);
		int timestamp = ParameterParser.getTimestamp(req);

		byte type;
		byte subtype;
		try {
			type = Byte.parseByte(req.getParameter("type"));
		} catch (NumberFormatException e) {
			type = -1;
		}
		try {
			subtype = Byte.parseByte(req.getParameter("subtype"));
		} catch (NumberFormatException e) {
			subtype = -1;
		}

		JSONArray transactionIds = new JSONArray();
		try (DbIterator<? extends Transaction> iterator = Nxt.getBlockchain().getTransactions(account, type, subtype, timestamp)) {
			while (iterator.hasNext()) {
				Transaction transaction = iterator.next();
				transactionIds.add(transaction.getStringId());
			}
		}

		JSONObject response = new JSONObject();
		response.put("transactionIds", transactionIds);
		return response;

	}
	*/
}

module.exports = Main;
