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
amountMilliLm,
feeMilliLm,
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
	if (data.senderPublicKey == null || typeof data.senderPublicKey != 'object' || typeof data.senderPublicKey.length == 'undefined')
		throw new Error('Transaction: data.senderPublicKey mast be array');

	this.timestamp = data.timestamp;
	this.deadline = data.deadline;
	this.senderPublicKey = data.senderPublicKey;
	this.recipientId = data.recipientId;
	this.amountMilliLm = data.amountMilliLm;
	this.feeMilliLm = data.feeMilliLm;
	this.referencedTransactionFullHash = data.referencedTransactionFullHash;
	this.signature = data.signature;
	this.type = data.type;
	this.version = data.version;
	this.blockId = data.blockId;
	this.height = data.height;
	this.id = data.id;
	this.senderId = data.senderId;
	this.blockTimestamp = data.blockTimestamp;
	this.fullHash = data.fullHash;
	this.ecBlockHeight = data.ecBlockHeight;
	this.ecBlockId = data.ecBlockId;

	var list = new Array();
	if ((this.attachment = data.attachment) != null) {
		list.add(this.attachment);
	}
	if ((this.message  = data.message) != null) {
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

	/*
	private final int ecBlockHeight;
	private final Long ecBlockId;
	private final byte version;
	private final int timestamp;
	private final Attachment.AbstractAttachment attachment;
	private final Appendix.Message message;
	private final Appendix.EncryptedMessage encryptedMessage;
	private final Appendix.EncryptToSelfMessage encryptToSelfMessage;
	private final Appendix.PublicKeyAnnouncement publicKeyAnnouncement;
	private final List<? extends Appendix.AbstractAppendix> appendages;
	private final int appendagesSize;
	private volatile int height = Integer.MAX_VALUE;
	private volatile Long blockId;
	private volatile int blockTimestamp = -1;
	*/

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
		if (this.recipientId != null || this.GetAmountMilliLm() != 0) {
			throw new Error("Transactions of this type must have recipient == Genesis, amount == 0");
		}
	}

	for (var appendage in this.appendages) {
		if (!appendage.VerifyVersion(this.version)) {
			throw new Error("Invalid attachment version " + appendage.GetVersion() +
					" for transaction version " + this.version);
		}
	}

	return this;
}

Transaction.prototype.Apply = function() {
	throw new Error('Not implementted');
	/*
	Account senderAccount = Account.getAccount(getSenderId());
	senderAccount.apply(senderPublicKey, this.getHeight());
	Account recipientAccount = Account.getAccount(recipientId);
	if (recipientAccount == null && recipientId != null) {
		recipientAccount = Account.addOrGetAccount(recipientId);
	}
	for (Appendix.AbstractAppendix appendage : appendages) {
		appendage.apply(this, senderAccount, recipientAccount);
	}
	*/
}

// returns false iff double spending
Transaction.prototype.ApplyUnconfirmed = function() {
	throw new Error('Not implementted');
	/*
	Account senderAccount = Account.getAccount(getSenderId());
	if (senderAccount == null) {
		return false;
	}
	synchronized(senderAccount) {
		return type.applyUnconfirmed(this, senderAccount);
	}
	*/
}

Transaction.prototype.CompareTo = function(o) {
	throw new Error('Not implementted');
	/*
	if (height < o.getHeight()) {
		return -1;
	}
	if (height > o.getHeight()) {
		return 1;
	}
	// equivalent to: fee * 1048576L / getSize() > o.fee * 1048576L / o.getSize()
	if (Convert.safeMultiply(feeNQT, ((TransactionImpl)o).getSize()) > Convert.safeMultiply(o.getFeeNQT(), getSize())) {
		return -1;
	}
	if (Convert.safeMultiply(feeNQT, ((TransactionImpl)o).getSize()) < Convert.safeMultiply(o.getFeeNQT(), getSize())) {
		return 1;
	}
	if (timestamp < o.getTimestamp()) {
		return -1;
	}
	if (timestamp > o.getTimestamp()) {
		return 1;
	}
	if (getId() < o.getId()) {
		return -1;
	}
	if (getId() > o.getId()) {
		return 1;
	}
	return 0;
	*/
}

Transaction.prototype.Equals = function(o) {
	throw new Error('Not implementted');
	/*
	return o instanceof TransactionImpl && this.getId().equals(((Transaction)o).getId());
	*/
}

Transaction.prototype.GetAmountMilliLm = function() {
	return this.amountMilliLm;
}

Transaction.prototype.GetAppendages = function() {
	return this.appendages;
}

Transaction.prototype.GetAttachment = function() {
	return this.attachment;
}

