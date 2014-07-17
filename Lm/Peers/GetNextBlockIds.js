/*
import nxt.Nxt;
import nxt.util.Convert;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.JSONStreamAware;
*/

// GetNextBlockIds = PeerServlet.PeerRequestHandler

/*
static final GetNextBlockIds instance = new GetNextBlockIds();
*/

/*
JSONStreamAware processRequest(JSONObject request, Peer peer) {
    JSONObject response = new JSONObject();

    JSONArray nextBlockIds = new JSONArray();
    Long blockId = Convert.parseUnsignedLong((String) request.get("blockId"));
    List<Long> ids = Nxt.getBlockchain().getBlockIdsAfter(blockId, 1440);

    for (Long id : ids) {
        nextBlockIds.add(Convert.toUnsignedLong(id));
    }

    response.put("nextBlockIds", nextBlockIds);

    return response;
}
*/
