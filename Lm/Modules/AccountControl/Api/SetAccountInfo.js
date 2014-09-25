/**!
 * LibreMoney SetAccountInfo api 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

if (typeof module !== "undefined") {
	var Attachment_MessagingAccountInfo = require(__dirname + "/../../Accounts/Attachment_MessagingAccountInfo");
	var Constants = require(__dirname + "/../../../Lib/Constants");
	var Convert = require(__dirname + "/../../../Lib/Util/Convert");
	var CreateTransaction = require(__dirname + "/../../../Core/Server/CreateTransaction");
	var JsonResponses = require(__dirname + "/../../../Core/Server/JsonResponses");
	var ParameterParser = require(__dirname + "/../../../Core/Server/ParameterParser");
}


//super(new APITag[] {APITag.ACCOUNTS, APITag.CREATE_TRANSACTION}, "name", "description");
function SetAccountInfo(req, res) {
	var name = Convert.NullToEmpty(req.query.name).trim();
	var description = Convert.NullToEmpty(req.query.description).trim();

	if (name.length > Constants.MaxAccountNameLength) {
		return JsonResponses.IncorrectAccountNameLength;
	}

	if (description.length > Constants.MaxAccountDescriptionLength) {
		return JsonResponses.IncorrectAccountDescriptionLength;
	}

	var account = ParameterParser.GetSenderAccount(req);
	var attachment = new Attachment_MessagingAccountInfo(name, description);
	return CreateTransaction(req, account, attachment);
}


if (typeof module !== "undefined") {
	module.exports = SetAccountInfo;
}
