/**!
 * LibreMoney GetForging 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

/*
import nxt.Account;
import nxt.Generator;
import nxt.Nxt;
import nxt.crypto.Crypto;
import nxt.util.Convert;
import static nxt.http.JSONResponses.MISSING_SECRET_PHRASE;
import static nxt.http.JSONResponses.UNKNOWN_ACCOUNT;
*/


//super(new APITag[] {APITag.FORGING}, "secretPhrase");
function GetForging(req, res) {
	res.send('This is not implemented');
	/*
	String secretPhrase = req.getParameter("secretPhrase");
	if (secretPhrase == null) {
		return MISSING_SECRET_PHRASE;
	}
	Account account = Account.getAccount(Crypto.getPublicKey(secretPhrase));
	if (account == null) {
		return UNKNOWN_ACCOUNT;
	}

	Generator generator = Generator.getGenerator(secretPhrase);
	if (generator == null) {
		return JsonResponses.NotForging;
	}

	JSONObject response = new JSONObject();
	long deadline = generator.getDeadline();
	response.put("deadline", deadline);
	int elapsedTime = Convert.getEpochTime() - Nxt.getBlockchain().getLastBlock().getTimestamp();
	response.put("remaining", Math.max(deadline - elapsedTime, 0));
	return response;
	*/
}


module.exports = GetForging;
