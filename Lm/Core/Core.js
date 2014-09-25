/*!
 * LibreMoney Core 0.2
 * Copyright(c) 2014 LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

//var rootpath = process.cwd() + '/';
//var path = require('path');
//var fs = require('fs');
//var events = require('events');

if (typeof module !== "undefined") {
	var Accounts = require(__dirname + '/Accounts');
	var Blockchain = require(__dirname + '/Blockchain');
	var BlockchainProcessor = require(__dirname + '/BlockchainProcessor');
	var Blocks = require(__dirname + '/Blocks');
	var Listeners = require(__dirname + '/../Lib/Util/Listeners');
	var Logger = require(__dirname + '/../Lib/Util/Logger').GetLogger(module);
	var Server = require(__dirname + '/Server');
	var ThreadPool = require(__dirname + '/ThreadPool');
	var Transactions = require(__dirname + '/Transactions');
	var TransactionProcessor = require(__dirname + '/TransactionProcessor');

	var Convert = require(__dirname + '/../Lib/Util/Convert');
	var JsonResponses = require(__dirname + '/Server/JsonResponses');
}


var Core = function() {
	var defaultProperties;
	var listeners = new Listeners();
	var properties;
	var version = "0.2.0";
	var application = "Lm";


	var Event = {
		Clear:0,
		Shutdown:1,
		Start:2,
		InitServer:3,
		GetState:4
		};


	function AddListener(eventType, listener) {
		listeners.AddListener(eventType, listener);
	}

	function Clear() {
		Groups.Clear();
		Projects.Clear();
		//Users.Clear();
		listeners.Notify(Event.Clear, null);
	}

	function DoGetState(response) {
		listeners.Notify(Event.GetState, response);
	}

	function DoInitServer(app) {
		listeners.Notify(Event.InitServer, app);
	}

	function GetAccount(accId, callback) {
		try {
			var accountValue = Convert.EmptyToNull(accId);
			if (!accountValue) {
				callback(JsonResponses.MissingAccount);
				return;
			}
			var accId = Convert.ParseAccountId(accountValue);
			Logger.info("GetAccount(): accId="+accId);
			var account = Accounts.GetAccountById(accId);
			if (!account) {
				callback(JsonResponses.UnknownAccount);
				return;
			}
			callback(null, account);
		} catch (e) {
			callback(JsonResponses.IncorrectAccount);
			return;
		}
	}

	function GetApplication() {
		return application;
	}

	function GetRecipientId(recipientId, callback) {
		var recipientValue = Convert.EmptyToNull(recipientId);
		if (!recipientValue || recipientValue == 0) {
			callback(JsonResponses.MissingRecipient);
			return;
		}
		var recipientId;
		try {
			recipientId = Convert.ParseAccountId(recipientValue);
		} catch (e) {
			callback(JsonResponses.IncorrectRecipient);
			return;
		}
		if (!recipientId) {
			callback(JsonResponses.IncorrectRecipient);
			return;
		}
		callback(null, recipientId);
	}

	function GetVersion() {
		return version;
	}

	function Init(callback) {
		//long startTime = System.currentTimeMillis();

		Accounts.Init();
		Blocks.Init();
		Blockchain.Init();
		Transactions.Init();

		TransactionProcessor.Init(function(err){
			if (err) {
				throw 'Error in TransactionProcessor.Init()';
				return;
			}
			Logger.info('TransactionProcessor initialized');
			//BlockchainProcessor.Init(function(err) {
				//if (err) throw 'Error in BlockchainProcessor.Init()';
				//Logger.info('BlockchainProcessor initialized');

				if (callback)
					callback(null);

			//});
		});

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
			Logger.logMessage("Lm server " + VERSION + " started successfully.");
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
		console.log("Initializing Lm server version " + version);
		try (InputStream is = ClassLoader.getSystemResourceAsStream("lm-default.properties")) {
			if (is != null) {
				Lm.defaultProperties.load(is);
			} else {
				String configFile = System.getProperty("lm-default.properties");
				if (configFile != null) {
					try (InputStream fis = new FileInputStream(configFile)) {
						Lm.defaultProperties.load(fis);
					} catch (IOException e) {
						throw new RuntimeException("Error loading lm-default.properties from " + configFile);
					}
				} else {
					throw new RuntimeException("lm-default.properties not in classpath and system property lm-default.properties not defined either");
				}
			}
		} catch (IOException e) {
			throw new RuntimeException("Error loading lm-default.properties", e);
		}
		*/

		/*
		properties = new Properties(defaultProperties);
		try (InputStream is = ClassLoader.getSystemResourceAsStream("lm.properties")) {
			if (is != null) {
				Lm.properties.load(is);
			} // ignore if missing
		} catch (IOException e) {
			throw new RuntimeException("Error loading lm.properties", e);
		}
		*/
	}

	function Main(args) {
		throw new Error('Not implementted');
		/*
		Runtime.getRuntime().addShutdownHook(new Thread(new Runnable() {
			public void run() {
				Lm.shutdown();
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

	function Start(app, port, pubDir, callback) {
		Server.Init(app, port, pubDir, function(err) {
			if (err) throw 'Error in Server.Init()';
			Logger.info('Server started on port ' + port);
			Logger.info('Starting...');
			ThreadPool.Start();
			listeners.Notify(Event.Start, null);
			callback(null);
		});
	}

	return {
		Event: Event,

		AddListener: AddListener,
		Clear: Clear,
		DoGetState: DoGetState,
		DoInitServer: DoInitServer,
		Init: Init,
		GetAccount: GetAccount,
		GetApplication: GetApplication,
		GetRecipientId: GetRecipientId,
		GetVersion: GetVersion,
		RemoveListener: RemoveListener,
		Shutdown: Shutdown,
		Start: Start
	}
}();


if (typeof module !== "undefined") {
	exports.Event = Core.Event;

	exports.AddListener = Core.AddListener;
	exports.Clear = Core.Clear;
	exports.DoGetState = Core.DoGetState;
	exports.DoInitServer = Core.DoInitServer;
	exports.Init = Core.Init;
	exports.GetAccount = Core.GetAccount;
	exports.GetApplication = Core.GetApplication;
	exports.GetRecipientId = Core.GetRecipientId;
	exports.GetVersion = Core.GetVersion;
	exports.RemoveListener = Core.RemoveListener;
	exports.Shutdown = Core.Shutdown;
	exports.Start = Core.Start;
}
