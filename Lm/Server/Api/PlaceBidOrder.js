/**!
 * LibreMoney 0.0
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

/*
import nxt.Account;
import nxt.Asset;
import nxt.Attachment;
import nxt.NxtException;
import nxt.util.Convert;
*/

function PlaceBidOrder(req, res) {
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
				return JsonResponses.NotEnoughFunds;
			}
		} catch (ArithmeticException e) {
			return JsonResponses.NotEnoughFunds;
		}

		Attachment attachment = new Attachment.ColoredCoinsBidOrderPlacement(asset.getId(), quantityQNT, priceNQT);
		return createTransaction(req, account, attachment);
	}
	*/
}

module.exports = PlaceBidOrder;
