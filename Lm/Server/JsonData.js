/*!
 * LibreMoney 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

/*
import nxt.Alias;
import nxt.Asset;
import nxt.Attachment;
import nxt.Block;
import nxt.Order;
import nxt.Poll;
import nxt.Token;
import nxt.Trade;
import nxt.Transaction;
import nxt.crypto.Crypto;
import nxt.peer.Hallmark;
import nxt.peer.Peer;
*/

//Appendix
//DigitalGoodsStore
//TransactionType
//Crypto.EncryptedData
var Accounts = require(__dirname + '/../Accounts');
var Blockchain = require(__dirname + '/../Blockchain');
var Convert = require(__dirname + '/../Util/Convert');


function Alias(alias) {
	var json = {};
	PutAccount(json, "account", alias.GetAccountId());
	json.aliasName = alias.GetAliasName();
	json.aliasURI = alias.GetAliasURI();
	json.timestamp = alias.GetTimestamp();
	json.alias = Convert.ToUnsignedLong(alias.GetId());
	var offer = Aliases.GetOffer(alias.GetAliasName());
	if (offer != null) {
		json.priceMilliLm = offer.GetPriceMilliLm();
		if (offer.GetBuyerId() != null) {
			json.buyer = Convert.ToUnsignedLong(offer.GetBuyerId());
		}
	}
	return json;
}

function AccountBalance(account) {
	var json = {};
	if (!account) {
		json.balanceMilliLm = "0";
		json.unconfirmedBalanceMilliLm = "0";
		json.effectiveBalanceLm = "0";
		json.forgedBalanceMilliLm = "0";
		json.guaranteedBalanceMilliLm = "0";
	} else {
		json.balanceMilliLm = String.valueOf(account.GetBalanceMilliLm());
		json.unconfirmedBalanceMilliLm = String.valueOf(account.GetUnconfirmedBalanceMilliLm());
		json.effectiveBalanceLm = account.GetEffectiveBalanceLm();
		json.forgedBalanceLm = String.valueOf(account.GetForgedBalanceLm());
		json.guaranteedBalanceMilliLm = String.valueOf(account.GetGuaranteedBalanceMilliLm(1440));
	}
	return json;
}

function Asset(asset) {
	var json = {};
	PutAccount(json, "account", asset.GetAccountId());
	json.name = asset.GetName();
	json.description = asset.GetDescription();
	json.decimals = asset.GetDecimals();
	json.quantityQNT = String.valueOf(asset.GetQuantityQNT());
	json.asset = Convert.ToUnsignedLong(asset.GetId());
	json.numberOfTrades = Trade.GetTrades(asset.GetId()).length;
	return json;
}

// Order = Order.Ask
function AskOrder(order) {
	var json = Order(order);
	json.type = "ask";
	return json;
}

// Order = Order.Bid
function BidOrder(order) {
	var json = Order(order);
	json.type = "bid";
	return json;
}

function Block(block, includeTransactions) {
	var json = {};
	json.block = block.GetStringId();
	json.height = block.GetHeight();
	PutAccount(json, "generator", block.GetGeneratorId());
	json.generatorPublicKey = Convert.ToHexString(block.GetGeneratorPublicKey());
	json.timestamp = block.GetTimestamp();
	json.numberOfTransactions = block.GetTransactionIds().length;
	json.totalAmountMilliLm = String.valueOf(block.GetTotalAmountMilliLm());
	json.totalFeeMilliLm = String.valueOf(block.GetTotalFeeMilliLm());
	json.payloadLength = block.GetPayloadLength();
	json.version = block.GetVersion();
	json.baseTarget = Convert.ToUnsignedLong(block.GetBaseTarget());
	if (block.GetPreviousBlockId() != null) {
		json.previousBlock = Convert.ToUnsignedLong(block.GetPreviousBlockId());
	}
	if (block.GetNextBlockId() != null) {
		json.nextBlock = Convert.ToUnsignedLong(block.GetNextBlockId());
	}
	json.payloadHash = Convert.ToHexString(block.GetPayloadHash());
	json.generationSignature = Convert.ToHexString(block.GetGenerationSignature());
	if (block.GetVersion() > 1) {
		json.previousBlockHash = Convert.ToHexString(block.GetPreviousBlockHash());
	}
	json.blockSignature = Convert.toHexString(block.GetBlockSignature());
	var transactions = [];
	var trs = block.GetTransactions();
	for (var i in trs) {
		transaction = trs[i];
		transactions.push(includeTransactions ? Transaction(transaction) : Convert.ToUnsignedLong(transaction.GetId()));
	}
	json.transactions = transactions;
	return json;
}

function EncryptedData(encryptedData) {
	var json = {};
	json.data = Convert.ToHexString(encryptedData.GetData());
	json.nonce = Convert.ToHexString(encryptedData.GetNonce());
	return json;
}

