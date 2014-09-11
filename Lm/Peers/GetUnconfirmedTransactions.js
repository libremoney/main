/**!
 * LibreMoney 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

/*
import nxt.Nxt;
import nxt.Transaction;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.JSONStreamAware;
*/

// GetUnconfirmedTransactions = PeerServlet.PeerRequestHandler

function GetUnconfirmedTransactions(request, peer) {
	/*
	JSONObject response = new JSONObject();

	JSONArray transactionsData = new JSONArray();
	for (Transaction transaction : Nxt.getTransactionProcessor().getAllUnconfirmedTransactions()) {

		transactionsData.add(transaction.getJSONObject());

	}
	response.put("unconfirmedTransactions", transactionsData);
	*/

	return response;
}

module.exports = GetUnconfirmedTransactions;
