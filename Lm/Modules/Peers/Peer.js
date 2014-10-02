/**!
 * LibreMoney Peer 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

if (typeof module !== "undefined") {
	//BlockchainProcessor
	//Constants
	//Convert
	//Logger
	//Peers
}


var defaultPort = 1400;


function Peer(peerAddress, announcedAddress, services) { /*host, port*/
	if (typeof peerAddress === "string") {
		if (peerAddress.indexOf(":") && !port) {
			var parts = peerAddress.split(":");
			peerAddress = parts[0];
			port = parts[1];
		}
		this.host = peerAddress;
		this.port = +port || defaultPort;
	} else if (peerAddress instanceof Peer) {
		this.host = peerAddress.host;
		this.port = peerAddress.port;
	} else if (Buffer.isBuffer(peerAddress)) {
		this.host = peerAddress.toString("hex").match(/(.{1,4})/g).join(":");
		this.port = +port || defaultPort;
	} else if (peerAddress instanceof Object) {
		return this.FromData(peerAddress);
	} else {
		throw new Error("Could not instantiate peer, invalid parameter type: " + typeof peerAddress);
	}
	this.services = services ? services : null;
	this.maxLostConnection = 10;
	this.lostConnection = 0;
	this.connection = null;
	this.uploadBytes = 0;
	this.downloadBytes = 0;
	this.timestamp = null;
	this.lastSeen = null;
	this.status = Constants.NetStatuses.Disable;
	this.oldStatus = null;

	/*
	private volatile int lastUpdated;
	private volatile boolean shareAddress;
	private volatile Hallmark hallmark;
	private volatile String platform;
	private volatile String application;
	private volatile String version;
	private volatile long adjustedWeight;
	private volatile long blacklistingTime;
	private volatile State state;
	private volatile long downloadedVolume;
	private volatile long uploadedVolume;
	*/
	
	this.peerAddress = peerAddress;
	this.announcedAddress = announcedAddress;
	
	/*
	this.port = new URL("http://" + announcedAddress).getPort();
	*/
	this.state = State.NON_CONNECTED;
	this.shareAddress = true;
	return this;
}
function Peer(host, port, services) {
}

Peer.prototype.AnalyzeHallmark = function(address, hallmarkString) {
	throw new Error('This is not implemented');
	/*
	if (hallmarkString == null && this.hallmark == null) {
		return true;
	}

	if (this.hallmark != null && this.hallmark.getHallmarkString().equals(hallmarkString)) {
		return true;
	}

	if (hallmarkString == null) {
		this.hallmark = null;
		return true;
	}

	try {
		URI uri = new URI("http://" + address.trim());
		String host = uri.getHost();

		Hallmark hallmark = Hallmark.parseHallmark(hallmarkString);
		if (!hallmark.isValid()
				|| !(hallmark.getHost().equals(host) || InetAddress.getByName(host).equals(InetAddress.getByName(hallmark.getHost())))) {
			//Logger.logDebugMessage("Invalid hallmark for " + host + ", hallmark host is " + hallmark.getHost());
			return false;
		}
		this.hallmark = hallmark;
		Long accountId = Account.getId(hallmark.getPublicKey());
		List<PeerImpl> groupedPeers = new ArrayList<>();
		int mostRecentDate = 0;
		long totalWeight = 0;
		for (PeerImpl peer : Peers.allPeers) {
			if (peer.hallmark == null) {
				continue;
			}
			if (accountId.equals(peer.hallmark.getAccountId())) {
				groupedPeers.add(peer);
				if (peer.hallmark.getDate() > mostRecentDate) {
					mostRecentDate = peer.hallmark.getDate();
					totalWeight = peer.getHallmarkWeight(mostRecentDate);
				} else {
					totalWeight += peer.getHallmarkWeight(mostRecentDate);
				}
			}
		}

		for (PeerImpl peer : groupedPeers) {
			peer.adjustedWeight = Constants.MaxBalanceLm * peer.getHallmarkWeight(mostRecentDate) / totalWeight;
			Peers.NotifyListeners(Peers.Event.WEIGHT, peer);
		}

		return true;

	} catch (UnknownHostException ignore) {
	} catch (URISyntaxException | RuntimeException e) {
		Logger.logDebugMessage("Failed to analyze hallmark for peer " + address + ", " + e.toString());
	}
	return false;
	*/
}

