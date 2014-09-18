/**!
 * LibreMoney GetProjectListHtml api 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var Projects = require(__dirname + "/../Projects");


function GetProjectListHtml(req, res) {
	var projectGroup = req.params.id || req.query.projectGroup;
	var s = '';
	Projects.GetAllProjects().forEach(function (project) {
		if (req.query.community == project.Community && projectGroup == project.ProjGroup && req.query.projectState == project.State) {
			var state = '';
			switch (project.State) {
				case 0:	ps = '<font color="black">Анонс</font>'; break;
				case 1: ps = '<font color="black">Сбор средств</font>'; break;
				case 2: ps = '<font color="gray">Выполняется</font>'; break;
				case 3: ps = '<font color="green">Сделано</font>'; break;
				ps = '<font color="black">Не известно</font>';
			}
			s = s + '<div class="divProjectBlock">' +
				'<h3>'+project.Name+'</h3>' +
				project.Description +
				'<br/>' +
				ps +
				'<br/>' +
				'<b>'+project.Sum1+' / '+project.Sum2+'</b>' +
				'</div>';
		}
	});
	res.send(s);
}


module.exports = GetProjectListHtml;
