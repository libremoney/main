/**!
 * LibreMoney JsonResponses 0.0
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */


private Poll(id, name, description, options, minNumberOfOptions, maxNumberOfOptions, optionsAreBinary) {
	this.id = id;
	this.name = name;
	this.description = description;
	this.options = options;
	this.minNumberOfOptions = minNumberOfOptions;
	this.maxNumberOfOptions = maxNumberOfOptions;
	this.optionsAreBinary = optionsAreBinary;
	this.voters = new Array(); //ConcurrentHashMap<>();
	return this;
}

function GetId() {
	return this.id;
}

function GetName() {
	return this.name;
}

function GetDescription() {
	return this.description;
}

function GetOptions() {
	return this.options;
}

function GetMinNumberOfOptions() {
	return this.minNumberOfOptions;
}

function GetMaxNumberOfOptions() {
	return this.maxNumberOfOptions;
}

function IsOptionsAreBinary() {
	return this.optionsAreBinary;
}

function GetVoters() {
	return this.voters; //Collections.unmodifiableMap(voters);
}

function AddVoter(voterId, voteId) {
	this.voters[voteId] = voterId;
}


Poll.prototype.GetId = GetId;
Poll.prototype.GetName = GetName;
Poll.prototype.GetDescription = GetDescription;
Poll.prototype.GetOptions = GetOptions;
Poll.prototype.GetMinNumberOfOptions = GetMinNumberOfOptions;
Poll.prototype.GetMaxNumberOfOptions = GetMaxNumberOfOptions;
Poll.prototype.IsOptionsAreBinary = IsOptionsAreBinary;
Poll.prototype.GetVoters = GetVoters;
Poll.prototype.AddVoter = AddVoter;


module.exports = Poll;
