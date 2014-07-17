/*
import nxt.util.Observable;
import org.json.simple.JSONObject;

import nxt.peer.Peer;
import nxt.peer.Peers;
import nxt.util.Convert;
import nxt.util.JSON;
import nxt.util.Listener;
import nxt.util.Listeners;
import nxt.util.Logger;
import nxt.util.ThreadPool;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.JSONStreamAware;
*/

var LmTransactionProcessor = {}; // instance

var Event = {
	REMOVED_UNCONFIRMED_TRANSACTIONS:0,
	ADDED_UNCONFIRMED_TRANSACTIONS:1,
	ADDED_CONFIRMED_TRANSACTIONS:2,
	ADDED_DOUBLESPENDING_TRANSACTIONS:3
	};

/*
private static final TransactionProcessorImpl instance = new TransactionProcessorImpl();
*/

/*
static TransactionProcessorImpl getInstance() {
	return instance;
}
*/

/*
private final ConcurrentMap<Long, TransactionImpl> unconfirmedTransactions = new ConcurrentHashMap<>();
private final Collection<TransactionImpl> allUnconfirmedTransactions = Collections.unmodifiableCollection(unconfirmedTransactions.values());
private final ConcurrentMap<Long, TransactionImpl> nonBroadcastedTransactions = new ConcurrentHashMap<>();
private final Listeners<List<Transaction>,Event> transactionListeners = new Listeners<>();
*/

/*
private final Runnable removeUnconfirmedTransactionsThread = new Runnable() {

	@Override
	public void run() {

		try {
			try {

				int curTime = Convert.getEpochTime();
				List<Transaction> removedUnconfirmedTransactions = new ArrayList<>();

				synchronized (BlockchainImpl.getInstance()) {
					Iterator<TransactionImpl> iterator = unconfirmedTransactions.values().iterator();
					while (iterator.hasNext()) {
						TransactionImpl transaction = iterator.next();
						if (transaction.getExpiration() < curTime) {
							iterator.remove();
							transaction.undoUnconfirmed();
							removedUnconfirmedTransactions.add(transaction);
						}
					}
				}

				if (removedUnconfirmedTransactions.size() > 0) {
					transactionListeners.notify(removedUnconfirmedTransactions, Event.REMOVED_UNCONFIRMED_TRANSACTIONS);
				}

			} catch (Exception e) {
				Logger.logDebugMessage("Error removing unconfirmed transactions", e);
			}
		} catch (Throwable t) {
			Logger.logMessage("CRITICAL ERROR. PLEASE REPORT TO THE DEVELOPERS.\n" + t.toString());
			t.printStackTrace();
			System.exit(1);
		}

	}

};
*/

/*
private final Runnable rebroadcastTransactionsThread = new Runnable() {

	@Override
	public void run() {

		try {
			try {
				List<Transaction> transactionList = new ArrayList<>();
				int curTime = Convert.getEpochTime();
				for (TransactionImpl transaction : nonBroadcastedTransactions.values()) {
					if (TransactionDb.hasTransaction(transaction.getId()) || transaction.getExpiration() < curTime) {
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

	}

};
*/

/*
private final Runnable processTransactionsThread = new Runnable() {

	private final JSONStreamAware getUnconfirmedTransactionsRequest;
	{
		JSONObject request = new JSONObject();
		request.put("requestType", "getUnconfirmedTransactions");
		getUnconfirmedTransactionsRequest = JSON.prepareRequest(request);
	}

	@Override
	public void run() {
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
	}

};
*/

/*
private TransactionProcessorImpl() {
	ThreadPool.scheduleThread(processTransactionsThread, 5);
	ThreadPool.scheduleThread(removeUnconfirmedTransactionsThread, 1);
	ThreadPool.scheduleThread(rebroadcastTransactionsThread, 60);
}
*/

function AddListener(listener, eventType) {
	throw new Error('Not implemented');
	/*
	return transactionListeners.addListener(listener, eventType);
	*/
}

function GetAllUnconfirmedTransactions() {
	throw new Error('Not implemented');
	/*
	return allUnconfirmedTransactions;
	*/
}

function GetUnconfirmedTransaction(transactionId) {
	throw new Error('Not implemented');
	/*
	return unconfirmedTransactions.get(transactionId);
	*/
}

function RemoveListener(listener, eventType) {
	throw new Error('Not implemented');
	/*
	return transactionListeners.removeListener(listener, eventType);
	*/
}

function NewTransaction(deadline, senderPublicKey, recipientId, amountNQT, feeNQT, referencedTransactionFullHash, attachment) {
	throw new Error('Not implemented');
	/*
	TransactionImpl transaction = new TransactionImpl(TransactionType.Payment.ORDINARY, Convert.getEpochTime(), deadline, senderPublicKey,
			recipientId, amountNQT, feeNQT, referencedTransactionFullHash, null);
	transaction.validateAttachment();
	return transaction;
	*/


	/*
	TransactionImpl transaction = new TransactionImpl(attachment.getTransactionType(), Convert.getEpochTime(), deadline,
			senderPublicKey, recipientId, amountNQT, feeNQT, referencedTransactionFullHash, null);
	transaction.setAttachment(attachment);
	transaction.validateAttachment();
	return transaction;
	*/
}

