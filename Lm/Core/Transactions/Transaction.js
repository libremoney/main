/**!
 * LibreMoney Transaction 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

if (typeof module !== "undefined") {
	var Accounts = require(__dirname + '/../Accounts');
	var Arrays = require(__dirname + '/../../Lib/Util/Arrays');
	var Blockchain = require(__dirname + '/../Blockchain');
	var Blocks = require(__dirname + '/../Blocks');
	var ByteBuffer = require(__dirname + '/../../Lib/Util/ByteBuffer');
	var Convert = require(__dirname + '/../../Lib/Util/Convert');
	var Crypto = require(__dirname + '/../../Lib/Crypto/Crypto');
	var Genesis = require(__dirname + '/../Genesis');
	var Logger = require(__dirname + '/../../Lib/Util/Logger').GetLogger(module);
}


/*
type,
timestamp,
deadline,
senderPublicKey,
recipientId,
amount,
fee,
referencedTransactionFullHash,
signature,
blockId,
height,
id,
senderId,
blockTimestamp,
fullHash
*/
function Transaction(data) {
	if (typeof data !== "object") {
		data = {}
	}
	if (data.senderPublicKey == null || typeof data.senderPublicKey != 'object' || typeof data.senderPublicKey.length == 'undefined')
		throw new Error('Transaction: data.senderPublicKey mast be array');

	this.deadline = data.deadline || null;
	this.senderPublicKey = data.senderPublicKey || null;
	this.recipientId = data.recipientId || null;
	this.amount = data.amount || 0;
	this.fee = data.fee || null;
	this.referencedTransactionId = data.referencedTransactionId || null;
	this.type = typeof data.type !== "undefined" ? data.type : null;
	this.height = data.height || null;
	this.blockId = data.blockId || null;
	//this.block = data.block || null;
	this.signature = data.signature || null;
	this.timestamp = data.timestamp || null;
	//this.attachment = data.attachment || null;
	this.id = data.id || null;
	this.null = null;
	this.senderId = data.senderId || null;
	this.hash = data.hash || null;
	this.confirmations = data.confirmations || 0;

	this.version = data.version;
	this.blockTimestamp = data.blockTimestamp;
	this.fullHash = data.fullHash;
	this.ecBlockHeight = data.ecBlockHeight;
	this.ecBlockId = data.ecBlockId;

	if (typeof this.senderPublicKey == "string") {
		this.senderPublicKey = new Buffer(this.senderPublicKey, "hex")
	}
	if (typeof this.recipientId == "string") {
		this.recipientId = Utils.stringToLong(this.recipientId)
	}
	if (typeof this.referencedTransactionId == "string") {
		this.referencedTransactionId = Utils.stringToLong(this.referencedTransactionId)
	}
	if (typeof this.type == "string" || typeof this.type == "number") {
		this.type = TransactionType.findTransactionType(this.type, 0)
	}
	if (typeof this.blockId == "string") {
		this.blockId = Utils.stringToLong(this.blockId)
	}
	if (typeof this.signature == "string") {
		this.signature = new Buffer(this.signature, "hex")
	}
	if (typeof this.id == "string") {
		this.id = Utils.stringToLong(this.id)
	}
	if (typeof this.senderId == "string") {
		this.senderId = Utils.stringToLong(this.senderId)
	}
	if (typeof this.hash == "string") {
		this.hash = new Buffer(this.hash, "hex")
	}


	var list = {};
	if ((this.attachment = data.attachment) != null) {
		list.add(this.attachment);
	}
	if ((this.message = data.message) != null) {
		list.add(this.message);
	}
	if ((this.encryptedMessage = data.encryptedMessage) != null) {
		list.add(this.encryptedMessage);
	}
	if ((this.publicKeyAnnouncement = data.publicKeyAnnouncement) != null) {
		list.add(this.publicKeyAnnouncement);
	}
	if ((this.encryptToSelfMessage = data.encryptToSelfMessage) != null) {
		list.add(this.encryptToSelfMessage);
	}
	this.appendages = list; //Collections.unmodifiableList(list);
	var appendagesSize = 0;
	for (var appendage in this.appendages) {
		appendagesSize += appendage.GetSize();
	}
	this.appendagesSize = appendagesSize;

	if (typeof data.height == 'undefined')
		this.height = 2000000000 //Integer.MAX_VALUE
	else
		this.height = data.height;
	this.blockId = data.blockId;
	//this.Block =
	this.signature = data.signature;
	this.timestamp = parseInt(data.timestamp);
	if (typeof data.blockTimestamp == 'undefined')
		this.blockTimestamp = -1
	else
		this.blockTimestamp = data.blockTimestamp;
	//this.Attachment =
	this.id = data.id;
	this.stringId = null;
	this.senderId = data.senderId;
	this.fullHash = data.fullHash; // fullHash == null ? null : Convert.toHexString(fullHash);

	/*
	if ((timestamp == 0 && Arrays.equals(senderPublicKey, Genesis.CREATOR_PUBLIC_KEY))
			? (deadline != 0 || feeNQT != 0)
			: (deadline < 1 || feeNQT < Constants.ONE_NXT)
			|| feeNQT > Constants.MAX_BALANCE_NQT
			|| amountNQT < 0
			|| amountNQT > Constants.MAX_BALANCE_NQT
			|| type == null) {
		throw new NxtException.NotValidException("Invalid transaction parameters:\n type: " + type + ", timestamp: " + timestamp
				+ ", deadline: " + deadline + ", fee: " + feeNQT + ", amount: " + amountNQT);
	}
	*/

	if (this.attachment == null || type != this.attachment.GetTransactionType()) {
		throw new Error("Invalid attachment " + this.attachment + " for transaction of type " + this.type);
	}

	if (!this.type.HasRecipient()) {
		if (this.recipientId != null || this.GetAmount() != 0) {
			throw new Error("Transactions of this type must have recipient == Genesis, amount == 0");
		}
	}

	for (var i in this.appendages) {
		var appendage = appendages[i];
		if (!appendage.VerifyVersion(this.version)) {
			throw new Error("Invalid attachment version " + appendage.GetVersion() +
					" for transaction version " + this.version);
		}
	}

	return this;
}

