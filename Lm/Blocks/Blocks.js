/**!
 * LibreMoney blocks 0.0
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var Block = require(__dirname + '/Block');
var BlockDb = require(__dirname + '/BlockDb');


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


exports.AddNewBlock = AddNewBlock;
exports.Init = Init;
exports.NewBlock = NewBlock;

exports.DeleteAll = BlockDb.DeleteAll;
exports.DeleteBlocksFrom = BlockDb.DeleteBlocksFrom;
exports.FindBlock = BlockDb.FindBlock;
exports.FindBlockIdAtHeight = BlockDb.FindBlockIdAtHeight;
exports.HasBlock = BlockDb.HasBlock;
exports.LoadBlock = BlockDb.LoadBlock;
exports.SaveBlock = BlockDb.SaveBlock;
