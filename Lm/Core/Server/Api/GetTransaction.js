/**!
 * LibreMoney GetTransaction api 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var Blockchain = require(__dirname + '/../../Blockchain');
var Convert = require(__dirname + '/../../../Util/Convert');
var JsonData = require(__dirname + '/../JsonData');
var JsonResponses = require(__dirname + '/../JsonResponses');
var Logger = require(__dirname + '/../../../Util/Logger').GetLogger(module);
var TransactionProcessor = require(__dirname + '/../../TransactionProcessor');


//super(new APITag[] {APITag.TRANSACTIONS}, "transaction", "fullHash");
function GetTransaction(req, res) {
	var transactionIdString = Convert.EmptyToNull(req.query.transaction);
	var transactionFullHash = Convert.EmptyToNull(req.query.fullHash);
	if (!transactionIdString && !transactionFullHash) {
		res.send(JsonResponses.MissingTransaction)
		return false;
	}
	var transactionId = null;
	var transaction;

	//var transaction = Transactions[1];
	//res.send(JsonData.Transaction(transaction));

	//Logger.debug('transactionIdString='+transactionIdString+' transactionFullHash='+transactionFullHash);

	if (transactionIdString) {
		transactionId = Convert.ParseUnsignedLong(transactionIdString);
		//Logger.debug('transactionId='+transactionId);
		Blockchain.GetTransaction(transactionId, function(err, transaction) {
			if (err) {
				Logger.warn(JsonResponses.IncorrectTransaction);
				res.send(JsonResponses.IncorrectTransaction);
				return;
			}
			if (!transaction) {
				transaction = TransactionProcessor.GetUnconfirmedTransaction(transactionId);
				if (!transaction) {
					res.send(JsonResponses.UnknownTransaction);
					return false;
				}
				res.send(JsonData.UnconfirmedTransaction(transaction));
				return;
			}
			Logger.debug(transaction.GetAmountMilliLm());
			res.send(JsonData.Transaction(transaction));
		});
	} else {
		Blockchain.GetTransactionByFullHash(transactionFullHash, function(err, transaction) {
			if (err) {
				Logger.warn(JsonResponses.IncorrectTransaction);
				res.send(JsonResponses.IncorrectTransaction);
				return;
			}
			if (!transaction) {
				Logger.warn(JsonResponses.UnknownTransaction);
				res.send(JsonResponses.UnknownTransaction);
				return false;
			}
			Logger.debug(transaction.GetAmountMilliLm());
			res.send(JsonData.Transaction(transaction));
		});
	}
	/*
	} catch (e) {
		Logger.warn(JsonResponses.IncorrectTransaction);
		res.send(JsonResponses.IncorrectTransaction);
		return false;
	}
	*/
	return true;
}


module.exports = GetTransaction;
