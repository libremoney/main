/**!
 * LibreMoney GetBlock api 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var Blockchain = require(__dirname + '/../../Blockchain');
var Convert = require(__dirname + '/../../../Util/Convert');
var JsonData = require(__dirname + '/../JsonData');
var JsonResponses = require(__dirname + '/../JsonResponses');


//super(new APITag[] {APITag.BLOCKS}, "block", "height", "includeTransactions");
function GetBlock(req, res) {
	var height = -1;
	var block = Convert.EmptyToNull(req.query.block);
	var heightValue = Convert.EmptyToNull(req.query.height);
	if (block == null) {
		try {
			if (heightValue != null) {
				height = parseInt(heightValue);
				if (height < 0 || height > Blockchain.GetHeight()) {
					return JsonResponses.IncorrectHeight;
				}
			} else {
				return JsonResponses.MissingBlock;
			}
		} catch (e) {
			return JsonResponses.IncorrectHeight;
		}
	}

	var includeTransactions = (req.query.includeTransactions == "true");

	var blockData;
	try {
		if (block != null) {
			blockData = Blockchain.GetBlock(Convert.ParseUnsignedLong(block));
		} else {
			blockData = Blockchain.GetBlockAtHeight(height);
		}
		if (blockData == null) {
			return JsonResponses.UnknownBlock;
		}
	} catch (e) {
		return JsonResponses.IncorrectBlock;
	}

	res.send(JsonData.Block(blockData, includeTransactions));
}


module.exports = GetBlock;
