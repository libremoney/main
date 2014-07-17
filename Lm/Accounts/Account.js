/*
import nxt.util.Convert;
import nxt.util.Listener;
import nxt.util.Listeners;
import nxt.util.Logger;
*/

var Lm = require(__dirname + '/Lm');
var LmAccounts = require(__dirname + '/LmAccounts');
var Crypto = require(__dirname + '/../crypto/Crypto');
var Logger = require(__dirname + '/../util/Logger');


function Account(id) {
	var obj = {};

	/*
	public static enum Event {
		BALANCE, UNCONFIRMED_BALANCE, ASSET_BALANCE, UNCONFIRMED_ASSET_BALANCE,
		LEASE_SCHEDULED, LEASE_STARTED, LEASE_ENDED
	}
	*/

	/*
	static class DoubleSpendingException extends RuntimeException {
		DoubleSpendingException(String message) {
			super(message);
		}
	}
	*/

	/*
	static {
		Nxt.getBlockchainProcessor().addListener(new Listener<Block>() {
			@Override
			public void notify(Block block) {
				int height = block.getHeight();
				Iterator<Map.Entry<Long, Account>> iterator = leasingAccounts.entrySet().iterator();
				while (iterator.hasNext()) {
					Account account = iterator.next().getValue();
					if (height == account.currentLeasingHeightFrom) {
						Account.getAccount(account.currentLesseeId).lessorIds.add(account.getId());
						leaseListeners.notify(
								new AccountLease(account.getId(), account.currentLesseeId, height, account.currentLeasingHeightTo),
								Event.LEASE_STARTED);
					} else if (height == account.currentLeasingHeightTo) {
						Account.getAccount(account.currentLesseeId).lessorIds.remove(account.getId());
						leaseListeners.notify(
								new AccountLease(account.getId(), account.currentLesseeId, account.currentLeasingHeightFrom, height),
								Event.LEASE_ENDED);
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
								leaseListeners.notify(
										new AccountLease(account.getId(), account.currentLesseeId, height, account.currentLeasingHeightTo),
										Event.LEASE_STARTED);
							}
						}
					} else if (height == account.currentLeasingHeightTo + 1440) {
						//keep expired leases for up to 1440 blocks to be able to handle block pop-off
						iterator.remove();
					}
				}
			}
		}, BlockchainProcessor.Event.AFTER_BLOCK_APPLY);

		Nxt.getBlockchainProcessor().addListener(new Listener<Block>() {
			@Override
			public void notify(Block block) {
				int height = block.getHeight();
				for (Account account : leasingAccounts.values()) {
					if (height == account.currentLeasingHeightFrom || height == account.currentLeasingHeightTo) {
						// hack
						throw new RuntimeException("Undo of lease start or end not supported");
					}
				}
			}
		}, BlockchainProcessor.Event.BLOCK_POPPED);
	}
	*/

	/*
	public static boolean addListener(Listener<Account> listener, Event eventType) {
		return listeners.addListener(listener, eventType);
	}

	public static boolean removeListener(Listener<Account> listener, Event eventType) {
		return listeners.removeListener(listener, eventType);
	}

	public static boolean addAssetListener(Listener<AccountAsset> listener, Event eventType) {
		return assetListeners.addListener(listener, eventType);
	}

	public static boolean removeAssetListener(Listener<AccountAsset> listener, Event eventType) {
		return assetListeners.removeListener(listener, eventType);
	}

	public static boolean addLeaseListener(Listener<AccountLease> listener, Event eventType) {
		return leaseListeners.addListener(listener, eventType);
	}

	public static boolean removeLeaseListener(Listener<AccountLease> listener, Event eventType) {
		return leaseListeners.removeListener(listener, eventType);
	}
	*/

	function GetAllAccounts() {
		return LmAccounts.GetAllAccounts();
	}

	function GetAccount(value) {
		return LmAccounts.GetAccount(value);
	}

	/*
	function GetId(publicKey) {
		return LmAccounts.GetId(publicKey);
	}
	*/

	function AddOrGetAccount(id) {
		return LmAccounts.AddOrGetAccount(id);
	}

	function Clear() {
		return LmAccounts.Clear();
	}




	function GetId() {
		return this.id;
	}

	function GetName() {
		return this.name;
	}

	function GetDescription() {
		return this.description;
	}

	function SetAccountInfo(name, description) {
		throw new Error('Not implementted');
		/*
		this.name = Convert.emptyToNull(name.trim());
		this.description = Convert.emptyToNull(description.trim());
		*/
	}

	function GetPublicKey() {
		throw new Error('Not implementted');
		/*
		if (this.keyHeight == -1) {
			return null;
		}
		return publicKey;
		*/
	}

	function GetBalanceMilliLm() {
		return this.balanceMilliLm;
	}

	function GetUnconfirmedBalanceMilliLm() {
		return this.unconfirmedBalanceMilliLm;
	}

	function GetForgedBalanceMilliLm() {
		return this.forgedBalanceMilliLm;
	}

	function GetEffectiveBalanceLm() {
		throw new Error('Not implementted');
		/*
		Block lastBlock = Nxt.getBlockchain().getLastBlock();

		if (lastBlock.getHeight() >= Constants.TRANSPARENT_FORGING_BLOCK_6
				&& (publicKey == null || keyHeight == -1 || lastBlock.getHeight() - keyHeight <= 1440)) {
			return 0; // cfb: Accounts with the public key revealed less than 1440 blocks ago are not allowed to generate blocks
		}

		if (lastBlock.getHeight() < Constants.TRANSPARENT_FORGING_BLOCK_3
				&& this.height < Constants.TRANSPARENT_FORGING_BLOCK_2) {

			if (this.height == 0) {
				return getBalanceNQT() / Constants.ONE_NXT;
			}
			if (lastBlock.getHeight() - this.height < 1440) {
				return 0;
			}
			long receivedInlastBlock = 0;
			for (Transaction transaction : lastBlock.getTransactions()) {
				if (transaction.getRecipientId().equals(id)) {
					receivedInlastBlock += transaction.getAmountNQT();
				}
			}
			return (getBalanceNQT() - receivedInlastBlock) / Constants.ONE_NXT;
		}

		if (lastBlock.getHeight() < currentLeasingHeightFrom) {
				return (getGuaranteedBalanceNQT(1440) + getLessorsGuaranteedBalanceNQT()) / Constants.ONE_NXT;
		}

		return getLessorsGuaranteedBalanceNQT() / Constants.ONE_NXT;
		*/
	}

	function GetLessorsGuaranteedBalanceMilliLm() {
		throw new Error('Not implementted');
		/*
		long lessorsGuaranteedBalanceNQT = 0;
		for (Long accountId : lessorIds) {
			lessorsGuaranteedBalanceNQT += Account.getAccount(accountId).getGuaranteedBalanceNQT(1440);
		}
		return lessorsGuaranteedBalanceNQT;
		*/
	}

	function GetGuaranteedBalanceMilliLm(numberOfConfirmations) {
		throw new Error('Not implementted');
		/*
		if (numberOfConfirmations >= Nxt.getBlockchain().getLastBlock().getHeight()) {
			return 0;
		}
		if (numberOfConfirmations > maxTrackedBalanceConfirmations || numberOfConfirmations < 0) {
			throw new IllegalArgumentException("Number of required confirmations must be between 0 and " + maxTrackedBalanceConfirmations);
		}
		if (guaranteedBalances.isEmpty()) {
			return 0;
		}
		int i = Collections.binarySearch(guaranteedBalances, new GuaranteedBalance(Nxt.getBlockchain().getLastBlock().getHeight() - numberOfConfirmations, 0));
		if (i == -1) {
			return 0;
		}
		if (i < -1) {
			i = -i - 2;
		}
		if (i > guaranteedBalances.size() - 1) {
			i = guaranteedBalances.size() - 1;
		}
		GuaranteedBalance result;
		while ((result = guaranteedBalances.get(i)).ignore && i > 0) {
			i--;
		}
		return result.ignore || result.balance < 0 ? 0 : result.balance;
		*/
	}

	function GetUnconfirmedAssetBalanceQNT(assetId) {
		return this.unconfirmedAssetBalances[assetId];
	}

	function GetAssetBalancesQNT() {
		throw new Error('Not implementted');
		/*
		return Collections.unmodifiableMap(assetBalances);
		*/
	}

	function GetUnconfirmedAssetBalancesQNT() {
		throw new Error('Not implementted');
		/*
		return Collections.unmodifiableMap(unconfirmedAssetBalances);
		*/
	}

	function GetCurrentLesseeId() {
		return this.currentLesseeId;
	}

	function GetNextLesseeId() {
		return this.nextLesseeId;
	}

	function GetCurrentLeasingHeightFrom() {
		return this.CurrentLeasingHeightFrom;
	}

	function GetCurrentLeasingHeightTo() {
		return this.currentLeasingHeightTo;
	}

	function GetNextLeasingHeightFrom() {
		return this.nextLeasingHeightFrom;
	}

	function GetNextLeasingHeightTo() {
		return this.nextLeasingHeightTo;
	}

	function GetLessorIds() {
		throw new Error('Not implementted');
		/*
		return Collections.unmodifiableSet(lessorIds);
		*/
	}

	function LeaseEffectiveBalance(lesseeId, period) {
		throw new Error('Not implementted');
		/*
		Account lessee = Account.getAccount(lesseeId);
		if (lessee != null && lessee.getPublicKey() != null) {
			Block lastBlock = Nxt.getBlockchain().getLastBlock();
			leasingAccounts.put(this.getId(), this);
			if (currentLeasingHeightFrom == Integer.MAX_VALUE) {

				currentLeasingHeightFrom = lastBlock.getHeight() + 1440;
				currentLeasingHeightTo = currentLeasingHeightFrom + period;
				currentLesseeId = lesseeId;
				nextLeasingHeightFrom = Integer.MAX_VALUE;
				leaseListeners.notify(
						new AccountLease(this.getId(), lesseeId, currentLeasingHeightFrom, currentLeasingHeightTo),
						Event.LEASE_SCHEDULED);

			} else {

				nextLeasingHeightFrom = lastBlock.getHeight() + 1440;
				if (nextLeasingHeightFrom < currentLeasingHeightTo) {
					nextLeasingHeightFrom = currentLeasingHeightTo;
				}
				nextLeasingHeightTo = nextLeasingHeightFrom + period;
				nextLesseeId = lesseeId;
				leaseListeners.notify(
						new AccountLease(this.getId(), lesseeId, nextLeasingHeightFrom, nextLeasingHeightTo),
						Event.LEASE_SCHEDULED);

			}
		}
		*/
	}

	// returns true iff:
	// this.publicKey is set to null (in which case this.publicKey also gets set to key)
	// or
	// this.publicKey is already set to an array equal to key
	function SetOrVerify(key, height) {
		throw new Error('Not implementted');
		/*
		if (this.publicKey == null) {
			this.publicKey = key;
			this.keyHeight = -1;
			return true;
		} else if (Arrays.equals(this.publicKey, key)) {
			return true;
		} else if (this.keyHeight == -1) {
			Logger.logMessage("DUPLICATE KEY!!!");
			Logger.logMessage("Account key for " + Convert.toUnsignedLong(id) + " was already set to a different one at the same height "
					+ ", current height is " + height + ", rejecting new key");
			return false;
		} else if (this.keyHeight >= height) {
			Logger.logMessage("DUPLICATE KEY!!!");
			Logger.logMessage("Changing key for account " + Convert.toUnsignedLong(id) + " at height " + height
					+ ", was previously set to a different one at height " + keyHeight);
			this.publicKey = key;
			this.keyHeight = height;
			return true;
		}
		Logger.logMessage("DUPLICATE KEY!!!");
		Logger.logMessage("Invalid key for account " + Convert.toUnsignedLong(id) + " at height " + height
				+ ", was already set to a different one at height " + keyHeight);
		return false;
		*/
	}

	function Apply(key, height) {
		throw new Error('Not implementted');
		/*
		if (! setOrVerify(key, this.height)) {
			throw new IllegalStateException("Generator public key mismatch");
		}
		if (this.publicKey == null) {
			throw new IllegalStateException("Public key has not been set for account " + Convert.toUnsignedLong(id)
					+" at height " + height + ", key height is " + keyHeight);
		}
		if (this.keyHeight == -1 || this.keyHeight > height) {
			this.keyHeight = height;
		}
		*/
	}

	function Undo(height) {
		throw new Error('Not implementted');
		/*
		if (this.keyHeight >= height) {
			Logger.logDebugMessage("Unsetting key for account " + Convert.toUnsignedLong(id) + " at height " + height
					+ ", was previously set at height " + keyHeight);
			this.publicKey = null;
			this.keyHeight = -1;
		}
		if (this.height == height) {
			Logger.logDebugMessage("Removing account " + Convert.toUnsignedLong(id) + " which was created in the popped off block");
			accounts.remove(this.getId());
		}
		*/
	}

	function GetAssetBalanceQNT(assetId) {
		throw new Error('Not implementted');
		/*
		return Convert.nullToZero(assetBalances.get(assetId));
		*/
	}

	function AddToAssetBalanceQNT(assetId, quantityQNT) {
		throw new Error('Not implementted');
		/*
		synchronized (this) {
			Long assetBalance = assetBalances.get(assetId);
            assetBalance = assetBalance == null ? quantityQNT : Convert.safeAdd(assetBalance, quantityQNT);
            if (assetBalance < 0) {
                throw new DoubleSpendingException("Negative asset balance for account " + Convert.toUnsignedLong(id));
            }
            assetBalances.put(assetId, assetBalance);
		}
		listeners.notify(this, Event.ASSET_BALANCE);
		assetListeners.notify(new AccountAsset(id, assetId, assetBalances.get(assetId)), Event.ASSET_BALANCE);
		*/
	}

	function AddToUnconfirmedAssetBalanceQNT(assetId, quantityQNT) {
		throw new Error('Not implementted');
		/*
		synchronized (this) {
			Long unconfirmedAssetBalance = unconfirmedAssetBalances.get(assetId);
            unconfirmedAssetBalance = unconfirmedAssetBalance == null ? quantityQNT : Convert.safeAdd(unconfirmedAssetBalance, quantityQNT);
            if (unconfirmedAssetBalance < 0) {
                throw new DoubleSpendingException("Negative unconfirmed asset balance for account " + Convert.toUnsignedLong(id));
            }
            unconfirmedAssetBalances.put(assetId, unconfirmedAssetBalance);
		}
		listeners.notify(this, Event.UNCONFIRMED_ASSET_BALANCE);
		assetListeners.notify(new AccountAsset(id, assetId, unconfirmedAssetBalances.get(assetId)), Event.UNCONFIRMED_ASSET_BALANCE);
		*/
	}

	function AddToAssetAndUnconfirmedAssetBalanceQNT(assetId, quantityQNT) {
		throw new Error('Not implementted');
		/*
		synchronized (this) {
			Long assetBalance = assetBalances.get(assetId);
            assetBalance = assetBalance == null ? quantityQNT : Convert.safeAdd(assetBalance, quantityQNT);
            if (assetBalance < 0) {
                throw new DoubleSpendingException("Negative unconfirmed asset balance for account " + Convert.toUnsignedLong(id));
            }
            assetBalances.put(assetId, assetBalance);

			Long unconfirmedAssetBalance = unconfirmedAssetBalances.get(assetId);
            unconfirmedAssetBalance = unconfirmedAssetBalance == null ? quantityQNT : Convert.safeAdd(unconfirmedAssetBalance, quantityQNT);
            if (unconfirmedAssetBalance < 0) {
                throw new DoubleSpendingException("Negative unconfirmed asset balance for account " + Convert.toUnsignedLong(id));
            }
            unconfirmedAssetBalances.put(assetId, unconfirmedAssetBalance);
		}
		listeners.notify(this, Event.ASSET_BALANCE);
		listeners.notify(this, Event.UNCONFIRMED_ASSET_BALANCE);
		assetListeners.notify(new AccountAsset(id, assetId, assetBalances.get(assetId)), Event.ASSET_BALANCE);
		assetListeners.notify(new AccountAsset(id, assetId, unconfirmedAssetBalances.get(assetId)), Event.UNCONFIRMED_ASSET_BALANCE);
		*/
	}

	function AddToBalanceMilliLm(amountNQT) {
		throw new Error('Not implementted');
		/*
		synchronized (this) {
			this.balanceNQT = Convert.safeAdd(this.balanceNQT, amountNQT);
			addToGuaranteedBalanceNQT(amountNQT);
		}
		if (amountNQT != 0) {
			listeners.notify(this, Event.BALANCE);
		}
		*/
	}

	function AddToUnconfirmedBalanceMilliLm(amountNQT) {
		throw new Error('Not implementted');
		/*
		if (amountNQT == 0) {
			return;
		}
		synchronized (this) {
			this.unconfirmedBalanceNQT = Convert.safeAdd(this.unconfirmedBalanceNQT, amountNQT);
		}
		listeners.notify(this, Event.UNCONFIRMED_BALANCE);
		*/
	}

	function AddToBalanceAndUnconfirmedBalanceMilliLm(amountNQT) {
		throw new Error('Not implementted');
		/*
		synchronized (this) {
			this.balanceNQT = Convert.safeAdd(this.balanceNQT, amountNQT);
			this.unconfirmedBalanceNQT = Convert.safeAdd(this.unconfirmedBalanceNQT, amountNQT);
			addToGuaranteedBalanceNQT(amountNQT);
		}
		if (amountNQT != 0) {
			listeners.notify(this, Event.BALANCE);
			listeners.notify(this, Event.UNCONFIRMED_BALANCE);
		}
		*/
	}

	function AddToForgedBalanceMilliLm(amountNQT) {
		throw new Error('Not implementted');
		/*
		synchronized(this) {
			this.forgedBalanceNQT = Convert.safeAdd(this.forgedBalanceNQT, amountNQT);
		}
		*/
	}

	function AddToGuaranteedBalanceMilliLm(amountNQT) {
		throw new Error('Not implementted');
		/*
		int blockchainHeight = Nxt.getBlockchain().getLastBlock().getHeight();
		GuaranteedBalance last = null;
		if (guaranteedBalances.size() > 0 && (last = guaranteedBalances.get(guaranteedBalances.size() - 1)).height > blockchainHeight) {
			// this only happens while last block is being popped off
			if (amountNQT > 0) {
				// this is a reversal of a withdrawal or a fee, so previous gb records need to be corrected
				for (GuaranteedBalance gb : guaranteedBalances) {
					gb.balance += amountNQT;
				}
			} // deposits don't need to be reversed as they have never been applied to old gb records to begin with
			last.ignore = true; // set dirty flag
			return; // block popped off, no further processing
		}
		int trimTo = 0;
		for (int i = 0; i < guaranteedBalances.size(); i++) {
			GuaranteedBalance gb = guaranteedBalances.get(i);
			if (gb.height < blockchainHeight - maxTrackedBalanceConfirmations
					&& i < guaranteedBalances.size() - 1
					&& guaranteedBalances.get(i + 1).height >= blockchainHeight - maxTrackedBalanceConfirmations) {
				trimTo = i; // trim old gb records but keep at least one at height lower than the supported maxTrackedBalanceConfirmations
				if (blockchainHeight >= Constants.TRANSPARENT_FORGING_BLOCK_4 && blockchainHeight < Constants.TRANSPARENT_FORGING_BLOCK_5) {
					gb.balance += amountNQT; // because of a bug which leads to a fork
				} else if (blockchainHeight >= Constants.TRANSPARENT_FORGING_BLOCK_5 && amountNQT < 0) {
					gb.balance += amountNQT;
				}
			} else if (amountNQT < 0) {
				gb.balance += amountNQT; // subtract current block withdrawals from all previous gb records
			}
			// ignore deposits when updating previous gb records
		}
		if (trimTo > 0) {
			Iterator<GuaranteedBalance> iter = guaranteedBalances.iterator();
			while (iter.hasNext() && trimTo > 0) {
				iter.next();
				iter.remove();
				trimTo--;
			}
		}
		if (guaranteedBalances.size() == 0 || last.height < blockchainHeight) {
			// this is the first transaction affecting this account in a newly added block
			guaranteedBalances.add(new GuaranteedBalance(blockchainHeight, balanceNQT));
		} else if (last.height == blockchainHeight) {
			// following transactions for same account in a newly added block
			// for the current block, guaranteedBalance (0 confirmations) must be same as balance
			last.balance = balanceNQT;
			last.ignore = false;
		} else {
			// should have been handled in the block popped off case
			throw new IllegalStateException("last guaranteed balance height exceeds blockchain height");
		}
		*/
	}

	function CheckBalance() {
		throw new Error('Not implementted');
		/*
		if (id.equals(Genesis.CREATOR_ID)) {
			return;
		}
		if (balanceNQT < 0) {
            throw new DoubleSpendingException("Negative balance for account " + Convert.toUnsignedLong(id));
		}
		if (unconfirmedBalanceNQT < 0) {
            throw new DoubleSpendingException("Negative unconfirmed balance for account " + Convert.toUnsignedLong(id));
		}
		if (unconfirmedBalanceNQT > balanceNQT) {
            throw new DoubleSpendingException("Unconfirmed balance exceeds balance for account " + Convert.toUnsignedLong(id));
		}
		*/
	}

	/*
	private static class GuaranteedBalance implements Comparable<GuaranteedBalance> {

		final int height;
		long balance;
		boolean ignore;

		private GuaranteedBalance(int height, long balance) {
			this.height = height;
			this.balance = balance;
			this.ignore = false;
		}

		@Override
		public int compareTo(GuaranteedBalance o) {
			if (this.height < o.height) {
				return -1;
			} else if (this.height > o.height) {
				return 1;
			}
			return 0;
		}

		@Override
		public String toString() {
			return "height: " + height + ", guaranteed: " + balance;
		}
	}
	*/


	/*
	id = 0;
	if (id != Crypto.RsDecode(Crypto.RsEncode(id))) {
		Logger.LogMessage("CRITICAL ERROR: Reed-Solomon encoding fails for " + id);
	}
	obj.id = id;
	obj.height = Lm.GetBlockchain().GetLastBlock().GetHeight();
	obj.currentLeasingHeightFrom = Integer.MAX_VALUE;
	*/

	/*
	var publicKey;
	var keyHeight;
	var balanceMilliLm; //balanceNQT;
	var unconfirmedBalanceMilliLm; //unconfirmedBalanceNQT;
	var forgedBalanceMilliLm; //forgedBalanceNQT;
	//private final List<GuaranteedBalance> guaranteedBalances = new ArrayList<>();

	var currentLeasingHeightFrom;
	var currentLeasingHeightTo;
	var currentLesseeId;
	var nextLeasingHeightFrom;
	var nextLeasingHeightTo;
	var nextLesseeId;
	//private Set<Long> lessorIds = Collections.newSetFromMap(new ConcurrentHashMap<Long,Boolean>());

	private final Map<Long, Long> assetBalances = new HashMap<>();
	private final Map<Long, Long> unconfirmedAssetBalances = new HashMap<>();

	var name;
	var description;
	*/

	/*
	obj.publicKey = publicKey;
	obj.keyHeight = keyHeight;
	obj.balanceMilliLm = balanceMilliLm;
	obj.unconfirmedBalanceMilliLm = unconfirmedBalanceMilliLm;
	obj.forgedBalanceMilliLm = forgedBalanceMilliLm;
	//obj.guaranteedBalances = guaranteedBalances;

	obj.currentLeasingHeightTo = currentLeasingHeightTo;
	obj.currentLesseeId = currentLesseeId;
	obj.nextLeasingHeightFrom = nextLeasingHeightFrom;
	obj.nextLeasingHeightTo = nextLeasingHeightTo;
	obj.nextLesseeId = nextLesseeId;
	//obj.lessorIds = lessorIds;

	obj.assetBalances = assetBalances;
	obj.unconfirmedAssetBalances = unconfirmedAssetBalances;
	*/

	obj.GetId = GetId;
	obj.GetName = GetName;
	obj.GetDescription = GetDescription;
	obj.GetPublicKey = GetPublicKey;
	obj.GetBalanceMilliLm = GetBalanceMilliLm;
	obj.GetUnconfirmedBalanceMilliLm = GetUnconfirmedBalanceMilliLm;
	obj.GetForgedBalanceMilliLm = GetForgedBalanceMilliLm;
	obj.GetEffectiveBalanceLm = GetEffectiveBalanceLm;
	obj.GetLessorsGuaranteedBalanceMilliLm = GetLessorsGuaranteedBalanceMilliLm;
	obj.GetGuaranteedBalanceMilliLm = GetGuaranteedBalanceMilliLm;
	obj.GetUnconfirmedAssetBalanceQNT = GetUnconfirmedAssetBalanceQNT;
	obj.GetAssetBalancesQNT = GetAssetBalancesQNT;
	obj.GetUnconfirmedAssetBalancesQNT = GetUnconfirmedAssetBalancesQNT;
	obj.GetCurrentLesseeId = GetCurrentLesseeId;
	obj.GetNextLesseeId = GetNextLesseeId;
	obj.GetCurrentLeasingHeightFrom = GetCurrentLeasingHeightFrom;
	obj.GetCurrentLeasingHeightTo = GetCurrentLeasingHeightTo;
	obj.GetNextLeasingHeightFrom = GetNextLeasingHeightFrom;
	obj.GetNextLeasingHeightTo = GetNextLeasingHeightTo;
	obj.GetLessorIds = GetLessorIds;
	obj.LeaseEffectiveBalance = LeaseEffectiveBalance;
	obj.SetOrVerify = SetOrVerify;
	obj.Apply = Apply;
	obj.Undo = Undo;
	obj.GetAssetBalanceQNT = GetAssetBalanceQNT;
	obj.AddToAssetBalanceQNT = AddToAssetBalanceQNT;
	obj.AddToUnconfirmedAssetBalanceQNT = AddToUnconfirmedAssetBalanceQNT;
	obj.AddToAssetAndUnconfirmedAssetBalanceQNT = AddToAssetAndUnconfirmedAssetBalanceQNT;
	obj.AddToBalanceMilliLm = AddToBalanceMilliLm;
	obj.AddToUnconfirmedBalanceMilliLm = AddToUnconfirmedBalanceMilliLm;
	obj.AddToBalanceAndUnconfirmedBalanceMilliLm = AddToBalanceAndUnconfirmedBalanceMilliLm;
	obj.AddToForgedBalanceMilliLm = AddToForgedBalanceMilliLm;
	obj.AddToGuaranteedBalanceMilliLm = AddToGuaranteedBalanceMilliLm;
	obj.CheckBalance = CheckBalance;
	return obj;
}

module.exports = Account;
