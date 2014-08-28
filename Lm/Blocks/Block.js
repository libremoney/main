/**!
 * LibreMoney Block 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var Accounts = require(__dirname + '/../Accounts');
var BigInteger = require(__dirname + '/../Util/BigInteger');
var ByteBuffer = require(__dirname + '/../Util/ByteBuffer');
var Constants = require(__dirname + '/../Constants');
var Convert = require(__dirname + '/../Util/Convert');
var Crypto = require(__dirname + '/../Crypto/Crypto');
var Logger = require(__dirname + '/../Logger').GetLogger(module);


/*
version, timestamp, previousBlockId, totalAmountMilliLm, totalFeeMilliLm, payloadLength, payloadHash,
generatorPublicKey, generationSignature, blockSignature, previousBlockHash, transactions,
cumulativeDifficulty, baseTarget, nextBlockId, height, id
*/
function Block(data) {
	if (!data.version || data.version < 1)
		data.version = 1;
	this.version = data.version;
	this.timestamp = data.timestamp;
	this.previousBlockId = data.previousBlockId;
	this.generatorPublicKey = data.generatorPublicKey;
	this.previousBlockHash = data.previousBlockHash;
	this.totalAmountMilliLm = data.totalAmountMilliLm;
	this.totalFeeMilliLm = data.totalFeeMilliLm;
	this.payloadLength = data.payloadLength;
	this.generationSignature = data.generationSignature;
	this.payloadHash = data.payloadHash;
	this.transactionIds = [];
	this.blockTransactions = data.transactions; //Collections.unmodifiableList(transactions);
	this.blockSignature = data.blockSignature;
	this.nextBlockId = data.nextBlockId;
	this.id = data.id;
	this.stringId = null;
	this.generatorId;

	if (data.cumulativeDifficulty)
		this.cumulativeDifficulty = data.cumulativeDifficulty
	else {
		this.cumulativeDifficulty = BigInteger.zero;
	}

	if (data.baseTarget)
		this.baseTarget = data.baseTarget
	else
		this.baseTarget = Constants.InitialBaseTarget;

	if (data.height)
		this.height = data.height
	else
		this.height = -1;

	if (data.transactions.length > Constants.MaxNumberOfTransactions) {
		throw new Error("ValidationException: attempted to create a block with " + data.transactions.length + " transactions");
	}

	if (data.payloadLength > Constants.MaxPayloadLength || data.payloadLength < 0) {
		throw new Error("ValidationException: attempted to create a block with payloadLength " + data.payloadLength);
	}

	var previousId = Constants.MinInt;
	for (var i = 0; i < this.blockTransactions.length; i++ ) {
		var tr = this.blockTransactions[i];
		if (tr.GetId() < previousId) {
			throw new Error("ValidationException: Block transactions are not sorted!");
		}
		this.transactionIds.push(tr.GetId());
		previousId = tr.GetId();
	}
	//this.transactionIds = Collections.unmodifiableList(transactionIds);
	return this;
}

function Apply() {
	throw new Error('Not implementted');
	/*
	Account generatorAccount = Account.addOrGetAccount(getGeneratorId());
	generatorAccount.apply(generatorPublicKey, this.height);
	generatorAccount.addToBalanceAndUnconfirmedBalanceNQT(totalFeeNQT);
	generatorAccount.addToForgedBalanceNQT(totalFeeNQT);
	*/
}

