/*
import nxt.crypto.Crypto;
import nxt.util.Convert;
import nxt.util.Logger;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
*/

// public interface Block
function LmBlock(Version, Timestamp, PreviousBlockId, TotalAmountMilliLm/*NQT*/, TotalFeeMilliLm/*NQT*/, PayloadLength, PayloadHash,
		GeneratorPublicKey, GenerationSignature, BlockSignature, PreviousBlockHash, Transactions) {

	/*
	int getVersion();
	Long getId();
	String getStringId();
	int getHeight();
	int getTimestamp();
	Long getGeneratorId();
	byte[] getGeneratorPublicKey();
	Long getPreviousBlockId();
	byte[] getPreviousBlockHash();
	Long getNextBlockId();
	long getTotalAmountNQT();
	long getTotalFeeNQT();
	int getPayloadLength();
	byte[] getPayloadHash();
	List<Long> getTransactionIds();
	List<? extends Transaction> getTransactions();
	byte[] getGenerationSignature();
	byte[] getBlockSignature();
	long getBaseTarget();
	BigInteger getCumulativeDifficulty();
	JSONObject getJSONObject();
	*/
	
	// --------

	this.Version = Version;
	this.Timestamp = Timestamp;
	this.PreviousBlockId = PreviousBlockId;
	this.GeneratorPublicKey = GeneratorPublicKey;
	this.PreviousBlockHash = PreviousBlockHash;
	this.TotalAmountMilliLm = TotalAmountMilliLm;
	this.TotalFeeMilliLm = TotalFeeMilliLm;
	this.PayloadLength = PayloadLength;
	this.GenerationSignature = GenerationSignature;
	this.PayloadHash = PayloadHash;
	this.TransactionIds = new Array();
	this.BlockTransactions = new Array();
	this.BlockSignature = BlockSignature;
	/*
	private BigInteger cumulativeDifficulty = BigInteger.ZERO;
	private long baseTarget = Constants.INITIAL_BASE_TARGET;
	private volatile Long nextBlockId;
	private int height = -1;
	private volatile Long id;
	private volatile String stringId = null;
	private volatile Long generatorId;


	if (transactions.size() > Constants.MAX_NUMBER_OF_TRANSACTIONS) {
		throw new NxtException.ValidationException("attempted to create a block with " + transactions.size() + " transactions");
	}

	if (payloadLength > Constants.MAX_PAYLOAD_LENGTH || payloadLength < 0) {
		throw new NxtException.ValidationException("attempted to create a block with payloadLength " + payloadLength);
	}

	this.version = version;
	this.timestamp = timestamp;
	this.previousBlockId = previousBlockId;
	this.totalAmountNQT = totalAmountNQT;
	this.totalFeeNQT = totalFeeNQT;
	this.payloadLength = payloadLength;
	this.payloadHash = payloadHash;
	this.generatorPublicKey = generatorPublicKey;
	this.generationSignature = generationSignature;
	this.blockSignature = blockSignature;

	this.previousBlockHash = previousBlockHash;
	this.blockTransactions = Collections.unmodifiableList(transactions);
	List<Long> transactionIds = new ArrayList<>(this.blockTransactions.size());
	Long previousId = Long.MIN_VALUE;
	for (Transaction transaction : this.blockTransactions) {
		if (transaction.getId() < previousId) {
			throw new NxtException.ValidationException("Block transactions are not sorted!");
		}
		transactionIds.add(transaction.getId());
		previousId = transaction.getId();
	}
	this.transactionIds = Collections.unmodifiableList(transactionIds);
	*/

	/*
	BlockImpl(int version, int timestamp, Long previousBlockId, long totalAmountNQT, long totalFeeNQT, int payloadLength,
			  byte[] payloadHash, byte[] generatorPublicKey, byte[] generationSignature, byte[] blockSignature,
			  byte[] previousBlockHash, List<TransactionImpl> transactions, BigInteger cumulativeDifficulty,
			  long baseTarget, Long nextBlockId, int height, Long id)
			throws NxtException.ValidationException {
		this(version, timestamp, previousBlockId, totalAmountNQT, totalFeeNQT, payloadLength, payloadHash,
				generatorPublicKey, generationSignature, blockSignature, previousBlockHash, transactions);
		this.cumulativeDifficulty = cumulativeDifficulty;
		this.baseTarget = baseTarget;
		this.nextBlockId = nextBlockId;
		this.height = height;
		this.id = id;
	}
	*/

	this.GetVersion = function() {
		return Version;
	}

	this.GetTimestamp = function() {
		return Timestamp;
	}

	this.GetPreviousBlockId = function() {
		return PreviousBlockId;
	}

	this.GetGeneratorPublicKey = function() {
		return GeneratorPublicKey;
	}

	this.GetPreviousBlockHash = function() {
		return PreviousBlockHash;
	}

	this.GetTotalAmountMilliLm = function() {
		return TotalAmountMilliLm;
	}

	this.getTotalFeeMilliLm = function() {
		return TotalFeeMilliLm;
	}

	this.GetPayloadLength = function() {
		return PayloadLength;
	}

	this.GetTransactionIds = function() {
		return TransactionIds;
	}

	/*
	public byte[] getPayloadHash() {
		return payloadHash;
	}

	public byte[] getGenerationSignature() {
		return generationSignature;
	}

	public byte[] getBlockSignature() {
		return blockSignature;
	}

	public List<TransactionImpl> getTransactions() {
		return blockTransactions;
	}

	public long getBaseTarget() {
		return baseTarget;
	}

	public BigInteger getCumulativeDifficulty() {
		return cumulativeDifficulty;
	}

	public Long getNextBlockId() {
		return nextBlockId;
	}

	public int getHeight() {
		if (height == -1) {
			throw new IllegalStateException("Block height not yet set");
		}
		return height;
	}

	public Long getId() {
		if (id == null) {
			if (blockSignature == null) {
				throw new IllegalStateException("Block is not signed yet");
			}
			byte[] hash = Crypto.sha256().digest(getBytes());
			BigInteger bigInteger = new BigInteger(1, new byte[] {hash[7], hash[6], hash[5], hash[4], hash[3], hash[2], hash[1], hash[0]});
			id = bigInteger.longValue();
			stringId = bigInteger.toString();
		}
		return id;
	}

	public String getStringId() {
		if (stringId == null) {
			getId();
			if (stringId == null) {
				stringId = Convert.toUnsignedLong(id);
			}
		}
		return stringId;
	}

	public Long getGeneratorId() {
		if (generatorId == null) {
			generatorId = Account.getId(generatorPublicKey);
		}
		return generatorId;
	}

	public boolean equals(Object o) {
		return o instanceof BlockImpl && this.getId().equals(((BlockImpl)o).getId());
	}

	public int hashCode() {
		return getId().hashCode();
	}

	public JSONObject getJSONObject() {
		JSONObject json = new JSONObject();
		json.put("version", version);
		json.put("timestamp", timestamp);
		json.put("previousBlock", Convert.toUnsignedLong(previousBlockId));
		json.put("totalAmountNQT", totalAmountNQT);
		json.put("totalFeeNQT", totalFeeNQT);
		json.put("payloadLength", payloadLength);
		json.put("payloadHash", Convert.toHexString(payloadHash));
		json.put("generatorPublicKey", Convert.toHexString(generatorPublicKey));
		json.put("generationSignature", Convert.toHexString(generationSignature));
		if (version > 1) {
			json.put("previousBlockHash", Convert.toHexString(previousBlockHash));
		}
		json.put("blockSignature", Convert.toHexString(blockSignature));
		JSONArray transactionsData = new JSONArray();
		for (Transaction transaction : blockTransactions) {
			transactionsData.add(transaction.getJSONObject());
		}
		json.put("transactions", transactionsData);
		return json;
	}

	byte[] getBytes() {

		ByteBuffer buffer = ByteBuffer.allocate(4 + 4 + 8 + 4 + (version < 3 ? (4 + 4) : (8 + 8)) + 4 + 32 + 32 + (32 + 32) + 64);
		buffer.order(ByteOrder.LITTLE_ENDIAN);
		buffer.putInt(version);
		buffer.putInt(timestamp);
		buffer.putLong(Convert.nullToZero(previousBlockId));
		buffer.putInt(blockTransactions.size());
		if (version < 3) {
			buffer.putInt((int)(totalAmountNQT / Constants.ONE_NXT));
			buffer.putInt((int)(totalFeeNQT / Constants.ONE_NXT));
		} else {
			buffer.putLong(totalAmountNQT);
			buffer.putLong(totalFeeNQT);
		}
		buffer.putInt(payloadLength);
		buffer.put(payloadHash);
		buffer.put(generatorPublicKey);
		buffer.put(generationSignature);
		if (version > 1) {
			buffer.put(previousBlockHash);
		}
		buffer.put(blockSignature);
		return buffer.array();
	}

	void sign(String secretPhrase) {
		if (blockSignature != null) {
			throw new IllegalStateException("Block already signed");
		}
		blockSignature = new byte[64];
		byte[] data = getBytes();
		byte[] data2 = new byte[data.length - 64];
		System.arraycopy(data, 0, data2, 0, data2.length);
		blockSignature = Crypto.sign(data2, secretPhrase);
	}

	boolean verifyBlockSignature() {

		Account account = Account.getAccount(getGeneratorId());
		if (account == null) {
			return false;
		}

		byte[] data = getBytes();
		byte[] data2 = new byte[data.length - 64];
		System.arraycopy(data, 0, data2, 0, data2.length);

		return Crypto.verify(blockSignature, data2, generatorPublicKey, version >= 3) && account.setOrVerify(generatorPublicKey, this.height);

	}

	boolean verifyGenerationSignature() throws BlockchainProcessor.BlockOutOfOrderException {

		try {

			BlockImpl previousBlock = (BlockImpl)Nxt.getBlockchain().getBlock(this.previousBlockId);
			if (previousBlock == null) {
				throw new BlockchainProcessor.BlockOutOfOrderException("Can't verify signature because previous block is missing");
			}

			if (version == 1 && !Crypto.verify(generationSignature, previousBlock.generationSignature, generatorPublicKey, version >= 3)) {
				return false;
			}

			Account account = Account.getAccount(getGeneratorId());
			long effectiveBalance = account == null ? 0 : account.getEffectiveBalanceNXT();
			if (effectiveBalance <= 0) {
				return false;
			}

			int elapsedTime = timestamp - previousBlock.timestamp;
			BigInteger target = BigInteger.valueOf(Nxt.getBlockchain().getLastBlock().getBaseTarget())
					.multiply(BigInteger.valueOf(effectiveBalance))
					.multiply(BigInteger.valueOf(elapsedTime));

			MessageDigest digest = Crypto.sha256();
			byte[] generationSignatureHash;
			if (version == 1) {
				generationSignatureHash = digest.digest(generationSignature);
			} else {
				digest.update(previousBlock.generationSignature);
				generationSignatureHash = digest.digest(generatorPublicKey);
				if (!Arrays.equals(generationSignature, generationSignatureHash)) {
					return false;
				}
			}

			BigInteger hit = new BigInteger(1, new byte[] {generationSignatureHash[7], generationSignatureHash[6], generationSignatureHash[5], generationSignatureHash[4], generationSignatureHash[3], generationSignatureHash[2], generationSignatureHash[1], generationSignatureHash[0]});

			return hit.compareTo(target) < 0;

		} catch (RuntimeException e) {

			Logger.logMessage("Error verifying block generation signature", e);
			return false;

		}

	}

	void apply() {
		Account generatorAccount = Account.addOrGetAccount(getGeneratorId());
		generatorAccount.apply(generatorPublicKey, this.height);
		generatorAccount.addToBalanceAndUnconfirmedBalanceNQT(totalFeeNQT);
		generatorAccount.addToForgedBalanceNQT(totalFeeNQT);
	}

	void undo() {
		Account generatorAccount = Account.getAccount(getGeneratorId());
		generatorAccount.undo(getHeight());
		generatorAccount.addToBalanceAndUnconfirmedBalanceNQT(-totalFeeNQT);
		generatorAccount.addToForgedBalanceNQT(-totalFeeNQT);
	}

	void setPrevious(BlockImpl previousBlock) {
		if (previousBlock != null) {
			if (! previousBlock.getId().equals(getPreviousBlockId())) {
				// shouldn't happen as previous id is already verified, but just in case
				throw new IllegalStateException("Previous block id doesn't match");
			}
			this.height = previousBlock.getHeight() + 1;
			this.calculateBaseTarget(previousBlock);
		} else {
			this.height = 0;
		}
		for (TransactionImpl transaction : blockTransactions) {
			transaction.setBlock(this);
		}
	}

	private void calculateBaseTarget(BlockImpl previousBlock) {

		if (this.getId().equals(Genesis.GENESIS_BLOCK_ID) && previousBlockId == null) {
			baseTarget = Constants.INITIAL_BASE_TARGET;
			cumulativeDifficulty = BigInteger.ZERO;
		} else {
			long curBaseTarget = previousBlock.baseTarget;
			long newBaseTarget = BigInteger.valueOf(curBaseTarget)
					.multiply(BigInteger.valueOf(this.timestamp - previousBlock.timestamp))
					.divide(BigInteger.valueOf(60)).longValue();
			if (newBaseTarget < 0 || newBaseTarget > Constants.MAX_BASE_TARGET) {
				newBaseTarget = Constants.MAX_BASE_TARGET;
			}
			if (newBaseTarget < curBaseTarget / 2) {
				newBaseTarget = curBaseTarget / 2;
			}
			if (newBaseTarget == 0) {
				newBaseTarget = 1;
			}
			long twofoldCurBaseTarget = curBaseTarget * 2;
			if (twofoldCurBaseTarget < 0) {
				twofoldCurBaseTarget = Constants.MAX_BASE_TARGET;
			}
			if (newBaseTarget > twofoldCurBaseTarget) {
				newBaseTarget = twofoldCurBaseTarget;
			}
			baseTarget = newBaseTarget;
			cumulativeDifficulty = previousBlock.cumulativeDifficulty.add(Convert.two64.divide(BigInteger.valueOf(baseTarget)));
		}
	}
	*/
}

module.exports = LmBlock;
