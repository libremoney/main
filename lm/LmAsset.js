
function Asset(AssetId, AccountId, Name, Description, QuantityMilliLm, Decimals) {
	this.AssetId = AssetId;
	this.AccountId = AccountId;
	this.Name = Name;
	this.Description = Description;
	this.QuantityMilliLm = QuantityMilliLm;
	this.Decimals = Decimals;
	return this;
}

/*
public Long getId() {
	return assetId;
}

public Long getAccountId() {
	return accountId;
}

public String getName() {
	return name;
}

public String getDescription() {
	return description;
}

public long getQuantityQNT() {
	return quantityQNT;
}

public byte getDecimals() {
	return decimals;
}
*/

module.exports = Asset;
