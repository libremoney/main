/*
import nxt.Constants;
import nxt.util.JSON;
*/

var INCORRECT_ALIAS = incorrect("alias");
var INCORRECT_ALIAS_LENGTH = incorrect("alias", "(length must be in [1.." + Constants.MAX_ALIAS_LENGTH + "] range)");
var INCORRECT_ALIAS_NAME = incorrect("alias", "(must contain only digits and latin letters)");
var INCORRECT_URI_LENGTH = incorrect("uri", "(length must be not longer than " + Constants.MAX_ALIAS_URI_LENGTH + " characters)");
var MISSING_SECRET_PHRASE = missing("secretPhrase");
var INCORRECT_PUBLIC_KEY = incorrect("publicKey");
var MISSING_ALIAS_NAME = missing("aliasName");
var MISSING_ALIAS_OR_ALIAS_NAME = missing("alias", "aliasName");
var MISSING_FEE = missing("feeNQT");
var MISSING_DEADLINE = missing("deadline");
var INCORRECT_DEADLINE = incorrect("deadline");
var INCORRECT_FEE = incorrect("fee");
var MISSING_TRANSACTION_BYTES = missing("transactionBytes");
var INCORRECT_TRANSACTION_BYTES = incorrect("transactionBytes");
var MISSING_ORDER = missing("order");
var INCORRECT_ORDER = incorrect("order");
var UNKNOWN_ORDER = unknown("order");
var MISSING_HALLMARK = missing("hallmark");
var INCORRECT_HALLMARK = incorrect("hallmark");
var MISSING_WEBSITE = missing("website");
var INCORRECT_WEBSITE = incorrect("website");
var MISSING_TOKEN = missing("token");
var INCORRECT_TOKEN = incorrect("token");
var MISSING_ACCOUNT = missing("account");
var INCORRECT_ACCOUNT = incorrect("account");
var MISSING_TIMESTAMP = missing("timestamp");
var INCORRECT_TIMESTAMP = incorrect("timestamp");
var UNKNOWN_ACCOUNT = unknown("account");
var UNKNOWN_ALIAS = unknown("alias");
var MISSING_ASSET = missing("asset");
var UNKNOWN_ASSET = unknown("asset");
var INCORRECT_ASSET = incorrect("asset");
var MISSING_ASSET_NAME = missing("assetName");
var MISSING_BLOCK = missing("block");
var UNKNOWN_BLOCK = unknown("block");
var INCORRECT_BLOCK = incorrect("block");
var MISSING_NUMBER_OF_CONFIRMATIONS = missing("numberOfConfirmations");
var INCORRECT_NUMBER_OF_CONFIRMATIONS = incorrect("numberOfConfirmations");
var MISSING_PEER = missing("peer");
var UNKNOWN_PEER = unknown("peer");
var MISSING_TRANSACTION = missing("transaction");
var UNKNOWN_TRANSACTION = unknown("transaction");
var INCORRECT_TRANSACTION = incorrect("transaction");
var INCORRECT_ASSET_ISSUANCE_FEE = incorrect("fee", "(must be not less than 1'000 NXT)");
var INCORRECT_ASSET_DESCRIPTION = incorrect("description", "(length must not exceed " + Constants.MAX_ASSET_DESCRIPTION_LENGTH + " characters)");
var INCORRECT_ASSET_NAME = incorrect("name", "(must contain only digits and latin letters)");
var INCORRECT_ASSET_NAME_LENGTH = incorrect("name", "(length must be in [" + Constants.MIN_ASSET_NAME_LENGTH + ".." + Constants.MAX_ASSET_NAME_LENGTH + "] range)");
var INCORRECT_ASSET_TRANSFER_COMMENT = incorrect("comment", "(length must not exceed " + Constants.MAX_ASSET_TRANSFER_COMMENT_LENGTH + " characters)");
var MISSING_NAME = missing("name");
var MISSING_QUANTITY = missing("quantityQNT");
var INCORRECT_QUANTITY = incorrect("quantity");
var INCORRECT_ASSET_QUANTITY = incorrect("quantity", "(must be in [1..1'000'000'000] range)");
var INCORRECT_DECIMALS = incorrect("decimals");
var MISSING_HOST = missing("host");
var MISSING_DATE = missing("date");
var MISSING_WEIGHT = missing("weight");
var INCORRECT_HOST = incorrect("host", "(the length exceeds 100 chars limit)");
var INCORRECT_WEIGHT = incorrect("weight");
var INCORRECT_DATE = incorrect("date");
var MISSING_PRICE = missing("priceNQT");
var INCORRECT_PRICE = incorrect("price");
var INCORRECT_REFERENCED_TRANSACTION = incorrect("referencedTransactionFullHash");
var MISSING_MESSAGE = missing("message");
var MISSING_RECIPIENT = missing("recipient");
var INCORRECT_RECIPIENT = incorrect("recipient");
var INCORRECT_ARBITRARY_MESSAGE = incorrect("message", "(length must be not longer than " + Constants.MAX_ARBITRARY_MESSAGE_LENGTH + " bytes)");
var MISSING_AMOUNT = missing("amountNQT");
var INCORRECT_AMOUNT = incorrect("amount");
var MISSING_DESCRIPTION = missing("description");
var MISSING_MINNUMBEROFOPTIONS = missing("minNumberOfOptions");
var MISSING_MAXNUMBEROFOPTIONS = missing("maxNumberOfOptions");
var MISSING_OPTIONSAREBINARY = missing("optionsAreBinary");
var MISSING_POLL = missing("poll");
var INCORRECT_POLL_NAME_LENGTH = incorrect("name", "(length must be not longer than " + Constants.MAX_POLL_NAME_LENGTH + " characters)");
var INCORRECT_POLL_DESCRIPTION_LENGTH = incorrect("description", "(length must be not longer than " + Constants.MAX_POLL_DESCRIPTION_LENGTH + " characters)");
var INCORRECT_POLL_OPTION_LENGTH = incorrect("option", "(length must be not longer than " + Constants.MAX_POLL_OPTION_LENGTH + " characters)");
var INCORRECT_MINNUMBEROFOPTIONS = incorrect("minNumberOfOptions");
var INCORRECT_MAXNUMBEROFOPTIONS = incorrect("maxNumberOfOptions");
var INCORRECT_OPTIONSAREBINARY = incorrect("optionsAreBinary");
var INCORRECT_POLL = incorrect("poll");
var INCORRECT_VOTE = incorrect("vote");
var UNKNOWN_POLL = unknown("poll");
var INCORRECT_ACCOUNT_NAME_LENGTH = incorrect("name", "(length must be less than " + Constants.MAX_ACCOUNT_NAME_LENGTH + " characters)");
var INCORRECT_ACCOUNT_DESCRIPTION_LENGTH = incorrect("description", "(length must be less than " + Constants.MAX_ACCOUNT_DESCRIPTION_LENGTH + " characters)");
var MISSING_PERIOD = missing("period");
var INCORRECT_PERIOD = incorrect("period", "(period must be at least 1440 blocks)");
var INCORRECT_UNSIGNED_BYTES = incorrect("unsignedTransactionBytes");
var MISSING_UNSIGNED_BYTES = missing("unsignedTransactionBytes");
var MISSING_SIGNATURE_HASH = missing("signatureHash");
var MISSING_SECRET_PHRASE_OR_PUBLIC_KEY = missing("secretPhrase", "publicKey");

