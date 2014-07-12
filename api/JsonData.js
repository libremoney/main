/*
import nxt.Account;
import nxt.Alias;
import nxt.Asset;
import nxt.Attachment;
import nxt.Block;
import nxt.Nxt;
import nxt.Order;
import nxt.Poll;
import nxt.Token;
import nxt.Trade;
import nxt.Transaction;
import nxt.crypto.Crypto;
import nxt.peer.Hallmark;
import nxt.peer.Peer;
import nxt.util.Convert;
*/

function Alias(Alias) {
	throw new Error('Not implementted');
	/*
	JSONObject json = new JSONObject();
	json.put("account", Convert.toUnsignedLong(alias.getAccount().getId()));
	json.put("accountRS", Convert.rsAccount(alias.getAccount().getId()));
	json.put("aliasName", alias.getAliasName());
	json.put("aliasURI", alias.getAliasURI());
	json.put("timestamp", alias.getTimestamp());
	json.put("alias", Convert.toUnsignedLong(alias.getId()));
	return json;
	*/
}

function AccountBalance(Account) {
	throw new Error('Not implementted');
	/*
	JSONObject json = new JSONObject();
	if (account == null) {
		json.put("balanceNQT", "0");
		json.put("unconfirmedBalanceNQT", "0");
		json.put("effectiveBalanceNXT", "0");
		json.put("forgedBalanceNQT", "0");
		json.put("guaranteedBalanceNQT", "0");
	} else {
		synchronized (account) { // to make sure balance and unconfirmedBalance are consistent
			json.put("balanceNQT", String.valueOf(account.getBalanceNQT()));
			json.put("unconfirmedBalanceNQT", String.valueOf(account.getUnconfirmedBalanceNQT()));
			json.put("effectiveBalanceNXT", account.getEffectiveBalanceNXT());
			json.put("forgedBalanceNQT", String.valueOf(account.getForgedBalanceNQT()));
			json.put("guaranteedBalanceNQT", String.valueOf(account.getGuaranteedBalanceNQT(1440)));
		}
	}
	return json;
	*/
}

function Asset(Asset) {
	throw new Error('Not implementted');
	/*
	JSONObject json = new JSONObject();
	json.put("account", Convert.toUnsignedLong(asset.getAccountId()));
	json.put("accountRS", Convert.rsAccount(asset.getAccountId()));
	json.put("name", asset.getName());
	json.put("description", asset.getDescription());
	json.put("decimals", asset.getDecimals());
	json.put("quantityQNT", String.valueOf(asset.getQuantityQNT()));
	json.put("asset", Convert.toUnsignedLong(asset.getId()));
	json.put("numberOfTrades", Trade.getTrades(asset.getId()).size());
	return json;
	*/
}

// Order = Order.Ask
function AskOrder(Order) {
	throw new Error('Not implementted');
	/*
	JSONObject json = order(order);
	json.put("type", "ask");
	return json;
	*/
}

// Order = Order.Bid
function BidOrder(Order) {
	throw new Error('Not implementted');
	/*
	JSONObject json = order(order);
	json.put("type", "bid");
	return json;
	*/
}

function Order(Order) {
	throw new Error('Not implementted');
	/*
	JSONObject json = new JSONObject();
	json.put("order", Convert.toUnsignedLong(order.getId()));
	json.put("asset", Convert.toUnsignedLong(order.getAssetId()));
	json.put("account", Convert.toUnsignedLong(order.getAccount().getId()));
	json.put("accountRS", Convert.rsAccount(order.getAccount().getId()));
	json.put("quantityQNT", String.valueOf(order.getQuantityQNT()));
	json.put("priceNQT", String.valueOf(order.getPriceNQT()));
	json.put("height", order.getHeight());
	return json;
	*/
}

