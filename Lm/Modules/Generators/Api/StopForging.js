/**!
 * LibreMoney StopForging api 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

/*
import nxt.Generator;
import static nxt.http.JSONResponses.MISSING_SECRET_PHRASE;
*/

//super(new APITag[] {APITag.FORGING}, "secretPhrase");
function StopForging(req, res) {
	res.send('This is not implemented');
	/*
	String secretPhrase = req.getParameter("secretPhrase");
	if (secretPhrase == null) {
		return MISSING_SECRET_PHRASE;
	}
	Generator generator = Generator.stopForging(secretPhrase);
	JSONObject response = new JSONObject();
	response.put("foundAndStopped", generator != null);
	return response;
	*/
}

module.exports = StopForging;
