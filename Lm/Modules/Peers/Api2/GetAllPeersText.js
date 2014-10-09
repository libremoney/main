/**!
 * LibreMoney GetAllPeersText api 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

if (typeof module !== "undefined") {
	var PeersDb = require(__dirname + "/../PeerDb");
	var PeerProcessor = require(__dirname + "/../PeerProcessor");
	var Peers = require(__dirname + "/../Peers");
	var ResponseHelper = require(__dirname + "/../../../Core/Server/ResponseHelper");
}


function GetAllPeersText(req, res) {
	var peers = PeerProcessor.GetActivePeersArr();
	var activePeersStr = "";
	for (var id in peers) {
		if (peers.HasOwnProperty(id)) {
			activePeersStr += JSON.stringify(peers[id].GetData()) + "\n<br/>";
		}
	}
	PeersDb.GetAllPeersList(function(err, archivedPeers) {
		if (err) {
			ResponseHelper.End200Json(res, err);
			return;
		}
		ResponseHelper.End200Text(res, "Active peers:\n" + JSON.stringify(activePeersStr + "\n<br/><br/><br/>\n\nArchived Peers:\n" + JSON.stringify(archivedPeers)));
	});
}


if (typeof module !== "undefined") {
	module.exports = GetAllPeersText;
}
