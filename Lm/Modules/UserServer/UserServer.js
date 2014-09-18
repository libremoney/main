/**!
 * LibreMoney 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

/*
import nxt.Block;
import nxt.Constants;
import nxt.util.Convert;
import nxt.util.ThreadPool;
*/

var Accounts = require(__dirname + '/../Accounts');
var BlockchainProcessor = require(__dirname + '/../BlockchainProcessor');
var Config = require(__dirname + '/../Config');
var Generators = require(__dirname + '/../Generators');
var Logger = require(__dirname + '/../Logger').GetLogger(module);
var Peers = require(__dirname + '/../Peers');
var TransactionProcessor = require(__dirname + '/../TransactionProcessor');
var User = require(__dirname + '/User');


//private static final int TESTNET_UI_PORT=6875;
var users = new Array();
var allUsers = new Array();

var peerCounter; //new AtomicInteger();
var peerIndexMap = new Array(); //ConcurrentHashMap<>();
var peerAddressMap = new Array(); //ConcurrentHashMap<>();

var blockCounter; //new AtomicInteger();
var blockIndexMap = new Array(); //ConcurrentHashMap<>();

var transactionCounter; //new AtomicInteger();
var transactionIndexMap = new Array(); //ConcurrentHashMap<>();

var allowedUserHosts = new Array();

var enforcePost2;


function AllowedUserHosts_Contains(host) {
	if (allowedUserHosts.length == 0) return false;
	return (allowedUserHosts.indexOf(host) >= 0);
}

function GetEnforcePost() {
	return enforcePost2;
}

function GetAllUsers() {
	return allUsers;
}

function GetIndexByBlock(block) {
	var index = blockIndexMap.indexOf(block.GetId());
	if (index < 0) {
		blockCounter++;
		index = blockCounter;
		blockIndexMap[index] = block.GetId();
	}
	return index;
}

function GetIndexByPeer(peer) {
	var index = peerIndexMap.indexOf(peer.GetPeerAddress());
	if (index < 0) {
		peerCounter++;
		index = peerCounter;
		peerIndexMap[index] = peer.GetPeerAddress();
		peerAddressMap[peer.GetPeerAddress()] = index;
	}
	return index;
}

function GetIndexByTransaction(transaction) {
	var index = transactionIndexMap.indexOf(transaction.GetId());
	if (index < 0) {
		transactionCounter++;
		index = transactionCounter;
		transactionIndexMap[index] = transaction.GetId();
	}
	return index;
}

function GetPeer(index) {
	var peerAddress = peerAddressMap[index];
	if (!peerAddress) { //if (peerAddress == null || typeof peerAddress == 'undefined') {
		return null;
	}
	return Peers.GetPeer(peerAddress);
}

function GetUser(userId) {
	var user = users[userId];
	if (!user) {
		user = new User(userId);
		users.push[userId] = user;
		user.SetInactive(false);
	} else {
		user.SetInactive(false);
	}
	return user;
}

