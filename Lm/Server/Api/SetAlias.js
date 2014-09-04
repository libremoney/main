/**!
 * LibreMoney SetAlias api 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

/*
import nxt.Account;
import nxt.Alias;
import nxt.Attachment;
import nxt.Constants;
import nxt.NxtException;
import nxt.util.Convert;
import static nxt.http.JSONResponses.INCORRECT_ALIAS_LENGTH;
import static nxt.http.JSONResponses.INCORRECT_ALIAS_NAME;
import static nxt.http.JSONResponses.INCORRECT_URI_LENGTH;
import static nxt.http.JSONResponses.MISSING_ALIAS_NAME;
*/

//super("aliasName", "aliasURI");
function SetAlias(req, res) {
	var obj = CreateTransaction();
	res.send('This is not implemented');
	/*
	String aliasName = Convert.emptyToNull(req.getParameter("aliasName"));
	String aliasURI = Convert.nullToEmpty(req.getParameter("aliasURI"));

	if (aliasName == null) {
		return MISSING_ALIAS_NAME;
	}

	aliasName = aliasName.trim();
	if (aliasName.length() == 0 || aliasName.length() > Constants.MaxAliasLength) {
		return INCORRECT_ALIAS_LENGTH;
	}

	String normalizedAlias = aliasName.toLowerCase();
	for (int i = 0; i < normalizedAlias.length(); i++) {
		if (Constants.Alphabet.indexOf(normalizedAlias.charAt(i)) < 0) {
			return INCORRECT_ALIAS_NAME;
		}
	}

	aliasURI = aliasURI.trim();
	if (aliasURI.length() > Constants.MaxAliasUriLength) {
		return INCORRECT_URI_LENGTH;
	}

	Account account = ParameterParser.getSenderAccount(req);

	Alias alias = Alias.getAlias(normalizedAlias);
	if (alias != null && !alias.getAccount().getId().equals(account.getId())) {
		JSONObject response = new JSONObject();
		response.put("errorCode", 8);
		response.put("errorDescription", "\"" + aliasName + "\" is already used");
		return response;
	}

	Attachment attachment = new Attachment.MessagingAliasAssignment(aliasName, aliasURI);
	return createTransaction(req, account, attachment);
	*/
}

module.exports = SetAlias;
