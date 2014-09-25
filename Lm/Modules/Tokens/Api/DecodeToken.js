/**!
 * LibreMoney DecodeToken api 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var JsonData = require(__dirname + '/../JsonData');
var JsonResponses = require(__dirname + '/../JsonResponses');
var Tokens = require(__dirname + '/../../Tokens');


//super(new APITag[] {APITag.TOKENS}, "website", "token");
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
