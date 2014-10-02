/**!
 * LibreMoney TransactionProcessor 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

if (typeof module !== "undefined") {
	var events = require('events');
	var util = require('util');

	var Convert = require(__dirname + '/../../Lib/Util/Convert');
	var Listeners = require(__dirname + '/../../Lib/Util/Listeners');
	var Logger = require(__dirname + '/../../Lib/Util/Logger').GetLogger(module);
	//PeerProcessor
	var ThreadPool = require(__dirname + '/../ThreadPool');
	var Transactions = require(__dirname + '/../Transactions');
	var UnconfirmedTransactions = require(__dirname + '/../Transactions/UnconfirmedTransactions');
}


var TransactionProcessor = function() {
	events.EventEmitter.call(this);
	var unconfirmedTransactions = new Array(); //ConcurrentHashMap<>();
	var allUnconfirmedTransactions = new Array(); //Collections.unmodifiableCollection(unconfirmedTransactions.values());
	var nonBroadcastedTransactions = new Array(); //ConcurrentHashMap<>();
}

util.inherits(TransactionProcessor, events.EventEmitter);

TransactionProcessor.prototype.Event = {
	RemovedUnconfirmedTransactions: "RemovedUnconfirmedTransactions",
	AddedUnconfirmedTransactions: "AddedUnconfirmedTransactions",
	AddedConfirmedTransactions: "AddedConfirmedTransactions",
	AddedDoubleSpendingTransactions: "AddedDoubleSpendingTransactions"
	};

TransactionProcessor.prototype.AddListener = function(eventType, listener) {
	return this.addListener(eventType, listener);
}

TransactionProcessor.prototype.AddTransactionOrConfirmation = function(transaction, withConfirmation) {
	if (typeof withConfirmation === "undefined") {
		withConfirmation = false;
	}
	UnconfirmedTransactions.FindTransaction(transaction.GetId().toString(), function(err, resTx) {
		if (err || !resTx) {
			Logger.info("Add new TX from broadcast txID: " + transaction.GetId().toString());
			if (withConfirmation === true) {
				transaction.confirmations += 1;
			} else {
				transaction.confirmations = 1;
			}
			UnconfirmedTransactions.AddTransactions([transaction]);
			var senderAccount = Accounts.AddOrGetAccount(transaction.GetSenderId().toString());
			senderAccount.AddToUnconfirmedBalance(-Convert.RoundTo5Float(transaction.amount) - Convert.RoundTo5Float(transaction.fee));
			var recipientAccount = Accounts.AddOrGetAccount(transaction.recipientId.toString());
			recipientAccount.AddToUnconfirmedBalance(Convert.RoundTo5Float(transaction.amount));
			var blockchain = new Blockchain();
			blockchain.SetLastTransaction(transaction);
			Logger.info("Added transaction", transaction.GetId().toString());
			PeerProcessor.BroadcastNewTransaction(transaction);
			return;
		}
		if (resTx.confirmations < 1440) {
			Logger.info("Add TX confirmation txID: " + transaction.GetId().toString());
			UnconfirmedTransactions.AddConfirmation(transaction.GetId().toString());
		}
	});
}

TransactionProcessor.prototype.Apply = function(block) {
	throw new Error('Not implemented');
	/*
	block.apply();
	for (TransactionImpl transaction : block.getTransactions()) {
		transaction.apply();
	}
	*/
}

TransactionProcessor.prototype.ApplyUnconfirmed = function(unapplied) {
	throw new Error('Not implemented');
	/*
	List<Transaction> removedUnconfirmedTransactions = new ArrayList<>();
	for (Long transactionId : unapplied) {
		TransactionImpl transaction = unconfirmedTransactions.get(transactionId);
		if (! transaction.applyUnconfirmed()) {
			unconfirmedTransactions.remove(transactionId);
			removedUnconfirmedTransactions.add(transaction);
		}
	}
	if (removedUnconfirmedTransactions.size() > 0) {
		this.Notify(this.Event.RemovedUnconfirmedTransactions, removedUnconfirmedTransactions);
	}
	*/
}

TransactionProcessor.prototype.Broadcast = function(transaction) {
	if (!transaction.VerifySignature()) {
		throw new Error("ValidationException: Transaction signature verification failed");
	}
	var validTransactions = ProcessTransactions(Collections.SingletonList(transaction), true);
	if (validTransactions.indexOf(transaction) >= 0) {
		this.nonBroadcastedTransactions[transaction.GetId()] = transaction;
		Logger.debug("Accepted new transaction " + transaction.GetStringId());
	} else {
		Logger.debug("Rejecting double spending transaction " + transaction.GetStringId());
		throw new Error("ValidationException: Double spending transaction");
	}
}

