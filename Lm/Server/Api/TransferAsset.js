/*
import nxt.Account;
import nxt.Asset;
import nxt.Attachment;
import nxt.Constants;
import nxt.NxtException;
import nxt.util.Convert;
import static nxt.http.JSONResponses.INCORRECT_ASSET_TRANSFER_COMMENT;
import static nxt.http.JSONResponses.NOT_ENOUGH_ASSETS;
*/


function Main(req, res) {
	var obj = CreateTransaction();
	res.send('This is not implemented');
	/*
	static final TransferAsset instance = new TransferAsset();

	private TransferAsset() {
		super("recipient", "asset", "quantityQNT", "comment");
	}

	JSONStreamAware processRequest(HttpServletRequest req) throws NxtException {

		Long recipient = ParameterParser.getRecipientId(req);

		String comment = Convert.nullToEmpty(req.getParameter("comment")).trim();
		if (comment.length() > Constants.MAX_ASSET_TRANSFER_COMMENT_LENGTH) {
			return INCORRECT_ASSET_TRANSFER_COMMENT;
		}

		Asset asset = ParameterParser.getAsset(req);
		long quantityQNT = ParameterParser.getQuantityQNT(req);
		Account account = ParameterParser.getSenderAccount(req);

		Long assetBalance = account.getUnconfirmedAssetBalanceQNT(asset.getId());
		if (assetBalance == null || quantityQNT > assetBalance) {
			return NOT_ENOUGH_ASSETS;
		}

		Attachment attachment = new Attachment.ColoredCoinsAssetTransfer(asset.getId(), quantityQNT, comment);
		return createTransaction(req, account, recipient, 0, attachment);

	}
	*/
}

module.exports = Main;