function Block(Block) {
	throw new Error('Not implementted');
	/*
	JSONObject json = new JSONObject();
	json.put("height", block.getHeight());
	json.put("generator", Convert.toUnsignedLong(block.getGeneratorId()));
	json.put("generatorRS", Convert.rsAccount(block.getGeneratorId()));
	json.put("timestamp", block.getTimestamp());
	json.put("numberOfTransactions", block.getTransactionIds().size());
	json.put("totalAmountNQT", String.valueOf(block.getTotalAmountNQT()));
	json.put("totalFeeNQT", String.valueOf(block.getTotalFeeNQT()));
	json.put("payloadLength", block.getPayloadLength());
	json.put("version", block.getVersion());
	json.put("baseTarget", Convert.toUnsignedLong(block.getBaseTarget()));
	if (block.getPreviousBlockId() != null) {
		json.put("previousBlock", Convert.toUnsignedLong(block.getPreviousBlockId()));
	}
	if (block.getNextBlockId() != null) {
		json.put("nextBlock", Convert.toUnsignedLong(block.getNextBlockId()));
	}
	json.put("payloadHash", Convert.toHexString(block.getPayloadHash()));
	json.put("generationSignature", Convert.toHexString(block.getGenerationSignature()));
	if (block.getVersion() > 1) {
		json.put("previousBlockHash", Convert.toHexString(block.getPreviousBlockHash()));
	}
	json.put("blockSignature", Convert.toHexString(block.getBlockSignature()));
	JSONArray transactions = new JSONArray();
	for (Long transactionId : block.getTransactionIds()) {
		transactions.add(Convert.toUnsignedLong(transactionId));
	}
	json.put("transactions", transactions);
	return json;
	*/
}

function Hallmark(Hallmark) {
	throw new Error('Not implementted');
	/*
	JSONObject json = new JSONObject();
	Long accountId = Account.getId(hallmark.getPublicKey());
	json.put("account", Convert.toUnsignedLong(accountId));
	json.put("accountRS", Convert.rsAccount(accountId));
	json.put("host", hallmark.getHost());
	json.put("weight", hallmark.getWeight());
	String dateString = Hallmark.formatDate(hallmark.getDate());
	json.put("date", dateString);
	json.put("valid", hallmark.isValid());
	return json;
	*/
}

function Token(Token) {
	throw new Error('Not implementted');
	/*
	JSONObject json = new JSONObject();
	Long accountId = Account.getId(token.getPublicKey());
	json.put("account", Convert.toUnsignedLong(accountId));
	json.put("accountRS", Convert.rsAccount(accountId));
	json.put("timestamp", token.getTimestamp());
	json.put("valid", token.isValid());
	return json;
	*/
}

function Peer(Peer) {
	throw new Error('Not implementted');
	/*
	JSONObject json = new JSONObject();
	json.put("state", peer.getState().ordinal());
	json.put("announcedAddress", peer.getAnnouncedAddress());
	json.put("shareAddress", peer.shareAddress());
	if (peer.getHallmark() != null) {
		json.put("hallmark", peer.getHallmark().getHallmarkString());
	}
	json.put("weight", peer.getWeight());
	json.put("downloadedVolume", peer.getDownloadedVolume());
	json.put("uploadedVolume", peer.getUploadedVolume());
	json.put("application", peer.getApplication());
	json.put("version", peer.getVersion());
	json.put("platform", peer.getPlatform());
	json.put("blacklisted", peer.isBlacklisted());
	return json;
	*/
}

function Poll(Poll) {
	throw new Error('Not implementted');
	/*
	JSONObject json = new JSONObject();
	json.put("name", poll.getName());
	json.put("description", poll.getDescription());
	JSONArray options = new JSONArray();
	Collections.addAll(options, poll.getOptions());
	json.put("options", options);
	json.put("minNumberOfOptions", poll.getMinNumberOfOptions());
	json.put("maxNumberOfOptions", poll.getMaxNumberOfOptions());
	json.put("optionsAreBinary", poll.isOptionsAreBinary());
	JSONArray voters = new JSONArray();
	for (Long voterId : poll.getVoters().keySet()) {
		voters.add(Convert.toUnsignedLong(voterId));
	}
	json.put("voters", voters);
	return json;
	*/
}

