/**!
 * LibreMoney GetAliases api 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

/*
import nxt.Alias;
import nxt.NxtException;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.JSONStreamAware;
*/

//super(new APITag[] {APITag.ALIASES}, "timestamp", "account");
function GetAliases(req, res) {
	res.send('This is not implemented');
	/*
	int timestamp = ParameterParser.getTimestamp(req);
	Long accountId = ParameterParser.getAccount(req).getId();
	JSONArray aliases = new JSONArray();
		for (Alias alias : Alias.getAliasesByOwner(accountId)) {
			if (alias.getTimestamp() >= timestamp) {
			aliases.add(JSONData.alias(alias));
		}
	}
	JSONObject response = new JSONObject();
	response.put("aliases", aliases);
	return response;
	*/
}

module.exports = GetAliases;
