/**!
 * LibreMoney Peers 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var Constants = require(__dirname + '/../../Constants');
var Convert = require(__dirname + '/../../Util/Convert');
var Core = require(__dirname + '/../Core');
var Listeners = require(__dirname + '/../../Util/Listeners');
var ThreadPool = require(__dirname + '/../ThreadPool');


var Event = {
	BLACKLIST:0,
	UNBLACKLIST:1,
	DEACTIVATE:2,
	REMOVE:3,
	DOWNLOADED_VOLUME:4,
	UPLOADED_VOLUME:5,
	WEIGHT:6,
	ADDED_ACTIVE_PEER:7,
	CHANGED_ACTIVE_PEER:8,
	NEW_PEER:9
	};

var State = {
	NON_CONNECTED:0,
	CONNECTED:1,
	DISCONNECTED:2
	}


var peerServer;

var LOGGING_MASK_EXCEPTIONS = 1;
var LOGGING_MASK_NON200_RESPONSES = 2;
var LOGGING_MASK_200_RESPONSES = 4;
var communicationLoggingMask;

var wellKnownPeers = [];
var knownBlacklistedPeers = [];

var connectTimeout;
var readTimeout;
var blacklistingPeriod;
var getMorePeers;
/*
static final int DEFAULT_PEER_PORT = 7874;
static final int TESTNET_PEER_PORT = 6874;
*/
var myPlatform;
var myAddress;
var myPeerServerPort;
var myHallmark;
var shareMyAddress;
var maxNumberOfConnectedPublicPeers;
var enableHallmarkProtection;
var pushThreshold;
var pullThreshold;
var sendToPeersLimit;
var usePeersDb;
var savePeers;

var myPeerInfoRequest;
var myPeerInfoResponse;

var listeners = new Listeners();
var peers = new Array(); // ConcurrentMap<String, PeerImpl>
var announcedAddresses = []; //new ConcurrentHashMap<>();
var allPeers = new Array(); //Collections.unmodifiableCollection(peers.values()); // Collection<PeerImpl>
//var sendToPeersService = Executors.newFixedThreadPool(10);


function AddListener(eventType, listener) {
	return listeners.AddListener(eventType, listener);
}

function AddPeer1(announcedAddress) {
	throw new Error('This is not implemented');
	/*
	if (announcedAddress == null) {
		return null;
	}
	try {
		URI uri = new URI("http://" + announcedAddress.trim());
		String host = uri.getHost();
		InetAddress inetAddress = InetAddress.getByName(host);
		return addPeer(inetAddress.getHostAddress(), announcedAddress);
	} catch (URISyntaxException | UnknownHostException e) {
		//Logger.logDebugMessage("Invalid peer address: " + announcedAddress + ", " + e.toString());
		return null;
	}
	*/
}

function AddPeer2(address, announcedAddress) {
	throw new Error('This is not implemented');
	/*
	//re-add the [] to ipv6 addresses lost in getHostAddress() above
	String clean_address = address;
	if (clean_address.split(":").length > 2) {
		clean_address = "[" + clean_address + "]";
	}
	PeerImpl peer;
	if ((peer = peers.get(clean_address)) != null) {
		return peer;
	}
	String peerAddress = normalizeHostAndPort(clean_address);
	if (peerAddress == null) {
		return null;
	}
	if ((peer = peers.get(peerAddress)) != null) {
		return peer;
	}

	String announcedPeerAddress = address.equals(announcedAddress) ? peerAddress : normalizeHostAndPort(announcedAddress);

	if (Peers.myAddress != null && Peers.myAddress.length() > 0 && Peers.myAddress.equalsIgnoreCase(announcedPeerAddress)) {
		return null;
	}

	peer = new PeerImpl(peerAddress, announcedPeerAddress);
	if (Constants.isTestnet && peer.getPort() > 0 && peer.getPort() != TESTNET_PEER_PORT) {
		Logger.logDebugMessage("Peer " + peerAddress + " on testnet is not using port " + TESTNET_PEER_PORT + ", ignoring");
		return null;
	}
	peers.put(peerAddress, peer);
	if (announcedAddress != null) {
		updateAddress(peer);
	}
	listeners.notify(peer, Event.NEW_PEER);
	return peer;
	*/
}

