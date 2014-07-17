/*
import nxt.Generator;
import static nxt.http.JSONResponses.MISSING_SECRET_PHRASE;
*/

function Main(req, res) {
	res.send('This is not implemented');
	/*
	static final StopForging instance = new StopForging();

	private StopForging() {
		super("secretPhrase");
	}

	JSONStreamAware processRequest(HttpServletRequest req) {
		String secretPhrase = req.getParameter("secretPhrase");
		if (secretPhrase == null) {
			return MISSING_SECRET_PHRASE;
		}
		Generator generator = Generator.stopForging(secretPhrase);
		JSONObject response = new JSONObject();
		response.put("foundAndStopped", generator != null);
		return response;
	}

	boolean requirePost() {
		return true;
	}
	*/
}

module.exports = Main;
