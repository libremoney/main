/*
import org.json.simple.JSONObject;
import org.json.simple.JSONStreamAware;
*/

/*
import nxt.Account;
import nxt.BlockchainProcessor;
import nxt.Constants;
import nxt.TransactionType;
import nxt.util.Convert;
import nxt.util.CountingInputStream;
import nxt.util.CountingOutputStream;
import nxt.util.Logger;
import org.json.simple.JSONObject;
import org.json.simple.JSONStreamAware;
import org.json.simple.JSONValue;
*/

/*
private final String peerAddress;
private volatile String announcedAddress;
private volatile int port;
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


function Peer(peerAddress, announcedAddress) {
	this.peerAddress = peerAddress;
	this.announcedAddress = announcedAddress;
	/*
	try {
		this.port = new URL("http://" + announcedAddress).getPort();
	} catch (MalformedURLException ignore) {}
	this.state = State.NON_CONNECTED;
	this.shareAddress = true;
	*/
	return this;
}

function GetPeerAddress() {
	throw new Error('This is not implemented');
	/*
	return peerAddress;
	*/
}

function GetState() {
	throw new Error('This is not implemented');
	/*
	return state;
	*/
}

function SetState(state) {
	throw new Error('This is not implemented');
	/*
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
	*/
}

function GetDownloadedVolume() {
	throw new Error('This is not implemented');
	/*
	return downloadedVolume;
	*/
}

function UpdateDownloadedVolume(volume) {
	throw new Error('This is not implemented');
	/*
	synchronized (this) {
		downloadedVolume += volume;
	}
	Peers.NotifyListeners(Peers.Event.DOWNLOADED_VOLUME, this);
	*/
}

function GetUploadedVolume() {
	throw new Error('This is not implemented');
	/*
	return uploadedVolume;
	*/
}

function UpdateUploadedVolume(volume) {
	throw new Error('This is not implemented');
	/*
	synchronized (this) {
		uploadedVolume += volume;
	}
	Peers.NotifyListeners(Peers.Event.UPLOADED_VOLUME, this);
	*/
}

function GetVersion() {
	throw new Error('This is not implemented');
	/*
	return version;
	*/
}

function SetVersion(version) {
	throw new Error('This is not implemented');
	/*
	this.version = version;
	*/
}

function GetApplication() {
	throw new Error('This is not implemented');
	/*
	return application;
	*/
}

function SetApplication(application) {
	throw new Error('This is not implemented');
	/*
	this.application = application;
	*/
}

function GetPlatform() {
	throw new Error('This is not implemented');
	/*
	return platform;
	*/
}

function SetPlatform(platform) {
	throw new Error('This is not implemented');
	/*
	this.platform = platform;
	*/
}

function GetSoftware() {
	throw new Error('This is not implemented');
	/*
	return Convert.truncate(application, "?", 10, false)
			+ " (" + Convert.truncate(version, "?", 10, false) + ")"
			+ " @ " + Convert.truncate(platform, "?", 10, false);
	*/
}

function ShareAddress() {
	throw new Error('This is not implemented');
	/*
	return shareAddress;
	*/
}

function SetShareAddress(shareAddress) {
	throw new Error('This is not implemented');
	/*
	this.shareAddress = shareAddress;
	*/
}

function GetAnnouncedAddress() {
	throw new Error('This is not implemented');
	/*
	return announcedAddress;
	*/
}

