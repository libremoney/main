/**!
 * LibreMoney groups 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

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
}


exports.AddNewGroup = AddNewGroup;
exports.GetAllGroups = GetAllGroups;
exports.GetGroupByIndex = GetGroupByIndex;
exports.GetLength = GetLength;
exports.Init = Init;
