/**!
 * LibreMoney 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

/*
import nxt.peer.Peer;
*/


// res = user
function RemoveBlacklistedPeer(req, res) {
	res.send('This is not implemented');
	/*
	if (Users.allowedUserHosts == null && ! InetAddress.getByName(req.getRemoteAddr()).isLoopbackAddress()) {
		return JsonResponses.LocalUsersOnly;
	} else {
		int index = Integer.parseInt(req.getParameter("peer"));
		Peer peer = Users.getPeer(index);
		if (peer != null && peer.isBlacklisted()) {
			peer.unBlacklist();
		}
	}
	return null;
	*/
}


module.exports = RemoveBlacklistedPeer;
