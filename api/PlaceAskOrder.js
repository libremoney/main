/*
import nxt.Account;
import nxt.Asset;
import nxt.Attachment;
import nxt.NxtException;
import org.json.simple.JSONStreamAware;
import static nxt.http.JSONResponses.NOT_ENOUGH_ASSETS;
*/

function Main(req, res) {
	var obj = CreateTransaction();
	res.send('This is not implemented');
	/*
	static final PlaceAskOrder instance = new PlaceAskOrder();

	private PlaceAskOrder() {
		super("asset", "quantityQNT", "priceNQT");
	}

	JSONStreamAware processRequest(HttpServletRequest req) throws NxtException {
		Asset asset = ParameterParser.getAsset(req);
		long priceNQT = ParameterParser.getPriceNQT(req);
		long quantityQNT = ParameterParser.getQuantityQNT(req);
		Account account = ParameterParser.getSenderAccount(req);
		Long assetBalance = account.getUnconfirmedAssetBalanceQNT(asset.getId());
		if (assetBalance == null || quantityQNT > assetBalance) {
			return NOT_ENOUGH_ASSETS;
		}
		Attachment attachment = new Attachment.ColoredCoinsAskOrderPlacement(asset.getId(), quantityQNT, priceNQT);
		return createTransaction(req, account, attachment);
	}
	*/
}

module.exports = Main;
