/*!
 * LibreMoney Connection 0.2
 * Copyright(c) 2014 LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

if (typeof module !== "undefined") {
	var Constants = require(__dirname + '/../Lib/Constants');
	var Logger = require(__dirname + '/../Lib/Util/Logger').GetLogger(module);
}


function Connection(socket, peer) {
	events.EventEmitter.call(this);
	this.socket = socket;
	this.peer = peer;
	this.buffer = "";
	this.active = false;
	this.inbound = !!socket.server;
	this.SetupHandlers();
}

util.inherits(Connection, events.EventEmitter);

Connection.prototype.Broadcast = function(data) {
	this.SendMessage(Constansts.Commands.Broadcast, data);
}

Connection.prototype.HandleConnect = function() {
	if (!this.inbound) {
		this.SendVersion();
	}
	this.emit("connect", {
		conn: this,
		socket: this.socket,
		peer: this.peer
	});
}

Connection.prototype.HandleData = function(data) {
	this.buffer += data.toString();
	if (this.buffer.indexOf("___|||___") == -1) {
		return;
	}
	var datas = this.buffer.split("___|||___");
	this.buffer = datas[datas.length - 1];
	delete datas[datas.length - 1];
	var self = this;
	datas.forEach(function(_data) {
		var message;
		try {
			message = self.ParseMessage(_data);
		} catch (e) {
			Logger.error("Error while parsing message " + _data + "\n from [" + self.peer + "]\nmessage: " + e.toString());
		}
		if (message) {
			self.peer.uploadBytes += Buffer.byteLength(_data, "utf8");
			self.HandleMessage(message);
		}
	});
}

Connection.prototype.HandleDisconnect = function() {
	this.emit("disconnect", {
		conn: this,
		socket: this.socket,
		peer: this.peer
	})
}

Connection.prototype.HandleError = function(err) {
	if (err.errno == 110 || err.errno == "ETIMEDOUT") {
		Logger.netdbg("Connection timed out for " + this.peer);
	} else if (err.errno == 111 || err.errno == "ECONNREFUSED") {
		Logger.netdbg("Connection refused for " + this.peer);
	} else {
		Logger.warn("Connection with " + this.peer + " " + err.toString());
	}
	this.emit("error", {
		conn: this,
		socket: this.socket,
		peer: this.peer,
		err: err
	});
}

Connection.prototype.HandleMessage = function(message) {
	Logger.netdbg("Handle Message (message command: '" + message.command + "')\n" + this.toString());
	switch (message.command) {
		case Constatants.Commands.Version:
			if (this.inbound) {
				this.sendVersion();
			}
			this.SendMessage(Constants.Commands.Ready);
			break;
		case Constants.Commands.Ready:
			this.active = true;
			break;
	}
	this.emit(message.command, {
		conn: this,
		socket: this.socket,
		peer: this.peer,
		message: message
	});
}

Connection.prototype.ParseMessage = function(message) {
	message = JSON.parse(message);
	var notExist = true;
	for (var command in Constants.Commands) {
		if (Constants.Commands[command] == message.command) {
			notExist = false;
			break;
		}
	}
	if (notExist) {
		Logger.error("Connection.parseMessage(): Command not implemented", {
			cmd: message.command
		});
		return null;
	}
	switch (message.command) {
		case Constants.Commands.Addresses:
			message.addrs = message.data.addrs;
			message.netStatus = message.data.netStatus;
			break;
	}
	return message;
}

Connection.prototype.SendBlock = function(data) {
	this.SendMessage(Constants.Commands.Block, data);
}

Connection.prototype.SendGetAddr = function() {
	this.SendMessage(Constants.Commands.GetAddresses);
}

Connection.prototype.SendGetLastTransaction = function() {
	this.SendMessage(Constants.Commands.GetLastTransaction);
}

Connection.prototype.SendGetNextBlock = function(data) {
	this.SendMessage(Constants.Commands.GetNextBlock, data);
}

Connection.prototype.SendLastTransaction = function(data) {
	this.SendMessage(Constants.Commands.LastTransaction, data);
}

Connection.prototype.SendMessage = function(command, data) {
	try {
		if (typeof data === "undefined") {
			data = null;
		}
		var message = {
			command: command,
			data: data
		};
		Logger.netdbg("[" + this.peer + "] Sending message " + message.command);
		message = JSON.stringify(message) + "___|||___";
		this.peer.downloadBytes += Buffer.byteLength(message, "utf8");
		this.socket.write(message);
	} catch (err) {
		Logger.error("Error while sending message to peer " + this.peer + ": " + (err.stack ? err.stack : err.toString()));
	}
}

Connection.prototype.SendNewTransaction = function(data) {
	this.SendMessage(Constants.Commands.NewTransaction, data);
}

Connection.prototype.SendUnconfirmedTransactions = function(data) {
	this.SendMessage(Constants.Commands.UnconfirmedTransactions, data);
}

Connection.prototype.SendVersion = function() {
	var data = {
		version: 1,
		timestamp: new Date().getTime()
	};
	this.SendMessage(Constants.Commands.Version, data);
}

Connection.prototype.SetupHandlers = function() {
	this.socket.addListener("connect", this.handleConnect.bind(this));
	this.socket.addListener("error", this.handleError.bind(this));
	this.socket.addListener("end", this.handleDisconnect.bind(this));
	this.socket.addListener("data", function(data) {
		var _data = data.toString(),
			DATA_LENGTH_SHOW = 31,
			dataMsg = _data.length > DATA_LENGTH_SHOW ? _data.substring(0, DATA_LENGTH_SHOW) + "..." : _data;
		Logger.netdbg("[" + this.peer + "] " + "Received " + dataMsg + " bytes of data: " + Buffer.byteLength(_data, "utf8"));
		Logger.netdbg(this.toString());
	}.bind(this));
	this.socket.addListener("data", this.handleData.bind(this));
}

Connection.prototype.ToString = function() {
	return "Connection: '" + this.peer.toString() + "',\n" + "inbound(isServer): " + this.inbound
}


if (typeof module !== "undefined") {
	module.exports = Connection;
}
