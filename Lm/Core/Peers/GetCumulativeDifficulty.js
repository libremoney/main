/**!
 * LibreMoney 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

/*
import nxt.Block;
import nxt.Nxt;
import org.json.simple.JSONObject;
import org.json.simple.JSONStreamAware;
*/

// GetCumulativeDifficulty = PeerServlet.PeerRequestHandler

function GetCumulativeDifficulty(request, peer) {
	/*
	JSONObject response = new JSONObject();
	Block lastBlock = Nxt.getBlockchain().getLastBlock();
	response.put("cumulativeDifficulty", lastBlock.getCumulativeDifficulty().toString());
	response.put("blockchainHeight", lastBlock.getHeight());
	return response;
	*/
}

module.exports = GetCumulativeDifficulty;
