
//import nxt.util.Convert;

var assets = [];
var accountAssets = [];
var allAssets = [];

/*
public static Collection<Asset> getAllAssets() {
	return allAssets;
}

public static Asset getAsset(Long id) {
	return assets.get(id);
}

public static List<Asset> getAssetsIssuedBy(Long accountId) {
	List<Asset> assets = accountAssets.get(accountId);
	if (assets == null) {
		return Collections.emptyList();
	}
	return Collections.unmodifiableList(assets);
}

static void addAsset(Long assetId, Long senderAccountId, String name, String description, long quantityQNT, byte decimals) {
	Asset asset = new Asset(assetId, senderAccountId, name, description, quantityQNT, decimals);
	if (Asset.assets.putIfAbsent(assetId, asset) != null) {
		throw new IllegalStateException("Asset with id " + Convert.toUnsignedLong(assetId) + " already exists");
	}
	List<Asset> accountAssetsList = accountAssets.get(senderAccountId);
	if (accountAssetsList == null) {
		accountAssetsList = new CopyOnWriteArrayList<>();
		accountAssets.put(senderAccountId, accountAssetsList);
	}
	accountAssetsList.add(asset);
}

static void removeAsset(Long assetId) {
	Asset asset = Asset.assets.remove(assetId);
	List<Asset> accountAssetList = accountAssets.get(asset.getAccountId());
	accountAssetList.remove(asset);
}
*/

function Clear() {
	//Asset.assets.clear();
	//Asset.accountAssets.clear();
}

module.exports.Clear = Clear;
