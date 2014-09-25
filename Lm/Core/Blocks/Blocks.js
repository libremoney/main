/**!
 * LibreMoney Blocks 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

if (typeof module !== "undefined") {
	var Block = require(__dirname + '/Block');
	var BlockDb = require(__dirname + '/BlockDb');
}


var Blocks = function() {
	var blocks = new Array();


	// deprecated - use NewBlock()
	function AddNewBlock(version, timestamp, previousBlockId, totalAmountMilliLm, totalFeeMilliLm, payloadLength, payloadHash,
			generatorPublicKey, generationSignature, blockSignature, previousBlockHash, transactions,
			cumulativeDifficulty, baseTarget, nextBlockId, height, id) {
		var block = new Block({
			version: version,
			timestamp: timestamp,
			previousBlockId: previousBlockId,
			totalAmountMilliLm: totalAmountMilliLm,
			totalFeeMilliLm: totalFeeMilliLm,
			payloadLength: payloadLength,
			payloadHash: payloadHash,
			generatorPublicKey: generatorPublicKey,
			generationSignature: generationSignature,
			blockSignature: blockSignature,
			previousBlockHash: previousBlockHash,
			transactions: transactions,
			cumulativeDifficulty: cumulativeDifficulty,
			baseTarget: baseTarget,
			nextBlockId: nextBlockId,
			height: height,
			id: id
		});
		blocks.push(block);
		return block;
	}

	function NewBlock(data) {
		var block = new Block(data);
		blocks.push(block);
		return block;
	}

	function Init() {
	}

	function ParseBlock(blockData) {
		throw new Error('Not implementted');
		/*
		int version = ((Long)blockData.get("version")).intValue();
		int timestamp = ((Long)blockData.get("timestamp")).intValue();
		Long previousBlock = Convert.parseUnsignedLong((String) blockData.get("previousBlock"));
		long totalAmountNQT = Convert.parseLong(blockData.get("totalAmountNQT"));
		long totalFeeNQT = Convert.parseLong(blockData.get("totalFeeNQT"));
		int payloadLength = ((Long)blockData.get("payloadLength")).intValue();
		byte[] payloadHash = Convert.parseHexString((String) blockData.get("payloadHash"));
		byte[] generatorPublicKey = Convert.parseHexString((String) blockData.get("generatorPublicKey"));
		byte[] generationSignature = Convert.parseHexString((String) blockData.get("generationSignature"));
		byte[] blockSignature = Convert.parseHexString((String) blockData.get("blockSignature"));
		byte[] previousBlockHash = version == 1 ? null : Convert.parseHexString((String) blockData.get("previousBlockHash"));
		SortedMap<Long, TransactionImpl> blockTransactions = new TreeMap<>();
		JSONArray transactionsData = (JSONArray)blockData.get("transactions");
		for (Object transactionData : transactionsData) {
			TransactionImpl transaction = TransactionImpl.parseTransaction((JSONObject) transactionData);
			if (blockTransactions.put(transaction.getId(), transaction) != null) {
				throw new NxtException.NotValidException("Block contains duplicate transactions: " + transaction.getStringId());
			}
		}
		return new BlockImpl(version, timestamp, previousBlock, totalAmountNQT, totalFeeNQT, payloadLength, payloadHash, generatorPublicKey,
				generationSignature, blockSignature, previousBlockHash, new ArrayList<>(blockTransactions.values()));
		*/
	}

	return {
		AddNewBlock: AddNewBlock,
		Init: Init,
		NewBlock: NewBlock,
		ParseBlock: ParseBlock,

		DeleteAll: BlockDb.DeleteAll,
		DeleteBlocksFrom: BlockDb.DeleteBlocksFrom,
		FindBlock: BlockDb.FindBlock,
		FindBlockIdAtHeight: BlockDb.FindBlockIdAtHeight,
		HasBlock: BlockDb.HasBlock,
		LoadBlock: BlockDb.LoadBlock,
		SaveBlock: BlockDb.SaveBlock
	}
}();


if (typeof module !== "undefined") {
	module.exports = Blocks;
}
