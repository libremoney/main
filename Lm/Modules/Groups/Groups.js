/**!
 * LibreMoney Groups 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var Core = require(__dirname + '/../../Core');
var Group = require(__dirname + '/Group');


var groups = new Array();


function AddNewGroup(name, description, lead) {
	var group = new Group(name, description, lead);
	groups.push(group);
	return group;
}

function GetAllGroups() {
	return groups;
}

function GetGroupByIndex(index) {
	return groups[index];
}

function GetLength() {
	return groups.length;
}

function Init() {
	Core.AddListener(Core.Event.Clear, OnClear);
	Core.AddListener(Core.Event.InitServer, OnInitServer);
}

function OnClear() {
	groups.length = 0;
}

function OnInitServer(app) {
	var Api = require(__dirname + "/Api");
	app.get('/api/getGroup', Api.GetGroup);
	app.get('/api/getGroups', Api.GetGroups);
	app.get('/group', Api.GetGroup);
	app.get('/groups', Api.GetGroups);
}


exports.AddNewGroup = AddNewGroup;
exports.GetAllGroups = GetAllGroups;
exports.GetGroupByIndex = GetGroupByIndex;
exports.GetLength = GetLength;
exports.Init = Init;
