/**!
 * LibreMoney GetProject api 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

if (typeof module !== "undefined") {
	var Projects = require(__dirname + "/../Projects");
	var ResponseHelper = require(__dirname + '/../../../Core/Server/ResponseHelper');
}


function GetProject(req, res) {
	var projectId = req.params.id || req.query.projectId;
	Projects.GetProjectById(projectId, function(err, project) {
		if (err) {
			res.json(err);
			return;
		}
		res.json({
			project: project
		});
	});
}


if (typeof module !== "undefined") {
	module.exports = GetProject;
}