TransactionProcessor.prototype.Clear = function() {
	this.unconfirmedTransactions.length = 0;
	this.nonBroadcastedTransactions.length = 0;
}

TransactionProcessor.prototype.GetAllUnconfirmedTransactions = function() {
	return this.allUnconfirmedTransactions;
}

TransactionProcessor.prototype.GetUnconfirmedTransaction = function(transactionId) {
	return this.unconfirmedTransactions[transactionId];
}

TransactionProcessor.prototype.Init = function(callback) {
	/*
	var Core = require(__dirname + '/../Core');
	Core.AddListener(Core.Event.Shutdown, function() {
		Shutdown();
	});
	*/
	ThreadPool.ScheduleThread(this.ProcessTransactionsThread, 5000, 'ProcessTransactionsThread');
	ThreadPool.ScheduleThread(this.RemoveUnconfirmedTransactionsThread, 1000, 'RemoveUnconfirmedTransactionsThread');
	ThreadPool.ScheduleThread(this.RebroadcastTransactionsThread, 60000, 'RebroadcastTransactionsThread');
	if (typeof callback === "function") {
		callback();
	}
}

TransactionProcessor.prototype.Notify = function(eventType, data) {
	return this.emit(eventType, data);
}

// value = bytes or transactionData
TransactionProcessor.prototype.ParseTransaction1 = function(value) {
	return Transactions.ParseTransaction(value);
}

TransactionProcessor.prototype.ParseTransaction2 = function(transactionData) {
	return Transactions.ParseTransaction(transactionData);
}

TransactionProcessor.prototype.ProcessPeerTransactions1 = function(request) {
	/*
	JSONArray transactionsData = (JSONArray)request.get("transactions");
	processPeerTransactions(transactionsData, true);
	*/
	throw new Error('Not implemented');
}

TransactionProcessor.prototype.ProcessPeerTransactions2 = function(transactionsData, sendToPeers) {
	throw new Error('Not implemented');
	/*
	List<TransactionImpl> transactions = new ArrayList<>();
	for (Object transactionData : transactionsData) {
		try {
			TransactionImpl transaction = parseTransaction((JSONObject)transactionData);
			try {
				transaction.validate();
			} catch (NxtException.NotCurrentlyValidException ignore) {}
			transactions.add(transaction);
		} catch (NxtException.NotValidException e) {
			Logger.logDebugMessage("Invalid transaction from peer: " + ((JSONObject) transactionData).toJSONString());
			throw e;
		}
	}
	processTransactions(transactions, sendToPeers);
	for (TransactionImpl transaction : transactions) {
		nonBroadcastedTransactions.remove(transaction.getId());
	}
	*/
}

TransactionProcessor.prototype.ProcessTransactions = function(transactions, sendToPeers) {
	var sendToPeersTransactions = [];
	var addedUnconfirmedTransactions = [];
	var addedDoubleSpendingTransactions = [];

	for (var transaction in transactions) {
		//try {
			var curTime = Convert.GetEpochTime();
			if (transaction.GetTimestamp() > curTime + 15 || transaction.GetExpiration() < curTime || transaction.GetDeadline() > 1440) {
				continue;
			}



			var id = transaction.GetId();
			if (Transactions.HasTransaction(id) || this.unconfirmedTransactions.ContainsKey(id) || ! transaction.Verify()) {
				continue;
			}

		/*
		//synchronized (BlockchainImpl.getInstance()) {
			if (Blockchain.GetHeight() < Constants.NQT_BLOCK) {
				break; // not ready to process transactions
			}
			var id = transaction.getId();
			if (TransactionDb.HasTransaction(id) || unconfirmedTransactions.containsKey(id)) {
				continue;
			}
			if (! transaction.verifySignature()) {
				if (Account.getAccount(transaction.getSenderId()) != null) {
					Logger.logDebugMessage("Transaction " + transaction.getJSONObject().toJSONString() + " failed to verify");
				}
				continue;
			}
			if (transaction.applyUnconfirmed()) {
				if (sendToPeers) {
					if (nonBroadcastedTransactions.containsKey(id)) {
						Logger.logDebugMessage("Received back transaction " + transaction.getStringId()
								+ " that we generated, will not forward to peers");
						nonBroadcastedTransactions.remove(id);
					} else {
						sendToPeersTransactions.add(transaction);
					}
				}
				unconfirmedTransactions.put(id, transaction);
				addedUnconfirmedTransactions.add(transaction);
			} else {
				addedDoubleSpendingTransactions.add(transaction);
			}
		//}
		*/
	}

	if (sendToPeersTransactions.length > 0) {
		Peers.SendToSomePeers(sendToPeersTransactions);
	}

	if (this.addedUnconfirmedTransactions.length > 0) {
		this.Notify(this.Event.AddedUnconfirmedTransactions, addedUnconfirmedTransactions);
	}
	if (addedDoubleSpendingTransactions.length > 0) {
		this.Notify(this.Event.AddedDoubleSpendingTransactions, addedDoubleSpendingTransactions);
	}
	return addedUnconfirmedTransactions;
}

