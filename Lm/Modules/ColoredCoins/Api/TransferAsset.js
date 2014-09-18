/**!
 * LibreMoney TransferAsset api 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

/*
import nxt.Account;
import nxt.Asset;
import nxt.Attachment;
import nxt.Constants;
import nxt.NxtException;
import nxt.util.Convert;
import static nxt.http.JSONResponses.INCORRECT_ASSET_TRANSFER_COMMENT;
*/

var Core = require(__dirname + '/../../../Core');
var JsonResponses = require(__dirname + '/../../../Core/Server/JsonResponses');
var ParameterParser = require(__dirname + '/../../../Core/Server/ParameterParser');


//super(new APITag[] {APITag.AE, APITag.CREATE_TRANSACTION}, "recipient", "asset", "quantityQNT", "comment");
function TransferAsset(req, res) {
	Core.GetRecipientId(req.query.recipient, function(err, recipient) {
		if (err) {
			res.send(err);
			return;
		}
		/*
		String comment = Convert.nullToEmpty(req.getParameter("comment")).trim();
		if (comment.length() > Constants.MAX_ASSET_TRANSFER_COMMENT_LENGTH) {
			return INCORRECT_ASSET_TRANSFER_COMMENT;
		}

		Asset asset = ParameterParser.getAsset(req);
		long quantityQNT = ParameterParser.getQuantityQNT(req);
		Account account = ParameterParser.getSenderAccount(req);

		Long assetBalance = account.getUnconfirmedAssetBalanceQNT(asset.getId());
		if (assetBalance == null || quantityQNT > assetBalance) {
			return JsonResponses.NOT_ENOUGH_ASSETS;
		}

		Attachment attachment = new Attachment.ColoredCoinsAssetTransfer(asset.getId(), quantityQNT, comment);
		return createTransaction(req, account, recipient, 0, attachment);
		*/
		res.send(JsonResponses.NotImplementted);
	});
}


module.exports = TransferAsset;
