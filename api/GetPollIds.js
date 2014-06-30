/*
import nxt.Poll;
import nxt.util.Convert;
import org.json.simple.JSONArray;
*/

function Main(req, res) {
	res.send('This is not implemented');
	/*
	static final GetPollIds instance = new GetPollIds();
	JSONStreamAware processRequest(HttpServletRequest req) {
		JSONArray pollIds = new JSONArray();
		for (Poll poll : Poll.getAllPolls()) {
			pollIds.add(Convert.toUnsignedLong(poll.getId()));
		}
		JSONObject response = new JSONObject();
		response.put("pollIds", pollIds);
		return response;
	}
	*/
}

module.exports = Main;
