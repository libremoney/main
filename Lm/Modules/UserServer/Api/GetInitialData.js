/**!
 * LibreMoney 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var BigInteger = require(__dirname + '/../../Util/BigInteger');
var Blockchain = require(__dirname + '/../../Blockchain');
var Constants = require(__dirname + '/../../Constants');
var Convert = require(__dirname + '/../../Util/Convert');
var Core = require(__dirname + '/../../Core');
var Logger = require(__dirname + '/../../Logger').GetLogger(module);
var Peers = require(__dirname + '/../../Peers');
var TransactionProcessor = require(__dirname + '/../../TransactionProcessor');

var UserServer = require(__dirname + '/../UserServer');


// res = user
function GetInitialData(req, res) {
	//return UserRequestHandler.Create();

	var unconfirmedTransactions = new Array();
	var activePeers = new Array();
	var knownPeers = new Array();
	var blacklistedPeers = new Array();
	var recentBlocks = new Array();

	var trs = TransactionProcessor.GetAllUnconfirmedTransactions();
	for (var transaction in trs) {
		var unconfirmedTransaction = {};
		unconfirmedTransaction.index = UserServer.GetIndexByTransaction(transaction);
		unconfirmedTransaction.timestamp = transaction.GetTimestamp();
		unconfirmedTransaction.deadline = transaction.GetDeadline();
		unconfirmedTransaction.recipient = Convert.ToUnsignedLong(transaction.GetRecipientId());
		unconfirmedTransaction.amountMilliLm = transaction.GetAmountMilliLm();
		unconfirmedTransaction.feeMilliLm = transaction.GetFeeMilliLm();
		unconfirmedTransaction.sender = Convert.ToUnsignedLong(transaction.GetSenderId());
		unconfirmedTransaction.id = transaction.GetStringId();
		unconfirmedTransactions.push(unconfirmedTransaction);
	}

	for (var peer in Peers.GetAllPeers()) {
		if (peer.IsBlacklisted()) {
			var blacklistedPeer = {};
			blacklistedPeer.index = UserServer.GetIndexByPeer(peer);
			blacklistedPeer.address = peer.GetPeerAddress();
			blacklistedPeer.announcedAddress = Convert.Truncate(peer.GetAnnouncedAddress(), "-", 25, true);
			blacklistedPeer.software = peer.GetSoftware();
			if (peer.IsWellKnown()) {
				blacklistedPeer.wellKnown = true;
			}
			blacklistedPeers.push(blacklistedPeer);
		} else if (peer.GetState() == Peers.State.NON_CONNECTED) {
			var knownPeer = {};
			knownPeer.index = Users.GetIndex(peer);
			knownPeer.address = peer.GetPeerAddress();
			knownPeer.announcedAddress = Convert.Truncate(peer.GetAnnouncedAddress(), "-", 25, true);
			knownPeer.software = peer.GetSoftware();
			if (peer.IsWellKnown()) {
				knownPeer.wellKnown = true;
			}
			knownPeers.add(knownPeer);
		} else {
			var activePeer = {};
			activePeer.index = Users.GetIndex(peer);
			if (peer.GetState() == Peers.State.DISCONNECTED) {
				activePeer.disconnected = true;
			}
			activePeer.address = peer.GetPeerAddress();
			activePeer.announcedAddress = Convert.Truncate(peer.GetAnnouncedAddress(), "-", 25, true);
			activePeer.weight = peer.GetWeight();
			activePeer.downloaded = peer.GetDownloadedVolume();
			activePeer.uploaded = peer.GetUploadedVolume();
			activePeer.software = peer.GetSoftware();
			if (peer.IsWellKnown()) {
				activePeer.wellKnown = true;
			}
			activePeers.add(activePeer);
		}
	}

	var height = Blockchain.GetLastBlock().GetHeight();
	var lastBlocks = Blockchain.GetBlocksFromHeight(Math.max(0, height - 59));

	for (var i = lastBlocks.size() - 1; i >= 0; i--) {
		var block = lastBlocks[i];
		var recentBlock = {};
		recentBlock.index = Users.GetIndex(block);
		recentBlock.timestamp = block.GetTimestamp();
		recentBlock.numberOfTransactions = block.GetTransactionIds().length;
		recentBlock.totalAmountMilliLm = block.GetTotalAmountMilliLm();
		recentBlock.totalFeeMilliLm = block.GetTotalFeeMilliLm();
		recentBlock.payloadLength = block.GetPayloadLength();
		recentBlock.generator = Convert.ToUnsignedLong(block.GetGeneratorId());
		recentBlock.height = block.GetHeight();
		recentBlock.version = block.GetVersion();
		recentBlock.block = block.GetStringId();
		recentBlock.baseTarget = BigInteger.valueOf(block.GetBaseTarget()).multiply(BigInteger.valueOf(100000))
				.divide(BigInteger.valueOf(Constants.InitialBaseTarget));
		recentBlocks.push(recentBlock);
	}

	var response = {};
	response.response = "processInitialData";
	response.version = Core.GetVersion();
	if (unconfirmedTransactions.length > 0) {
		response.unconfirmedTransactions = unconfirmedTransactions;
	}
	if (activePeers.length > 0) {
		response.activePeers = activePeers;
	}
	if (knownPeers.length > 0) {
		response.knownPeers = knownPeers;
	}
	if (blacklistedPeers.length > 0) {
		response.blacklistedPeers = blacklistedPeers;
	}
	if (recentBlocks.length > 0) {
		response.recentBlocks = recentBlocks;
	}

	return response;
}


module.exports = GetInitialData;