function Init() {
	Core.AddListener(Core.Event.InitServer, OnInitServer);

	var enforcePost2 = Config.GetBooleanProperty("uiServerEnforcePost");

	var allowedUserHostsList = Config.GetStringListProperty("allowedUserHosts");
	if (allowedUserHostsList && allowedUserHostsList.indexOf("*") < 0) {
		allowedUserHosts = allowedUserHostsList; //Collections.unmodifiableSet(new HashSet<>(allowedUserHostsList));
	} else {
		allowedUserHosts = null;
	}

	//var enableUIServer = Config.GetBooleanProperty("enableUIServer");
	//if (!enableUIServer) { Logger.info("User interface server not enabled"); return; }

	//var port = Constants.isTestnet ? TESTNET_UI_PORT : Nxt.getIntProperty("nxt.uiServerPort");
	//var host = Nxt.getStringProperty("nxt.uiServerHost");
	//userServer = new Server();
	//ServerConnector connector;

	/*
	var enableSSL = Config.GetBooleanProperty("uiSSL");
	if (enableSSL) {
		Logger.info("Using SSL (https) for the user interface server");
		HttpConfiguration https_config = new HttpConfiguration();
		https_config.setSecureScheme("https");
		https_config.setSecurePort(port);
		https_config.addCustomizer(new SecureRequestCustomizer());
		SslContextFactory sslContextFactory = new SslContextFactory();
		sslContextFactory.setKeyStorePath(Nxt.getStringProperty("nxt.keyStorePath"));
		sslContextFactory.setKeyStorePassword(Nxt.getStringProperty("nxt.keyStorePassword"));
		sslContextFactory.setExcludeCipherSuites("SSL_RSA_WITH_DES_CBC_SHA", "SSL_DHE_RSA_WITH_DES_CBC_SHA",
				"SSL_DHE_DSS_WITH_DES_CBC_SHA", "SSL_RSA_EXPORT_WITH_RC4_40_MD5", "SSL_RSA_EXPORT_WITH_DES40_CBC_SHA",
				"SSL_DHE_RSA_EXPORT_WITH_DES40_CBC_SHA", "SSL_DHE_DSS_EXPORT_WITH_DES40_CBC_SHA");
		connector = new ServerConnector(userServer, new SslConnectionFactory(sslContextFactory, "http/1.1"),
				new HttpConnectionFactory(https_config));
	} else {
		connector = new ServerConnector(userServer);
	}
	*/

	/*
	connector.setPort(port);
	connector.setHost(host);
	connector.setIdleTimeout(Nxt.getIntProperty("nxt.uiServerIdleTimeout"));
	userServer.addConnector(connector);


	HandlerList userHandlers = new HandlerList();

	ResourceHandler userFileHandler = new ResourceHandler();
	userFileHandler.setDirectoriesListed(false);
	userFileHandler.setWelcomeFiles(new String[]{"index.html"});
	userFileHandler.setResourceBase(Nxt.getStringProperty("nxt.uiResourceBase"));

	userHandlers.addHandler(userFileHandler);

	String javadocResourceBase = Nxt.getStringProperty("nxt.javadocResourceBase");
	if (javadocResourceBase != null) {
		ContextHandler contextHandler = new ContextHandler("/doc");
		ResourceHandler docFileHandler = new ResourceHandler();
		docFileHandler.setDirectoriesListed(false);
		docFileHandler.setWelcomeFiles(new String[]{"index.html"});
		docFileHandler.setResourceBase(javadocResourceBase);
		contextHandler.setHandler(docFileHandler);
		userHandlers.addHandler(contextHandler);
	}

	ServletHandler userHandler = new ServletHandler();
	ServletHolder userHolder = userHandler.addServletWithMapping(UserServlet.class, "/nxt");
	userHolder.setAsyncSupported(true);

	if (Nxt.getBooleanProperty("nxt.uiServerCORS")) {
		FilterHolder filterHolder = userHandler.addFilterWithMapping(CrossOriginFilter.class, "/*", FilterMapping.DEFAULT);
		filterHolder.setInitParameter("allowedHeaders", "*");
		filterHolder.setAsyncSupported(true);
	}

	userHandlers.addHandler(userHandler);

	userHandlers.addHandler(new DefaultHandler());

	userServer.setHandler(userHandlers);
	userServer.setStopAtShutdown(true);

	ThreadPool.runBeforeStart(new Runnable() {
		public void run() {
			try {
				userServer.start();
				Logger.logMessage("Started user interface server at " + host + ":" + port);
			} catch (Exception e) {
				Logger.logDebugMessage("Failed to start user interface server", e);
				throw new RuntimeException(e.toString(), e);
			}
		}
	}, true);
	*/

	InitAccouns();
	InitPeers();
	InitTransactionProcessor();
	InitBlockchainProcessor();
	InitGenerators();
}

function InitAccouns() {
	Accounts.AddListener(Accounts.Event.UNCONFIRMED_BALANCE, function(account) {
		var response = {};
		response.response = "setBalance";
		response.balanceMilliLm = account.GetUnconfirmedBalanceMilliLm();
		var accountPublicKey = account.GetPublicKey();
		for (var user in users) {
			if (user.GetSecretPhrase() != null && user.GetPublicKey() == accountPublicKey) {
				user.Send(response);
			}
		}
	});
}

