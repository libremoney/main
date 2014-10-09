/**!
 * LibreMoney Projects 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

if (typeof module !== "undefined") {
	var Core = require(__dirname + '/../../Core');
	var Project = require(__dirname + '/Project');
}


var Projects = function() {
	this.projects = [];
	return this;
}();

Projects.AddNewProject = function(userGroup, projGroup, name, description, author, state, sum1, sum2, announceTime, startTime, beginTime, endTime) {
	var proj = new Project(userGroup, projGroup, name, description, author, state, sum1, sum2, announceTime, startTime, beginTime, endTime);
	this.projects.push(proj);
	return proj;
}

Projects.GetAllProjects = function() {
	return this.projects;
}

Projects.GetLength = function() {
	return this.projects.length;
}

Projects.GetProjectById = function(projectId, callback) {
	if (typeof callback !== "function") {
		return false;
	}
	var p = this.projects[projectId];
	if (!p) {
		callback({
			errorCode: 100,
			errorDescription: "Unknown project projectId=" + projectId
		});
		return true;
	}
	callback(null, p);
	return true;
}

Projects.Init = function() {
	Core.AddListener(Core.Event.InitServer, OnInitServer);
}

Projects.OnInitServer = function(app) {
	var Api = require(__dirname + "/Api");
	app.get("/api/getProjectList", Api.GetProjectList);
	app.get("/api/getProjectListHtml", Api.GetProjectListHtml);
	app.get("/project/:id", Api.GetProject);
	app.get('/projects', Api.GetProjectList);
	app.get("/projectList/:id", Api.GetProjectList);
}

/*
exports.SUBTYPE_PROJECT_CREATE = 0;
exports.SUBTYPE_PROJECT_ANNOUNCE = 1;
exports.SUBTYPE_PROJECT_EDIT = 2;
exports.SUBTYPE_PROJECT_BEGIN = 3;
*/


if (typeof module !== "undefined") {
	module.exports = Projects;
}
