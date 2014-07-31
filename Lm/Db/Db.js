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


var models = {};


function AddPeer(peerAddress, callback) {
	var peerModel = models.peer;
	peerModel.findOne({address: peerAddress}, function(err, peer) {
		if (err) {
			if (callback)
				callback(err);
			return;
		}
		if (!peer) {
			var peer = new peerModel();
			peer.address = peerAddress;
			peer.save();
		}
		if (callback)
			callback(null);
	});
}

function Connect(uri, callback) {
	var sentinel = setTimeout(function() {
		if (callback)
			callback("failed to connect to MongoDB after one minute!");
	}, 60*1000); // 60 seconds
	
	var db = mongoose.connection;
	db.on('error', function (err) {
		throw 'Error in Db. err='+err;
		//if (callback)
		//	callback(err);
	});
	db.once('open', function () {
		// Connection is successful
		clearTimeout(sentinel);
		if (callback)
			callback();
	});

	mongoose.connect(uri);
}

function GetConnection() {
	return mongoose.connection;
}

function GetModel(modelName) {
	var name = modelName.toLowerCase();
	if (typeof models[name] == "undefined") {
		// Если модель на найдена, то создаем ошибку
		throw "Model '" + name + "' is not exist";
	}
	return models[name];
}

function Init(modelsDirectory, callback) {
	/*
	Core.AddListener(Core.Event.Shutdown, function() {
		Shutdown();
	});
	*/
	/*
	ResultSet rs = stmt.executeQuery("SELECT next_update FROM version");

	stmt.executeUpdate("CREATE TABLE version (next_update INT NOT NULL)");
	stmt.executeUpdate("INSERT INTO version VALUES (1)");
	*/

	InitModels(modelsDirectory, function (err, data) {
		if (err) {
			if (callback) {
				callback(err);
				return;
			} else
				throw new Error('Error in Db.Init()');
		}
		AddPeer('node.libremoney.com');
		if (callback)
			callback(err);
	});
}

function InitModels(modelsDirectory, callback) {
	var schemaList = fs.readdirSync(modelsDirectory);
	async.each(schemaList, function (item, cb) {
		var modelName = path.basename(item, '.js');
		var fn = path.join(modelsDirectory, modelName);
		models[modelName] = require(fn)(mongoose, modelName);
		cb();
	}, callback);
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


exports.Connect = Connect;
exports.GetConnection = GetConnection;
exports.GetModel = GetModel;
exports.Init = Init;
exports.Models = models;
exports.Shutdown = Shutdown;
