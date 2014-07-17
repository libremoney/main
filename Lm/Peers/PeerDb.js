/*
import nxt.Db;
*/

function AddPeers(peers) {
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

function DeletePeers(peers) {
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

function LoadPeers() {
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


exports.AddPeers = AddPeers;
exports.DeletePeers = DeletePeers;
exports.LoadPeers = LoadPeers;