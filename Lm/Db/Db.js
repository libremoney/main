/**!
 * LibreMoney Db 0.0
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

/*
import org.h2.jdbcx.JdbcConnectionPool;
private static volatile JdbcConnectionPool cp;
private static volatile int maxActiveConnections;
*/


var mongoose = require('mongoose');
var fs = require('fs');
var path = require('path');
var async = require('async');

var Config = require(__dirname + '/../Config');


var models = {};


function Connect(callback) {
	mongoose.connect(Config.Get('mongoose:uri'));
	var db = mongoose.connection;

	db.on('error', function (err) {
		// Обрабатываем ошибку
	});
	db.once('open', function callback() {
		// Соединение прошло успешно
	});

	if (callback)
		callback(null);
}

/*
function getModel (db) {
    var name = 'Test';
    return db.model(name) || db.model(name, Test, 'test');
}
*/

function Init(modelsDirectory, callback) {
	//throw new Error('Not implementted');
	/*
	long maxCacheSize = Nxt.getIntProperty("nxt.dbCacheKB");
	if (maxCacheSize == 0) {
		maxCacheSize = Runtime.getRuntime().maxMemory() / (1024 * 2);
	}
	String dbUrl = Constants.isTestnet ? Nxt.getStringProperty("nxt.testDbUrl") : Nxt.getStringProperty("nxt.dbUrl");
	if (! dbUrl.contains("CACHE_SIZE=")) {
		dbUrl += ";CACHE_SIZE=" + maxCacheSize;
	}
	Logger.logDebugMessage("Database jdbc url set to: " + dbUrl);
	cp = JdbcConnectionPool.create(dbUrl, "sa", "sa");
	cp.setMaxConnections(Nxt.getIntProperty("nxt.maxDbConnections"));
	cp.setLoginTimeout(Nxt.getIntProperty("nxt.dbLoginTimeout"));
	int defaultLockTimeout = Nxt.getIntProperty("nxt.dbDefaultLockTimeout") * 1000;
	try (Connection con = cp.getConnection();
		 Statement stmt = con.createStatement()) {
		stmt.executeUpdate("SET DEFAULT_LOCK_TIMEOUT " + defaultLockTimeout);
	} catch (SQLException e) {
		throw new RuntimeException(e.toString(), e);
	}
	DbVersion.init();
	*/

	InitModels(modelsDirectory, function (err, data) {
		if (err) {
			if (callback)
				callback(err)
			else
				throw new Error('Error in Db.Init()');
		}
		//console.log(Db.Model('community'));
		// Выводим сообщение об успешной инициализации базы данных
		//winston.info("All the models are initialized");
		if (callback)
			callback(null);
	});
}

function InitModels(modelsDirectory, callback) {
	// Считываем список файлов из modelsDirectory
	var schemaList = fs.readdirSync(modelsDirectory);
	// Создаем модели Mongoose и вызываем callback, когда все закончим
	async.each(schemaList, function (item, cb) {
		var modelName = path.basename(item, '.js');
		models[modelName] = require(path.join(modelsDirectory, modelName))(mongoose);
		cb();
	}, callback);
}

// Возвращаем уже созданные модели из списка
function Model(modelName) {
	var name = modelName.toLowerCase();
	if (typeof models[name] == "undefined") {
		// Если модель на найдена, то создаем ошибку
		throw "Model '" + name + "' is not exist";
	}
	return models[name];
}

function Shutdown() {
	throw new Error('Not implementted');
	/*
	if (cp != null) {
		try (Connection con = cp.getConnection();
			 Statement stmt = con.createStatement()) {
			stmt.execute("SHUTDOWN COMPACT");
			Logger.logMessage("Database shutdown completed");
		} catch (SQLException e) {
			Logger.logDebugMessage(e.toString(), e);
		}
		//cp.dispose();
		cp = null;
	}
	*/
}

function GetConnection() {
	throw new Error('Not implementted');
	/*
	Connection con = cp.getConnection();
	con.setAutoCommit(false);
	int activeConnections = cp.getActiveConnections();
	if (activeConnections > maxActiveConnections) {
		maxActiveConnections = activeConnections;
		Logger.logDebugMessage("Database connection pool current size: " + activeConnections);
	}
	return con;
	*/
}


exports.Connect = Connect;
exports.GetConnection = GetConnection;
exports.Init = Init;
exports.Model = Model;
exports.Models = models;
exports.Shutdown = Shutdown;
