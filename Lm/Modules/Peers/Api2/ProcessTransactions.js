/**!
 * LibreMoney Peer ProcessTransactions 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */


//TransactionProcessor


function ProcessTransactions(request, peer) {
	try {
		TransactionProcessor.ProcessPeerTransactions(request);
	} catch (e) {
		peer.Blacklist(e);
	}
	return {}; // JSON.emptyJSON
}


if (typeof module !== "undefined") {
	module.exports = ProcessTransactions;
}
