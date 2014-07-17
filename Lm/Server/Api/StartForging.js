/*
import nxt.Generator;
import static nxt.http.JSONResponses.MISSING_SECRET_PHRASE;
import static nxt.http.JSONResponses.UNKNOWN_ACCOUNT;
*/

function Main(req, res) {
	res.send('This is not implemented');
	/*
	static final StartForging instance = new StartForging();

	private StartForging() {
		super("secretPhrase");
	}

	JSONStreamAware processRequest(HttpServletRequest req) {

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

	}

	boolean requirePost() {
		return true;
	}
	*/
}

module.exports = Main;
