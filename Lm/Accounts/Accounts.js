/**!
 * LibreMoney accounts 0.0
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var Convert = require(__dirname + '/../Util/Convert');
var Crypto = require(__dirname + '/../Crypto/Crypto');


var MaxTrackedBalanceConfirmations = 2881;
//ConcurrentMap<Long, Account> accounts = new ConcurrentHashMap<>(); -> Lm.js
//private static final Collection<Account> allAccounts = Collections.unmodifiableCollection(accounts.values()); -> Lm.js
//private static final ConcurrentMap<Long, Account> leasingAccounts = new ConcurrentHashMap<>(); -> Lm.js

//private static final Listeners<Account,Event> listeners = new Listeners<>();
//private static final Listeners<AccountAsset,Event> assetListeners = new Listeners<>();
//private static final Listeners<AccountLease,Event> leaseListeners = new Listeners<>();

var accounts = new Array();
var allAccounts = new Array();
var leasingAccounts = new Array();
var listeners = new Array();
var assetListeners = new Array();
var leaseListeners = new Array();


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

/*
function GetAccount(value) {
	if (typeof value == 'number') {
		return GetAccountById(value);
	} else {
		return GetAccountByPublicKey(value);
	}
}
*/

function GetAccountById(id) {
	return accounts[id];
}

function GetAccountByPublicKey(publicKey) {
	var accId = GetId(publicKey);
	console.log("GetAccountByPublicKey: accId="+accId);
	return accounts[accId];
}

function GetAllAccounts() {
	return allAccounts;
}

function GetId(publicKey) {
	// Prof1983 - ????
	var publicKeyHash = Crypto.Sha256().update(publicKey).digest('hex');
	console.log("GetId: publicKeyHash="+publicKeyHash);
	return Convert.FullHashToId(publicKeyHash);
}

function Init() {
}


exports.Accounts = accounts;
exports.AllAccounts = allAccounts;
exports.LeasingAccounts = leasingAccounts;
exports.MaxTrackedBalanceConfirmations = MaxTrackedBalanceConfirmations;

exports.AddOrGetAccount = AddOrGetAccount;
exports.Clear = Clear;
//exports.GetAccount = GetAccount;
exports.GetAccountById = GetAccountById;
exports.GetAccountByPublicKey = GetAccountByPublicKey;
exports.GetAllAccounts = GetAllAccounts;
//exports.GetId = GetId;
exports.Init = Init;
