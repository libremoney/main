/**!
 * LibreMoney GetPoll 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

/*
import nxt.Poll;
import nxt.util.Convert;
import static nxt.http.JSONResponses.INCORRECT_POLL;
import static nxt.http.JSONResponses.MISSING_POLL;
import static nxt.http.JSONResponses.UNKNOWN_POLL;
*/

function GetPoll(req, res) {
	res.send('This is not implemented');
	/*
	String poll = req.getParameter("poll");
	if (poll == null) {
		return MISSING_POLL;
	}
	Poll pollData;
	try {
		pollData = Poll.getPoll(Convert.parseUnsignedLong(poll));
		if (pollData == null) {
			return UNKNOWN_POLL;
		}
	} catch (RuntimeException e) {
		return INCORRECT_POLL;
	}
	return JSONData.poll(pollData);
	*/
}

module.exports = GetPoll;
