/**!
 * LibreMoney GetDgsPurchases api 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

/*
import nxt.DigitalGoodsStore;
import nxt.NxtException;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.JSONStreamAware;
*/

//super(new APITag[] {APITag.DGS}, "seller", "buyer", "firstIndex", "lastIndex", "completed");
function GetDgsPurchases() {
	res.send('This is not implemented');
	/*
	Long sellerId = ParameterParser.getSellerId(req);
	Long buyerId = ParameterParser.getBuyerId(req);
	int firstIndex = ParameterParser.getFirstIndex(req);
	int lastIndex = ParameterParser.getLastIndex(req);
	boolean completed = "true".equalsIgnoreCase(req.getParameter("completed"));


	JSONObject response = new JSONObject();
	JSONArray purchasesJSON = new JSONArray();
	response.put("purchases", purchasesJSON);

	if (sellerId == null && buyerId == null) {
		DigitalGoodsStore.Purchase[] purchases = DigitalGoodsStore.getAllPurchases().toArray(new DigitalGoodsStore.Purchase[0]);
		for (int i = 0, count = 0; count - 1 <= lastIndex && i < purchases.length; i++) {
			if (completed && purchases[purchases.length - 1 - i].isPending()) {
				continue;
			}
			if (count < firstIndex) {
				count++;
				continue;
			}
			purchasesJSON.add(JSONData.purchase(purchases[purchases.length - 1 - i]));
			count++;
		}
		return response;
	}

	Collection<DigitalGoodsStore.Purchase> purchases;
	if (sellerId != null && buyerId == null) {
		purchases = DigitalGoodsStore.getSellerPurchases(sellerId);
	} else if (sellerId == null) {
		purchases = DigitalGoodsStore.getBuyerPurchases(buyerId);
	} else {
		purchases = DigitalGoodsStore.getSellerBuyerPurchases(sellerId, buyerId);
	}
	int count = 0;
	for (DigitalGoodsStore.Purchase purchase : purchases) {
		if (count > lastIndex) {
			break;
		}
		if (count >= firstIndex) {
			if (completed && purchase.isPending()) {
				continue;
			}
			purchasesJSON.add(JSONData.purchase(purchase));
		}
		count++;
	}
	return response;
	*/
}

module.exports = GetDgsPurchases;