function GetActivePeers() {
	throw new Error('This is not implemented');
	/*
	List<PeerImpl> activePeers = new ArrayList<>();
	for (PeerImpl peer : peers.values()) {
		if (peer.getState() != Peer.State.NON_CONNECTED) {
			activePeers.add(peer);
		}
	}
	return activePeers;
	*/
}

function GetAllPeers() {
	return allPeers;
}

function GetAnyPeer(state, applyPullThreshold) {
	throw new Error('This is not implemented');
	/*
	List<Peer> selectedPeers = new ArrayList<>();
	for (Peer peer : peers.values()) {
		if (! peer.isBlacklisted() && peer.getState() == state && peer.shareAddress()
				&& (!applyPullThreshold || ! Peers.enableHallmarkProtection || peer.getWeight() >= Peers.pullThreshold)) {
			selectedPeers.add(peer);
		}
	}

	if (selectedPeers.size() > 0) {
		if (! Peers.enableHallmarkProtection) {
			return selectedPeers.get(ThreadLocalRandom.current().nextInt(selectedPeers.size()));
		}
		long totalWeight = 0;
		for (Peer peer : selectedPeers) {
			long weight = peer.getWeight();
			if (weight == 0) {
				weight = 1;
			}
			totalWeight += weight;
		}

		long hit = ThreadLocalRandom.current().nextLong(totalWeight);
		for (Peer peer : selectedPeers) {
			long weight = peer.getWeight();
			if (weight == 0) {
				weight = 1;
			}
			if ((hit -= weight) < 0) {
				return peer;
			}
		}
	}
	return null;
	*/
}

function GetMorePeersThread() {
	/*
	private final JSONStreamAware getPeersRequest;
	{
		JSONObject request = new JSONObject();
		request.put("requestType", "getPeers");
		getPeersRequest = JSON.prepareRequest(request);
	}

	public void run() {
		try {
			try {

				Peer peer = getAnyPeer(Peer.State.CONNECTED, true);
				if (peer == null) {
					return;
				}
				JSONObject response = peer.send(getPeersRequest);
				if (response == null) {
					return;
				}
				JSONArray peers = (JSONArray)response.get("peers");
				Set<String> addedAddresses = new HashSet<>();
				if (peers != null) {
					for (Object announcedAddress : peers) {
						if (addPeer((String) announcedAddress) != null) {
							addedAddresses.add((String) announcedAddress);
						}
					}
					if (savePeers && addedNewPeer) {
						updateSavedPeers();
						addedNewPeer = false;
					}
				}

				JSONArray myPeers = new JSONArray();
				for (Peer myPeer : Peers.getAllPeers()) {
					if (! myPeer.isBlacklisted() && myPeer.getAnnouncedAddress() != null
							&& myPeer.getState() == Peer.State.CONNECTED && myPeer.shareAddress()
							&& ! addedAddresses.contains(myPeer.getAnnouncedAddress())
							&& ! myPeer.getAnnouncedAddress().equals(peer.getAnnouncedAddress())) {
						myPeers.add(myPeer.getAnnouncedAddress());
					}
				}
				if (myPeers.size() > 0) {
					JSONObject request = new JSONObject();
					request.put("requestType", "addPeers");
					request.put("peers", myPeers);
					peer.send(JSON.prepareRequest(request));
				}

			} catch (Exception e) {
				Logger.logDebugMessage("Error requesting peers from a peer", e);
			}
		} catch (Throwable t) {
			Logger.logMessage("CRITICAL ERROR. PLEASE REPORT TO THE DEVELOPERS.\n" + t.toString());
			t.printStackTrace();
			System.exit(1);
		}
	}

	private void updateSavedPeers() {
		Set<String> oldPeers = new HashSet<>(PeerDb.loadPeers());
		Set<String> currentPeers = new HashSet<>();
		for (Peer peer : Peers.peers.values()) {
			if (peer.getAnnouncedAddress() != null && ! peer.isBlacklisted()) {
				currentPeers.add(peer.getAnnouncedAddress());
			}
		}
		Set<String> toDelete = new HashSet<>(oldPeers);
		toDelete.removeAll(currentPeers);
		PeerDb.deletePeers(toDelete);
		currentPeers.removeAll(oldPeers);
		PeerDb.addPeers(currentPeers);
	}
	*/
}

