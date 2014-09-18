/**!
 * LibreMoney 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

/*
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.JSONStreamAware;
*/

// GetPeers = PeerServlet.PeerRequestHandler

function GetPeers(request, peer) {
    /*
    JSONObject response = new JSONObject();

    JSONArray peers = new JSONArray();
    for (Peer otherPeer : Peers.getAllPeers()) {

        if (! otherPeer.isBlacklisted() && otherPeer.getAnnouncedAddress() != null
                && otherPeer.getState() == Peer.State.CONNECTED && otherPeer.shareAddress()) {

            peers.add(otherPeer.getAnnouncedAddress());

        }

    }
    response.put("peers", peers);
    */

    return response;
}

module.exports = GetPeers;