Transaction.prototype.Apply = function() {
	var senderAccount = Accounts.GetAccount(this.GetSenderId());
	senderAccount.Apply(this.senderPublicKey, this.height);
	var recipientAccount = Accounts.GetAccount(this.recipientId);
	if (recipientAccount == null) {
		recipientAccount = Accounts.AddOrGetAccount(recipientId);
	}
	this.type.Apply(this, senderAccount, recipientAccount);
	/*
	for (Appendix.AbstractAppendix appendage : appendages) {
		appendage.apply(this, senderAccount, recipientAccount);
	}
	*/
}

// returns false iff double spending
Transaction.prototype.ApplyUnconfirmed = function() {
	var senderAccount = Account.getAccount(this.getSenderId());
	if (senderAccount == null) {
		return false;
	}
	return this.type.applyUnconfirmed(this, senderAccount);
}

Transaction.prototype.CompareTo = function(o) {
	if (this.height < o.height) {
		return -1;
	}
	if (this.height > o.height) {
		return 1;
	}
	//if (Convert.safeMultiply(feeNQT, ((TransactionImpl)o).getSize()) > Convert.safeMultiply(o.getFeeNQT(), getSize())) {
	if (Utils.NullToNumber(this.fee) * o.GetSize() > Utils.NullToNumber(o.fee) * this.GetSize() || this.fee === null && o.fee !== null) {
		return -1;
	}
	//if (Convert.safeMultiply(feeNQT, ((TransactionImpl)o).getSize()) < Convert.safeMultiply(o.getFeeNQT(), getSize())) {
	if (Utils.NullToNumber(this.fee) * o.GetSize() < Utils.NullToNumber(o.fee) * this.GetSize()) {
		return 1;
	}
	if (this.timestamp < o.timestamp) {
		return -1;
	}
	if (this.timestamp > o.timestamp) {
		return 1;
	}
	if (this.GetId() < o.GetId()) {
		return -1;
	}
	if (this.GetId() > o.GetId()) {
		return 1;
	}
	return 0;
}

Transaction.prototype.compareTo = function(o) {
}

Transaction.prototype.Equals = function(o) {
	throw new Error('Not implementted');
	/*
	return o instanceof TransactionImpl && this.getId().equals(((Transaction)o).getId());
	*/
}

// MilliLm
Transaction.prototype.GetAmount = function() {
	return this.amount;
}

Transaction.prototype.GetAppendages = function() {
	return this.appendages;
}

Transaction.prototype.GetAttachment = function() {
	return this.attachment;
}

