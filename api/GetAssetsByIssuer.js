/*
import nxt.Account;
import nxt.Asset;
*/

function Main(req, res) {
	res.send('This is not implemented');
	/*
	static final GetAssetsByIssuer instance = new GetAssetsByIssuer();

	private GetAssetsByIssuer() {
		super("account", "account", "account");
	}

	JSONStreamAware processRequest(HttpServletRequest req) throws ParameterException {
		List<Account> accounts = ParameterParser.getAccounts(req);
		JSONObject response = new JSONObject();
		JSONArray accountsJSONArray = new JSONArray();
		response.put("assets", accountsJSONArray);
		for (Account account : accounts) {
			List<Asset> assets = Asset.getAssetsIssuedBy(account.getId());
			JSONArray assetsJSONArray = new JSONArray();
			for (Asset asset : assets) {
				assetsJSONArray.add(JSONData.asset(asset));
			}
			accountsJSONArray.add(assetsJSONArray);
		}
		return response;
	}
	*/
}

module.exports = Main;
