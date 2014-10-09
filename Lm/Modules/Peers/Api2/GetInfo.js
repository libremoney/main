/**!
 * LibreMoney GetInfo api 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

if (typeof module !== "undefined") {
	var Convert = require(__dirname + '/../../../Util/Convert');
	var Peers = require(__dirname + '/../Peers');
}


function GetInfo(req, res, peer) {
	var peerImpl = peer;
	var announcedAddress = req.query.announcedAddress;
	if (announcedAddress != null && (announcedAddress = announcedAddress.trim()).length() > 0) {
		if (peerImpl.GetAnnouncedAddress() != null && announcedAddress != peerImpl.GetAnnouncedAddress()) {
			// force verification of changed announced address
			peerImpl.SetState(Peers.State.NON_CONNECTED);
		}
		peerImpl.SetAnnouncedAddress(announcedAddress);
	}
	var application = req.query.application;
	if (!application) {
		application = "?";
	}
	peerImpl.SetApplication(application.trim());

	var version = req.query.version;
	if (!version) {
		version = "?";
	}
	peerImpl.SetVersion(version.trim());

	var platform = req.query.platform;
	if (!platform) {
		platform = "?";
	}
	peerImpl.SetPlatform(platform.trim());

	peerImpl.SetShareAddress(req.query.shareAddress == true));
	peerImpl.SetLastUpdated(Convert.GetEpochTime());

	//peerImpl.setState(Peer.State.CONNECTED);
	Peers.NotifyListeners(Peers.Event.ADDED_ACTIVE_PEER, peerImpl);

	res.json(Peers.myPeerInfoResponse);
}


if (typeof module !== "undefined") {
	module.exports = GetInfo;
}
