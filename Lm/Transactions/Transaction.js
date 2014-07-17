/*
import nxt.crypto.Crypto;
import nxt.util.Convert;
import org.json.simple.JSONObject;
*/

//var LmGenesis = require(__dirname + '/LmGenesis');


// extends Comparable<Transaction>
function LmTransaction(/*TransactionType*/ Type, Timestamp, Deadline, SenderPublicKey, RecipientId,
		AmountMilliLm/*NQT*/, FeeMilliLm/*NQT*/, ReferencedTransactionFullHash, Signature,
		BlockId, Height, Id, SenderId, BlockTimestamp, FullHash) {
	var obj = {};

	/*
	Long getId();
	String getStringId();
	Long getSenderId();
	byte[] getSenderPublicKey();
	Long getRecipientId();
	int getHeight();
	Long getBlockId();
	Block getBlock();
	int getTimestamp();
	int getBlockTimestamp();
	short getDeadline();
	int getExpiration();
	long getAmountNQT();
	long getFeeNQT();
	String getReferencedTransactionFullHash();
	byte[] getSignature();
	String getFullHash();
	TransactionType getType();
	Attachment getAttachment();
	void sign(String secretPhrase);
	boolean verify();
	void validateAttachment() throws NxtException.ValidationException;
	byte[] getBytes();
	byte[] getUnsignedBytes();
	JSONObject getJSONObject();
	*/


	function GetDeadline() {
		return this.Deadline;
	}

	function GetSenderPublicKey() {
		return this.SenderPublicKey;
	}

	function GetRecipientId() {
		return this.RecipientId;
	}

	function GetAmountMilliLm() {
		return this.AmountMilliLm;
	}

	function GetFeeMilliLm() {
		return this.FeeMilliLm;
	}

	function GetReferencedTransactionFullHash() {
		return this.ReferencedTransactionFullHash;
	}

	function GetHeight() {
		return this.Height;
	}

	function GetSignature() {
		return this.Signature;
	}

	// TransactionType
	function GetType() {
		return this.Type;
	}

	function GetBlockId() {
		return this.BlockId;
	}

	function GetBlock() {
		if (this.Block == null) {
			this.Block = BlockDb.FindBlock(this.BlockId);
		}
		return this.Block;
	}

	function SetBlock(Block) {
		this.Block = Block;
		this.BlockId = Block.GetId();
		this.Height = Block.GetHeight();
		this.BlockTimestamp = Block.GetTimestamp();
	}

	function GetTimestamp() {
		return this.Timestamp;
	}

	function GetBlockTimestamp() {
		return this.BlockTimestamp;
	}

	function GetExpiration() {
		return this.Timestamp + this.Deadline * 60;
	}

	function GetAttachment() {
		return this.Attachment;
	}

	function SetAttachment(Attachment) {
		this.Attachment = Attachment;
	}

	function GetId() {
		/*
		if (this.Id == null) {
			if (this.Signature == null) {
				return false;
				//throw new IllegalStateException("Transaction is not signed yet");
			}
			byte[] hash;
			if (useNQT()) {
				byte[] data = zeroSignature(getBytes());
				byte[] signatureHash = Crypto.sha256().digest(signature);
				MessageDigest digest = Crypto.sha256();
				digest.update(data);
				hash = digest.digest(signatureHash);
			} else {
				hash = Crypto.sha256().digest(getBytes());
			}
			BigInteger bigInteger = new BigInteger(1, new byte[] {hash[7], hash[6], hash[5], hash[4], hash[3], hash[2], hash[1], hash[0]});
			id = bigInteger.longValue();
			stringId = bigInteger.toString();
			fullHash = Convert.toHexString(hash);
		}
		*/
		return this.Id;
	}

	function GetStringId() {
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
		if (FullHash == null) {
			GetId();
		}
		return FullHash;
	}

	function GetSenderId() {
		if (this.SenderId == null) {
			this.SenderId = this.Account.GetId(this.SenderPublicKey);
		}
		return this.SenderId;
	}

	/*
	public int compareTo(Transaction o) {
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
	}
	*/

	/*
	public byte[] getBytes() {
		ByteBuffer buffer = ByteBuffer.allocate(getSize());
		buffer.order(ByteOrder.LITTLE_ENDIAN);
		buffer.put(type.getType());
		buffer.put(type.getSubtype());
		buffer.putInt(timestamp);
		buffer.putShort(deadline);
		buffer.put(senderPublicKey);
		buffer.putLong(Convert.nullToZero(recipientId));
		if (useNQT()) {
			buffer.putLong(amountNQT);
			buffer.putLong(feeNQT);
			if (referencedTransactionFullHash != null) {
				buffer.put(Convert.parseHexString(referencedTransactionFullHash));
			} else {
				buffer.put(new byte[32]);
			}
		} else {
			buffer.putInt((int)(amountNQT / Constants.ONE_NXT));
			buffer.putInt((int)(feeNQT / Constants.ONE_NXT));
			if (referencedTransactionFullHash != null) {
				buffer.putLong(Convert.fullHashToId(Convert.parseHexString(referencedTransactionFullHash)));
			} else {
				buffer.putLong(0L);
			}
		}
		buffer.put(signature != null ? signature : new byte[64]);
		if (attachment != null) {
			buffer.put(attachment.getBytes());
		}
		return buffer.array();
	}
	*/

	/*
	public byte[] getUnsignedBytes() {
		return zeroSignature(getBytes());
	}
	*/

	/*
	public JSONObject getJSONObject() {
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
	}
	*/

	/*
	public void sign(String secretPhrase) {
		if (signature != null) {
			throw new IllegalStateException("Transaction already signed");
		}
		signature = Crypto.sign(getBytes(), secretPhrase);
	}
	*/

	/*
	public boolean equals(Object o) {
		return o instanceof TransactionImpl && this.getId().equals(((Transaction)o).getId());
	}
	*/

	function HashCode() {
		return this.GetId().HashCode();
	}

	function Verify() {
		return false;
		/*
		Account account = Account.getAccount(getSenderId());
		if (account == null) {
			return false;
		}
		if (signature == null) {
			return false;
		}
		byte[] data = zeroSignature(getBytes());
		return Crypto.verify(signature, data, senderPublicKey, useNQT()) && account.setOrVerify(senderPublicKey, this.getHeight());
		*/
	}

	function GetSize() {
		return this.SignatureOffset() + 64  + (this.Attachment == null ? 0 : this.Attachment.GetSize());
	}

	function SignatureOffset() {
		return 1 + 1 + 4 + 2 + 32 + 8 + 8 + 8 + 32;
		//return 1 + 1 + 4 + 2 + 32 + 8 + (this.UseNQT() ? 8 + 8 + 32 : 4 + 4 + 8);
	}

	/*
	private boolean useNQT() {
		return this.height > Constants.NQT_BLOCK
				&& (this.height < Integer.MAX_VALUE
				|| Nxt.getBlockchain().getHeight() >= Constants.NQT_BLOCK);
	}

	private byte[] zeroSignature(byte[] data) {
		int start = signatureOffset();
		for (int i = start; i < start + 64; i++) {
			data[i] = 0;
		}
		return data;
	}

	public void validateAttachment() throws NxtException.ValidationException {
		type.validateAttachment(this);
	}

	// returns false iff double spending
	boolean applyUnconfirmed() {
		Account senderAccount = Account.getAccount(getSenderId());
		if (senderAccount == null) {
			return false;
		}
		synchronized(senderAccount) {
			return type.applyUnconfirmed(this, senderAccount);
		}
	}

	void apply() {
		Account senderAccount = Account.getAccount(getSenderId());
		senderAccount.apply(senderPublicKey, this.getHeight());
		Account recipientAccount = Account.getAccount(recipientId);
		if (recipientAccount == null) {
			recipientAccount = Account.addOrGetAccount(recipientId);
		}
		type.apply(this, senderAccount, recipientAccount);
	}

	void undoUnconfirmed() {
		Account senderAccount = Account.getAccount(getSenderId());
		type.undoUnconfirmed(this, senderAccount);
	}

	// NOTE: when undo is called, lastBlock has already been set to the previous block
	void undo() throws TransactionType.UndoNotSupportedException {
		Account senderAccount = Account.getAccount(senderId);
		senderAccount.undo(this.getHeight());
		Account recipientAccount = Account.getAccount(recipientId);
		type.undo(this, senderAccount, recipientAccount);
	}
	*/

	/*
	void updateTotals(Map<Long,Long> accumulatedAmounts, Map<Long,Map<Long,Long>> accumulatedAssetQuantities) {
		Long senderId = getSenderId();
		Long accumulatedAmount = accumulatedAmounts.get(senderId);
		if (accumulatedAmount == null) {
			accumulatedAmount = 0L;
		}
		accumulatedAmounts.put(senderId, Convert.safeAdd(accumulatedAmount, Convert.safeAdd(amountNQT, feeNQT)));
		type.updateTotals(this, accumulatedAmounts, accumulatedAssetQuantities, accumulatedAmount);
	}
	*/

	function IsDuplicate(Duplicates) {
		return this.Type.IsDuplicate(this, Duplicates);
	}


	obj.Deadline = Deadline; // Hour?
	obj.SenderPublicKey = SenderPublicKey;
	obj.RecipientId = RecipientId;
	obj.AmountMilliLm = AmountMilliLm;
	obj.FeeMilliLm = FeeMilliLm;
	obj.ReferencedTransactionFullHash = ReferencedTransactionFullHash;
	obj.Type = Type; // TransactionType

	if (typeof Height == 'undefined')
		obj.Height = 2000000000 //Integer.MAX_VALUE
	else
		obj.Height = Height;
	obj.BlockId = BlockId;
	//this.Block =
	obj.Signature = Signature;
	obj.Timestamp = Timestamp;
	if (typeof BlockTimestamp == 'undefined')
		obj.BlockTimestamp = -1
	else
		obj.BlockTimestamp = BlockTimestamp;
	//this.Attachment =
	obj.Id = Id;
	//this.StringId = null;
	obj.SenderId = SenderId;
	obj.FullHash = FullHash; // fullHash == null ? null : Convert.toHexString(fullHash);

	/*
	if ((timestamp == 0 && Arrays.equals(senderPublicKey, LmGenesis.CreatorPublicKey))
			? (deadline != 0 || feeNQT != 0)
			: (deadline < 1 || feeNQT < Constants.ONE_NXT)
			|| feeNQT > Constants.MAX_BALANCE_NQT
			|| amountNQT < 0
			|| amountNQT > Constants.MAX_BALANCE_NQT
			|| type == null) {
		throw new NxtException.ValidationException("Invalid transaction parameters:\n type: " + type + ", timestamp: " + timestamp
				+ ", deadline: " + deadline + ", fee: " + feeNQT + ", amount: " + amountNQT);
	}
	*/


	obj.GetDeadline = GetDeadline;
	obj.GetSenderPublicKey = GetSenderPublicKey;
	obj.GetRecipientId = GetRecipientId;
	obj.GetAmountMilliLm = GetAmountMilliLm;
	obj.GetFeeMilliLm = GetFeeMilliLm;
	obj.GetReferencedTransactionFullHash = GetReferencedTransactionFullHash;
	obj.GetHeight = GetHeight;
	obj.GetSignature = GetSignature;
	obj.GetType = GetType;
	obj.GetBlockId = GetBlockId;
	obj.GetBlock = GetBlock;
	obj.SetBlock = SetBlock;
	obj.GetTimestamp = GetTimestamp;
	obj.GetBlockTimestamp = GetBlockTimestamp;
	obj.GetExpiration = GetExpiration;
	obj.GetAttachment = GetAttachment;
	obj.SetAttachment = SetAttachment;
	obj.GetId = GetId;
	obj.GetStringId = GetStringId;
	obj.GetSenderId = GetSenderId;
	obj.HashCode = HashCode;
	obj.Verify = Verify;
	obj.GetSize = GetSize;
	obj.SignatureOffset = SignatureOffset;
	obj.IsDuplicate = IsDuplicate;
	return obj;
}


module.exports = LmTransaction;
