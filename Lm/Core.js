/*!
 * LibreMoney Core Library 0.0
 * Copyright(c) 2014 LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

/*
import nxt.http.API;
import nxt.peer.Peers;
import nxt.user.Users;
import nxt.util.Logger;
import nxt.util.ThreadPool;
import nxt.crypto.ReedSolomon;
*/


//var rootpath = process.cwd() + '/';
//var path = require('path');
//var fs = require('fs');
//var events = require('events');

var Accounts = require(__dirname + '/Accounts');
var Blocks = require(__dirname + '/Blocks');
var Groups = require(__dirname + '/Groups');
var Projects = require(__dirname + '/Projects');
var Users = require(__dirname + '/Users');
var Transactions = require(__dirname + '/Transactions');
var Logger = require(__dirname + '/Logger').GetLogger(module);


var version = "0.0.6";


function Log(msg) {
	Logger.info(msg);
}


function Init(callback) {
	Accounts.Init();
	Groups.Init();
	Projects.Init();
	Users.Init();
	Transactions.Init();
	if (callback)
		callback(null);
	
	/*
	long startTime = System.currentTimeMillis();

	Logger.logMessage("logging enabled");
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
	Logger.logDebugMessage("Initialization took " + (currentTime - startTime) / 1000 + " seconds");
	Logger.logMessage("Nxt server " + VERSION + " started successfully.");
	if (Constants.isTestnet) {
		Logger.logMessage("RUNNING ON TESTNET - DO NOT USE REAL ACCOUNTS!");
	}
	*/
}

/**
 * Load the application configuration
 * Configure the logging
 * Configure the theme
 * Load the modules
 * Initialise the modules
 *
 * @argument config
 *
 */
function InitialiseLm(reloadConfig) {
	// Check if we need to reload the config from disk (e.g. from cluster mode)
	if (reloadConfig) {
		return; //calipso.config.load(finish);
	} else {
		/*
		// Clear Event listeners
		calipso.e.init();

		// Configure the logging
		calipso.logging.configureLogging();

		// Check / Connect Mongo
		calipso.storage.mongoConnect(process.env.MONGO_URI || calipso.config.get('database:uri'), false, function (err, connected) {

			if (err) {
				console.log("There was an error connecting to the database: " + err.message);
				process.exit();
			}

			// Load all the themes
			loadThemes(function () {

				// Initialise the modules and  theming engine
				configureTheme(function () {

					// Load all the modules
					calipso.module.loadModules(function () {

						// Initialise, callback via calipso.initCallback
						calipso.module.initModules();

					});

				});

			});
		});
		*/
	}
}

/*
private static final Properties defaultProperties = new Properties();
static {
	System.out.println("Initializing Nxt server version " + Nxt.VERSION);
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
}
*/

/*
private static final Properties properties = new Properties(defaultProperties);
static {
	try (InputStream is = ClassLoader.getSystemResourceAsStream("nxt.properties")) {
		if (is != null) {
			Nxt.properties.load(is);
		} // ignore if missing
	} catch (IOException e) {
		throw new RuntimeException("Error loading nxt.properties", e);
	}
}
*/


function GetBlockchain() {
	throw new Error('Not implementted');
	/*
	return BlockchainImpl.getInstance();
	*/
}

function GetBlockchainProcessor() {
	throw new Error('Not implementted');
	/*
	return BlockchainProcessorImpl.getInstance();
	*/
}

function GetTransactionProcessor() {
	throw new Error('Not implementted');
	/*
	return TransactionProcessorImpl.getInstance();
	*/
}

function GetVersion() {
	return version;
}

function Main(args) {
	throw new Error('Not implementted');
	/*
	Runtime.getRuntime().addShutdownHook(new Thread(new Runnable() {
		@Override
		public void run() {
			Nxt.shutdown();
		}
	}));
	init();
	*/
}

function Shutdown() {
	/*
	API.shutdown();
	Users.shutdown();
	Peers.shutdown();
	TransactionProcessorImpl.getInstance().shutdown();
	ThreadPool.shutdown();
	Db.shutdown();
	Logger.logMessage("Nxt server " + VERSION + " stopped.");
	Logger.shutdown();
	*/
}


exports.Init = Init;
exports.GetBlockchain = GetBlockchain;
exports.GetBlockchainProcessor = GetBlockchainProcessor;
exports.GetTransactionProcessor = GetTransactionProcessor;
exports.GetVersion = GetVersion;
exports.Shutdown = Shutdown;
