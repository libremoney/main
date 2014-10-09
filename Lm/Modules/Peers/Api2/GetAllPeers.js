/**!
 * LibreMoney GetAllPeers api 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

if (typeof module !== "undefined") {
	var PeerProcessor = require(__dirname + "/../PeerProcessor");
	var ResponseHelper = require(__dirname + "/../ResponseHelper");
}


function GetAllPeers(req, res) {
	var peersData = [];
	var peers = PeerProcessor.GetActivePeersArr();
	for (var id in peers) {
		if (peers.HasOwnProperty(id)) {
			peersData.push(peers[id].GetData());
		}
	}
	ResponseHelper.End200Json(res, peersData);
}


if (typeof module !== "undefined") {
	module.exports = GetAllPeers;
}
