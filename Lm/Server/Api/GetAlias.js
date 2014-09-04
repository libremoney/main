/**!
 * LibreMoney GetAlias api 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

/*
import nxt.Alias;
import nxt.util.Convert;
import org.json.simple.JSONStreamAware;
import static nxt.http.JSONResponses.INCORRECT_ALIAS;
import static nxt.http.JSONResponses.MISSING_ALIAS_OR_ALIAS_NAME;
import static nxt.http.JSONResponses.UNKNOWN_ALIAS;
*/

//super("alias", "aliasName");
function GetAlias(req, res) {
	res.send('This is not implemented');
	/*
	Long aliasId;
	try {
		aliasId = Convert.parseUnsignedLong(Convert.emptyToNull(req.getParameter("alias")));
	} catch (RuntimeException e) {
		return INCORRECT_ALIAS;
	}
	String aliasName = Convert.emptyToNull(req.getParameter("aliasName"));

	Alias alias;
	if (aliasId != null) {
		alias = Alias.getAlias(aliasId);
	} else if (aliasName != null) {
		alias = Alias.getAlias(aliasName);
	} else {
		return MISSING_ALIAS_OR_ALIAS_NAME;
	}
	if (alias == null) {
		return UNKNOWN_ALIAS;
	}

	return JSONData.alias(alias);
	*/
}

module.exports = GetAlias;
