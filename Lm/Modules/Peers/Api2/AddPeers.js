/**!
 * LibreMoney AddPeers api 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

if (typeof module !== "undefined") {
	var Peers = require(__dirname + "/../Peers");
}


function AddPeers(req, res) {
	var peers = req.query.peers;
	if (peers != null && Peers.getMorePeers) {
		for (var i in peers) {
			var announcedAddress = peers[i];
			Peers.AddPeer(announcedAddress);
		}
	}
	res.json({});
}


if (typeof module !== "undefined") {
	module.exports = AddPeers;
}
