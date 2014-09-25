/**!
 * LibreMoney PeerDb 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

if (typeof module !== "undefined") {
	var Logger = require(__dirname + '/../../Lib/Util/Logger').GetLogger(module);
}


var PeerDb = function() {
}

PeerDb.AddPeer = function(peer, callback) {
	var peerTmp = peer.GetData();
	peerTmp.id = peer.host + ":" + peer.port;
	var peerModel = Db.GetModel('peer');
	peerModel.insert(peerTmp, function(err, newDoc) {
		if (err) {
			Logger.error("Peer insert ERROR", err);
			callback(err);
			return;
		}
		Logger.DBdbg("PeersDb.addPeer ok: " + peerTmp.id);
		if (typeof callback === "function") {
			callback(null, newDoc);
		}
	});
}

PeerDb.AddPeers = function(peers, callback) {
	throw new Error('This is not implemented');
	/*
	try (Connection con = Db.getConnection();
		 PreparedStatement pstmt = con.prepareStatement("INSERT INTO peer (address) values (?)")) {
		for (String peer : peers) {
			pstmt.setString(1, peer);
			pstmt.executeUpdate();
		}
		con.commit();
	} catch (SQLException e) {
		throw new RuntimeException(e.toString(), e);
	}
	*/
}

PeerDb.AddReplacePeer = function(peer, callback) {
	var peerTmp = peer.GetData();
	peerTmp.id = peer.host + ":" + peer.port;
	var peerModel = Db.GetModel('peer');
	peerModel.update({
		id: peerTmp.id
	}, peerTmp, {}, function(err, numReplaced) {
		if (err) {
			Logger.error("Peer insert ERROR", err);
			return;
		}
		Logger.DBdbg("PeersDb.addReplacePeer " + peerTmp.id + " numReplaced " + numReplaced);
		if (numReplaced > 0) {
			if (typeof callback === "function") {
				callback(null, numReplaced);
			}
		} else {
			PeersDb.AddPeer(peer, callback);
		}
	});
}

PeerDb.DeletePeers = function(peers) {
	throw new Error('This is not implemented');
	/*
	try (Connection con = Db.getConnection();
		 PreparedStatement pstmt = con.prepareStatement("DELETE FROM peer WHERE address = ?")) {
		for (String peer : peers) {
			pstmt.setString(1, peer);
			pstmt.executeUpdate();
		}
		con.commit();
	} catch (SQLException e) {
		throw new RuntimeException(e.toString(), e);
	}
	*/
}

PeerDb.GetAllPeersList = function(callback) {
	var q = {};
	PeersDb.GetPeersListByRs(q, callback);
}

PeerDb.GetPeersListByRs = function(q, callback) {
	var peerModel = Db.GetModel('peer');
	peerModel.find(q, function(err, docs) {
		if (!err) {
			if (typeof callback === "function") {
				callback(null, docs);
			}
		} else {
			Logger.error("Find Peer ERROR!!!", err);
		}
	});
}

PeerDb.LoadPeers = function() {
	throw new Error('This is not implemented');
	/*
	try (Connection con = Db.getConnection();
		 PreparedStatement pstmt = con.prepareStatement("SELECT * FROM peer")) {
		List<String> peers = new ArrayList<>();
		ResultSet rs = pstmt.executeQuery();
		while (rs.next()) {
			peers.add(rs.getString("address"));
		}
		rs.close();
		return peers;
	} catch (SQLException e) {
		throw new RuntimeException(e.toString(), e);
	}
	*/
}


if (typeof module !== "undefined") {
	module.exports = PeerDb;
}
