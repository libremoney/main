/*!
 * LibreMoney Core 0.2
 * Copyright(c) 2014 LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

//var rootpath = process.cwd() + '/';

if (typeof module !== "undefined") {
	var events = require('events');
	var util = require("util");
	var Accounts = require(__dirname + '/Accounts');
	var Blockchain = require(__dirname + '/Blockchain');
	var BlockchainProcessor = require(__dirname + '/BlockchainProcessor');
	var Blocks = require(__dirname + '/Blocks');
	var Constants = require(__dirname + '/../Lib/Constants');
	var Logger = require(__dirname + '/../Lib/Util/Logger').GetLogger(module);
	var Server = require(__dirname + '/Server');
	var ThreadPool = require(__dirname + '/ThreadPool');
	var Transactions = require(__dirname + '/Transactions');
	var TransactionProcessor = require(__dirname + '/TransactionProcessor');

	var Convert = require(__dirname + '/../Lib/Util/Convert');
	var JsonResponses = require(__dirname + '/Server/JsonResponses');
}


var Core = function() {
	events.EventEmitter.call(this);

	this.Event = {
		Clear: "Clear",
		GetState: "GetState",
		InitServer: "InitServer",
		InitComplete: "InitComplete",
		Shutdown: "Shutdown",
		Start: "Start",
		StateChange: "StateChange"
		};

	this.defaultProperties;
	this.properties;
	this.version = "0.2.2";
	this.application = "Lm";

	this.state = null;
	this.running = false;
	this.synced = false;
	/*if (typeof Core.instance === "undefined") {
		Core.instance = this;
	}*/
	return this;
}

util.inherits(Core, events.EventEmitter);

Core.prototype.AddListener = function(eventType, listener) {
	return this.addListener(eventType, listener);
}

Core.prototype.Clear = function() {
	Groups.Clear();
	Projects.Clear();
	//Users.Clear();
	this.Notify(this.Event.Clear, null);
}

Core.prototype.DoGetState = function(response) {
	this.Notify(this.Event.GetState, response);
}

Core.prototype.DoInitServer = function(app) {
	this.Notify(this.Event.InitServer, app);
}

Core.prototype.GetAccount = function(accId, callback) {
	try {
		var accountValue = Convert.EmptyToNull(accId);
		if (!accountValue) {
			callback(JsonResponses.MissingAccount);
			return;
		}
		var accId = ConvertAccount.ParseAccountId(accountValue);
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

Core.prototype.GetApplication = function() {
	return this.application;
}

Core.prototype.GetRecipientId = function(recipientId, callback) {
	var recipientValue = Convert.EmptyToNull(recipientId);
	if (!recipientValue || recipientValue == 0) {
		callback(JsonResponses.MissingRecipient);
		return;
	}
	var recipientId;
	try {
		recipientId = ConvertAccount.ParseAccountId(recipientValue);
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

Core.prototype.GetSynced = function() {
	return this.synced;
}

Core.prototype.GetVersion = function() {
	return this.version;
}

Core.prototype.HandleStateChange = function(e) {
	this.running = !!~["netConnect", "blockDownload", "default"].indexOf(e.newState);
	switch (e.oldState) {}
	switch (e.newState) {
		case "init":
			//self.emit("initComplete") - see BlockchainProcessor
			break;
		case "netConnect":
			this.peerProcessor.run();
			//this.startFrontendServer(Router.route, handle); - del
			break;
		case "blockDownload":
			break;
		case "synced":
			break
	}
}

Core.prototype.Init = function(callback) {
	//long startTime = System.currentTimeMillis();

	try {
		this.AddListener(this.Event.StateChange, this.HandleStateChange);
		this.AddListener(this.Event.InitComplete, function() {
			if (this.state == "init") {
				this.SetState("netConnect");
			}
		});
	} catch (err) {
		Logger.error("Initialization " + (err.stack ? err.stack : "error: " + err.toString()));
	}

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


Core.Main = function(args) {
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

Core.prototype.Notify = function(eventType, data) {
	return this.emit(eventType, data);
}

Core.prototype.RemoveListener = function(eventType, listener) {
	this.removeListener(eventType, listener);
}

Core.prototype.SetState = function(newState) {
	var oldState = this.state;
	if (newState == "init" && oldState !== null) {
		return;
	}
	this.state = newState;
	this.Notify(this.Event.StateChange, {
		oldState: oldState,
		newState: newState
	});
}

Core.prototype.Shutdown = function() {
	Logger.info("Shutting down...");
	ThreadPool.Shutdown();
	Logger.info("LibreMoney server " + version + " stopped.");
	this.Notify(this.Event.Shutdown);
}

Core.prototype.Start = function(app, port, pubDir, callback) {
	var self = this;
	Server.Init(app, port, pubDir, function(err) {
		if (err) throw 'Error in Server.Init()';
		Logger.info('Starting...');
		ThreadPool.Start();
		self.Notify(self.Event.Start);
		self.SetState("init");
		callback(null);
	});
}


var Core = new Core();


if (typeof module !== "undefined") {
	module.exports = Core;
}
