/**!
 * LibreMoney Server ResponseHelper 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

if (typeof module !== "undefined") {
	var fs = require('fs');
	var mime = require('mime');
	var path = require('path');
	var url = require('url');
	var Logger = require(__dirname + "/../../Lib/Util/Logger").GetLogger(module);
}


var ResponseHelper = function() {};

ResponseHelper.End200Json = function(res, data) {
	res.writeHead(200, {
		"Content-Type": "application/json"
	});
	res.write(JSON.stringify(data));
	res.end();
}

ResponseHelper.End200Text = function(res, data) {
	res.writeHead(200, {
		"Content-Type": "text/plain"
	});
	res.write(data);
	res.end();
}

// 400 Bad Request
ResponseHelper.End400 = function(err, req, res, next) {
	if (err.name == "ValidationError") {
		res.send(400, err);
	} else {
		next(err);
	}
}

ResponseHelper.End404 = function(req, res, next) {
	res.writeHead(404, {
		"Content-Type": "text/html"
	});
	Logger.debug('Not found URL: %s', req.url);
	res.write('<!DOCTYPE html><html><head><meta http-equiv="refresh" content="5; url=/"></head>' +
		'<body>Page not found. You will be automatically redirected to the homepage in 5 seconds.' +
		' Click <a href="/">here</a> if you do not want to wait.</body></html>');
	res.end();
}

ResponseHelper.End403 = function(err, req, res, next) {
	res.writeHead(403, {
		"Content-Type": "text/plain"
	});
	res.write("You can't access this area.");
	res.end();
}

// response, err
ResponseHelper.End500 = function(err, req, res, next) {
	res.writeHead(err.status || 500, {
		"Content-Type": "text/plain"
	});
	//res.status(err.status || 500);
	Logger.error('Internal Server Error(%d): %s', res.statusCode, err.message);
	res.write(500, err);
	res.end();
}

ResponseHelper.Hello = function(req, res) {
	res.writeHead(200, {
		"Content-Type": "text/plain"
	});
	res.write('Hello world!\n');
	res.write('method=' + req.method + '\n');
	res.end();
}

ResponseHelper.Main = function(req, res, pubDir) {
	var urlParts = url.parse(req.url, true);
	var pathname = urlParts.pathname;
	if (pathname == "/") {pathname = "/index.html"}
	var staticFilesPath = pubDir;
	var filename = path.join(staticFilesPath, pathname);
	fs.exists(filename, function(exists) {
		if (!exists) {
			console.log("No request handler found for " + pathname);
			ResponseHelper.End404(req, res);
			return;
		}
		if (fs.statSync(filename).isDirectory()) {
			ResponseHelper.End403(req, res);
			return;
		}
		fs.readFile(filename, "binary", function(err, file) {
			if (err) {
				ResponseHelper.End500(err, req, res);
				return;
			}
			var type = mime.lookup(filename);
			res.writeHead(200, {
				"Content-Type": type
			});
			res.write(file, "binary");
			res.end();
		});
	});
	//res.send('<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=index.html"></head><body>Go to <a href="/index.html">index.html</a></body></html>');
}


if (typeof module !== "undefined") {
	module.exports = ResponseHelper;
}