Transaction.prototype.GetBlock = function(callback) {
	var self = this;
	if (self.block == null) {
		BlockDb.FindBlock(self.blockId, function(err, block) {
			if (err) {
				callback(err);
				return;
			}
			self.block = block;
			callback(null, block);
		});
	} else {
		callback(null, self.block);
	}
}

Transaction.prototype.GetBlockId = function() {
	return this.blockId;
}

Transaction.prototype.GetBlockTimestamp = function() {
	return this.blockTimestamp;
}

Transaction.prototype.GetBytes = function() {
	var self = this;

	var attachment = [];
	for (var i in this.appendages) {
		appendage = this.appendages[i];
		attachment.push(appendage.GetData());
	}

	var obj = {
		type: self.GetType(),
		subtype: self.GetSubtype(),
		timestamp: self.timestamp,
		deadline: self.deadline,
		senderPublicKey: self.senderPublicKey,
		recipientId: self.recipientId,
		amount: self.amount,
		fee: self.fee,
		referencedTransactionFullHash: self.referencedTransactionFullHash, //referencedTransactionId: self.referencedTransactionId
		signature: self.signature,
		flags: self.GetFlags(),
		ecBlockHeight: self.ecBlockHeight,
		ecBlockId: self.ecBlockId,
		attachment: attachment
	};
	return JSON.stringify(obj)
	/*
	var buffer = new ByteBuffer();
	buffer.littleEndian();
	buffer.byte(this.type.GetType());
	buffer.byte(this.type.GetSubtype()); //((version << 4) | type.getSubtype()));
	buffer.int32(this.timestamp);
	buffer.short(this.deadline);
	buffer.byteArray(this.senderPublicKey, this.senderPublicKey.length);
	var aa = this.type.HasRecipient() ? Convert.NullToZero(this.recipientId) : Genesis.CREATOR_ID;
	buffer.int64(aa);
	buffer.int64(this.amount);
	buffer.int64(this.fee);
	if (this.referencedTransactionFullHash != null) {
		var a = Convert.ParseHexString(this.referencedTransactionFullHash);
		buffer.byteArray(a, a.length);
	} else {
		a = new Array(32);
		for (var i = 0; a.length > i; i++) a[i] = 0;
		buffer.byteArray(a, a.length);
	}
	if (this.signature) {
		buffer.byteArray(this.signature, this.signature.length);
	} else {
		var a = new Array(64);
		for (var i = 0; a.length > i; i++) a[i] = 0;
		buffer.byteArray(a, a.length);
	}
	buffer.int32(this.GetFlags());
	buffer.int32(this.ecBlockHeight);
	buffer.int64(this.ecBlockId);
	for (var appendage in appendages) {
		buffer.byteArray(appendage);
	}
	return buffer.array();
	*/
}

Transaction.prototype.GetData = function() {
	var type = null;
	if (this.type) {
		type = this.type.GetType();
	}

	var attachment = {};
	for (var i in this.appendages) {
		appendage = this.appendages[i];
		attachment.push(appendage.GetData());
	}

	return {
		type: type,
		subtype: this.GetSubtype(),
		timestamp: this.timestamp,
		deadline: this.deadline,
		senderPublicKey: this.senderPublicKey.toString("hex"), // Convert.ToHexString(senderPublicKey)
		recipientId: this.recipientId.toString(),
		amount: this.amount,
		fee: this.fee,
		referencedTransactionFullHash: this.referencedTransactionFullHash,
		//referencedTransactionId: this.referencedTransactionId ? this.referencedTransactionId.toString() : this.referencedTransactionId,
		signature: this.signature ? this.signature.toString("hex") : null,
		ecBlockHeight: ecBlockHeight,
		ecBlockId: Convert.ToUnsignedLong(ecBlockId),
		attachment: attachment,

		version: this.version,
		height: this.height,
		blockId: this.blockId ? this.blockId.toString() : null,
		//attachment: this.attachment,
		id: this.GetId().toString(),
		"null": null,
		senderId: this.GetSenderId().toString(),
		hash: this.hash.toString("hex"),
		confirmations: this.confirmations
	}
}

Transaction.prototype.GetDeadline = function() {
	return this.deadline;
}

Transaction.prototype.GetECBlockHeight = function() {
	return this.ecBlockHeight;
}

Transaction.prototype.GetECBlockId = function() {
	return this.ecBlockId;
}

Transaction.prototype.GetEncryptedMessage = function() {
	return this.encryptedMessage;
}

