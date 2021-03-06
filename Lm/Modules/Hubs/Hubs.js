/**!
 * LibreMoney Hubs 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var Core = require(__dirname + '/../Core');
var Hub = require(__dirname + '/Hub');


var Hubs = new Array(); //ConcurrentHashMap<>();
var LastBlockId;
var LastHits = new Array(); // List<Hit>


function AddOrUpdateHub(accountId, minFeePerByteMilliLm, uris) {
	hubs[accountId] = new Hub(accountId, minFeePerByteMilliLm, uris);
}

function GetHubHits(block) {
	throw 'Not';
	/*
	synchronized (Hub.class) {
		if (block.getId().equals(lastBlockId) && lastHits != null) {
			return lastHits;
		}
		List<Hit> currentHits = new ArrayList<>();
		Long currentLastBlockId;

		synchronized (BlockchainImpl.getInstance()) {
			currentLastBlockId = BlockchainImpl.getInstance().getLastBlock().getId();
			if (! currentLastBlockId.equals(block.getId())) {
				return Collections.emptyList();
			}
			for (Map.Entry<Long, Hub> hubEntry : hubs.entrySet()) {
				Account account = Account.getAccount(hubEntry.getKey());
				if (account != null && account.getEffectiveBalanceNXT() >= Constants.MinHubEffectiveBalance
						&& account.getPublicKey() != null) {
					currentHits.add(new Hit(hubEntry.getValue(), Generator.getHitTime(account, block)));
				}
			}
		}

		Collections.sort(currentHits);
		lastHits = currentHits;
		lastBlockId = currentLastBlockId;
	}
	return lastHits;
	*/
}

function Init() {
	Core.AddListener(Core.Event.InitServer, OnInitServer);
}

function OnInitServer(app) {
	var Api = require(__dirname + "/Api");
	app.get("/api/getNextBlockGenerators", Api.GetNextBlockGenerators); // isTestnet
}

function RemoveHub(accountId) {
	throw 'Not';
	/*
	hubs.remove(accountId);
	*/
}


exports.Hubs = Hubs;
exports.AddOrUpdateHub = AddOrUpdateHub;
exports.GetHubHits = GetHubHits;
exports.Init = Init;
exports.RemoveHub = RemoveHub;

exports.SUBTYPE_MESSAGING_HUB_ANNOUNCEMENT = 4;