function GetNumberOfConnectedPublicPeers() {
	throw new Error('This is not implemented');
	/*
	int numberOfConnectedPeers = 0;
	for (Peer peer : peers.values()) {
		if (! Peers.enableHallmarkProtection) {
			return selectedPeers.get(ThreadLocalRandom.current().nextInt(selectedPeers.size()));
		}
		if (peer.getState() == Peer.State.CONNECTED && peer.getAnnouncedAddress() != null) {
			numberOfConnectedPeers++;
		}
	}
	return numberOfConnectedPeers;
	*/
}

function GetPeer(peerAddress) {
	return peers[peerAddress];
}

function Init() {
	Core.AddListener(Core.Event.Shutdown, function() {
		Shutdown();
	});
	Core.AddListener(Core.Event.GetState, OnGetState);
	Core.AddListener(Core.Event.InitServer, OnInitServer);

	Init1();
	Init2();
	Init3();
	Init4();
	if (!Constants.isOffline) {
		ThreadPool.ScheduleThread(Peers.PeerConnectingThread, 5);
		ThreadPool.ScheduleThread(Peers.PeerUnBlacklistingThread, 1);
		if (Peers.getMorePeers) {
			ThreadPool.ScheduleThread(Peers.GetMorePeersThread, 5);
		}
	}
	Init8();
	Init9();
}

function Init1() {
	/*
	myPlatform = Nxt.getStringProperty("nxt.myPlatform");
	myAddress = Nxt.getStringProperty("nxt.myAddress");
	if (myAddress != null && myAddress.endsWith(":" + TESTNET_PEER_PORT) && !Constants.isTestnet) {
		throw new RuntimeException("Port " + TESTNET_PEER_PORT + " should only be used for testnet!!!");
	}
	myPeerServerPort = Nxt.getIntProperty("nxt.peerServerPort");
	if (myPeerServerPort == TESTNET_PEER_PORT && !Constants.isTestnet) {
		throw new RuntimeException("Port " + TESTNET_PEER_PORT + " should only be used for testnet!!!");
	}
	shareMyAddress = Nxt.getBooleanProperty("nxt.shareMyAddress") && ! Constants.isOffline;
	myHallmark = Nxt.getStringProperty("nxt.myHallmark");
	if (Peers.myHallmark != null && Peers.myHallmark.length() > 0) {
		try {
			Hallmark hallmark = Hallmark.parseHallmark(Peers.myHallmark);
			if (!hallmark.isValid() || myAddress == null) {
				throw new RuntimeException();
			}
			URI uri = new URI("http://" + myAddress.trim());
			String host = uri.getHost();
			if (!hallmark.getHost().equals(host)) {
				throw new RuntimeException();
			}
		} catch (RuntimeException|URISyntaxException e) {
			Logger.logMessage("Your hallmark is invalid: " + Peers.myHallmark + " for your address: " + myAddress);
			throw new RuntimeException(e.toString(), e);
		}
	}
	*/
}

