/**!
 * LibreMoney GetPeers 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

if (typeof module !== "undefined") {
	var Peers = require(__dirname + "/../Peers");
}


//super(new APITag[] {APITag.INFO}, "active");
function GetPeers(req, res) {
	var active = req.query.active;
	var peers = [];
	var ps;
	if (active == "true" || active == 1) {
		ps = Peers.GetActivePeers();
	} else {
		ps = Peers.GetAllPeers();
	}
	for (var i in ps) {
		peers.push(ps[i].GetPeerAddress());
	}
	res.json({
		peers: peers
	});
}


if (typeof module !== "undefined") {
	module.exports = GetPeers;
}