/*
public static final JSONStreamAware NOT_ENOUGH_FUNDS;
static {
	JSONObject response = new JSONObject();
	response.put("errorCode", 6);
	response.put("errorDescription", "Not enough funds");
	NOT_ENOUGH_FUNDS = JSON.prepare(response);
}

public static final JSONStreamAware NOT_ENOUGH_ASSETS;
static {
	JSONObject response = new JSONObject();
	response.put("errorCode", 6);
	response.put("errorDescription", "Not enough assets");
	NOT_ENOUGH_ASSETS = JSON.prepare(response);
}

public static final JSONStreamAware ERROR_NOT_ALLOWED;
static {
	JSONObject response = new JSONObject();
	response.put("errorCode", 7);
	response.put("errorDescription", "Not allowed");
	ERROR_NOT_ALLOWED = JSON.prepare(response);
}

public static final JSONStreamAware ERROR_INCORRECT_REQUEST;
static {
	JSONObject response  = new JSONObject();
	response.put("errorCode", 1);
	response.put("errorDescription", "Incorrect request");
	ERROR_INCORRECT_REQUEST = JSON.prepare(response);
}

public static final JSONStreamAware NOT_FORGING;
static {
	JSONObject response = new JSONObject();
	response.put("errorCode", 5);
	response.put("errorDescription", "Account is not forging");
	NOT_FORGING = JSON.prepare(response);
}

public static final JSONStreamAware POST_REQUIRED;
static {
	JSONObject response = new JSONObject();
	response.put("errorCode", 1);
	response.put("errorDescription", "This request is only accepted using POST!");
	POST_REQUIRED = JSON.prepare(response);
}

public static final JSONStreamAware FEATURE_NOT_AVAILABLE;
static {
	JSONObject response = new JSONObject();
	response.put("errorCode", 9);
	response.put("errorDescription", "Feature not available");
	FEATURE_NOT_AVAILABLE = JSON.prepare(response);
}

private static JSONStreamAware missing(String... paramNames) {
	JSONObject response = new JSONObject();
	response.put("errorCode", 3);
	if (paramNames.length == 1) {
		response.put("errorDescription", "\"" + paramNames[0] + "\"" + " not specified");
	} else {
		response.put("errorDescription", "At least one of " + Arrays.toString(paramNames) + " must be specified");
	}
	return JSON.prepare(response);
}

private static JSONStreamAware incorrect(String paramName) {
	return incorrect(paramName, null);
}

private static JSONStreamAware incorrect(String paramName, String details) {
	JSONObject response = new JSONObject();
	response.put("errorCode", 4);
	response.put("errorDescription", "Incorrect \"" + paramName + (details != null ? "\" " + details : "\""));
	return JSON.prepare(response);
}

private static JSONStreamAware unknown(String objectName) {
	JSONObject response = new JSONObject();
	response.put("errorCode", 5);
	response.put("errorDescription", "Unknown " + objectName);
	return JSON.prepare(response);
}
*/