function Trade(Trade) {
	throw new Error('Not implementted');
	/*
	JSONObject json = new JSONObject();
	json.put("timestamp", trade.getTimestamp());
	json.put("quantityQNT", String.valueOf(trade.getQuantityQNT()));
	json.put("priceNQT", String.valueOf(trade.getPriceNQT()));
	json.put("asset", Convert.toUnsignedLong(trade.getAssetId()));
	json.put("askOrder", Convert.toUnsignedLong(trade.getAskOrderId()));
	json.put("bidOrder", Convert.toUnsignedLong(trade.getBidOrderId()));
	json.put("block", Convert.toUnsignedLong(trade.getBlockId()));
	return json;
	*/
}

function UnconfirmedTransaction(Transaction) {
	var obj = {};
	obj.type = 0; //transaction.getType().getType();
	obj.subtype = 0; //transaction.getType().getSubtype();
	obj.timestamp = 0; //transaction.getTimestamp();
	obj.deadline = 0; //transaction.getDeadline();
	obj.senderPublicKey = 0; //Convert.toHexString(transaction.getSenderPublicKey());
	obj.recipient = 0; //Convert.toUnsignedLong(transaction.getRecipientId());
	obj.recipientRS = 0; //Convert.rsAccount(transaction.getRecipientId());
	obj.amountNQT = 0; //String.valueOf(transaction.getAmountNQT());
	obj.feeNQT = 0; //String.valueOf(transaction.getFeeNQT());
	obj.referencedTransactionFullHash = 0; //transaction.getReferencedTransactionFullHash());
	obj.signature = ''; //Convert.toHexString(signature));
	obj.signatureHash = ''; //Convert.toHexString(Crypto.sha256().digest(signature)));
	obj.fullHash = 0; //transaction.getFullHash());
	obj.transaction = 0; //transaction.getStringId());
	obj.attachment = 0; //attachment(transaction.getAttachment()));
	obj.sender = 0; //Convert.toUnsignedLong(transaction.getSenderId()));
	obj.senderRS = 0; //Convert.rsAccount(transaction.getSenderId()));
	obj.height = 0; //transaction.getHeight());
	return obj;
	/*
	if (transaction.getReferencedTransactionFullHash() != null) {
		json.put("referencedTransactionFullHash", transaction.getReferencedTransactionFullHash());
	}
	byte[] signature = Convert.emptyToNull(transaction.getSignature());
	if (signature != null) {
		json.put("signature", Convert.toHexString(signature));
		json.put("signatureHash", Convert.toHexString(Crypto.sha256().digest(signature)));
		json.put("fullHash", transaction.getFullHash());
		json.put("transaction", transaction.getStringId());
	}
	if (transaction.getAttachment() != null) {
		json.put("attachment", attachment(transaction.getAttachment()));
	}
	json.put("sender", Convert.toUnsignedLong(transaction.getSenderId()));
	json.put("senderRS", Convert.rsAccount(transaction.getSenderId()));
	json.put("height", transaction.getHeight());
	return json;
	*/
}

function Transaction(Transaction) {
	var obj = UnconfirmedTransaction(Transaction);
	obj.block = 1; //Convert.toUnsignedLong(transaction.getBlockId());
	obj.confirmations = 0; //Nxt.getBlockchain().getLastBlock().getHeight() - transaction.getHeight();
	obj.blockTimestamp = 0; //transaction.getBlockTimestamp();
	return obj;
}

// ugly, hopefully temporary
function Attachment(Attachment) {
	throw new Error('Not implementted');
	/*
	JSONObject json = attachment.getJSONObject();
	Long quantityQNT = (Long) json.remove("quantityQNT");
	if (quantityQNT != null) {
		json.put("quantityQNT", String.valueOf(quantityQNT));
	}
	Long priceNQT = (Long) json.remove("priceNQT");
	if (priceNQT != null) {
		json.put("priceNQT", String.valueOf(priceNQT));
	}
	return json;
	*/
}


exports.Alias = Alias;
exports.AccountBalance = AccountBalance;
exports.Asset = Asset;
exports.AskOrder = AskOrder;
exports.BidOrder = BidOrder;
exports.Order = Order;
exports.Block = Block;
exports.Hallmark = Hallmark;
exports.Token = Token;
exports.Peer = Peer;
exports.Poll = Poll;
exports.Trade = Trade;
exports.UnconfirmedTransaction = UnconfirmedTransaction;
exports.Transaction = Transaction;
exports.Attachment = Attachment;
