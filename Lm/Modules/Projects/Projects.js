/**!
 * LibreMoney Projects 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var Core = require(__dirname + '/../../Core');
var Project = require(__dirname + '/Project');


var projects = new Array();


function AddNewProject(userGroup, projGroup, name, description, author, state, sum1, sum2, announceTime, startTime, beginTime, endTime) {
	var proj = new Project(userGroup, projGroup, name, description, author, state, sum1, sum2, announceTime, startTime, beginTime, endTime);
	projects.push(proj);
	return proj;
}

function GetAllProjects() {
	return projects;
}

function GetLength() {
	return projects.length;
}

function GetProjectByIndex(index) {
	return projects[index];
}

function Init() {
	Core.AddListener(Core.Event.InitServer, OnInitServer);
}

function OnInitServer(app) {
	var Api = require(__dirname + "/Api");
	app.get("/api/getProjectList", Api.GetProjectList);
	app.get("/api/getProjectListHtml", Api.GetProjectListHtml);
	app.get('/projects', Api.GetProjectList);
	app.get("/projectList/:id", Api.GetProjectList);
}


exports.AddNewProject = AddNewProject;
exports.GetAllProjects = GetAllProjects;
exports.GetLength = GetLength;
exports.GetProjectByIndex = GetProjectByIndex;
exports.Init = Init;

exports.SUBTYPE_PROJECT_CREATE = 0;
exports.SUBTYPE_PROJECT_ANNOUNCE = 1;
exports.SUBTYPE_PROJECT_EDIT = 2;
exports.SUBTYPE_PROJECT_BEGIN = 3;
