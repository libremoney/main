/*
import nxt.Poll;
import nxt.util.Convert;
import static nxt.http.JSONResponses.INCORRECT_POLL;
import static nxt.http.JSONResponses.MISSING_POLL;
import static nxt.http.JSONResponses.UNKNOWN_POLL;
*/

function Main(req, res) {
	res.send('This is not implemented');
	/*
	static final GetPoll instance = new GetPoll();
	private GetPoll() {
		super("poll");
	}
	JSONStreamAware processRequest(HttpServletRequest req) {
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
	}
	*/
}

module.exports = Main;
