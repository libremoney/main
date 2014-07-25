/**!
 * LibreMoney polls 0.0
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

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
}


exports.AddPoll = AddPoll;
exports.GetAllPolls = GetAllPolls;
exports.Clear = Clear;
exports.GetPoll = GetPoll;
exports.Init = Init;