function InitBlockchainProcessor() {
	BlockchainProcessor.AddListener(BlockchainProcessor.Event.BLOCK_POPPED, function(block) {
		var response = {};
		var addedOrphanedBlocks = [];
		var addedOrphanedBlock = {};
		addedOrphanedBlock.index = GetIndex(block);
		addedOrphanedBlock.timestamp = block.getTimestamp();
		addedOrphanedBlock.numberOfTransactions = block.GetTransactionIds().length;
		addedOrphanedBlock.totalAmountMilliLm = block.GetTotalAmountMilliLm();
		addedOrphanedBlock.totalFeeMilliLm = block.GetTotalFeeMilliLm();
		addedOrphanedBlock.payloadLength = block.GetPayloadLength();
		addedOrphanedBlock.generator = Convert.ToUnsignedLong(block.GetGeneratorId());
		addedOrphanedBlock.height = block.GetHeight();
		addedOrphanedBlock.version = block.GetVersion();
		addedOrphanedBlock.block = block.GetStringId();
		addedOrphanedBlock.baseTarget = BigInteger.valueOf(block.GetBaseTarget()).multiply(BigInteger.valueOf(100000))
				.divide(BigInteger.valueOf(Constants.InitialBaseTarget));
		addedOrphanedBlocks.push(addedOrphanedBlock);
		response.put("addedOrphanedBlocks", addedOrphanedBlocks);
		SendNewDataToAll(response);
	});

	BlockchainProcessor.AddListener(BlockchainProcessor.Event.BLOCK_PUSHED, function(block) {
		var response = {};
		var addedRecentBlocks = [];
		var addedRecentBlock = {};
		addedRecentBlock.index = GetIndex(block);
		addedRecentBlock.timestamp = block.GetTimestamp();
		addedRecentBlock.numberOfTransactions = block.GetTransactionIds().length;
		addedRecentBlock.totalAmountMilliLm = block.GetTotalAmountMilliLm();
		addedRecentBlock.totalFeeMilliLm = block.GetTotalFeeMilliLm();
		addedRecentBlock.payloadLength = block.GetPayloadLength();
		addedRecentBlock.generator = Convert.ToUnsignedLong(block.GetGeneratorId());
		addedRecentBlock.height = block.GetHeight();
		addedRecentBlock.version = block.GetVersion();
		addedRecentBlock.block = block.GetStringId();
		addedRecentBlock.baseTarget = BigInteger.valueOf(block.GetBaseTarget()).multiply(BigInteger.valueOf(100000))
				.divide(BigInteger.valueOf(Constants.InitialBaseTarget));
		addedRecentBlocks.push(addedRecentBlock);
		response.addedRecentBlocks = addedRecentBlocks;
		SendNewDataToAll(response);
	});
}

function InitGenerators() {
	Generators.AddListener(Generators.Event.GENERATION_DEADLINE, function(generator) {
		var response = {};
		response.response = "setBlockGenerationDeadline";
		response.deadline = generator.GetDeadline();
		for (var user in users) {
			if (Arrays.Equal(generator.GetPublicKey(), user.GetPublicKey())) {
				user.Send(response);
			}
		}
	});
}

