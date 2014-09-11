/**!
 * LibreMoney 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

/*
import org.json.simple.JSONObject;
import org.json.simple.JSONStreamAware;
*/

// GetInfo = PeerServlet.PeerRequestHandler

function GetInfo(request, peer) {
	/*
	PeerImpl peerImpl = (PeerImpl)peer;
	String announcedAddress = (String)request.get("announcedAddress");
	if (announcedAddress != null && (announcedAddress = announcedAddress.trim()).length() > 0) {
		if (peerImpl.getAnnouncedAddress() != null && ! announcedAddress.equals(peerImpl.getAnnouncedAddress())) {
			// force verification of changed announced address
			peerImpl.setState(Peer.State.NON_CONNECTED);
		}
		peerImpl.setAnnouncedAddress(announcedAddress);
	}
	String application = (String)request.get("application");
	if (application == null) {
		application = "?";
	}
	peerImpl.setApplication(application.trim());

	String version = (String)request.get("version");
	if (version == null) {
		version = "?";
	}
	peerImpl.setVersion(version.trim());

	String platform = (String)request.get("platform");
	if (platform == null) {
		platform = "?";
	}
	peerImpl.setPlatform(platform.trim());

	peerImpl.setShareAddress(Boolean.TRUE.equals(request.get("shareAddress")));
	peerImpl.setLastUpdated(Convert.getEpochTime());

	//peerImpl.setState(Peer.State.CONNECTED);
	Peers.NotifyListeners(Peers.Event.ADDED_ACTIVE_PEER, peerImpl);

	return Peers.myPeerInfoResponse;
	*/
}

module.exports = GetInfo;
