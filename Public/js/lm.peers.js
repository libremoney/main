/**
 * @depends {lm.js}
 */
var Lm = (function(Lm, $, undefined) {

	function PeersPage() {
		Lm.SendRequest("getPeers+", {
			"active": "true"
		}, function(response) {
			GetPeers_On(response);
		});
	}

	function GetPeers_On(response) {
		if (response.peers && response.peers.length) {
			var peers = {};
			var nrPeers = 0;

			for (var i = 0; i < response.peers.length; i++) {
				Lm.SendRequest("getPeer+", {
					"peer": response.peers[i]
				}, function(peer, input) {
					GetPeer_On(peers, nrPeers, peer, input)
				});
			}
		} else {
			$("#peers_uploaded_volume, #peers_downloaded_volume, #peers_connected, #peers_up_to_date").html("0").removeClass("loading_dots");
			Lm.DataLoaded();
		}
	}

	function GetPeer_On(peers, nrPeers, peer, input) {
		if (Lm.CurrentPage != "peers") {
			peers = {};
			return;
		}

		if (!peer.errorCode) {
			peers[input.peer] = peer;
		}

		nrPeers++;

		if (nrPeers == response.peers.length) {
			var rows = "";
			var uploaded = 0;
			var downloaded = 0;
			var connected = 0;
			var upToDate = 0;
			var activePeers = 0;

			for (var i = 0; i < nrPeers; i++) {
				var peer = peers[response.peers[i]];

				if (!peer) {
					continue;
				}

				activePeers++;
				downloaded += peer.downloadedVolume;
				uploaded += peer.uploadedVolume;
				if (peer.state == 1) {
					connected++;
				}

				var versionToCompare = (!Lm.IsTestNet ? Lm.NormalVersion.versionNr : Lm.State.version);

				if (Lm.VersionCompare(peer.version, versionToCompare) >= 0) {
					upToDate++;
				}

				rows += "<tr><td>" + (peer.state == 1 ? "<i class='fa fa-check-circle' style='color:#5cb85c' title='Connected'></i>" :
					"<i class='fa fa-times-circle' style='color:#f0ad4e' title='Disconnected'></i>") + "&nbsp;&nbsp;" +
					(peer.announcedAddress ? String(peer.announcedAddress).escapeHTML() : "No name") + "</td>" +
					"<td" + (peer.weight > 0 ? " style='font-weight:bold'" : "") + ">" + Lm.FormatWeight(peer.weight) + "</td>" +
					"<td>" + Lm.FormatVolume(peer.downloadedVolume) + "</td>" +
					"<td>" + Lm.FormatVolume(peer.uploadedVolume) + "</td>" +
					"<td><span class='label label-" +
					(Lm.VersionCompare(peer.version, versionToCompare) >= 0 ? "success" : "danger") + "'>" +
					(peer.application && peer.version ? String(peer.application).escapeHTML() + " " +
						String(peer.version).escapeHTML() : "?") + "</label></td>" +
					"<td>" + (peer.platform ? String(peer.platform).escapeHTML() : "?") + "</td></tr>";
			}

			$("#peers_uploaded_volume").html(Lm.FormatVolume(uploaded)).removeClass("loading_dots");
			$("#peers_downloaded_volume").html(Lm.FormatVolume(downloaded)).removeClass("loading_dots");
			$("#peers_connected").html(connected).removeClass("loading_dots");
			$("#peers_up_to_date").html(upToDate + '/' + activePeers).removeClass("loading_dots");

			Lm.DataLoaded(rows);
		}
	}

	function PeersIncoming() {
		Lm.LoadPage("peers");
	}


	Lm.Pages.Peers = PeersPage;
	Lm.Incoming.Peers = PeersIncoming;
	return Lm;
}(Lm || {}, jQuery));