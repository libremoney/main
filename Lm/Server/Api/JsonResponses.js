
var LmConstants = require(__dirname + '/../Constants');


function missing(paramName1, paramName2) {
	if (!paramName2) {
		return "\"" + paramName1 + "\"" + " not specified";
	} else {
		return "At least one of " + paramName1 + " " + paramName2 + " must be specified";
	}
}

function incorrect(paramName, details) {
	if (!details) {
		return "Incorrect \"" + paramName + "\"";
	} else {
		return "Incorrect \"" + paramName + "\" " + details;
	}
}

function unknown(objectName) {
	return "Unknown " + objectName;
}


var NOT_ENOUGH_FUNDS = {
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


exports.IncorrectAccount = incorrect("account");
exports.IncorrectAccountDescriptionLength = incorrect("description", "(length must be less than " + LmConstants.MaxAccountDescriptionLength + " characters)");
exports.IncorrectAccountNameLength = incorrect("name", "(length must be less than " + LmConstants.MaxAccountNameLength + " characters)");
exports.IncorrectAlias = incorrect("alias");
exports.IncorrectAliasLength = incorrect("alias", "(length must be in [1.." + LmConstants.MaxAliasLength + "] range)");
exports.IncorrectAliasName = incorrect("alias", "(must contain only digits and latin letters)");
exports.IncorrectAmount = incorrect("amount");
exports.IncorrectArbitraryMessage = incorrect("message", "(length must be not longer than " + LmConstants.MaxArbitraryMessageLength + " bytes)");
exports.IncorrectAsset = incorrect("asset");
exports.IncorrectAssetDescription = incorrect("description", "(length must not exceed " + LmConstants.MaxAssetDescriptionLength + " characters)");
exports.IncorrectAssetIssuanceFee = incorrect("fee", "(must be not less than 1'000 NXT)");
exports.IncorrectAssetName = incorrect("name", "(must contain only digits and latin letters)");
exports.IncorrectAssetNameLength = incorrect("name", "(length must be in [" + LmConstants.MinAssetNameLength + ".." + LmConstants.MaxAssetNameLength + "] range)");
exports.IncorrectAssetTransferComment = incorrect("comment", "(length must not exceed " + LmConstants.MaxAssetTransferCommentLength + " characters)");
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
exports.IncorrectPollNameLength = incorrect("name", "(length must be not longer than " + LmConstants.MaxPollNameLength + " characters)");
exports.IncorrectPollDescriptionLength = incorrect("description", "(length must be not longer than " + LmConstants.MaxPollDescriptionLength + " characters)");
exports.IncorrectPollOptionLength = incorrect("option", "(length must be not longer than " + LmConstants.MaxPollOptionLength + " characters)");
exports.IncorrectPrice = incorrect("price");
exports.IncorrectPublicKey = incorrect("publicKey");
exports.IncorrectRecipient = incorrect("recipient");
exports.IncorrectReferencedTransaction = incorrect("referencedTransactionFullHash");
exports.IncorrectUriLength = incorrect("uri", "(length must be not longer than " + LmConstants.MaxAliasUriLength + " characters)");
exports.IncorrectTimestamp = incorrect("timestamp");
exports.IncorrectToken = incorrect("token");
exports.IncorrectTransaction = incorrect("transaction");
exports.IncorrectTransactionBytes = incorrect("transactionBytes");
exports.IncorrectWebsite = incorrect("website");
exports.IncorrectQuantity = incorrect("quantity");
exports.IncorrectVote = incorrect("vote");
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
exports.MissingQuantity = missing("quantityQNT");
exports.MissingRecipient = missing("recipient");
exports.MissingSecretPhrase = missing("secretPhrase");
exports.MissingSecretPhraseOrPublicKey = missing("secretPhrase", "publicKey");
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