function CalculateBaseTarget(previousBlock) {
	throw new Error('Not implementted');
	/*
	if (this.getId().equals(Genesis.GENESIS_BLOCK_ID) && previousBlockId == null) {
		baseTarget = Constants.InitialBaseTarget;
		cumulativeDifficulty = BigInteger.zero;
	} else {
		long curBaseTarget = previousBlock.baseTarget;
		long newBaseTarget = BigInteger.valueOf(curBaseTarget)
				.multiply(BigInteger.valueOf(this.timestamp - previousBlock.timestamp))
				.divide(BigInteger.valueOf(60)).longValue();
		if (newBaseTarget < 0 || newBaseTarget > Constants.MaxBaseTarget) {
			newBaseTarget = Constants.MaxBaseTarget;
		}
		if (newBaseTarget < curBaseTarget / 2) {
			newBaseTarget = curBaseTarget / 2;
		}
		if (newBaseTarget == 0) {
			newBaseTarget = 1;
		}
		long twofoldCurBaseTarget = curBaseTarget * 2;
		if (twofoldCurBaseTarget < 0) {
			twofoldCurBaseTarget = Constants.MaxBaseTarget;
		}
		if (newBaseTarget > twofoldCurBaseTarget) {
			newBaseTarget = twofoldCurBaseTarget;
		}
		baseTarget = newBaseTarget;
		cumulativeDifficulty = previousBlock.cumulativeDifficulty.add(Convert.two64.divide(BigInteger.valueOf(baseTarget)));
	}
	*/
}

function Equals(o) {
	throw new Error('Not implementted');
	/*
	return o instanceof BlockImpl && this.getId().equals(((BlockImpl)o).getId());
	*/
}

function GetBaseTarget() {
	return this.baseTarget;
}

function GetBlockSignature() {
	return this.blockSignature;
}

function GetBytes() {
	var buffer = new ByteBuffer(); //ByteBuffer.allocate(4 + 4 + 8 + 4 + (8 + 8) + 4 + 32 + 32 + (32 + 32) + 64);
	buffer.littleEndian();
	buffer.int32(this.version);
	buffer.int32(this.timestamp);
	buffer.int64(Convert.NullToZero(this.previousBlockId));
	buffer.int32(this.blockTransactions.length);
	buffer.int64(this.totalAmountMilliLm);
	buffer.int64(this.totalFeeMilliLm);
	buffer.int32(this.payloadLength);
	/* TODO: Make - Prof1983
	buffer.byteArray(this.payloadHash);
	buffer.byteArray(this.generatorPublicKey);
	buffer.byteArray(this.generationSignature);
	buffer.byteArray(this.previousBlockHash);
	buffer.byteArray(this.blockSignature);
	*/
	return buffer.pack();
}

function GetCumulativeDifficulty() {
	return this.cumulativeDifficulty;
}

function GetGeneratorId() {
	if (!this.generatorId) {
		this.generatorId = Accounts.GetId(this.generatorPublicKey);
	}
	return this.generatorId;
}

function GetGeneratorPublicKey() {
	return this.generatorPublicKey;
}

function GetGenerationSignature() {
	return this.generationSignature;
}

function GetHeight() {
	if (this.height == -1) {
		throw new Error("Block height not yet set");
	}
	return this.height;
}

function GetId() {
	if (!this.id) {
		if (!this.blockSignature) {
			throw new Error("IllegalStateException: Block is not signed yet");
		}
		var hash = Crypto.Sha256().digest(this.GetBytes());
		var v = [hash[7], hash[6], hash[5], hash[4], hash[3], hash[2], hash[1], hash[0]];
		var bigInteger = new BigInteger(1, v);
		this.id = bigInteger.longValue();
		this.stringId = bigInteger.toString();
	}
	return this.id;
}

function GetJsonObject() {
	throw new Error('Not implementted');
	/*
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
	*/
}

function GetNextBlockId() {
	return this.nextBlockId;
}

function GetPayloadHash() {
	return this.payloadHash;
}

function GetPayloadLength() {
	return this.payloadLength;
}

function GetPreviousBlockHash() {
	return this.previousBlockHash;
}

function GetPreviousBlockId() {
	return this.previousBlockId;
}

function GetStringId() {
	throw new Error('Not implementted');
	/*
	if (stringId == null) {
		getId();
		if (stringId == null) {
			stringId = Convert.toUnsignedLong(id);
		}
	}
	return stringId;
	*/
}

function GetTimestamp() {
	return this.timestamp;
}

function GetTotalAmountMilliLm() {
	return this.totalAmountMilliLm;
}

function GetTotalFeeMilliLm() {
	return this.totalFeeMilliLm;
}

function GetTransactionIds() {
	return this.transactionIds;
}

function GetTransactions() {
	return this.blockTransactions;
}

function GetVersion() {
	return this.version;
}

