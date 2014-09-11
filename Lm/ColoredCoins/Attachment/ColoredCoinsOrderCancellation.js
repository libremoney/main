/**!
 * LibreMoney 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

//var LmAttachment = require(__dirname + '/LmAttachment');
var Constants = require(__dirname + '/../Constants');
var Convert = require(__dirname + '/../Convert');
var Transactions = require(__dirname + '/../Transactions');


//static final long serialVersionUID = 0;

function ColoredCoinsOrderCancellation(orderId) {
	//obj.orderId;
	this.prototype = Transactions.CreateAttachment(orderId);

	function GetBytes() {
		res.send('This is not implemented');
		/*
		ByteBuffer buffer = ByteBuffer.allocate(getSize());
		buffer.order(ByteOrder.LITTLE_ENDIAN);
		buffer.putLong(Convert.nullToZero(orderId));
		return buffer.array();
		*/
	}

	function GetJsonObject() {
		var attachment = {};
		attachment.order = Convert.ToUnsignedLong(this.orderId);
		return attachment;
	}

	function GetOrderId() {
		return orderId;
	}

	function GetSize() {
		return 8;
	}

	this.GetBytes = GetBytes;
	this.GetJsonObject = GetJsonObject;
	this.GetOrderId = GetOrderId;
	this.GetSize = GetSize;
	return this;
}


module.exports = ColoredCoinsOrderCancellation;
