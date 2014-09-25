/**!
 * LibreMoney 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

/*
import nxt.Token;
*/

var JsonResponses = require(__dirname + '/../JsonResponses');
var Tokens = require(__dirname + '/../../Tokens');


function GenerateAuthorizationToken(req, res, user) {
	//return UserRequestHandler.Create();

	var secretPhrase = req.query.secretPhrase;
	if (! user.GetSecretPhrase().equals(secretPhrase)) {
		res.send(JsonResponses.InvalidSecretPhrase);
		return;
	}

	var response = {};
	response.response = "showAuthorizationToken";
	response.token = Tokens.GenerateToken(secretPhrase, req.query.website.trim());
	res.send(response);
}


module.exports = GenerateAuthorizationToken;
