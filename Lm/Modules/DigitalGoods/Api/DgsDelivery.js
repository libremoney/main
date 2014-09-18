/**!
 * LibreMoney DgsDelivery api 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

/*
import nxt.Account;
import nxt.Attachment;
import nxt.Constants;
import nxt.DigitalGoodsStore;
import nxt.NxtException;
import nxt.crypto.EncryptedData;
import nxt.util.Convert;
import org.json.simple.JSONStreamAware;
import static nxt.http.JSONResponses.ALREADY_DELIVERED;
import static nxt.http.JSONResponses.INCORRECT_DGS_DISCOUNT;
import static nxt.http.JSONResponses.INCORRECT_DGS_GOODS;
import static nxt.http.JSONResponses.INCORRECT_PURCHASE;
*/

//super(new APITag[] {APITag.DGS, APITag.CREATE_TRANSACTION}, "purchase", "discountNQT", "goodsToEncrypt", "goodsIsText", "goodsData", "goodsNonce");
function DgsDelivery(req, res) {
	res.send('This is not implemented');
	/*
	Account sellerAccount = ParameterParser.getSenderAccount(req);
	DigitalGoodsStore.Purchase purchase = ParameterParser.getPurchase(req);
	if (! sellerAccount.getId().equals(purchase.getSellerId())) {
		return INCORRECT_PURCHASE;
	}
	if (! purchase.isPending()) {
		return ALREADY_DELIVERED;
	}

	String discountValueNQT = Convert.emptyToNull(req.getParameter("discountNQT"));
	long discountNQT = 0;
	try {
		if (discountValueNQT != null) {
			discountNQT = Long.parseLong(discountValueNQT);
		}
	} catch (RuntimeException e) {
		return INCORRECT_DGS_DISCOUNT;
	}
	if (discountNQT < 0
			|| discountNQT > Constants.MAX_BALANCE_NQT
			|| discountNQT > Convert.safeMultiply(purchase.getPriceNQT(), purchase.getQuantity())) {
		return INCORRECT_DGS_DISCOUNT;
	}

	Account buyerAccount = Account.getAccount(purchase.getBuyerId());
	boolean goodsIsText = !"false".equalsIgnoreCase(req.getParameter("goodsIsText"));
	EncryptedData encryptedGoods = ParameterParser.getEncryptedGoods(req);

	if (encryptedGoods == null) {
		String secretPhrase = ParameterParser.getSecretPhrase(req);
		byte[] goodsBytes;
		try {
			String plainGoods = Convert.nullToEmpty(req.getParameter("goodsToEncrypt"));
			if (plainGoods.length() == 0) {
				return INCORRECT_DGS_GOODS;
			}
			goodsBytes = goodsIsText ? Convert.toBytes(plainGoods) : Convert.parseHexString(plainGoods);
		} catch (RuntimeException e) {
			return INCORRECT_DGS_GOODS;
		}
		encryptedGoods = buyerAccount.encryptTo(goodsBytes, secretPhrase);
	}

	Attachment attachment = new Attachment.DigitalGoodsDelivery(purchase.getId(), encryptedGoods, goodsIsText, discountNQT);
	return createTransaction(req, sellerAccount, buyerAccount.getId(), 0, attachment);
	*/
}

module.exports = DgsDelivery;
