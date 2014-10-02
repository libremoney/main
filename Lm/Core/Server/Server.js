/**!
 * LibreMoney Server 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

if (typeof module !== "undefined") {
	var bodyParser = require('body-parser')
	var events = require('events');
	var express = require('express');
	var favicon = require('serve-favicon');
	var path = require('path');
	var util = require("util");

	var Api = require(__dirname + "/Api");
	var Config = require(__dirname + '/../../Config');
	var Logger = require(__dirname + "/../../Lib/Util/Logger").GetLogger(module);
	var ResponseHelper = require(__dirname + '/ResponseHelper');
}


var Server = function() {
	events.EventEmitter.call(this);
	var allowedBotHosts = new Array();
	var enforcePost1;
	var app;
	var port;
	var pubDir;
	return this;
}

util.inherits(Server, events.EventEmitter);

Server.prototype.GetPubDir = function() {
	return this.pubDir;
}

Server.prototype.Init = function(_app, _port, _pubDir, callback) {
	var Core = require(__dirname + '/../Core');
	var self = this;
	this.app = _app;
	this.port = _port;
	this.pubDir = _pubDir;
	/*
	Core.AddListener(Core.Event.Shutdown, function() {
		Shutdown();
	});
	*/
	Core.AddListener(Core.Event.Start, function() {
		self.Start();
	});

	/*
	app.use(express.logger('dev')); // выводим все запросы со статусами в консоль
	*/
	this.app.use(bodyParser.urlencoded({extended: false})); // parse application/x-www-form-urlencoded
	this.app.use(bodyParser.json()); // parse application/json

	this.app.use(ResponseHelper.End400);
	this.app.use(ResponseHelper.End500);
	//this.app.use('/', function(req, res){ResponseHelper.Main(req, res, self.pubDir)});
	this.app.use('/hello', ResponseHelper.Hello);
	//this.app.post('/hello', ResponseHelper.Hello);
	this.InitApi(this.app);
	Core.DoInitServer(this.app);
	this.app.use(favicon(this.pubDir+'/favicon.ico'));
	this.app.use(express.static(this.pubDir));
	this.app.use('/js/Lib', express.static(path.join(__dirname, '../../Lib')));
	this.app.use(ResponseHelper.End404);

	if (callback)
		callback();
}

Server.prototype.InitApi = function(app) {
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

Server.prototype.Shutdown = function() {
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

Server.prototype.Start = function() {
	var self = this;
	Logger.info('Starting...');
	this.app.listen(this.port, function () {
		Logger.info('Server started on port=' + self.port);
	});
}


var Server = new Server();


if (typeof module !== "undefined") {
	module.exports = Server;
}