function InitPeers() {
	Peers.AddListener(Peers.Event.BLACKLIST, function(peer) {
		var response = {};
		var removedActivePeers = [];
		var removedActivePeer = {};
		removedActivePeer.index = GetIndexByPeer(peer);
		removedActivePeers.push(removedActivePeer);
		response.removedActivePeers = removedActivePeers;
		var removedKnownPeers = [];
		var removedKnownPeer = {};
		removedKnownPeer.index = GetIndexByPeer(peer);
		removedKnownPeers.push(removedKnownPeer);
		response.removedKnownPeers = removedKnownPeers;
		var addedBlacklistedPeers = [];
		var addedBlacklistedPeer = {};
		addedBlacklistedPeer.index = GetIndexByPeer(peer);
		addedBlacklistedPeer.address = peer.GetPeerAddress();
		addedBlacklistedPeer.announcedAddress = Convert.Truncate(peer.GetAnnouncedAddress(), "-", 25, true);
		if (peer.IsWellKnown()) {
			addedBlacklistedPeer.wellKnown = true;
		}
		addedBlacklistedPeer.software = peer.GetSoftware();
		addedBlacklistedPeers.push(addedBlacklistedPeer);
		response.addedBlacklistedPeers = addedBlacklistedPeers;
		Users.SendNewDataToAll(response);
	});

	Peers.AddListener(Peers.Event.DEACTIVATE, function(peer) {
		/*
		JSONObject response = new JSONObject();
		JSONArray removedActivePeers = new JSONArray();
		JSONObject removedActivePeer = new JSONObject();
		removedActivePeer.put("index", Users.getIndex(peer));
		removedActivePeers.add(removedActivePeer);
		response.put("removedActivePeers", removedActivePeers);
		JSONArray addedKnownPeers = new JSONArray();
		JSONObject addedKnownPeer = new JSONObject();
		addedKnownPeer.put("index", Users.getIndex(peer));
		addedKnownPeer.put("address", peer.getPeerAddress());
		addedKnownPeer.put("announcedAddress", Convert.truncate(peer.getAnnouncedAddress(), "-", 25, true));
		if (peer.isWellKnown()) {
			addedKnownPeer.put("wellKnown", true);
		}
		addedKnownPeer.put("software", peer.getSoftware());
		addedKnownPeers.add(addedKnownPeer);
		response.put("addedKnownPeers", addedKnownPeers);
		Users.sendNewDataToAll(response);
		*/
	});

	Peers.AddListener(Peers.Event.UNBLACKLIST, function(peer) {
		/*
		JSONObject response = new JSONObject();
		JSONArray removedBlacklistedPeers = new JSONArray();
		JSONObject removedBlacklistedPeer = new JSONObject();
		removedBlacklistedPeer.put("index", Users.getIndex(peer));
		removedBlacklistedPeers.add(removedBlacklistedPeer);
		response.put("removedBlacklistedPeers", removedBlacklistedPeers);
		JSONArray addedKnownPeers = new JSONArray();
		JSONObject addedKnownPeer = new JSONObject();
		addedKnownPeer.put("index", Users.getIndex(peer));
		addedKnownPeer.put("address", peer.getPeerAddress());
		addedKnownPeer.put("announcedAddress", Convert.truncate(peer.getAnnouncedAddress(), "-", 25, true));
		if (peer.isWellKnown()) {
			addedKnownPeer.put("wellKnown", true);
		}
		addedKnownPeer.put("software", peer.getSoftware());
		addedKnownPeers.add(addedKnownPeer);
		response.put("addedKnownPeers", addedKnownPeers);
		Users.sendNewDataToAll(response);
		*/
	});

	Peers.AddListener(Peers.Event.REMOVE, function(peer) {
		/*
		JSONObject response = new JSONObject();
		JSONArray removedKnownPeers = new JSONArray();
		JSONObject removedKnownPeer = new JSONObject();
		removedKnownPeer.put("index", Users.getIndex(peer));
		removedKnownPeers.add(removedKnownPeer);
		response.put("removedKnownPeers", removedKnownPeers);
		Users.sendNewDataToAll(response);
		*/
	});

	Peers.AddListener(Peers.Event.DOWNLOADED_VOLUME, function(peer) {
		/*
		JSONObject response = new JSONObject();
		JSONArray changedActivePeers = new JSONArray();
		JSONObject changedActivePeer = new JSONObject();
		changedActivePeer.put("index", Users.getIndex(peer));
		changedActivePeer.put("downloaded", peer.getDownloadedVolume());
		changedActivePeers.add(changedActivePeer);
		response.put("changedActivePeers", changedActivePeers);
		Users.sendNewDataToAll(response);
		*/
	});

	Peers.AddListener(Peers.Event.UPLOADED_VOLUME, function(peer) {
		/*
		JSONObject response = new JSONObject();
		JSONArray changedActivePeers = new JSONArray();
		JSONObject changedActivePeer = new JSONObject();
		changedActivePeer.put("index", Users.getIndex(peer));
		changedActivePeer.put("uploaded", peer.getUploadedVolume());
		changedActivePeers.add(changedActivePeer);
		response.put("changedActivePeers", changedActivePeers);
		Users.sendNewDataToAll(response);
		*/
	});

	Peers.AddListener(Peers.Event.WEIGHT, function(peer) {
		/*
		JSONObject response = new JSONObject();
		JSONArray changedActivePeers = new JSONArray();
		JSONObject changedActivePeer = new JSONObject();
		changedActivePeer.put("index", Users.getIndex(peer));
		changedActivePeer.put("weight", peer.getWeight());
		changedActivePeers.add(changedActivePeer);
		response.put("changedActivePeers", changedActivePeers);
		Users.sendNewDataToAll(response);
		*/
	});

	Peers.AddListener(Peers.Event.ADDED_ACTIVE_PEER, function(peer) {
		/*
		JSONObject response = new JSONObject();
		JSONArray removedKnownPeers = new JSONArray();
		JSONObject removedKnownPeer = new JSONObject();
		removedKnownPeer.put("index", Users.getIndex(peer));
		removedKnownPeers.add(removedKnownPeer);
		response.put("removedKnownPeers", removedKnownPeers);
		JSONArray addedActivePeers = new JSONArray();
		JSONObject addedActivePeer = new JSONObject();
		addedActivePeer.put("index", Users.getIndex(peer));
		if (peer.getState() != Peer.State.CONNECTED) {
			addedActivePeer.put("disconnected", true);
		}
		addedActivePeer.put("address", peer.getPeerAddress());
		addedActivePeer.put("announcedAddress", Convert.truncate(peer.getAnnouncedAddress(), "-", 25, true));
		if (peer.isWellKnown()) {
			addedActivePeer.put("wellKnown", true);
		}
		addedActivePeer.put("weight", peer.getWeight());
		addedActivePeer.put("downloaded", peer.getDownloadedVolume());
		addedActivePeer.put("uploaded", peer.getUploadedVolume());
		addedActivePeer.put("software", peer.getSoftware());
		addedActivePeers.add(addedActivePeer);
		response.put("addedActivePeers", addedActivePeers);
		Users.sendNewDataToAll(response);
		*/
	});

	Peers.AddListener(Peers.Event.CHANGED_ACTIVE_PEER, function(peer) {
		/*
		JSONObject response = new JSONObject();
		JSONArray changedActivePeers = new JSONArray();
		JSONObject changedActivePeer = new JSONObject();
		changedActivePeer.put("index", Users.getIndex(peer));
		changedActivePeer.put(peer.getState() == Peer.State.CONNECTED ? "connected" : "disconnected", true);
		changedActivePeer.put("announcedAddress", Convert.truncate(peer.getAnnouncedAddress(), "-", 25, true));
		if (peer.isWellKnown()) {
			changedActivePeer.put("wellKnown", true);
		}
		changedActivePeers.add(changedActivePeer);
		response.put("changedActivePeers", changedActivePeers);
		Users.sendNewDataToAll(response);
		*/
	});

	Peers.AddListener(Peers.Event.NEW_PEER, function(peer) {
		/*
		JSONObject response = new JSONObject();
		JSONArray addedKnownPeers = new JSONArray();
		JSONObject addedKnownPeer = new JSONObject();
		addedKnownPeer.put("index", Users.getIndex(peer));
		addedKnownPeer.put("address", peer.getPeerAddress());
		addedKnownPeer.put("announcedAddress", Convert.truncate(peer.getAnnouncedAddress(), "-", 25, true));
		if (peer.isWellKnown()) {
			addedKnownPeer.put("wellKnown", true);
		}
		addedKnownPeer.put("software", peer.getSoftware());
		addedKnownPeers.add(addedKnownPeer);
		response.put("addedKnownPeers", addedKnownPeers);
		Users.sendNewDataToAll(response);
		*/
	});
}

