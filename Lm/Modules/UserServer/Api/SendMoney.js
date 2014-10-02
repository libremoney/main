/**!
 * LibreMoney SendMoney 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var Accounts = require(__dirname + '/../../Accounts');
var Constants = require(__dirname + '/../../Constants');
var Convert = require(__dirname + '/../../Util/Convert');
var Payments = require(__dirname + '/../../Payments');
var TransactionProcessor = require(__dirname + '/../../TransactionProcessor');


function SendMoney(req, res, user) {
	//res.send('This is not implemented');
	//return UserRequestHandler.Create();

	if (user.GetSecretPhrase() == null) {
		return null;
	}

	var recipientValue = req.query.recipient;
	var amountValue = req.query.amount; // MilliLm
	var feeValue = req.query.fee; // MilliLm
	var deadlineValue = req.query.deadline;
	var secretPhrase = req.query.secretPhrase;

	var recipient;
	var amount = 0;
	var fee = 0;
	var deadline = 0;

	//try {
		recipient = Convert.ParseUnsignedLong(recipientValue);
		if (!recipient)
			throw new Error("IllegalArgument: invalid recipient");
		amount = Convert.ParseLm(amountValue.trim());
		fee = Convert.ParseLm(feeValue.trim());
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
		response.amount = amountValue;
		response.fee = feeValue;
		response.deadline = deadlineValue;
		return response;
	} else if (amount <= 0 || amount > Constants.MaxBalance) {
		var response = {};
		response.response = "notifyOfIncorrectTransaction";
		response.message = "\"Amount\" must be greater than 0!";
		response.recipient = recipientValue;
		response.amount = amountValue;
		response.fee = feeValue;
		response.deadline = deadlineValue;
		return response;
	} else if (fee < Constants.OneLm || fee > Constants.MaxBalance) {
		var response = {};
		response.response = "notifyOfIncorrectTransaction";
		response.message = "\"Fee\" must be at least 1 NXT!";
		response.recipient = recipientValue;
		response.amount = amountValue;
		response.fee = feeValue;
		response.deadline = deadlineValue;
		return response;
	} else if (deadline < 1 || deadline > 1440) {
		var response = {};
		response.response = "notifyOfIncorrectTransaction";
		response.message = "\"Deadline\" must be greater or equal to 1 minute and less than 24 hours!";
		response.recipient = recipientValue;
		response.amount = amountValue;
		response.fee = feeValue;
		response.deadline = deadlineValue;
		return response;
	}

	var account = Accounts.GetAccount(user.GetPublicKey());
	if (!account || Convert.SafeAdd(amount, fee) > account.GetUnconfirmedBalance()) {
		var response = {};
		response.response = "notifyOfIncorrectTransaction";
		response.message = "Not enough funds!";
		response.recipient = recipientValue;
		response.amount = amountValue;
		response.fee = feeValue;
		response.deadline = deadlineValue;
		return response;
	} else {
		var transaction = Payments.NewOrdinaryPaymentTransaction({
			deadline: deadline,
			senderPublicKey: user.GetPublicKey(),
			recipientId: recipient,
			amount: amount,
			fee: fee
		});
		transaction.Validate();
		transaction.Sign(user.GetSecretPhrase());
		TransactionProcessor.Broadcast(transaction);
		return JsonResponses.NotifyOfAcceptedTransaction;
	}
}


module.exports = SendMoney;