function Init2() {
	var json = {};
	if (this.myAddress != null && this.myAddress.length > 0) {
		try {
			var uri = new URI("http://" + myAddress.trim());
			var host = uri.hostname; //uri.getHost();
			var port = uri.port(); //uri.getPort();
			json.announcedAddress = host;
		} catch (e) {
			Logger.warn("Your announce address is invalid: " + myAddress);
			throw new Error(e);
		}
	}
	if (Peers.myHallmark != null && Peers.myHallmark.length > 0) {
		json.hallmark = Peers.myHallmark;
	}
	json.application = Core.GetApplication();
	json.version = Core.GetVersion();
	json.platform = Peers.myPlatform;
	json.shareAddress = Peers.shareMyAddress;
	Logger.debug("My peer info:\n" + json);
	this.myPeerInfoResponse = json;
	json.requestType = "getInfo";
	this.myPeerInfoRequest = json;
}

function Init3() {
	/*
	List<String> wellKnownPeersList = Constants.isTestnet ? Nxt.getStringListProperty("nxt.testnetPeers")
			: Nxt.getStringListProperty("nxt.wellKnownPeers");
	if (wellKnownPeersList.isEmpty()) {
		wellKnownPeers = Collections.emptySet();
	} else {
		wellKnownPeers = Collections.unmodifiableSet(new HashSet<>(wellKnownPeersList));
	}

	List<String> knownBlacklistedPeersList = Nxt.getStringListProperty("nxt.knownBlacklistedPeers");
	if (knownBlacklistedPeersList.isEmpty()) {
		knownBlacklistedPeers = Collections.emptySet();
	} else {
		knownBlacklistedPeers = Collections.unmodifiableSet(new HashSet<>(knownBlacklistedPeersList));
	}

	maxNumberOfConnectedPublicPeers = Nxt.getIntProperty("nxt.maxNumberOfConnectedPublicPeers");
	connectTimeout = Nxt.getIntProperty("nxt.connectTimeout");
	readTimeout = Nxt.getIntProperty("nxt.readTimeout");
	enableHallmarkProtection = Nxt.getBooleanProperty("nxt.enableHallmarkProtection");
	pushThreshold = Nxt.getIntProperty("nxt.pushThreshold");
	pullThreshold = Nxt.getIntProperty("nxt.pullThreshold");

	blacklistingPeriod = Nxt.getIntProperty("nxt.blacklistingPeriod");
	communicationLoggingMask = Nxt.getIntProperty("nxt.communicationLoggingMask");
	sendToPeersLimit = Nxt.getIntProperty("nxt.sendToPeersLimit");
	usePeersDb = Nxt.getBooleanProperty("nxt.usePeersDb") && ! Constants.isOffline;
	savePeers = usePeersDb && Nxt.getBooleanProperty("nxt.savePeers");
	getMorePeers = Nxt.getBooleanProperty("nxt.getMorePeers");

	ThreadPool.runBeforeStart(new Runnable() {
		private void loadPeers(List<Future<String>> unresolved, Collection<String> addresses) {
			for (final String address : addresses) {
				Future<String> unresolvedAddress = sendToPeersService.submit(new Callable<String>() {
					public String call() {
						Peer peer = Peers.addPeer(address);
						return peer == null ? address : null;
					}
				});
				unresolved.add(unresolvedAddress);
			}
		}

		public void run() {
			List<Future<String>> unresolvedPeers = new ArrayList<>();
			if (! wellKnownPeers.isEmpty()) {
				loadPeers(unresolvedPeers, wellKnownPeers);
			}
			if (usePeersDb) {
				Logger.logDebugMessage("Loading known peers from the database...");
				loadPeers(unresolvedPeers, PeerDb.loadPeers());
			}
			for (Future<String> unresolvedPeer : unresolvedPeers) {
				try {
					String badAddress = unresolvedPeer.get(5, TimeUnit.SECONDS);
					if (badAddress != null) {
						Logger.logDebugMessage("Failed to resolve peer address: " + badAddress);
					}
				} catch (InterruptedException e) {
					Thread.currentThread().interrupt();
				} catch (ExecutionException e) {
					Logger.logDebugMessage("Failed to add peer", e);
				} catch (TimeoutException e) {
				}
			}
			Logger.logDebugMessage("Known peers: " + peers.size());
		}
	}, false);
	*/
}

