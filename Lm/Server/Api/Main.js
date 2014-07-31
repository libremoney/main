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
		Main2(req, body, res);
	});
}

// res = user
function Main2(req, body, res) {
	/*
	resp.setHeader("Cache-Control", "no-cache, no-store, must-revalidate, private");
	resp.setHeader("Pragma", "no-cache");
	resp.setDateHeader("Expires", 0);
	*/

	var user = null;

	var userPasscode = body.user;
	if (!userPasscode) {
		res.send('{"error":"user not defined"}');
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
		res.send(JsonResponses.INCORRECT_REQUEST);
		return;
	}

	var userRequestHandler = userRequestHandlers[requestType];
	if (!userRequestHandler) {
		res.send(JsonResponses.INCORRECT_REQUEST);
		return;
	}

	/*
	if (UserServer.GetEnforcePost() && userRequestHandler.requirePost() && ! "POST".equals(req.getMethod())) {
		res.send(JsonResponses.POST_REQUIRED_2);
		return;
	}
	*/

	userRequestHandler(req, res, user);
	if (response != null) {
		res.send(response);
	}

	/*
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