/*
exports.INCORRECT_ALIAS = incorrect("alias");
exports.INCORRECT_ALIAS_LENGTH = incorrect("alias", "(length must be in [1.." + Constants.MAX_ALIAS_LENGTH + "] range)");
exports.INCORRECT_ALIAS_NAME = incorrect("alias", "(must contain only digits and latin letters)");
exports.INCORRECT_URI_LENGTH = incorrect("uri", "(length must be not longer than " + Constants.MAX_ALIAS_URI_LENGTH + " characters)");
exports.MISSING_SECRET_PHRASE = missing("secretPhrase");
exports.INCORRECT_PUBLIC_KEY = incorrect("publicKey");
exports.MISSING_ALIAS_NAME = missing("aliasName");
exports.MISSING_ALIAS_OR_ALIAS_NAME = missing("alias", "aliasName");
exports.MISSING_FEE = missing("feeNQT");
exports.MISSING_DEADLINE = missing("deadline");
exports.INCORRECT_DEADLINE = incorrect("deadline");
exports.INCORRECT_FEE = incorrect("fee");
exports.MISSING_TRANSACTION_BYTES = missing("transactionBytes");
exports.INCORRECT_TRANSACTION_BYTES = incorrect("transactionBytes");
exports.MISSING_ORDER = missing("order");
exports.INCORRECT_ORDER = incorrect("order");
exports.UNKNOWN_ORDER = unknown("order");
exports.MISSING_HALLMARK = missing("hallmark");
exports.INCORRECT_HALLMARK = incorrect("hallmark");
exports.MISSING_WEBSITE = missing("website");
exports.INCORRECT_WEBSITE = incorrect("website");
exports.MISSING_TOKEN = missing("token");
exports.INCORRECT_TOKEN = incorrect("token");
exports.MISSING_ACCOUNT = missing("account");
exports.INCORRECT_ACCOUNT = incorrect("account");
exports.MISSING_TIMESTAMP = missing("timestamp");
exports.INCORRECT_TIMESTAMP = incorrect("timestamp");
exports.UNKNOWN_ACCOUNT = unknown("account");
exports.UNKNOWN_ALIAS = unknown("alias");
exports.MISSING_ASSET = missing("asset");
exports.UNKNOWN_ASSET = unknown("asset");
*/
exports.INCORRECT_ASSET = INCORRECT_ASSET;
exports.MISSING_ASSET_NAME = MISSING_ASSET_NAME;
exports.MISSING_BLOCK = MISSING_BLOCK;
exports.UNKNOWN_BLOCK = UNKNOWN_BLOCK;
exports.INCORRECT_BLOCK = INCORRECT_BLOCK;
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
