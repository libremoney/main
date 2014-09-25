/**!
 * LibreMoney MarkHost api 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

/*
import nxt.Constants;
import nxt.peer.Hallmark;
*/


//super(new APITag[] {APITag.TOKENS}, "secretPhrase", "host", "weight", "date");
function MarkHost(req, res) {
	res.send('This is not implemented');
	/*
	String secretPhrase = req.getParameter("secretPhrase");
	String host = req.getParameter("host");
	String weightValue = req.getParameter("weight");
	String dateValue = req.getParameter("date");
	if (secretPhrase == null) {
		return MISSING_SECRET_PHRASE;
	} else if (host == null) {
		return MISSING_HOST;
	} else if (weightValue == null) {
		return MISSING_WEIGHT;
	} else if (dateValue == null) {
		return MISSING_DATE;
	}

	if (host.length() > 100) {
		return INCORRECT_HOST;
	}

	int weight;
	try {
		weight = Integer.parseInt(weightValue);
		if (weight <= 0 || weight > Constants.MaxBalanceLm) {
			return INCORRECT_WEIGHT;
		}
	} catch (NumberFormatException e) {
		return INCORRECT_WEIGHT;
	}

	try {

		String hallmark = Hallmark.generateHallmark(secretPhrase, host, weight, Hallmark.parseDate(dateValue));

		JSONObject response = new JSONObject();
		response.put("hallmark", hallmark);
		return response;

	} catch (RuntimeException e) {
		return INCORRECT_DATE;
	}
	*/
}


module.exports = MarkHost;
