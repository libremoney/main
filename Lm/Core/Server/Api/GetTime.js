/**!
 * LibreMoney GetTime api 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

/*
import nxt.util.Convert;
*/

//super(new APITag[] {APITag.INFO});
function GetTime(req, res) {
	res.send('This is not implemented');
	/*
	JSONObject response = new JSONObject();
	response.put("time", Convert.getEpochTime());
	return response;
	*/
}

module.exports = GetTime;
