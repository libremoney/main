/**!
 * LibreMoney Polls 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var Api = require(__dirname + "/Api");
var Convert = require(__dirname + '/../Util/Convert');
var Core = require(__dirname + '/../Core');


var polls = new Array(); //ConcurrentHashMap<>();
var allPolls = new Array(); //Collections.unmodifiableCollection(polls.values());
var votes = []; //ConcurrentHashMap


function AddPoll(id, name, description, options, minNumberOfOptions, maxNumberOfOptions, optionsAreBinary) {
	throw new Error('This is not implemented');
	/*
	if (polls.putIfAbsent(id, new Poll(id, name, description, options, minNumberOfOptions, maxNumberOfOptions, optionsAreBinary)) != null) {
		throw new IllegalStateException("Poll with id " + Convert.toUnsignedLong(id) + " already exists");
	}
	*/
}

function AddVote(id, pollId, voterId, vote) {
	if (votes[id]) {
		throw new Error("IllegalStateException: Vote with id " + Convert.ToUnsignedLong(id) + " already exists");
	}
	var voteData = new Vote(id, pollId, voterId, vote);
	votes[id] = voteData;
	return voteData;
}

function GetAllPolls() {
	return allPolls;
}

function Clear() {
	polls.length = 0;
	votes.length = 0;
}

function GetPoll(id) {
	return polls[id];
}

function GetVote(id) {
	return votes[id];
}

function GetVotes() {
	return votes;
}

function Init() {
	Core.AddListener(Core.Event.GetState, OnGetState);
	Core.AddListener(Core.Event.InitServer, OnInitServer);
}

function OnGetState(response) {
	response.numberOfPolls = allPolls.length;
	response.numberOfVotes = votes.length;
}

function OnInitServer(app) {
	app.get("/api/castVote", Api.CastVote);
	app.get("/api/createPoll", Api.CreatePoll);
	app.get("/api/getPoll", Api.GetPoll);
	app.get("/api/getPollIds", Api.GetPollIds);
}


exports.AddPoll = AddPoll;
exports.AddVote = AddVote;
exports.Clear = Clear;
exports.GetAllPolls = GetAllPolls;
exports.GetPoll = GetPoll;
exports.GetVote = GetVote;
exports.GetVotes = GetVotes;
exports.Init = Init;

exports.SUBTYPE_MESSAGING_POLL_CREATION = 2;
exports.SUBTYPE_MESSAGING_VOTE_CASTING = 3;
