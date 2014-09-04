/**!
 * LibreMoney Transaction 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

/*
import nxt.crypto.Crypto;
import nxt.util.Convert;
import org.json.simple.JSONObject;
*/

var Accounts = require(__dirname + '/../Util/Accounts');
var Arrays = require(__dirname + '/../Util/Arrays');
var Blockchain = require(__dirname + '/../Blockchain');
var Blocks = require(__dirname + '/../Blocks');
var ByteBuffer = require(__dirname + '/../Util/ByteBuffer');
var Convert = require(__dirname + '/../Util/Convert');
var Genesis = require(__dirname + '/../Genesis');
var Logger = require(__dirname + '/../Logger').GetLogger(module);


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
function Transaction(builder) { /*data*/
	if (builder.senderPublicKey == null || typeof builder.senderPublicKey != 'object' || typeof builder.senderPublicKey.length == 'undefined')
		throw new Error('Transaction: builder.senderPublicKey mast be array');

	this.timestamp = builder.timestamp;
	this.deadline = builder.deadline;
	this.senderPublicKey = builder.senderPublicKey;
	this.recipientId = builder.recipientId;
	this.amountMilliLm = builder.amountMilliLm;
	this.feeMilliLm = builder.feeMilliLm;
	this.referencedTransactionFullHash = builder.referencedTransactionFullHash;
	this.signature = builder.signature;
	this.type = builder.type;
	this.version = builder.version;
	this.blockId = builder.blockId;
	this.height = builder.height;
	this.id = builder.id;
	this.senderId = builder.senderId;
	this.blockTimestamp = builder.blockTimestamp;
	this.fullHash = builder.fullHash;
	this.ecBlockHeight = builder.ecBlockHeight;
	this.ecBlockId = builder.ecBlockId;

	var list = new Array();
	if ((this.attachment = builder.attachment) != null) {
		list.add(this.attachment);
	}
	if ((this.message  = builder.message) != null) {
		list.add(this.message);
	}
	if ((this.encryptedMessage = builder.encryptedMessage) != null) {
		list.add(this.encryptedMessage);
	}
	if ((this.publicKeyAnnouncement = builder.publicKeyAnnouncement) != null) {
		list.add(this.publicKeyAnnouncement);
	}
	if ((this.encryptToSelfMessage = builder.encryptToSelfMessage) != null) {
		list.add(this.encryptToSelfMessage);
	}
	this.appendages = Collections.unmodifiableList(list);
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

function Apply() {
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
function ApplyUnconfirmed() {
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

function CompareTo(o) {
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

function Equals(o) {
	throw new Error('Not implementted');
	/*
	return o instanceof TransactionImpl && this.getId().equals(((Transaction)o).getId());
	*/
}

function GetAmountMilliLm() {
	return this.amountMilliLm;
}

function GetAppendages() {
	return this.appendages;
}

function GetAttachment() {
	return this.attachment;
}

function GetBlock() {
	if (this.block == null && this.blockId != null) {
		this.block = Blocks.FindBlock(this.blockId);
	}
	return this.block;
}

function GetBlockId() {
	return this.blockId;
}

function GetBlockTimestamp() {
	return this.blockTimestamp;
}

function GetBytes() {
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

function GetDeadline() {
	return this.deadline;
}

function GetECBlockHeight() {
	return this.ecBlockHeight;
}

function GetECBlockId() {
	return this.ecBlockId;
}

function GetEncryptedMessage() {
	return this.encryptedMessage;
}

function GetEncryptToSelfMessage() {
	return this.encryptToSelfMessage;
}

function GetExpiration() {
	return this.timestamp + this.deadline * 60;
}

function GetFeeMilliLm() {
	return this.feeMilliLm;
}

function GetFlags() {
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

function GetFullHash() {
	if (this.fullHash == null) {
		GetId();
	}
	return this.fullHash;
}

function GetHeight() {
	return this.height;
}

function GetId() {
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

function GetJsonObject() {
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

function GetMessage() {
	return this.message;
}

function GetPublicKeyAnnouncement() {
	return this.publicKeyAnnouncement;
}

function GetRecipientId() {
	return this.recipientId;
}

function GetReferencedTransactionFullHash() {
	return this.referencedTransactionFullHash;
}

function GetSenderId() {
	if (this.senderId == null) {
		this.senderId = this.account.GetId(this.senderPublicKey);
	}
	return this.senderId;
}

function GetSenderPublicKey() {
	return this.senderPublicKey;
}

function GetSignature() {
	return this.signature;
}

function GetSize() {
	return this.SignatureOffset() + 64  + (4 + 4 + 8) + this.appendagesSize;
}

function GetStringId() {
	if (!this.stringId) {
		this.GetId();
		if (!this.stringId) {
			this.stringId = Convert.ToUnsignedLong(this.id);
		}
	}
	return this.stringId;
}

function GetTimestamp() {
	return this.timestamp;
}

// TransactionType
function GetType() {
	return this.type;
}

function GetUnsignedBytes() {
	throw new Error('Not implementted');
	/*
	return zeroSignature(getBytes());
	*/
}

function GetVersion() {
	return this.version;
}

function HashCode() {
	return this.GetId().HashCode();
}

function IsDuplicate(Duplicates) {
	return this.Type.IsDuplicate(this, Duplicates);
}

function SetBlock(block) {
	this.block = block;
	this.blockId = block.GetId();
	this.height = block.GetHeight();
	this.blockTimestamp = block.GetTimestamp();
}

function Sign(secretPhrase) {
	if (signature != null) {
		throw new Error("IllegalStateException: Transaction already signed");
	}
	signature = Crypto.Sign(GetBytes(), secretPhrase);
}

function SignatureOffset() {
	return 1 + 1 + 4 + 2 + 32 + 8 + 8 + 8 + 32;
}

// NOTE: when undo is called, lastBlock has already been set to the previous block
function Undo() {
	throw new Error('Not implementted');
	/*
	Account senderAccount = Account.getAccount(senderId);
	Account recipientAccount = Account.getAccount(recipientId);
	*/
}

function UndoUnconfirmed() {
	throw new Error('Not implementted');
	/*
	Account senderAccount = Account.getAccount(getSenderId());
	type.undoUnconfirmed(this, senderAccount);
	*/
}

function UnsetBlock() {
	this.block = null;
	this.blockId = null;
	this.blockTimestamp = -1;
	// must keep the height set, as transactions already having been included in a popped-off block before
	// get priority when sorted for inclusion in a new block
}

function Validate() {
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

function VerifySignature() {
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

function ZeroSignature(data) {
	throw new Error('Not implementted');
	/*
	int start = signatureOffset();
	for (int i = start; i < start + 64; i++) {
		data[i] = 0;
	}
	return data;
	*/
}


Transaction.prototype.Apply = Apply;
Transaction.prototype.ApplyUnconfirmed = ApplyUnconfirmed;
Transaction.prototype.CompareTo = CompareTo;
Transaction.prototype.Equals = Equals;
Transaction.prototype.GetAmountMilliLm = GetAmountMilliLm;
Transaction.prototype.GetAppendages = GetAppendages;
Transaction.prototype.GetAttachment = GetAttachment;
Transaction.prototype.GetBlock = GetBlock;
Transaction.prototype.GetBlockId = GetBlockId;
Transaction.prototype.GetBlockTimestamp = GetBlockTimestamp;
Transaction.prototype.GetBytes = GetBytes;
Transaction.prototype.GetDeadline = GetDeadline;
Transaction.prototype.GetEncryptedMessage = GetEncryptedMessage;
Transaction.prototype.GetEncryptToSelfMessage = GetEncryptToSelfMessage;
Transaction.prototype.GetExpiration = GetExpiration;
Transaction.prototype.GetFeeMilliLm = GetFeeMilliLm;
Transaction.prototype.GetFullHash = GetFullHash;
Transaction.prototype.GetHeight = GetHeight;
Transaction.prototype.GetId = GetId;
Transaction.prototype.GetJsonObject = GetJsonObject;
Transaction.prototype.GetMessage = GetMessage;
Transaction.prototype.GetRecipientId = GetRecipientId;
Transaction.prototype.GetReferencedTransactionFullHash = GetReferencedTransactionFullHash;
Transaction.prototype.GetStringId = GetStringId;
Transaction.prototype.GetSenderId = GetSenderId;
Transaction.prototype.GetSenderPublicKey = GetSenderPublicKey;
Transaction.prototype.GetSignature = GetSignature;
Transaction.prototype.GetSize = GetSize;
Transaction.prototype.GetTimestamp = GetTimestamp
Transaction.prototype.GetType = GetType;
Transaction.prototype.GetUnsignedBytes = GetUnsignedBytes;
Transaction.prototype.GetVersion = GetVersion;
Transaction.prototype.HashCode = HashCode;
Transaction.prototype.IsDuplicate = IsDuplicate;
Transaction.prototype.SetBlock = SetBlock;
Transaction.prototype.SignatureOffset = SignatureOffset;
Transaction.prototype.Sign = Sign;
Transaction.prototype.Undo = Undo;
Transaction.prototype.UndoUnconfirmed = UndoUnconfirmed;
Transaction.prototype.UpdateTotals = UpdateTotals;
Transaction.prototype.Validate = Validate;
Transaction.prototype.VerifySignature = VerifySignature;


module.exports = Transaction;
