/**!
 * LibreMoney users page 0.0.1
 * Author: Prof1983 <prof1983@yandex.ru>
 * License: CC0
 */

Templ = require(__dirname + "/templ");

function Body() {
	return '<body>' +
		Templ.BodyHeader('Users') +
		BodyMain() +
		'</body>';
}

function BodyMain() {
	return '<h1>All users</h1>' +
		'Goto to the main site <a href="http://libremoney.org/">LibreMoney.org</a>' +

		'<div>' +

		'<div class="divBlock divUserBlock">' +
		'<a href="user/1"><h3>Prof1983</h3></a>' +
		'<a href="mailto:prof1983@yandex.ru">prof1983@yandex.ru</a>' +
		'<br/>' +
		'<a href="http://prof1983.info">prof1983.info</a>' +
		'<br/>' +
		'Проекты: ' +
		'<a class="divCommunityBlock_ProjectsOk" href="user/1/projects-ok">2</a>' +
		' + ' +
		'<a class="divCommunityBlock_ProjectsBad" href="user/1/projects-bad">0</a>' +
		' + ' +
		'<a class="divCommunityBlock_ProjectsRun" href="user/1/projects-run">4</a>' +
		' + ' +
		'<a class="divCommunityBlock_ProjectsFundBegin" href="user/1/projects-fund-begin">8</a>' +
		' + ' +
		'<a class="divCommunityBlock_ProjectsFundNon" href="user/1/projects-fund-non">0</a>' +
		' = ' +
		'<a class="divCommunityBlock_ProjectsAll" href="user/1/projects">14</a>' +
		'<br/>' +
		'Вес: 1.000' +
		'</div>' +

		'</div>';	
}

function Main(req, res) {
	res.send('<!DOCTYPE html>' + '<html>' + Templ.Head('Users') + Body() + '</html>');
}

module.exports = Main;
