/**!
 * LibreMoney GetAccount api 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var JsonData = require(__dirname + '/../../Server/JsonData');
var JsonResponses = require(__dirname + '/../../Server/JsonResponses');
var ParameterParser = require(__dirname + '/../../Server/ParameterParser');


//super(new APITag[] {APITag.ACCOUNTS}, "account");
function GetAccount(req, res) {
	var account = ParameterParser.GetAccount(req);

	var response = JsonData.AccountBalance(account);
	JsonData.PutAccount(response, "account", account.GetId());

	if (account.GetPublicKey() != null) {
		response.publicKey = Convert.ToHexString(account.GetPublicKey());
	}
	if (account.GetName() != null) {
		response.name = account.GetName();
	}
	if (account.GetDescription() != null) {
		response.description = account.getDescription();
	}
	if (account.GetCurrentLesseeId() != null) {
		JsonData.PutAccount(response, "currentLessee", account.GetCurrentLesseeId());
		response.currentLeasingHeightFrom = account.GetCurrentLeasingHeightFrom();
		response.currentLeasingHeightTo = account.GetCurrentLeasingHeightTo();
		if (account.GetNextLesseeId() != null) {
			JsonData.PutAccount(response, "nextLessee", account.GetNextLesseeId());
			response.nextLeasingHeightFrom = account.GetNextLeasingHeightFrom();
			response.nextLeasingHeightTo = account.GetNextLeasingHeightTo();
		}
	}
	var lessors = account.GetLessorIds();
	if (!lessors.IsEmpty()) {
		var lessorIds = [];
		var lessorIdsRS = [];
		for (var lessorId in lessors) {
			lessorIds.push(Convert.ToUnsignedLong(lessorId));
			lessorIdsRS.push(Convert.RsAccount(lessorId));
		}
		response.lessors = lessorIds;
		response.put("lessorsRS", lessorIdsRS);
	}

	/*
	TODO
	var assetBalances = new Array();
	for (Map.Entry<Long, Long> assetBalanceEntry : account.getAssetBalancesQNT().entrySet()) {
		JSONObject assetBalance = new JSONObject();
		assetBalance.put("asset", Convert.toUnsignedLong(assetBalanceEntry.getKey()));
		assetBalance.put("balanceQNT", String.valueOf(assetBalanceEntry.getValue()));
		assetBalances.add(assetBalance);

	}
	if (assetBalances.size() > 0) {
		response.put("assetBalances", assetBalances);
	}

	JSONArray unconfirmedAssetBalances = new JSONArray();
	for (Map.Entry<Long, Long> unconfirmedAssetBalanceEntry : account.getUnconfirmedAssetBalancesQNT().entrySet()) {

		JSONObject unconfirmedAssetBalance = new JSONObject();
		unconfirmedAssetBalance.put("asset", Convert.toUnsignedLong(unconfirmedAssetBalanceEntry.getKey()));
		unconfirmedAssetBalance.put("unconfirmedBalanceQNT", String.valueOf(unconfirmedAssetBalanceEntry.getValue()));
		unconfirmedAssetBalances.add(unconfirmedAssetBalance);

	}
	if (unconfirmedAssetBalances.size() > 0) {
		response.put("unconfirmedAssetBalances", unconfirmedAssetBalances);
	}
	return response;
	*/
	res.send('This is not implemented');
}


module.exports = GetAccount;