function Init4() {
	/*
	usePeersDb = Nxt.getBooleanProperty("nxt.usePeersDb");
	if (usePeersDb) {
		Logger.logDebugMessage("Loading known peers from the database...");
		for (String savedPeer : PeerDb.loadPeers()) {
			Peers.addPeer(savedPeer);
		}
	}
	Logger.logDebugMessage("Known peers: " + peers.size());
	savePeers = usePeersDb && Nxt.getBooleanProperty("nxt.savePeers");
	*/
}

function Init8() {
	Account.AddListener(Account.Event.BALANCE, function(account) {
		/*
		for (PeerImpl peer : Peers.peers.values()) {
			if (peer.getHallmark() != null && peer.getHallmark().getAccountId().equals(account.getId())) {
				Peers.listeners.Notify(Peers.Event.WEIGHT, peer);
			}
		}
		*/
	});
}

function Init9() {
	/*
	if (Peers.shareMyAddress) {
		peerServer = new Server();
		ServerConnector connector = new ServerConnector(peerServer);
		final int port = Constants.isTestnet ? TESTNET_PEER_PORT : Peers.myPeerServerPort;
		connector.setPort(port);
		final String host = Nxt.getStringProperty("nxt.peerServerHost");
		connector.setHost(host);
		connector.setIdleTimeout(Nxt.getIntProperty("nxt.peerServerIdleTimeout"));
		connector.setReuseAddress(true);
		peerServer.addConnector(connector);

		ServletHolder peerServletHolder = new ServletHolder(new PeerServlet());
		boolean isGzipEnabled = Nxt.getBooleanProperty("nxt.enablePeerServerGZIPFilter");
		peerServletHolder.setInitParameter("isGzipEnabled", Boolean.toString(isGzipEnabled));
		ServletHandler peerHandler = new ServletHandler();
		peerHandler.addServletWithMapping(peerServletHolder, "/*");
		if (Nxt.getBooleanProperty("nxt.enablePeerServerDoSFilter")) {
			FilterHolder dosFilterHolder = peerHandler.addFilterWithMapping(DoSFilter.class, "/*", FilterMapping.DEFAULT);
			dosFilterHolder.setInitParameter("maxRequestsPerSec", Nxt.getStringProperty("nxt.peerServerDoSFilter.maxRequestsPerSec"));
			dosFilterHolder.setInitParameter("delayMs", Nxt.getStringProperty("nxt.peerServerDoSFilter.delayMs"));
			dosFilterHolder.setInitParameter("maxRequestMs", Nxt.getStringProperty("nxt.peerServerDoSFilter.maxRequestMs"));
			dosFilterHolder.setInitParameter("trackSessions", "false");
			dosFilterHolder.setAsyncSupported(true);
		}
		if (isGzipEnabled) {
			FilterHolder gzipFilterHolder = peerHandler.addFilterWithMapping(GzipFilter.class, "/*", FilterMapping.DEFAULT);
			gzipFilterHolder.setInitParameter("methods", "GET,POST");
			gzipFilterHolder.setAsyncSupported(true);
		}

		peerServer.setHandler(peerHandler);
		peerServer.setStopAtShutdown(true);
		ThreadPool.runBeforeStart(new Runnable() {
			public void run() {
				try {
					peerServer.start();
					Logger.logMessage("Started peer networking server at " + host + ":" + port);
				} catch (Exception e) {
					Logger.logErrorMessage("Failed to start peer networking server", e);
					throw new RuntimeException(e.toString(), e);
				}
			}
		}, true);
	} else {
		peerServer = null;
		Logger.logMessage("shareMyAddress is disabled, will not start peer networking server");
	}
	*/
}

function NotifyListeners(eventType, peer) {
	listeners.Notify(eventType, peer);
}

