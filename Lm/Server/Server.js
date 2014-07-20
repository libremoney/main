/**!
 * LibreMoney server 0.0
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

//var bodyParser = require('body-parser')
var express = require('express');
var path = require('path');

var Logger = require(__dirname + "/../Logger").GetLogger(module);

var Api = require(__dirname + "/Api");
var GroupsPage = require(__dirname + "/Pages/Groups");
var MainPage = require(__dirname + "/Pages/Main");
var ProjectsPage = require(__dirname + "/Pages/Projects");
var StartPage = require(__dirname + "/Pages/Start");
var UserPage = require(__dirname + "/Pages/User");
var UsersPage = require(__dirname + "/Pages/Users");

//var routes = require('./routes'); // Файл с роутам
//var Db = require('./lib/db'); // Файл работы с базой MongoDB


// ==== Functions ====

function Log(msg) {
	Logger.info(msg);
}

function Init(app, callback) {
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
		console.log('1111: '+req.body);
		next();
	});*/

	Init400(app);
	Init500(app);
	InitApi(app);
	InitHello(app);
	InitStartPage(app);

	app.get('/groups', GroupsPage);
	app.get('/projects', ProjectsPage);
	app.get('/users', UsersPage);
	app.get('/user/1', UserPage);

	app.delete('/api/v0/user/:id', Api.DeleteUser);
	app.post('/api/v0/users', Api.PostUsers);
	app.put('/api/v0/user/:id', Api.PutUser);

	app.use(express.static(__dirname + '/../../Public'));

	//routes.Setup(app);

	Init404(app);

	if (callback)
		callback();
}

function Init400(app) {
	// Если произошла ошибка валидации, то отдаем 400 Bad Request
	app.use(function (err, req, res, next) {
		console.log(err.name);
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
	app.post('/api', Api.PostMain);
	app.get('/', MainPage);
	app.get('/api', Api.GetMain);
	app.get('/api/user/:id', Api.GetUser);
	app.get('/api/users', Api.GetUsers);
	app.get("/api/broadcastTransaction", Api.BroadcastTransaction);
	app.get("/api/calculateFullHash", Api.CalculateFullHash);
	app.get("/api/cancelAskOrder", Api.CancelAskOrder);
	app.get("/api/cancelBidOrder", Api.CancelBidOrder);
	app.get("/api/castVote", Api.CastVote);
	app.get("/api/createPoll", Api.CreatePoll);
	app.get("/api/createTransaction", Api.CreateTransaction); // !!!!
	app.get("/api/decodeHallmark", Api.DecodeHallmark);
	app.get("/api/decodeToken", Api.DecodeToken);
	app.get("/api/generateToken", Api.GenerateToken);
	app.get("/api/getAccount", Api.GetAccount);
	app.get("/api/getAccountBlockIds", Api.GetAccountBlockIds);
	app.get("/api/getAccountId", Api.GetAccountId);
	app.get("/api/getAccountPublicKey", Api.GetAccountPublicKey);
	app.get("/api/getAccountTransactionIds", Api.GetAccountTransactionIds);
	app.get("/api/getAlias", Api.GetAlias);
	app.get("/api/getAliases", Api.GetAliases);
	app.get("/api/getAllAssets", Api.GetAllAssets);
	app.get("/api/getAsset", Api.GetAsset);
	app.get("/api/getAssets", Api.GetAssets);
	app.get("/api/getAssetIds", Api.GetAssetIds);
	app.get("/api/getAssetsByIssuer", Api.GetAssetsByIssuer);
	app.get("/api/getBalance", Api.GetBalance);
	app.get("/api/getBlock", Api.GetBlock);
	app.get("/api/getBlockchainStatus", Api.GetBlockchainStatus);
	app.get("/api/getConstants", Api.GetConstants);
	app.get("/api/getGuaranteedBalance", Api.GetGuaranteedBalance);
	app.get("/api/getMyInfo", Api.GetMyInfo);
	app.get("/api/getNextBlockGenerators", Api.GetNextBlockGenerators); // isTestnet
	app.get("/api/getPeer", Api.GetPeer);
	app.get("/api/getPeers", Api.GetPeers);
	app.get("/api/getPoll", Api.GetPoll);
	app.get("/api/getPollIds", Api.GetPollIds);
	app.get("/api/getProjectList", Api.GetProjectList);
	app.get("/api/getProjectListHtml", Api.GetProjectListHtml);
	app.get("/api/getState", Api.GetState);
	app.get("/api/getTime", Api.GetTime);
	app.get("/api/getTrades", Api.GetTrades);
	app.get("/api/getAllTrades", Api.GetAllTrades);
	app.get("/api/getTransaction", Api.GetTransaction);
	app.get("/api/getTransactionBytes", Api.GetTransactionBytes);
	app.get("/api/getUnconfirmedTransactionIds", Api.GetUnconfirmedTransactionIds);
	app.get("/api/getUnconfirmedTransactions", Api.GetUnconfirmedTransactions);
	app.get("/api/getAccountCurrentAskOrderIds", Api.GetAccountCurrentAskOrderIds);
	app.get("/api/getAccountCurrentBidOrderIds", Api.GetAccountCurrentBidOrderIds);
	app.get("/api/getAllOpenOrders", Api.GetAllOpenOrders);
	app.get("/api/getAskOrder", Api.GetAskOrder);
	app.get("/api/getAskOrderIds", Api.GetAskOrderIds);
	app.get("/api/getAskOrders", Api.GetAskOrders);
	app.get("/api/getBidOrder", Api.GetBidOrder);
	app.get("/api/getBidOrderIds", Api.GetBidOrderIds);
	app.get("/api/getBidOrders", Api.GetBidOrders);
	app.get("/api/issueAsset", Api.IssueAsset);
	app.get("/api/leaseBalance", Api.LeaseBalance);
	app.get("/api/markHost", Api.MarkHost);
	app.get("/api/parseTransaction", Api.ParseTransaction);
	app.get("/api/placeAskOrder", Api.PlaceAskOrder);
	app.get("/api/placeBidOrder", Api.PlaceBidOrder);
	app.get("/api/sendMessage", Api.SendMessage);
	app.get("/api/sendMoney", Api.SendMoney);
	app.get("/api/setAccountInfo", Api.SetAccountInfo);
	app.get("/api/setAlias", Api.SetAlias);
	app.get("/api/signTransaction", Api.SignTransaction);
	app.get("/api/startForging", Api.StartForging);
	app.get("/api/stopForging", Api.StopForging);
	app.get("/api/getForging", Api.GetForging);
	app.get("/api/transferAsset", Api.TransferAsset);
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

function Start(app, port, callback) {
	app.listen(port, function () {
		console.log('Express server started on port %s', port);
		if (callback) callback(null);
	});
}


exports.Init = Init;
exports.Start = Start;
