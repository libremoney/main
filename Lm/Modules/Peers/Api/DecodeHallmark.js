/**!
 * LibreMoney DecodeHallmark api 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var JsonResponses = require(__dirname + '/../JsonResponses');
var Hallmark = require(__dirname + '/../Hallmark');


//super(new APITag[] {APITag.TOKENS}, "hallmark");
function DecodeHallmark(req, res) {
	var hallmarkValue = req.query.hallmark;
	if (!hallmarkValue) {
		res.send(JsonResponses.MissingHallmark);
		return;
	}
	try {
		var hallmark = Hallmark.ParseHallmark(hallmarkValue);
		res.send(JsonData.Hallmark(hallmark));
	} catch (e) {
		res.send(JsonResponses.IncorrectHallmark);
	}
}


module.exports = DecodeHallmark;
