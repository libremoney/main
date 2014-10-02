/**!
 * LibreMoney User 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

/*
import nxt.Account;
import nxt.Generator;
import nxt.crypto.Crypto;
import nxt.util.JSON;
import nxt.util.Logger;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.JSONStreamAware;
*/


function User(_userId) {
	this.userId;
	this.secretPhrase;
	this.publicKey;
	this.isInactive = false;
	this.userId = _userId;
	/*
	private final ConcurrentLinkedQueue<JSONStreamAware> pendingResponses = new ConcurrentLinkedQueue<>();
	private AsyncContext asyncContext;
	*/
	return this;
}

User.prototype.GetUserId = function() {
	return this.userId;
}

User.prototype.GetPublicKey = function() {
	return this.publicKey;
}

User.prototype.GetSecretPhrase = function() {
	return this.secretPhrase;
}

User.prototype.IsInactive = function() {
	return this.isInactive;
}

User.prototype.SetInactive = function(inactive) {
	if (typeof inactive === "boolean")
		this.isInactive = inactive;
}

User.prototype.Enqueue = function(response) {
	/*
	pendingResponses.offer(response);
	*/
}

User.prototype.LockAccount = function() {
	/*
	Generator.StopForging(this.secretPhrase);
	*/
	this.secretPhrase = null;
}

User.prototype.LoginAccount = function(_secretPhrase) {
	this.secretPhrase = _secretPhrase; //curve.sha256(_secretPhrase);
	var publicKeyHex = Crypto.GetPublicKey(this.secretPhrase.toString("hex"));
	console.log("Crypto publicKeyHex=", publicKeyHex);
	this.publicKey = new Buffer(publicKeyHex, "hex");
	/*
	Generator.StartForging(this.secretPhrase, this.publicKey);
	*/
	return Accounts.GetId(this.publicKey);
}

User.prototype.LogoutAccount = function() {
	return this.LockAccount();
}

User.prototype.UnlockAccount = function(secretPhrase) {
	return LoginAccount(secretPhrase);
}

User.prototype.ProcessPendingResponses = function(req, resp) {
	/*
	JSONArray responses = new JSONArray();
	JSONStreamAware pendingResponse;
	while ((pendingResponse = pendingResponses.poll()) != null) {
		responses.add(pendingResponse);
	}
	if (responses.size() > 0) {
		JSONObject combinedResponse = new JSONObject();
		combinedResponse.put("responses", responses);
		if (asyncContext != null) {
			asyncContext.getResponse().setContentType("text/plain; charset=UTF-8");
			try (Writer writer = asyncContext.getResponse().getWriter()) {
				combinedResponse.writeJSONString(writer);
			}
			asyncContext.complete();
			asyncContext = req.startAsync();
			asyncContext.addListener(new UserAsyncListener());
			asyncContext.setTimeout(5000);
		} else {
			resp.setContentType("text/plain; charset=UTF-8");
			try (Writer writer = resp.getWriter()) {
				combinedResponse.writeJSONString(writer);
			}
		}
	} else {
		if (asyncContext != null) {
			asyncContext.getResponse().setContentType("text/plain; charset=UTF-8");
			try (Writer writer = asyncContext.getResponse().getWriter()) {
				JSON.emptyJSON.writeJSONString(writer);
			}
			asyncContext.complete();
		}
		asyncContext = req.startAsync();
		asyncContext.addListener(new UserAsyncListener());
		asyncContext.setTimeout(5000);
	}
	*/
}

User.prototype.Send = function(response) {
	/*
	if (asyncContext == null) {

		if (isInactive) {
			// user not seen recently, no responses should be collected
			return;
		}
		if (pendingResponses.size() > 1000) {
			pendingResponses.clear();
			// stop collecting responses for this user
			isInactive = true;
			if (secretPhrase == null) {
				// but only completely remove users that don't have unlocked accounts
				Users.remove(this);
			}
			return;
		}

		pendingResponses.offer(response);

	} else {

		JSONArray responses = new JSONArray();
		JSONStreamAware pendingResponse;
		while ((pendingResponse = pendingResponses.poll()) != null) {

			responses.add(pendingResponse);

		}
		responses.add(response);

		JSONObject combinedResponse = new JSONObject();
		combinedResponse.put("responses", responses);

		asyncContext.getResponse().setContentType("text/plain; charset=UTF-8");

		try (Writer writer = asyncContext.getResponse().getWriter()) {
			combinedResponse.writeJSONString(writer);
		} catch (IOException e) {
			Logger.logMessage("Error sending response to user", e);
		}

		asyncContext.complete();
		asyncContext = null;
	}
	*/
}

/*
private final class UserAsyncListener implements AsyncListener {
	public void onComplete(AsyncEvent asyncEvent) throws IOException { }

	public void onError(AsyncEvent asyncEvent) throws IOException {
		synchronized (User.this) {
			asyncContext.getResponse().setContentType("text/plain; charset=UTF-8");

			try (Writer writer = asyncContext.getResponse().getWriter()) {
				JSON.emptyJSON.writeJSONString(writer);
			}

			asyncContext.complete();
			asyncContext = null;
		}
	}

	public void onStartAsync(AsyncEvent asyncEvent) throws IOException { }

	public void onTimeout(AsyncEvent asyncEvent) throws IOException {
		synchronized (User.this) {
			asyncContext.getResponse().setContentType("text/plain; charset=UTF-8");

			try (Writer writer = asyncContext.getResponse().getWriter()) {
				JSON.emptyJSON.writeJSONString(writer);
			}

			asyncContext.complete();
			asyncContext = null;
		}
	}
}
*/


if (typeof module !== "undefined") {
	module.exports = User;
}
