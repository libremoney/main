/**!
 * LibreMoney 0.0
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
	var obj = Transactions.CreateAttachment(orderId);

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

	obj.GetBytes = GetBytes;
	obj.GetJsonObject = GetJsonObject;
	obj.GetOrderId = GetOrderId;
	obj.GetSize = GetSize;
	return obj;
}



module.exports = ColoredCoinsOrderCancellation;
