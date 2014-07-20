/*
import nxt.Account;
import nxt.Attachment;
import nxt.Constants;
import nxt.NxtException;
import nxt.util.Convert;
import static nxt.http.JSONResponses.INCORRECT_ASSET_DESCRIPTION;
import static nxt.http.JSONResponses.INCORRECT_ASSET_NAME;
import static nxt.http.JSONResponses.INCORRECT_ASSET_NAME_LENGTH;
import static nxt.http.JSONResponses.INCORRECT_DECIMALS;
import static nxt.http.JSONResponses.MISSING_NAME;
*/

function Main(req, res) {
	var obj = CreateTransaction();
	res.send('This is not implemented');
	/*
	static final IssueAsset instance = new IssueAsset();

	private IssueAsset() {
		super("name", "description", "quantityQNT", "decimals");
	}

	JSONStreamAware processRequest(HttpServletRequest req) throws NxtException {

		String name = req.getParameter("name");
		String description = req.getParameter("description");
		String decimalsValue = Convert.emptyToNull(req.getParameter("decimals"));

		if (name == null) {
			return MISSING_NAME;
		}

		name = name.trim();
		if (name.length() < Constants.MinAssetNameLength || name.length() > Constants.MaxAssetNameLength) {
			return INCORRECT_ASSET_NAME_LENGTH;
		}
		String normalizedName = name.toLowerCase();
		for (int i = 0; i < normalizedName.length(); i++) {
			if (Constants.Alphabet.indexOf(normalizedName.charAt(i)) < 0) {
				return INCORRECT_ASSET_NAME;
			}
		}

		if (description != null && description.length() > Constants.MaxAssetDescriptionLength) {
			return INCORRECT_ASSET_DESCRIPTION;
		}

		byte decimals = 0;
		if (decimalsValue != null) {
			try {
				decimals = Byte.parseByte(decimalsValue);
				if (decimals < 0 || decimals > 8) {
					return INCORRECT_DECIMALS;
				}
			} catch (NumberFormatException e) {
				return INCORRECT_DECIMALS;
			}
		}

		long quantityQNT = ParameterParser.getQuantityQNT(req);
		Account account = ParameterParser.getSenderAccount(req);
		Attachment attachment = new Attachment.ColoredCoinsAssetIssuance(name, description, quantityQNT, decimals);
		return createTransaction(req, account, attachment);

	}

	final long minimumFeeNQT() {
		return Constants.AssetIssuanceFeeMilliLm;
	}
	*/
}

module.exports = Main;
