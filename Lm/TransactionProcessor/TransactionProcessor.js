/**!
 * LibreMoney TransactionProcessor 0.0
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var Convert = require(__dirname + '/../Util/Convert');
//var Core = require(__dirname + '/../Core');
var Listeners = require(__dirname + '/../Util/Listeners');
var Logger = require(__dirname + '/../Logger').GetLogger(module);
var ThreadPool = require(__dirname + '/../ThreadPool');
var Transactions = require(__dirname + '/../Transactions');

var ProcessTransactionsThread = require(__dirname + '/ProcessTransactionsThread');
var RebroadcastTransactionsThread = require(__dirname + '/RebroadcastTransactionsThread');


var Event = {
	REMOVED_UNCONFIRMED_TRANSACTIONS:0,
	ADDED_UNCONFIRMED_TRANSACTIONS:1,
	ADDED_CONFIRMED_TRANSACTIONS:2,
	ADDED_DOUBLESPENDING_TRANSACTIONS:3
	};


var unconfirmedTransactions = new Array(); //ConcurrentHashMap<>();
var allUnconfirmedTransactions = new Array(); //Collections.unmodifiableCollection(unconfirmedTransactions.values());
var nonBroadcastedTransactions = new Array(); //ConcurrentHashMap<>();
var transactionListeners = new Listeners();


function AddListener(eventType, listener) {
	return transactionListeners.AddListener(eventType, listener);
}

function Apply(block) {
	throw new Error('Not implemented');
	/*
	block.apply();
	for (TransactionImpl transaction : block.getTransactions()) {
		transaction.apply();
	}
	*/
}

function ApplyUnconfirmed(unapplied) {
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
		transactionListeners.Notify(TransactionProcessor.Event.REMOVED_UNCONFIRMED_TRANSACTIONS, removedUnconfirmedTransactions);
	}
	*/
}

function Broadcast(transaction) {
	if (!transaction.Verify()) {
		throw new Error("ValidationException: Transaction signature verification failed");
	}
	var validTransactions = ProcessTransactions(Collections.SingletonList(transaction), true);
	if (validTransactions.indexOf(transaction) >= 0) {
		nonBroadcastedTransactions[transaction.GetId()] = transaction;
		Logger.debug("Accepted new transaction " + transaction.GetStringId());
	} else {
		Logger.debug("Rejecting double spending transaction " + transaction.GetStringId());
		throw new Error("ValidationException: Double spending transaction");
	}
}

function Clear() {
	unconfirmedTransactions.length = 0;
	nonBroadcastedTransactions.length = 0;
}

function GetAllUnconfirmedTransactions() {
	return allUnconfirmedTransactions;
}

function GetUnconfirmedTransaction(transactionId) {
	return unconfirmedTransactions[transactionId];
}

function Init(callback) {
	/*
	Core.AddListener(Core.Event.Shutdown, function() {
		Shutdown();
	});
	*/
	ThreadPool.ScheduleThread(ProcessTransactionsThread.Run, 5000, 'ProcessTransactionsThread');
	ThreadPool.ScheduleThread(RemoveUnconfirmedTransactionsThread, 1000, 'RemoveUnconfirmedTransactionsThread');
	ThreadPool.ScheduleThread(RebroadcastTransactionsThread.Run, 60000, 'RebroadcastTransactionsThread');
	if (callback) callback();
}