Transaction.prototype.GetEncryptToSelfMessage = function() {
	return this.encryptToSelfMessage;
}

Transaction.prototype.GetExpiration = function() {
	return this.timestamp + this.deadline * 60;
	//return this.timestamp + this.deadline * 60 * 60 * 1e3
}

Transaction.prototype.GetFee = function() {
	return this.fee;
}

Transaction.prototype.GetFlags = function() {
	var flags = 0;
	var position = 1;
	if (this.message != null) {
		flags |= this.position;
	}
	position <<= 1;
	if (this.encryptedMessage != null) {
		flags |= position;
	}
	position <<= 1;
	if (this.publicKeyAnnouncement != null) {
		flags |= position;
	}
	position <<= 1;
	if (this.encryptToSelfMessage != null) {
		flags |= position;
	}
	return flags;
}

Transaction.prototype.GetFullHash = function() {
	if (this.fullHash == null) {
		GetId();
	}
	return this.fullHash;
}

Transaction.prototype.GetHash = function() {
	if (this.hash == null) {
		var data = this.GetBytes();
		var hash = curve.sha256(data);
		this.hash = hash.toString("hex");
	}
	return this.hash;
}

Transaction.prototype.GetHeight = function() {
	return this.height;
}

Transaction.prototype.GetId = function() {
	if (!this.id) {
		if (!this.signature) {
			Logger.error("GetId: Transaction is not signed yet");
			return false;
		}
		this.hash = curve.sha256(this.GetBytes());
		this.id = Utils.BufferToLongBE(this.hash);
		this.stringId = this.id.toString();
		this.fullHash = Convert.ToHexString(hash);
		/*
		var hash;
		var data = this.ZeroSignature(this.GetBytes());
		var signatureHash = Crypto.Sha256().digest(this.signature);
		var digest = Crypto.Sha256();
		digest.update(data);
		hash = digest.digest(signatureHash);
		var bigInteger = new BigInteger();
		bigInteger.fromByteArray([hash[7], hash[6], hash[5], hash[4], hash[3], hash[2], hash[1], hash[0]]);
		this.id = bigInteger.longValue();
		this.stringId = bigInteger.toString();
		this.fullHash = Convert.ToHexString(hash);
		*/
	}
	return this.id;
}

// deprecated
Transaction.prototype.GetJsonObject = function() {
	return this.GetData();
}

Transaction.prototype.GetMessage = function() {
	return this.message;
}

Transaction.prototype.GetPublicKeyAnnouncement = function() {
	return this.publicKeyAnnouncement;
}

Transaction.prototype.GetRecipientId = function() {
	return this.recipientId;
}

Transaction.prototype.GetReferencedTransactionFullHash = function() {
	return this.referencedTransactionFullHash;
}

Transaction.prototype.GetSenderId = function() {
	if (this.senderId == null) {
		this.senderId = Accounts.GetId(this.senderPublicKey);
	}
	return this.senderId;
}

Transaction.prototype.GetSenderPublicKey = function() {
	return this.senderPublicKey;
}

Transaction.prototype.GetSignature = function() {
	return this.signature;
}

Transaction.prototype.GetSize = function() {
	//TRANSACTION_BYTES_LENGTH = 1 + 1 + 4 + 2 + 32 + 8 + 4 + 4 + 8 + 64;
	return this.SignatureOffset() + 64 + (4 + 4 + 8) + this.appendagesSize;
	//return this.TRANSACTION_BYTES_LENGTH + (this.attachment == null ? 0 : this.attachment.getSize())
}

Transaction.prototype.GetStringId = function() {
	if (!this.stringId) {
		this.GetId();
		if (!this.stringId) {
			this.stringId = this.id.toString(); //Convert.ToUnsignedLong(this.id);
		}
	}
	return this.stringId;
}

Transaction.prototype.GetTimestamp = function() {
	return this.timestamp;
}

// TransactionType
Transaction.prototype.GetType = function() {
	return this.type;
}

Transaction.prototype.GetUnsignedBytes = function() {
	throw new Error('Not implementted');
	/*
	return zeroSignature(getBytes());
	*/
}

Transaction.prototype.GetVersion = function() {
	return this.version;
}

Transaction.prototype.HashCode = function() {
	var id = this.GetId();
	return id.toString("16");
	//return this.GetId().HashCode();
}

Transaction.prototype.IsDuplicate = function(Duplicates) {
	return this.type.IsDuplicate(this, Duplicates);
}

