/**!
 * LibreMoney 0.0
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

/*
import nxt.Block;
import nxt.util.Convert;
import static nxt.http.JSONResponses.INCORRECT_BLOCK;
import static nxt.http.JSONResponses.MISSING_BLOCK;
import static nxt.http.JSONResponses.UNKNOWN_BLOCK;
*/

var JsonData = require(__dirname + '/../JsonData');

//super("block");
function GetBlock(req, res) {
	res.send('This is not implemented');
	/*
	String block = req.getParameter("block");
	if (block == null) {
		return MISSING_BLOCK;
	}

	Block blockData;
	try {
		blockData = Nxt.getBlockchain().getBlock(Convert.parseUnsignedLong(block));
		if (blockData == null) {
			return UNKNOWN_BLOCK;
		}
	} catch (RuntimeException e) {
		return INCORRECT_BLOCK;
	}

	return JsonData.block(blockData);
	*/
}

module.exports = GetBlock;
