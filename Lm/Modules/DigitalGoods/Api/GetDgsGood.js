/**!
 * LibreMoney GetDgsGood api 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

/*
import nxt.NxtException;
import org.json.simple.JSONStreamAware;
*/

//super(new APITag[] {APITag.DGS}, "goods");
function GetDgsGood(req, res) {
	res.send(JsonData.Goods(ParameterParser.GetGoods(req)));
}

module.exports = GetDgsGood;