// value = bytes or transactionData
function ParseTransaction(value) {
	/*
	ByteBuffer buffer = ByteBuffer.wrap(bytes);
	buffer.order(ByteOrder.LITTLE_ENDIAN);

	byte type = buffer.get();
	byte subtype = buffer.get();
	int timestamp = buffer.getInt();
	short deadline = buffer.getShort();
	byte[] senderPublicKey = new byte[32];
	buffer.get(senderPublicKey);
	Long recipientId = buffer.getLong();
	long amountNQT = buffer.getLong();
	long feeNQT = buffer.getLong();
	String referencedTransactionFullHash = null;
	byte[] referencedTransactionFullHashBytes = new byte[32];
	buffer.get(referencedTransactionFullHashBytes);
	if (Convert.emptyToNull(referencedTransactionFullHashBytes) != null) {
		referencedTransactionFullHash = Convert.toHexString(referencedTransactionFullHashBytes);
	}
	byte[] signature = new byte[64];
	buffer.get(signature);
	signature = Convert.emptyToNull(signature);

	TransactionType transactionType = TransactionType.findTransactionType(type, subtype);
	TransactionImpl transaction;
	transaction = new TransactionImpl(transactionType, timestamp, deadline, senderPublicKey, recipientId,
			amountNQT, feeNQT, referencedTransactionFullHash, signature);
	transactionType.loadAttachment(transaction, buffer);

	return transaction;
	*/

	/*
	byte type = ((Long)transactionData.get("type")).byteValue();
	byte subtype = ((Long)transactionData.get("subtype")).byteValue();
	int timestamp = ((Long)transactionData.get("timestamp")).intValue();
	short deadline = ((Long)transactionData.get("deadline")).shortValue();
	byte[] senderPublicKey = Convert.parseHexString((String) transactionData.get("senderPublicKey"));
	Long recipientId = Convert.parseUnsignedLong((String) transactionData.get("recipient"));
	if (recipientId == null) recipientId = 0L; // ugly
	long amountNQT = (Long) transactionData.get("amountNQT");
	long feeNQT = (Long) transactionData.get("feeNQT");
	String referencedTransactionFullHash = (String) transactionData.get("referencedTransactionFullHash");
	byte[] signature = Convert.parseHexString((String) transactionData.get("signature"));

	TransactionType transactionType = TransactionType.findTransactionType(type, subtype);
	TransactionImpl transaction = new TransactionImpl(transactionType, timestamp, deadline, senderPublicKey, recipientId,
			amountNQT, feeNQT, referencedTransactionFullHash, signature);

	JSONObject attachmentData = (JSONObject)transactionData.get("attachment");
	transactionType.loadAttachment(transaction, attachmentData);
	return transaction;
	*/
	throw new Error('Not implemented');
}

function ProcessPeerTransactions1(request) {
	/*
	JSONArray transactionsData = (JSONArray)request.get("transactions");
	processPeerTransactions(transactionsData, true);
	*/
	throw new Error('Not implemented');
}

function ProcessPeerTransactions2(transactionsData, sendToPeers) {
	throw new Error('Not implemented');
	/*
	List<TransactionImpl> transactions = new ArrayList<>();
	for (Object transactionData : transactionsData) {
		try {
			TransactionImpl transaction = parseTransaction((JSONObject)transactionData);
			transaction.validateAttachment();
			transactions.add(transaction);
		} catch (NxtException.ValidationException e) {
			//if (! (e instanceof TransactionType.NotYetEnabledException)) {
			//    Logger.logDebugMessage("Dropping invalid transaction: " + e.getMessage());
			//}
		}
	}
	processTransactions(transactions, sendToPeers);
	for (TransactionImpl transaction : transactions) {
		nonBroadcastedTransactions.remove(transaction.getId());
	}
	*/
}

function ProcessTransactions(transactions, sendToPeers) {
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
			if (Transactions.HasTransaction(id) || unconfirmedTransactions.ContainsKey(id) || ! transaction.Verify()) {
				continue;
			}

			if (transaction.ApplyUnconfirmed()) {
				if (sendToPeers) {
					if (nonBroadcastedTransactions.indexOf(id) >= 0) { // containsKey
						Logger.debug("Received back transaction " + transaction.GetStringId()
								+ " that we generated, will not forward to peers");
						var i = nonBroadcastedTransactions.indexOf(id);
						if (i >= 0)
							nonBroadcastedTransactions[i] = null;
					} else {
						sendToPeersTransactions.push(transaction);
					}
				}
				unconfirmedTransactions[id] = transaction;
				addedUnconfirmedTransactions.push(transaction);
			} else {
				addedDoubleSpendingTransactions.push(transaction);
			}
		//} catch (RuntimeException e) {
		//	Logger.logMessage("Error processing transaction", e);
		//}
	}

	if (sendToPeersTransactions.length > 0) {
		Peers.SendToSomePeers(sendToPeersTransactions);
	}

	if (addedUnconfirmedTransactions.length > 0) {
		transactionListeners.Notify(Event.ADDED_UNCONFIRMED_TRANSACTIONS, addedUnconfirmedTransactions);
	}
	if (addedDoubleSpendingTransactions.length > 0) {
		transactionListeners.Notify(Event.ADDED_DOUBLESPENDING_TRANSACTIONS, addedDoubleSpendingTransactions);
	}
	return addedUnconfirmedTransactions;
}

