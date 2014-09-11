/**!
 * LibreMoney GetDgsPurchase api 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

/*
import nxt.NxtException;
import org.json.simple.JSONStreamAware;
*/

//super(new APITag[] {APITag.DGS}, "purchase");
function GetDgsPurchase() {
	res.send(JsonData.Purchase(ParameterParser.GetPurchase(req)));
}

module.exports = GetDgsPurchase;
