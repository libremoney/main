/*
import nxt.peer.Hallmark;
import org.json.simple.JSONStreamAware;
import static nxt.http.JSONResponses.INCORRECT_HALLMARK;
import static nxt.http.JSONResponses.MISSING_HALLMARK;
*/

function Main(req, res) {
	res.send('This is not implemented');    

	/*
	static final DecodeHallmark instance = new DecodeHallmark();

	private DecodeHallmark() {
		super("hallmark");
	}

	JSONStreamAware processRequest(HttpServletRequest req) {
		String hallmarkValue = req.getParameter("hallmark");
		if (hallmarkValue == null) {
			return MISSING_HALLMARK;
		}
		try {
			Hallmark hallmark = Hallmark.parseHallmark(hallmarkValue);
			return JSONData.hallmark(hallmark);
		} catch (RuntimeException e) {
			return INCORRECT_HALLMARK;
		}
	}
	*/
}

module.exports = Main;