function RemoveListener(eventType, listener) {
	return transactionListeners.RemoveListener(eventType, listener);
}

function RemoveUnconfirmedTransactions(transactions) {
	throw new Error('Not implemented');
	/*
	List<Transaction> removedList = new ArrayList<>();
	for (TransactionImpl transaction : transactions) {
		if (unconfirmedTransactions.remove(transaction.getId()) != null) {
			transaction.undoUnconfirmed();
			removedList.add(transaction);
		}
	}
	transactionListeners.Notify(Event.REMOVED_UNCONFIRMED_TRANSACTIONS, removedList);
	*/
}

function RemoveUnconfirmedTransactionsThread() {
	var curTime = Convert.GetEpochTime();
	var removedUnconfirmedTransactions = [];

	for (var transaction in unconfirmedTransactions) {
		if (transaction.GetExpiration() < curTime) {
			unconfirmedTransactions.splice(unconfirmedTransactions.indexOf(transaction), 1); // remove
			transaction.UndoUnconfirmed();
			removedUnconfirmedTransactions.push(transaction);
		}
	}
	if (removedUnconfirmedTransactions.length > 0) {
		transactionListeners.Notify(Event.REMOVED_UNCONFIRMED_TRANSACTIONS, removedUnconfirmedTransactions);
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

function Shutdown() {
	RemoveUnconfirmedTransactions(unconfirmedTransactions);
}

function Undo(block) {
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
		transactionListeners.Notify(TransactionProcessor.Event.ADDED_UNCONFIRMED_TRANSACTIONS, addedUnconfirmedTransactions);
	}
	*/
}

function UndoAllUnconfirmed() {
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

function UpdateUnconfirmedTransactions(block) {
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
		transactionListeners.Notify(TransactionProcessor.Event.REMOVED_UNCONFIRMED_TRANSACTIONS, removedUnconfirmedTransactions);
	}
	if (addedConfirmedTransactions.size() > 0) {
		transactionListeners.Notify(TransactionProcessor.Event.ADDED_CONFIRMED_TRANSACTIONS, addedConfirmedTransactions);
	}
	*/
}


exports.AddListener = AddListener;
exports.Apply = Apply;
exports.ApplyUnconfirmed = ApplyUnconfirmed;
exports.Broadcast = Broadcast;
exports.Clear = Clear;
exports.Event = Event;
exports.GetAllUnconfirmedTransactions = GetAllUnconfirmedTransactions;
exports.GetUnconfirmedTransaction = GetUnconfirmedTransaction;
exports.Init = Init;
exports.ParseTransaction = ParseTransaction;
exports.ProcessPeerTransactions1 = ProcessPeerTransactions1;
exports.ProcessPeerTransactions2 = ProcessPeerTransactions2;
exports.ProcessTransactions = ProcessTransactions;
exports.RemoveListener = RemoveListener;
exports.RemoveUnconfirmedTransactions = RemoveUnconfirmedTransactions;
exports.Shutdown = Shutdown;
exports.Undo = Undo;
exports.UndoAllUnconfirmed = UndoAllUnconfirmed;
exports.UpdateUnconfirmedTransactions = UpdateUnconfirmedTransactions;
