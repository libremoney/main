/*
import nxt.Token;
import org.json.simple.JSONStreamAware;
import static nxt.http.JSONResponses.INCORRECT_WEBSITE;
import static nxt.http.JSONResponses.MISSING_TOKEN;
import static nxt.http.JSONResponses.MISSING_WEBSITE;
*/

function Main(req, res) {
	res.send('This is not implemented');    

	/*
	static final DecodeToken instance = new DecodeToken();

	private DecodeToken() {
		super("website", "token");
	}

	public JSONStreamAware processRequest(HttpServletRequest req) {
		String website = req.getParameter("website");
		String tokenString = req.getParameter("token");
		if (website == null) {
			return MISSING_WEBSITE;
		} else if (tokenString == null) {
			return MISSING_TOKEN;
		}
		try {
			Token token = Token.parseToken(tokenString, website.trim());
			return JSONData.token(token);
		} catch (RuntimeException e) {
			return INCORRECT_WEBSITE;
		}
	}
*/
}

module.exports = Main;
