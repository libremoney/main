/**!
 * LibreMoney 0.0
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */


var express = require("express");
var logfmt = require("logfmt");
var path = require("path");

var Config = require('./Lm/Config');
var Core = require("./Lm/Core");
var Db = require('./Lm/Db');
var Demo = require('./Lm/Demo');
var Lang = require('./Locale/Ru');
var Logger = require("./Lm/Logger").GetLogger(module);
var Server = require("./Lm/Server");

var BlockchainProcessor = require("./Lm/BlockchainProcessor");


// ==== Main ====

var App = express();
var Port = Number(process.env.PORT);

App.use(logfmt.requestLogger());

Config.Init(__dirname+'/Conf/Main.json', function(err) {
	if (err) {
		throw new Error('Error in Config.Init()');
	}
	Logger.info('Config initialized');
	if (!Port)
		Port = Number(Config.Get('port'));
	Core.Init(function(err) {
		if (err) throw 'Error in Core.Init()';
		Logger.info('Core initialized');
		Db.Init(path.join(__dirname, "/Lm/Db/Models"), function (err) {
			if (err) throw 'Error in Db.Init()';
			Db.Connect(function (err) {
				if (err) throw 'Error in Db.Connect()';
				Server.Init(App, function(err) {
					if (err) throw 'Error in Server.Init()';
					Logger.info('Server initialized');
					Server.Start(App, Port, function (err) {
						if (err) throw 'Error in Server.Start()';
						Logger.info('Server started');

						BlockchainProcessor.Init();
						Demo.Init();

					});
				});
			});
		});
	});
});
