/**!
 * LibreMoney blocks 0.0
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var Block = require(__dirname + '/Block');


var blocks = new Array();


function AddNewBlock(version, timestamp, previousBlockId, totalAmountMilliLm, totalFeeMilliLm, payloadLength, payloadHash,
		generatorPublicKey, generationSignature, blockSignature, previousBlockHash, transactions,
		cumulativeDifficulty, baseTarget, nextBlockId, height, id) {
	var block = new Block(version, timestamp, previousBlockId, totalAmountMilliLm, totalFeeMilliLm, payloadLength, payloadHash,
		generatorPublicKey, generationSignature, blockSignature, previousBlockHash, transactions,
		cumulativeDifficulty, baseTarget, nextBlockId, height, id);
	blocks.push(block);
	return block;
}

function Init() {
}

exports.AddNewBlock = AddNewBlock;
exports.Init = Init;
