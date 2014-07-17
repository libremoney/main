/*
import nxt.Account;
import nxt.crypto.Crypto;
import nxt.util.Convert;
import org.json.simple.JSONObject;
import org.json.simple.JSONStreamAware;
import static nxt.http.JSONResponses.MISSING_SECRET_PHRASE;
*/

function Main(req, res) {
	//static final GetAccountId instance = new GetAccountId();
	res.send('This is not implemented');
	/*
	private GetAccountId() {
		super("secretPhrase");
	}

	JSONStreamAware processRequest(HttpServletRequest req) {

		String secretPhrase = req.getParameter("secretPhrase");
		if (secretPhrase == null) {
			return MISSING_SECRET_PHRASE;
		}

		byte[] publicKey = Crypto.getPublicKey(secretPhrase);

		JSONObject response = new JSONObject();
		Long accountId = Account.getId(publicKey);
		response.put("accountId", Convert.toUnsignedLong(accountId));
		response.put("accountRS", Convert.rsAccount(accountId));

		return response;
	}

	boolean requirePost() {
		return true;
	}
	*/
}

module.exports = Main;
