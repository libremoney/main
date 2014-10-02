/*!
 * LibreMoney BlockGenerator 0.2
 * Copyright(c) 2014 LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

if (typeof module !== "undefined") {
	var events = require('events');
	var util = require('util');
	var Constants = require(__dirname + '/../../Lib/Constants');
	var Logger = require(__dirname + '/../../Lib/Util/Logger').GetLogger(module);
}


var BlockGenerator = function BlockGenerator(node) {
	events.EventEmitter.call(this);
	this.node = node;
	this.timestamp = null;
	this.running = false;
	this.whoSayGenBlock = null;
	this.selectedPeer = null;
	this.collectedPeerResponse = new Map();
	this.verifiedPeerResponse = null;
}

util.inherits(BlockGenerator, events.EventEmitter);

BlockGenerator.prototype.AddConnection = function(conn) {
	conn.AddListener(Constants.Commands.BroadcastGenerateBlock, this.HandleBroadcastGenerateBlock.bind(this));
	conn.AddListener(Constants.Commands.StopGenerateBlock, this.HandleStopGenerateBlock.bind(this));
	conn.AddListener(Constants.Commands.NewBlock, this.HandleNewBlock.bind(this));
	conn.AddListener(Constants.Commands.AnswerOnGenerateBlock, this.HandleAnswerOnGenerateBlock.bind(this));
	conn.AddListener(Constants.Commands.VerifiedPeer, this.HandleVerifiedPeer.bind(this));
	conn.AddListener(Constants.Commands.VerifiedPeerResponse, this.HandleVerifiedPeerResponse.bind(this));
	conn.AddListener(Constants.Commands.PeerNotVerified, this.HandlePeerNotVerified.bind(this));
}

BlockGenerator.prototype.BroadcastGenerateBlock = function() {
	if (this.whoSayGenBlock !== null) {
		Logger.notice("Already generate block: " + this.whoSayGenBlock);
		return;
	}
	if (this.running) {
		Logger.notice("BlockGenerator already running.");
		return;
	}
	this.Flag("start");
	this.node.Broadcast({
		timestamp: this.timestamp
	}, Constants.Commands.BroadcastGenerateBlock);
	this.InitCheckPeers();
}

BlockGenerator.prototype.BroadcastSendBlock = function(block) {
	if (block instanceof Block) {
		this.node.broadcast({
			block: block.getData()
		}, Constants.Commands.NewBlock);
	} else {
		Logger.error("'block' must be instance of 'models/Block'");
	}
}

BlockGenerator.prototype.ComparePeers = function(oldPeer, newPeer) {
	if (oldPeer === null) {
		return true;
	}
	var now = new Date().getTime(),
		oldDiff = now - oldPeer.timestamp,
		newDiff = now - newPeer.timestamp;
	if (oldDiff > newDiff) {
		return false;
	}
	var oldPeerResponse = this.collectedPeerResponse.get(oldPeer.toString()),
		newPeerResponse = this.collectedPeerResponse.get(newPeer.toString());
	return oldPeerResponse.account.transactionsCount < newPeerResponse.account.transactionsCount
}

BlockGenerator.prototype.CreateResponse = function(e) {
	var accountId = Accounts.currentAccount.accountId,
		data = {
			accountId: accountId
		};
	Step(function getMyTransactions() {
		TransactionDb.GetMyTransactions(accountId, this);
	}, function receiveTransactions(transactions) {
		data["transactionsCount"] = transactions.length;
		this(null);
	}, function sendMessage() {
		e.conn.SendMessage(Constants.Commands.AnswerOnGenerateBlock, data);
	});
}

BlockGenerator.prototype.Flag = function(action) {
	switch (action) {
		case "start":
			this.timestamp = new Date().getTime();
			this.running = true;
			break;
		case "done":
		case "error":
			this.whoSayGenBlock = null;
			this.selectedPeer = null;
		case "stop":
			this.timestamp = null;
			this.running = false;
			break;
	}
}

BlockGenerator.prototype.GenerateBlock = function() {
	return new Block({
		id: 1
	});
}

BlockGenerator.prototype.HandleAnswerOnGenerateBlock = function(e) {
	Logger.netdbg("Handle Answer On Generate Block\n" + e.conn.toString());
	if (!this.running) {
		Logger.notice("Whe are not running");
		return;
	}
	this.collectedPeerResponse.set(e.peer.toString(), {
		peer: e.peer,
		account: e.message.data
	});
}

BlockGenerator.prototype.HandleBroadcastGenerateBlock = function(e) {
	Logger.netdbg("Handle Broadcast Generate Block\n" + e.conn.toString());
	if (this.running) {
		if (this.timestamp < e.message.data.timestamp) {
			e.conn.SendMessage(Constants.Commands.StopGenerateBlock, {
				message: "My query generation was earlier in time."
			});
			return;
		} else {
			this.StopNotice("Execution time is more than requesting " + e.peer.toString());
			this.Flag("stop");
		}
	}
	if (this.whoSayGenBlock !== null) {
		e.conn.SendMessage(Constants.Commands.StopGenerateBlock, {
			message: "Already generate by " + this.whoSayGenBlock
		});
		return;
	}
	this.whoSayGenBlock = e.peer.toString();
	this.CreateResponse(e);
}

BlockGenerator.prototype.HandleNewBlock = function(e) {
	Logger.netdbg("Handle New Block\n" + e.conn.toString());
	var conn = this.node.peerProcessor.connections.get(this.whoSayGenBlock);
	if (conn) {
		conn.SendMessage(Constants.Commands.StopGenerateBlock, {
			message: "Work done!!!",
			fullStop: true
		})
	} else {
		this.node.broadcast({
			message: "Work done!!!",
			fullStop: true
		}, Constants.Commands.StopGenerateBlock);
	}
}

BlockGenerator.prototype.HandlePeerNotVerified = function(e) {
	Logger.netdbg("Handle NPeerNotVerified\n" + e.conn.toString());
	Logger.error(e.message.data.message);
	this.Flag("error");
}

BlockGenerator.prototype.HandleStopGenerateBlock = function(e) {
	Logger.netdbg("Handle Stop Generate Block\n" + e.conn.toString());
	this.StopNotice(e.message.data.message);
	this.Flag(e.message.data.fullStop ? "done" : "stop");
}

BlockGenerator.prototype.HandleVerifiedPeer = function(e) {
	Logger.netdbg("Handle Verified Peer\n" + e.conn.toString());
	var data = e.message.data;
	if (typeof data.broadcastSelectPeer !== "undefined" && data.broadcastSelectPeer) {
		this.verifiedPeerResponse = new Map();
		setTimeout(this.verifiedPeer.bind(this), 3e4);
	} else {
		var peer = new Peer(data.peer);
		var connection = this.node.peerProcessor.connections.get(peer.toString());
		if (!connection) {
			this.node.broadcast({
				message: "Work done!!!",
				fullStop: true
			}, Constants.Commands.StopGenerateBlock);
			this.flag("done");
			return;
		}
		this.selectedPeer = peer.toString();
		this.ValidatePeer({
			peer: peer,
			account: data.account
		}, function(result) {
			connection.SendMessage(Constants.Commands.VerifiedPeerResponse, {
				valid: result.valid
			});
		});
	}
}

BlockGenerator.prototype.HandleVerifiedPeerResponse = function(e) {
	Logger.netdbg("Handle Verified Peer Response\n" + e.conn.toString());
	this.verifiedPeerResponse.set(e.peer.toString(), e.message.data);
}

BlockGenerator.prototype.Init = function() {
}

BlockGenerator.prototype.InitCheckPeers = function() {
	setTimeout(this.selectPeer.bind(this), 3e4);
}

BlockGenerator.prototype.SelectPeer = function() {
	if (!this.running) {
		Logger.notice("Whe are not running");
		return;
	}
	var peerProc = this.node.peerProcessor;
	var filtered = peerProc.connections.filter(function(conn, key) {
		return conn.peer.status === Constants.NetStatuses.Active && this.collectedPeerResponse.has(key)
	}.bind(this));
	var self = this;
	async.eachSeries(filtered.toArray(), function(conn, _callback) {
		var key = conn.peer.toString(),
			peerResponse = self.collectedPeerResponse.get(key);
		self.validatePeer(peerResponse, function(data) {
			self.collectedPeerResponse.set(key, data);
			_callback()
		})
	}, function(err) {
		if (err) {
			Logger.error("No select peer!!!");
			self.node.broadcast({
				message: "No select peer!!!",
				fullStop: true
			}, Constants.Commands.StopGenerateBlock);
			return;
		}
		var curPeer = null,
			currPeerAccount = null;
		filtered.forEach(function(conn, key) {
			var peerResponse = self.collectedPeerResponse.get(key);
			if (curPeer === null || peerResponse.valid && self.comparePeers(curPeer, peerResponse.peer)) {
				curPeer = peerResponse.peer;
				currPeerAccount = peerResponse.account
			}
		});
		if (curPeer) {
			self.selectedPeer = curPeer;
			self.node.broadcast({
				peer: curPeer.getData(),
				account: currPeerAccount
			}, Constants.Commands.VerifiedPeer, {
				peerKey: curPeer.toString()
			})
		} else {
			logger.error("No select peer!!!");
			self.node.broadcast({
				message: "No select peer!!!",
				fullStop: true
			}, Constants.Commands.StopGenerateBlock)
		}
	});
}

BlockGenerator.prototype.StopNotice = function(message) {
	Logger.notice("Generating unit is stopped due to: " + message);
}

BlockGenerator.prototype.ValidatePeer = function(data, callback) {
	var peer = data.peer,
		account = data.account;
	var _data = {};
	Step(function getMyTransactions() {
		TransactionDb.GetMyTransactions(account.accountId, this);
	}, function receiveTransactions(transactions) {
		_data = data;
		_data["valid"] = account.transactionsCount === transactions.length;
		callback(_data);
	});
}

BlockGenerator.prototype.VerifiedPeer = function() {
	var approved = 0,
		notApproved = 0,
		countPeerVerified = this.verifiedPeerResponse.length;
	this.verifiedPeerResponse.forEach(function(data, key) {
		if (data.valid) {
			approved++;
		} else {
			notApproved++;
		}
	});
	if (approved * 100 / countPeerVerified > 50) {
		this.BroadcastSendBlock(this.generateBlock());
	} else {
		this.node.broadcast({
			message: "Approved less then 50%",
			notValid: true
		}, Constants.Commands.PeerNotVerified);
	}
}


if (typeof module !== "undefined") {
	module.exports = new BlockGenerator();
}
