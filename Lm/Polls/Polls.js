/**!
 * LibreMoney Polls 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var Api = require(__dirname + "/Api");
var Core = require(__dirname + '/../Core');


var polls = new Array(); //ConcurrentHashMap<>();
var allPolls = new Array(); //Collections.unmodifiableCollection(polls.values());


function AddPoll(id, name, description, options, minNumberOfOptions, maxNumberOfOptions, optionsAreBinary) {
	throw new Error('This is not implemented');
	/*
	if (polls.putIfAbsent(id, new Poll(id, name, description, options, minNumberOfOptions, maxNumberOfOptions, optionsAreBinary)) != null) {
		throw new IllegalStateException("Poll with id " + Convert.toUnsignedLong(id) + " already exists");
	}
	*/
}

function GetAllPolls() {
	return allPolls;
}

function Clear() {
	polls.length = 0;
}

function GetPoll(id) {
	return polls[id];
}

function Init() {
	Core.AddListener(Core.Event.GetState, OnGetState);
	Core.AddListener(Core.Event.InitServer, OnInitServer);
}

function OnGetState(response) {
	response.numberOfPolls = allPolls.length;
}

function OnInitServer(app) {
	app.get("/api/castVote", Api.CastVote);
	app.get("/api/createPoll", Api.CreatePoll);
	app.get("/api/getPoll", Api.GetPoll);
	app.get("/api/getPollIds", Api.GetPollIds);
}

exports.AddPoll = AddPoll;
exports.GetAllPolls = GetAllPolls;
exports.Clear = Clear;
exports.GetPoll = GetPoll;
exports.Init = Init;
