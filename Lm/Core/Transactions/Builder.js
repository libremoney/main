/**!
 * LibreMoney 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var Convert = require(__dirname + '/../../Lib/Util/Convert');


function Builder(version, senderPublicKey, amountMilliLm, feeMilliLm, timestamp, deadline, attachment) {
	/*
	private Long recipientId;
	private String referencedTransactionFullHash;
	private byte[] signature;
	private Appendix.Message message;
	private Appendix.EncryptedMessage encryptedMessage;
	private Appendix.EncryptToSelfMessage encryptToSelfMessage;
	private Appendix.PublicKeyAnnouncement publicKeyAnnouncement;
	private Long blockId;
	private int height = Integer.MAX_VALUE;
	private Long id;
	private Long senderId;
	private int blockTimestamp = -1;
	private String fullHash;
	private int ecBlockHeight;
	private Long ecBlockId;
	*/


	this.version = version;
	this.timestamp = timestamp;
	this.deadline = deadline;
	this.senderPublicKey = senderPublicKey;
	this.amountMilliLm = amountMilliLm;
	this.feeMilliLm = feeMilliLm;
	this.attachment = attachment;
	this.type = attachment.GetTransactionType();
}

/*
function Build() {
	return new TransactionImpl(this);
}
*/

function RecipientId(recipientId) {
	this.recipientId = recipientId;
	return this;
}

function ReferencedTransactionFullHash(referencedTransactionFullHash) {
	this.referencedTransactionFullHash = referencedTransactionFullHash;
	return this;
}

function ReferencedTransactionFullHash(referencedTransactionFullHash) {
	if (referencedTransactionFullHash != null) {
		this.referencedTransactionFullHash = Convert.ToHexString(referencedTransactionFullHash);
	}
	return this;
}

function Message(message) {
	this.message = message;
	return this;
}

function EncryptedMessage(encryptedMessage) {
	this.encryptedMessage = encryptedMessage;
	return this;
}

function EncryptToSelfMessage(encryptToSelfMessage) {
	this.encryptToSelfMessage = encryptToSelfMessage;
	return this;
}

function PublicKeyAnnouncement(publicKeyAnnouncement) {
	this.publicKeyAnnouncement = publicKeyAnnouncement;
	return this;
}

function Id(id) {
	this.id = id;
	return this;
}

function Signature(signature) {
	this.signature = signature;
	return this;
}

function BlockId(blockId) {
	this.blockId = blockId;
	return this;
}

function Height(height) {
	this.height = height;
	return this;
}

function SenderId(senderId) {
	this.senderId = senderId;
	return this;
}

function FullHash(fullHash) {
	this.fullHash = fullHash;
	return this;
}

function FullHash(fullHash) {
	if (fullHash != null) {
		this.fullHash = Convert.ToHexString(fullHash);
	}
	return this;
}

function BlockTimestamp(blockTimestamp) {
	this.blockTimestamp = blockTimestamp;
	return this;
}

function EcBlockHeight(height) {
	this.ecBlockHeight = height;
	return this;
}

function EcBlockId(blockId) {
	this.ecBlockId = blockId;
	return this;
}


Builder.prototype.RecipientId = RecipientId;
Builder.prototype.ReferencedTransactionFullHash = ReferencedTransactionFullHash;
Builder.prototype.Message = Message;
Builder.prototype.EncryptedMessage = EncryptedMessage;
Builder.prototype.EncryptToSelfMessage = EncryptToSelfMessage;
Builder.prototype.PublicKeyAnnouncement = PublicKeyAnnouncement;
