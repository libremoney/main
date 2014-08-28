/*!
 * LibreMoney 0.0
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var Blocks = require(__dirname + '/../Blocks');


var getCumulativeDifficultyRequest = {};
var peerHasMore;


getCumulativeDifficultyRequest.requestType = "getCumulativeDifficulty";


function Run() {
	/*
	if (Run1())
		Run2();
	*/
	throw new Error('Not implementted');
	/*
	try {
		try {


		} catch (Exception e) {
			Logger.logDebugMessage("Error in milestone blocks processing thread", e);
		}
	} catch (Throwable t) {
		Logger.logMessage("CRITICAL ERROR. PLEASE REPORT TO THE DEVELOPERS.\n" + t.toString());
		t.printStackTrace();
		System.exit(1);
	}
	*/
}

function Run1() {
	/*
	peerHasMore = true;
	var peer = Peers.GetAnyPeer(Peer.State.CONNECTED, true);
	if (!peer) {
		return false;
	}
	lastBlockchainFeeder = peer;
	var response = peer.Send(getCumulativeDifficultyRequest);
	if (!response) {
		return false;
	}
	var curCumulativeDifficulty = Blockchain.GetLastBlock().GetCumulativeDifficulty();
	String peerCumulativeDifficulty = (String) response.get("cumulativeDifficulty");
	if (peerCumulativeDifficulty == null) {
		return;
	}
	BigInteger betterCumulativeDifficulty = new BigInteger(peerCumulativeDifficulty);
	if (betterCumulativeDifficulty.compareTo(curCumulativeDifficulty) <= 0) {
		return;
	}
	if (response.get("blockchainHeight") != null) {
		lastBlockchainFeederHeight = ((Long) response.get("blockchainHeight")).intValue();
	}

	Long commonBlockId = Genesis.GENESIS_BLOCK_ID;

	if (! blockchain.getLastBlock().getId().equals(Genesis.GENESIS_BLOCK_ID)) {
		commonBlockId = getCommonMilestoneBlockId(peer);
	}
	if (commonBlockId == null || !peerHasMore) {
		return;
	}

	commonBlockId = getCommonBlockId(peer, commonBlockId);
	if (commonBlockId == null || !peerHasMore) {
		return;
	}

	final Block commonBlock = Blocks.FindBlock(commonBlockId);
	if (blockchain.getLastBlock().getHeight() - commonBlock.getHeight() >= 720) {
		return;
	}

	Long currentBlockId = commonBlockId;
	List<BlockImpl> forkBlocks = new ArrayList<>();
	*/
}

function Run2() {
	/*
	boolean processedAll = true;
	int requestCount = 0;
	outer:
	while (forkBlocks.size() < 1440 && requestCount++ < 10) {
		JSONArray nextBlocks = getNextBlocks(peer, currentBlockId);
		if (nextBlocks == null || nextBlocks.size() == 0) {
			break;
		}
		synchronized (blockchain) {
			for (Object o : nextBlocks) {
				JSONObject blockData = (JSONObject) o;
				BlockImpl block;
				try {
					block = parseBlock(blockData);
				} catch (NxtException.NotCurrentlyValidException e) {
					Logger.logDebugMessage("Cannot validate block: " + e.toString()
							+ ", will try again later", e);
					processedAll = false;
					break outer;
				} catch (RuntimeException|NxtException.ValidationException e) {
					Logger.logDebugMessage("Failed to parse block: " + e.toString(), e);
					peer.blacklist();
					return;
				}
				currentBlockId = block.getId();

				if (blockchain.getLastBlock().getId().equals(block.getPreviousBlockId())) {
					try {
						pushBlock(block);
					} catch (BlockNotAcceptedException e) {
						peer.blacklist(e);
						return;
					}
				} else if (!Blocks.HasBlock(block.GetId(), xxxx)) {
					forkBlocks.add(block);
				}
			}
		} //synchronized
	}

	if (forkBlocks.size() > 0) {
		processedAll = false;
	}

	if (! processedAll && blockchain.getLastBlock().getHeight() - commonBlock.getHeight() < 720) {
		processFork(peer, forkBlocks, commonBlock);
	}
	*/
}

function GetCommonMilestoneBlockId(peer) {
	throw new Error('Not implementted');
	/*
	String lastMilestoneBlockId = null;

	while (true) {
		JSONObject milestoneBlockIdsRequest = new JSONObject();
		milestoneBlockIdsRequest.put("requestType", "getMilestoneBlockIds");
		if (lastMilestoneBlockId == null) {
			milestoneBlockIdsRequest.put("lastBlockId", blockchain.getLastBlock().getStringId());
		} else {
			milestoneBlockIdsRequest.put("lastMilestoneBlockId", lastMilestoneBlockId);
		}

		JSONObject response = peer.send(JSON.prepareRequest(milestoneBlockIdsRequest));
		if (response == null) {
			return null;
		}
		JSONArray milestoneBlockIds = (JSONArray) response.get("milestoneBlockIds");
		if (milestoneBlockIds == null) {
			return null;
		}
		if (milestoneBlockIds.isEmpty()) {
			return Genesis.GENESIS_BLOCK_ID;
		}
		// prevent overloading with blockIds
		if (milestoneBlockIds.size() > 20) {
			Logger.logDebugMessage("Obsolete or rogue peer " + peer.getPeerAddress() + " sends too many milestoneBlockIds, blacklisting");
			peer.blacklist();
			return null;
		}
		if (Boolean.TRUE.equals(response.get("last"))) {
			peerHasMore = false;
		}
		for (Object milestoneBlockId : milestoneBlockIds) {
			Long blockId = Convert.parseUnsignedLong((String) milestoneBlockId);
			if (Blocks.HasBlock(blockId, xxxx)) {
				if (lastMilestoneBlockId == null && milestoneBlockIds.size() > 1) {
					peerHasMore = false;
				}
				return blockId;
			}
			lastMilestoneBlockId = (String) milestoneBlockId;
		}
	}
	*/
}

