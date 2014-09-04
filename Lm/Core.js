/*!
 * LibreMoney Core Library 0.1
 * Copyright(c) 2014 LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

/*
import nxt.http.API;
import nxt.peer.Peers;
import nxt.user.Users;
import nxt.util.Logger;
import nxt.crypto.ReedSolomon;
*/


//var rootpath = process.cwd() + '/';
//var path = require('path');
//var fs = require('fs');
//var events = require('events');

var Accounts = require(__dirname + '/Accounts');
var Blockchain = require(__dirname + '/Blockchain');
var Blocks = require(__dirname + '/Blocks');
var Groups = require(__dirname + '/Groups');
var Projects = require(__dirname + '/Projects');
var Users = require(__dirname + '/Users');
var Transactions = require(__dirname + '/Transactions');
var Listeners = require(__dirname + '/Util/Listeners');
var Logger = require(__dirname + '/Logger').GetLogger(module);
var ThreadPool = require(__dirname + '/ThreadPool');


var defaultProperties;
var listeners = new Listeners();
var properties;
var version = "0.1.2";


var Event = {
	Clear:0,
	Shutdown:1,
	Start:2
	};


function AddListener(eventType, listener) {
	listeners.AddListener(eventType, listener);
}

function Clear() {
	Accounts.Clear();
	Groups.Clear();
	Projects.Clear();
	//Users.Clear();
	listeners.Notify(Event.Clear, null);
}

function Init(callback) {
	//long startTime = System.currentTimeMillis();

	Accounts.Init();
	Blocks.Init();
	Blockchain.Init();
	Groups.Init();
	Projects.Init();
	Users.Init();
	Transactions.Init();
	if (callback)
		callback(null);
	
	/*
	try {
		long startTime = System.currentTimeMillis();
		Logger.init();
		Db.init();
		BlockchainProcessorImpl.getInstance();
		TransactionProcessorImpl.getInstance();
		Peers.init();
		Generator.init();
		API.init();
		Users.init();
		DebugTrace.init();
		ThreadPool.start();

		long currentTime = System.currentTimeMillis();
		Logger.logMessage("Initialization took " + (currentTime - startTime) / 1000 + " seconds");
		Logger.logMessage("Nxt server " + VERSION + " started successfully.");
		if (Constants.isTestnet) {
			Logger.logMessage("RUNNING ON TESTNET - DO NOT USE REAL ACCOUNTS!");
		}
	} catch (Exception e) {
		Logger.logErrorMessage(e.getMessage(), e);
		System.exit(1);
	}
	*/

	/*
	defaultProperties = new Properties();
	console.log("Initializing Nxt server version " + version);
	try (InputStream is = ClassLoader.getSystemResourceAsStream("nxt-default.properties")) {
		if (is != null) {
			Nxt.defaultProperties.load(is);
		} else {
			String configFile = System.getProperty("nxt-default.properties");
			if (configFile != null) {
				try (InputStream fis = new FileInputStream(configFile)) {
					Nxt.defaultProperties.load(fis);
				} catch (IOException e) {
					throw new RuntimeException("Error loading nxt-default.properties from " + configFile);
				}
			} else {
				throw new RuntimeException("nxt-default.properties not in classpath and system property nxt-default.properties not defined either");
			}
		}
	} catch (IOException e) {
		throw new RuntimeException("Error loading nxt-default.properties", e);
	}
	*/

	/*
	properties = new Properties(defaultProperties);
	try (InputStream is = ClassLoader.getSystemResourceAsStream("nxt.properties")) {
		if (is != null) {
			Nxt.properties.load(is);
		} // ignore if missing
	} catch (IOException e) {
		throw new RuntimeException("Error loading nxt.properties", e);
	}
	*/
}

function GetVersion() {
	return version;
}

function Main(args) {
	throw new Error('Not implementted');
	/*
	Runtime.getRuntime().addShutdownHook(new Thread(new Runnable() {
		public void run() {
			Nxt.shutdown();
		}
	}));
	init();
	*/
}

function RemoveListener(eventType, listener) {
	listeners.RemoveListener(eventType, listener);
}

function Shutdown() {
	Logger.info("Shutting down...");
	ThreadPool.Shutdown();
	Logger.info("LibreMoney server " + version + " stopped.");
	listeners.Notify(Event.Shutdown, null);
}

function Start() {
	ThreadPool.Start();
	listeners.Notify(Event.Start, null);
}


exports.Event = Event;

exports.AddListener = AddListener;
exports.Clear = Clear;
exports.Init = Init;
exports.GetVersion = GetVersion;
exports.RemoveListener = RemoveListener;
exports.Shutdown = Shutdown;
exports.Start = Start;