Transaction.prototype.GetBlock = function(callback) {
	var tr = this;
	if (tr.block == null && tr.blockId != null) {
		Blocks.FindBlock(this.blockId, function(err, block) {
			if (err) {
				callback(err);
				return;
			}
			tr.block = block;
			callback(null, block);
		});
	} else {
		callback(null, tr.block);
	}
}

Transaction.prototype.GetBlockId = function() {
	return this.blockId;
}

Transaction.prototype.GetBlockTimestamp = function() {
	return this.blockTimestamp;
}

Transaction.prototype.GetBytes = function() {
	var buffer = new ByteBuffer();
	buffer.littleEndian();
	buffer.byte(this.type.GetType());
	buffer.byte(this.type.GetSubtype()); //((version << 4) | type.getSubtype()));
	buffer.int32(this.timestamp);
	buffer.short(this.deadline);
	buffer.byteArray(this.senderPublicKey, this.senderPublicKey.length);
	var aa = this.type.HasRecipient() ? Convert.NullToZero(this.recipientId) : Genesis.CREATOR_ID;
	buffer.int64(aa);
	buffer.int64(this.amountMilliLm);
	buffer.int64(this.feeMilliLm);
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
}

Transaction.prototype.GetFeeMilliLm = function() {
	return this.feeMilliLm;
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

Transaction.prototype.GetHeight = function() {
	return this.height;
}

Transaction.prototype.GetId = function() {
	if (!this.id) {
		if (!this.signature) {
			Logger.error("GetId: Transaction is not signed yet");
			return false;
		}
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
	}
	return this.id;
}

Transaction.prototype.GetJsonObject = function() {
	throw new Error('Not implementted');
	/*
	JSONObject json = new JSONObject();
	json.put("type", type.getType());
	json.put("subtype", type.getSubtype());
	json.put("timestamp", timestamp);
	json.put("deadline", deadline);
	json.put("senderPublicKey", Convert.toHexString(senderPublicKey));
	if (type.hasRecipient()) {
		json.put("recipient", Convert.toUnsignedLong(recipientId));
	}
	json.put("amountNQT", amountNQT);
	json.put("feeNQT", feeNQT);
	if (referencedTransactionFullHash != null) {
		json.put("referencedTransactionFullHash", referencedTransactionFullHash);
	}
	json.put("ecBlockHeight", ecBlockHeight);
	json.put("ecBlockId", Convert.toUnsignedLong(ecBlockId));
	json.put("signature", Convert.toHexString(signature));
	JSONObject attachmentJSON = new JSONObject();
	for (Appendix appendage : appendages) {
		attachmentJSON.putAll(appendage.getJSONObject());
	}
	if (! attachmentJSON.isEmpty()) {
		json.put("attachment", attachmentJSON);
	}
	json.put("version", version);
	return json;
	*/
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
		this.senderId = this.account.GetId(this.senderPublicKey);
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
	return this.SignatureOffset() + 64  + (4 + 4 + 8) + this.appendagesSize;
}

Transaction.prototype.GetStringId = function() {
	if (!this.stringId) {
		this.GetId();
		if (!this.stringId) {
			this.stringId = Convert.ToUnsignedLong(this.id);
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
	return this.GetId().HashCode();
}

Transaction.prototype.IsDuplicate = function(Duplicates) {
	return this.Type.IsDuplicate(this, Duplicates);
}

Transaction.prototype.SetBlock = function(block) {
	this.block = block;
	this.blockId = block.GetId();
	this.height = block.GetHeight();
	this.blockTimestamp = block.GetTimestamp();
}

Transaction.prototype.Sign = function(secretPhrase) {
	if (signature != null) {
		throw new Error("IllegalStateException: Transaction already signed");
	}
	signature = Crypto.Sign(GetBytes(), secretPhrase);
}

Transaction.prototype.SignatureOffset = function() {
	return 1 + 1 + 4 + 2 + 32 + 8 + 8 + 8 + 32;
}

// NOTE: when undo is called, lastBlock has already been set to the previous block
Transaction.prototype.Undo = function() {
	throw new Error('Not implementted');
	/*
	Account senderAccount = Account.getAccount(senderId);
	Account recipientAccount = Account.getAccount(recipientId);
	*/
}

Transaction.prototype.UndoUnconfirmed = function() {
	throw new Error('Not implementted');
	/*
	Account senderAccount = Account.getAccount(getSenderId());
	type.undoUnconfirmed(this, senderAccount);
	*/
}

Transaction.prototype.UnsetBlock = function() {
	this.block = null;
	this.blockId = null;
	this.blockTimestamp = -1;
	// must keep the height set, as transactions already having been included in a popped-off block before
	// get priority when sorted for inclusion in a new block
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
