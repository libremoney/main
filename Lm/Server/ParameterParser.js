/**!
 * LibreMoney ParameterParser 0.0
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

/*
import nxt.Asset;
import nxt.Constants;
import nxt.crypto.Crypto;
*/

var JsonResponses = require(__dirname + '/JsonResponses');
var Convert = require(__dirname + '/../Util/Convert');
var Accounts = require(__dirname + '/../Accounts');
var Logger = require(__dirname + '/../Logger').GetLogger(module);


function GetAccount(req) {
	var accountValue = Convert.EmptyToNull(req.query.account);
	if (accountValue == null) {
		return null; //throw new Error(JsonResponses.MissingAccount);
	}
	//try {
		var AccId = Convert.ParseAccountId(accountValue);
		Logger.info("GetAccount: AccId="+AccId);
		var account = Accounts.GetAccountById(Convert.ParseAccountId(accountValue));
		if (account == null || typeof account == 'undefined') {
			throw new Error(JsonResponses.UnknownAccount);
		}
		return account;
	//} catch (e) {
	//	throw new Error(JsonResponses.IncorrectAccount);
	//}
}

function GetAccounts(req) {
	throw new Error('Not implementted');
	/*
	String[] accountValues = req.getParameterValues("account");
	if (accountValues == null || accountValues.length == 0) {
		throw new ParameterException(MISSING_ACCOUNT);
	}
	List<Account> result = new ArrayList<>();
	for (String accountValue : accountValues) {
		if (accountValue == null || accountValue.equals("")) {
			continue;
		}
		try {
			Account account = Account.getAccount(Convert.parseAccountId(accountValue));
			if (account == null) {
				throw new ParameterException(UNKNOWN_ACCOUNT);
			}
			result.add(account);
		} catch (RuntimeException e) {
			throw new ParameterException(INCORRECT_ACCOUNT);
		}
	}
	return result;
	*/
}

// GetAmountNQT
function GetAmountMilliLm(req) {
	throw new Error('Not implementted');
	/*
	String amountValueNQT = Convert.emptyToNull(req.getParameter("amountNQT"));
	if (amountValueNQT == null) {
		throw new ParameterException(MISSING_AMOUNT);
	}
	long amountNQT;
	try {
		amountNQT = Long.parseLong(amountValueNQT);
	} catch (RuntimeException e) {
		throw new ParameterException(INCORRECT_AMOUNT);
	}
	if (amountNQT <= 0 || amountNQT >= Constants.MaxBalanceMilliLm) {
		throw new ParameterException(INCORRECT_AMOUNT);
	}
	return amountNQT;
	*/
}

function GetAsset(req) {
	throw new Error('Not implementted');
	/*
	String assetValue = Convert.emptyToNull(req.getParameter("asset"));
	if (assetValue == null) {
		throw new ParameterException(MISSING_ASSET);
	}
	Asset asset;
	try {
		Long assetId = Convert.parseUnsignedLong(assetValue);
		asset = Asset.getAsset(assetId);
	} catch (RuntimeException e) {
		throw new ParameterException(INCORRECT_ASSET);
	}
	if (asset == null) {
		throw new ParameterException(UNKNOWN_ASSET);
	}
	return asset;
	*/
}

// GetFeeNQT
function GetFeeMilliLm(req) {
	throw new Error('Not implementted');
	/*
	String feeValueNQT = Convert.emptyToNull(req.getParameter("feeNQT"));
	if (feeValueNQT == null) {
		throw new ParameterException(MISSING_FEE);
	}
	long feeNQT;
	try {
		feeNQT = Long.parseLong(feeValueNQT);
	} catch (RuntimeException e) {
		throw new ParameterException(INCORRECT_FEE);
	}
	if (feeNQT <= 0 || feeNQT >= Constants.MaxBalanceMilliLm) {
		throw new ParameterException(INCORRECT_FEE);
	}
	return feeNQT;
	*/
}

