/**!
 * LibreMoney 0.0
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */


var express = require("express");
var logfmt = require("logfmt");
var path = require("path");

var BlockchainProcessor = require("./Lm/BlockchainProcessor");
var Config = require('./Lm/Config');
var Core = require("./Lm/Core");
var Db = require('./Lm/Db');
var Demo = require('./Lm/Demo');
var Logger = require("./Lm/Logger").GetLogger(module);
var Server = require("./Lm/Server");
var TransactionProcessor = require("./Lm/TransactionProcessor");


// ==== Main ====

var app = express();
var port = Number(process.env.PORT);

app.use(logfmt.requestLogger());

Config.Init(__dirname+'/Conf/Main.json', function(err) {
	if (err) throw new Error('Error in Config.Init()');
	Logger.info('Config initialized');
	if (!port)
		port = Number(Config.Get('port'));
	Core.Init(function(err) {
		if (err) throw 'Error in Core.Init()';
		Logger.info('Core initialized');
		Db.Init(path.join(__dirname, "/Lm/Db/Models"), function (err) {
			if (err) throw 'Error in Db.Init()';
			Logger.info('Db initialized');
			var dbUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || Config.Get('mongoose:uri');
			console.log('==== dbUri='+dbUri);
			Db.Connect(dbUri, function (err) {
				if (err) throw 'Error in Db.Connect()';
				Logger.info('Db connected');
				TransactionProcessor.Init(function(err){
					if (err) throw 'Error in TransactionProcessor.Init()';
					Logger.info('TransactionProcessor initialized');
					//BlockchainProcessor.Init(function(err) {
						//if (err) throw 'Error in BlockchainProcessor.Init()';
						//Logger.info('BlockchainProcessor initialized');
						Server.Init(app, port, function(err) {
							if (err) throw 'Error in Server.Init()';
							Logger.info('Server initialized');
							Demo.Init(function(err) {
								if (err) throw 'Error in Demo.Init()';
								Logger.info('Starting...');
								Core.Start();
							});
						});
					//});
				});
			});
		});
	});
});
