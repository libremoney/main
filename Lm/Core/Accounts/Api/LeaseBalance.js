/**!
 * LibreMoney LeaseBalance api 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var Attachment_AccountControlEffectiveBalanceLeasing = require(__dirname + '/../../Transactions/Attachment/AccountControlEffectiveBalanceLeasing');
var Convert = require(__dirname + '/../../../Lib/Util/Convert');
var Core = require(__dirname + '/../../Core');
var CreateTransaction = require(__dirname + '/../../Server/CreateTransaction');
var JsonResponses = require(__dirname + '/../../Server/JsonResponses');
var ParameterParser = require(__dirname + '/../../Server/ParameterParser');


//super(new APITag[] {APITag.FORGING}, "period", "recipient");
function LeaseBalance(req, res) {
	var periodString = Convert.EmptyToNull(req.query.period);
	if (!periodString) {
		res.send(JsonResponses.MissingPeriod);
		return;
	}
	var period;
	try {
		period = parseInt(periodString);
		if (period < 1440) {
			res.send(JsonResponses.IncorrectPeriod);
			return;
		}
	} catch (e) {
		res.send(JsonResponses.IncorrectPeriod);
		return;
	}

	var account = ParameterParser.GetSenderAccount(req);
	Core.GetRecipientId(req.query.recipient, function(err, recipient) {
		if (err) {
			res.send(err);
			return;
		}
		var recipientAccount = Accounts.GetAccount(recipient);
		if (!recipientAccount || !recipientAccount.GetPublicKey()) {
			res.send({
				errorCode: 8,
				errorDescription: "recipient account does not have public key"
			});
			return;
		}
		var attachment = new Attachment_AccountControlEffectiveBalanceLeasing(period);
		res.send(CreateTransaction(req, account, recipient, 0, attachment));
	});
}


module.exports = LeaseBalance;
