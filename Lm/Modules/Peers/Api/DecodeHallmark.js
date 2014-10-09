/**!
 * LibreMoney DecodeHallmark api 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

if (typeof module !== "undefined") {
	var JsonResponses = require(__dirname + '/../JsonResponses');
	var Hallmark = require(__dirname + '/../Hallmark');
	var PeerJsonData = require(__dirname + '/../PeerJsonData');
}


//super(new APITag[] {APITag.TOKENS}, "hallmark");
function DecodeHallmark(req, res) {
	var hallmarkValue = req.query.hallmark;
	if (!hallmarkValue) {
		res.json(JsonResponses.Missing("hallmark"));
		return;
	}
	try {
		var hallmark = Hallmark.ParseHallmark(hallmarkValue);
		res.json(PeerJsonData.Hallmark(hallmark));
	} catch (e) {
		res.json(JsonResponses.Incorrect("hallmark"));
	}
}


if (typeof module !== "undefined") {
	module.exports = DecodeHallmark;
}