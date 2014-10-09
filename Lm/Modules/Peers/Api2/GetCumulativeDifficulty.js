/**!
 * LibreMoney GetCumulativeDifficulty api 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

if (typeof module !== "undefined") {
	var Blockchain = require(__dirname + "/../../../Core/Blockchain");
}


function GetCumulativeDifficulty(req, res) {
	var lastBlock = Blockchain.GetLastBlock();
	res.json({
		cumulativeDifficulty: lastBlock.GetCumulativeDifficulty().toString(),
		blockchainHeight: lastBlock.GetHeight()
	});
}


if (typeof module !== "undefined") {
	module.exports = GetCumulativeDifficulty;
}