function GetOrderId(req) {
	throw new Error('Not implementted');
	/*
	String orderValue = Convert.emptyToNull(req.getParameter("order"));
	if (orderValue == null) {
		throw new ParameterException(MISSING_ORDER);
	}
	try {
		return Convert.parseUnsignedLong(orderValue);
	} catch (RuntimeException e) {
		throw new ParameterException(INCORRECT_ORDER);
	}
	*/
}

// GetPriceNQT
function GetPriceMilliLm(req) {
	throw new Error('Not implementted');
	/*
	String priceValueNQT = Convert.emptyToNull(req.getParameter("priceNQT"));
	if (priceValueNQT == null) {
		throw new ParameterException(MISSING_PRICE);
	}
	long priceNQT;
	try {
		priceNQT = Long.parseLong(priceValueNQT);
	} catch (RuntimeException e) {
		throw new ParameterException(INCORRECT_PRICE);
	}
	if (priceNQT <= 0 || priceNQT > Constants.MaxBalanceMilliLm) {
		throw new ParameterException(INCORRECT_PRICE);
	}
	return priceNQT;
	*/
}

// GetQuantityQNT
function GetQuantityMilliLm(req) {
	throw new Error('Not implementted');
	/*
	String quantityValueQNT = Convert.emptyToNull(req.getParameter("quantityQNT"));
	if (quantityValueQNT == null) {
		throw new ParameterException(MISSING_QUANTITY);
	}
	long quantityQNT;
	try {
		quantityQNT = Long.parseLong(quantityValueQNT);
	} catch (RuntimeException e) {
		throw new ParameterException(INCORRECT_QUANTITY);
	}
	if (quantityQNT <= 0 || quantityQNT > Constants.MaxAssetQuantityQnt) {
		throw new ParameterException(INCORRECT_QUANTITY);
	}
	return quantityQNT;
	*/
}

function GetRecipientId(req) {
	throw new Error('Not implementted');
	/*
	String recipientValue = Convert.emptyToNull(req.getParameter("recipient"));
	if (recipientValue == null || "0".equals(recipientValue)) {
		throw new ParameterException(MISSING_RECIPIENT);
	}
	Long recipientId;
	try {
		recipientId = Convert.parseAccountId(recipientValue);
	} catch (RuntimeException e) {
		throw new ParameterException(INCORRECT_RECIPIENT);
	}
	if (recipientId == null) {
		throw new ParameterException(INCORRECT_RECIPIENT);
	}
	return recipientId;
	*/
}

function GetSenderAccount(req) {
	throw new Error('Not implementted');
	/*
	Account account;
	String secretPhrase = Convert.emptyToNull(req.getParameter("secretPhrase"));
	String publicKeyString = Convert.emptyToNull(req.getParameter("publicKey"));
	if (secretPhrase != null) {
		account = Account.getAccount(Crypto.getPublicKey(secretPhrase));
	} else if (publicKeyString != null) {
		try {
			account = Account.getAccount(Convert.parseHexString(publicKeyString));
		} catch (RuntimeException e) {
			throw new ParameterException(INCORRECT_PUBLIC_KEY);
		}
	} else {
		throw new ParameterException(MISSING_SECRET_PHRASE_OR_PUBLIC_KEY);
	}
	if (account == null) {
		throw new ParameterException(UNKNOWN_ACCOUNT);
	}
	return account;
	*/
}

function GetTimestamp(req) {
	var timestampValue = Convert.EmptyToNull(req.query.timestamp);
	if (timestampValue == null) {
		return 0;
	}
	var timestamp = parseInt(timestampValue);
	if (timestamp < 0) {
		throw new Error(JsonResponses.IncorrectTimestamp);
	}
	return timestamp;
}


exports.GetAccount = GetAccount;
exports.GetAccounts = GetAccounts;
exports.GetAmountMilliLm = GetAmountMilliLm;
exports.GetAsset = GetAsset;
exports.GetFeeMilliLm = GetFeeMilliLm;
exports.GetOrderId = GetOrderId;
exports.GetPriceMilliLm = GetPriceMilliLm;
exports.GetQuantityMilliLm = GetQuantityMilliLm;
exports.GetRecipientId = GetRecipientId;
exports.GetSenderAccount = GetSenderAccount;
exports.GetTimestamp = GetTimestamp;
