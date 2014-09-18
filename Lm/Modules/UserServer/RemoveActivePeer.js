/**!
 * LibreMoney 0.0
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

/*
import nxt.peer.Peer;
*/


// res = user
function RemoveActivePeer(req, res) {
	res.send('This is not implemented');
	//return UserRequestHandler.Create();
	/*
	if (Users.allowedUserHosts == null && ! InetAddress.getByName(req.getRemoteAddr()).isLoopbackAddress()) {
		return JsonResponses.LOCAL_USERS_ONLY;
	} else {
		int index = Integer.parseInt(req.getParameter("peer"));
		Peer peer= Users.getPeer(index);
		if (peer != null && ! peer.isBlacklisted()) {
			peer.deactivate();
		}
	}
	return null;
	*/
}


module.exports = RemoveActivePeer;
