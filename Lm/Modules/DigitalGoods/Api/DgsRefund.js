/**!
 * LibreMoney DgsRefund api 0.2
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
*/

//super(new APITag[] {APITag.DGS, APITag.CREATE_TRANSACTION}, "purchase", "refundNQT");
function DgsRefund(req, res) {
	res.send('This is not implemented');
	/*
	Account sellerAccount = ParameterParser.getSenderAccount(req);
	DigitalGoodsStore.Purchase purchase = ParameterParser.getPurchase(req);
	if (! sellerAccount.getId().equals(purchase.getSellerId())) {
		return INCORRECT_PURCHASE;
	}
	if (purchase.getRefundNote() != null) {
		return {
			errorCode: 8,
			errorDescription: "Refund already sent"
		}
	}
	if (purchase.getEncryptedGoods() == null) {
		return GOODS_NOT_DELIVERED;
	}

	String refundValueNQT = Convert.emptyToNull(req.getParameter("refundNQT"));
	long refundNQT = 0;
	try {
		if (refundValueNQT != null) {
			refundNQT = Long.parseLong(refundValueNQT);
		}
	} catch (RuntimeException e) {
		return INCORRECT_DGS_REFUND;
	}
	if (refundNQT < 0 || refundNQT > Constants.MAX_BALANCE_NQT) {
		return INCORRECT_DGS_REFUND;
	}

	Account buyerAccount = Account.getAccount(purchase.getBuyerId());

	Attachment attachment = new Attachment.DigitalGoodsRefund(purchase.getId(), refundNQT);
	return createTransaction(req, sellerAccount, buyerAccount.getId(), 0, attachment);
	*/
}

module.exports = DgsRefund;
