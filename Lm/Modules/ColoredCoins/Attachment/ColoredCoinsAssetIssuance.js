/**!
 * LibreMoney ColoredCoinsAssetIssuance 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var Attachment = require(__dirname + '/../../Transactions/Attachment/Attachment');
var ColoredCoinsTrType = require(__dirname + '/../ColoredCoinsTrType');


function ColoredCoinsAssetIssuance(Name, Description, QuantityMilliLm, Decimals) {
	this.prototype = new Attachment();

	//static final long serialVersionUID = 0;


	function GetSize() {
		/*
		try {
			return 1 + name.getBytes("UTF-8").length + 2 + description.getBytes("UTF-8").length + 8 + 1;
		} catch (RuntimeException|UnsupportedEncodingException e) {
			Logger.logMessage("Error in getBytes", e);
			return 0;
		}
		*/
	}

	function GetBytes() {
		/*
		try {
			byte[] name = this.name.getBytes("UTF-8");
			byte[] description = this.description.getBytes("UTF-8");

			ByteBuffer buffer = ByteBuffer.allocate(1 + name.length + 2 + description.length + 8 + 1);
			buffer.order(ByteOrder.LITTLE_ENDIAN);
			buffer.put((byte)name.length);
			buffer.put(name);
			buffer.putShort((short)description.length);
			buffer.put(description);
			buffer.putLong(quantityQNT);
			buffer.put(decimals);

			return buffer.array();
		} catch (RuntimeException|UnsupportedEncodingException e) {
			Logger.logMessage("Error in getBytes", e);
			return null;
		}
		*/
	}

	function GetJsonObject() {
		/*
		JSONObject attachment = new JSONObject();
		attachment.put("name", name);
		attachment.put("description", description);
		attachment.put("quantityQNT", quantityQNT);
		attachment.put("decimals", decimals);
		return attachment;
		*/
	}

	function GetTransactionType() {
		return ColoredCoinsTrType.GetAssetIssuance();
	}

	function GetName() {
		return this.Name;
	}

	function GetDescription() {
		return this.Description;
	}

	function GetQuantityMilliLm() {
		return this.QuantityMilliLm;
	}

	function GetDecimals() {
		return this.Decimals;
	}


	this.Name = Name;
	this.Description = Description;
	this.QuantityMilliLm = QuantityMilliLm;
	this.Decimals = Decimals;

	this.GetSize = GetSize;
	this.GetBytes = GetBytes;
	this.GetJsonObject = GetJsonObject;
	this.GetTransactionType = GetTransactionType;
	this.GetName = GetName;
	this.GetDescription = GetDescription;
	this.GetQuantityMilliLm = GetQuantityMilliLm;
	this.GetDecimals = GetDecimals;
	return this;
}


module.exports = ColoredCoinsAssetIssuance;
