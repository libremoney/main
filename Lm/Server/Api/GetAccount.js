/**!
 * LibreMoney 0.0
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var JsonData = require(__dirname + '/../JsonData');
var JsonResponses = require(__dirname + '/../JsonResponses');
var ParameterParser = require(__dirname + '/../ParameterParser');


//super("account");
function GetAccount(req, res) {
	var account = ParameterParser.GetAccount(req);

	var response = JsonData.AccountBalance(account);
	response.account = Convert.ToUnsignedLong(account.getId());
	response.accountRS = Convert.RsAccount(account.getId());

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
		response.currentLessee = Convert.ToUnsignedLong(account.GetCurrentLesseeId());
		response.currentLeasingHeightFrom = account.GetCurrentLeasingHeightFrom();
		response.currentLeasingHeightTo = account.GetCurrentLeasingHeightTo();
		if (account.GetNextLesseeId() != null) {
			response.nextLessee = Convert.ToUnsignedLong(account.GetNextLesseeId());
			response.nextLeasingHeightFrom = account.GetNextLeasingHeightFrom();
			response.nextLeasingHeightTo = account.GetNextLeasingHeightTo();
		}
	}
	if (!account.GetLessorIds().IsEmpty()) {
		var lessorIds = new Array();
		for (var lessorId in account.GetLessorIds()) {
			lessorIds.push(Convert.ToUnsignedLong(lessorId));
		}
		response.lessors = lessorIds;
	}

	/*
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
