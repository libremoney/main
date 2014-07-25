/**!
 * LibreMoney 0.0
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

/*
import nxt.Nxt;
import nxt.NxtException;
import nxt.util.Logger;
import org.json.simple.JSONObject;
import org.json.simple.JSONStreamAware;
*/

var Logger = require(__dirname + '/../../Logger').GetLogger(module);
var UserServer = require(__dirname + '/../UserServer');

var GenerateAuthorizationToken = require(__dirname + '/GenerateAuthorizationToken');
var GetInitialData = require(__dirname + '/GetInitialData');
var GetNewData = require(__dirname + '/GetNewData');
var LockAccount = require(__dirname + '/LockAccount');
var RemoveActivePeer = require(__dirname + '/RemoveActivePeer');
var RemoveBlacklistedPeer = require(__dirname + '/RemoveBlacklistedPeer');
var RemoveKnownPeer = require(__dirname + '/RemoveKnownPeer');
var SendMoney = require(__dirname + '/SendMoney2');
var UnlockAccount = require(__dirname + '/UnlockAccount');


/*
abstract static class UserRequestHandler {
	abstract JSONStreamAware processRequest(HttpServletRequest request, User user) throws NxtException, IOException;
	boolean requirePost() {
		return false;
	}
}
*/

/*
private static final boolean enforcePost = Nxt.getBooleanProperty("nxt.uiServerEnforcePOST");
*/

var userRequestHandlers = {
	generateAuthorizationToken: GenerateAuthorizationToken,
	getInitialData: GetInitialData,
	getNewData: GetNewData,
	lockAccount: LockAccount,
	removeActivePeer: RemoveActivePeer,
	removeBlacklistedPeer: RemoveBlacklistedPeer,
	removeKnownPeer: RemoveKnownPeer,
	sendMoney: SendMoney,
	unlockAccount: UnlockAccount
	};


function Main(req, res) {
	var body = '';

	req
	.on('readable', function () {
		body += req.read();
		if (body.length > 1e4) {
			res.statusCode = 413;
			res.end("Your message is big.");
		}
	})
	.on('end', function () {
		try {
			body = JSON.parse(body);
		} catch (e) {
			res.statusCode = 400;
			res.end("Bad request");
		}
		//Logger.info('user='+body.user +' requestType='+body.requestType);
		var requestType = body.requestType;
		if (!requestType) {
			res.end("Ok");
			return;
		}

		Main2(body, res);

		res.send('This is not implemented now /api');
	});
}

// res = user
function Main2(body, res) {
	/*
	resp.setHeader("Cache-Control", "no-cache, no-store, must-revalidate, private");
	resp.setHeader("Pragma", "no-cache");
	resp.setDateHeader("Expires", 0);
	*/

	var user = null;

	var userPasscode = body.user;
	if (userPasscode == null) {
		return;
	}
	user = UserServer.GetUser(userPasscode);

	/*
	if (UserServer.AllowedUserHosts_Contains(req.getRemoteHost())) {
		user.Enqueue(JsonResponses.DENY_ACCESS);
		return;
	}
	*/

	var requestType = body.requestType;
	if (!requestType) {
		user.Enqueue(JsonResponses.INCORRECT_REQUEST);
		return;
	}
xxxx
	var userRequestHandler = handlers[requestType];
	if (!userRequestHandler) {
		user.Enqueue(JsonResponses.INCORRECT_REQUEST);
		return;
	}

	if (enforcePost && userRequestHandler.requirePost() && ! "POST".equals(req.getMethod())) {
		user.enqueue(JsonResponses.POST_REQUIRED_2);
		return;
	}

	/*
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


module.exports = Main;
