/**!
 * LibreMoney GetAliases api 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var Core = require(__dirname + '/../../Core');


//super(new APITag[] {APITag.ALIASES}, "timestamp", "account");
function GetAliases(req, res) {
	Core.GetAccount(req.query.account, function(err, account) {
		if (err) {
			res.send(err);
			return;
		}
		var accountId = account.GetId();
		/*
		int timestamp = ParameterParser.getTimestamp(req);
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
		res.send({
			errorCode:100,
			errorDescription:'This is not implemented'
		});
	});
}


module.exports = GetAliases;
