/**!
 * LibreMoney GetBlock api 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var Blockchain = require(__dirname + '/../../Blockchain');
var Convert = require(__dirname + '/../../../Lib/Util/Convert');
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
					res.send(JsonResponses.IncorrectHeight);
					return;
				}
			} else {
				res.send(JsonResponses.MissingBlock);
				return;
			}
		} catch (e) {
			res.send(JsonResponses.IncorrectHeight);
			return;
		}
	}

	var includeTransactions = (req.query.includeTransactions == "true");

	if (block != null) {
		Blockchain.GetBlock(Convert.ParseUnsignedLong(block), function(err, blockData) {
			if (err || !blockData) {
				res.send(JsonResponses.UnknownBlock);
			} else {
				res.send(JsonData.Block(blockData, includeTransactions));
			}
		});
	} else {
		var blockData = Blockchain.GetBlockAtHeight(height);
		if (!blockData) {
			res.send(JsonResponses.UnknownBlock);
		} else {
			res.send(JsonData.Block(blockData, includeTransactions));
		}
	}
}


module.exports = GetBlock;
