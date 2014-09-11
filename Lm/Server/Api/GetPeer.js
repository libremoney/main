/**!
 * LibreMoney GetPeer 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

/*
import nxt.peer.Peer;
import nxt.peer.Peers;
import static nxt.http.JSONResponses.MISSING_PEER;
import static nxt.http.JSONResponses.UNKNOWN_PEER;
*/

//super(new APITag[] {APITag.INFO}, "peer");
function GetPeer(req, res) {
	res.send('This is not implemented');
	/*
	String peerAddress = req.getParameter("peer");
	if (peerAddress == null) {
		return MISSING_PEER;
	}
	Peer peer = Peers.getPeer(peerAddress);
	if (peer == null) {
		return UNKNOWN_PEER;
	}
	return JSONData.peer(peer);
	*/
}

module.exports = GetPeer;