Transaction.prototype.SetBlock = function(block) {
	this.block = block;
	this.blockId = block.GetId();
	this.height = block.GetHeight();
	this.blockTimestamp = block.GetTimestamp();
}

Transaction.prototype.Sign = function(secretPhrase) {
	if (this.signature != null) {
		return this.signature;
	}
	console.log("Transaction sign", curve.sha256(this.GetBytes()));
	try {
		var i = 0;
		while (i < 100 && !this.Verify()) {
			this.timestamp++;
			i++;
			this.signature = Crypto.Sign(curve.sha256(this.GetBytes()).toString("hex"), secretPhrase.toString("hex"))
		}
		return this.signature;
	} catch (e) {
		console.log("Error signing transaction", e);
		return false;
	}
}

Transaction.prototype.SignatureOffset = function() {
	return 1 + 1 + 4 + 2 + 32 + 8 + 8 + 8 + 32;
}

// NOTE: when undo is called, lastBlock has already been set to the previous block
Transaction.prototype.Undo = function() {
	var senderAccount = Accounts.GetAccount(this.senderId);
	senderAccount.undo(this.height);
	var recipientAccount = Accounts.GetAccount(this.recipientId);
	this.type.Undo(this, senderAccount, recipientAccount); // ???
}

Transaction.prototype.UndoUnconfirmed = function() {
	var senderAccount = Accounts.GetAccount(this.GetSenderId());
	this.type.UndoUnconfirmed(this, senderAccount);
}

Transaction.prototype.UnsetBlock = function() {
	this.block = null;
	this.blockId = null;
	this.blockTimestamp = -1;
	// must keep the height set, as transactions already having been included in a popped-off block before
	// get priority when sorted for inclusion in a new block
}

Transaction.prototype.UpdateTotals = function(accumulatedAmounts, accumulatedAssetQuantities) {
	var senderId = this.GetSenderId();
	var accumulatedAmount = accumulatedAmounts === null || typeof accumulatedAmounts[senderId.toString()] === "undefined" ? null : accumulatedAmounts[senderId.toString()];
	if (accumulatedAmount == null) {
		accumulatedAmount = 0;
	}
	accumulatedAmounts[senderId.toString()] = Convert.RoundTo5Float(accumulatedAmount) + (Convert.RoundTo5Float(this.amount) + Convert.RoundTo5Float(this.fee));
	this.type.UpdateTotals(this, accumulatedAmounts, accumulatedAssetQuantities, accumulatedAmount);
}

Transaction.prototype.Validate = function() {
	if (Blockchain.GetHeight() >= Constants.PUBLIC_KEY_ANNOUNCEMENT_BLOCK && this.type.HasRecipient() && this.recipientId != null) {
		var recipientAccount = Accounts.GetAccount(this.recipientId);
		if ((recipientAccount == null || recipientAccount.GetPublicKey() == null) && this.publicKeyAnnouncement == null) {
			throw new Error("Recipient account does not have a public key, must attach a public key announcement");
		}
	}
	for (var appendage in appendages) {
		appendage.Validate(this);
	}
}

Transaction.prototype.ValidateAttachment = function() {
	return this.type.ValidateAttachment(this);
}

Transaction.prototype.Verify = function() {
	var account = Accounts.AddOrGetAccount(this.GetSenderId().toString());
	if (account == null) {
		return false;
	}
	var data = curve.sha256(this.GetBytes());
	console.log("Transaction data virify", data);
	var isSignVerified = Crypto.Verify(this.signature.toString("hex"), data.toString("hex"), this.senderPublicKey.toString("hex"));
	return isSignVerified && account.SetOrVerify(this.senderPublicKey, this.height);
}

Transaction.prototype.VerifySignature = function() {
	throw new Error('Not implementted');
	/*
	Account account = Account.getAccount(getSenderId());
	if (account == null) {
		return false;
	}
	if (signature == null) {
		return false;
	}
	byte[] data = zeroSignature(getBytes());
	return Crypto.verify(signature, data, senderPublicKey, true) && account.setOrVerify(senderPublicKey, this.getHeight());
	*/
}

Transaction.prototype.ZeroSignature = function(data) {
	throw new Error('Not implementted');
	/*
	int start = signatureOffset();
	for (int i = start; i < start + 64; i++) {
		data[i] = 0;
	}
	return data;
	*/
}


if (typeof module !== "undefined") {
	module.exports = Transaction;
}
