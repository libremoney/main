/*
import nxt.Nxt;
import nxt.util.JSON;
import org.json.simple.JSONObject;
import org.json.simple.JSONStreamAware;
*/

function ProcessTransactions() {
	return this;
}

/*
static final ProcessTransactions instance = new ProcessTransactions();
*/

function ProcessRequest(request, peer) {
	/*
	try {
		Nxt.getTransactionProcessor().processPeerTransactions(request);
	} catch (RuntimeException e) {
		peer.blacklist(e);
	}
	return JSON.emptyJSON;
	*/
}

ProcessTransactions.prototype.ProcessRequest = ProcessRequest;


exports.Create = ProcessTransactions;
