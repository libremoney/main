/**!
 * LibreMoney JsonResponses 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */


var UserServerResponses = function() {
	var DenyAccess = {
		response: "denyAccess"
	}

	var IncorrectRequest = {
		response: "showMessage",
		message: "Incorrect request!"
	}

	var InvalidSecretPhrase = {
		response: "showMessage",
		message: "Invalid secret phrase!"
	}

	var LockAccount = {
		response: "lockAccount"
	}

	var LocalUsersOnly = {
		response: "showMessage",
		message: "This operation is allowed to local host users only!"
	}

	var NotifyOfAcceptedTransaction = {
		response: "notifyOfAcceptedTransaction"
	}

	var NotImplementted = {
		errorCode: 100,
		errorDescription: 'Not implementted'
	}

	var PostRequired2 = {
		response: "showMessage",
		message: "This request is only accepted using POST!"
	}


	return {
		DenyAccess: DenyAccess,
		IncorrectRequest: IncorrectRequest,
		LockAccount: LockAccount,
		LocalUsersOnly: LocalUsersOnly,
		NotEnoughAssets: NotEnoughAssets,
		NotEnoughFunds: NotEnoughFunds,
		NotForging: NotForging,
		NotifyOfAcceptedTransaction: NotifyOfAcceptedTransaction,
		NotImplementted: NotImplementted,
		PostRequired: PostRequired,
		PostRequired2: PostRequired2
	}
}


if (typeof module !== "undefined") {
	module.exports = UserServerResponses;
}
