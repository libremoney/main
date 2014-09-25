/**!
 * LibreMoney DgsPriceChange api 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

/*
import nxt.Account;
import nxt.Attachment;
import nxt.DigitalGoodsStore;
import nxt.NxtException;
import org.json.simple.JSONStreamAware;
import static nxt.http.JSONResponses.UNKNOWN_GOODS;
*/

//super(new APITag[] {APITag.DGS, APITag.CREATE_TRANSACTION}, "goods", "priceNQT");
function DgsPriceChange(req, res) {
	res.send('This is not implemented');
	/*
	Account account = ParameterParser.getSenderAccount(req);
	DigitalGoodsStore.Goods goods = ParameterParser.getGoods(req);
	long priceNQT = ParameterParser.getPriceNQT(req);
	if (goods.isDelisted() || ! goods.getSellerId().equals(account.getId())) {
		return UNKNOWN_GOODS;
	}
	Attachment attachment = new Attachment.DigitalGoodsPriceChange(goods.getId(), priceNQT);
	return createTransaction(req, account, attachment);
	*/
}

module.exports = DgsPriceChange;