function Broadcast(transaction) {
	throw new Error('Not implemented');
	/*
	if (! transaction.verify()) {
		throw new NxtException.ValidationException("Transaction signature verification failed");
	}
	List<Transaction> validTransactions = processTransactions(Collections.singletonList((TransactionImpl) transaction), true);
	if (validTransactions.contains(transaction)) {
		nonBroadcastedTransactions.put(transaction.getId(), (TransactionImpl) transaction);
		Logger.logDebugMessage("Accepted new transaction " + transaction.getStringId());
	} else {
		Logger.logDebugMessage("Rejecting double spending transaction " + transaction.getStringId());
		throw new NxtException.ValidationException("Double spending transaction");
	}
	*/
}

function ProcessPeerTransactions1(request) {
	throw new Error('Not implemented');
	/*
	JSONArray transactionsData = (JSONArray)request.get("transactions");
	processPeerTransactions(transactionsData, true);
	*/
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

// value = bytes or transactionData
function ParseTransaction(value) {
	throw new Error('Not implemented');
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
}

function Clear() {
	throw new Error('Not implemented');
	/*
	unconfirmedTransactions.clear();
	nonBroadcastedTransactions.clear();
	*/
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
		transactionListeners.notify(addedUnconfirmedTransactions, TransactionProcessor.Event.ADDED_UNCONFIRMED_TRANSACTIONS);
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
		transactionListeners.notify(removedUnconfirmedTransactions, TransactionProcessor.Event.REMOVED_UNCONFIRMED_TRANSACTIONS);
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
		transactionListeners.notify(removedUnconfirmedTransactions, TransactionProcessor.Event.REMOVED_UNCONFIRMED_TRANSACTIONS);
	}
	if (addedConfirmedTransactions.size() > 0) {
		transactionListeners.notify(addedConfirmedTransactions, TransactionProcessor.Event.ADDED_CONFIRMED_TRANSACTIONS);
	}
	*/
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
	transactionListeners.notify(removedList, Event.REMOVED_UNCONFIRMED_TRANSACTIONS);
	*/
}

function Shutdown() {
	throw new Error('Not implemented');
	/*
	removeUnconfirmedTransactions(new ArrayList<>(unconfirmedTransactions.values()));
	*/
}

function ProcessTransactions(transactions, sendToPeers) {
	throw new Error('Not implemented');
	/*
	List<Transaction> sendToPeersTransactions = new ArrayList<>();
	List<Transaction> addedUnconfirmedTransactions = new ArrayList<>();
	List<Transaction> addedDoubleSpendingTransactions = new ArrayList<>();

	for (TransactionImpl transaction : transactions) {

		try {

			int curTime = Convert.getEpochTime();
			if (transaction.getTimestamp() > curTime + 15 || transaction.getExpiration() < curTime
					|| transaction.getDeadline() > 1440) {
				continue;
			}

			synchronized (BlockchainImpl.getInstance()) {

				if (Nxt.getBlockchain().getHeight() < Constants.NQT_BLOCK) {
					break; // not ready to process transactions
				}

				Long id = transaction.getId();
				if (TransactionDb.hasTransaction(id) || unconfirmedTransactions.containsKey(id)
						|| ! transaction.verify()) {
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
			}

		} catch (RuntimeException e) {
			Logger.logMessage("Error processing transaction", e);
		}

	}

	if (sendToPeersTransactions.size() > 0) {
		Peers.sendToSomePeers(sendToPeersTransactions);
	}

	if (addedUnconfirmedTransactions.size() > 0) {
		transactionListeners.notify(addedUnconfirmedTransactions, Event.ADDED_UNCONFIRMED_TRANSACTIONS);
	}
	if (addedDoubleSpendingTransactions.size() > 0) {
		transactionListeners.notify(addedDoubleSpendingTransactions, Event.ADDED_DOUBLESPENDING_TRANSACTIONS);
	}
	return addedUnconfirmedTransactions;
	*/
}


exports.Event = Event;
exports.AddListener = AddListener;
exports.GetAllUnconfirmedTransactions = GetAllUnconfirmedTransactions;
exports.GetUnconfirmedTransaction = GetUnconfirmedTransaction;
exports.RemoveListener = RemoveListener;
exports.NewTransaction = NewTransaction;
exports.Broadcast = Broadcast;
exports.ProcessPeerTransactions1 = ProcessPeerTransactions1;
exports.ProcessPeerTransactions2 = ProcessPeerTransactions2;
exports.ParseTransaction = ParseTransaction;
exports.Clear = Clear;
exports.Apply = Apply;
exports.Undo = Undo;
exports.ApplyUnconfirmed = ApplyUnconfirmed;
exports.UndoAllUnconfirmed = UndoAllUnconfirmed;
exports.UpdateUnconfirmedTransactions = UpdateUnconfirmedTransactions;
exports.RemoveUnconfirmedTransactions = RemoveUnconfirmedTransactions;
exports.Shutdown = Shutdown;
exports.ProcessTransactions = ProcessTransactions;
