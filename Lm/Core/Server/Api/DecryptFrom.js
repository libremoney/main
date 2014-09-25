/**!
 * LibreMoney DecryptFrom api 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

/*
import nxt.crypto.EncryptedData;
import nxt.util.Convert;
import nxt.util.Logger;
*/

var Core = require(__dirname + '/../../Core');


//super(new APITag[] {APITag.MESSAGES}, "account", "data", "nonce", "decryptedMessageIsText", "secretPhrase");
function DecryptFrom(req, res) {
	Core.GetAccount(req.query.account, function(err, account) {
		if (err) {
			res.send(err);
			return;
		}
		/*
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
			return {
				errorCode: 8,
				errorDescription: "Decryption failed"
			}
		}
		*/
		res.send('This is not implemented');
	});
}


module.exports = DecryptFrom;
