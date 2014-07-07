/**!
 * LibreMoney server 0.0.1
 * Author: Prof1983 <prof1983@yandex.ru>
 * License: CC0
 */

var express = require('express');
var path = require('path');

var Api = require(__dirname + "/api/index");
var CommunityPage = require(__dirname + "/pages/community");
var MainPage = require(__dirname + "/pages/main");
var Logger = require("./lib/logger")(module);
var ProjectsPage = require(__dirname + "/pages/projects");
var StartPage = require(__dirname + "/pages/start");
var UserPage = require(__dirname + "/pages/user");
var UsersPage = require(__dirname + "/pages/users");

var routes = require('./routes'); // Файл с роутам
var Db = require('./lib/db'); // Файл работы с базой MongoDB


// ==== Functions ====

function Log(Msg) {
	Logger.info(Msg);
}

function Start(App, Port, StartOk) {
	//var PageDir = __dirname + '/pages/';
	//appRoute = App.Route;
	//appRouter = App.Router;
	// Create a static file server

	// "Обучаем" наше приложение понимать JSON и urlencoded запросы
	//App.use(express.json());
	//App.use(express.urlencoded());

	/*
	App.use(express.favicon()); // отдаем стандартную фавиконку, можем здесь же свою задать
	App.use(express.logger('dev')); // выводим все запросы со статусами в консоль
	App.use(express.bodyParser()); // стандартный модуль, для парсинга JSON в запросах
	App.use(express.methodOverride()); // поддержка put и delete
	*/

	// Если произошла ошибка валидации, то отдаем 400 Bad Request
	App.use(function (err, req, res, next) {
		console.log(err.name);
		if (err.name == "ValidationError") {
			res.send(400, err);
		} else {
			next(err);
		}
	});

	// Если же произошла иная ошибка то отдаем 500 Internal Server Error
	App.use(function (err, req, res, next) {
		res.status(err.status || 500);
		log.error('Internal error(%d): %s', res.statusCode, err.message);
		res.send(500, err);
		return;
	});

	App.get('/', MainPage);
	App.get('/api', Api.GetMain);
	App.get('/api/user/:id', Api.GetUser);
	App.get('/api/users', Api.GetUsers);
	App.get("/api/broadcastTransaction", Api.BroadcastTransaction);
	App.get("/api/calculateFullHash", Api.CalculateFullHash);
	App.get("/api/cancelAskOrder", Api.CancelAskOrder);
	App.get("/api/cancelBidOrder", Api.CancelBidOrder);
	App.get("/api/castVote", Api.CastVote);
	App.get("/api/createPoll", Api.CreatePoll);
	App.get("/api/createTransaction", Api.CreateTransaction); // !!!!
	App.get("/api/decodeHallmark", Api.DecodeHallmark);
	App.get("/api/decodeToken", Api.DecodeToken);
	App.get("/api/generateToken", Api.GenerateToken);
	App.get("/api/getAccount", Api.GetAccount);
	App.get("/api/getAccountBlockIds", Api.GetAccountBlockIds);
	App.get("/api/getAccountId", Api.GetAccountId);
	App.get("/api/getAccountPublicKey", Api.GetAccountPublicKey);
	App.get("/api/getAccountTransactionIds", Api.GetAccountTransactionIds);
	App.get("/api/getAlias", Api.GetAlias);
	App.get("/api/getAliases", Api.GetAliases);
	App.get("/api/getAllAssets", Api.GetAllAssets);
	App.get("/api/getAsset", Api.GetAsset);
	App.get("/api/getAssets", Api.GetAssets);
	App.get("/api/getAssetIds", Api.GetAssetIds);
	App.get("/api/getAssetsByIssuer", Api.GetAssetsByIssuer);
	App.get("/api/getBalance", Api.GetBalance);
	App.get("/api/getBlock", Api.GetBlock);
	App.get("/api/getBlockchainStatus", Api.GetBlockchainStatus);
	App.get("/api/getConstants", Api.GetConstants);
	App.get("/api/getGuaranteedBalance", Api.GetGuaranteedBalance);
	App.get("/api/getMyInfo", Api.GetMyInfo);
	App.get("/api/getNextBlockGenerators", Api.GetNextBlockGenerators); // isTestnet
	App.get("/api/getPeer", Api.GetPeer);
	App.get("/api/getPeers", Api.GetPeers);
	App.get("/api/getPoll", Api.GetPoll);
	App.get("/api/getPollIds", Api.GetPollIds);
	App.get("/api/getProjectList", Api.GetProjectList);
	App.get("/api/getProjectListHtml", Api.GetProjectListHtml);
	App.get("/api/getState", Api.GetState);
	App.get("/api/getTime", Api.GetTime);
	App.get("/api/getTrades", Api.GetTrades);
	App.get("/api/getAllTrades", Api.GetAllTrades);
	App.get("/api/getTransaction", Api.GetTransaction);
	App.get("/api/getTransactionBytes", Api.GetTransactionBytes);
	App.get("/api/getUnconfirmedTransactionIds", Api.GetUnconfirmedTransactionIds);
	App.get("/api/getUnconfirmedTransactions", Api.GetUnconfirmedTransactions);
	App.get("/api/getAccountCurrentAskOrderIds", Api.GetAccountCurrentAskOrderIds);
	App.get("/api/getAccountCurrentBidOrderIds", Api.GetAccountCurrentBidOrderIds);
	App.get("/api/getAllOpenOrders", Api.GetAllOpenOrders);
	App.get("/api/getAskOrder", Api.GetAskOrder);
	App.get("/api/getAskOrderIds", Api.GetAskOrderIds);
	App.get("/api/getAskOrders", Api.GetAskOrders);
	App.get("/api/getBidOrder", Api.GetBidOrder);
	App.get("/api/getBidOrderIds", Api.GetBidOrderIds);
	App.get("/api/getBidOrders", Api.GetBidOrders);
	App.get("/api/issueAsset", Api.IssueAsset);
	App.get("/api/leaseBalance", Api.LeaseBalance);
	App.get("/api/markHost", Api.MarkHost);
	App.get("/api/parseTransaction", Api.ParseTransaction);
	App.get("/api/placeAskOrder", Api.PlaceAskOrder);
	App.get("/api/placeBidOrder", Api.PlaceBidOrder);
	App.get("/api/sendMessage", Api.SendMessage);
	App.get("/api/sendMoney", Api.SendMoney);
	App.get("/api/setAccountInfo", Api.SetAccountInfo);
	App.get("/api/setAlias", Api.SetAlias);
	App.get("/api/signTransaction", Api.SignTransaction);
	App.get("/api/startForging", Api.StartForging);
	App.get("/api/stopForging", Api.StopForging);
	App.get("/api/getForging", Api.GetForging);
	App.get("/api/transferAsset", Api.TransferAsset);
	App.get('/community', CommunityPage);
	App.get('/projects', ProjectsPage);
	App.get('/users', UsersPage);
	App.get('/user/1', UserPage);

	App.get('/hello', function(req, res) {
		res.send('Hello world');
	});

	App.get('/start', function(req, res) {
		StartPage.Main(req, res);
	});

	App.delete('/api/v0/user/:id', Api.DeleteUser);
	App.post('/api/v0/users', Api.PostUsers);
	App.put('/api/v0/user/:id', Api.PutUser);

	App.use(express.static(__dirname + '/public'));

	routes.Setup(App);

	// Если страница не найдена
	App.use(function(req, res, next){
		res.status(404);
		Logger.debug('Not found URL: %s',req.url);
		res.send('<!DOCTYPE html><html><body>Page not found. Go to <a href="/">Home</a>.</body></html>');
		return;
	});

	Db.Init(path.join(__dirname, "models"), function (err, data) {
		//console.log(Db.Model('community'));
		// Выводим сообщение об успешной инициализации базы данных
		//winston.info("All the models are initialized");
		App.listen(Port, function () {
			// Сервер запущен
			//winston.info("App running on port:" + config.get('port'));
			console.log('Express server started on port %s', Port);
		});
	});
}


exports.Start = Start;

