/*
import nxt.Account;
import nxt.NxtException;
import nxt.util.Convert;
import nxt.util.JSON;
import org.json.simple.JSONObject;
import org.json.simple.JSONStreamAware;
*/

function Main(req, res) {
	//static final GetAccountPublicKey instance = new GetAccountPublicKey();
	res.send('This is not implemented');
	/*
	private GetAccountPublicKey() {
		super("account");
	}

	JSONStreamAware processRequest(HttpServletRequest req) throws NxtException {
		Account account = ParameterParser.getAccount(req);
		if (account.getPublicKey() != null) {
			JSONObject response = new JSONObject();
			response.put("publicKey", Convert.toHexString(account.getPublicKey()));
			return response;
		} else {
			return JSON.emptyJSON;
		}
	}
	*/
}

module.exports = Main;
