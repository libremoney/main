/**!
 * LibreMoney JsonResponses 0.0
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */


var Constants = require(__dirname + '/../Constants');


function missing(paramName1, paramName2) {
	if (!paramName2) {
		var msg = "\"" + paramName1 + "\"" + " not specified";
	} else {
		var msg = "At least one of " + paramName1 + " " + paramName2 + " must be specified";
	}
	return {
		errorCode: 2,
		errorDescription: msg
	}
}

function incorrect(paramName, details) {
	if (!details) {
		var msg = "Incorrect \"" + paramName + "\"";
	} else {
		var msg = "Incorrect \"" + paramName + "\" " + details;
	}
	return {
		errorCode: 2,
		errorDescription: msg
	}
}

function unknown(objectName) {
	return {
		errorCode: 2,
		errorDescription: "Unknown " + objectName
	}
}


var NotEnoughFunds = {
	errorCode: 6,
	errorDescription: "Not enough funds"
}

var NOT_ENOUGH_ASSETS = {
	errorCode: 6,
	errorDescription: "Not enough assets"
}

var ERROR_NOT_ALLOWED = {
	errorCode: 7,
	errorDescription: "Not allowed"
}

var ERROR_INCORRECT_REQUEST = {
	errorCode: 1,
	errorDescription: "Incorrect request"
}

var NOT_FORGING = {
	errorCode: 5,
	errorDescription: "Account is not forging"
}

var POST_REQUIRED = {
	errorCode: 1,
	errorDescription: "This request is only accepted using POST!"
}

var FEATURE_NOT_AVAILABLE = {
	errorCode: 9,
	errorDescription: "Feature not available"
}

// ---- Api2 ----

var INVALID_SECRET_PHRASE = {
	response: "showMessage",
	message: "Invalid secret phrase!"
}

var LOCK_ACCOUNT = {
	response: "lockAccount"
}

var LOCAL_USERS_ONLY = {
	response: "showMessage",
	message: "This operation is allowed to local host users only!"
}

var NOTIFY_OF_ACCEPTED_TRANSACTION = {
	response: "notifyOfAcceptedTransaction"
}

var DENY_ACCESS = {
	response: "denyAccess"
}

var INCORRECT_REQUEST = {
	response: "showMessage",
	message: "Incorrect request!"
}

var POST_REQUIRED_2 = {
	response: "showMessage",
	message: "This request is only accepted using POST!"
}
// ---- Api2 ----




