/**!
 * LibreMoney ProcessBlock 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

if (typeof module !== "undefined") {
	var Blockchain = require(__dirname + '/../Blockchain');
	var BlockchainProcessor = require(__dirname + '/../BlockchainProcessor');
	var Convert = require(__dirname + '/../../Lib/Util/Convert');
}


function ProcessBlock(request, peer) {
	try {
		if (!Blockchain.GetLastBlock().GetId().equals(Convert.ParseUnsignedLong(request.query.previousBlock))) {
			// do this check first to avoid validation failures of future blocks and transactions
			// when loading blockchain from scratch
			return {
				accepted: false
			};
		}
		BlockchainProcessor.ProcessPeerBlock(request);
		return {
			accepted: true
		};
	} catch (e) {
		if (peer != null) {
			peer.Blacklist(e);
		}
		return {
			accepted: false
		};
	}
}


if (typeof module !== "undefined") {
	exports.Create = ProcessBlock;
}
