/**!
 * LibreMoney Block 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

if (typeof module !== "undefined") {
	var BigInteger = require(__dirname + '/../../Lib/Util/BigInteger');
	var Constants = require(__dirname + '/../../Lib/Constants');
	var Convert = require(__dirname + '/../../Lib/Util/Convert');
	var Crypto = require(__dirname + '/../../Lib/Crypto/Crypto');
	var Logger = require(__dirname + '/../../Lib/Util/Logger').GetLogger(module);
}


/*
version, timestamp, previousBlockId, totalAmount, totalFee, payloadLength, payloadHash,
generatorPublicKey, generationSignature, blockSignature, previousBlockHash, transactions,
cumulativeDifficulty, baseTarget, nextBlockId, height, id
*/
function Block(data) {
	if ("object" !== typeof data) {
		data = {}
	}
	this.version = data.version || null;
	this.timestamp = data.timestamp || null;
	this.previousBlockId = data.previousBlockId || 0;
	this.generatorPublicKey = data.generatorPublicKey || Config.NULL_HASH;
	this.previousBlockHash = data.previousBlockHash || Config.NULL_HASH;
	this.totalAmount = data.totalAmount || 0;
	this.totalFee = data.totalFee || 0;
	this.payloadLength = data.payloadLength || 0;
	this.generationSignature = data.generationSignature || Config.NULL_HASH;
	this.payloadHash = data.payloadHash || Config.NULL_HASH;
	this.transactionIds = data.transactionIds || [];
	this.blockTransactions = data.blockTransactions || [];
	this.blockSignature = data.blockSignature || null;
	this.cumulativeDifficulty = data.cumulativeDifficulty || BigInteger.zero; //new bigint("0");
	this.baseTarget = data.baseTarget || Constants.InitialBaseTarget; //Config.INITIAL_BASE_TARGET;
	this.nextBlockId = data.nextBlockId || null;
	this.height = typeof data.height !== "undefined" ? data.height : -1;
	this.id = data.id || null;
	this.stringId = data.stringId || null;
	this.generatorId = data.generatorId || null;
	this.confirmations = data.confirmations || 0;
	if (typeof this.previousBlockId == "string") {
		this.previousBlockId = Utils.stringToLong(this.previousBlockId)
	}
	if (typeof this.generatorPublicKey == "string") {
		this.generatorPublicKey = new Buffer(this.generatorPublicKey, "hex")
	}
	if (typeof this.previousBlockHash == "string") {
		this.previousBlockHash = new Buffer(this.previousBlockHash, "hex")
	}
	if (typeof this.generationSignature == "string") {
		this.generationSignature = new Buffer(this.generationSignature, "hex")
	}
	if (typeof this.payloadHash == "string") {
		this.payloadHash = new Buffer(this.payloadHash, "hex")
	}
	if (typeof this.blockSignature == "string") {
		this.blockSignature = new Buffer(this.blockSignature, "hex")
	}
	if (typeof this.nextBlockId == "string") {
		this.nextBlockId = Utils.stringToLong(this.nextBlockId)
	}
	if (typeof this.id == "string") {
		this.id = Utils.stringToLong(this.id)
	}
	if (typeof this.cumulativeDifficulty == "string") {
		this.cumulativeDifficulty = new bigint(this.cumulativeDifficulty)
	}

	// --

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

Block.prototype.AddConfirmedAndUnconfirmedAmounts = function() {
	for (var transactionId in this.blockTransactions) {
		if (this.blockTransactions.HasOwnProperty(transactionId) && transactionId != "count") {
			var tx = this.blockTransactions[transactionId];
			var recipientAccount = Accounts.AddOrGetAccount(tx.recipientId.toString());
			recipientAccount.AddToBalanceAndUnconfirmedBalance(Utils.RoundTo5Float(Utils.NullToNumber(tx.amount)));
			var senderAccount = Account.AddOrGetAccount(tx.GetSenderId().toString());
			senderAccount.AddToBalanceAndUnconfirmedBalance(-Utils.roundTo5Float(Utils.NullToNumber(tx.amount)) - Utils.RoundTo5Float(tx.fee));
		}
	}
	var _genereatorAccount = Accounts.AddOrGetAccount(this.generatorId.toString());
	_genereatorAccount.AddToBalanceAndUnconfirmedBalance(Utils.RoundTo5Float(this.totalFee));
}

Block.prototype.AddConfirmedAmounts = function() {
	for (var transactionId in this.blockTransactions) {
		if (this.blockTransactions.HasOwnProperty(transactionId) && transactionId != "count") {
			var tx = this.blockTransactions[transactionId];
			var recipientAccount = Account.AddOrGetAccount(tx.recipientId.toString());
			recipientAccount.AddToBalance(Utils.RoundTo5Float(Utils.NullToNumber(tx.amount)));
			var senderAccount = Account.AddOrGetAccount(tx.senderId.toString());
			senderAccount.AddToBalance(-Utils.RoundTo5Float(Utils.NullToNumber(tx.amount)) - Utils.RoundTo5Float(tx.fee));
		}
	}
	var _genereatorAccount = Account.AddOrGetAccount(this.generatorId.toString());
	_genereatorAccount.AddToBalance(Utils.RoundTo5Float(this.totalFee));
}

Block.prototype.AddUnconfirmedAmounts = function() {
	for (var transactionId in this.blockTransactions) {
		if (this.blockTransactions.HasOwnProperty(transactionId) && transactionId != "count") {
			var tx = this.blockTransactions[transactionId];
			var recipientAccount = Accounts.AddOrGetAccount(tx.recipientId.toString());
			recipientAccount.AddToUnconfirmedBalance(Utils.RoundTo5Float(Utils.NullToNumber(tx.amount)));
			var senderAccount = Accounts.AddOrGetAccount(tx.senderId.toString());
			senderAccount.AddToUnconfirmedBalance(-Utils.RoundTo5Float(Utils.NullToNumber(tx.amount)) - Utils.RoundTo5Float(tx.fee));
		}
	}
	var _genereatorAccount = Accounts.AddOrGetAccount(this.generatorId.toString());
	_genereatorAccount.AddToUnconfirmedBalance(Utils.RoundTo5Float(this.totalFee));
}

Block.prototype.AddUnconfirmedFee = function() {
	var _genereatorAccount = Accounts.AddOrGetAccount(this.generatorId.toString());
	_genereatorAccount.AddToUnconfirmedBalance(Utils.RoundTo5Float(this.totalFee));
}

Block.prototype.Apply = function() {
	var generatorAccount = Accounts.AddOrGetAccount(this.GetGeneratorId());
	generatorAccount.Apply(this.generatorPublicKey, this.height);
	generatorAccount.AddToBalanceAndUnconfirmedBalance(Utils.RoundTo5Float(this.totalFee))
	/*
	generatorAccount.addToForgedBalance(totalFee); // MilliLm
	*/
}

Block.prototype.CalculateBaseTarget = function(previousBlock) {
	if (this.GetId() == Genesis.genesisBlockId && this.previousBlockId == null) {
		this.baseTarget = Constants.InitialBaseTarget;
		this.cumulativeDifficulty = 0;
	} else {
		var curBaseTarget = previousBlock.baseTarget;
		var newBaseTarget = new bigint(curBaseTarget).multiply(this.timestamp - previousBlock.timestamp).divide(60);
		newBaseTarget = Utils.bigIntToLongBE(newBaseTarget);
		if (newBaseTarget < 0 || newBaseTarget > Constats.MaxBaseTarget) {
			newBaseTarget = Constants.MaxBaseTarget;
		}
		if (newBaseTarget < curBaseTarget / 2) {
			newBaseTarget = curBaseTarget / 2;
		}
		if (newBaseTarget == 0) {
			newBaseTarget = 1;
		}
		var twofoldCurBaseTarget = curBaseTarget * 2;
		if (twofoldCurBaseTarget < 0) {
			twofoldCurBaseTarget = Constants.MaxBaseTarget;
		}
		if (newBaseTarget > twofoldCurBaseTarget) {
			newBaseTarget = twofoldCurBaseTarget;
		}
		this.baseTarget = newBaseTarget;
		this.cumulativeDifficulty = previousBlock.cumulativeDifficulty.add(Config.two64.divide(this.baseTarget.toString()));
	}
}

Block.prototype.Equals = function(o) {
	throw new Error('Not implementted');
	/*
	return o instanceof BlockImpl && this.getId().equals(((BlockImpl)o).getId());
	*/
}

Block.prototype.GetBaseTarget = function() {
	return this.baseTarget;
}

Block.prototype.GetBlockSignature = function() {
	return this.blockSignature;
}

Block.prototype.GetBytes = function() {
	var self = this;
	var obj = {
		version: this.version,
		timestamp: this.timestamp,
		previousBlockId: this.previousBlockId.toString(),
		blockTransactions: this.blockTransactions.count,
		totalAmount: this.totalAmount,
		totalFee: this.totalFee,
		payloadLength: this.payloadLength,
		payloadHash: this.payloadHash,
		generatorPublicKey: this.generatorPublicKey,
		generationSignature: this.generationSignature,
		previousBlockHash: this.previousBlockHash
	};
	return JSON.stringify(obj)
}

Block.prototype.GetCumulativeDifficulty = function() {
	return this.cumulativeDifficulty;
}

Block.prototype.GetData = function() {
	return {
		version: this.version,
		timestamp: this.timestamp,
		previousBlockId: this.previousBlockId.toString(),
		totalAmount: this.totalAmount,
		totalFee: this.totalFee,
		payloadLength: this.payloadLength,
		payloadHash: this.payloadHash.toString("hex"),
		generatorPublicKey: this.generatorPublicKey.toString("hex"),
		generationSignature: this.generationSignature.toString("hex"),
		previousBlockHash: this.previousBlockHash.toString("hex"),
		blockSignature: this.blockSignature ? this.blockSignature.toString("hex") : null,

		cumulativeDifficulty: this.cumulativeDifficulty.toString(),
		baseTarget: this.baseTarget,
		nextBlockId: this.nextBlockId ? this.nextBlockId.toString() : null,
		height: this.height,
		id: this.id.toString(),
		stringId: this.stringId,
		generatorId: this.generatorId ? this.generatorId.toString() : null,
		confirmations: this.confirmations
	}
}

Block.prototype.GetDataWithTransactions = function() {
	var data = this.GetData();
	data.blockTransactions = this.GetTransactionsDataAsArray().slice(0);
	return data;
}

Block.prototype.GetGeneratorId = function() {
	if (!this.generatorId) {
		this.generatorId = Convert.GetAccountId(this.generatorPublicKey);
	}
	return this.generatorId;
}

Block.prototype.GetGeneratorPublicKey = function() {
	return this.generatorPublicKey;
}

Block.prototype.GetGenerationSignature = function() {
	return this.generationSignature;
}

Block.prototype.GetHeight = function() {
	if (this.height == -1) {
		throw new Error("Block height not yet set");
	}
	return this.height;
}

Block.prototype.GetId = function() {
	if (!this.id) {
		if (!this.blockSignature) {
			throw new Error("Block is not signed yet");
		}
		var hash = Crypto.Sha256(this.GetBytes());
		this.id = Utils.BufferToLongBE(hash);
		this.stringId = this.id.toString();
	}
	return this.id;
}

// deprecated
Block.prototype.GetJsonObject = function() {
	return GetData();
}

Block.prototype.GetNextBlockId = function() {
	return this.nextBlockId;
}

Block.prototype.GetPayloadHash = function() {
	return this.payloadHash;
}

Block.prototype.GetPayloadLength = function() {
	return this.payloadLength;
}

Block.prototype.GetPreviousBlockHash = function() {
	return this.previousBlockHash;
}

Block.prototype.GetPreviousBlockId = function() {
	return this.previousBlockId;
}

Block.prototype.GetStringId = function() {
	if (!this.stringId) {
		this.GetId();
		if (!this.stringId) {
			this.stringId = this.id.toString();
		}
	}
	return this.stringId;
}

Block.prototype.GetTimestamp = function() {
	return this.timestamp;
}

Block.prototype.GetTotalAmount = function() {
	return this.totalAmount;
}

// deprecated
Block.prototype.GetTotalAmountMilliLm = function() {
	return this.GetTotalAmount();
}

Block.prototype.GetTotalFee = function() {
	return this.totalFee;
}

// deprecated
Block.prototype.GetTotalFeeMilliLm = function() {
	return this.GetTotalFee();
}

Block.prototype.GetTransactionIds = function() {
	if (!this.transactionIds || this.transactionIds.length == 0) {
		this.transactionIds = [];
		for (var transactionId in this.blockTransactions) {
			var transaction;
			if (this.blockTransactions.HasOwnProperty(transactionId) && transactionId != "count") {
				transaction = this.blockTransactions[transactionId];
				this.transactionIds.push(transaction.id.toString());
			}
		}
	}
	return this.transactionIds;
}

Block.prototype.GetTransactions = function() {
	return this.blockTransactions;
}

Block.prototype.GetTransactionsAsArray = function() {
	var transactionsArr = [];
	for (var transactionId in this.blockTransactions) {
		if (this.blockTransactions.hasOwnProperty(transactionId) && transactionId != "count") {
			transactionsArr.push(this.blockTransactions[transactionId]);
		}
	}
	return transactionsArr;
}

Block.prototype.GetTransactionsDataAsArray = function() {
	var transactionsArr = [];
	for (var transactionId in this.blockTransactions) {
		if (this.blockTransactions.HasOwnProperty(transactionId) && transactionId != "count") {
			transactionsArr.push(this.blockTransactions[transactionId].GetData());
		}
	}
	return transactionsArr;
}

Block.prototype.GetVersion = function() {
	return this.version;
}

Block.prototype.HashCode = function() {
	var id = this.GetId();
	id.toString("16");
}

Block.prototype.RemoveUnconfirmedTxs = function(callback) {
	var txArr = this.GetTransactionsAsArray();
	UnconfirmedTransactions.DeleteTransactions(txArr, callback)
}

Block.prototype.SetPrevious = function(previousBlock) {
	if (previousBlock != null) {
		if (!previousBlock.getId() == this.previousBlockId) {
			// shouldn't happen as previous id is already verified, but just in case
			throw new Error("Previous block id doesn't match")
		}
		this.height = previousBlock.GetHeight() + 1;
		this.calculateBaseTarget(previousBlock)
	} else {
		this.height = 0
	}
	for (var i in this.blockTransactions) {
		transaction = this.blockTransactions[i];
		transaction.SetBlock(this);
		/*
		var transaction;
		if (this.blockTransactions.hasOwnProperty(transactionId) && transactionId != "count") {
			transaction = this.blockTransactions[transactionId];
			transaction.setBlock(this)
		}
		*/
	}
}

Block.prototype.Sign = function(secretPhrase) {
	if (this.blockSignature != null) {
		return this.blockSignature;
	}
	if (!secretPhrase instanceof Buffer) {
		secretPhrase = Curve.Sha256(secretPhrase);
	}
	this.blockSignature = Crypto.Sign(Curve.Sha256(this.GetBytes()).toString("hex"), secretPhrase.toString("hex"));
	return this.blockSignature;
}

Block.prototype.VerifyBlockSignature = function() {
	var account = Account.AddOrGetAccount(this.GetGeneratorId());
	if (!account) {
		return false;
	}
	var data = Curve.Sha256(this.GetBytes());
	var isSignVerified = Crypto.Verify(this.blockSignature.toString("hex"), data.toString("hex"), this.generatorPublicKey.toString("hex"));
	return isSignVerified && account.SetOrVerify(this.generatorPublicKey, this.height);
}

Block.prototype.VerifyGenerationSignature = function(__callback) {
	var self = this;
	BlockDb.FindBlock(this.previousBlockId.toString(), function(err, previousBlock) {
		if (err) {
			Logger.error("Error verifying block generation signature", e);
			if (typeof __callback === "function") {
				__callback(false);
			}
			return;
		}
		try {
			if (!previousBlock && self.height != 0) {
				__callback(false);
			}
			var isSignVerified = Crypto.Verify(self.generationSignature.toString("hex"), previousBlock.generationSignature.toString("hex"),
				self.generatorPublicKey.toString("hex"));
			if (self.version == 1 && !isSignVerified) {
				__callback(false);
			}
			var account = Accounts.GetAccount(self.GetGeneratorId());
			__callback(true);

			/*
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
			*/
		} catch (e) {
			Logger.error("Error verifying block generation signature", e);
			__callback(false);
		}
	});
}

Block.prototype.Undo = function() {
	throw new Error('Not implementted');
	/*
	Account generatorAccount = Account.getAccount(getGeneratorId());
	generatorAccount.undo(getHeight());
	generatorAccount.addToBalanceAndUnconfirmedBalance(-totalFee); // MilliLm
	generatorAccount.addToForgedBalance(-totalFee); // MilliLm
	*/
}


if (typeof module !== "undefined") {
	module.exports = Block;
}
