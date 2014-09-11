/**!
 * LibreMoney 0.1
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


function User(userId) {
	this.userId = userId;
	/*
	var secretPhrase;
	var publicKey;
	var isInactive;
	private final ConcurrentLinkedQueue<JSONStreamAware> pendingResponses = new ConcurrentLinkedQueue<>();
	private AsyncContext asyncContext;
	*/
	return this;
}

function GetUserId() {
	return this.userId;
}

function GetPublicKey() {
	return this.publicKey;
}

function GetSecretPhrase() {
	return this.secretPhrase;
}

function IsInactive() {
	return this.isInactive;
}

function SetInactive(inactive) {
	this.isInactive = inactive;
}

function Enqueue(response) {
	/*
	pendingResponses.offer(response);
	*/
}

function LockAccount() {
	/*
	Generator.stopForging(secretPhrase);
	secretPhrase = null;
	*/
}

function UnlockAccount(secretPhrase) {
	/*
	this.publicKey = Crypto.getPublicKey(secretPhrase);
	this.secretPhrase = secretPhrase;
	Generator.startForging(secretPhrase, publicKey);
	return Account.getId(publicKey);
	*/
}

function ProcessPendingResponses(req, resp) {
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

function Send(response) {
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


User.prototype.GetUserId = GetUserId;
User.prototype.GetPublicKey = GetPublicKey;
User.prototype.GetSecretPhrase = GetSecretPhrase;
User.prototype.IsInactive = IsInactive;
User.prototype.SetInactive = SetInactive;
User.prototype.Enqueue = Enqueue;
User.prototype.LockAccount = LockAccount;
User.prototype.UnlockAccount = UnlockAccount;
User.prototype.ProcessPendingResponses = ProcessPendingResponses;
User.prototype.Send = Send;


module.exports = User;
