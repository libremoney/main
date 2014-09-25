/**!
 * LibreMoney users page 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var Templ = require(__dirname + "/Templ");


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
		'<a class="divGroupsBlock_ProjectsOk" href="user/1/projects-ok">2</a>' +
		' + ' +
		'<a class="divGroupsBlock_ProjectsBad" href="user/1/projects-bad">0</a>' +
		' + ' +
		'<a class="divGroupsBlock_ProjectsRun" href="user/1/projects-run">4</a>' +
		' + ' +
		'<a class="divGroupsBlock_ProjectsFundBegin" href="user/1/projects-fund-begin">8</a>' +
		' + ' +
		'<a class="divGroupsBlock_ProjectsFundNon" href="user/1/projects-fund-non">0</a>' +
		' = ' +
		'<a class="divGroupsBlock_ProjectsAll" href="user/1/projects">14</a>' +
		'<br/>' +
		'Вес: 1.000' +
		'</div>' +

		'</div>';	
}

function Main(req, res) {
	res.send('<!DOCTYPE html>' + '<html>' + Templ.Head('Users') + Body() + '</html>');
}

module.exports = Main;
