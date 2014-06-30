/**!
 * LibreMoney 0.0.1
 * Author: Prof1983 <prof1983@yandex.ru>
 * License: CC0
 */


var express = require("express");
var logfmt = require("logfmt");

var Lm = require("./lm/Lm"); //require(nodepath.join(rootpath, 'lm/Lm'));
var Logger = require("./lib/logger")(module);
var Server = require("./server");
var config = require('./lib/config'); // Используемая конфигурация


// ==== Functions ====

// Init LibreMoney core
function InitLibreMoney(App) {
	Logger.info("LibreMoney: initializing");
	Lm.Init(App, InitLibreMoneySuccess);
}

function InitLibreMoneySuccess() {
	Logger.info("LibreMoney: initialized");
}


// ==== Main ====

var App = express();
var Port = Number(process.env.PORT || config.get('port'));

App.use(logfmt.requestLogger());
Server.Start(App, Port, function () {
	Logger.info('LibreMoney: server started');
});
InitLibreMoney(App);
