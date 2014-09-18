/**!
 * LibreMoney SetAlias api 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var Aliases = require(__dirname + '/../Aliases');
var Attachment_MessagingAliasAssignment = require(__dirname + '/../Attachment/MessagingAliasAssignment');
var Constants = require(__dirname + '/../../Constants');
var Convert = require(__dirname + '/../../Util/Convert');
var JsonResponses = require(__dirname + '/../../Server/JsonResponses');
var ParameterParser = require(__dirname + '/../../Server/ParameterParser');


//super(new APITag[] {APITag.ALIASES, APITag.CREATE_TRANSACTION}, "aliasName", "aliasURI");
function SetAlias(req, res) {
	var aliasName = Convert.EmptyToNull(req.query.aliasName);
	var aliasURI = Convert.NullToEmpty(req.query.aliasURI);

	if (aliasName == null) {
		return JsonResponses.MissingAliasName;
	}

	aliasName = aliasName.trim();
	if (aliasName.length == 0 || aliasName.length > Constants.MaxAliasLength) {
		return JsonResponses.IncorrectAliasLength;
	}

	var normalizedAlias = aliasName.toLowerCase();
	for (var i = 0; i < normalizedAlias.length; i++) {
		if (Constants.Alphabet.indexOf(normalizedAlias.charAt(i)) < 0) {
			return JsonResponses.IncorrectAliasName;
		}
	}

	aliasUri = aliasUri.trim();
	if (aliasUri.length > Constants.MaxAliasUriLength) {
		return JsonResponses.IncorrectUriLength;
	}

	var account = ParameterParser.GetSenderAccount(req);

	var alias = Aliases.GetAlias(normalizedAlias);
	if (alias != null && !alias.GetAccountId() == account.GetId()) {
		var response = {};
		response.errorCode = 8;
		response.errorDescription = "\"" + aliasName + "\" is already used";
		return response;
	}

	var attachment = new Attachment_MessagingAliasAssignment(aliasName, aliasUri);
	res.send(CreateTransaction(req, account, attachment));
}

module.exports = SetAlias;
