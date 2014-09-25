/**!
 * LibreMoney main page 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */


var Templ = require(__dirname + "/Templ");


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
	res.send('<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=index.html"></head></html>');
	//res.send('<!DOCTYPE html>' + '<html>' + Templ.Head('Home') + Body() + '</html>');
}


module.exports = Main;