Peer.prototype.Blacklist = function(cause) {
	throw new Error('This is not implemented');
	if (!cause) {
		/*
		blacklistingTime = System.currentTimeMillis();
		setState(State.NON_CONNECTED);
		Peers.NotifyListeners(Peers.Event.BLACKLIST, this);
		*/
	} else {
		/*
		if (cause instanceof NxtException.NotCurrentlyValidException || cause instanceof BlockchainProcessor.BlockOutOfOrderException) {
			// don't blacklist peers just because a feature is not yet enabled
			// prevents erroneous blacklisting during loading of blockchain from scratch
			return;
		}
		if (! isBlacklisted() && ! (cause instanceof IOException)) {
			Logger.logDebugMessage("Blacklisting " + peerAddress + " because of: " + cause.toString());
		}
		blacklist();
		*/
	}
}

Peer.prototype.CompareTo = function(o) {
	if (this.GetWeight() > o.GetWeight()) {
		return -1;
	} else if (this.GetWeight() < o.GetWeight()) {
		return 1;
	}
	return 0;
}

Peer.prototype.Connect = function() {
	throw new Error('This is not implemented');
	/*
	JSONObject response = send(Peers.myPeerInfoRequest);
	if (response != null) {
		application = (String)response.get("application");
		version = (String)response.get("version");
		platform = (String)response.get("platform");
		shareAddress = Boolean.TRUE.equals(response.get("shareAddress"));
		String newAnnouncedAddress = Convert.emptyToNull((String)response.get("announcedAddress"));
		if (newAnnouncedAddress != null && ! newAnnouncedAddress.equals(announcedAddress)) {
			// force verification of changed announced address
			setState(Peer.State.NON_CONNECTED);
			setAnnouncedAddress(newAnnouncedAddress);
			return;
		}
		if (announcedAddress == null) {
			setAnnouncedAddress(peerAddress);
			Logger.logDebugMessage("Connected to peer without announced address, setting to " + peerAddress);
		}
		if (analyzeHallmark(announcedAddress, (String)response.get("hallmark"))) {
			setState(State.CONNECTED);
			Peers.updateAddress(this);
		} else {
			blacklist();
		}
		lastUpdated = Convert.getEpochTime();
	} else {
		setState(State.NON_CONNECTED);
	}
	*/
}

Peer.prototype.ConnectionLost = function() {
	if (this.lostConnection === 0) {
		this.UpdateLastSeen();
	}
	this.lostConnection++;
	this.connection = null;
	this.timestamp = null;
	this.oldStatus = this.status;
	this.status = Peers.Statuses.Pending;
}

Peer.prototype.Deactivate = function() {
	this.SetState(State.NON_CONNECTED);
	Peers.NotifyListeners(Peers.Event.DEACTIVATE, this);
}

Peer.prototype.FromData = function(data) {
	this.port = data.port || null;
	this.host = data.host || null;
	this.uploadBytes = data.uploadBytes || 0;
	this.downloadBytes = data.downloadBytes || 0;
	this.services = data.services || null;
	this.maxLostConnection = data.maxLostConnection || 0;
	this.lostConnection = data.lostConnection || 0;
	this.status = data.status || Peers.Statuses.Disable;
	return this;
}

Peer.prototype.GetAnnouncedAddress = function() {
	return this.announcedAddress;
}

Peer.prototype.GetApplication = function() {
	return this.application;
}

Peer.prototype.GetConnection = function() {
	if (this.connection === null) {
		this.UpdateUpTime();
		this.connection = net.createConnection(this.port, this.host);
		this.status = this.oldStatus === null ? Peers.Statuses.Disable : this.oldStatus;
	}
	return this.connection;
}

Peer.prototype.GetData = function() {
	return {
		port: this.port,
		host: this.host,
		uploadBytes: this.uploadBytes,
		downloadBytes: this.downloadBytes,
		services: this.services,
		maxLostConnection: this.maxLostConnection,
		lostConnection: this.lostConnection,
		status: this.status
	}
}

Peer.prototype.GetDownloadedVolume = function() {
	return this.downloadedVolume;
}

Peer.prototype.GetHallmark = function() {
	return this.hallmark;
}

Peer.prototype.GetHallmarkWeight = function(date) {
	if (this.hallmark == null || ! this.hallmark.IsValid() || this.hallmark.GetDate() != date) {
		return 0;
	}
	return this.hallmark.GetWeight();
}

