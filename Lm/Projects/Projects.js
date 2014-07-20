/**!
 * LibreMoney projects 0.0
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var Project = require(__dirname + '/Project');


var projects = new Array();


function AddNewProject(userGroup, projGroup, name, description, author, state, sum1, sum2, announceTime, startTime, beginTime, endTime) {
	var proj = new Project(userGroup, projGroup, name, description, author, state, sum1, sum2, announceTime, startTime, beginTime, endTime);
	projects.push(proj);
	return proj;
}

function GetLength() {
	return projects.length;
}

function GetProjectByIndex(index) {
	return projects[index];
}

function Init() {
}


exports.AddNewProject = AddNewProject;
exports.GetLength = GetLength;
exports.GetProjectByIndex = GetProjectByIndex;
exports.Init = Init;
