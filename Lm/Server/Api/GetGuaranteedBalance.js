/**!
 * LibreMoney GetGuaranteedBalance 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

/*
import nxt.Account;
import nxt.NxtException;
import static nxt.http.JSONResponses.INCORRECT_NUMBER_OF_CONFIRMATIONS;
import static nxt.http.JSONResponses.MISSING_NUMBER_OF_CONFIRMATIONS;
*/

//super("account", "numberOfConfirmations");
function GetGuaranteedBalance(req, res) {
	res.send('This is not implemented');
	/*
	Account account = ParameterParser.getAccount(req);
	String numberOfConfirmationsValue = req.getParameter("numberOfConfirmations");
	if (numberOfConfirmationsValue == null) {
		return MISSING_NUMBER_OF_CONFIRMATIONS;
	}
	JSONObject response = new JSONObject();
	if (account == null) {
		response.put("guaranteedBalanceNQT", "0");
	} else {
		try {
			int numberOfConfirmations = Integer.parseInt(numberOfConfirmationsValue);
			response.put("guaranteedBalanceNQT", String.valueOf(account.getGuaranteedBalanceNQT(numberOfConfirmations)));
		} catch (NumberFormatException e) {
			return INCORRECT_NUMBER_OF_CONFIRMATIONS;
		}
	}
	return response;
	*/
}

module.exports = GetGuaranteedBalance;
