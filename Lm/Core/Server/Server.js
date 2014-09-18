/**!
 * LibreMoney server 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

//var bodyParser = require('body-parser')
var express = require('express');
var path = require('path');

var Api = require(__dirname + "/Api");
var Config = require(__dirname + '/../../Config');
var Core = require(__dirname + '/../Core');
var Logger = require(__dirname + "/../../Util/Logger").GetLogger(module);
var MainPage = require(__dirname + "/Pages/Main");
var StartPage = require(__dirname + "/Pages/Start");
var Test = require(__dirname + '/Test');


var TESTNET_API_PORT = 6876;
var allowedBotHosts = new Array();
var enforcePost1;

var app1;
var port1;

// ==== Functions ====

function Log(msg) {
	Logger.info(msg);
}

function Init(app, port, pubDir, callback) {
	app1 = app;
	port1 = port;
	/*
	Core.AddListener(Core.Event.Shutdown, function() {
		Shutdown();
	});
	*/
	Core.AddListener(Core.Event.Start, function() {
		Start();
	});

	//var PageDir = __dirname + '/pages/';
	//appRoute = App.Route;
	//appRouter = App.Router;
	// Create a static file server

	// "Обучаем" наше приложение понимать JSON и urlencoded запросы
	//App.use(express.json());
	//App.use(express.urlencoded());

	/*
	app.use(express.favicon()); // отдаем стандартную фавиконку, можем здесь же свою задать
	app.use(express.logger('dev')); // выводим все запросы со статусами в консоль
	// parse application/x-www-form-urlencoded
	app.use(bodyParser.urlencoded({ extended: false }));
	// parse application/json
	app.use(bodyParser.json());
	app.use(app.router); // модуль для простого задания обработчиков путей
	app.use(express.methodOverride()); // поддержка put и delete
	*/

	/*App.use(function (req, res, next) {
		next();
	});*/

	app.use(express.static(pubDir));

	Init400(app);
	Init500(app);
	InitApi(app);
	InitHello(app);
	InitStartPage(app);
	InitTest(app);
	Core.DoInitServer(app);
	Init404(app);

	if (callback)
		callback();
}

function Init400(app) {
	// Если произошла ошибка валидации, то отдаем 400 Bad Request
	app.use(function (err, req, res, next) {
		if (err.name == "ValidationError") {
			res.send(400, err);
		} else {
			next(err);
		}
	});
}

function Init404(app) {
	app.use(function(req, res, next){
		res.status(404);
		Logger.debug('Not found URL: %s',req.url);
		res.send('<!DOCTYPE html><html><body>Page not found. Go to <a href="/">Home</a>.</body></html>');
		return;
	});
}

function Init500(app) {
	// Если же произошла иная ошибка то отдаем 500 Internal Server Error
	app.use(function (err, req, res, next) {
		res.status(err.status || 500);
		Logger.error('Internal error(%d): %s', res.statusCode, err.message);
		res.send(500, err);
		return;
	});
}

function InitApi(app) {
	app.get('/', MainPage);
	app.get('/api', Api.GetMain);

	// Blockchain, BlockchainProcessor

	app.get("/api/getAccountBlockIds", Api.GetAccountBlockIds);
	app.get("/api/getAccountTransactionIds", Api.GetAccountTransactionIds);
	app.get("/api/getBlock", Api.GetBlock);
	app.get("/api/getBlockchainStatus", Api.GetBlockchainStatus);
	app.get("/api/getBlockId", Api.GetBlockId);

	// Core

	app.get("/api/calculateFullHash", Api.CalculateFullHash);
	app.get("/api/getConstants", Api.GetConstants);
	app.get("/api/getMyInfo", Api.GetMyInfo);
	app.get("/api/getState", Api.GetState);
	app.get("/api/getTime", Api.GetTime);
	app.get("/api/getVersion", Api.GetVersion);
	app.get("/api/signTransaction", Api.SignTransaction); // deprecated
	app.get("/api/decryptFrom", Api.DecryptFrom);
	app.get("/api/encryptTo", Api.EncryptTo);
	app.get("/api/rsConvert", Api.RsConvert);

	// TransactionProcessor

	app.get("/api/broadcastTransaction", Api.BroadcastTransaction);
	app.get("/api/getTransaction", Api.GetTransaction);
	app.get("/api/getTransactionBytes", Api.GetTransactionBytes);
	app.get("/api/getUnconfirmedTransactionIds", Api.GetUnconfirmedTransactionIds);
	app.get("/api/getUnconfirmedTransactions", Api.GetUnconfirmedTransactions);
	app.get("/api/parseTransaction", Api.ParseTransaction);
	app.get("/api/getAccountTransactions", Api.GetAccountTransactions);
}

function InitHello(app) {
	app.get('/hello', function(req, res) {
		res.send('Hello world');
	});
}

function InitStartPage(app) {
	app.get('/start', function(req, res) {
		StartPage.Main(req, res);
	});
}

function InitTest(app) {
	app.get("/test", Test);
}

function Shutdown() {
	/*
	API.shutdown();
	Users.shutdown();
	*/
	/*
	if (apiServer != null) {
		try {
			apiServer.stop();
		} catch (Exception e) {
			Logger.logDebugMessage("Failed to stop API server", e);
		}
	}
	*/
}

function Start() {
	Logger.info('Starting...');
	app1.listen(port1, function () {
		Logger.info('Server started on port='+port1);
	});
}


exports.Init = Init;
exports.Start = Start;
