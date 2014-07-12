
var MaxTrackedBalanceConfirmations = 2881;
//ConcurrentMap<Long, Account> accounts = new ConcurrentHashMap<>(); -> Lm.js
//private static final Collection<Account> allAccounts = Collections.unmodifiableCollection(accounts.values()); -> Lm.js
//private static final ConcurrentMap<Long, Account> leasingAccounts = new ConcurrentHashMap<>(); -> Lm.js

//private static final Listeners<Account,Event> listeners = new Listeners<>();
//private static final Listeners<AccountAsset,Event> assetListeners = new Listeners<>();
//private static final Listeners<AccountLease,Event> leaseListeners = new Listeners<>();

var Accounts = new Array();
var AllAccounts = new Array();
var LeasingAccounts = new Array();
var Listeners = new Array();
var AssetListeners = new Array();
var LeaseListeners = new Array();


function AddOrGetAccount(id) {
	throw new Error('Not implementted');
	/*
	Account oldAccount = accounts.get(id);
	if (oldAccount == null) {
		Account account = new Account(id);
		oldAccount = accounts.putIfAbsent(id, account);
		return oldAccount != null ? oldAccount : account;
	} else {
		return oldAccount;
	}
	*/
}

function Clear() {
	throw new Error('Not implementted');
	/*
	accounts.clear();
	leasingAccounts.clear();
	*/
}

function GetAccount(value) {
	if (typeof value == 'number') {
		return GetAccountById(value);
	} else {
		return GetAccountByPublicKey(value);
	}
}

function GetAccountById(id) {
	return Accounts[id];
}

function GetAccountByPublicKey(publicKey) {
	return Accounts[GetId(publicKey)];
}

function GetAllAccounts() {
	return AllAccounts;
}

function GetId(publicKey) {
	throw new Error('Not implementted');
	/*
	var publicKeyHash = Crypto.sha256().digest(publicKey);
	return Convert.fullHashToId(publicKeyHash);
	*/
}


exports.Accounts = Accounts;
exports.AllAccounts = AllAccounts;
exports.LeasingAccounts = LeasingAccounts;
exports.MaxTrackedBalanceConfirmations = MaxTrackedBalanceConfirmations;

exports.AddOrGetAccount = AddOrGetAccount;
exports.Clear = Clear;
exports.GetAccount = GetAccount;
exports.GetAccountById = GetAccountById;
exports.GetAccountByPublicKey = GetAccountByPublicKey;
exports.GetAllAccounts = GetAllAccounts;
exports.GetId = GetId;
