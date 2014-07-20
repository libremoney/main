/**!
 * LibreMoney RemoveUnconfirmedTransactionsThread 0.0
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

//private final Runnable removeUnconfirmedTransactionsThread = new Runnable() {

function Run() {
	/*
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
	*/
}

exports.Run = Run;