function HashCode() {
	throw new Error('Not implementted');
	/*
	return getId().hashCode();
	*/
}

function SetPrevious(previousBlock) {
	if (previousBlock != null) {
		if (!previousBlock.GetId() == GetPreviousBlockId()) {
			// shouldn't happen as previous id is already verified, but just in case
			throw new Error("Previous block id doesn't match");
		}
		this.height = previousBlock.GetHeight() + 1;
		this.CalculateBaseTarget(previousBlock);
	} else {
		this.height = 0;
	}
	for (var i in this.blockTransactions) {
		transaction = this.blockTransactions[i];
		transaction.SetBlock(this);
	}
}

function Sign(secretPhrase) {
	throw new Error('Not implementted');
	/*
	if (blockSignature != null) {
		throw new IllegalStateException("Block already signed");
	}
	blockSignature = new byte[64];
	byte[] data = getBytes();
	byte[] data2 = new byte[data.length - 64];
	System.arraycopy(data, 0, data2, 0, data2.length);
	blockSignature = Crypto.sign(data2, secretPhrase);
	*/
}

function VerifyBlockSignature() {
	throw new Error('Not implementted');
	/*
	Account account = Account.getAccount(getGeneratorId());
	if (account == null) {
		return false;
	}

	byte[] data = getBytes();
	byte[] data2 = new byte[data.length - 64];
	System.arraycopy(data, 0, data2, 0, data2.length);

	return Crypto.verify(blockSignature, data2, generatorPublicKey, version >= 3) && account.setOrVerify(generatorPublicKey, this.height);
	*/
}

function VerifyGenerationSignature() {
	throw new Error('Not implementted');
	/*
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

		return Generator.verifyHit(hit, effectiveBalance, previousBlock, timestamp);

	} catch (RuntimeException e) {

		Logger.logMessage("Error verifying block generation signature", e);
		return false;
	}
	*/
}

function Undo() {
	throw new Error('Not implementted');
	/*
	Account generatorAccount = Account.getAccount(getGeneratorId());
	generatorAccount.undo(getHeight());
	generatorAccount.addToBalanceAndUnconfirmedBalanceNQT(-totalFeeNQT);
	generatorAccount.addToForgedBalanceNQT(-totalFeeNQT);
	*/
}


Block.prototype.Apply = Apply;
Block.prototype.CalculateBaseTarget = CalculateBaseTarget;
Block.prototype.GetBaseTarget = GetBaseTarget;
Block.prototype.GetBlockSignature = GetBlockSignature;
Block.prototype.GetBytes = GetBytes;
Block.prototype.GetCumulativeDifficulty = GetCumulativeDifficulty;
Block.prototype.GetHeight = GetHeight;
Block.prototype.GetGenerationSignature = GetGenerationSignature;
Block.prototype.GetGeneratorId = GetGeneratorId;
Block.prototype.GetGeneratorPublicKey = GetGeneratorPublicKey;
Block.prototype.GetId = GetId;
Block.prototype.GetJsonObject = GetJsonObject;
Block.prototype.GetNextBlockId = GetNextBlockId;
Block.prototype.GetPayloadHash = GetPayloadHash;
Block.prototype.GetPayloadLength = GetPayloadLength;
Block.prototype.SetPrevious = SetPrevious;
Block.prototype.GetPreviousBlockHash = GetPreviousBlockHash;
Block.prototype.GetPreviousBlockId = GetPreviousBlockId;
Block.prototype.GetStringId = GetStringId;
Block.prototype.GetTimestamp = GetTimestamp;
Block.prototype.GetTotalAmountMilliLm = GetTotalAmountMilliLm;
Block.prototype.GetTotalFeeMilliLm = GetTotalFeeMilliLm;
Block.prototype.GetTransactionIds = GetTransactionIds;
Block.prototype.GetTransactions = GetTransactions;
Block.prototype.GetVersion = GetVersion;
Block.prototype.Sign = Sign;
Block.prototype.VerifyBlockSignature = VerifyBlockSignature;
Block.prototype.VerifyGenerationSignature = VerifyGenerationSignature;
Block.prototype.Undo = Undo;


module.exports = Block;