Peer.prototype.GetHostAsBuffer = function() {
	return new Buffer(this.host.split("."));
}

Peer.prototype.GetLastUpdated = function() {
	return this.lastUpdated;
}

Peer.prototype.GetPeerAddress = function() {
	return this.peerAddress;
}

Peer.prototype.GetPlatform = function() {
	return this.platform;
}

Peer.prototype.GetPort = function() {
	return this.port;
}

Peer.prototype.GetSoftware = function() {
	throw new Error('This is not implemented');
	/*
	return Convert.truncate(application, "?", 10, false)
			+ " (" + Convert.truncate(version, "?", 10, false) + ")"
			+ " @ " + Convert.truncate(platform, "?", 10, false);
	*/
}

Peer.prototype.GetState = function() {
	return this.state;
}

Peer.prototype.GetVersion = function() {
	return this.version;
}

Peer.prototype.GetWeight = function() {
	throw new Error('This is not implemented');
	/*
	if (hallmark == null) {
		return 0;
	}
	Account account = Account.getAccount(hallmark.getAccountId());
	if (account == null) {
		return 0;
	}
	return (int)(adjustedWeight * (account.getBalanceNQT() / Constants.OneLm) / Constants.MaxBalanceLm);
	*/
}

Peer.prototype.GetUploadedVolume = function() {
	return this.uploadedVolume;
}

Peer.prototype.IsBlacklisted = function() {
	return this.blacklistingTime > 0 || Peers.knownBlacklistedPeers.contains(this.peerAddress);
}

Peer.prototype.IsLost = function() {
	if (this.lostConnection >= this.maxLostConnection) {
		this.status = Peers.Statuses.Disable;
		return true;
	}
	return false;
}

Peer.prototype.IsWellKnown = function() {
	return this.announcedAddress != null && Peers.wellKnownPeers.contains(this.announcedAddress);
}

Peer.prototype.Remove = function() {
	Peers.RemovePeer(this);
	Peers.NotifyListeners(Peers.Event.REMOVE, this);
}

Peer.prototype.Send = function(request) {
	throw new Error('This is not implemented');
	/*
	JSONObject response;

	String log = null;
	boolean showLog = false;
	HttpURLConnection connection = null;

	try {

		String address = announcedAddress != null ? announcedAddress : peerAddress;
		URL url = new URL("http://" + address + (port <= 0 ? ":" + (Constants.isTestnet ? Peers.TESTNET_PEER_PORT : Peers.DEFAULT_PEER_PORT) : "") + "/nxt");

		if (Peers.communicationLoggingMask != 0) {
			StringWriter stringWriter = new StringWriter();
			request.writeJSONString(stringWriter);
			log = "\"" + url.toString() + "\": " + stringWriter.toString();
		}

		connection = (HttpURLConnection)url.openConnection();
		connection.setRequestMethod("POST");
		connection.setDoOutput(true);
		connection.setConnectTimeout(Peers.connectTimeout);
		connection.setReadTimeout(Peers.readTimeout);
		connection.setRequestProperty("Accept-Encoding", "gzip");

		CountingOutputStream cos = new CountingOutputStream(connection.getOutputStream());
		try (Writer writer = new BufferedWriter(new OutputStreamWriter(cos, "UTF-8"))) {
			request.writeJSONString(writer);
		}
		updateUploadedVolume(cos.getCount());

		if (connection.getResponseCode() == HttpURLConnection.HTTP_OK) {
			CountingInputStream cis = new CountingInputStream(connection.getInputStream());
			InputStream responseStream = cis;
			if ("gzip".equals(connection.getHeaderField("Content-Encoding"))) {
				responseStream = new GZIPInputStream(cis);
			}
			if ((Peers.communicationLoggingMask & Peers.LOGGING_MASK_200_RESPONSES) != 0) {
				ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
				byte[] buffer = new byte[1024];
				int numberOfBytes;
				try (InputStream inputStream = responseStream) {
					while ((numberOfBytes = inputStream.read(buffer, 0, buffer.length)) > 0) {
						byteArrayOutputStream.write(buffer, 0, numberOfBytes);
					}
				}
				String responseValue = byteArrayOutputStream.toString("UTF-8");
				if (responseValue.length() > 0 && responseStream instanceof GZIPInputStream) {
					log += String.format("[length: %d, compression ratio: %.2f]", cis.getCount(), (double)cis.getCount() / (double)responseValue.length());
				}
				log += " >>> " + responseValue;
				showLog = true;
				response = (JSONObject) JSONValue.parse(responseValue);
			} else {
				try (Reader reader = new BufferedReader(new InputStreamReader(responseStream, "UTF-8"))) {
					response = (JSONObject)JSONValue.parse(reader);
				}
			}
			updateDownloadedVolume(cis.getCount());
		} else {

			if ((Peers.communicationLoggingMask & Peers.LOGGING_MASK_NON200_RESPONSES) != 0) {
				log += " >>> Peer responded with HTTP " + connection.getResponseCode() + " code!";
				showLog = true;
			}
			if (state == State.CONNECTED) {
				setState(State.DISCONNECTED);
			} else {
				setState(State.NON_CONNECTED);
			}
			response = null;

		}

	} catch (RuntimeException|IOException e) {
		if (! (e instanceof UnknownHostException || e instanceof SocketTimeoutException || e instanceof SocketException)) {
			Logger.logDebugMessage("Error sending JSON request", e);
		}
		if ((Peers.communicationLoggingMask & Peers.LOGGING_MASK_EXCEPTIONS) != 0) {
			log += " >>> " + e.toString();
			showLog = true;
		}
		if (state == State.CONNECTED) {
			setState(State.DISCONNECTED);
		}
		response = null;
	}

	if (showLog) {
		Logger.logMessage(log + "\n");
	}

	if (connection != null) {
		connection.disconnect();
	}

	return response;
	*/
}

