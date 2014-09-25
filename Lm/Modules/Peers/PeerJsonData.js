/*!
 * LibreMoney PeerJsonData 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

if (typeof module !== "undefined") {
	var Convert = require(__dirname + '/../../Lib/Util/Convert');
}


var PeerJsonData = function() {
	function FormatDate(date) {
		var year = date / 10000;
		var month = (date % 10000) / 100;
		var day = date % 100;
		return (year < 10 ? "000" : (year < 100 ? "00" : (year < 1000 ? "0" : ""))) + year + "-" + (month < 10 ? "0" : "") + month + "-" + (day < 10 ? "0" : "") + day;
	}

	function Hallmark(hallmark) {
		var json = {};
		PutAccount(json, "account", Accounts.GetId(hallmark.GetPublicKey()));
		json.host = hallmark.GetHost();
		json.weight = hallmark.GetWeight();
		var dateString = FormatDate(hallmark.GetDate());
		json.date = dateString;
		json.valid = hallmark.IsValid();
		return json;
	}

	function Peer(peer) {
		var json = {};
		json.state = peer.GetState().Ordinal();
		json.announcedAddress = peer.GetAnnouncedAddress();
		json.shareAddress = peer.ShareAddress();
		if (peer.GetHallmark() != null) {
			json.hallmark = peer.GetHallmark().GetHallmarkString();
		}
		json.weight = peer.GetWeight();
		json.downloadedVolume = peer.GetDownloadedVolume();
		json.uploadedVolume = peer.GetUploadedVolume();
		json.application = peer.GetApplication();
		json.version = peer.GetVersion();
		json.platform = peer.GetPlatform();
		json.blacklisted = peer.IsBlacklisted();
		json.lastUpdated = peer.GetLastUpdated();
		return json;
	}


	return {
		Hallmark: Hallmark,
		Peer: Peer
	}
}();


if (typeof module !== "undefined") {
	module.exports = PeerJsonData;
}
