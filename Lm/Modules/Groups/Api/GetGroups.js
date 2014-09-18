/**!
 * LibreMoney GetGroups api 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var Groups = require(__dirname + "/../Groups");


function GetGroups(req, res) {
	res.send({
		errorCode:100,
		errorDescription:'Not implementted'
	});
	/*
	var S = '';
	Groups.GetAllGroups().forEach(function(Group){
		S = S + '<div class="divGroupsBlock">'+
		'<h3>' + Groups.Name + '</h3>' +
		Group.Description +
		'<br/>' +
		'Участников: <a class="divGroupsBlock_Users" href="/group/'+Group.Id+'/users">'+Group.Users.length+'</a>' +
		'<br/>' +
		'Проектов: ' +
		'<a class="divGroupsBlock_ProjectsOk" href="/group/'+Group.Id+'/projects-ok">2</a> + ' +
		'<a class="divGroupsBlock_ProjectsBad" href="/group/'+Group.Id+'/projects-bad">0</a> + ' +
		'<a class="divGroupsBlock_ProjectsRun" href="/group/'+Group.Id+'/projects-run">4</a> + ' +
		'<a class="divGroupsBlock_ProjectsFundBegin" href="/group/'+Group.Id+'/projects-fund-begin">8</a> + ' +
		'<a class="divGroupsBlock_ProjectsFundNon" href="/group/'+Group.Id+'/projects-fund-non">0</a> = ' +
		'<a class="divGroupsBlock_ProjectsAll" href="projects-1.html">14</a>' +
		'<br/>' +
		'Вес сообщества: <b>'+Group.Weight+'</b>' +
		'</div>';
	});
	return S;
	*/
	/*
	var projectGroup = req.params.id || req.query.projectGroup;
	var obj = [];
	Projects.GetAllProjects().forEach(function (project) {
		if (req.query.community == project.Community && projectGroup == project.ProjGroup && req.query.projectState == project.State) {
			obj.push(project);
		}
	});
	res.send(obj);
	*/
}


module.exports = GetGroups;
