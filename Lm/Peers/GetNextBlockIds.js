/**!
 * LibreMoney 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

/*
import nxt.Nxt;
import nxt.util.Convert;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.JSONStreamAware;
*/

// GetNextBlockIds = PeerServlet.PeerRequestHandler

function GetNextBlockIds(request, peer) {
	/*
    JSONObject response = new JSONObject();

    JSONArray nextBlockIds = new JSONArray();
    Long blockId = Convert.parseUnsignedLong((String) request.get("blockId"));
    List<Long> ids = Nxt.getBlockchain().getBlockIdsAfter(blockId, 1440);

    for (Long id : ids) {
        nextBlockIds.add(Convert.toUnsignedLong(id));
    }

    response.put("nextBlockIds", nextBlockIds);
	*/

    return response;
}

module.exports = GetNextBlockIds;
