/**!
 * LibreMoney 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */


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