function SetAnnouncedAddress(announcedAddress) {
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

function GetPort() {
	throw new Error('This is not implemented');
	/*
	return port;
	*/
}

function IsWellKnown() {
	throw new Error('This is not implemented');
	/*
	return announcedAddress != null && Peers.wellKnownPeers.contains(announcedAddress);
	*/
}

function GetHallmark() {
	throw new Error('This is not implemented');
	/*
	return hallmark;
	*/
}

function GetWeight() {
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

function IsBlacklisted() {
	throw new Error('This is not implemented');
	/*
	return blacklistingTime > 0 || Peers.knownBlacklistedPeers.contains(peerAddress);
	*/
}

function Blacklist(cause) {
	throw new Error('This is not implemented');
	if (!cause) {
		/*
		blacklistingTime = System.currentTimeMillis();
		setState(State.NON_CONNECTED);
		Peers.NotifyListeners(Peers.Event.BLACKLIST, this);
		*/
	} else {
		/*
		if (cause instanceof TransactionType.NotYetEnabledException || cause instanceof BlockchainProcessor.BlockOutOfOrderException) {
			// don't blacklist peers just because a feature is not yet enabled
			// prevents erroneous blacklisting during loading of blockchain from scratch
			return;
		}
		if (! isBlacklisted()) {
			Logger.logDebugMessage("Blacklisting " + peerAddress + " because of: " + cause.toString());
		}
		blacklist();
		*/
	}
}

function UnBlacklist() {
	throw new Error('This is not implemented');
	/*
	setState(State.NON_CONNECTED);
	blacklistingTime = 0;
	Peers.NotifyListeners(Peers.Event.UNBLACKLIST, this);
	*/
}

function UpdateBlacklistedStatus(curTime) {
	throw new Error('This is not implemented');
	/*
	if (blacklistingTime > 0 && blacklistingTime + Peers.blacklistingPeriod <= curTime) {
		unBlacklist();
	}
	*/
}

function Deactivate() {
	throw new Error('This is not implemented');
	/*
	setState(State.NON_CONNECTED);
	Peers.NotifyListeners(Peers.Event.DEACTIVATE, this);
	*/
}

function Remove() {
	throw new Error('This is not implemented');
	/*
	Peers.removePeer(this);
	Peers.NotifyListeners(Peers.Event.REMOVE, this);
	*/
}

function Send(request) {
	throw new Error('This is not implemented');
	/*
	JSONObject response;

	String log = null;
	boolean showLog = false;
	HttpURLConnection connection = null;

	try {

		String address = announcedAddress != null ? announcedAddress : peerAddress;

		if (Peers.communicationLoggingMask != 0) {
			StringWriter stringWriter = new StringWriter();
			request.writeJSONString(stringWriter);
			log = "\"" + address + "\": " + stringWriter.toString();
		}

		URL url = new URL("http://" + address + (port <= 0 ? ":" + (Constants.isTestnet ? Peers.TESTNET_PEER_PORT : Peers.DEFAULT_PEER_PORT) : "") + "/nxt");
		connection = (HttpURLConnection)url.openConnection();
		connection.setRequestMethod("POST");
		connection.setDoOutput(true);
		connection.setConnectTimeout(Peers.connectTimeout);
		connection.setReadTimeout(Peers.readTimeout);

		CountingOutputStream cos = new CountingOutputStream(connection.getOutputStream());
		try (Writer writer = new BufferedWriter(new OutputStreamWriter(cos, "UTF-8"))) {
			request.writeJSONString(writer);
		}
		updateUploadedVolume(cos.getCount());

		if (connection.getResponseCode() == HttpURLConnection.HTTP_OK) {

			if ((Peers.communicationLoggingMask & Peers.LOGGING_MASK_200_RESPONSES) != 0) {
				// inefficient
				ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
				byte[] buffer = new byte[65536];
				int numberOfBytes;
				try (InputStream inputStream = connection.getInputStream()) {
					while ((numberOfBytes = inputStream.read(buffer)) > 0) {
						byteArrayOutputStream.write(buffer, 0, numberOfBytes);
					}
				}
				String responseValue = byteArrayOutputStream.toString("UTF-8");
				log += " >>> " + responseValue;
				showLog = true;
				updateDownloadedVolume(responseValue.getBytes("UTF-8").length);
				response = (JSONObject) JSONValue.parse(responseValue);

			} else {

				CountingInputStream cis = new CountingInputStream(connection.getInputStream());
				try (Reader reader = new BufferedReader(new InputStreamReader(cis, "UTF-8"))) {
					response = (JSONObject)JSONValue.parse(reader);
				}
				updateDownloadedVolume(cis.getCount());

			}

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

function CompareTo(o) {
	throw new Error('This is not implemented');
	/*
	if (getWeight() > o.getWeight()) {
		return -1;
	} else if (getWeight() < o.getWeight()) {
		return 1;
	}
	return 0;
	*/
}

function Connect() {
	throw new Error('This is not implemented');
	/*
	JSONObject response = send(Peers.myPeerInfoRequest);
	if (response != null) {
		application = (String)response.get("application");
		version = (String)response.get("version");
		platform = (String)response.get("platform");
		shareAddress = Boolean.TRUE.equals(response.get("shareAddress"));
		if (announcedAddress == null) {
			setAnnouncedAddress(peerAddress);
			Logger.logDebugMessage("Connected to peer without announced address, setting to " + peerAddress);
		}
		if (analyzeHallmark(announcedAddress, (String)response.get("hallmark"))) {
			setState(State.CONNECTED);
		} else {
			blacklist();
		}
	} else {
		setState(State.NON_CONNECTED);
	}
	*/
}

function AnalyzeHallmark(address, hallmarkString) {
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
		if (! hallmark.isValid()
				|| ! (hallmark.getHost().equals(host) || InetAddress.getByName(host).equals(InetAddress.getByName(hallmark.getHost())))) {
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

	} catch (URISyntaxException | UnknownHostException | RuntimeException e) {
		Logger.logDebugMessage("Failed to analyze hallmark for peer " + address + ", " + e.toString());
	}
	return false;
	*/
}

function GetHallmarkWeight(date) {
	throw new Error('This is not implemented');
	/*
	if (hallmark == null || ! hallmark.isValid() || hallmark.getDate() != date) {
		return 0;
	}
	return hallmark.getWeight();
	*/
}


Peer.prototype.GetPeerAddress = GetPeerAddress;
Peer.prototype.GetState = GetState;
Peer.prototype.SetState = SetState;
Peer.prototype.GetDownloadedVolume = GetDownloadedVolume;
Peer.prototype.UpdateDownloadedVolume = UpdateDownloadedVolume;
Peer.prototype.GetUploadedVolume = GetUploadedVolume;
Peer.prototype.UpdateUploadedVolume = UpdateUploadedVolume;
Peer.prototype.GetVersion = GetVersion;
Peer.prototype.SetVersion = SetVersion;
Peer.prototype.GetApplication = GetApplication;
Peer.prototype.SetApplication = SetApplication;
Peer.prototype.GetPlatform = GetPlatform;
Peer.prototype.SetPlatform = SetPlatform;
Peer.prototype.GetSoftware = GetSoftware;
Peer.prototype.ShareAddress = ShareAddress;
Peer.prototype.SetShareAddress = SetShareAddress;
Peer.prototype.GetAnnouncedAddress = GetAnnouncedAddress;
Peer.prototype.SetAnnouncedAddress = SetAnnouncedAddress;
Peer.prototype.GetPort = GetPort;
Peer.prototype.IsWellKnown = IsWellKnown;
Peer.prototype.GetHallmark = GetHallmark;
Peer.prototype.GetWeight = GetWeight;
Peer.prototype.IsBlacklisted = IsBlacklisted;
Peer.prototype.Blacklist = Blacklist;
Peer.prototype.UnBlacklist = UnBlacklist;
Peer.prototype.UpdateBlacklistedStatus = UpdateBlacklistedStatus;
Peer.prototype.Deactivate = Deactivate;
Peer.prototype.Remove = Remove;
Peer.prototype.Send = Send;
Peer.prototype.CompareTo = CompareTo;
Peer.prototype.Connect = Connect;
Peer.prototype.AnalyzeHallmark = AnalyzeHallmark;
Peer.prototype.GetHallmarkWeight = GetHallmarkWeight;


module.exports = Peer;