TransactionProcessor.prototype.ProcessTransactionsThread = function() {
	var getUnconfirmedTransactionsRequest = {
		requestType: "getUnconfirmedTransactions"
	}
	/*
	try {
		try {
			Peer peer = Peers.getAnyPeer(Peer.State.CONNECTED, true);
			if (peer == null) {
				return;
			}
			JSONObject response = peer.send(getUnconfirmedTransactionsRequest);
			if (response == null) {
				return;
			}
			JSONArray transactionsData = (JSONArray)response.get("unconfirmedTransactions");
			if (transactionsData == null || transactionsData.size() == 0) {
				return;
			}
			try {
				processPeerTransactions(transactionsData, false);
			} catch (RuntimeException e) {
				peer.blacklist(e);
			}
		} catch (Exception e) {
			Logger.logDebugMessage("Error processing unconfirmed transactions from peer", e);
		}
	} catch (Throwable t) {
		Logger.logMessage("CRITICAL ERROR. PLEASE REPORT TO THE DEVELOPERS.\n" + t.toString());
		t.printStackTrace();
		System.exit(1);
	}
	*/
}

TransactionProcessor.prototype.RebroadcastTransactionsThread = function() {
	/*
	try {
		try {
			List<Transaction> transactionList = new ArrayList<>();
			int curTime = Convert.getEpochTime();
			for (TransactionImpl transaction : nonBroadcastedTransactions.values()) {
				if (Transactions.HasTransaction(transaction.getId()) || transaction.getExpiration() < curTime) {
					nonBroadcastedTransactions.remove(transaction.getId());
				} else if (transaction.getTimestamp() < curTime - 30) {
					transactionList.add(transaction);
				}
			}
			if (transactionList.size() > 0) {
				Peers.sendToSomePeers(transactionList);
			}
		} catch (Exception e) {
			Logger.logDebugMessage("Error in transaction re-broadcasting thread", e);
		}
	} catch (Throwable t) {
		Logger.logMessage("CRITICAL ERROR. PLEASE REPORT TO THE DEVELOPERS.\n" + t.toString());
		t.printStackTrace();
		System.exit(1);
	}
	*/
}

TransactionProcessor.prototype.RemoveListener = function(eventType, listener) {
	return this.RemoveListener(eventType, listener);
}

TransactionProcessor.prototype.RemoveUnconfirmedTransactions = function(transactions) {
	return UnconfirmedTransactions.DeleteTransactions(transactions, callback);
	/*
	List<Transaction> removedList;
	synchronized (BlockchainImpl.getInstance()) {
		removedList = new ArrayList<>();
		for (TransactionImpl transaction : transactions) {
			if (unconfirmedTransactions.remove(transaction.getId()) != null) {
				transaction.undoUnconfirmed();
				removedList.add(transaction);
			}
		}
	}
	this.Notify(this.Event.RemovedUnconfirmedTransactions, removedList);
	*/
}

TransactionProcessor.prototype.RemoveUnconfirmedTransactionsThread = function() {
	var curTime = Convert.GetEpochTime();
	var removedUnconfirmedTransactions = [];

	for (var i in this.unconfirmedTransactions) {
		var transaction = unconfirmedTransactions[i];
		if (transaction.GetExpiration() < curTime) {
			this.unconfirmedTransactions.splice(unconfirmedTransactions.indexOf(transaction), 1); // remove
			transaction.UndoUnconfirmed();
			removedUnconfirmedTransactions.push(transaction);
		}
	}
	if (removedUnconfirmedTransactions.length > 0) {
		this.Notify(Event.RemovedUnconfirmedTransactions, removedUnconfirmedTransactions);
	}

	/*
		} catch (Exception e) {
			Logger.logDebugMessage("Error removing unconfirmed transactions", e);
		}
	} catch (Throwable t) {
		Logger.logMessage("CRITICAL ERROR. PLEASE REPORT TO THE DEVELOPERS.\n" + t.toString());
		t.printStackTrace();
		System.exit(1);
	}
	*/
}

