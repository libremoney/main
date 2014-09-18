/**!
 * LibreMoney GetAlias api 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var ParameterParser = require(__dirname + '/../ParameterParser');

//super(new APITag[] {APITag.ALIASES}, "alias", "aliasName");
function GetAlias(req, res) {
	var alias = ParameterParser.GetAlias(req);
	res.send(JsonData.Alias(alias))
}

module.exports = GetAlias;
