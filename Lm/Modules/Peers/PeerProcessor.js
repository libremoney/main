/**!
 * LibreMoney PeerProcessor 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

if (typeof module !== "undefined") {
	var Constants = require(__dirname + '/../../Lib/Constants');
	var Logger = require(__dirname + '/../../Lib/Util/Logger').GetLogger(module);
}


var blockSyncBuffer = new Map();
var syncBlockRunning = false;
//var unconfTxsSyncBuffer = new Map();
var syncUnconfTxsRunning = false;
var newTxsSyncBuffer = [];
var newTxsRunning = false;


function PeerProcessor(node) {
	events.EventEmitter.call(this);
	var self = this;
	var client, server;
	this.node = node;
	this.synced = false;
	this.enabled = false;
	this.timer = null;
	this.peers = new Map();
	this.forcePeers = new Map();
	this.connections = new Map();
	this.isConnected = false;
	this.peerDiscovery = true;
	this.interval = 5e3;
	this.minConnections = 8;
	this.MAX_ADDR_COUNT = 1e3;
}

util.inherits(PeerProcessor, events.EventEmitter);

PeerProcessor.prototype.AddConnection = function(socketConn, peer) {
	var conn = new Connection(socketConn, peer);
	this.connections.set(conn.peer.toString(), conn);
	this.node.addConnection(conn);
	conn.AddListener("connect", this.HandleConnect.bind(this));
	conn.AddListener("error", this.HandleError.bind(this));
	conn.AddListener("disconnect", this.HandleDisconnect.bind(this));
	conn.AddListener(Connection.prototype.commands.VERSION, this.HandleVersion.bind(this));
	conn.AddListener(Connection.prototype.commands.READY, this.HandleReady.bind(this));
	conn.AddListener(Connection.prototype.commands.ADDRESSES, this.HandleAddr.bind(this));
	conn.AddListener(Connection.prototype.commands.GET_ADDRESSES, this.HandleGetAddr.bind(this));
	conn.AddListener(Connection.prototype.commands.GET_LAST_TRANSACTION, this.HandleGetLastTransaction.bind(this));
	conn.AddListener(Connection.prototype.commands.LAST_TRANSACTION, this.HandleLastTransaction.bind(this));
	conn.AddListener(Connection.prototype.commands.BLOCK, this.HandleBlock.bind(this));
	conn.AddListener(Connection.prototype.commands.GET_NEXT_BLOCK, this.HandleGetNextBlock.bind(this));
	conn.AddListener(Connection.prototype.commands.NEW_TRANSACTION, this.HandleNewTransaction.bind(this));
	conn.AddListener(Connection.prototype.commands.BROADCAST, this.HandleBroadcast.bind(this));
	conn.AddListener(Connection.prototype.commands.PEER_STATUS, this.HandlePeerStatus.bind(this));
	conn.AddListener(Connection.prototype.commands.UNCONFIRMED_TRANSACTIONS, this.HandleUnconfirmedTransactions.bind(this));
	return conn;
}

PeerProcessor.prototype.AddPeer = function(peer, port) {
	if (peer instanceof Peer) {
		logger.netdbg("Add peer: " + peer.toString());
		var defStatus = Peer.prototype.statuses.DISABLE;
		if (!this.peers.has(peer.toString())) {
			PeersDb.AddReplacePeer(peer);
			this.peers.set(peer.toString(), peer);
		} else if (peer.status != defStatus) {
			var _peer;
			if (this.connections.has(peer.toString()) && (_peer = this.connections.get(peer.toString()).peer).status == defStatus) {
				_peer.status = peer.status;
			}
			if ((_peer = this.peers.get(peer.toString())).status == defStatus) {
				_peer.status = peer.status;
			}
		}
	} else if ("string" == typeof peer) {
		this.AddPeer(new Peer(peer, port));
	} else {
		Logger.log("error", "Node.addPeer(): Invalid value provided for peer", {
			val: peer
		});
		throw "Node.addPeer(): Invalid value provided for peer.";
	}
}

PeerProcessor.prototype.CheckStatus = function() {
	if (this.forcePeers.length) {
		this.forcePeers.map(function(peer, key) {
			if (!this.connections.has(key)) {
				this.ConnectTo(peer);
			}
		}.bind(this));
	}
	var connectablePeers = [];
	this.peers.map(function(peer, key) {
		if (!this.connections.has(key)) {
			connectablePeers.push(peer);
		}
	}.bind(this));
	while (this.connections.length < this.minConnections && connectablePeers.length) {
		var peer = connectablePeers.splice(Math.random() * connectablePeers.length, 1);
		this.connectTo(peer[0]);
	}
}

PeerProcessor.prototype.ClearLostPeers = function() {
	var lostPeers = this.peers.filter(function(peer, key) {
		if (!this.connections.has(key)) {
			peer.ConnectionLost();
		}
		if (peer.IsLost()) {
			Logger.netdbg("Removed peer " + key);
			return true;
		}
		return false;
	}.bind(this));
	if (lostPeers.length) {
		this.peers.deleteEach(lostPeers.keys());
	}
}

PeerProcessor.prototype.ConnectTo = function(peer) {
	Logger.netdbg("Connecting to peer " + peer);
	try {
		return this.AddConnection(peer.getConnection(), peer);
	} catch (e) {
		Logger.error("Error creating connection", e);
		return null;
	}
}

PeerProcessor.prototype.GetActiveConnections = function() {
	return this.connections;
}

PeerProcessor.prototype.GetActivePeersArr = function() {
	var activePeers = [];
	this.connections.map(function(connection, key) {
		activePeers.push(connection.peer);
	}.bind(this));
	return activePeers;
}

PeerProcessor.prototype.HandleAddr = function(e) {
	if (!this.peerDiscovery) {
		return;
	}
	Logger.netdbg("Handle Addr\n" + e.conn.toString());
	if (typeof e.message.addrs !== "undefined") {
		var peer, defStatus = Peer.prototype.statuses.DISABLE;
		e.peer.status = e.message.netStatus || defStatus;
		e.message.addrs.forEach(function(addr) {
			try {
				peer = new Peer(addr.ip, addr.port, addr.services);
				peer.status = addr.status || defStatus;
				this.AddPeer(peer);
			} catch (e) {
				Logger.warn("Invalid addr received: " + e.message);
			}
		}.bind(this));
		if (e.message.addrs.length < 1e3) {
			e.conn.getaddr = false;
		}
	}
}

PeerProcessor.prototype.HandleBlock = function(e) {
	var self = this;
	Logger.netdbg("Handle Block\n", e.conn.toString());
	var blockData = e.message.data;
	var tyransactionsArr = e.message.data.blockTransactions;
	txArr = {
		count: 0
	};
	tyransactionsArr.forEach(function(transactionData) {
		var tx = new Transaction(transactionData);
		txArr[tx.getId().toString()] = tx;
		txArr.count += 1;
	});
	blockData.blockTransactions = txArr;
	var block = new Block(blockData);
	var broadcasted = false;
	if (typeof e.message.data.broadcasted !== "undefined" && e.message.data.broadcasted) {
		broadcasted = true
	}
	blockSyncBuffer.set(blockData.id.toString(), {
		block: block,
		conn: e.conn,
		broadcasted: broadcasted
	});
	this.ProcessSyncBlock();
}

PeerProcessor.prototype.HandleBroadcast = function(e) {
	Logger.netdbg("Handle Broadcast\n", e.conn.toString());
}

PeerProcessor.prototype.HandleConnect = function(e) {
	Logger.netdbg("Handle Connect\n" + e.conn.toString());
	this.AddPeer(e.peer);
}

PeerProcessor.prototype.HandleDisconnect = function(e) {
	Logger.netdbg("Handle Disconnect\n" + e.conn.toString());
	Logger.netdbg("Disconnected from peer " + e.peer);
	var key = e.peer.toString();
	if (this.connections.has(key)) {
		this.connections.delete(key);
	}
	if (this.peers.has(key)) {
		this.peers.get(key).ConnectionLost();
	}
	e.peer.connectionLost();
	if (!this.connections.length) {
		this.emit("netDisconnected");
		this.isConnected = false;
	}
}

PeerProcessor.prototype.HandleError = function(e) {
	Logger.netdbg("Handle Error\n" + e.conn.toString());
	this.HandleDisconnect.apply(this, [].slice.call(arguments));
}

PeerProcessor.prototype.HandleGetAddr = function(e) {
	Logger.netdbg("Handle GetAddr\n", e.conn.toString());
	var addressesCount = this.peers.length;
	if (addressesCount > this.MAX_ADDR_COUNT) {
		addressesCount = this.MAX_ADDR_COUNT
	}
	var peers = this.peers.values();
	var addrs = [],
		connection = null,
		status, defStatus = Peer.prototype.statuses.DISABLE;
	for (var i = 0; i < addressesCount; i++) {
		if (e.peer.host === peers[i].host) {
			continue
		}
		connection = this.connections.get(peers[i].toString());
		status = defStatus;
		if (typeof connection !== "undefined") {
			status = connection.peer.status
		}
		addrs.push({
			services: peers[i].services,
			ip: peers[i].host,
			port: peers[i].port,
			status: status
		})
	}
	e.conn.SendMessage(Connection.prototype.commands.ADDRESSES, {
		addrs: addrs,
		netStatus: this.node.netStatus
	})
}

PeerProcessor.prototype.HandleGetLastTransaction = function(e) {
	Logger.netdbg("Handle Get Last Transaction \n", e.conn.toString());
	var blockchain = new Blockchain();
	e.conn.SendLastTransaction(blockchain.GetLastTransaction().GetData());
}

PeerProcessor.prototype.HandleGetNextBlock = function(e) {
	Logger.netdbg("Handle Get Next Block \n", e.conn.toString());
	var height = e.message.data || null;
	var blockchain = new Blockchain();
	if (parseInt(height) > blockchain.GetLastBlock().height) {
		UnconfirmedTransactions.GetAllTransactionsList(function(unconfTxsData) {
			e.conn.SendUnconfirmedTransactions(unconfTxsData);
		})
	} else if (height) {
		BlockDb.FindBlockIdAtHeight(height, function(block) {
			if (block) {
				Logger.transdbg("Send block at heifght - " + e.height);
				e.conn.SendBlock(block.getDataWithTransactions());
			} else {
				Logger.warn("No block at heifght - " + e.height);
			}
		});
	} else {
		e.conn.SendBlock({});
	}
}

PeerProcessor.prototype.HandleLastTransaction = function(e) {
	Logger.netdbg("Handle Last Transaction \n", e.conn.toString());
	if (!e.message.data) {
		Logger.error('Error: no data for "handleLastTransaction"');
		return;
	}
	var blockchain = new Blockchain();
	var transaction = new Transaction(e.message.data);
	var result = blockchain.GetLastTransaction().CompareTo(transaction);
	var nextHeight = blockchain.GetLastBlock().height + 1;
	e.conn.SendGetNextBlock(nextHeight);
}

PeerProcessor.prototype.HandleNewTransaction = function(e) {
	var transactionData = e.message.data || null;
	Logger.netdbg("Handle New Transaction \n", e.conn.toString());
	if (!transactionData) {
		return;
	}
	newTxsSyncBuffer.push(transactionData);
	this.ProcessNewTransaction();
}

PeerProcessor.prototype.HandlePeerStatus = function(e) {
	Logger.netdbg("Handle Peer Status\n", e.conn.toString());
	e.peer.status = e.message.data.status || Peer.prototype.statuses.DISABLE;
}

PeerProcessor.prototype.HandleReady = function(e) {
	Logger.netdbg("Handle Ready\n" + e.conn.toString());
	this.AddPeer(e.peer);
	this.emit("connect", {
		pm: this,
		conn: e.conn,
		socket: e.socket,
		peer: e.peer
	});
	if (this.isConnected == false) {
		this.emit("netConnected");
		this.isConnected = true
	}
}

PeerProcessor.prototype.HandleUnconfirmedTransactions = function(e) {
	var self = this;
	Logger.netdbg("Handle Unconfirmed Transactions\n", e.conn.toString());
	var unconfTxsData = e.message.data || null;
	if (syncUnconfTxsRunning) {
		return;
	}
	syncUnconfTxsRunning = true;
	if (unconfTxsData.length) {
		async.eachSeries(unconfTxsData, function(txData, callback) {
			UnconfirmedTransactions.HasTransaction(txData.id, function(exist) {
				if (!exist) {
					var transaction = new Transaction(txData);
					var transactionProcessor = new TransactionProcessor();
					transactionProcessor.VerifiyTransaction(transaction, unconfTxsData, function(err) {
						if (err) {
							Logger.warn(err);
							callback(err);
						} else {
							transactionProcessor.AddTransactionOrConfirmation(transaction, true);
							callback();
						}
					});
				}
			});
		}, function(err) {
			if (err) {
				Logger.error("ERROR PeerProcessor.prototype.handleUnconfirmedTransactions " + err);
				syncUnconfTxsRunning = false;
			} else {
				syncUnconfTxsRunning = false;
				self.synced = true;
				self.node.SetState("synced");
				self.node.BroadcastPeerStatus(Peer.prototype.statuses.SYNCED);
			}
		})
	} else {
		this.synced = true;
		self.node.SetState("synced");
		this.node.BroadcastPeerStatus(Peer.prototype.statuses.SYNCED);
	}
}

PeerProcessor.prototype.HandleVersion = function(e) {
	Logger.netdbg("Handle Version\n" + e.conn.toString());
	if (!e.conn.inbound) {
		this.AddPeer(e.peer);
	}
	if (this.peerDiscovery) {
		e.conn.SendGetAddr();
		e.conn.getaddr = true;
	}
}

PeerProcessor.prototype.PingStatus = function() {
	if (!this.enabled) {
		return;
	}
	this.CheckStatus();
	this.clearLostPeers();
	this.timer = setTimeout(this.PingStatus.bind(this), this.interval);
}

PeerProcessor.prototype.ProcessNewTransaction = function() {
	if (newTxsRunning) {
		return;
	}
	newTxsRunning = true;
	async.eachSeries(newTxsSyncBuffer, function(transactionData, callback) {
		var transaction = new Transaction(transactionData);
		var transactionProcessor = new TransactionProcessor();
		transactionProcessor.VerifiyTransaction(transaction, function(err) {
			if (err) {
				Logger.warn(err);
				callback();
			} else {
				transactionProcessor.AddTransactionOrConfirmation(transaction, false);
				callback();
			}
		})
	}, function(err) {
		newTxsRunning = false;
		newTxsSyncBuffer = [];
	});
}

PeerProcessor.prototype.ProcessSyncBlock = function() {
	var self = this;
	if (syncBlockRunning) {
		return;
	}
	syncBlockRunning = true;
	var blockSyncBufferArr = blockSyncBuffer.toArray();
	async.eachSeries(blockSyncBufferArr, function(data, callback) {
		var conn = data.conn;
		var block = data.block;
		var broadcasted = data.broadcasted;
		blockSyncBuffer.delete(block.id.toString());
		BlockDb.HasBlock(block.id.toString(), function(exist) {
			if (!exist) {
				BlockchainProcessor.PushBlock(block, function() {
					Logger.warn("block pushed OK id:" + block.id.toString());
					BlockDb.SetNextBlockId(block.previousBlockId.toString(), block.GetId().toString(), function() {
						block.confirmations = block.confirmations + 1;
						BlockchainProcessor.AddBlock(block, false, function() {
							Logger.warn("Block saved OK id:" + block.id.toString());
							if (!broadcasted) {
								block.AddUnconfirmedAmounts();
								conn.SendGetLastTransaction();
							}
							callback();
						})
					})
				})
			} else {
				Logger.info("Block exist, continue on height: " + block.height);
				BlockDb.AddConfirmation(block.id.toString(), function() {
					callback();
				});
			}
		});
	}, function(err, callback) {
		if (err) {
			Logger.error(err);
		}
		syncBlockRunning = false;
	});
}

PeerProcessor.prototype.Run = function() {
	this.enabled = true;
	var initialPeers = Constants.starPeers;
	var forcePeers = Constants.starPeers;
	initialPeers.forEach(function(peer) {
		if ("string" !== typeof peer) {
			throw new Error("PeerManager.enable(): Invalid Configuration for initial" + "peers.");
		}
		this.AddPeer(peer);
	}.bind(this));
	forcePeers.forEach(function(peer) {
		if ("string" !== typeof peer) {
			throw new Error("PeerManager.enable(): Invalid Configuration for initial" + "peers.")
		}
		var _peer = new Peer(peer);
		this.ForcePeers.set(_peer.toString(), _peer);
	}.bind(this));
	this.server = net.createServer(function(socketConn) {
		try {
			var peer = new Peer(socketConn.remoteAddress, Config.peerPort);
			this.AddConnection(socketConn, peer);
		} catch (e) {
			Logger.error("Add peer errror: " + JSON.stringify(e));
		}
	}.bind(this));
	Logger.netdbg("this.server.listen on port: " + Config.peerPort);
	this.server.listen(Config.peerPort);
	if (!this.timer) {
		this.PingStatus();
	}
}

PeerProcessor.prototype.SendTransaction = function(trans) {
	if (this.forcePeers.length) {
		var connectionCount = 0;
		var connection = null;
		this.forcePeers.map(function(peer, key) {
			if (this.connections.has(key)) {
				connection = this.connections.get(key);
				connection.SendNewTransaction();
				connectionCount++;
			}
		}.bind(this));
		if (connectionCount === 0) {
			Logger.netdbg("Error: no connection to force peers.");
		}
	} else {
		Logger.netdbg("Error: forcePeers is empty.");
	}
}

PeerProcessor.prototype.SyncTransaction = function() {
	if (this.forcePeers.length) {
		var connectionCount = 0;
		var connection = null;
		this.forcePeers.some(function(peer, key) {
			if (this.connections.has(key)) {
				connection = this.connections.get(key);
				connection.sendGetLastTransaction();
				connectionCount++;
			}
		}.bind(this));
		if (connectionCount === 0) {
			Logger.netdbg("Error: no connection to force peers.");
		}
	} else {
		Logger.netdbg("Error: forcePeers is empty.");
	}
}


if (typeof module !== "undefined") {
	module.exports = PeerProcessor;
}
