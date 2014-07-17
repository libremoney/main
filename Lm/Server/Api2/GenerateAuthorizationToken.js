/*
import nxt.Token;
import org.json.simple.JSONObject;
import org.json.simple.JSONStreamAware;
*/

/*
import static nxt.user.JSONResponses.INVALID_SECRET_PHRASE;
*/


/*
static final GenerateAuthorizationToken instance = new GenerateAuthorizationToken();
*/


function GenerateAuthorizationToken() {
	return UserRequestHandler.Create();
}

function ProcessRequest(req, user) {
	/*
	String secretPhrase = req.getParameter("secretPhrase");
	if (! user.getSecretPhrase().equals(secretPhrase)) {
		return INVALID_SECRET_PHRASE;
	}

	String tokenString = Token.generateToken(secretPhrase, req.getParameter("website").trim());

	JSONObject response = new JSONObject();
	response.put("response", "showAuthorizationToken");
	response.put("token", tokenString);

	return response;
	*/
}

function RequirePost() {
	/*
	return true;
	*/
}

GenerateAuthorizationToken.prototype.ProcessRequest = ProcessRequest;
GenerateAuthorizationToken.prototype.RequirePost = RequirePost;


exports.Create = GenerateAuthorizationToken;
