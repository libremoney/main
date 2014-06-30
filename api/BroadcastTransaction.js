/*
import nxt.Nxt;
import nxt.NxtException;
import nxt.Transaction;
import nxt.util.Convert;
import org.json.simple.JSONObject;
import org.json.simple.JSONStreamAware;
import static nxt.http.JSONResponses.INCORRECT_TRANSACTION_BYTES;
import static nxt.http.JSONResponses.MISSING_TRANSACTION_BYTES;
*/

function Main(req, res) {
	//static final BroadcastTransaction instance = new BroadcastTransaction();
	res.send('This is not implemented');

	/*
	private BroadcastTransaction() {
		super("transactionBytes");
	}

	JSONStreamAware processRequest(HttpServletRequest req) throws NxtException.ValidationException {
		String transactionBytes = req.getParameter("transactionBytes");
		if (transactionBytes == null) {
			return MISSING_TRANSACTION_BYTES;
		}
		try {
			byte[] bytes = Convert.parseHexString(transactionBytes);
			Transaction transaction = Nxt.getTransactionProcessor().parseTransaction(bytes);
			transaction.validateAttachment();

			JSONObject response = new JSONObject();

			try {
				Nxt.getTransactionProcessor().broadcast(transaction);
				response.put("transaction", transaction.getStringId());
				response.put("fullHash", transaction.getFullHash());
			} catch (NxtException.ValidationException e) {
				response.put("error", e.getMessage());
			}

			return response;
		} catch (RuntimeException e) {
			return INCORRECT_TRANSACTION_BYTES;
		}
	}
	*/
}

module.exports = Main;
