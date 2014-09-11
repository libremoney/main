/*!
 * LibreMoney 0.1
 * Copyright(c) 2014 LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var Convert = require(__dirname + '/../Util/Convert');


var votes = []; //ConcurrentHashMap


function AddVote(id, pollId, voterId, vote) {
	if (votes[id]) {
		throw new Error("IllegalStateException: Vote with id " + Convert.ToUnsignedLong(id) + " already exists");
	}
	var voteData = new Vote(id, pollId, voterId, vote);
	votes[id] = voteData;
	return voteData;
}

function Clear() {
	votes.length = 0;
}

function GetVote(id) {
	return votes[id];
}

function GetVotes() {
	return votes;
}


exports.AddVote = AddVote;
exports.Clear = Clear;
exports.GetVote = GetVote;
exports.GetVotes = GetVotes;
