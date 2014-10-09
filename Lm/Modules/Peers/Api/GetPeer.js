/**!
 * LibreMoney GetPeer 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

if (typeof module !== "undefined") {
	var JsonResponses = require(__dirname + "/../../../Core/Server/JsonResponses");
	var PeerJsonData = require(__dirname + "/../PeerJsonData");
	var Peers = require(__dirname + "/../Peers");
}


//super(new APITag[] {APITag.INFO}, "peer");
function GetPeer(req, res) {
	var peerAddress = req.query.peer;
	if (!peerAddress) {
		res.json(JsonResponses.Missing("peer"));
		return;
	}
	var peer = Peers.GetPeer(peerAddress);
	if (!peer) {
		res.json(JsonResponses.Unknown("peer"));
		return;
	}
	res.json(PeerJsonData.Peer(peer));
}


if (typeof module !== "undefined") {
	module.exports = GetPeer;
}
