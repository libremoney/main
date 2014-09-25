/**!
 * LibreMoney PlaceAskOrders api 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

/*
import nxt.Account;
import nxt.Asset;
import nxt.Attachment;
import nxt.NxtException;
import org.json.simple.JSONStreamAware;
*/

//super(new APITag[] {APITag.AE, APITag.CREATE_TRANSACTION}, "asset", "quantityQNT", "priceNQT");
function PlaceAskOrders(req, res) {
	res.send('This is not implemented');
	/*
	Asset asset = ParameterParser.getAsset(req);
	long priceNQT = ParameterParser.getPriceNQT(req);
	long quantityQNT = ParameterParser.getQuantityQNT(req);
	Account account = ParameterParser.getSenderAccount(req);
	Long assetBalance = account.getUnconfirmedAssetBalanceQNT(asset.getId());
	if (assetBalance == null || quantityQNT > assetBalance) {
		return JsonResponses.NotEnoughAssets;
	}
	Attachment attachment = new Attachment.ColoredCoinsAskOrderPlacement(asset.getId(), quantityQNT, priceNQT);
	return createTransaction(req, account, attachment);
	*/
}


module.exports = PlaceAskOrders;
