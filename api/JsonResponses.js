/*
import nxt.Constants;
import nxt.util.JSON;
*/

var LmConstants = require(__dirname + '/../lm/LmConstants');


function missing(paramName1, paramName2) {
	if (!paramName2) {
		return {
			errorCode: 3,
			errorDescription: "\"" + paramName1 + "\"" + " not specified"
		}
	} else {
		return {
			errorCode: 3,
			errorDescription: "At least one of " + paramName1 + " " + paramName2 + " must be specified"
		}
	}
}

function incorrect(paramName, details) {
	if (!details) {
		return {
			errorCode: 4,
			errorDescription: "Incorrect \"" + paramName + "\""
		}
	} else {
		return {
			errorCode: 4,
			errorDescription: "Incorrect \"" + paramName + "\" " + details
		}
	}
}

function unknown(objectName) {
	return {
		errorCode: 5,
		errorDescription: "Unknown " + objectName
	}
}

/*
var IncorrectAccount = incorrect("account");
var IncorrectAccountDescriptionLength = incorrect("description", "(length must be less than " + Constants.MAX_ACCOUNT_DESCRIPTION_LENGTH + " characters)");
var IncorrectAccountNameLength = incorrect("name", "(length must be less than " + Constants.MAX_ACCOUNT_NAME_LENGTH + " characters)");
var IncorrectAlias = incorrect("alias");
var IncorrectAliasLength = incorrect("alias", "(length must be in [1.." + Constants.MAX_ALIAS_LENGTH + "] range)");
var IncorrectAliasName = incorrect("alias", "(must contain only digits and latin letters)");
var IncorrectAmount = incorrect("amount");
var IncorrectArbitraryMessage = incorrect("message", "(length must be not longer than " + Constants.MAX_ARBITRARY_MESSAGE_LENGTH + " bytes)");
var IncorrectAsset = incorrect("asset");
var IncorrectAssetDescription = incorrect("description", "(length must not exceed " + Constants.MAX_ASSET_DESCRIPTION_LENGTH + " characters)");
var IncorrectAssetIssuanceFee = incorrect("fee", "(must be not less than 1'000 NXT)");
var IncorrectAssetName = incorrect("name", "(must contain only digits and latin letters)");
var IncorrectAssetNameLength = incorrect("name", "(length must be in [" + Constants.MIN_ASSET_NAME_LENGTH + ".." + Constants.MAX_ASSET_NAME_LENGTH + "] range)");
var IncorrectAssetTransferComment = incorrect("comment", "(length must not exceed " + Constants.MAX_ASSET_TRANSFER_COMMENT_LENGTH + " characters)");
var IncorrectAssetQuantity = incorrect("quantity", "(must be in [1..1'000'000'000] range)");
var IncorrectBlock = incorrect("block");
var IncorrectDate = incorrect("date");
var IncorrectDeadline = incorrect("deadline");
var IncorrectDecimals = incorrect("decimals");
var IncorrectFee = incorrect("fee");
var IncorrectHallmark = incorrect("hallmark");
var IncorrectHost = incorrect("host", "(the length exceeds 100 chars limit)");
var IncorrectNumberOfConfirmations = incorrect("numberOfConfirmations");
var IncorrectMaxNumberOfOptions = incorrect("maxNumberOfOptions");
var IncorrectMinNumberOfOptions = incorrect("minNumberOfOptions");
var IncorrectOptionsAreBinary = incorrect("optionsAreBinary");
var IncorrectOrder = incorrect("order");
var IncorrectPeriod = incorrect("period", "(period must be at least 1440 blocks)");
var IncorrectPoll = incorrect("poll");
var IncorrectPollNameLength = incorrect("name", "(length must be not longer than " + Constants.MAX_POLL_NAME_LENGTH + " characters)");
var IncorrectPollDescriptionLength = incorrect("description", "(length must be not longer than " + Constants.MAX_POLL_DESCRIPTION_LENGTH + " characters)");
var IncorrectPollOptionLength = incorrect("option", "(length must be not longer than " + Constants.MAX_POLL_OPTION_LENGTH + " characters)");
var IncorrectPrice = incorrect("price");
var IncorrectPublicKey = incorrect("publicKey");
var IncorrectRecipient = incorrect("recipient");
var IncorrectReferencedTransaction = incorrect("referencedTransactionFullHash");
var IncorrectUriLength = incorrect("uri", "(length must be not longer than " + Constants.MAX_ALIAS_URI_LENGTH + " characters)");
var IncorrectTimestamp = incorrect("timestamp");
var IncorrectToken = incorrect("token");
var IncorrectTransactionBytes = incorrect("transactionBytes");
var IncorrectWebsite = incorrect("website");
var IncorrectTransaction = incorrect("transaction");
var IncorrectQuantity = incorrect("quantity");
var IncorrectVote = incorrect("vote");
var IncorrectWeight = incorrect("weight");
var IncorrectUnsignedBytes = incorrect("unsignedTransactionBytes");
var MissingAccount = missing("account");
var MissingAliasName = missing("aliasName");
var MissingAliasOrAliasName = missing("alias", "aliasName");
var MissingAmount = missing("amountNQT");
var MissingAsset = missing("asset");
var MissingAssetName = missing("assetName");
var MissingBlock = missing("block");
var MissingDate = missing("date");
var MissingDeadline = missing("deadline");
var MissingDescription = missing("description");
var MissingFee = missing("feeNQT");
var MissingHallmark = missing("hallmark");
var MissingHost = missing("host");
var MissingMessage = missing("message");
var MissingMaxNumberOfOptions = missing("maxNumberOfOptions");
var MissingMinNumberOfOptions = missing("minNumberOfOptions");
var MissingName = missing("name");
var MissingNumberOfConfirmations = missing("numberOfConfirmations");
var MissingOptionsAreBinary = missing("optionsAreBinary");
var MissingOrder = missing("order");
var MissingPeer = missing("peer");
var MissingPeriod = missing("period");
var MissingPoll = missing("poll");
var MissingPrice = missing("priceNQT");
var MissingQuantity = missing("quantityQNT");
var MissingRecipient = missing("recipient");
var MissingSecretPhrase = missing("secretPhrase");
var MissingSecretPhraseOrPublicKey = missing("secretPhrase", "publicKey");
var MissingSignatureHash = missing("signatureHash");
var MissingTimestamp = missing("timestamp");
var MissingToken = missing("token");
var MissingTransaction = missing("transaction");
var MissingTransactionBytes = missing("transactionBytes");
var MissingWebsite = missing("website");
var MissingWeight = missing("weight");
var MissingUnsignedBytes = missing("unsignedTransactionBytes");
var UnknownAccount = unknown("account");
var UnknownAlias = unknown("alias");
var UnknownAsset = unknown("asset");
var UnknownBlock = unknown("block");
var UnknownOrder = unknown("order");
var UnknownPeer = unknown("peer");
var UnknownPoll = unknown("poll");
var UnknownTransaction = unknown("transaction");
*/

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

