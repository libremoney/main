/*!
 * LibreMoney 0.2
 * Copyright(c) 2014 LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */


function Vote(id, pollId, voterId, vote) {
	this.id = id;
	this.pollId = pollId;
	this.voterId = voterId;
	this.vote = vote;
	return this;
}

function GetId() {
	return this.id;
}

function GetPollId() {
	return pollId;
}

function GetVote() {
	return vote;
}

function GetVoterId() {
	return voterId;
}


Vote.prototype.GetId = GetId;
Vote.prototype.GetPollId = GetPollId;
Vote.prototype.GetVote = GetVote;
Vote.prototype.GetVoterId = GetVoterId;

module.exports = Vote;
