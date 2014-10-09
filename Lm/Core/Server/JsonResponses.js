/**!
 * LibreMoney JsonResponses 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */


if (typeof module !== "undefined") {
	var Constants = require(__dirname + '/../../Lib/Constants');
}


var JsonResponses = function() {
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


	var ErrorIncorrectRequest = {
		errorCode: 1,
		errorDescription: "Incorrect request"
	}

	var ErrorNotAllowed = {
		errorCode: 7,
		errorDescription: "Not allowed"
	}

	var FeatureNotAvailable = {
		errorCode: 9,
		errorDescription: "Feature not available"
	}

	var NotEnoughAssets = {
		errorCode: 6,
		errorDescription: "Not enough assets"
	}

	var NotEnoughFunds = {
		errorCode: 6,
		errorDescription: "Not enough funds"
	}

	var NotForging = {
		errorCode: 5,
		errorDescription: "Account is not forging"
	}

	var PostRequired = {
		errorCode: 1,
		errorDescription: "This request is only accepted using POST!"
	}


	return {
		Incorrect: incorrect,
		Missing: missing,
		Unknown: unknown,

		IncorrectAccount: incorrect("account"),
		IncorrectAccountDescriptionLength: incorrect("description", "(length must be less than " + Constants.MaxAccountDescriptionLength + " characters)"),
		IncorrectAccountNameLength: incorrect("name", "(length must be less than " + Constants.MaxAccountNameLength + " characters)"),
		IncorrectAlias: incorrect("alias"),
		IncorrectAliasLength: incorrect("alias", "(length must be in [1.." + Constants.MaxAliasLength + "] range)"),
		IncorrectAliasName: incorrect("alias", "(must contain only digits and latin letters)"),
		IncorrectAliasNotForSale: incorrect("alias", "(alias is not for sale at the moment)"),
		IncorrectAliasOwner: incorrect("alias", "(invalid alias owner)"),
		IncorrectAmount: incorrect("amount"),
		IncorrectArbitraryMessage: incorrect("message"),
		IncorrectAsset: incorrect("asset"),
		IncorrectAssetDescription: incorrect("description", "(length must not exceed " + Constants.MaxAssetDescriptionLength + " characters)"),
		IncorrectAssetName: incorrect("name", "(must contain only digits and latin letters)"),
		IncorrectAssetNameLength: incorrect("name", "(length must be in [" + Constants.MinAssetNameLength + ".." + Constants.MaxAssetNameLength + "] range)"),
		IncorrectAssetTransferComment: incorrect("comment", "(length must not exceed " + Constants.MaxAssetTransferCommentLength + " characters)"),
		IncorrectAssetQuantity: incorrect("quantity", "(must be in [1.." + Constants.MaxAssetQuantityQnt + "] range)"),
		IncorrectBlock: incorrect("block"),
		IncorrectDeadline: incorrect("deadline"),
		IncorrectDecimals: incorrect("decimals"),
		IncorrectDeliveryDeadlineTimestamp: incorrect("deliveryDeadlineTimestamp"),
		IncorrectDeltaQuantity: incorrect("deltaQuantity"),
		IncorrectDgsDiscount: incorrect("discountNQT"),
		IncorrectDgsEncryptedGoods: incorrect("goodsData"),
		IncorrectDgsGoods: incorrect("goodsToEncrypt"),
		IncorrectDgsListingDescription: incorrect("description", "(length must be not longer than " + Constants.MaxDgsListingDescriptionLength + " characters)"),
		IncorrectDgsListingName: incorrect("name", "(length must be not longer than " + Constants.MaxDgsListingNameLength + " characters)"),
		IncorrectDgsListingTags: incorrect("tags", "(length must be not longer than " + Constants.MaxDgsListingTagsLength + " characters)"),
		IncorrectDgsRefund: incorrect("refundNQT"),
		IncorrectEncryptedMessage: incorrect("encryptedMessageData"),
		IncorrectFee: incorrect("fee"),
		IncorrectGoods: incorrect("goods"),
		IncorrectHeight: incorrect("height"),
		IncorrectNumberOfConfirmations: incorrect("numberOfConfirmations"),
		IncorrectMaxNumberOfOptions: incorrect("maxNumberOfOptions"),
		IncorrectMinNumberOfOptions: incorrect("minNumberOfOptions"),
		IncorrectOptionsAreBinary: incorrect("optionsAreBinary"),
		IncorrectOrder: incorrect("order"),
		IncorrectPeriod: incorrect("period", "(period must be at least 1440 blocks)"),
		IncorrectPlainMessage: incorrect("messageToEncrypt"),
		IncorrectPoll: incorrect("poll"),
		IncorrectPollNameLength: incorrect("name", "(length must be not longer than " + Constants.MaxPollNameLength + " characters)"),
		IncorrectPollDescriptionLength: incorrect("description", "(length must be not longer than " + Constants.MaxPollDescriptionLength + " characters)"),
		IncorrectPollOptionLength: incorrect("option", "(length must be not longer than " + Constants.MaxPollOptionLength + " characters)"),
		IncorrectPrice: incorrect("price"),
		IncorrectPublicKey: incorrect("publicKey"),
		IncorrectPurchase: incorrect("purchase"),
		IncorrectPurchasePrice: incorrect("priceNQT", "(purchase price doesn't match goods price)"),
		IncorrectPurchaseQuantity: incorrect("quantity", "(quantity exceeds available goods quantity)"),
		IncorrectRecipient: incorrect("recipient"),
		IncorrectReferencedTransaction: incorrect("referencedTransactionFullHash"),
		IncorrectUriLength: incorrect("uri", "(length must be not longer than " + Constants.MaxAliasUriLength + " characters)"),
		IncorrectTimestamp: incorrect("timestamp"),
		IncorrectToken: incorrect("token"),
		IncorrectTransaction: incorrect("transaction"),
		IncorrectTransactionBytes: incorrect("transactionBytes"),
		IncorrectQuantity: incorrect("quantity"),
		IncorrectVote: incorrect("vote"),
		IncorrectWebsite: incorrect("website"),
		IncorrectUnsignedBytes: incorrect("unsignedTransactionBytes"),
		MissingAccount: missing("account"),
		MissingAliasName: missing("aliasName"),
		MissingAliasOrAliasName: missing("alias", "aliasName"),
		MissingAmount: missing("amountMilliLm"),
		MissingAsset: missing("asset"),
		MissingAssetName: missing("assetName"),
		MissingBlock: missing("block"),
		MissingDeadline: missing("deadline"),
		MissingDeliveryDeadlineTimestamp: missing("deliveryDeadlineTimestamp"),
		MissingDeltaQuantity: missing("deltaQuantity"),
		MissingDescription: missing("description"),
		MissingFee: missing("feeMilliLm"),
		MissingGoods: missing("goods"),
		MissingHeight: missing("height"),
		MissingMessage: missing("message"),
		MissingMaxNumberOfOptions: missing("maxNumberOfOptions"),
		MissingMinNumberOfOptions: missing("minNumberOfOptions"),
		MissingName: missing("name"),
		MissingNumberOfConfirmations: missing("numberOfConfirmations"),
		MissingOptionsAreBinary: missing("optionsAreBinary"),
		MissingOrder: missing("order"),
		MissingPeriod: missing("period"),
		MissingPoll: missing("poll"),
		MissingPrice: missing("priceMilliLm"),
		MissingPublicKey: missing("publicKey"),
		MissingPurchase: missing("purchase"),
		MissingQuantity: missing("quantityQNT"),
		MissingRecipient: missing("recipient"),
		MissingSecretPhrase: missing("secretPhrase"), // deprecated - use MissingSignature
		MissingSecretPhraseOrPublicKey: missing("secretPhrase", "publicKey"), // deprecated - use MissingSignature
		MissingSeller: missing("seller"),
		MissingSignature: missing("signature"),
		MissingSignatureHash: missing("signatureHash"),
		MissingTimestamp: missing("timestamp"),
		MissingToken: missing("token"),
		MissingTransaction: missing("transaction"),
		MissingTransactionBytesOrJson: missing("transactionBytes", "transactionJson"),
		MissingWebsite: missing("website"),
		MissingUnsignedBytes: missing("unsignedTransactionBytes"),
		UnknownAccount: unknown("account"),
		UnknownAlias: unknown("alias"),
		UnknownAsset: unknown("asset"),
		UnknownBlock: unknown("block"),
		UnknownGoods: unknown("goods"),
		UnknownOrder: unknown("order"),
		UnknownPoll: unknown("poll"),
		UnknownTransaction: unknown("transaction"),

		ErrorIncorrectRequest: ErrorIncorrectRequest,
		ErrorNotAllowed: ErrorNotAllowed,
		FeatureNotAvailable: FeatureNotAvailable
	}
}();


if (typeof module !== "undefined") {
	module.exports = JsonResponses;
}
