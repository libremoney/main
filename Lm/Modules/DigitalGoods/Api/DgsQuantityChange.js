/**!
 * LibreMoney DgsQuantityChange api 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

/*
import nxt.Account;
import nxt.Attachment;
import nxt.Constants;
import nxt.DigitalGoodsStore;
import nxt.NxtException;
import nxt.util.Convert;
import org.json.simple.JSONStreamAware;
import static nxt.http.JSONResponses.INCORRECT_DELTA_QUANTITY;
import static nxt.http.JSONResponses.MISSING_DELTA_QUANTITY;
import static nxt.http.JSONResponses.UNKNOWN_GOODS;
*/

//super(new APITag[] {APITag.DGS, APITag.CREATE_TRANSACTION}, "goods", "deltaQuantity");
function DgsQuantityChange(req, res) {
	res.send('This is not implemented');
	/*
	Account account = ParameterParser.getSenderAccount(req);
	DigitalGoodsStore.Goods goods = ParameterParser.getGoods(req);
	if (goods.isDelisted() || ! goods.getSellerId().equals(account.getId())) {
		return UNKNOWN_GOODS;
	}

	int deltaQuantity;
	try {
		String deltaQuantityString = Convert.emptyToNull(req.getParameter("deltaQuantity"));
		if (deltaQuantityString == null) {
			return MISSING_DELTA_QUANTITY;
		}
		deltaQuantity = Integer.parseInt(deltaQuantityString);
		if (deltaQuantity > Constants.MAX_DGS_LISTING_QUANTITY || deltaQuantity < -Constants.MAX_DGS_LISTING_QUANTITY) {
			return INCORRECT_DELTA_QUANTITY;
		}
	} catch (NumberFormatException e) {
		return INCORRECT_DELTA_QUANTITY;
	}

	Attachment attachment = new Attachment.DigitalGoodsQuantityChange(goods.getId(), deltaQuantity);
	return createTransaction(req, account, attachment);
	*/
}

module.exports = DgsQuantityChange;
