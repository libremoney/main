/**!
 * LibreMoney GetBlockId api 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

/*
import nxt.Nxt;
import nxt.util.Convert;
import org.json.simple.JSONObject;
import org.json.simple.JSONStreamAware;
import static nxt.http.JSONResponses.INCORRECT_HEIGHT;
import static nxt.http.JSONResponses.MISSING_HEIGHT;
*/

//super(new APITag[] {APITag.BLOCKS}, "height");
function GetBlockId() {
	res.send('This is not implemented');
	/*
	int height;
	try {
		String heightValue = Convert.emptyToNull(req.getParameter("height"));
		if (heightValue == null) {
			return MISSING_HEIGHT;
		}
		height = Integer.parseInt(heightValue);
	} catch (RuntimeException e) {
		return INCORRECT_HEIGHT;
	}

	try {
		JSONObject response = new JSONObject();
		response.put("block", Convert.toUnsignedLong(Nxt.getBlockchain().getBlockIdAtHeight(height)));
		return response;
	} catch (RuntimeException e) {
		return INCORRECT_HEIGHT;
	}
	*/
}

module.exports = GetBlockId;
