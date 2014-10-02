/**!
 * LibreMoney UnconfirmedTransactions 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

if (typeof module !== "undefined") {
	var Db = require(__dirname + '/../../Db');
	var Logger = require(__dirname + '/../../Lib/Util/Logger').GetLogger(module);
}


var UnconfirmedTransactions = function() {
}

UnconfirmedTransactions.AddConfirmation = function(id, callback) {
	var trModel = Db.GetModel('transaction');
	trModel.update({id: id}, {
		$inc: {
			confirmations: 1
		}
	}, {}, function() {
		if (typeof callback === "function") {
			callback();
		}
	});
}

UnconfirmedTransactions.AddTransactions = function(transactions) {
	for (var i in transactions) {
		if (!transactions.hasOwnProperty(i) || i == "count") {
			continue;
		}
		var transaction = transactions[i];
		var transactionTmp = transaction.GetData();
		var trModel = Db.GetModel('transaction');
		trModel.insert(transactionTmp, function(err, newDoc) {
			if (err) {
				Logger.warn("Transaction insert ERROR", err);
			}
		});
	}
}

UnconfirmedTransactions.AddTransactionsData = function(transactionsData, callback) {
	for (var i in transactionsData) {
		if (!transactionsData.hasOwnProperty(i) || i == "count") {
			continue;
		}
		var transactionTmp = transactionsData[i];
		var trModel = Db.GetModel('transaction');
		trModel.insert(transactionTmp, function(err, newDoc) {
			if (err) {
				Logger.warn("Transaction insert ERROR", err);
				callback(err);
			} else {
				callback(null);
			}
		});
	}
}

UnconfirmedTransactions.AddTransactionsData = function(transactionsData, callback) {
	for (var i in transactionsData) {
		if (!transactionsData.hasOwnProperty(i) || i == "count") {
			continue;
		}
		var transactionTmp = transactionsData[i];
		var trModel = Db.GetModel('transaction');
		trModel.insert(transactionTmp, function(err, newDoc) {
			if (err) {
				Logger.warn("Transaction insert ERROR", err);
				callback(err);
			} else {
				callback(null);
			}
		});
	}
}

UnconfirmedTransactions.DeleteTransactions = function(transactions, callback) {
	for (var i in transactions) {
		if (!transactions.hasOwnProperty(i) || i == "count") {
			continue;
		}
		var transaction = transactions[i];
		var transactionTmp = transaction.getData();
		var trModel = Db.GetModel('transaction');
		trModel.remove({id: transactionTmp.id}, {}, function(err, numRemoved) {
			if (typeof callback === "function") {
				callback(err);
			}
		});
	}
}

UnconfirmedTransactions.GetAll = function(callback) {
	var trModel = Db.GetModel('transaction');
	trModel.find({blockId: null}).sort({
		timestamp: 1,
		id: 1
	}).exec(function(err, docs) {
		if (err) {
			Logger.warn("Find BlockTransactions ERROR!!!", err);
			if (typeof callback === "function") {
				callback(err);
			}
			return;
		}
		if (typeof callback === "function") {
			var transactionsMap = false;
			if (docs.length > 0) {
				transactionsMap = {
					count: 0
				};
				for (var i in docs) {
					transactionsMap[docs[i].id] = new Transaction(docs[i]);
					transactionsMap.count++;
				}
			}
			callback(null, transactionsMap);
		}
	});
}

UnconfirmedTransactions.GetAllTransactionsList = function(callback) {
	var trModel = Db.GetModel('transaction');
	trModel.find({}).sort({
		timestamp: -1,
		id: -1
	}).exec(function(err, docs) {
		if (err) {
			Logger.warn("Find BlockTransactions ERROR!!!", err);
			if (typeof callback === "function") {
				callback(err);
			}
			return;
		}
		if (typeof callback === "function") {
			callback(null, docs);
		}
	});
}

UnconfirmedTransactions.GetLastTransaction = function(callback) {
	var trModel = Db.GetModel('transaction');
	trModel.find({}).limit(1).sort({
		timestamp: -1,
		id: -1
	}).exec(function(err, docs) {
		if (err) {
			Logger.warn("Find transaction ERROR!!!", err);
			if (typeof callback === "function") {
				callback(err);
			}
			return;
		}
		if (typeof callback === "function") {
			var transaction = false;
			if (docs.length > 0) {
				transaction = new Transaction(docs[0]);
			}
			callback(null, transaction);
		}
	})
}

UnconfirmedTransactions.GetLastTransactions = function(n, callback) {
	var trModel = Db.GetModel('transaction');
	trModel.find({}).limit(n).sort({
		timestamp: -1,
		id: -1
	}).exec(function(err, docs) {
		if (err) {
			Logger.warn("Find transaction ERROR!!!", err);
			if (typeof callback === "function") {
				callback(err);
			}
			return;
		}
		if (typeof callback === "function") {
			if (docs.length > 0) {
				callback(null, docs);
			} else {
				callback(null, null);
			}
		}
	});
}

UnconfirmedTransactions.GetMyAllTransactions = function(accountId, callback) {
	var trModel = Db.GetModel('transaction');
	var q = {
		$or: [{
			recipientId: accountId
		}, {
			senderId: accountId
		}],
		type: Constants.TrTypePayment
	};
	trModel.find(q).sort({
		timestamp: -1,
		id: -1
	}).exec(function(err, docs) {
		if (!err) {
			Logger.warn("Find BlockTransactions ERROR!!!", err);
			if (typeof callback === "function") {
				callback(err);
			}
			return;
		}
		if (typeof callback === "function") {
			callback(null, docs);
		}
	});
}

UnconfirmedTransactions.GetMyTransactions = function(accountId, callback) {
	var q = {
		$or: [{
			recipientId: accountId
		}, {
			senderId: accountId
		}],
		$not: {
			blockId: null
		},
		type: Constants.TrTypePayment
	};
	UnconfirmedTransactions.GetTransactionsListByRs(q, callback);
}

UnconfirmedTransactions.GetTransactionsListByRs = function(q, callback) {
	var trModel = Db.GetModel('transaction');
	trModel.find(q, function(err, docs) {
		if (err) {
			Logger.warn("Find BlockTransactions ERROR!!!", err);
			if (typeof callback === "function") {
				callback(err);
			}
			return;
		}
		if (typeof callback === "function") {
			callback(null, docs);
		}
	});
}

UnconfirmedTransactions.FindTransaction = function(transactionId, callback) {
	var trModel = Db.GetModel('transaction');
	trModel.find({id: transactionId}, function(err, docs) {
		if (err) {
			Logger.warn("Find transaction ERROR!!!", err);
			if (typeof callback === "function") {
				callback(err);
			}
			return;
		}
		if (typeof callback === "function") {
			var transaction = false;
			if (docs.length > 0) {
				transaction = new Transaction(docs[0]);
			}
			callback(null, transaction);
		}
	});
}

UnconfirmedTransactions.FindTransactionByRs = function(rs, callback) {
	var trModel = Db.GetModel('transaction');
	trModel.find(rs, function(err, docs) {
		if (!err) {
			Logger.warn("Find transaction ERROR!!!", err);
			if (typeof callback === "function") {
				callback(err);
			}
			return;
		}
		if (typeof callback === "function") {
			var transaction = false;
			if (docs.length > 0) {
				transaction = new Transaction(docs[0]);
			}
			callback(null, transaction);
		}
	});
}

UnconfirmedTransactions.HasTransaction = function(transactionId, callback) {
	var trModel = Db.GetModel('transaction');
	trModel.find({id: transactionId}, function(err, docs) {
		if (!err) {
			Logger.error("Find transaction ERROR!!!", err);
			if (typeof callback === "function") {
				callback(err);
			}
			return;
		}
		if (typeof callback === "function") {
			if (docs.length > 0) {
				callback(null, true);
			} else {
				callback(null, false);
			}
		}
	});
}
