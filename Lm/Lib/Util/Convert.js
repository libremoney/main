/**!
 * LibreMoney Convert 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

if (typeof module !== "undefined") {
	var BigInteger = require(__dirname + '/BigInteger');
	var Constants = require(__dirname + '/../Constants');
	var Crypto = require(__dirname + '/../Crypto/Crypto');
}


var Convert = function() {
	var hexChars = new Array('0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f');
	var multipliers = new Array(1, 10, 100, 1000, 10000, 100000, 1000000, 10000000, 100000000);
	var two64 = new BigInteger("18446744073709551616");


	function BigIntToLong(bigIntVal) {
		var buf = bigIntVal.toBuffer();
		return BufferToLongLE(buf)
	}

	function BigIntToLongBE(bigIntVal) {
		var buf = bigIntVal.toBuffer();
		return BufferToLongBE(buf)
	}

	function BufferToLongBE(buf) {
		if (buf.length < 8) {
			var addLength = 8 - buf.length;
			var addBuffer = new Buffer(addLength);
			addBuffer = ClearBuffer(addBuffer);
			buf = Buffer.concat([addBuffer, buf], 8)
		}
		var lowBits = buf.slice(buf.length - 4, buf.length);
		var higthBits = buf.slice(buf.length - 8, buf.length - 4);
		return new longInt(lowBits.readInt32BE(0), higthBits.readInt32BE(0), true)
	}

	function BufferToLongLE(buf) {
		if (buf.length < 8) {
			var addLength = 8 - buf.length;
			var addBuffer = new Buffer(addLength);
			addBuffer = ClearBuffer(addBuffer);
			buf = Buffer.concat([addBuffer, buf], 8)
		}
		var lowBits = buf.slice(buf.length - 4, buf.length);
		var higthBits = buf.slice(buf.length - 8, buf.length - 4);
		return new longInt(lowBits.readInt32LE(0), higthBits.readInt32LE(0), true)
	}

	//var data = atob("AAAAAABsskAAAAAAAPmxQAAAAAAAKrF");
	//alert(bytesToDouble(data,0)); // 4716.0
	//alert(bytesToDouble(data,1)); // 4601.0
	function BytesToDouble(str, start) {
		start *= 8;
		if (typeof str == 'string') {
			var data = [str.charCodeAt(start+7),
						str.charCodeAt(start+6),
						str.charCodeAt(start+5),
						str.charCodeAt(start+4),
						str.charCodeAt(start+3),
						str.charCodeAt(start+2),
						str.charCodeAt(start+1),
						str.charCodeAt(start+0)];
		} else {
			var data = [str[start+7],
						str[start+6],
						str[start+5],
						str[start+4],
						str[start+3],
						str[start+2],
						str[start+1],
						str[start+0]];
		}

		var sign = (data[0] & 1<<7)>>7;

		var exponent = (((data[0] & 127) << 4) | (data[1]&(15<<4))>>4);

		if (exponent == 0) return 0;
		if (exponent == 0x7ff) return (sign) ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;

		var mul = Math.pow(2, exponent - 1023 - 52);
		var mantissa = data[7]+
			data[6] * Math.pow(2, 8*1)+
			data[5] * Math.pow(2, 8*2)+
			data[4] * Math.pow(2, 8*3)+
			data[3] * Math.pow(2, 8*4)+
			data[2] * Math.pow(2, 8*5)+
			(data[1]&15) * Math.pow(2, 8*6)+
			Math.pow(2, 52);

		return Math.pow(-1, sign) * mantissa * mul;
	}

	function Chr(ascii) {
		return String.fromCharCode(ascii);
	}

	function ClearBuffer(buf) {
		for (var i = 0; i < buf.length; i++) {
			buf[i] = 0
		}
		return buf
	}

	function DecodeHex(hex) {
		return new Buffer(hex, "hex").slice(0)
	}

	function EmptyToNull(value) {
		if (typeof value == 'string') {
			return ((typeof value == 'undefined' || value == null || value.length == 0) ? null : value);
		} else { // bytes
			if (value == null || typeof value == 'undefined') {
				return null;
			}
			for (var b in value) {
				if (b != 0) {
					return value;
				}
			}
			return null;
		}
	}

	function FromEpochTime(epochTime) {
		return new Date(epochTime + Constants.EpochBeginning - 500);
	}

	// hash - hex string or bytes array
	function FullHashToId(hash) {
		var longVal = Utils.BufferToLongLE(publicKeyHash);
		return longVal.toString();

		/*
		if (typeof hash == 'string') {
			if (hash == null) {
				return null;
			}
			hash = ParseHexString(hash);
		}

		if (hash == null || hash.length < 8) {
			throw new Error("IllegalArgumentException: Invalid hash: " + hash);
		}
		var b = new Array();
		b.push(hash[7]);
		b.push(hash[6]);
		b.push(hash[5]);
		b.push(hash[4]);
		b.push(hash[3]);
		b.push(hash[2]);
		b.push(hash[1]);
		b.push(hash[0]);
		var bb = BytesToDouble(b);
		var bigInteger = new BigInteger(1, bb);
		return bigInteger.longValue();
		*/
	}

	function GetAccountId(publicKey) {
		var publicKeyHash = Curve.Sha256(publicKey);
		return FullHashToId(publicKeyHash);
	}

	function GetBEBigIntFromLENumber(num) {
		if (typeof num !== "string") {
			num = mun.toString()
		}
		var bi = bigint(num);
		var buf = bi.toBuffer();
		var buffArr = [];
		for (var i = 0; i < buf.length; i++) {
			buffArr.push(buf[buf.length - i - 1])
		}
		buf = new Buffer(buffArr);
		return bigint.fromBuffer(buf)
	}

	function GetDateTime() {
		var date = new Date();
		var hour = date.getHours();
		hour = (hour < 10 ? "0" : "") + hour;
		var min = date.getMinutes();
		min = (min < 10 ? "0" : "") + min;
		var sec = date.getSeconds();
		sec = (sec < 10 ? "0" : "") + sec;
		var year = date.getFullYear();
		var month = date.getMonth() + 1;
		month = (month < 10 ? "0" : "") + month;
		var day = date.getDate();
		day = (day < 10 ? "0" : "") + day;
		return year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec
	}

	function GetEpochTime() {
		return (Date.now() - Constants.EpochBeginning + 500);
	}

	function IsEmptyObj(obj) {
		if (obj == null) return true;
		if (obj.length && obj.length > 0) return false;
		if (obj.length === 0) return true;
		for (var key in obj) {
			if (hasOwnProperty.call(obj, key)) return false
		}
		return true
	}

	function LongToBigInt(long) {
		return bigint(long.toString())
	}

	function NullToEmpty(s) {
		throw new Error('Not implementted');
		/*
		return s == null ? "" : s;
		*/
	}

	function NullToNumber(val) {
		if (val === null) {
			return 0
		}
		return val
	}

	function NullToZero(i) {
		return i == null ? 0 : i;
	}

	function Ord(string) {
		return string.charCodeAt(0);
	}

	function ParseAccountId(account) {
		if (typeof account == 'undefined' || account == null) {
			return null;
		}
		account = account.toUpperCase();
		if (account.startsWith("LMA-")) {
			return ZeroToNull(Crypto.RsDecode(account.substring(4)));
		} else {
			return ParseUnsignedLong(account);
		}
	}

	function ParseHexString(hex) {
		if (hex == null) {
			return null;
		}
		var len = hex.length / 2;
		var bytes = new Array();
		for (var i = 0; i < len; i++) {
			var char1 = hex.charCodeAt(i * 2);
			char1 = char1 > 0x60 ? char1 - 0x57 : char1 - 0x30;
			var char2 = hex.charCodeAt(i * 2 + 1);
			char2 = char2 > 0x60 ? char2 - 0x57 : char2 - 0x30;
			if (char1 < 0 || char2 < 0 || char1 > 15 || char2 > 15) {
				throw new Error("NumberFormatException: Invalid hex number: " + hex);
			}
			bytes[i] = ((char1 << 4) + char2);
		}
		return bytes;
	}

	function ParseLm(value) {
		return ParseStringFraction(value, 8, Constants.MaxBalanceLm);
	}

	function ParseLong(o) {
		if (o == null)
			return 0
		else
			return o;
		/*
		if (o == null) {
			return 0;
		} else if (o instanceof Long) {
			return o;
		} else if (o instanceof String) {
			return Long.parseLong((String)o);
		} else {
			throw new IllegalArgumentException("Not a long: " + o);
		}
		*/
	}

	function ParseStringFraction(value, decimals, maxValue) {
		throw new Error('Not implementted');
		/*
		String[] s = value.trim().split("\\.");
		if (s.length == 0 || s.length > 2) {
			throw new NumberFormatException("Invalid number: " + value);
		}
		long wholePart = Long.parseLong(s[0]);
		if (wholePart > maxValue) {
			throw new IllegalArgumentException("Whole part of value exceeds maximum possible");
		}
		if (s.length == 1) {
			return wholePart * multipliers[decimals];
		}
		long fractionalPart = Long.parseLong(s[1]);
		if (fractionalPart >= multipliers[decimals] || s[1].length() > decimals) {
			throw new IllegalArgumentException("Fractional part exceeds maximum allowed divisibility");
		}
		for (int i = s[1].length(); i < decimals; i++) {
			fractionalPart *= 10;
		}
		return wholePart * multipliers[decimals] + fractionalPart;
		*/
	}

	function ParseUnsignedLong(number) {
		if (typeof number == 'undefined' || number == null) {
			return null;
		}
		var bigInt = new BigInteger(number.trim());
		if (bigInt.signum() < 0 || bigInt.compareTo(two64) != -1) {
			throw new Error("IllegalArgumentException: overflow: " + number);
		}
		return ZeroToNull(bigInt.longValue());
	}

	function ReadString(buffer, numBytes, maxLength) {
		if (numBytes > 3 * maxLength) {
			throw new Error("Max parameter length exceeded");
		}
		return Convert.ToString(buffer);
		/*
		var bytes = new [numBytes];
		buffer.get(bytes);
		return Convert.toString(bytes);
		*/
	}

	function RoundTo5Float(num) {
		var numF = parseFloat(NullToNumber(num));
		return Math.round(numF * 1e5) / 1e5
	}

	function RsAccount(accountId) {
		return "LMA-" + Crypto.RsEncode(NullToZero(accountId));
	}

	function SafeAbs(a) {
		throw new Error('Not implementted');
		/*
		if (a == Long.MIN_VALUE) {
			throw new ArithmeticException("Integer overflow");
		}
		return Math.abs(a);
		*/
	}

	// overflow checking based on https://www.securecoding.cert.org/confluence/display/java/NUM00-J.+Detect+or+prevent+integer+overflow
	function SafeAdd(left, right) {
		throw new Error('Not implementted');
		/*
		if (right > 0 ? left > Long.MAX_VALUE - right
				: left < Long.MIN_VALUE - right) {
			throw new ArithmeticException("Integer overflow");
		}
		return left + right;
		*/
	}

	function SafeDivide(left, right) {
		throw new Error('Not implementted');
		/*
		if ((left == Long.MIN_VALUE) && (right == -1)) {
			throw new ArithmeticException("Integer overflow");
		}
		return left / right;
		*/
	}

	function SafeMultiply(left, right) {
		throw new Error('Not implementted');
		/*
		if (right > 0 ? left > Long.MAX_VALUE/right
				|| left < Long.MIN_VALUE/right
				: (right < -1 ? left > Long.MIN_VALUE/right
				|| left < Long.MAX_VALUE/right
				: right == -1
				&& left == Long.MIN_VALUE) ) {
			throw new ArithmeticException("Integer overflow");
		}
		return left * right;
		*/
	}

	function SafeNegate(a) {
		throw new Error('Not implementted');
		/*
		if (a == Long.MIN_VALUE) {
			throw new ArithmeticException("Integer overflow");
		}
		return -a;
		*/
	}

	function SafeSubtract(left, right) {
		throw new Error('Not implementted');
		/*
		if (right > 0 ? left < Long.MIN_VALUE + right
				: left > Long.MAX_VALUE + right) {
			throw new ArithmeticException("Integer overflow");
		}
		return left - right;
		*/
	}

	function StringToArray(string) {
		var a = new Array();
		for (var i = 0; i < string.length; i++) {
			a.push(string[i]);
		}
		return a;
	}

	function StringToLong(str) {
		var bi = bigint(str);
		return BigIntToLongBE(bi)
	}

	function ToBytes(s) {
		throw new Error('Not implementted');
		/*
		try {
			return s.GetBytes("UTF-8");
		} catch (e) {
			throw new Error(e.toString(), e);
		}
		*/
	}

	function ToHexString(bytes) {
		if (bytes == null) {
			return null;
		}
		var chars = new Array(bytes.length * 2);
		for (var i = 0; i < bytes.length; i++) {
			chars[i * 2] = hexChars[((bytes[i] >> 4) & 0xF)];
			chars[i * 2 + 1] = hexChars[(bytes[i] & 0xF)];
		}
		return String.valueOf(chars);
	}

	function ToString(bytes) {
		throw new Error('Not implementted');
		/*
		try {
			return new String(bytes, "UTF-8").trim().intern();
		} catch (e) {
			throw new RuntimeException(e.toString(), e);
		}
		*/
	}

	// objectId - BigInt
	function ToUnsignedBigInt(objectId) {
		//--- 1 --- (long)
		if (objectId.isPositive()) {
			return objectId;
		}
		var id = BigInteger(objectId).add(two64);
		return id;
	}

	function ToUnsignedLong(objectId) {
		//--- 1 --- (long)
		if (objectId >= 0) {
			return objectId;
		}
		var id = BigInteger(objectId).add(two64);
		return id.toString();
		/*
		--- 2 --- (Long)
		return toUnsignedLong(nullToZero(objectId));
		*/
	}

	function Truncate(s, replaceNull, limit, dots) {
		throw new Error('Not implementted');
		/*
		return s == null ? replaceNull : s.length() > limit ? (s.substring(0, dots ? limit - 3 : limit) + (dots ? "..." : "")) : s;
		*/
	}

	function ZeroToNull(l) {
		return l == 0 ? null : l;
	}

	// ---- String ----

	String.prototype.equalsIgnoreCase = function(str) {
		return (this.toLowerCase() == str.toLowerCase());
	}

	String.prototype.startsWith = function(str) {
		return ( str === this.substr( 0, str.length ) );
	}


	return {
		BigIntToLong: BigIntToLong,
		BigIntToLongBE: BigIntToLongBE,
		BufferToLongBE: BufferToLongBE,
		BufferToLongLE: BufferToLongLE,
		BytesToDouble: BytesToDouble,
		Chr: Chr,
		ClearBuffer: ClearBuffer,
		DecodeHex: DecodeHex,
		EmptyToNull: EmptyToNull,
		FromEpochTime: FromEpochTime,
		FullHashToId: FullHashToId,
		GetAccountId: GetAccountId,
		GetBEBigIntFromLENumber: GetBEBigIntFromLENumber,
		GetDateTime: GetDateTime,
		GetEpochTime: GetEpochTime,
		IsEmptyObj: IsEmptyObj,
		LongToBigInt: LongToBigInt,
		NullToEmpty: NullToEmpty,
		NullToNumber: NullToNumber,
		NullToZero: NullToZero,
		Ord: Ord,
		ParseAccountId: ParseAccountId,
		ParseHexString: ParseHexString,
		ParseLm: ParseLm,
		ParseLong: ParseLong,
		ParseStringFraction: ParseStringFraction,
		ParseUnsignedLong: ParseUnsignedLong,
		ReadString: ReadString,
		RoundTo5Float: RoundTo5Float,
		RsAccount: RsAccount,
		SafeAbs: SafeAbs,
		SafeAdd: SafeAdd,
		SafeDivide: SafeDivide,
		SafeMultiply: SafeMultiply,
		SafeNegate: SafeNegate,
		SafeSubtract: SafeSubtract,
		StringToArray: StringToArray,
		StringToLong: StringToLong,
		ToBytes: ToBytes,
		ToHexString: ToHexString,
		ToString: ToString,
		ToUnsignedBigInt: ToUnsignedBigInt,
		ToUnsignedLong: ToUnsignedLong,
		Truncate: Truncate,
		ZeroToNull: ZeroToNull
	}
}();


if (typeof module !== "undefined") {
	module.exports = Convert;
}