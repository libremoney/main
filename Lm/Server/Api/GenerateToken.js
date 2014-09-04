/**!
 * LibreMoney GenerateToken api 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

/*
import nxt.Token;
*/

var JsonResponses = require(__dirname + '/../JsonResponses');
var Tokens = require(__dirname + '/../../Tokens');


//super(new APITag[] {APITag.TOKENS}, "website", "secretPhrase");
// POST
function GenerateToken(req, res) {
	var secretPhrase = req.query.secretPhrase;
	var website = req.query.website;
	if (!secretPhrase) {
		res.send(JsonResponses.MissingSecretPhrase);
		return;
	} else if (!website) {
		res.send(JsonResponses.MissingWebsite);
		return;
	}
	try {
		var response = {};
		response.token = Tokens.GenerateToken(secretPhrase, website.trim());
		res.send(response);
	} catch (e) {
		res.send(JsonResponses.IncorrectWebsite);
	}
}


module.exports = GenerateToken;
