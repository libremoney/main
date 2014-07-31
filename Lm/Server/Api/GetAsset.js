/**!
 * LibreMoney 0.0
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var JsonData = require(__dirname + '/../JsonData');
var ParameterParser = require(__dirname + '/../ParameterParser');


//super("asset");
function GetAsset(req, res) {
	res.send(JsonData.Asset(ParameterParser.GetAsset(req)));
	return true;
}


module.exports = GetAsset;
