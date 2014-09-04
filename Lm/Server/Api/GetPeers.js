/**!
 * LibreMoney GetPeers 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

/*
import nxt.peer.Peer;
import nxt.peer.Peers;
*/

function GetPeers(req, res) {
	res.send('This is not implemented');
	/*
	JSONArray peers = new JSONArray();
	for (Peer peer : Peers.getAllPeers()) {
		peers.add(peer.getPeerAddress());
	}
	JSONObject response = new JSONObject();
	response.put("peers", peers);
	return response;
	*/
}

module.exports = GetPeers;
