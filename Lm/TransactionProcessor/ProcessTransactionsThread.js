/**!
 * LibreMoney ProcessTransactionsThread 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

//private final Runnable ProcessTransactionsThread = new Runnable() {

/*
private final JSONStreamAware getUnconfirmedTransactionsRequest;
{
	JSONObject request = new JSONObject();
	request.put("requestType", "getUnconfirmedTransactions");
	getUnconfirmedTransactionsRequest = JSON.prepareRequest(request);
}
*/

function Run() {
	/*
	try {
		try {
			Peer peer = Peers.getAnyPeer(Peer.State.CONNECTED, true);
			if (peer == null) {
				return;
			}
			JSONObject response = peer.send(getUnconfirmedTransactionsRequest);
			if (response == null) {
				return;
			}
			JSONArray transactionsData = (JSONArray)response.get("unconfirmedTransactions");
			if (transactionsData == null || transactionsData.size() == 0) {
				return;
			}
			try {
				processPeerTransactions(transactionsData, false);
			} catch (RuntimeException e) {
				peer.blacklist(e);
			}
		} catch (Exception e) {
			Logger.logDebugMessage("Error processing unconfirmed transactions from peer", e);
		}
	} catch (Throwable t) {
		Logger.logMessage("CRITICAL ERROR. PLEASE REPORT TO THE DEVELOPERS.\n" + t.toString());
		t.printStackTrace();
		System.exit(1);
	}
	*/
}


exports.Run = Run;