function InitTransactionProcessor() {
	TransactionProcessor.AddListener(TransactionProcessor.Event.REMOVED_UNCONFIRMED_TRANSACTIONS, function(transactions) {
		/*
		JSONObject response = new JSONObject();
		JSONArray removedUnconfirmedTransactions = new JSONArray();
		for (Transaction transaction : transactions) {
			JSONObject removedUnconfirmedTransaction = new JSONObject();
			removedUnconfirmedTransaction.put("index", Users.getIndex(transaction));
			removedUnconfirmedTransactions.add(removedUnconfirmedTransaction);
		}
		response.put("removedUnconfirmedTransactions", removedUnconfirmedTransactions);
		Users.sendNewDataToAll(response);
		*/
	});

	TransactionProcessor.AddListener(TransactionProcessor.Event.ADDED_UNCONFIRMED_TRANSACTIONS, function(transactions) {
		/*
		JSONObject response = new JSONObject();
		JSONArray addedUnconfirmedTransactions = new JSONArray();
		for (Transaction transaction : transactions) {
			JSONObject addedUnconfirmedTransaction = new JSONObject();
			addedUnconfirmedTransaction.put("index", Users.getIndex(transaction));
			addedUnconfirmedTransaction.put("timestamp", transaction.getTimestamp());
			addedUnconfirmedTransaction.put("deadline", transaction.getDeadline());
			addedUnconfirmedTransaction.put("recipient", Convert.toUnsignedLong(transaction.getRecipientId()));
			addedUnconfirmedTransaction.put("amountNQT", transaction.getAmountNQT());
			addedUnconfirmedTransaction.put("feeNQT", transaction.getFeeNQT());
			addedUnconfirmedTransaction.put("sender", Convert.toUnsignedLong(transaction.getSenderId()));
			addedUnconfirmedTransaction.put("id", transaction.getStringId());
			addedUnconfirmedTransactions.add(addedUnconfirmedTransaction);
		}
		response.put("addedUnconfirmedTransactions", addedUnconfirmedTransactions);
		Users.sendNewDataToAll(response);
		*/
	});

	TransactionProcessor.AddListener(TransactionProcessor.Event.ADDED_CONFIRMED_TRANSACTIONS, function(transactions) {
		/*
		JSONObject response = new JSONObject();
		JSONArray addedConfirmedTransactions = new JSONArray();
		for (Transaction transaction : transactions) {
			JSONObject addedConfirmedTransaction = new JSONObject();
			addedConfirmedTransaction.put("index", Users.getIndex(transaction));
			addedConfirmedTransaction.put("blockTimestamp", transaction.getBlockTimestamp());
			addedConfirmedTransaction.put("transactionTimestamp", transaction.getTimestamp());
			addedConfirmedTransaction.put("sender", Convert.toUnsignedLong(transaction.getSenderId()));
			addedConfirmedTransaction.put("recipient", Convert.toUnsignedLong(transaction.getRecipientId()));
			addedConfirmedTransaction.put("amountNQT", transaction.getAmountNQT());
			addedConfirmedTransaction.put("feeNQT", transaction.getFeeNQT());
			addedConfirmedTransaction.put("id", transaction.getStringId());
			addedConfirmedTransactions.add(addedConfirmedTransaction);
		}
		response.put("addedConfirmedTransactions", addedConfirmedTransactions);
		Users.sendNewDataToAll(response);
		*/
	});

	TransactionProcessor.AddListener(TransactionProcessor.Event.ADDED_DOUBLESPENDING_TRANSACTIONS, function(transactions) {
		/*
		JSONObject response = new JSONObject();
		JSONArray newTransactions = new JSONArray();
		for (Transaction transaction : transactions) {
			JSONObject newTransaction = new JSONObject();
			newTransaction.put("index", Users.getIndex(transaction));
			newTransaction.put("timestamp", transaction.getTimestamp());
			newTransaction.put("deadline", transaction.getDeadline());
			newTransaction.put("recipient", Convert.toUnsignedLong(transaction.getRecipientId()));
			newTransaction.put("amountNQT", transaction.getAmountNQT());
			newTransaction.put("feeNQT", transaction.getFeeNQT());
			newTransaction.put("sender", Convert.toUnsignedLong(transaction.getSenderId()));
			newTransaction.put("id", transaction.getStringId());
			newTransactions.add(newTransaction);
		}
		response.put("addedDoubleSpendingTransactions", newTransactions);
		Users.sendNewDataToAll(response);
		*/
	});
}

