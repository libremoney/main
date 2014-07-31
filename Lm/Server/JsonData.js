/*!
 * LibreMoney 0.0
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

var Accounts = require(__dirname + '/../Accounts');
var Blockchain = require(__dirname + '/../Blockchain');
var Convert = require(__dirname + '/../Util/Convert');


function Alias(alias) {
	var json = {};
	json.account = Convert.ToUnsignedLong(alias.GetAccount().GetId());
	json.accountRS = Convert.RsAccount(alias.GetAccount().GetId());
	json.aliasName = alias.GetAliasName();
	json.aliasURI = alias.GetAliasURI();
	json.timestamp = alias.GetTimestamp();
	json.alias = Convert.ToUnsignedLong(alias.GetId());
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
	json.account = Convert.ToUnsignedLong(asset.GetAccountId());
	json.accountRS = Convert.RsAccount(asset.GetAccountId());
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

// ugly, hopefully temporary
function Attachment(Attachment) {
	/*
	var json = {};
	var quantityQNT = (Long) json.remove("quantityQNT");
	if (quantityQNT != null) {
		json.put("quantityQNT", String.valueOf(quantityQNT));
	}
	Long priceNQT = (Long) json.remove("priceNQT");
	if (priceNQT != null) {
		json.put("priceNQT", String.valueOf(priceNQT));
	}
	return json;
	*/
	throw new Error('Not implementted');
}

// Order = Order.Bid
function BidOrder(order) {
	var json = Order(order);
	json.type = "bid";
	return json;
}

function Block(block) {
	var json = {};
	json.height = block.GetHeight();
	json.generator = Convert.ToUnsignedLong(block.GetGeneratorId());
	json.generatorRS = Convert.RsAccount(block.GetGeneratorId());
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
	var ids = block.GetTransactionIds();
	for (var i in ids) {
		transactions.push(Convert.ToUnsignedLong(ids[i]));
	}
	json.transactions = transactions;
	return json;
}

function Hallmark(hallmark) {
	var json = {};
	var accountId = Accounts.GetId(hallmark.GetPublicKey());
	json.account = Convert.ToUnsignedLong(accountId);
	json.accountRS = Convert.RsAccount(accountId);
	json.host = hallmark.GetHost();
	json.weight = hallmark.GetWeight();
	var dateString = Hallmark.FormatDate(hallmark.GetDate());
	json.date = dateString;
	json.valid = hallmark.IsValid();
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

function Token(token) {
	var json = {};
	var accountId = Accounts.GetId(token.GetPublicKey());
	json.account = Convert.ToUnsignedLong(accountId);
	json.accountRS = Convert.RsAccount(accountId);
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
	json.recipient = Convert.ToUnsignedLong(transaction.GetRecipientId());
	json.recipientRS = Convert.RsAccount(transaction.GetRecipientId());
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
	if (transaction.GetAttachment() != null) {
		json.attachment = attachment(transaction.GetAttachment());
	}
	json.sender = Convert.ToUnsignedLong(transaction.GetSenderId());
	json.senderRS = Convert.RsAccount(transaction.GetSenderId());
	json.height = transaction.GetHeight();
	return json;
}


exports.AccountBalance = AccountBalance;
exports.Alias = Alias;
exports.AskOrder = AskOrder;
exports.Asset = Asset;
exports.Attachment = Attachment;
exports.BidOrder = BidOrder;
exports.Block = Block;
exports.Hallmark = Hallmark;
exports.Order = Order;
exports.Peer = Peer;
exports.Poll = Poll;
exports.Token = Token;
exports.Trade = Trade;
exports.Transaction = Transaction;
exports.UnconfirmedTransaction = UnconfirmedTransaction;
