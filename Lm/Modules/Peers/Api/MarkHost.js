/**!
 * LibreMoney MarkHost api 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

// deprecated - SecretPhrase->Signature

if (typeof module !== "undefined") {
	var Constants = require(__dirname + "/../../../Lib/Constants");
	var JsonResponses = require(__dirname + "/../../../Core/Server/JsonResponses");
	var Hallmark = require(__dirname + "/../Hallmark");
}


//super(new APITag[] {APITag.TOKENS}, "secretPhrase", "host", "weight", "date");
function MarkHost(req, res) {
	var secretPhrase = req.query.secretPhrase;
	var host = req.query.host;
	var weightValue = req.query.weight;
	var dateValue = req.query.date;
	if (!secretPhrase) {
		res.json(JsonResponses.Missing("secretPhrase"));
		return;
	} else if (!host) {
		res.json(JsonResponses.Missing("host"));
		return;
	} else if (!weightValue) {
		res.json(JsonResponses.Missing("weight"));
		return;
	} else if (!dateValue) {
		res.json(JsonResponses.Missing("date"));
		return;
	}

	if (host.length > 100) {
		res.json(JsonResponses.Incorrect("host", "(the length exceeds 100 chars limit)"));
		return;
	}

	var weight;
	try {
		weight = parseInt(weightValue);
		if (weight <= 0 || weight > Constants.MaxBalanceLm) {
			res.json(JsonResponses.Incorrect("weight"));
			return;
		}
	} catch (e) {
		res.json(JsonResponses.Incorrect("weight"));
		return;
	}

	try {
		var hallmark = Hallmark.GenerateHallmark(secretPhrase, host, weight, Hallmark.ParseDate(dateValue));
		res.json({hallmark: hallmark});
	} catch (e) {
		res.json(JsonResponses.Incorrect("date"));
	}
}


if (typeof module !== "undefined") {
	module.exports = MarkHost;
}
