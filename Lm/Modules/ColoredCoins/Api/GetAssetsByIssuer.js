/**!
 * LibreMoney GetAssetsByIssuer api 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var ColoredCoins = require(__dirname + '/../ColoredCoins');
var JsonData = require(__dirname + '/../../Server/JsonData');
var ParameterParser = require(__dirname + '/../../Server/ParameterParser');


//super(new APITag[] {APITag.AE, APITag.ACCOUNTS}, "account", "account", "account");
function GetAssetsByIssuer(req, res) {
	var accounts = ParameterParser.GetAccounts(req);
	var response = {};
	var accountsJsonArray = [];
	response.assets = accountsJsonArray;
	for (var account in accounts) {
		var assets = ColoredCoins.GetAssetsIssuedBy(account.GetId());
		var assetsJsonArray = [];
		for (var asset in assets) {
			assetsJsonArray.push(JsonData.Asset(asset));
		}
		accountsJsonArray.push(assetsJsonArray);
	}
	res.send(response);
	return true;
}


module.exports = GetAssetsByIssuer;
