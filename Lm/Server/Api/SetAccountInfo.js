/**!
 * LibreMoney SetAccountInfo api 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var Attachment_MessagingAccountInfo = require(__dirname + "/../../Accounts/Attachment_MessagingAccountInfo");
var Constants = require(__dirname + "/../../Constants");
var Convert = require(__dirname + "/../../Util/Convert");
var CreateTransaction = require(__dirname + "/../CreateTransaction");
var JsonResponses = require(__dirname + "/../JsonResponses");
var ParameterParser = require(__dirname + "/../ParameterParser");


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


module.exports = SetAccountInfo;
