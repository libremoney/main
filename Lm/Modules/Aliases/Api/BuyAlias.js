/**!
 * LibreMoney BuyAlias api 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

/*
import nxt.Account;
import nxt.Alias;
import nxt.Attachment;
import nxt.NxtException;
import static nxt.http.JSONResponses.INCORRECT_ALIAS_NOTFORSALE;
*/

//super(new APITag[] {APITag.ALIASES, APITag.CREATE_TRANSACTION}, "alias", "aliasName");
function BuyAlias(req, res) {
	res.send('This is not implemented');
	/*
	Account buyer = ParameterParser.getSenderAccount(req);
	Alias alias = ParameterParser.getAlias(req);
	long amountNQT = ParameterParser.getAmountNQT(req);
	if (Alias.getOffer(alias.getAliasName()) == null) {
		return INCORRECT_ALIAS_NOTFORSALE;
	}
	Long sellerId = alias.getAccountId();
	Attachment attachment = new Attachment.MessagingAliasBuy(alias.getAliasName());
	return createTransaction(req, buyer, sellerId, amountNQT, attachment);
	*/
}

module.exports = BuyAlias;
