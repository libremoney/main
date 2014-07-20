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
//var LmGenesis = require(__dirname + '/LmGenesis');


function Transaction(type, timestamp, deadline, senderPublicKey, recipientId,
		amountMilliLm, feeMilliLm, referencedTransactionFullHash, signature,
		blockId, height, id, senderId, blockTimestamp, fullHash) {
	this.deadline = deadline; // Hour?
	this.senderPublicKey = senderPublicKey;
	this.recipientId = recipientId;
	this.amountMilliLm = amountMilliLm;
	this.feeMilliLm = feeMilliLm;
	this.referencedTransactionFullHash = referencedTransactionFullHash;
	this.type = type; // TransactionType

	if (typeof height == 'undefined')
		this.height = 2000000000 //Integer.MAX_VALUE
	else
		this.height = height;
	this.blockId = blockId;
	//this.Block =
	this.signature = signature;
	this.timestamp = timestamp;
	if (typeof blockTimestamp == 'undefined')
		this.blockTimestamp = -1
	else
		this.blockTimestamp = blockTimestamp;
	//this.Attachment =
	this.id = id;
	//this.StringId = null;
	this.senderId = senderId;
	this.fullHash = fullHash; // fullHash == null ? null : Convert.toHexString(fullHash);

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

function GetDeadline() {
	return this.deadline;
}

function GetSenderPublicKey() {
	return this.senderPublicKey;
}

function GetRecipientId() {
	return this.recipientId;
}

function GetAmountMilliLm() {
	return this.amountMilliLm;
}

function GetFeeMilliLm() {
	return this.feeMilliLm;
}

function GetReferencedTransactionFullHash() {
	return this.referencedTransactionFullHash;
}

function GetHeight() {
	return this.height;
}

function GetSignature() {
	return this.signature;
}

// TransactionType
function GetType() {
	return this.type;
}

function GetBlockId() {
	return this.blockId;
}

function GetBlock() {
	if (this.block == null) {
		this.block = BlockDb.FindBlock(this.blockId);
	}
	return this.block;
}

function SetBlock(block) {
	this.block = block;
	this.blockId = block.GetId();
	this.height = block.GetHeight();
	this.blockTimestamp = block.GetTimestamp();
}

function GetTimestamp() {
	return this.timestamp;
}

function GetBlockTimestamp() {
	return this.blockTimestamp;
}

function GetExpiration() {
	return this.timestamp + this.deadline * 60;
}

function GetAttachment() {
	return this.attachment;
}

function SetAttachment(attachment) {
	this.attachment = attachment;
}

function GetId() {
	/*
	if (this.Id == null) {
		if (this.Signature == null) {
			return false;
			//throw new IllegalStateException("Transaction is not signed yet");
		}
		byte[] hash;
		byte[] data = zeroSignature(getBytes());
		byte[] signatureHash = Crypto.sha256().digest(signature);
		MessageDigest digest = Crypto.sha256();
		digest.update(data);
		hash = digest.digest(signatureHash);
		BigInteger bigInteger = new BigInteger(1, new byte[] {hash[7], hash[6], hash[5], hash[4], hash[3], hash[2], hash[1], hash[0]});
		id = bigInteger.longValue();
		stringId = bigInteger.toString();
		fullHash = Convert.toHexString(hash);
	}
	*/
	//throw new Error('Not implementted');
	return this.id;
}

function GetStringId() {
	throw new Error('Not implementted');
	/*
	if (StringId == null) {
		GetId();
		if (StringId == null) {
			StringId = Convert.toUnsignedLong(id);
		}
	}
	return stringId;
	*/
}

function GetFullHash() {
	if (this.fullHash == null) {
		GetId();
	}
	return this.fullHash;
}

function GetSenderId() {
	if (this.senderId == null) {
		this.senderId = this.account.GetId(this.senderPublicKey);
	}
	return this.senderId;
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

function GetBytes() {
	throw new Error('Not implementted');
	/*
	ByteBuffer buffer = ByteBuffer.allocate(getSize());
	buffer.order(ByteOrder.LITTLE_ENDIAN);
	buffer.put(type.getType());
	buffer.put(type.getSubtype());
	buffer.putInt(timestamp);
	buffer.putShort(deadline);
	buffer.put(senderPublicKey);
	buffer.putLong(Convert.nullToZero(recipientId));
	buffer.putLong(amountNQT);
	buffer.putLong(feeNQT);
	if (referencedTransactionFullHash != null) {
		buffer.put(Convert.parseHexString(referencedTransactionFullHash));
	} else {
		buffer.put(new byte[32]);
	}
	buffer.put(signature != null ? signature : new byte[64]);
	if (attachment != null) {
		buffer.put(attachment.getBytes());
	}
	return buffer.array();
	*/
}

function GetUnsignedBytes() {
	throw new Error('Not implementted');
	/*
	return zeroSignature(getBytes());
	*/
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

function Sign(secretPhrase) {
	throw new Error('Not implementted');
	/*
	if (signature != null) {
		throw new IllegalStateException("Transaction already signed");
	}
	signature = Crypto.sign(getBytes(), secretPhrase);
	*/
}

function Equals(o) {
	throw new Error('Not implementted');
	/*
	return o instanceof TransactionImpl && this.getId().equals(((Transaction)o).getId());
	*/
}

function HashCode() {
	return this.GetId().HashCode();
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

function GetSize() {
	return this.SignatureOffset() + 64  + (this.attachment == null ? 0 : this.attachment.GetSize());
}

function SignatureOffset() {
	return 1 + 1 + 4 + 2 + 32 + 8 + 8 + 8 + 32;
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

function ValidateAttachment() {
	throw new Error('Not implementted');
	/*
	type.validateAttachment(this);
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

function UndoUnconfirmed() {
	throw new Error('Not implementted');
	/*
	Account senderAccount = Account.getAccount(getSenderId());
	type.undoUnconfirmed(this, senderAccount);
	*/
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

function IsDuplicate(Duplicates) {
	return this.Type.IsDuplicate(this, Duplicates);
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
