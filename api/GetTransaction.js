/*
import nxt.Nxt;
import nxt.Transaction;
*/

var LmUtil = require(__dirname + '/../util/Convert');
var JsonData = require(__dirname + '/JsonData');


function Main(req, res) {
	var transactionIdString = req.query.transaction;
	var transactionFullHash = req.query.fullHash;
	//if (transactionIdString == null && transactionFullHash == null) {
	//	return MISSING_TRANSACTION;
	//}

	var transaction = Lm.Transactions[1];

	res.send(JsonData.Transaction(transaction));
	/*
	res.send({
		transaction: {
			type: 0,
			transaction: 'test'
		},
		input: ''
	});
	*/
	//res.send('This is not implemented');
	/*
	static final GetTransaction instance = new GetTransaction();

	private GetTransaction() {
		super("transaction", "fullHash");
	}

	JSONStreamAware processRequest(HttpServletRequest req) {

		String transactionIdString = Convert.emptyToNull(req.getParameter("transaction"));
		String transactionFullHash = Convert.emptyToNull(req.getParameter("fullHash"));
	11
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
