/*
import nxt.Nxt;
import nxt.NxtException;
import nxt.Transaction;
import nxt.util.Convert;
import static nxt.http.JSONResponses.INCORRECT_TRANSACTION_BYTES;
import static nxt.http.JSONResponses.MISSING_TRANSACTION_BYTES;
*/

function Main(req, res) {
	res.send('This is not implemented');
	/*
	static final ParseTransaction instance = new ParseTransaction();

	private ParseTransaction() {
		super("transactionBytes");
	}

	JSONStreamAware processRequest(HttpServletRequest req) throws NxtException.ValidationException {
		String transactionBytes = req.getParameter("transactionBytes");
		if (transactionBytes == null) {
			return MISSING_TRANSACTION_BYTES;
		}
		JSONObject response;
		try {
			byte[] bytes = Convert.parseHexString(transactionBytes);
			Transaction transaction = Nxt.getTransactionProcessor().parseTransaction(bytes);
			transaction.validateAttachment();
			response = JSONData.unconfirmedTransaction(transaction);
			response.put("verify", transaction.verify());
		} catch (NxtException.ValidationException|RuntimeException e) {
			//Logger.logDebugMessage(e.getMessage(), e);
			return INCORRECT_TRANSACTION_BYTES;
		}
		return response;
	}
	*/
}

module.exports = Main;
