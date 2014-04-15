// LibreMoney start page 0.0.1

// ---- Functions ----

function Body() {
	return '<body>'+
		BodyAuth()+
		BodyMain()+
		BodyFooter()+
		'</body>';
}

function BodyAuth() {
	return '<div class="auth">'+
		'<a href="/auth/vk" class="oauth oauth-vkontakte first" rel="nofollow" title="Войти через ВКонтакте"></a>'+
		'<a class="oauth oauth-mail" rel="nofollow" title="Войти через Mail.Ru" href="/auth/mail"></a>'+
		'<a class="oauth oauth-facebook" rel="nofollow" title="Войти через Facebook" href="/auth/facebook"></a>'+
		'<a rel="nofollow" class="oauth oauth-twitter last" title="Войти через Twitter" href="/auth/twitter"></a>'+
		'</div>';
	// chtodelat.com
}

function BodyFooter() {
	return '<footer>'+
		'&copy; LibreMoney 2014'+
		'</footer>';
}

function BodyMain() {
	return '<main>'+

		'<h1>LibreMoney</h1>'+

		'<h2>Инструменты</h2>'+

		'<ul>'+
		'<li><a href="https://github.com/node-inspector/node-inspector">Отладчик для NodeJs</a></li>'+
		'</ul>'+

		'<h2>Полезное</h2>'+

		'<ul>'+
		'<li><a href="http://habrahabr.ru/post/138071/">Разработка WEB-проекта на Node.JS: Часть 1</a></li>'+
		'</ul>'+

		'</main>';
}

function Main(req, res) {

	function Head() {
		return '<head>'+
				//<meta name="viewport" content="width=device-width, minimum-scale=0.40, initial-scale=0.40" />
				'<meta charset="utf-8" />'+
				'<title>LibreMoney</title>'+
				'<style>'+
					'@import url(\'css/main.css\');'+
				'</style>'+
			'</head>';
	}

	console.log("Request handler 'start' was called.");

	var body = '<!DOCTYPE html>'+
		'<html>'+
		Head()+
		Body()+
		'</html>';

	res.writeHead(200, {"Content-Type": "text/html"});
	res.write(body);
	res.end();
}


// ---- Exports ----

exports.Main = Main;
