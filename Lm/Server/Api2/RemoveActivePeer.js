/*
import nxt.peer.Peer;
import org.json.simple.JSONStreamAware;
*/

/*
import static nxt.user.JSONResponses.LOCAL_USERS_ONLY;
*/

function RemoveActivePeer() {
	return UserRequestHandler.Create();
}

/*
static final RemoveActivePeer instance = new RemoveActivePeer();
*/

function ProcessRequest(req, user) {
	/*
	if (Users.allowedUserHosts == null && ! InetAddress.getByName(req.getRemoteAddr()).isLoopbackAddress()) {
		return LOCAL_USERS_ONLY;
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


RemoveActivePeer.prototype.ProcessRequest = ProcessRequest;


exports.Create = RemoveActivePeer;
