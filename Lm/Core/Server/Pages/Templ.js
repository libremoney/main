/**!
 * LibreMoney main page 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

function BodyFooter() {
	return '<footer class="myFooter1">' +
		'&copy; LibreMoney 2014' +
		'</footer>' +
		'<center>' +
		'Version: 0.1' +
		'<br/>' +
		'</center>';
}

function BodyHeader() {
	return '<header class="header">' +

		'<a href="http://libremoney.com/" class="logo" id="logo" data-page="dashboard">' +
		'  <img src="/img/logo.png" />' +
		'</a>' +

		'<nav class="navbar navbar-static-top" role="navigation">' +
		'<a href="#" class="navbar-btn sidebar-toggle" data-toggle="offcanvas" role="button">' +
		  '<span class="sr-only">Toggle navigation</span>' +
		  '<span class="icon-bar"></span>' +
		  '<span class="icon-bar"></span>' +
		  '<span class="icon-bar"></span>' +
		'</a>' +

		'<div class="navbar-right">' +
		  '<ul class="nav navbar-nav">' +
		    '<li class="dropdown">' +
		      '<a href="/" style="font-weight:bold;">Home</a>' +
		    '</li>' +
		    '<li class="dropdown">' +
		      '<a href="/about.html" style="font-weight:bold;">About</a>' +
		    '</li>' +
		    '<li class="dropdown">' +
		      '<a href="/community" style="font-weight:bold;">Community</a>' +
		    '</li>' +
		    '<li class="dropdown">' +
		      '<a href="/projects" style="font-weight:bold;">Projects</a>' +
		    '</li>' +
		    '<li class="dropdown">' +
		      '<a href="/login.html" style="font-weight:bold;">Login</a>' +
		    '</li>' +
		  '</ul>' +
		'</div>' +
		'</nav>' +

		'</header>';
}

function Head(Title) {
	return '<head>' +
		'<meta charset="utf-8" />' +
		'<link href="/css/bootstrap.min.css" rel="stylesheet" type="text/css" />' +
		'<link href="/css/main.css" rel="stylesheet" type="text/css" />' +
		'<link href="/css/app.css" rel="stylesheet" type="text/css" />' +
		'<title>' + Title + ' - LibreMoney</title>' +
		'</head>';
}


exports.BodyFooter = BodyFooter;
exports.BodyHeader = BodyHeader;
exports.Head = Head;
