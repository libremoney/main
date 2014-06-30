/**!
 * LibreMoney main page 0.0.1
 * Author: Prof1983 <prof1983@yandex.ru>
 * License: CC0
 */

Templ = require(__dirname + "/templ");

function Body() {
	return '<body>' +
		Templ.BodyHeader() +
		BodyMain() +
		//Templ.BodyFooter() +
		'</body>';
}

function BodyMain() {
	return '<main><div>' +
		'<h1></h1>' +
		//Перейти на основной сайт <a href="http://libremoney.org/">LibreMoney.org</a>
		'Go to the main site <a href="http://libremoney.org/">LibreMoney.org</a>' +

		'<div id="divMenu">' +
		'<a href="community"><div class="divBlock divMenuCommunity" id="divMenuCommunity">Community</div></a>' + // Сообщества
		'<a href="users"><div class="divBlock divMenuUsers" id="divMenuUsers">Users</div></a>' + // Пользователи
		'<a href="projects"><div class="divBlock divMenuProjects" id="divMenuProjects">Projects</div></a>' + // Проекты
		'<a href="transactions.html"><div class="divBlock divMenuTransactions" id="divMenuTransactions">Transactions</div></a>' + // Транзакции
		'<a href="proto"><div class="divBlock divMenuCommunity">Prototype</div></a>' +
		//<div>Контракты</div>
		//<div>Торговля</div>
		//<div>Инвестиции</div>
		//<div id="divMenuLogin">Войти</div>
		//<div id="divMenuRegister">Зарегистрироваться</div>
		//<div id="divMenuLogin">Login</div>
		//<div id="divMenuRegister">Sign</div>
		'</div>' +
		'</div></main>';
}

function Main(req, res) {
	res.send('<!DOCTYPE html>' + '<html>' + Templ.Head('Home') + Body() + '</html>');

	/*
	res.write('<!DOCTYPE html>');
	res.write('<html>');
	res.write('<head>');
	res.write('<meta charset="utf-8" />');
	res.write('<title>LibreMoney</title>');
	res.write('<style>');
	res.write("@import url('./css/main.css');");
	res.write('</style>');
	res.write('</head>');
	res.write('<body>');
	res.write('<style>');
	res.write('</style>');
	res.write('<main class="myMain1">');
	res.write('<h1>LibreMoney</h1>');
	res.write('<p>Сайт в разработке.</p>');
	res.write('<a href="index.html">');
	res.write('<img alt="Сайт в разработке" src="./img/work-128.png" />');
	res.write('</a>');
	res.write('<br/><a href="start">Start</a>');
	res.write('</main>');
	res.write('<footer class="myFooter1">');
	res.write('&copy; LibreMoney 2014');
	res.write('</footer>');
	res.write('<center>');
	res.write('Version: 0.0.1');
	res.write('<br/>');
	res.write('</center>');
	res.write('</body>');
	res.write('</html>');
	res.end();
	*/
}

module.exports = Main;