exports.IncorrectAccount = incorrect("account");
exports.IncorrectAccountDescriptionLength = incorrect("description", "(length must be less than " + Constants.MaxAccountDescriptionLength + " characters)");
exports.IncorrectAccountNameLength = incorrect("name", "(length must be less than " + Constants.MaxAccountNameLength + " characters)");
exports.IncorrectAlias = incorrect("alias");
exports.IncorrectAliasLength = incorrect("alias", "(length must be in [1.." + Constants.MaxAliasLength + "] range)");
exports.IncorrectAliasName = incorrect("alias", "(must contain only digits and latin letters)");
exports.IncorrectAmount = incorrect("amount");
exports.IncorrectArbitraryMessage = incorrect("message", "(length must be not longer than " + Constants.MaxArbitraryMessageLength + " bytes)");
exports.IncorrectAsset = incorrect("asset");
exports.IncorrectAssetDescription = incorrect("description", "(length must not exceed " + Constants.MaxAssetDescriptionLength + " characters)");
exports.IncorrectAssetIssuanceFee = incorrect("fee", "(must be not less than 1'000 NXT)");
exports.IncorrectAssetName = incorrect("name", "(must contain only digits and latin letters)");
exports.IncorrectAssetNameLength = incorrect("name", "(length must be in [" + Constants.MinAssetNameLength + ".." + Constants.MaxAssetNameLength + "] range)");
exports.IncorrectAssetTransferComment = incorrect("comment", "(length must not exceed " + Constants.MaxAssetTransferCommentLength + " characters)");
exports.IncorrectAssetQuantity = incorrect("quantity", "(must be in [1..1'000'000'000] range)");
exports.IncorrectBlock = incorrect("block");
exports.IncorrectDate = incorrect("date");
exports.IncorrectDeadline = incorrect("deadline");
exports.IncorrectDecimals = incorrect("decimals");
exports.IncorrectFee = incorrect("fee");
exports.IncorrectHallmark = incorrect("hallmark");
exports.IncorrectHost = incorrect("host", "(the length exceeds 100 chars limit)");
exports.IncorrectNumberOfConfirmations = incorrect("numberOfConfirmations");
exports.IncorrectMaxNumberOfOptions = incorrect("maxNumberOfOptions");
exports.IncorrectMinNumberOfOptions = incorrect("minNumberOfOptions");
exports.IncorrectOptionsAreBinary = incorrect("optionsAreBinary");
exports.IncorrectOrder = incorrect("order");
exports.IncorrectPeriod = incorrect("period", "(period must be at least 1440 blocks)");
exports.IncorrectPoll = incorrect("poll");
exports.IncorrectPollNameLength = incorrect("name", "(length must be not longer than " + Constants.MaxPollNameLength + " characters)");
exports.IncorrectPollDescriptionLength = incorrect("description", "(length must be not longer than " + Constants.MaxPollDescriptionLength + " characters)");
exports.IncorrectPollOptionLength = incorrect("option", "(length must be not longer than " + Constants.MaxPollOptionLength + " characters)");
exports.IncorrectPrice = incorrect("price");
exports.IncorrectPublicKey = incorrect("publicKey");
exports.IncorrectRecipient = incorrect("recipient");
exports.IncorrectReferencedTransaction = incorrect("referencedTransactionFullHash");
exports.IncorrectUriLength = incorrect("uri", "(length must be not longer than " + Constants.MaxAliasUriLength + " characters)");
exports.IncorrectTimestamp = incorrect("timestamp");
exports.IncorrectToken = incorrect("token");
exports.IncorrectTransaction = incorrect("transaction");
exports.IncorrectTransactionBytes = incorrect("transactionBytes");
exports.IncorrectQuantity = incorrect("quantity");
exports.IncorrectVote = incorrect("vote");
exports.IncorrectWebsite = incorrect("website");
exports.IncorrectWeight = incorrect("weight");
exports.IncorrectUnsignedBytes = incorrect("unsignedTransactionBytes");
exports.MissingAccount = missing("account");
exports.MissingAliasName = missing("aliasName");
exports.MissingAliasOrAliasName = missing("alias", "aliasName");
exports.MissingAmount = missing("amountNQT");
exports.MissingAsset = missing("asset");
exports.MissingAssetName = missing("assetName");
exports.MissingBlock = missing("block");
exports.MissingDate = missing("date");
exports.MissingDeadline = missing("deadline");
exports.MissingDescription = missing("description");
exports.MissingFee = missing("feeNQT");
exports.MissingHallmark = missing("hallmark");
exports.MissingHost = missing("host");
exports.MissingMessage = missing("message");
exports.MissingMaxNumberOfOptions = missing("maxNumberOfOptions");
exports.MissingMinNumberOfOptions = missing("minNumberOfOptions");
exports.MissingName = missing("name");
exports.MissingNumberOfConfirmations = missing("numberOfConfirmations");
exports.MissingOptionsAreBinary = missing("optionsAreBinary");
exports.MissingOrder = missing("order");
exports.MissingPeer = missing("peer");
exports.MissingPeriod = missing("period");
exports.MissingPoll = missing("poll");
exports.MissingPrice = missing("priceNQT");
exports.MissingPublicKey = missing("publicKey");
exports.MissingQuantity = missing("quantityQNT");
exports.MissingRecipient = missing("recipient");
exports.MissingSecretPhrase = missing("secretPhrase"); // deprecated - use MissingPublicKey
exports.MissingSecretPhraseOrPublicKey = missing("secretPhrase", "publicKey"); // deprecated - use MissingPublicKey
exports.MissingSignatureHash = missing("signatureHash");
exports.MissingTimestamp = missing("timestamp");
exports.MissingToken = missing("token");
exports.MissingTransaction = missing("transaction");
exports.MissingTransactionBytes = missing("transactionBytes");
exports.MissingWebsite = missing("website");
exports.MissingWeight = missing("weight");
exports.MissingUnsignedBytes = missing("unsignedTransactionBytes");
exports.UnknownAccount = unknown("account");
exports.UnknownAlias = unknown("alias");
exports.UnknownAsset = unknown("asset");
exports.UnknownBlock = unknown("block");
exports.UnknownOrder = unknown("order");
exports.UnknownPeer = unknown("peer");
exports.UnknownPoll = unknown("poll");
exports.UnknownTransaction = unknown("transaction");

exports.NotEnoughFunds = NotEnoughFunds;
exports.NOT_ENOUGH_ASSETS = NOT_ENOUGH_ASSETS;
exports.ERROR_NOT_ALLOWED = ERROR_NOT_ALLOWED;
exports.ERROR_INCORRECT_REQUEST = ERROR_INCORRECT_REQUEST;
exports.NOT_FORGING = NOT_FORGING;
exports.POST_REQUIRED = POST_REQUIRED;
exports.FEATURE_NOT_AVAILABLE = FEATURE_NOT_AVAILABLE;
exports.INVALID_SECRET_PHRASE = INVALID_SECRET_PHRASE;
exports.LOCK_ACCOUNT = LOCK_ACCOUNT;
exports.LOCAL_USERS_ONLY = LOCAL_USERS_ONLY;
exports.NOTIFY_OF_ACCEPTED_TRANSACTION = NOTIFY_OF_ACCEPTED_TRANSACTION;
exports.DENY_ACCESS = DENY_ACCESS;
exports.INCORRECT_REQUEST = INCORRECT_REQUEST;
exports.POST_REQUIRED_2 = POST_REQUIRED_2;