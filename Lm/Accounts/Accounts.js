/**!
 * LibreMoney Accounts 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var Api = require(__dirname + "/Api");
var Convert = require(__dirname + '/../Util/Convert');
var BlockchainProcessor = require(__dirname + '/../BlockchainProcessor/BlockchainProcessor');
var Listeners = require(__dirname + '/../Util/Listeners');


var MaxTrackedBalanceConfirmations = 2881;

var accounts = new Array(); //ConcurrentHashMap<>();
var allAccounts = new Array(); //Collections.unmodifiableCollection(accounts.values());
var leasingAccounts = new Array(); //ConcurrentHashMap<>();
var listeners = new Listeners();
var assetListeners = new Listeners();
var leaseListeners = new Listeners();


var Event = {
	BALANCE:0,
	UNCONFIRMED_BALANCE:1,
	ASSET_BALANCE:2,
	UNCONFIRMED_ASSET_BALANCE:3,
	LEASE_SCHEDULED:4,
	LEASE_STARTED:5,
	LEASE_ENDED:6
	};


function AddAssetListener(eventType, listener) {
	return assetListeners.AddListener(eventType, listener);
}

function AddLeaseListener(eventType, listener) {
	return leaseListeners.AddListener(eventType, listener);
}

function AddListener(eventType, listener) {
	return listeners.AddListener(eventType, listener);
}

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
	accounts.length = 0;
	leasingAccounts.length = 0;
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
	return id == null ? null : accounts[id];
}

function GetAccountByPublicKey(publicKey) {
	var accId = GetId(publicKey);
	console.log("GetAccountByPublicKey: accId="+accId);
	var account = accounts[accId];
	if (account == null) {
		return null;
	}
	if (account.GetPublicKey() == null || Arrays.equals(account.GetPublicKey(), publicKey)) {
		return account;
	}
	throw new Error("DUPLICATE KEY for account " + Convert.ToUnsignedLong(account.GetId()) + " existing key " +
		Convert.ToHexString(account.GetPublicKey()) + " new key " + Convert.ToHexString(publicKey));
}

function GetAllAccounts() {
	return allAccounts;
}

function GetId(publicKey) {
	return Convert.GetAccountId(publicKey);
}

function Init() {
	var Core = require(__dirname + '/../Core');
	Core.AddListener(Core.Event.Clear, OnClear);
	Core.AddListener(Core.Event.GetState, OnGetState);
	Core.AddListener(Core.Event.InitServer, OnInitServer);
	BlockchainProcessor.AddListener(BlockchainProcessor.Event.AFTER_BLOCK_APPLY, OnAfterBlockApply);
	BlockchainProcessor.AddListener(BlockchainProcessor.Event.BLOCK_POPPED, OnBlockPopped);
}

function OnAfterBlockApply(block) {
	var height = block.GetHeight();
	for (account in leasingAccounts) {
		/*
		if (height == account.GetCurrentLeasingHeightFrom()) {
			Accounts.GetAccount(account.GetCurrentLesseeId()).GetLessorIds().Add(account.getId());
			leaseListeners.Notify(Event.LEASE_STARTED,
					new AccountLease(account.getId(), account.currentLesseeId, height, account.currentLeasingHeightTo));
		} else if (height == account.currentLeasingHeightTo) {
			Account.getAccount(account.currentLesseeId).lessorIds.remove(account.getId());
			leaseListeners.Notify(Event.LEASE_ENDED,
					new AccountLease(account.getId(), account.currentLesseeId, account.currentLeasingHeightFrom, height));
			if (account.nextLeasingHeightFrom == Integer.MAX_VALUE) {
				account.currentLeasingHeightFrom = Integer.MAX_VALUE;
				account.currentLesseeId = null;
				//iterator.remove();
			} else {
				account.currentLeasingHeightFrom = account.nextLeasingHeightFrom;
				account.currentLeasingHeightTo = account.nextLeasingHeightTo;
				account.currentLesseeId = account.nextLesseeId;
				account.nextLeasingHeightFrom = Integer.MAX_VALUE;
				account.nextLesseeId = null;
				if (height == account.currentLeasingHeightFrom) {
					Account.getAccount(account.currentLesseeId).lessorIds.add(account.getId());
					leaseListeners.Notify(Event.LEASE_STARTED,
							new AccountLease(account.getId(), account.currentLesseeId, height, account.currentLeasingHeightTo));
				}
			}
		} else if (height == account.currentLeasingHeightTo + 1440) {
			//keep expired leases for up to 1440 blocks to be able to handle block pop-off
			iterator.remove();
		}
		*/
	}
}

function OnBlockPopped(block) {
	/*
	int height = block.getHeight();
	for (Account account : leasingAccounts.values()) {
		if (height == account.currentLeasingHeightFrom || height == account.currentLeasingHeightTo) {
			// hack
			throw new RuntimeException("Undo of lease start or end not supported");
		}
	}
	*/
}

function OnClear() {
	Clear();
}

function OnGetState(response) {
	var totalEffectiveBalance = 0;
	for (var i in allAccounts) {
		account = allAccounts[i];
		var effectiveBalanceLm = account.GetEffectiveBalanceLm();
		if (effectiveBalanceLm > 0) {
			totalEffectiveBalance += effectiveBalanceLm;
		}
	}
	response.totalEffectiveBalanceLm = totalEffectiveBalance;
	response.numberOfAccounts = allAccounts.length;
}

function OnInitServer(app) {
	app.get("/api/getAccount", Api.GetAccount);
	app.get("/api/getAccountId", Api.GetAccountId);
	app.get("/api/getAccountPublicKey", Api.GetAccountPublicKey);
	app.get("/api/getBalance", Api.GetBalance);
	app.get("/api/getGuaranteedBalance", Api.GetGuaranteedBalance);
	app.get("/api/leaseBalance", Api.LeaseBalance);
}

function RemoveAssetListener(eventType, listener) {
	return assetListeners.RemoveListener(eventType, listener);
}

function RemoveLeaseListener(eventType, listener) {
	return leaseListeners.RemoveListener(eventType, listener);
}

function RemoveListener(eventType, listener) {
	return listeners.RemoveListener(eventType, listener);
}


exports.Event = Event;

exports.Accounts = accounts;
exports.AllAccounts = allAccounts;
exports.LeasingAccounts = leasingAccounts;
exports.MaxTrackedBalanceConfirmations = MaxTrackedBalanceConfirmations;

exports.AddAssetListener = AddAssetListener;
exports.AddLeaseListener = AddLeaseListener;
exports.AddListener = AddListener;
exports.AddOrGetAccount = AddOrGetAccount;
exports.Clear = Clear;
//exports.GetAccount = GetAccount;
exports.GetAccountById = GetAccountById;
exports.GetAccountByPublicKey = GetAccountByPublicKey;
exports.GetAllAccounts = GetAllAccounts;
exports.GetId = GetId;
exports.Init = Init;
exports.RemoveAssetListener = RemoveAssetListener;
exports.RemoveLeaseListener = RemoveLeaseListener;
exports.RemoveListener = RemoveListener;
