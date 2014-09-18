/**!
 * LibreMoney GetProjectList api 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var Projects = require(__dirname + "/../Projects");


function GetProjectList(req, res) {
	var projectGroup = req.params.id || req.query.projectGroup;
	var obj = [];
	Projects.GetAllProjects().forEach(function (project) {
		if (req.query.community == project.Community && projectGroup == project.ProjGroup && req.query.projectState == project.State) {
			obj.push(project);
		}
	});
	res.send(obj);
}

module.exports = GetProjectList;
