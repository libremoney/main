/**!
 * LibreMoney DgsListing api 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

/*
import nxt.Account;
import nxt.Attachment;
import nxt.Constants;
import nxt.NxtException;
import nxt.util.Convert;
import org.json.simple.JSONStreamAware;
import static nxt.http.JSONResponses.INCORRECT_DGS_LISTING_DESCRIPTION;
import static nxt.http.JSONResponses.INCORRECT_DGS_LISTING_NAME;
import static nxt.http.JSONResponses.INCORRECT_DGS_LISTING_TAGS;
import static nxt.http.JSONResponses.MISSING_NAME;
*/

//super(new APITag[] {APITag.DGS, APITag.CREATE_TRANSACTION}, "name", "description", "tags", "quantity", "priceNQT");
function DgsListing(req, res) {
	res.send('This is not implemented');
	/*
	String name = Convert.emptyToNull(req.getParameter("name"));
	String description = Convert.nullToEmpty(req.getParameter("description"));
	String tags = Convert.nullToEmpty(req.getParameter("tags"));
	long priceNQT = ParameterParser.getPriceNQT(req);
	int quantity = ParameterParser.getGoodsQuantity(req);

	if (name == null) {
		return MISSING_NAME;
	}
	name = name.trim();
	if (name.length() > Constants.MAX_DGS_LISTING_NAME_LENGTH) {
		return INCORRECT_DGS_LISTING_NAME;
	}

	if (description.length() > Constants.MAX_DGS_LISTING_DESCRIPTION_LENGTH) {
		return INCORRECT_DGS_LISTING_DESCRIPTION;
	}

	if (tags.length() > Constants.MAX_DGS_LISTING_TAGS_LENGTH) {
		return INCORRECT_DGS_LISTING_TAGS;
	}

	Account account = ParameterParser.getSenderAccount(req);
	Attachment attachment = new Attachment.DigitalGoodsListing(name, description, tags, quantity, priceNQT);
	return createTransaction(req, account, attachment);
	*/
}

module.exports = DgsListing;