TransactionProcessor.prototype.Shutdown = function() {
	RemoveUnconfirmedTransactions(unconfirmedTransactions);
}

TransactionProcessor.prototype.Undo = function(block) {
	throw new Error('Not implemented');
	/*
	block.undo();
	List<Transaction> addedUnconfirmedTransactions = new ArrayList<>();
	for (TransactionImpl transaction : block.getTransactions()) {
		unconfirmedTransactions.put(transaction.getId(), transaction);
		transaction.undo();
		addedUnconfirmedTransactions.add(transaction);
	}
	if (addedUnconfirmedTransactions.size() > 0) {
		this.Notify(this.Event.AddedUnconfirmedTransactions, addedUnconfirmedTransactions);
	}
	*/
}

TransactionProcessor.prototype.UndoAllUnconfirmed = function() {
	throw new Error('Not implemented');
	/*
	HashSet<Long> undone = new HashSet<>();
	for (TransactionImpl transaction : unconfirmedTransactions.values()) {
		transaction.undoUnconfirmed();
		undone.add(transaction.getId());
	}
	return undone;
	*/
}

TransactionProcessor.prototype.UpdateUnconfirmedTransactions = function(block) {
	throw new Error('Not implemented');
	/*
	List<Transaction> addedConfirmedTransactions = new ArrayList<>();
	List<Transaction> removedUnconfirmedTransactions = new ArrayList<>();

	for (Transaction transaction : block.getTransactions()) {
		addedConfirmedTransactions.add(transaction);
		Transaction removedTransaction = unconfirmedTransactions.remove(transaction.getId());
		if (removedTransaction != null) {
			removedUnconfirmedTransactions.add(removedTransaction);
		}
	}

	if (removedUnconfirmedTransactions.size() > 0) {
		this.Notify(this.Event.RemovedUnconfirmedTransactions, removedUnconfirmedTransactions);
	}
	if (addedConfirmedTransactions.size() > 0) {
		this.Notify(this.Event.AddedConfirmedTransactions, addedConfirmedTransactions);
	}
	*/
}

TransactionProcessor.prototype.VerifiyTransaction = function(transaction, unconfTransArr, callback) {
	if (typeof unconfTransArr === "function") {
		callback = unconfTransArr;
		unconfTransArr = []
	}
	TransactionDb.HasTransaction(transaction.GetId(), function(res) {
		if (res) {
			callback("Transaction " + transaction.GetStringId() + " is already in the blockchain");
			return;
		}

		function validContinue() {
			if (!transaction.Verify()) {
				callback("Signature verification failed for transaction " + transaction.GetStringId());
				return;
			}
			if (transaction.GetId().equals(new long(0))) {
				callback("Invalid transaction id");
				return;
			}
			try {
				transaction.ValidateAttachment();
			} catch (e) {
				callback(e);
			}


			/*
			var account = Accounts.GetAccount(transaction.senderId.toString());
			//self.SetAmount(Convert.RoundTo5Float(account.balance));
			//self.SetUnconfirmedAmount(Convert.RoundTo5Float(account.unconfirmedBalance));
			if (account == null || transaction.amount + transaction.fee > parseFloat(account.unconfirmedAmount)) {
				callback("Not Enough money accId:" + transaction.senderId.toString());
			}
			*/
			callback(null);
		}
		TransactionDb.HasTransaction(transaction.referencedTransactionId.toString(), function(res) {
			if (!res && transaction.referencedTransactionId != null) {
				var isInUnconfTx = false;
				for (var index = 0; index < unconfTransArr.length; ++index) {
					var tx = unconfTransArr[index];
					if (tx.id.toString() == transaction.referencedTransactionId.toString()) {
						isInUnconfTx = true;
						break;
					}
				}
				UnconfirmedTransactions.HasTransaction(transaction.referencedTransactionId.toString(), function(res) {
					if (!res && !isInUnconfTx) {
						callback("Missing referenced transaction " + transaction.referencedTransactionId.toString() + " for transaction " + transaction.GetStringId());
					} else {
						validContinue();
					}
				})
			} else {
				validContinue();
			}
		});
	});
}


if (typeof module !== "undefined") {
	module.exports = new TransactionProcessor();
}
