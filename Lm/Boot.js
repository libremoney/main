/*!
 * LibreMoney Boot 0.1
 * Copyright(c) 2014 LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var path = require("path");

var Config = require(__dirname + '/Config');
var Core = require(__dirname + '/Core');
var Db = require(__dirname + '/Db');
//var Demo = require(__dirname + '/Demo');
var Logger = require(__dirname + '/Util/Logger').GetLogger(module);

/*
var AccountControl = require(__dirname + '/Modules/AccountControl');
var Aliases = require(__dirname + '/Modules/Aliases');
var ColoredCoins = require(__dirname + '/Modules/ColoredCoins');
var DigitalGoods = require(__dirname + '/Modules/DigitalGoods');
*/
var Groups = require(__dirname + '/Modules/Groups');
/*
var Generators = require(__dirname + '/Modules/Generators');
var Messages = require(__dirname + '/Modules/Messages');
*/
var Payments = require(__dirname + '/Modules/Payments');
var Projects = require(__dirname + '/Modules/Projects');
/*
var Tokens = require(__dirname + '/Modules/Tokens');
var Trades = require(__dirname + '/Modules/Trades');
var Users = require(__dirname + '/Modules/Users');
var UserServer = require(__dirname + '/Modules/UserServer');
*/


var app;
var port;


function Boot(app1, port1, callback) {
	app = app1;
	port = port1;
	InitConfig(function() {
		InitCore(function() {
			InitModules(function() {
				InitDb(function () {
					Connect(function () {
						/*Demo.Init(function(err) {
							if (err) {
								throw 'Error in Demo.Init()';
								return;
							}*/
							Start(function(err) {
								Logger.info('Started');
							});
						//});
					});
				});
			});
		});
	});
}

function Connect(callback) {
	var dbUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || Config.Get('mongoose:uri');
	Db.Connect(dbUri, function (err) {
		if (err) {
			throw 'Error in Db.Connect()';
			return;
		}
		Logger.info('Db connected');
		callback();
	});
}

function InitConfig(callback) {
	Config.Init(__dirname+'/../Conf/Main.json', function(err) {
		if (err) {
			throw new Error('Error in Config.Init()');
			return;
		}
		Logger.info('Config initialized');
		callback();
	});
}

function InitCore(callback) {
	Core.Init(function(err) {
		if (err) {
			throw 'Error in Core.Init()';
			return;
		}
		Logger.info('Core initialized');
		callback();
	});
}

function InitDb(callback) {
	Db.Init(path.join(__dirname, "/Db/Models"), function (err) {
		if (err) {
			throw 'Error in Db.Init()';
			return;
		}
		Logger.info('Db initialized');
		var dbUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || Config.Get('mongoose:uri');
		callback();
	});
}

function InitModules(callback) {
	/*
	AccountControl.Init();
	Aliases.Init();
	ColoredCoins.Init();
	DigitalGoods.Init();
	*/
	Groups.Init();
	/*
	Generators.Init();
	Messages.Init();
	*/
	Payments.Init();
	Projects.Init();
	/*
	Users.Init();
	Tokens.Init();
	Trades.Init();
	UserServer.Init();
	*/
	callback();
}

function Start(callback) {
	Logger.info('Starting...');
	if (!port)
		port = Number(Config.Get('port'));
	Core.Start(app, port, __dirname + '/../Public', function(err) {
		callback(err);
	});
}


module.exports = Boot;
