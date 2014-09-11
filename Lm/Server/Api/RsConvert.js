/**!
 * LibreMoney RsConvert api 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

/*
import nxt.util.Convert;
import org.json.simple.JSONObject;
import org.json.simple.JSONStreamAware;
import static nxt.http.JSONResponses.INCORRECT_ACCOUNT;
import static nxt.http.JSONResponses.MISSING_ACCOUNT;
*/

//super(new APITag[] {APITag.ACCOUNTS}, "account");
function RsConvert(req, res) {
	res.send('This is not implemented');
	/*
	String accountValue = Convert.emptyToNull(req.getParameter("account"));
	if (accountValue == null) {
		return MISSING_ACCOUNT;
	}
	try {
		Long accountId = Convert.parseAccountId(accountValue);
		if (accountId == null) {
			return INCORRECT_ACCOUNT;
		}
		JSONObject response = new JSONObject();
		JSONData.putAccount(response, "account", accountId);
		return response;
	} catch (RuntimeException e) {
		return INCORRECT_ACCOUNT;
	}
	*/
}

module.exports = RsConvert;
