/**!
 * LibreMoney ParameterParser 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

/*
import nxt.Asset;
import nxt.Constants;
import nxt.crypto.Crypto;
*/

if (typeof module !== "undefined") {
	var Accounts = require(__dirname + '/../Accounts');
	var Convert = require(__dirname + '/../../Lib/Util/Convert');
	var JsonResponses = require(__dirname + '/JsonResponses');
	var Logger = require(__dirname + '/../../Lib/Util/Logger').GetLogger(module);
}


var ParameterParser = function() {
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

	function GetAlias(req) {
		throw new Error('Not implementted');
		/*
		Long aliasId;
		try {
			aliasId = Convert.parseUnsignedLong(Convert.emptyToNull(req.getParameter("alias")));
		} catch (RuntimeException e) {
			throw new ParameterException(INCORRECT_ALIAS);
		}
		String aliasName = Convert.emptyToNull(req.getParameter("aliasName"));
		Alias alias;
		if (aliasId != null) {
			alias = Alias.getAlias(aliasId);
		} else if (aliasName != null) {
			alias = Alias.getAlias(aliasName);
		} else {
			throw new ParameterException(MISSING_ALIAS_OR_ALIAS_NAME);
		}
		if (alias == null) {
			throw new ParameterException(UNKNOWN_ALIAS);
		}
		return alias;
		*/
	}

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

	function GetBuyerId(req) {
		throw new Error('Not implementted');
		/*
		String buyerIdValue = Convert.emptyToNull(req.getParameter("buyer"));
		try {
			return Convert.parseAccountId(buyerIdValue);
		} catch (RuntimeException e) {
			throw new ParameterException(INCORRECT_RECIPIENT);
		}
		*/
	}

	function GetEncryptedGoods(req) {
		throw new Error('Not implementted');
		/*
		String data = Convert.emptyToNull(req.getParameter("goodsData"));
		String nonce = Convert.emptyToNull(req.getParameter("goodsNonce"));
		if (data != null && nonce != null) {
			try {
				return new EncryptedData(Convert.parseHexString(data), Convert.parseHexString(nonce));
			} catch (RuntimeException e) {
				throw new ParameterException(INCORRECT_DGS_ENCRYPTED_GOODS);
			}
		}
		return null;
		*/
	}

	function GetEncryptedMessage(req, recipientAccount) {
		throw new Error('Not implementted');
		/*
		String data = Convert.emptyToNull(req.getParameter("encryptedMessageData"));
		String nonce = Convert.emptyToNull(req.getParameter("encryptedMessageNonce"));
		if (data != null && nonce != null) {
			try {
				return new EncryptedData(Convert.parseHexString(data), Convert.parseHexString(nonce));
			} catch (RuntimeException e) {
				throw new ParameterException(INCORRECT_ENCRYPTED_MESSAGE);
			}
		}
		String plainMessage = Convert.emptyToNull(req.getParameter("messageToEncrypt"));
		if (plainMessage == null) {
			return null;
		}
		if (recipientAccount == null) {
			throw new ParameterException(INCORRECT_RECIPIENT);
		}
		String secretPhrase = getSecretPhrase(req);
		boolean isText = !"false".equalsIgnoreCase(req.getParameter("messageToEncryptIsText"));
		try {
			byte[] plainMessageBytes = isText ? Convert.toBytes(plainMessage) : Convert.parseHexString(plainMessage);
			return recipientAccount.encryptTo(plainMessageBytes, secretPhrase);
		} catch (RuntimeException e) {
			throw new ParameterException(INCORRECT_PLAIN_MESSAGE);
		}
		*/
	}

	function GetEncryptToSelfMessage(req) {
		throw new Error('Not implementted');
		/*
		String data = Convert.emptyToNull(req.getParameter("encryptToSelfMessageData"));
		String nonce = Convert.emptyToNull(req.getParameter("encryptToSelfMessageNonce"));
		if (data != null && nonce != null) {
			try {
				return new EncryptedData(Convert.parseHexString(data), Convert.parseHexString(nonce));
			} catch (RuntimeException e) {
				throw new ParameterException(INCORRECT_ENCRYPTED_MESSAGE);
			}
		}
		String plainMessage = Convert.emptyToNull(req.getParameter("messageToEncryptToSelf"));
		if (plainMessage == null) {
			return null;
		}
		String secretPhrase = getSecretPhrase(req);
		Account senderAccount = Account.getAccount(Crypto.getPublicKey(secretPhrase));
		boolean isText = !"false".equalsIgnoreCase(req.getParameter("messageToEncryptToSelfIsText"));
		try {
			byte[] plainMessageBytes = isText ? Convert.toBytes(plainMessage) : Convert.parseHexString(plainMessage);
			return senderAccount.encryptTo(plainMessageBytes, secretPhrase);
		} catch (RuntimeException e) {
			throw new ParameterException(INCORRECT_PLAIN_MESSAGE);
		}
		*/
	}

	function GetFeeMilliLm(req) {
		var feeValueMilliLm = Convert.EmptyToNull(req.query.feeMilliLm);
		return ParseFeeMilliLm(feeValueMilliLm);
	}

	function GetFirstIndex(req) {
		throw new Error('Not implementted');
		/*
		int firstIndex;
		try {
			firstIndex = Integer.parseInt(req.getParameter("firstIndex"));
			if (firstIndex < 0) {
				return 0;
			}
		} catch (NumberFormatException e) {
			return 0;
		}
		return firstIndex;
		*/
	}

	function GetGoods(req) {
		throw new Error('Not implementted');
		/*
		String goodsValue = Convert.emptyToNull(req.getParameter("goods"));
		if (goodsValue == null) {
			throw new ParameterException(MISSING_GOODS);
		}
		DigitalGoodsStore.Goods goods;
		try {
			Long goodsId = Convert.parseUnsignedLong(goodsValue);
			goods = DigitalGoodsStore.getGoods(goodsId);
			if (goods == null) {
				throw new ParameterException(UNKNOWN_GOODS);
			}
			return goods;
		} catch (RuntimeException e) {
			throw new ParameterException(INCORRECT_GOODS);
		}
		*/
	}

	function GetGoodsQuantity(req) {
		throw new Error('Not implementted');
		/*
		String quantityString = Convert.emptyToNull(req.getParameter("quantity"));
		try {
			int quantity = Integer.parseInt(quantityString);
			if (quantity < 0 || quantity > Constants.MAX_DGS_LISTING_QUANTITY) {
				throw new ParameterException(INCORRECT_QUANTITY);
			}
			return quantity;
		} catch (NumberFormatException e) {
			throw new ParameterException(INCORRECT_QUANTITY);
		}
		*/
	}

	function GetLastIndex(req) {
		throw new Error('Not implementted');
		/*
		try {
			return Integer.parseInt(req.getParameter("lastIndex"));
		} catch (NumberFormatException e) {
			return Integer.MAX_VALUE;
		}
		*/
	}

	function GetNumberOfConfirmations(req) {
		var numberOfConfirmationsValue = Convert.EmptyToNull(req.numberOfConfirmations);
		if (numberOfConfirmationsValue != null) {
			try {
				var numberOfConfirmations = parseInt(numberOfConfirmationsValue);
				if (numberOfConfirmations <= Blockchain.GetHeight()) {
					return numberOfConfirmations;
				}
				throw new Error(JsonResponses.IncorrectNumberOfConfirmations);
			} catch (e) {
				throw new Error(JsonResponses.IncorrectNumberOfConfirmations);
			}
		}
		return 0;
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

	function GetPurchase(req) {
		throw new Error('Not implementted');
		/*
		String purchaseIdString = Convert.emptyToNull(req.getParameter("purchase"));
		if (purchaseIdString == null) {
			throw new ParameterException(MISSING_PURCHASE);
		}
		try {
			DigitalGoodsStore.Purchase purchase = DigitalGoodsStore.getPurchase(Convert.parseUnsignedLong(purchaseIdString));
			if (purchase == null) {
				throw new ParameterException(INCORRECT_PURCHASE);
			}
			return purchase;
		} catch (RuntimeException e) {
			throw new ParameterException(INCORRECT_PURCHASE);
		}
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
			throw new ParameterException(INCORRECT_ASSET_QUANTITY);
		}
		return quantityQNT;
		*/
	}

	function GetSecretPhrase(req) {
		throw new Error('Not implementted');
		/*
		String secretPhrase = Convert.emptyToNull(req.getParameter("secretPhrase"));
		if (secretPhrase == null) {
			throw new ParameterException(MISSING_SECRET_PHRASE);
		}
		return secretPhrase;
		*/
	}

	function GetSellerId(req) {
		throw new Error('Not implementted');
		/*
		String sellerIdValue = Convert.emptyToNull(req.getParameter("seller"));
		try {
			return Convert.parseAccountId(sellerIdValue);
		} catch (RuntimeException e) {
			throw new ParameterException(INCORRECT_RECIPIENT);
		}
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

	function ParseFeeMilliLm(feeValueMilliLm) {
		if (!feeValueMilliLm) {
			throw new Error(JsonResponses.MissingFee);
		}
		var feeMilliLm;
		try {
			feeMilliLm = parseInt(feeValueMilliLm);
		} catch (e) {
			throw new Error(JsonResponses.IncorrectFee);
		}
		if (feeMilliLm <= 0 || feeMilliLm >= Constants.MaxBalanceMilliLm) {
			throw new Error(JsonResponses.IncorrectFee);
		}
		return feeMilliLm;
	}


	return {
		GetAccounts: GetAccounts,
		GetAlias: GetAlias,
		GetAmountMilliLm: GetAmountMilliLm,
		GetAsset: GetAsset,
		GetFeeMilliLm: GetFeeMilliLm,
		GetNumberOfConfirmations: GetNumberOfConfirmations,
		GetOrderId: GetOrderId,
		GetPriceMilliLm: GetPriceMilliLm,
		GetQuantityMilliLm: GetQuantityMilliLm,
		GetSenderAccount: GetSenderAccount,
		GetTimestamp: GetTimestamp,
		ParseFeeMilliLm: ParseFeeMilliLm
	}
}();


if (typeof module !== "undefined") {
	module.exports = ParameterParser;
}