function NormalizeHostAndPort(address) {
	throw new Error('This is not implemented');
	/*
	try {
		if (address == null) {
			return null;
		}
		URI uri = new URI("http://" + address.trim());
		String host = uri.getHost();
		if (host == null || host.equals("") || host.equals("localhost") ||
							host.equals("127.0.0.1") || host.equals("[0:0:0:0:0:0:0:1]")) {
			return null;
		}
		InetAddress inetAddress = InetAddress.getByName(host);
		if (inetAddress.isAnyLocalAddress() || inetAddress.isLoopbackAddress() ||
											   inetAddress.isLinkLocalAddress()) {
			return null;
		}
		int port = uri.getPort();
		return port == -1 ? host : host + ':' + port;
	} catch (URISyntaxException |UnknownHostException e) {
		return null;
	}
	*/
}

function OnGetState(response) {
	response.numberOfPeers = allPeers.length;
}

function OnInitServer(app) {
	var Api = require(__dirname + "/Api");
	app.get("/api/decodeHallmark", Api.DecodeHallmark);
	app.get("/api/getPeer", Api.GetPeer);
	app.get("/api/getPeers", Api.GetPeers);
	app.get("/api/markHost", Api.MarkHost); // post
}

function PeerConnectingThread() {
	throw new Error('This is not implemented');
	/*
	try {
		try {
			if (getNumberOfConnectedPublicPeers() < Peers.maxNumberOfConnectedPublicPeers) {
				PeerImpl peer = (PeerImpl)getAnyPeer(ThreadLocalRandom.current().nextInt(2) == 0 ? Peer.State.NON_CONNECTED : Peer.State.DISCONNECTED, false);
				if (peer != null) {
					peer.connect();
				}

				int now = Convert.getEpochTime();
				for (PeerImpl peer : peers.values()) {
					if (peer.getState() == Peer.State.CONNECTED && now - peer.getLastUpdated() > 3600) {
						peer.connect();
					}
				}
			}
		} catch (Exception e) {
			Logger.logDebugMessage("Error connecting to peer", e);
		}
	} catch (Throwable t) {
		Logger.logMessage("CRITICAL ERROR. PLEASE REPORT TO THE DEVELOPERS.\n" + t.toString());
		t.printStackTrace();
		System.exit(1);
	}
	*/
}

/*
private volatile boolean addedNewPeer;
{
	Peers.addListener(new Listener<Peer>() {
		@Override
		public void notify(Peer peer) {
			addedNewPeer = true;
		}
	}, Event.NEW_PEER);
}
*/

function PeerUnBlacklistingThread() {
	throw new Error('This is not implemented');
	/*
	public void run() {
		try {
			try {
				long curTime = System.currentTimeMillis();
				for (PeerImpl peer : peers.values()) {
					peer.updateBlacklistedStatus(curTime);
				}
			} catch (Exception e) {
				Logger.logDebugMessage("Error un-blacklisting peer", e);
			}
		} catch (Throwable t) {
			Logger.logMessage("CRITICAL ERROR. PLEASE REPORT TO THE DEVELOPERS.\n" + t.toString());
			t.printStackTrace();
			System.exit(1);
		}
	}
	*/
}

function RemoveListener(eventType, listener) {
	return listeners.RemoveListener(eventType, listener);
}

function RemovePeer(peer) {
	throw new Error('This is not implemented');
	/*
	if (peer.getAnnouncedAddress() != null) {
		announcedAddresses.remove(peer.getAnnouncedAddress());
	}
	*/
}

function SendToSomePeersBlock(block) {
	throw new Error('This is not implemented');
	/*
	JSONObject request = block.getJSONObject();
	request.put("requestType", "processBlock");
	sendToSomePeers(request);
	*/
}

