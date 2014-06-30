/*
import nxt.Account;
import nxt.Asset;
import nxt.Attachment;
import nxt.NxtException;
import nxt.util.Convert;
import static nxt.http.JSONResponses.NOT_ENOUGH_FUNDS;
*/

function Main(req, res) {
	var obj = CreateTransaction();
	res.send('This is not implemented');
	/*
	static final PlaceBidOrder instance = new PlaceBidOrder();

	private PlaceBidOrder() {
		super("asset", "quantityQNT", "priceNQT");
	}

	JSONStreamAware processRequest(HttpServletRequest req) throws NxtException {

		Asset asset = ParameterParser.getAsset(req);
		long priceNQT = ParameterParser.getPriceNQT(req);
		long quantityQNT = ParameterParser.getQuantityQNT(req);
		long feeNQT = ParameterParser.getFeeNQT(req);
		Account account = ParameterParser.getSenderAccount(req);

		try {
			if (Convert.safeAdd(feeNQT, Convert.safeMultiply(priceNQT, quantityQNT)) > account.getUnconfirmedBalanceNQT()) {
				return NOT_ENOUGH_FUNDS;
			}
		} catch (ArithmeticException e) {
			return NOT_ENOUGH_FUNDS;
		}

		Attachment attachment = new Attachment.ColoredCoinsBidOrderPlacement(asset.getId(), quantityQNT, priceNQT);
		return createTransaction(req, account, attachment);
	}
	*/
}

module.exports = Main;
