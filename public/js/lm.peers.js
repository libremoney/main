var Lm = (function(Lm, $, undefined) {

	function PeersPage() {
		var response;

		Lm.PageLoading();

		Lm.SendRequest("getPeers+", function(response) {
			if (response.peers && response.peers.length) {
				var peers = {};
				var nr_peers = 0;

				for (var i = 0; i < response.peers.length; i++) {
					Lm.SendRequest("getPeer+", {
						"peer": response.peers[i]
					}, function(peer, input) {
						if (Lm.CurrentPage != "peers") {
							peers = {};
							return;
						}

						if (!peer.errorCode) {
							peers[input.peer] = peer;
						}

						nr_peers++;

						if (nr_peers == response.peers.length) {
							var rows = "";
							var uploaded = 0;
							var downloaded = 0;
							var connected = 0;
							var up_to_date = 0;
							var active_peers = 0;

							for (var i = 0; i < nr_peers; i++) {
								var peer = peers[response.peers[i]];

								if (!peer) {
									continue;
								}

								if (peer.state != 0) {
									active_peers++;
									downloaded += peer.downloadedVolume;
									uploaded += peer.uploadedVolume;
									if (peer.state == 1) {
										connected++;
									}

									//todo check if response.version ends with "e" then we compare with betaversion instead..
									if (Lm.VersionCompare(peer.version, Lm.NormalVersion.versionNr) >= 0) {
										up_to_date++;
									}

									rows += "<tr><td>" + (peer.state == 1 ? "<i class='fa fa-check-circle' style='color:#5cb85c' title='Connected'></i>" :
										"<i class='fa fa-times-circle' style='color:#f0ad4e' title='Disconnected'></i>") + "&nbsp;&nbsp;" +
										(peer.announcedAddress ? String(peer.announcedAddress).escapeHTML() : "No name") + "</td>"+
										"<td" + (peer.weight > 0 ? " style='font-weight:bold'" : "") + ">" + Lm.FormatWeight(peer.weight) + "</td>"+
										"<td>" + Lm.FormatVolume(peer.downloadedVolume) + "</td>"+
										"<td>" + Lm.FormatVolume(peer.uploadedVolume) + "</td>"+
										"<td><span class='label label-" +
										(Lm.VersionCompare(peer.version, Lm.NormalVersion.versionNr) >= 0 ? "success" : "danger") + "'>" +
										(peer.application && peer.version ? String(peer.application).escapeHTML() + " " +
										String(peer.version).escapeHTML() : "?") + "</label></td>"+
										"<td>" + (peer.platform ? String(peer.platform).escapeHTML() : "?") + "</td></tr>";
								}
							}

							$("#peers_table tbody").empty().append(rows);
							Lm.DataLoadFinished($("#peers_table"));
							$("#peers_uploaded_volume").html(Lm.FormatVolume(uploaded)).removeClass("loading_dots");
							$("#peers_downloaded_volume").html(Lm.FormatVolume(downloaded)).removeClass("loading_dots");
							$("#peers_connected").html(connected).removeClass("loading_dots");
							$("#peers_up_to_date").html(up_to_date + '/' + active_peers).removeClass("loading_dots");

							peers = {};

							Lm.PageLoaded();
						}
					});

					if (Lm.CurrentPage != "peers") {
						peers = {};
						return;
					}
				}
			} else {
				$("#peers_table tbody").empty();
				Lm.DataLoadFinished($("#peers_table"));
				$("#peers_uploaded_volume, #peers_downloaded_volume, #peers_connected, #peers_up_to_date").html("0").removeClass("loading_dots");
				Lm.PageLoaded();
			}
		});
	}

	function IncomingPeers() {
		Lm.Pages.Peers();
	}


	Lm.Pages.Peers = PeersPage;
	Lm.Incoming.Peers = IncomingPeers;
	return Lm;
}(Lm || {}, jQuery));