function SendToSomePeersRequest(request) {
	throw new Error('This is not implemented');
	/*
	final JSONStreamAware jsonRequest = JSON.prepareRequest(request);

	int successful = 0;
	List<Future<JSONObject>> expectedResponses = new ArrayList<>();
	for (final Peer peer : peers.values()) {

		if (Peers.enableHallmarkProtection && peer.getWeight() < Peers.pushThreshold) {
			continue;
		}

		if (! peer.isBlacklisted() && peer.getState() == Peer.State.CONNECTED && peer.getAnnouncedAddress() != null) {
			Future<JSONObject> futureResponse = sendToPeersService.submit(new Callable<JSONObject>() {
				@Override
				public JSONObject call() {
					return peer.send(jsonRequest);
				}
			});
			expectedResponses.add(futureResponse);
		}
		if (expectedResponses.size() >= Peers.sendToPeersLimit - successful) {
			for (Future<JSONObject> future : expectedResponses) {
				try {
					JSONObject response = future.get();
					if (response != null && response.get("error") == null) {
						successful += 1;
					}
				} catch (InterruptedException e) {
					Thread.currentThread().interrupt();
				} catch (ExecutionException e) {
					Logger.logDebugMessage("Error in sendToSomePeers", e);
				}

			}
			expectedResponses.clear();
		}
		if (successful >= Peers.sendToPeersLimit) {
			return;
		}
	}
	*/
}

function SendToSomePeersTransactions(transactions) {
	throw new Error('This is not implemented');
	/*
	JSONObject request = new JSONObject();
	JSONArray transactionsData = new JSONArray();
	for (Transaction transaction : transactions) {
		transactionsData.add(transaction.getJSONObject());
	}
	request.put("requestType", "processTransactions");
	request.put("transactions", transactionsData);
	sendToSomePeers(request);
	*/
}

function Shutdown() {
	throw new Error('This is not implemented');
	/*
	if (Init.peerServer != null) {
		try {
			Init.peerServer.stop();
		} catch (Exception e) {
			Logger.logDebugMessage("Failed to stop peer server", e);
		}
	}
	String dumpPeersVersion = Nxt.getStringProperty("nxt.dumpPeersVersion");
	if (dumpPeersVersion != null) {
		StringBuilder buf = new StringBuilder();
		for (Map.Entry<String,String> entry : announcedAddresses.entrySet()) {
			Peer peer = peers.get(entry.getValue());
			if (peer != null && peer.getState() == Peer.State.CONNECTED && peer.shareAddress() && !peer.isBlacklisted()
					&& peer.getVersion() != null && peer.getVersion().startsWith(dumpPeersVersion)) {
				buf.append("('").append(entry.getKey()).append("'), ");
			}
		}
		Logger.logDebugMessage(buf.toString());
	}
	ThreadPool.shutdownExecutor(sendToPeersService);
	*/
}

function UpdateAddress(peer) {
	throw new Error('This is not implemented');
	/*
	String oldAddress = announcedAddresses.put(peer.getAnnouncedAddress(), peer.getPeerAddress());
	if (oldAddress != null && !peer.getPeerAddress().equals(oldAddress)) {
		Logger.logDebugMessage("Peer " + peer.getAnnouncedAddress() + " has changed address from " + oldAddress
				+ " to " + peer.getPeerAddress());
		Peer oldPeer = peers.remove(oldAddress);
		if (oldPeer != null) {
			Peers.notifyListeners(oldPeer, Peers.Event.REMOVE);
		}
	}
	*/
}


exports.Event = Event;
exports.State = State;

exports.AddListener = AddListener;
exports.AddPeer1 = AddPeer1;
exports.AddPeer2 = AddPeer2;
exports.GetActivePeers = GetActivePeers;
exports.GetAllPeers = GetAllPeers;
exports.GetAnyPeer = GetAnyPeer;
exports.GetNumberOfConnectedPublicPeers = GetNumberOfConnectedPublicPeers;
exports.GetPeer = GetPeer;
exports.Init = Init;
exports.NotifyListeners = NotifyListeners;
exports.NormalizeHostAndPort = NormalizeHostAndPort;
exports.RemoveListener = RemoveListener;
exports.RemovePeer = RemovePeer;
exports.SendToSomePeersBlock = SendToSomePeersBlock;
exports.SendToSomePeersRequest = SendToSomePeersRequest;
exports.SendToSomePeersTransactions = SendToSomePeersTransactions;
exports.Shutdown = Shutdown;
exports.UpdateAddress = UpdateAddress;
