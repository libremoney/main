/**!
 * LibreMoney Transaction 0.0
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

/*
import nxt.crypto.Crypto;
import nxt.util.Convert;
import org.json.simple.JSONObject;
*/

var Arrays = require(__dirname + '/../Util/Arrays');
var Blocks = require(__dirname + '/../Blocks');
var ByteBuffer = require(__dirname + '/../Util/ByteBuffer');
var Convert = require(__dirname + '/../Util/Convert');
//var Genesis = require(__dirname + '/Genesis');
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
function Transaction(data) {
	if (data.senderPublicKey == null || typeof data.senderPublicKey != 'object' || typeof data.senderPublicKey.length == 'undefined')
		throw new Error('Transaction: data.senderPublicKey mast be array');
	if (typeof data.recipientId != 'number')
		throw new Error('Transaction: data.recipientId not a number');
	this.deadline = data.deadline; // Hour?
	this.senderPublicKey = data.senderPublicKey;
	this.recipientId = data.recipientId;
	this.amountMilliLm = data.amountMilliLm;
	this.feeMilliLm = data.feeMilliLm;
	this.referencedTransactionFullHash = data.referencedTransactionFullHash;
	this.type = data.type; // TransactionType

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
	if ((timestamp == 0 && Arrays.Equals(senderPublicKey, Genesis.CreatorPublicKey))
			? (deadline != 0 || feeMilliLm != 0)
			: (deadline < 1 || feeMilliLm < Constants.OneLm)
			|| feeNQT > Constants.MaxBalanceMilliLm
			|| amountNQT < 0
			|| amountNQT > Constants.MaxBalanceMilliLm
			|| type == null) {
		throw new NxtException.ValidationException("Invalid transaction parameters:\n type: " + type + ", timestamp: " + timestamp
				+ ", deadline: " + deadline + ", fee: " + feeNQT + ", amount: " + amountNQT);
	}
	*/

	return this;
}

function Apply() {
	throw new Error('Not implementted');
	/*
	Account senderAccount = Account.getAccount(getSenderId());
	senderAccount.apply(senderPublicKey, this.getHeight());
	Account recipientAccount = Account.getAccount(recipientId);
	if (recipientAccount == null) {
		recipientAccount = Account.addOrGetAccount(recipientId);
	}
	type.apply(this, senderAccount, recipientAccount);
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

function GetAttachment() {
	return this.attachment;
}

function GetBlock() {
	if (this.block == null) {
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
	buffer.byte(this.type.GetSubtype());
	buffer.int32(this.timestamp);
	buffer.short(this.deadline);
	buffer.byteArray(this.senderPublicKey, this.senderPublicKey.length);
	aa = Convert.NullToZero(this.recipientId);
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

	if (this.attachment != null) {
		var att = this.attachment.GetBytes();
		buffer.byteArray(att, att.length);
	}
	return buffer.pack();
}

function GetDeadline() {
	return this.deadline;
}

function GetExpiration() {
	return this.timestamp + this.deadline * 60;
}

function GetFeeMilliLm() {
	return this.feeMilliLm;
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
	json.put("recipient", Convert.toUnsignedLong(recipientId));
	json.put("amountNQT", amountNQT);
	json.put("feeNQT", feeNQT);
	if (referencedTransactionFullHash != null) {
		json.put("referencedTransactionFullHash", referencedTransactionFullHash);
	}
	json.put("signature", Convert.toHexString(signature));
	if (attachment != null) {
		json.put("attachment", attachment.getJSONObject());
	}
	return json;
	*/
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
	return this.SignatureOffset() + 64  + (this.attachment == null ? 0 : this.attachment.GetSize());
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

function HashCode() {
	return this.GetId().HashCode();
}

function IsDuplicate(Duplicates) {
	return this.Type.IsDuplicate(this, Duplicates);
}

function SetAttachment(attachment) {
	this.attachment = attachment;
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
	senderAccount.undo(this.getHeight());
	Account recipientAccount = Account.getAccount(recipientId);
	type.undo(this, senderAccount, recipientAccount);
	*/
}

function UndoUnconfirmed() {
	throw new Error('Not implementted');
	/*
	Account senderAccount = Account.getAccount(getSenderId());
	type.undoUnconfirmed(this, senderAccount);
	*/
}

function UpdateTotals(accumulatedAmounts, accumulatedAssetQuantities) {
	throw new Error('Not implementted');
	/*
	Long senderId = getSenderId();
	Long accumulatedAmount = accumulatedAmounts.get(senderId);
	if (accumulatedAmount == null) {
		accumulatedAmount = 0L;
	}
	accumulatedAmounts.put(senderId, Convert.safeAdd(accumulatedAmount, Convert.safeAdd(amountNQT, feeNQT)));
	type.updateTotals(this, accumulatedAmounts, accumulatedAssetQuantities, accumulatedAmount);
	*/
}

function ValidateAttachment() {
	this.type.ValidateAttachment(this);
}

function Verify() {
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
Transaction.prototype.GetAttachment = GetAttachment;
Transaction.prototype.GetBlock = GetBlock;
Transaction.prototype.GetBlockId = GetBlockId;
Transaction.prototype.GetBlockTimestamp = GetBlockTimestamp;
Transaction.prototype.GetBytes = GetBytes;
Transaction.prototype.GetDeadline = GetDeadline;
Transaction.prototype.GetExpiration = GetExpiration;
Transaction.prototype.GetFeeMilliLm = GetFeeMilliLm;
Transaction.prototype.GetFullHash = GetFullHash;
Transaction.prototype.GetHeight = GetHeight;
Transaction.prototype.GetId = GetId;
Transaction.prototype.GetJsonObject = GetJsonObject;
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
Transaction.prototype.HashCode = HashCode;
Transaction.prototype.IsDuplicate = IsDuplicate;
Transaction.prototype.SetAttachment = SetAttachment;
Transaction.prototype.SetBlock = SetBlock;
Transaction.prototype.SignatureOffset = SignatureOffset;
Transaction.prototype.Sign = Sign;
Transaction.prototype.Undo = Undo;
Transaction.prototype.UndoUnconfirmed = UndoUnconfirmed;
Transaction.prototype.UpdateTotals = UpdateTotals;
Transaction.prototype.ValidateAttachment = ValidateAttachment;
Transaction.prototype.Verify = Verify;


module.exports = Transaction;
