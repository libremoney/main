/**!
 * LibreMoney GetAsset api 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var JsonData = require(__dirname + '/../../Server/JsonData');
var ParameterParser = require(__dirname + '/../../Server/ParameterParser');


//super(new APITag[] {APITag.AE}, "asset");
function GetAsset(req, res) {
	res.send(JsonData.Asset(ParameterParser.GetAsset(req)));
	return true;
}


module.exports = GetAsset;
