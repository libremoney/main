/**!
 * LibreMoney StartForging api 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

/*
import nxt.Generator;
import static nxt.http.JSONResponses.MISSING_SECRET_PHRASE;
import static nxt.http.JSONResponses.UNKNOWN_ACCOUNT;
*/

//super(new APITag[] {APITag.FORGING}, "secretPhrase");
function StartForging(req, res) {
	res.send('This is not implemented');
	/*
	String secretPhrase = req.getParameter("secretPhrase");
	if (secretPhrase == null) {
		return MISSING_SECRET_PHRASE;
	}

	Generator generator = Generator.startForging(secretPhrase);
	if (generator == null) {
		return UNKNOWN_ACCOUNT;
	}

	JSONObject response = new JSONObject();
	response.put("deadline", generator.getDeadline());
	return response;
	*/
}

module.exports = StartForging;
