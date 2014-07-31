/**!
 * LibreMoney RebroadcastTransactionsThread 0.0
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

//private final Runnable RebroadcastTransactionsThread = new Runnable() {

function Run() {
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

exports.Run = Run;