/*
exports.INCORRECT_ACCOUNT = exports.IncorrectAccount;
exports.INCORRECT_ALIAS = exports.IncorrectAlias;
exports.INCORRECT_ALIAS_LENGTH = exports.IncorrectAliasLength;
exports.INCORRECT_ALIAS_NAME = exports.IncorrectAliasName;
exports.INCORRECT_ASSET = exports.IncorrectAsset;
exports.INCORRECT_BLOCK = exports.IncorrectBlock;
exports.INCORRECT_DEADLINE = exports.IncorrectDeadline;
exports.INCORRECT_FEE = exports.IncorrectFee;
exports.INCORRECT_HALLMARK = exports.IncorrectHallmark;
exports.INCORRECT_ORDER = exports.IncorrectOrder;
exports.INCORRECT_PUBLIC_KEY = exports.IncorrectPublicKey;
exports.INCORRECT_TIMESTAMP = exports.IncorrectTimestamp;
exports.INCORRECT_TOKEN = exports.IncorrectToken;
exports.INCORRECT_TRANSACTION_BYTES = exports.IncorrectTransactionBytes;
exports.INCORRECT_URI_LENGTH = exports.IncorrectUriLength;
exports.INCORRECT_WEBSITE = exports.IncorrectWebsite;
exports.MISSING_ACCOUNT = exports.MissingAccount;
exports.MISSING_ALIAS_NAME = exports.MissingAliasName;
exports.MISSING_ALIAS_OR_ALIAS_NAME = MISSING_ALIAS_OR_ALIAS_NAME;
exports.MISSING_ASSET = MISSING_ASSET;
exports.MISSING_ASSET_NAME = MISSING_ASSET_NAME;
exports.MISSING_BLOCK = MISSING_BLOCK;
exports.MISSING_DEADLINE = MISSING_DEADLINE;
exports.MISSING_FEE = MISSING_FEE;
exports.MISSING_HALLMARK = MISSING_HALLMARK;
exports.MISSING_ORDER = MISSING_ORDER;
exports.MISSING_SECRET_PHRASE = MISSING_SECRET_PHRASE;
exports.MISSING_TIMESTAMP = MISSING_TIMESTAMP;
exports.MISSING_TOKEN = MISSING_TOKEN;
exports.MISSING_TRANSACTION_BYTES = MISSING_TRANSACTION_BYTES;
exports.MISSING_WEBSITE = MISSING_WEBSITE;
exports.UNKNOWN_ACCOUNT = UNKNOWN_ACCOUNT;
exports.UNKNOWN_ALIAS = UNKNOWN_ALIAS;
exports.UNKNOWN_ASSET = UNKNOWN_ASSET;
exports.UNKNOWN_BLOCK = UNKNOWN_BLOCK;
exports.UNKNOWN_ORDER = UNKNOWN_ORDER;

exports.MISSING_NUMBER_OF_CONFIRMATIONS = MISSING_NUMBER_OF_CONFIRMATIONS;
exports.INCORRECT_NUMBER_OF_CONFIRMATIONS = INCORRECT_NUMBER_OF_CONFIRMATIONS;
exports.MISSING_PEER = MISSING_PEER;
exports.UNKNOWN_PEER = UNKNOWN_PEER;
exports.MISSING_TRANSACTION = MISSING_TRANSACTION;
exports.UNKNOWN_TRANSACTION = UNKNOWN_TRANSACTION;
exports.INCORRECT_TRANSACTION = INCORRECT_TRANSACTION;
exports.INCORRECT_ASSET_ISSUANCE_FEE = INCORRECT_ASSET_ISSUANCE_FEE;
exports.INCORRECT_ASSET_DESCRIPTION = INCORRECT_ASSET_DESCRIPTION;
exports.INCORRECT_ASSET_NAME = INCORRECT_ASSET_NAME;
exports.INCORRECT_ASSET_NAME_LENGTH = INCORRECT_ASSET_NAME_LENGTH;
exports.INCORRECT_ASSET_TRANSFER_COMMENT = INCORRECT_ASSET_TRANSFER_COMMENT;
exports.MISSING_NAME = MISSING_NAME;
exports.MISSING_QUANTITY = MISSING_QUANTITY;
exports.INCORRECT_QUANTITY = INCORRECT_QUANTITY;
exports.INCORRECT_ASSET_QUANTITY = INCORRECT_ASSET_QUANTITY;
exports.INCORRECT_DECIMALS = INCORRECT_DECIMALS;
exports.MISSING_HOST = MISSING_HOST;
exports.MISSING_DATE = MISSING_DATE;
exports.MISSING_WEIGHT = MISSING_WEIGHT;
exports.INCORRECT_HOST = INCORRECT_HOST;
exports.INCORRECT_WEIGHT = INCORRECT_WEIGHT;
exports.INCORRECT_DATE = INCORRECT_DATE;
exports.MISSING_PRICE = MISSING_PRICE;
exports.INCORRECT_PRICE = INCORRECT_PRICE;
exports.INCORRECT_REFERENCED_TRANSACTION = INCORRECT_REFERENCED_TRANSACTION;
exports.MISSING_MESSAGE = MISSING_MESSAGE;
exports.MISSING_RECIPIENT = MISSING_RECIPIENT;
exports.INCORRECT_RECIPIENT = INCORRECT_RECIPIENT;
exports.INCORRECT_ARBITRARY_MESSAGE = INCORRECT_ARBITRARY_MESSAGE;
exports.MISSING_AMOUNT = MISSING_AMOUNT;
exports.INCORRECT_AMOUNT = INCORRECT_AMOUNT;
exports.MISSING_DESCRIPTION = MISSING_DESCRIPTION;
exports.MISSING_MINNUMBEROFOPTIONS = MISSING_MINNUMBEROFOPTIONS;
exports.MISSING_MAXNUMBEROFOPTIONS = MISSING_MAXNUMBEROFOPTIONS;
exports.MISSING_OPTIONSAREBINARY = MISSING_OPTIONSAREBINARY;
exports.MISSING_POLL = MISSING_POLL;
exports.INCORRECT_POLL_NAME_LENGTH = INCORRECT_POLL_NAME_LENGTH;
exports.INCORRECT_POLL_DESCRIPTION_LENGTH = INCORRECT_POLL_DESCRIPTION_LENGTH;
exports.INCORRECT_POLL_OPTION_LENGTH = INCORRECT_POLL_OPTION_LENGTH;
exports.INCORRECT_MINNUMBEROFOPTIONS = INCORRECT_MINNUMBEROFOPTIONS;
exports.INCORRECT_MAXNUMBEROFOPTIONS = INCORRECT_MAXNUMBEROFOPTIONS;
exports.INCORRECT_OPTIONSAREBINARY = INCORRECT_OPTIONSAREBINARY;
exports.INCORRECT_POLL = INCORRECT_POLL;
exports.INCORRECT_VOTE = INCORRECT_VOTE;
exports.UNKNOWN_POLL = UNKNOWN_POLL;
exports.INCORRECT_ACCOUNT_NAME_LENGTH = INCORRECT_ACCOUNT_NAME_LENGTH;
exports.INCORRECT_ACCOUNT_DESCRIPTION_LENGTH = INCORRECT_ACCOUNT_DESCRIPTION_LENGTH;
exports.MISSING_PERIOD = MISSING_PERIOD;
exports.INCORRECT_PERIOD = INCORRECT_PERIOD;
exports.INCORRECT_UNSIGNED_BYTES = INCORRECT_UNSIGNED_BYTES;
exports.MISSING_UNSIGNED_BYTES = MISSING_UNSIGNED_BYTES;
exports.MISSING_SIGNATURE_HASH = MISSING_SIGNATURE_HASH;
exports.MISSING_SECRET_PHRASE_OR_PUBLIC_KEY = MISSING_SECRET_PHRASE_OR_PUBLIC_KEY;
*/
