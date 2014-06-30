/*
import nxt.NxtException;
import nxt.Order;
import nxt.util.Convert;
*/

function Main(req, res) {
    res.send('This is not implemented');
    /*
    static final GetAskOrderIds instance = new GetAskOrderIds();

    private GetAskOrderIds() {
        super("asset", "limit");
    }

    JSONStreamAware processRequest(HttpServletRequest req) throws NxtException {
        Long assetId = ParameterParser.getAsset(req).getId();
        int limit;
        try {
            limit = Integer.parseInt(req.getParameter("limit"));
        } catch (NumberFormatException e) {
            limit = Integer.MAX_VALUE;
        }
        JSONArray orderIds = new JSONArray();
        Iterator<Order.Ask> askOrders = Order.Ask.getSortedOrders(assetId).iterator();
        while (askOrders.hasNext() && limit-- > 0) {
            orderIds.add(Convert.toUnsignedLong(askOrders.next().getId()));
        }
        JSONObject response = new JSONObject();
        response.put("askOrderIds", orderIds);
        return response;
    }
    */
}

module.exports = Main;
