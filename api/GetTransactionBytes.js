/*
import nxt.Nxt;
import nxt.Transaction;
import nxt.util.Convert;
import static nxt.http.JSONResponses.INCORRECT_TRANSACTION;
import static nxt.http.JSONResponses.MISSING_TRANSACTION;
import static nxt.http.JSONResponses.UNKNOWN_TRANSACTION;
*/

function Main(req, res) {
	res.send('This is not implemented');
	/*
	static final GetTransactionBytes instance = new GetTransactionBytes();

	private GetTransactionBytes() {
		super("transaction");
	}

	JSONStreamAware processRequest(HttpServletRequest req) {
		String transactionValue = req.getParameter("transaction");
		if (transactionValue == null) {
			return MISSING_TRANSACTION;
		}

		Long transactionId;
		Transaction transaction;
		try {
			transactionId = Convert.parseUnsignedLong(transactionValue);
		} catch (RuntimeException e) {
			return INCORRECT_TRANSACTION;
		}

		transaction = Nxt.getBlockchain().getTransaction(transactionId);
		JSONObject response = new JSONObject();
		if (transaction == null) {
			transaction = Nxt.getTransactionProcessor().getUnconfirmedTransaction(transactionId);
			if (transaction == null) {
				return UNKNOWN_TRANSACTION;
			}
		} else {
			response.put("confirmations", Nxt.getBlockchain().getLastBlock().getHeight() - transaction.getHeight());
		}
		response.put("transactionBytes", Convert.toHexString(transaction.getBytes()));
		response.put("unsignedTransactionBytes", Convert.toHexString(transaction.getUnsignedBytes()));
		return response;
	}
	*/
}

module.exports = Main;
