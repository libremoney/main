/**!
 * LibreMoney 0.0
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

/*
import nxt.Token;
*/

var JsonData = require(__dirname + '/../JsonData');
var JsonResponses = require(__dirname + '/../JsonResponses');
var Tokens = require(__dirname + '/../../Tokens');


//super("website", "token");
function DecodeToken(req, res) {
	var website = req.query.website;
	var tokenString = req.query.token;
	if (!website) {
		res.send(JsonResponses.MissingWebsite);
		return;
	} else if (!tokenString) {
		res.send(JsonResponses.MissingToken);
		return;
	}
	try {
		var token = Tokens.ParseToken(tokenString, website.trim());
		res.send(JsonData.Token(token));
	} catch (e) {
		res.send(JsonResponses.IncorrectWebsite);
	}
}

module.exports = DecodeToken;
