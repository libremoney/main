/*
import nxt.Account;
import nxt.Attachment;
import nxt.NxtException;
import nxt.Order;
import org.json.simple.JSONStreamAware;
import static nxt.http.JSONResponses.UNKNOWN_ORDER;
*/

function Main(req, res) {
	var obj = CreateTransaction();
	//static final CancelAskOrder instance = new CancelAskOrder();
	res.send('This is not implemented');    

	/*
	private CancelAskOrder() {
		super("order");
	}

	JSONStreamAware processRequest(HttpServletRequest req) throws NxtException {
		Long orderId = ParameterParser.getOrderId(req);
		Account account = ParameterParser.getSenderAccount(req);
		Order.Ask orderData = Order.Ask.getAskOrder(orderId);
		if (orderData == null || !orderData.getAccount().getId().equals(account.getId())) {
			return UNKNOWN_ORDER;
		}
		Attachment attachment = new Attachment.ColoredCoinsAskOrderCancellation(orderId);
		return createTransaction(req, account, attachment);
	}
	*/
}

module.exports = Main;