function GetCommonBlockId(peer, commonBlockId) {
	throw new Error('Not implementted');
	/*
	while (true) {
		JSONObject request = new JSONObject();
		request.put("requestType", "getNextBlockIds");
		request.put("blockId", Convert.toUnsignedLong(commonBlockId));
		JSONObject response = peer.send(JSON.prepareRequest(request));
		if (response == null) {
			return null;
		}
		JSONArray nextBlockIds = (JSONArray) response.get("nextBlockIds");
		if (nextBlockIds == null || nextBlockIds.size() == 0) {
			return null;
		}
		// prevent overloading with blockIds
		if (nextBlockIds.size() > 1440) {
			Logger.logDebugMessage("Obsolete or rogue peer " + peer.getPeerAddress() + " sends too many nextBlockIds, blacklisting");
			peer.blacklist();
			return null;
		}

		for (Object nextBlockId : nextBlockIds) {
			Long blockId = Convert.parseUnsignedLong((String) nextBlockId);
			if (!Blocks.HasBlock(blockId, xxxx)) {
				return commonBlockId;
			}
			commonBlockId = blockId;
		}
	}
	*/
}

function GetNextBlocks(peer, curBlockId) {
	throw new Error('Not implementted');
	/*
	JSONObject request = new JSONObject();
	request.put("requestType", "getNextBlocks");
	request.put("blockId", Convert.toUnsignedLong(curBlockId));
	JSONObject response = peer.send(JSON.prepareRequest(request));
	if (response == null) {
		return null;
	}

	JSONArray nextBlocks = (JSONArray) response.get("nextBlocks");
	if (nextBlocks == null) {
		return null;
	}
	// prevent overloading with blocks
	if (nextBlocks.size() > 1440) {
		Logger.logDebugMessage("Obsolete or rogue peer " + peer.getPeerAddress() + " sends too many nextBlocks, blacklisting");
		peer.blacklist();
		return null;
	}

	return nextBlocks;
	*/
}

function ProcessFork(peer, forkBlocks, commonBlock) {
	throw new Error('Not implementted');
	/*
	synchronized (blockchain) {
		BigInteger curCumulativeDifficulty = blockchain.getLastBlock().getCumulativeDifficulty();

		popOffTo(commonBlock);

		int pushedForkBlocks = 0;
		if (blockchain.getLastBlock().getId().equals(commonBlock.getId())) {
			for (BlockImpl block : forkBlocks) {
				if (blockchain.getLastBlock().getId().equals(block.getPreviousBlockId())) {
					try {
						pushBlock(block);
						pushedForkBlocks += 1;
					} catch (BlockNotAcceptedException e) {
						peer.blacklist(e);
						break;
					}
				}
			}
		}

		if (pushedForkBlocks > 0 && blockchain.getLastBlock().getCumulativeDifficulty().compareTo(curCumulativeDifficulty) < 0) {
			Logger.logDebugMessage("Pop off caused by peer " + peer.getPeerAddress() + ", blacklisting");
			peer.blacklist();
			popOffTo(commonBlock);
		}
	} // synchronized
	*/
}

function PopOffTo(commonBlock) {
	throw new Error('Not implementted');
	/*
	try {
		Long lastBlockId = blockchain.getLastBlock().getId();
		while (! lastBlockId.equals(commonBlock.getId()) && ! lastBlockId.equals(Genesis.GENESIS_BLOCK_ID)) {
			lastBlockId = popLastBlock();
		}
	} catch (TransactionType.UndoNotSupportedException e) {
		Logger.logDebugMessage(e.getMessage());
		Logger.logDebugMessage("Popping off last block not possible, will do a rescan");
		resetTo(commonBlock);
	}
	*/
}

function ResetTo(commonBlock) {
	throw new Error('Not implementted');
	/*
	if (commonBlock.getNextBlockId() != null) {
		Logger.logDebugMessage("Last block is " + blockchain.getLastBlock().getStringId() + " at " + blockchain.getLastBlock().getHeight());
		Logger.logDebugMessage("Deleting blocks after height " + commonBlock.getHeight());
		Blocks.DeleteBlocksFrom(commonBlock.getNextBlockId());
	}
	Logger.logMessage("Will do a re-scan");
	blockListeners.Notify(BlockchainProcessor.Event.RESCAN_BEGIN, commonBlock);
	scan();
	blockListeners.Notify(BlockchainProcessor.Event.RESCAN_END, commonBlock);
	Logger.logDebugMessage("Last block is " + blockchain.getLastBlock().getStringId() + " at " + blockchain.getLastBlock().getHeight());
	*/
}


exports.GetCommonBlockId = GetCommonBlockId;
exports.GetCommonMilestoneBlockId = GetCommonMilestoneBlockId;
exports.GetNextBlocks = GetNextBlocks;
exports.PopOffTo = PopOffTo;
exports.Run = Run;
