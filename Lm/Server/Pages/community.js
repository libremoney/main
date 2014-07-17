/**!
 * LibreMoney community page 0.0.1
 * Author: Prof1983 <prof1983@yandex.ru>
 * License: CC0
 */

Lm = require(__dirname + "/../../Lm");
Templ = require(__dirname + "/templ");

function Body() {
	return '<body>' +
		Templ.BodyHeader('Community') +
		BodyMain() +
		'</body>';
}

function BodyMain() {
	var S = '';

	Lm.Community.forEach(function(Community){
		S = S + '<div class="divCommunityBlock">'+
		'<h3>' + Community.Name + '</h3>' +
		Community.Description +
		'<br/>' +
		'Участников: <a class="divCommunityBlock_Users" href="/community/'+Community.Id+'/users">'+Community.Users.length+'</a>' +
		'<br/>' +
		'Проектов: ' +
		'<a class="divCommunityBlock_ProjectsOk" href="/community/'+Community.Id+'/projects-ok">2</a> + ' +
		'<a class="divCommunityBlock_ProjectsBad" href="/community/'+Community.Id+'/projects-bad">0</a> + ' +
		'<a class="divCommunityBlock_ProjectsRun" href="/community/'+Community.Id+'/projects-run">4</a> + ' +
		'<a class="divCommunityBlock_ProjectsFundBegin" href="/community/'+Community.Id+'/projects-fund-begin">8</a> + ' +
		'<a class="divCommunityBlock_ProjectsFundNon" href="/community/'+Community.Id+'/projects-fund-non">0</a> = ' +
		'<a class="divCommunityBlock_ProjectsAll" href="projects-1.html">14</a>' +
		'<br/>' +
		'Вес сообщества: <b>'+Community.Weight+'</b>' +
		'</div>';
	});

	return S;
}

function Main(req, res) {
	res.send('<!DOCTYPE html>' + '<html>' + Templ.Head('Community') + Body() + '</html>');
}

module.exports = Main;