function OnInitServer(app) {
	app.post('/api', Api.Main);


	/*
	enforcePost1 = Config.GetBooleanProperty("apiServerEnforcePost");
	var allowedBotHostsList = Config.GetStringListProperty("allowedBotHosts");
	if (allowedBotHostsList.indexOf("*") >= 0)  {
		allowedBotHosts = null;
	} else {
		allowedBotHosts = allowedBotHostsList; //Collections.unmodifiableSet(new HashSet<>(allowedBotHostsList));
	}

	var enableApiServer = Config.GetBooleanProperty("enableApiServer");
	if (enableApiServer) {
		//var port = Constants.isTestnet ? TESTNET_API_PORT : Nxt.getIntProperty("nxt.apiServerPort");
		//var = Nxt.getStringProperty("nxt.apiServerHost");
		//ServerConnector connector;

		boolean enableSSL = Nxt.getBooleanProperty("nxt.apiSSL");
		if (enableSSL) {
			Logger.logMessage("Using SSL (https) for the API server");
			HttpConfiguration https_config = new HttpConfiguration();
			https_config.setSecureScheme("https");
			https_config.setSecurePort(port);
			https_config.addCustomizer(new SecureRequestCustomizer());
			SslContextFactory sslContextFactory = new SslContextFactory();
			sslContextFactory.setKeyStorePath(Nxt.getStringProperty("nxt.keyStorePath"));
			sslContextFactory.setKeyStorePassword(Nxt.getStringProperty("nxt.keyStorePassword"));
			sslContextFactory.setExcludeCipherSuites("SSL_RSA_WITH_DES_CBC_SHA", "SSL_DHE_RSA_WITH_DES_CBC_SHA",
					"SSL_DHE_DSS_WITH_DES_CBC_SHA", "SSL_RSA_EXPORT_WITH_RC4_40_MD5", "SSL_RSA_EXPORT_WITH_DES40_CBC_SHA",
					"SSL_DHE_RSA_EXPORT_WITH_DES40_CBC_SHA", "SSL_DHE_DSS_EXPORT_WITH_DES40_CBC_SHA");
			connector = new ServerConnector(apiServer, new SslConnectionFactory(sslContextFactory, "http/1.1"),
					new HttpConnectionFactory(https_config));
		} else {
			connector = new ServerConnector(apiServer);
		}

		connector.setPort(port);
		connector.setHost(host);
		connector.setIdleTimeout(Nxt.getIntProperty("nxt.apiServerIdleTimeout"));
		apiServer.addConnector(connector);

		HandlerList apiHandlers = new HandlerList();

		String apiResourceBase = Nxt.getStringProperty("nxt.apiResourceBase");
		if (apiResourceBase != null) {
			ResourceHandler apiFileHandler = new ResourceHandler();
			apiFileHandler.setDirectoriesListed(true);
			apiFileHandler.setWelcomeFiles(new String[]{"index.html"});
			apiFileHandler.setResourceBase(apiResourceBase);
			apiHandlers.addHandler(apiFileHandler);
		}

		String javadocResourceBase = Nxt.getStringProperty("nxt.javadocResourceBase");
		if (javadocResourceBase != null) {
			ContextHandler contextHandler = new ContextHandler("/doc");
			ResourceHandler docFileHandler = new ResourceHandler();
			docFileHandler.setDirectoriesListed(false);
			docFileHandler.setWelcomeFiles(new String[]{"index.html"});
			docFileHandler.setResourceBase(javadocResourceBase);
			contextHandler.setHandler(docFileHandler);
			apiHandlers.addHandler(contextHandler);
		}

		ServletHandler apiHandler = new ServletHandler();
		apiHandler.addServletWithMapping(APIServlet.class, "/nxt");
		apiHandler.addServletWithMapping(APITestServlet.class, "/test");

		if (Nxt.getBooleanProperty("nxt.apiServerCORS")) {
			FilterHolder filterHolder = apiHandler.addFilterWithMapping(CrossOriginFilter.class, "/*", FilterMapping.DEFAULT);
			filterHolder.setInitParameter("allowedHeaders", "*");
			filterHolder.setAsyncSupported(true);
		}

		apiHandlers.addHandler(apiHandler);
		apiHandlers.addHandler(new DefaultHandler());

		apiServer.setHandler(apiHandlers);
		apiServer.setStopAtShutdown(true);

		ThreadPool.runBeforeStart(new Runnable() {
			public void run() {
				try {
					apiServer.start();
					Logger.logMessage("Started API server at " + host + ":" + port);
				} catch (Exception e) {
					Logger.logDebugMessage("Failed to start API server", e);
					throw new RuntimeException(e.toString(), e);
				}

			}
		});
	} else {
		Logger.info("API server not enabled");
	}
	*/
}

function Remove(user) {
	var i = users.indexOf(user.GetUserId());
	if (i >= 0)
		users[i] = null;
}

function SendNewDataToAll(response) {
	response.response = "processNewData";
	SendToAll(response);
}

function SendToAll(response) {
	for (var user in users) {
		user.Send(response);
	}
}

function Shutdown() {
	throw new Error('This is not implemented');
	/*
	if (userServer != null) {
		try {
			userServer.stop();
		} catch (Exception e) {
			Logger.logDebugMessage("Failed to stop user interface server", e);
		}
	}
	*/
}


exports.AllowedUserHosts_Contains = AllowedUserHosts_Contains;
exports.GetAllUsers = GetAllUsers;
exports.GetEnforcePost = GetEnforcePost;
exports.GetIndexByBlock = GetIndexByBlock;
exports.GetIndexByPeer = GetIndexByPeer;
exports.GetIndexByTransaction = GetIndexByTransaction;
exports.GetPeer = GetPeer;
exports.GetUser = GetUser;
exports.Init = Init;
exports.Remove = Remove;
exports.SendNewDataToAll = SendNewDataToAll;
exports.SendToAll = SendToAll;
exports.Shutdown = Shutdown;