function Goods(goods) {
	var json = {};
	json.goods = Convert.ToUnsignedLong(goods.GetId());
	json.name = goods.GetName();
	json.description = goods.GetDescription();
	json.quantity = goods.GetQuantity();
	json.priceMilliLm = goods.GetPriceMilliLm();
	PutAccount(json, "seller", goods.GetSellerId());
	json.tags = goods.GetTags();
	json.delisted = goods.IsDelisted();
	return json;
}

function Hallmark(hallmark) {
	var json = {};
	PutAccount(json, "account", Accounts.GetId(hallmark.GetPublicKey()));
	json.host = hallmark.GetHost();
	json.weight = hallmark.GetWeight();
	var dateString = Hallmark.FormatDate(hallmark.GetDate());
	json.date = dateString;
	json.valid = hallmark.IsValid();
	return json;
}

// ugly, hopefully temporary
function ModifyAttachmentJson(json) {
	throw new Error('Not implementted');
	/*
	Long quantityQNT = (Long) json.remove("quantityQNT");
	if (quantityQNT != null) {
		json.put("quantityQNT", String.valueOf(quantityQNT));
	}
	Long priceNQT = (Long) json.remove("priceNQT");
	if (priceNQT != null) {
		json.put("priceNQT", String.valueOf(priceNQT));
	}
	Long discountNQT = (Long) json.remove("discountNQT");
	if (discountNQT != null) {
		json.put("discountNQT", String.valueOf(discountNQT));
	}
	Long refundNQT = (Long) json.remove("refundNQT");
	if (refundNQT != null) {
		json.put("refundNQT", String.valueOf(refundNQT));
	}
	*/
}

function Order(order) {
	var json = {};
	json.order = Convert.ToUnsignedLong(order.GetId());
	json.asset = Convert.ToUnsignedLong(order.GetAssetId());
	json.account = Convert.ToUnsignedLong(order.GetAccount().GetId());
	json.accountRS = Convert.RsAccount(order.GetAccount().GetId());
	json.quantityQNT = String.valueOf(order.GetQuantityQNT());
	json.priceMilliLm = String.valueOf(order.GetPriceMilliLm());
	json.height = order.GetHeight();
	return json;
}

function Peer(peer) {
	var json = {};
	json.state = peer.GetState().Ordinal();
	json.announcedAddress = peer.GetAnnouncedAddress();
	json.shareAddress = peer.ShareAddress();
	if (peer.GetHallmark() != null) {
		json.hallmark = peer.GetHallmark().GetHallmarkString();
	}
	json.weight = peer.GetWeight();
	json.downloadedVolume = peer.GetDownloadedVolume();
	json.uploadedVolume = peer.GetUploadedVolume();
	json.application = peer.GetApplication();
	json.version = peer.GetVersion();
	json.platform = peer.GetPlatform();
	json.blacklisted = peer.IsBlacklisted();
	json.lastUpdated = peer.GetLastUpdated();
	return json;
}

function Poll(poll) {
	var json = {};
	json.name = poll.GetName();
	json.description = poll.GetDescription();
	var options = [];
	var pollOptions = poll.GetOptions();
	for (var i = 0; pollOptions.length > i; i++) {
		options.push(pollOptions[i]);
	}
	json.options = options;
	json.minNumberOfOptions = poll.GetMinNumberOfOptions();
	json.maxNumberOfOptions = poll.GetMaxNumberOfOptions();
	json.optionsAreBinary = poll.IsOptionsAreBinary();
	var voters = [];
	var keys = poll.GetVoters().KeySet();
	for (var i in keys) {
		voterId = keys[i];
		voters.push(Convert.ToUnsignedLong(voterId));
	}
	json.voters = voters;
	return json;
}

function Purchase(purchase) {
	throw new Error('Not implementted');
	json = {};
	/*
	JSONObject json = new JSONObject();
	json.put("purchase", Convert.toUnsignedLong(purchase.getId()));
	json.put("goods", Convert.toUnsignedLong(purchase.getGoodsId()));
	json.put("name", purchase.getName());
	putAccount(json, "seller", purchase.getSellerId());
	json.put("priceNQT", String.valueOf(purchase.getPriceNQT()));
	json.put("quantity", purchase.getQuantity());
	putAccount(json, "buyer", purchase.getBuyerId());
	json.put("timestamp", purchase.getTimestamp());
	json.put("deliveryDeadlineTimestamp", purchase.getDeliveryDeadlineTimestamp());
	if (purchase.getNote() != null) {
		json.put("note", encryptedData(purchase.getNote()));
	}
	json.put("pending", purchase.isPending());
	if (purchase.getEncryptedGoods() != null) {
		json.put("goodsData", encryptedData(purchase.getEncryptedGoods()));
		json.put("goodsIsText", purchase.goodsIsText());
	}
	if (purchase.getFeedbackNotes() != null) {
		JSONArray feedbacks = new JSONArray();
		for (EncryptedData encryptedData : purchase.getFeedbackNotes()) {
			feedbacks.add(encryptedData(encryptedData));
		}
		json.put("feedbackNotes", feedbacks);
	}
	if (purchase.getPublicFeedback() != null) {
		JSONArray publicFeedbacks = new JSONArray();
		for (String publicFeedback : purchase.getPublicFeedback()) {
			publicFeedbacks.add(publicFeedback);
		}
		json.put("publicFeedbacks", publicFeedbacks);
	}
	if (purchase.getRefundNote() != null) {
		json.put("refundNote", encryptedData(purchase.getRefundNote()));
	}
	if (purchase.getDiscountNQT() > 0) {
		json.put("discountNQT", String.valueOf(purchase.getDiscountNQT()));
	}
	if (purchase.getRefundNQT() > 0) {
		json.put("refundNQT", String.valueOf(purchase.getRefundNQT()));
	}
	*/
	return json;
}

