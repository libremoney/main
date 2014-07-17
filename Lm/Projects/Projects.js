/**!
 * LibreMoney projects 0.0
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */


var projects = new Array();


function GetLength() {
	return projects.length;
}

function GetProjectByIndex(index) {
	return projects[index];
}

function Init() {
}


exports.GetLength = GetLength;
exports.GetProjectByIndex = GetProjectByIndex;
exports.Init = Init;
