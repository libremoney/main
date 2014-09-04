/**!
 * LibreMoney LeaseBalance api 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

/*
import nxt.Account;
import nxt.Attachment;
import nxt.NxtException;
import nxt.util.Convert;
import static nxt.http.JSONResponses.INCORRECT_PERIOD;
import static nxt.http.JSONResponses.MISSING_PERIOD;
*/

//super("period", "recipient");
function LeaseBalance(req, res) {
	var obj = CreateTransaction();
	res.send('This is not implemented');
	/*
	String periodString = Convert.emptyToNull(req.getParameter("period"));
	if (periodString == null) {
		return MISSING_PERIOD;
	}
	short period;
	try {
		period = Short.parseShort(periodString);
		if (period < 1440) {
			return INCORRECT_PERIOD;
		}
	} catch (NumberFormatException e) {
		return INCORRECT_PERIOD;
	}

	Account account = ParameterParser.getSenderAccount(req);
	Long recipient = ParameterParser.getRecipientId(req);
	Account recipientAccount = Account.getAccount(recipient);
	if (recipientAccount == null || recipientAccount.getPublicKey() == null) {
		JSONObject response = new JSONObject();
		response.put("errorCode", 8);
		response.put("errorDescription", "recipient account does not have public key");
		return response;
	}
	Attachment attachment = new Attachment.AccountControlEffectiveBalanceLeasing(period);
	return createTransaction(req, account, recipient, 0, attachment);
	*/
}

module.exports = LeaseBalance;
