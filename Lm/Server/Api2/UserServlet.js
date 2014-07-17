/*
import nxt.Nxt;
import nxt.NxtException;
import nxt.util.Logger;
import org.json.simple.JSONObject;
import org.json.simple.JSONStreamAware;
*/

/*
import static nxt.user.JSONResponses.DENY_ACCESS;
import static nxt.user.JSONResponses.INCORRECT_REQUEST;
import static nxt.user.JSONResponses.POST_REQUIRED;
*/

/*
abstract static class UserRequestHandler {
	abstract JSONStreamAware processRequest(HttpServletRequest request, User user) throws NxtException, IOException;
	boolean requirePost() {
		return false;
	}
}
*/

function UserServlet() {
	var obj = {};
	return obj;
}

/*
private static final boolean enforcePost = Nxt.getBooleanProperty("nxt.uiServerEnforcePOST");
*/

/*
private static final Map<String,UserRequestHandler> userRequestHandlers;
*/

/*
static {
	Map<String,UserRequestHandler> map = new HashMap<>();
	map.put("generateAuthorizationToken", GenerateAuthorizationToken.instance);
	map.put("getInitialData", GetInitialData.instance);
	map.put("getNewData", GetNewData.instance);
	map.put("lockAccount", LockAccount.instance);
	map.put("removeActivePeer", RemoveActivePeer.instance);
	map.put("removeBlacklistedPeer", RemoveBlacklistedPeer.instance);
	map.put("removeKnownPeer", RemoveKnownPeer.instance);
	map.put("sendMoney", SendMoney.instance);
	map.put("unlockAccount", UnlockAccount.instance);
	userRequestHandlers = Collections.unmodifiableMap(map);
}
*/

function DoGet(req, resp) {
	/*
	process(req, resp);
	*/
}

function DoPost(req, resp) {
	/*
	process(req, resp);
	*/
}

function Process(req, resp) {
	/*
	resp.setHeader("Cache-Control", "no-cache, no-store, must-revalidate, private");
	resp.setHeader("Pragma", "no-cache");
	resp.setDateHeader("Expires", 0);

	User user = null;

	try {
		String userPasscode = req.getParameter("user");
		if (userPasscode == null) {
			return;
		}
		user = Users.getUser(userPasscode);

		if (Users.allowedUserHosts != null && ! Users.allowedUserHosts.contains(req.getRemoteHost())) {
			user.enqueue(DENY_ACCESS);
			return;
		}

		String requestType = req.getParameter("requestType");
		if (requestType == null) {
			user.enqueue(INCORRECT_REQUEST);
			return;
		}

		UserRequestHandler userRequestHandler = userRequestHandlers.get(requestType);
		if (userRequestHandler == null) {
			user.enqueue(INCORRECT_REQUEST);
			return;
		}

		if (enforcePost && userRequestHandler.requirePost() && ! "POST".equals(req.getMethod())) {
			user.enqueue(POST_REQUIRED);
			return;
		}

		JSONStreamAware response = userRequestHandler.processRequest(req, user);
		if (response != null) {
			user.enqueue(response);
		}
	} catch (RuntimeException|NxtException e) {
		Logger.logMessage("Error processing GET request", e);
		if (user != null) {
			JSONObject response = new JSONObject();
			response.put("response", "showMessage");
			response.put("message", e.toString());
			user.enqueue(response);
		}
	} finally {
		if (user != null) {
			user.processPendingResponses(req, resp);
		}
	}
	*/
}


UserServlet.prototype.DoGet = DoGet;
UserServlet.prototype.DoPost = DoPost;
UserServlet.prototype.Process = Process;


exports.Create = UserServlet;
