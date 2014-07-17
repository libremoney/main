/*
import nxt.peer.Peer;
import nxt.peer.Peers;
import static nxt.http.JSONResponses.MISSING_PEER;
import static nxt.http.JSONResponses.UNKNOWN_PEER;
*/

function Main(req, res) {
	res.send('This is not implemented');
	/*
	static final GetPeer instance = new GetPeer();

	private GetPeer() {
		super("peer");
	}

	JSONStreamAware processRequest(HttpServletRequest req) {
		String peerAddress = req.getParameter("peer");
		if (peerAddress == null) {
			return MISSING_PEER;
		}
		Peer peer = Peers.getPeer(peerAddress);
		if (peer == null) {
			return UNKNOWN_PEER;
		}
		return JSONData.peer(peer);
	}
	*/
}

module.exports = Main;
