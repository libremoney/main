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
	static final GetTransaction instance = new GetTransaction();

	private GetTransaction() {
		super("transaction", "fullHash");
	}

	JSONStreamAware processRequest(HttpServletRequest req) {

		String transactionIdString = Convert.emptyToNull(req.getParameter("transaction"));
		String transactionFullHash = Convert.emptyToNull(req.getParameter("fullHash"));
		if (transactionIdString == null && transactionFullHash == null) {
			return MISSING_TRANSACTION;
		}

		Long transactionId = null;
		Transaction transaction;
		try {
			if (transactionIdString != null) {
				transactionId = Convert.parseUnsignedLong(transactionIdString);
				transaction = Nxt.getBlockchain().getTransaction(transactionId);
			} else {
				transaction = Nxt.getBlockchain().getTransactionByFullHash(transactionFullHash);
				if (transaction == null) {
					return UNKNOWN_TRANSACTION;
				}
			}
		} catch (RuntimeException e) {
			return INCORRECT_TRANSACTION;
		}

		if (transaction == null) {
			transaction = Nxt.getTransactionProcessor().getUnconfirmedTransaction(transactionId);
			if (transaction == null) {
				return UNKNOWN_TRANSACTION;
			}
			return JSONData.unconfirmedTransaction(transaction);
		} else {
			return JSONData.transaction(transaction);
		}

	}
	*/
}

module.exports = Main;