Peer.prototype.SetAnnouncedAddress = function(announcedAddress) {
	throw new Error('This is not implemented');
	/*
	String announcedPeerAddress = Peers.normalizeHostAndPort(announcedAddress);
	if (announcedPeerAddress != null) {
		this.announcedAddress = announcedPeerAddress;
		try {
			this.port = new URL("http://" + announcedPeerAddress).getPort();
		} catch (MalformedURLException ignore) {}
	}
	*/
}

Peer.prototype.SetApplication = function(application) {
	this.application = application;
}

Peer.prototype.SetLastUpdated = function(lastUpdated) {
	this.lastUpdated = lastUpdated;
}

Peer.prototype.SetPlatform = function(platform) {
	this.platform = platform;
}

Peer.prototype.SetShareAddress = function(shareAddress) {
	this.shareAddress = shareAddress;
}

Peer.prototype.SetState = function(state) {
	if (this.state == state) {
		return;
	}
	if (this.state == State.NON_CONNECTED) {
		this.state = state;
		Peers.NotifyListeners(Peers.Event.ADDED_ACTIVE_PEER, this);
	} else if (state != State.NON_CONNECTED) {
		this.state = state;
		Peers.NotifyListeners(Peers.Event.CHANGED_ACTIVE_PEER, this);
	}
}

Peer.prototype.SetVersion = function(version) {
	this.version = version;
}

Peer.prototype.ShareAddress = function() {
	return this.shareAddress;
}

Peer.prototype.ToBuffer = function() {
	return "";
}

Peer.prototype.ToString = function() {
	return this.host + ":" + this.port;
}

Peer.prototype.UnBlacklist = function() {
	this.SetState(State.NON_CONNECTED);
	this.blacklistingTime = 0;
	Peers.NotifyListeners(Peers.Event.UNBLACKLIST, this);
}

Peer.prototype.UpdateBlacklistedStatus = function(curTime) {
	if (this.blacklistingTime > 0 && this.blacklistingTime + Peers.blacklistingPeriod <= curTime) {
		this.UnBlacklist();
	}
}

Peer.prototype.UpdateDownloadedVolume = function(volume) {
	this.downloadedVolume += volume;
	Peers.NotifyListeners(Peers.Event.DOWNLOADED_VOLUME, this);
}

Peer.prototype.UpdateLastSeen = function() {
	this.lastSeen = new Date().getTime();
}

Peer.prototype.UpdateUploadedVolume = function(volume) {
	this.uploadedVolume += volume;
	Peers.NotifyListeners(Peers.Event.UPLOADED_VOLUME, this);
}

Peer.prototype.UpdateUpTime = function() {
	this.timestamp = new Date().getTime();
}


if (typeof module !== "undefined") {
	module.exports = Peer;
}
