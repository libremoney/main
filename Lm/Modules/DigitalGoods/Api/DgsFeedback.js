/**!
 * LibreMoney DgsFeedback api 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

/*
import nxt.Account;
import nxt.Attachment;
import nxt.DigitalGoodsStore;
import nxt.NxtException;
import org.json.simple.JSONStreamAware;
import static nxt.http.JSONResponses.GOODS_NOT_DELIVERED;
import static nxt.http.JSONResponses.INCORRECT_PURCHASE;
*/

//super(new APITag[] {APITag.DGS, APITag.CREATE_TRANSACTION}, "purchase");
function DgsFeedback(req, res) {
	res.send('This is not implemented');
	/*
	DigitalGoodsStore.Purchase purchase = ParameterParser.getPurchase(req);

	Account buyerAccount = ParameterParser.getSenderAccount(req);
	if (! buyerAccount.getId().equals(purchase.getBuyerId())) {
		return INCORRECT_PURCHASE;
	}
	if (purchase.getEncryptedGoods() == null) {
		return GOODS_NOT_DELIVERED;
	}

	Account sellerAccount = Account.getAccount(purchase.getSellerId());
	Attachment attachment = new Attachment.DigitalGoodsFeedback(purchase.getId());
	return createTransaction(req, buyerAccount, sellerAccount.getId(), 0, attachment);
	*/
}

module.exports = DgsFeedback;
