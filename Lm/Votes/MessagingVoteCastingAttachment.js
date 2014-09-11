/**!
 * LibreMoney 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

function MessagingVoteCastingAttachment() {
	this.serialVersionUID = 0;
	this.pollId = 0;
	this.pollVote = [];
	return this;
}

function MessagingVoteCasting(pollId, pollVote) {
	throw new Error('This is not implemented');
	/*
	this.pollId = pollId;
	this.pollVote = pollVote;
	*/
}

function GetSize() {
	throw new Error('This is not implemented');
	/*
	return 8 + 1 + this.pollVote.length;
	*/
}

function GetBytes() {
	throw new Error('This is not implemented');
	/*
	ByteBuffer buffer = ByteBuffer.allocate(getSize());
	buffer.order(ByteOrder.LITTLE_ENDIAN);
	buffer.putLong(this.pollId);
	buffer.put((byte)this.pollVote.length);
	buffer.put(this.pollVote);
	return buffer.array();
	*/
}

function GetJsonObject() {
	throw new Error('This is not implemented');
	/*
	JSONObject attachment = new JSONObject();
	attachment.put("pollId", Convert.toUnsignedLong(this.pollId));
	JSONArray vote = new JSONArray();
	if (this.pollVote != null) {
		for (byte aPollVote : this.pollVote) {
			vote.add(aPollVote);
		}
	}
	attachment.put("vote", vote);
	return attachment;
	*/
}

function GetTransactionType() {
	throw new Error('This is not implemented');
	/*
	return TransactionType.Messaging.VOTE_CASTING;
	*/
}

function GetPollId() {
	return this.pollId;
}

function GetPollVote() {
	return this.pollVote;
}


MessagingVoteCastingAttachment.prototype.MessagingVoteCasting = MessagingVoteCasting;
MessagingVoteCastingAttachment.prototype.GetSize = GetSize;
MessagingVoteCastingAttachment.prototype.GetBytes = GetBytes;
MessagingVoteCastingAttachment.prototype.GetJsonObject = GetJsonObject;
MessagingVoteCastingAttachment.prototype.GetTransactionType = GetTransactionType;
MessagingVoteCastingAttachment.prototype.GetPollId = GetPollId;
MessagingVoteCastingAttachment.prototype.GetPollVote = GetPollVote;


module.exports = MessagingVoteCastingAttachment();