function PutAccount(json, name, accountId) {
	json[name] = Convert.ToUnsignedLong(accountId);
	json[name + "RS"] = Convert.RsAccount(accountId);
}

function Token(token) {
	var json = {};
	PutAccount(json, "account", Accounts.GetId(token.GetPublicKey()));
	json.timestamp = token.GetTimestamp();
	json.valid = token.IsValid();
	return json;
}

function Trade(trade) {
	var json = {};
	json.timestamp = trade.GetTimestamp();
	json.quantityQNT = String.valueOf(trade.GetQuantityQNT());
	json.priceMilliLm = String.valueOf(trade.GetPriceMilliLm());
	json.asset = Convert.toUnsignedLong(trade.GetAssetId());
	json.askOrder = Convert.toUnsignedLong(trade.GetAskOrderId());
	json.bidOrder = Convert.toUnsignedLong(trade.GetBidOrderId());
	json.block = Convert.toUnsignedLong(trade.GetBlockId());
	return json;
}

function Transaction(transaction) {
	var obj = UnconfirmedTransaction(transaction);
	obj.block = Convert.ToUnsignedLong(transaction.GetBlockId());
	obj.confirmations = 0; //Blockchain.GetLastBlock().GetHeight() - transaction.GetHeight();
	obj.blockTimestamp = transaction.GetBlockTimestamp();
	return obj;
}

function UnconfirmedTransaction(transaction) {
	var json = {};
	json.type = 0; //transaction.GetType().GetType();
	json.subtype = 0; //transaction.GetType().GetSubtype();
	json.timestamp = transaction.GetTimestamp();
	json.deadline = transaction.GetDeadline();
	json.senderPublicKey = Convert.ToHexString(transaction.GetSenderPublicKey());
	if (transaction.GetRecipientId() != null) {
		PutAccount(json, "recipient", transaction.GetRecipientId());
	}
	json.amountMilliLm = transaction.GetAmountMilliLm(); //String.valueOf(transaction.GetAmountMilliLm());
	json.feeMilliLm = transaction.GetFeeMilliLm(); //String.valueOf(transaction.GetFeeMilliLm());
	if (transaction.GetReferencedTransactionFullHash() != null) {
		json.referencedTransactionFullHash = transaction.GetReferencedTransactionFullHash();
	}
	var signature = Convert.EmptyToNull(transaction.GetSignature());
	if (signature != null) {
		json.signature = Convert.ToHexString(signature);
		json.signatureHash = Convert.ToHexString(Crypto.Sha256().digest(signature));
		json.fullHash = transaction.GetFullHash();
		json.transaction = transaction.GetStringId();
	}

	var attachmentJson = {};
	for (var appendage in transaction.GetAppendages()) {
		attachmentJson.PutAll(appendage.GetJsonObject());
	}
	if (!attachmentJson.IsEmpty()) {
		modifyAttachmentJson(attachmentJson);
		json.attachment = attachmentJson;
	}
	PutAccount(json, "sender", transaction.GetSenderId());
	json.height = transaction.GetHeight();
	json.version = transaction.GetVersion();
	if (transaction.GetVersion() > 0) {
		json.ecBlockId = Convert.ToUnsignedLong(transaction.GetECBlockId());
		json.ecBlockHeight = transaction.GetECBlockHeight();
	}

	return json;
}


exports.AccountBalance = AccountBalance;
exports.Alias = Alias;
exports.AskOrder = AskOrder;
exports.Asset = Asset;
exports.BidOrder = BidOrder;
exports.Block = Block;
exports.EncryptedData = EncryptedData;
exports.Goods = Goods;
exports.Hallmark = Hallmark;
exports.ModifyAttachmentJson = ModifyAttachmentJson;
exports.Order = Order;
exports.Peer = Peer;
exports.Poll = Poll;
exports.Purchase = Purchase;
exports.PutAccount = PutAccount;
exports.Token = Token;
exports.Trade = Trade;
exports.Transaction = Transaction;
exports.UnconfirmedTransaction = UnconfirmedTransaction;
