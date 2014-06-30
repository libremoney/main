/**!
 * LibreMoney projects page 0.0.1
 * Author: Prof1983 <prof1983@yandex.ru>
 * License: CC0
 */

Lm = require(__dirname + "/../lm/Lm");
Templ = require(__dirname + "/templ");


function Body() {
	return '<body>' +
		Templ.BodyHeader() +
		BodyMain() +
		'</body>';
}

function BodyMain() {
	var S = '';

	Lm.Projects.forEach(function (Project) {
		if (Project.State == 0)
			ps = '<font color="black">Анонс</font>'
		else if (Project.State == 1)
			ps = '<font color="black">Сбор средств</font>'
		else if (Project.State == 2)
			ps = '<font color="gray">Выполняется</font>'
		else if (Project.State == 3)
			ps = '<font color="green">Сделано</font>'
		else
			ps = '<font color="black">Не известно</font>';
		S = S + '<div class="divProjectBlock">' +
			'<h3>'+Project.Name+'</h3>' +
			Project.Description +
			'<br/>' +
			ps +
			'<br/>' +
			'<b>'+Project.Sum1+' / '+Project.Sum2+'</b>' +
			'</div>';
	});

	return '<h1>Projects from all community</h1>' + S;
}

function Main(req, res) {
	res.send('<!DOCTYPE html>' + '<html>' + Templ.Head('Home') + Body() + '</html>');
}


module.exports = Main;
