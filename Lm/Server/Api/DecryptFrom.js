/**!
 * LibreMoney DecryptFrom api 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

/*
import nxt.Account;
import nxt.NxtException;
import nxt.crypto.EncryptedData;
import nxt.util.Convert;
import nxt.util.Logger;
import org.json.simple.JSONObject;
import org.json.simple.JSONStreamAware;
import static nxt.http.JSONResponses.DECRYPTION_FAILED;
import static nxt.http.JSONResponses.INCORRECT_ACCOUNT;
*/

//super(new APITag[] {APITag.MESSAGES}, "account", "data", "nonce", "decryptedMessageIsText", "secretPhrase");
function DecryptFrom(req, res) {
	res.send('This is not implemented');
	/*
	Account account = ParameterParser.getAccount(req);
	if (account.getPublicKey() == null) {
		return INCORRECT_ACCOUNT;
	}
	String secretPhrase = ParameterParser.getSecretPhrase(req);
	byte[] data = Convert.parseHexString(Convert.nullToEmpty(req.getParameter("data")));
	byte[] nonce = Convert.parseHexString(Convert.nullToEmpty(req.getParameter("nonce")));
	EncryptedData encryptedData = new EncryptedData(data, nonce);
	boolean isText = !"false".equalsIgnoreCase(req.getParameter("decryptedMessageIsText"));
	try {
		byte[] decrypted = account.decryptFrom(encryptedData, secretPhrase);
		JSONObject response = new JSONObject();
		response.put("decryptedMessage", isText ? Convert.toString(decrypted) : Convert.toHexString(decrypted));
		return response;
	} catch (RuntimeException e) {
		Logger.logDebugMessage(e.toString());
		return DECRYPTION_FAILED;
	}
	*/
}

module.exports = DecryptFrom;
