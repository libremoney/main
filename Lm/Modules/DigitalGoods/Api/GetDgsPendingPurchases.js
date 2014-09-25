/**!
 * LibreMoney GetDgsPendingPurchases api 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

/*
import nxt.DigitalGoodsStore;
import nxt.NxtException;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.JSONStreamAware;
import static nxt.http.JSONResponses.MISSING_SELLER;
*/

//super(new APITag[] {APITag.DGS}, "seller", "firstIndex", "lastIndex");
function GetDgsPendingPurchases() {
	res.send('This is not implemented');
	/*
	Long sellerId = ParameterParser.getSellerId(req);
	if (sellerId == null) {
		return MISSING_SELLER;
	}
	int firstIndex = ParameterParser.getFirstIndex(req);
	int lastIndex = ParameterParser.getLastIndex(req);

	Collection<DigitalGoodsStore.Purchase> purchases = DigitalGoodsStore.getPendingSellerPurchases(sellerId);
	JSONObject response = new JSONObject();
	JSONArray purchasesJSON = new JSONArray();
	int i = 0;
	for (DigitalGoodsStore.Purchase purchase : purchases) {
		if (i > lastIndex) {
			break;
		}
		if (i >= firstIndex) {
			purchasesJSON.add(JSONData.purchase(purchase));
		}
		i++;
	}
	response.put("purchases", purchasesJSON);
	return response;
	*/
}

module.exports = GetDgsPendingPurchases;
