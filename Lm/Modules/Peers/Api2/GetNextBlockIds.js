/**!
 * LibreMoney GetNextBlockIds api 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

if (typeof module !== "undefined") {
	var Blockchain = require(__dirname + "/../../../Core/Blockchain");
	var Convert = require(__dirname + "/../../../Lib/Util/Convert");
}


function GetNextBlockIds(req, res) {
	var response = {};
	var nextBlockIds = [];
	var blockId = Convert.ParseUnsignedLong(req.query.blockId);
	var ids = Blockchain.GetBlockIdsAfter(blockId, 1440);
	for (var i in ids) {
		nextBlockIds.push(Convert.ToUnsignedLong(ids[i]));
	}
	res.json({nextBlockIds: nextBlockIds});
}


if (typeof module !== "undefined") {
	module.exports = GetNextBlockIds;
}
