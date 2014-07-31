/**!
 * LibreMoney 0.0
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var Accounts = require(__dirname + '/../../Accounts');
var Constants = require(__dirname + '/../../Constants');
var Convert = require(__dirname + '/../../Util/Convert');
var TransactionProcessor = require(__dirname + '/../../TransactionProcessor');
var Transactions = require(__dirname + '/../../Transactions');


function SendMoney(req, res, user) {
	//res.send('This is not implemented');
	//return UserRequestHandler.Create();

	if (user.GetSecretPhrase() == null) {
		return null;
	}

	var recipientValue = req.query.recipient;
	var amountValue = req.query.amountMilliLm;
	var feeValue = req.query.feeMilliLm;
	var deadlineValue = req.query.deadline;
	var secretPhrase = req.query.secretPhrase;

	var recipient;
	var amountMilliLm = 0;
	var feeMilliLm = 0;
	var deadline = 0;

	//try {
		recipient = Convert.ParseUnsignedLong(recipientValue);
		if (!recipient)
			throw new Error("IllegalArgument: invalid recipient");
		amountMilliLm = Convert.ParseLm(amountValue.trim());
		feeMilliLm = Convert.ParseLm(feeValue.trim());
		deadline = parseInt(Double.ParseDouble(deadlineValue) * 60);
	/*
	} catch (RuntimeException e) {
		JSONObject response = new JSONObject();
		response.put("response", "notifyOfIncorrectTransaction");
		response.put("message", "One of the fields is filled incorrectly!");
		response.put("recipient", recipientValue);
		response.put("amountNXT", amountValue);
		response.put("feeNXT", feeValue);
		response.put("deadline", deadlineValue);
		return response;
	}
	*/

	if (user.GetSecretPhrase() != secretPhrase) {
		var response = {};
		response.response = "notifyOfIncorrectTransaction";
		response.message = "Wrong secret phrase!";
		response.recipient = recipientValue;
		response.amountMilliLm = amountValue;
		response.feeMilliLm = feeValue;
		response.deadline = deadlineValue;
		return response;
	} else if (amountMilliLm <= 0 || amountMilliLm > Constants.MaxBalanceMilliLm) {
		var response = {};
		response.response = "notifyOfIncorrectTransaction";
		response.message = "\"Amount\" must be greater than 0!";
		response.recipient = recipientValue;
		response.amountMilliLm = amountValue;
		response.feeMilliLm = feeValue;
		response.deadline = deadlineValue;
		return response;
	} else if (feeMilliLm < Constants.OneLm || feeMilliLm > Constants.MaxBalanceMilliLm) {
		var response = {};
		response.response = "notifyOfIncorrectTransaction";
		response.message = "\"Fee\" must be at least 1 NXT!";
		response.recipient = recipientValue;
		response.amountMilliLm = amountValue;
		response.feeMilliLm = feeValue;
		response.deadline = deadlineValue;
		return response;
	} else if (deadline < 1 || deadline > 1440) {
		var response = {};
		response.response = "notifyOfIncorrectTransaction";
		response.message = "\"Deadline\" must be greater or equal to 1 minute and less than 24 hours!";
		response.recipient = recipientValue;
		response.amountMilliLm = amountValue;
		response.feeMilliLm = feeValue;
		response.deadline = deadlineValue;
		return response;
	}

	var account = Accounts.GetAccount(user.GetPublicKey());
	if (!account || Convert.SafeAdd(amountMilliLm, feeMilliLm) > account.GetUnconfirmedBalanceMilliLm()) {
		var response = {};
		response.response = "notifyOfIncorrectTransaction";
		response.message = "Not enough funds!";
		response.recipient = recipientValue;
		response.amountMilliLm = amountValue;
		response.feeMilliLm = feeValue;
		response.deadline = deadlineValue;
		return response;
	} else {
		var transaction = Transactions.NewOrdinaryPaymentTransaction({
			deadline: deadline,
			senderPublicKey: user.GetPublicKey(),
			recipientId: recipient,
			amountMilliLm: amountMilliLm,
			feeMilliLm: feeMilliLm
		});
		transaction.Sign(user.GetSecretPhrase());
		TransactionProcessor.Broadcast(transaction);
		return JsonResponses.NOTIFY_OF_ACCEPTED_TRANSACTION;
	}
}


module.exports = SendMoney;
