
function Alias(Account, Id, AliasName, AliasUri, Timestamp) {
	this.Account = Account;
	this.Id = Id;
	this.AliasName = AliasName;
	this.AliasUri = AliasUri;
	this.Timestamp = Timestamp;

	this.GetId = GetId;
	this.GetAliasName = GetAliasName;
	this.GetAliasUri = GetAliasUri;
	this.GetTimestamp = GetTimestamp;
	this.GetAccount = GetAccount;
}


function GetId() {
	return this.Id;
}

function GetAliasName() {
	return this.AliasName;
}

function GetAliasUri() {
	return this.AliasUri;
}

function GetTimestamp() {
	return this.Timestamp;
}

function GetAccount() {
	return this.Account;
}


module.exports = Alias;
