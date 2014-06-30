/*
import nxt.peer.Peer;
import nxt.peer.Peers;
*/

function Main(req, res) {
    res.send('This is not implemented');
    /*
    static final GetPeers instance = new GetPeers();
    JSONStreamAware processRequest(HttpServletRequest req) {
        JSONArray peers = new JSONArray();
        for (Peer peer : Peers.getAllPeers()) {
            peers.add(peer.getPeerAddress());
        }
        JSONObject response = new JSONObject();
        response.put("peers", peers);
        return response;
    }
    */
}

module.exports = Main;
