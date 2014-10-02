/**!
 * LibreMoney Accounts 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

if (typeof module !== "undefined") {
	var Api = require(__dirname + "/Api");
	var BlockchainProcessor = require(__dirname + '/../BlockchainProcessor/BlockchainProcessor');
	var Convert = require(__dirname + '/../../Lib/Util/Convert');
	var Listeners = require(__dirname + '/../../Lib/Util/Listeners');
	var Logger = require(__dirname + '/../../Lib/Util/Logger').GetLogger(module);
}


var Accounts = function () {
	var accounts = {};
	var currentAccount = null;
	//var allAccounts = new Array(); //Collections.unmodifiableCollection(accounts.values());
	var leasingAccounts = new Array(); //ConcurrentHashMap<>();
	//var listeners = new Listeners();
	//var assetListeners = new Listeners();
	//var leaseListeners = new Listeners();


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
		var account = new Account(id);
		if (typeof accounts[id] === "undefined") {
			accounts[id] = account;
		}
		return accounts[id];
	}

	function Clear() {
		accounts.length = 0;
		leasingAccounts.length = 0;
	}

	function CreateFromSecretWord(secret) {
		if (secret instanceof Buffer) {
			secret = secret.toString("hex")
		}
		var publicKey = Crypto.GetPublicKey(secret);
		var accountId = GetId(new Buffer(publicKey, "hex"));
		var account = AddOrGetAccount(accountId.toString());
		account.publicKey = new Buffer(publicKey, "hex");
		return account;
	}

	function GetAccount(_id) {
		return accounts[_id];
	}

	function GetAccountById(id) {
		return !id ? null : accounts[id];
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

	/*
	deprecated
	function GetAccounts(accountId, callback) {
		var account = Accounts.GetAccount(accountId.toString());
		//self.SetAmount(Convert.RoundTo5Float(account.balance));
		//self.SetUnconfirmedAmount(Convert.RoundTo5Float(account.unconfirmedBalance));
		callback(null, account);
	}
	*/

	/*
	function GetAllAccounts() {
		return allAccounts;
	}
	*/

	function GetId(publicKey) {
		return Convert.GetAccountId(publicKey);
	}

	function GetRegisteredAccounts(callback) {
		if (typeof callback !== "function") {
			callback = function(err, docs) {}
		}
		DB.db.find({
			type: "account"
		}).sort({
			time: 1
		}).exec(callback);
	}

	function Init() {
		var Core = require(__dirname + '/../Core');
		Core.AddListener(Core.Event.Clear, OnClear);
		Core.AddListener(Core.Event.GetState, OnGetState);
		Core.AddListener(Core.Event.InitServer, OnInitServer);
		BlockchainProcessor.AddListener(BlockchainProcessor.Event.AFTER_BLOCK_APPLY, OnAfterBlockApply);
		BlockchainProcessor.AddListener(BlockchainProcessor.Event.BLOCK_POPPED, OnBlockPopped);
	}

	function InsertNewAccount(params, request, callback) {
		if (typeof params === "undefined") {
			console.log("empty params for new account insert.");
			return false;
		}
		var doc = {
			type: "account",
			accountId: params.accountId,
			publicKeyStr: params.publicKey,
			ip: request.connection.remoteAddress,
			time: Utils.getDateTime()
		};
		Logger.info("user doc", doc);
		DB.db.insert(doc, function(err, newDocs) {
			if (!err) {
				if (typeof callback === "function") {
					callback(newDocs);
				}
			} else {
				console.log("insert_callback error", err);
			}
		});
		return true;
	}

	function IsLogginedForForge() {
		return !!currentAccount;
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

	function SetCurrentAccount(account) {
		if (currentAccount !== null) {
			Logger.warn("Current account already set");
			return false;
		}
		currentAccount = account;
	}

	return {
		Event: Event,

		Accounts: accounts,
		//AllAccounts: allAccounts,
		LeasingAccounts: leasingAccounts,

		AddAssetListener: AddAssetListener,
		AddLeaseListener: AddLeaseListener,
		AddListener: AddListener,
		AddOrGetAccount: AddOrGetAccount,
		Clear: Clear,
		GetAccount: GetAccount,
		GetAccountById: GetAccountById,
		GetAccountByPublicKey: GetAccountByPublicKey,
		//GetAllAccounts: GetAllAccounts,
		GetId: GetId,
		GetRegisteredAccounts: GetRegisteredAccounts,
		Init: Init,
		InsertNewAccount: InsertNewAccount,
		IsLogginedForForge: IsLogginedForForge,
		RemoveAssetListener: RemoveAssetListener,
		RemoveLeaseListener: RemoveLeaseListener,
		RemoveListener: RemoveListener,
		SetCurrentAccount: SetCurrentAccount
	}
}();


if (typeof module !== "undefined") {
	module.exports = Accounts;
}
