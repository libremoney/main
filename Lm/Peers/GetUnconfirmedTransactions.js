/*
import nxt.Nxt;
import nxt.Transaction;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.JSONStreamAware;
*/

// GetUnconfirmedTransactions = PeerServlet.PeerRequestHandler

/*
static final GetUnconfirmedTransactions instance = new GetUnconfirmedTransactions();
*/

/*
JSONStreamAware processRequest(JSONObject request, Peer peer) {
	JSONObject response = new JSONObject();

	JSONArray transactionsData = new JSONArray();
	for (Transaction transaction : Nxt.getTransactionProcessor().getAllUnconfirmedTransactions()) {

		transactionsData.add(transaction.getJSONObject());

	}
	response.put("unconfirmedTransactions", transactionsData);

	return response;
}
*/
