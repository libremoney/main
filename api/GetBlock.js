/*
import nxt.Block;
import nxt.Nxt;
import nxt.util.Convert;
import static nxt.http.JSONResponses.INCORRECT_BLOCK;
import static nxt.http.JSONResponses.MISSING_BLOCK;
import static nxt.http.JSONResponses.UNKNOWN_BLOCK;
*/

JsonData = require(__dirname + '/JsonData');

function Main(req, res) {
	//static final GetBlock instance = new GetBlock();
	res.send('This is not implemented');
	/*
	private GetBlock() {
		super("block");
	}

	JSONStreamAware processRequest(HttpServletRequest req) {

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

		return JSONData.block(blockData);

	}
	*/
}

module.exports = Main;
