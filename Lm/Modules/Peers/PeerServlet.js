/**!
 * LibreMoney 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

/*
import nxt.util.CountingInputStream;
import nxt.util.CountingOutputStream;
*/

/*
private static final Map<String,PeerRequestHandler> peerRequestHandlers;
*/

/*
private boolean isGzipEnabled;

public void init(ServletConfig config) throws ServletException {
	super.init(config);
	isGzipEnabled = Boolean.parseBoolean(config.getInitParameter("isGzipEnabled"));
}
*/

var UNSUPPORTED_REQUEST_TYPE = {
	error: "Unsupported request type!"
}

var UNSUPPORTED_PROTOCOL = {
	error: "Unsupported protocol!"
}

function DoPost(req, resp) {
	throw new Error('This is not implemented');
	/*
	PeerImpl peer = null;
	JSONStreamAware response;

	try {
		peer = Peers.addPeer(req.getRemoteAddr(), null);
		if (peer == null) {
			return;
		}
		if (peer.isBlacklisted()) {
			return;
		}

		JSONObject request;
		CountingInputStream cis = new CountingInputStream(req.getInputStream());
		try (Reader reader = new InputStreamReader(cis, "UTF-8")) {
			request = (JSONObject) JSONValue.parse(reader);
		}
		if (request == null) {
			return;
		}

		if (peer.getState() == Peer.State.DISCONNECTED) {
			peer.setState(Peer.State.CONNECTED);
			if (peer.getAnnouncedAddress() != null) {
				Peers.updateAddress(peer);
			}
		}
		peer.updateDownloadedVolume(cis.getCount());
		if (! peer.analyzeHallmark(peer.getPeerAddress(), (String)request.get("hallmark"))) {
			peer.blacklist();
			return;
		}

		if (request.get("protocol") != null && ((Number)request.get("protocol")).intValue() == 1) {
			PeerRequestHandler peerRequestHandler = peerRequestHandlers.get(request.get("requestType"));
			if (peerRequestHandler != null) {
				response = peerRequestHandler.processRequest(request, peer);
			} else {
				response = UNSUPPORTED_REQUEST_TYPE;
			}
		} else {
			Logger.logDebugMessage("Unsupported protocol " + request.get("protocol"));
			response = UNSUPPORTED_PROTOCOL;
		}

	} catch (RuntimeException e) {
		Logger.logDebugMessage("Error processing POST request", e);
		JSONObject json = new JSONObject();
		json.put("error", e.toString());
		response = json;
	}

	resp.setContentType("text/plain; charset=UTF-8");
	try {
		long byteCount;
		if (isGzipEnabled) {
			try (Writer writer = new OutputStreamWriter(resp.getOutputStream(), "UTF-8")) {
				response.writeJSONString(writer);
			}
			byteCount = ((Response) ((CompressedResponseWrapper) resp).getResponse()).getContentCount();
		} else {
			CountingOutputStream cos = new CountingOutputStream(resp.getOutputStream());
			try (Writer writer = new OutputStreamWriter(cos, "UTF-8")) {
				response.writeJSONString(writer);
			}
			byteCount = cos.getCount();
		}
		if (peer != null) {
			peer.updateUploadedVolume(byteCount);
		}
	} catch (Exception e) {
		if (peer != null) {
			peer.blacklist(e);
		}
		throw e;
	}
	*/
}

exports.DoPost = DoPost;
