/**!
 * LibreMoney 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */


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
