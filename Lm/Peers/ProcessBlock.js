/*
import nxt.Nxt;
import nxt.NxtException;
import nxt.util.Convert;
import nxt.util.JSON;
import org.json.simple.JSONObject;
import org.json.simple.JSONStreamAware;
*/

var PeerRequestHandler = require(__dirname + '/PeerRequestHandler');


function ProcessBlock() {
	obj = PeerRequestHandler.Create();
	return obj;
}

/*
static final ProcessBlock instance = new ProcessBlock();
*/

/*
private static final JSONStreamAware ACCEPTED;
static {
	JSONObject response = new JSONObject();
	response.put("accepted", true);
	ACCEPTED = JSON.prepare(response);
}
*/

/*
private static final JSONStreamAware NOT_ACCEPTED;
static {
	JSONObject response = new JSONObject();
	response.put("accepted", false);
	NOT_ACCEPTED = JSON.prepare(response);
}
*/

function ProcessRequest(request, peer) {
	/*
	try {
		if (! Nxt.getBlockchain().getLastBlock().getId().equals(Convert.parseUnsignedLong((String) request.get("previousBlock")))) {
			// do this check first to avoid validation failures of future blocks and transactions
			// when loading blockchain from scratch
			return NOT_ACCEPTED;
		}
		Nxt.getBlockchainProcessor().processPeerBlock(request);
		return ACCEPTED;
	} catch (NxtException|RuntimeException e) {
		if (peer != null) {
			peer.blacklist(e);
		}
		return NOT_ACCEPTED;
	}
	*/
}

ProcessBlock.prototype.ProcessRequest = ProcessRequest;


exports.Create = ProcessBlock;
