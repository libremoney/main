/**!
 * LibreMoney GetPollIds api 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

/*
import nxt.Poll;
import nxt.util.Convert;
import org.json.simple.JSONArray;
*/

//super(new APITag[] {APITag.VS});
function GetPollIds(req, res) {
	res.send('This is not implemented');
	/*
	JSONArray pollIds = new JSONArray();
	for (Poll poll : Poll.getAllPolls()) {
		pollIds.add(Convert.toUnsignedLong(poll.getId()));
	}
	JSONObject response = new JSONObject();
	response.put("pollIds", pollIds);
	return response;
	*/
}

module.exports = GetPollIds;
