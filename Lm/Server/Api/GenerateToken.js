/*
import nxt.Token;
import org.json.simple.JSONObject;
import org.json.simple.JSONStreamAware;
import static nxt.http.JSONResponses.INCORRECT_WEBSITE;
import static nxt.http.JSONResponses.MISSING_SECRET_PHRASE;
import static nxt.http.JSONResponses.MISSING_WEBSITE;
*/

function Main(req, res) {
	res.send('This is not implemented');    
	/*
	static final GenerateToken instance = new GenerateToken();

	private GenerateToken() {
		super("website", "secretPhrase");
	}

	JSONStreamAware processRequest(HttpServletRequest req) {
		String secretPhrase = req.getParameter("secretPhrase");
		String website = req.getParameter("website");
		if (secretPhrase == null) {
			return MISSING_SECRET_PHRASE;
		} else if (website == null) {
			return MISSING_WEBSITE;
		}
		try {
			String tokenString = Token.generateToken(secretPhrase, website.trim());
			JSONObject response = new JSONObject();
			response.put("token", tokenString);
			return response;
		} catch (RuntimeException e) {
			return INCORRECT_WEBSITE;
		}
	}

	boolean requirePost() {
		return true;
	}
*/
}

module.exports = Main;
