/**!
 * LibreMoney hubs 0.0
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */


var Hubs = new Array(); //ConcurrentHashMap<>();
var LastBlockId;
var LastHits = new Array(); // List<Hit>


function AddOrUpdateHub(accountId, minFeePerByteMilliLm, uris) {
	throw 'Not';
	/*
	hubs.put(accountId, new Hub(accountId, minFeePerByteMilliLm, uris));
	*/
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

function RemoveHub(accountId) {
	throw 'Not';
	/*
	hubs.remove(accountId);
	*/
}


exports.Hubs = Hubs;
exports.AddOrUpdateHub = AddOrUpdateHub;
exports.GetHubHits = GetHubHits;
exports.RemoveHub = RemoveHub;
