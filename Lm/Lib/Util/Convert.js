/**!
 * LibreMoney Convert 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

if (typeof module !== "undefined") {
	var BigInteger = require(__dirname + '/BigInteger');
	var Constants = require(__dirname + '/../Constants');
}


var Convert = function() {
	var hexChars = new Array('0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f');
	var multipliers = new Array(1, 10, 100, 1000, 10000, 100000, 1000000, 10000000, 100000000);
	var two64 = new BigInteger("18446744073709551616");

	var charToNibble = {};
	var nibbleToChar = [];
	var i;
	for (i = 0; i <= 9; ++i) {
		var character = i.toString();
		charToNibble[character] = i;
		nibbleToChar.push(character);
	}

	for (i = 10; i <= 15; ++i) {
		var lowerChar = String.fromCharCode('a'.charCodeAt(0) + i - 10);
		var upperChar = String.fromCharCode('A'.charCodeAt(0) + i - 10);

		charToNibble[lowerChar] = i;
		charToNibble[upperChar] = i;
		nibbleToChar.push(lowerChar);
	}


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

	function ByteArrayToBigInteger(bytes, opt_startIndex) {
		var index = this.CheckBytesToIntInput(bytes, 8, opt_startIndex);
		var value = new BigInteger("0", 10);
		var temp1, temp2;
		for (var i = 7; i >= 0; i--) {
			temp1 = value.multiply(new BigInteger("256", 10));
			temp2 = temp1.add(new BigInteger(bytes[opt_startIndex + i].toString(10), 10));
			value = temp2;
		}
		return value;
	}

	function ByteArrayToHexString(bytes) {
		var str = '';
		for (var i = 0; i < bytes.length; ++i) {
			if (bytes[i] < 0) {
				bytes[i] += 256;
			}
			str += nibbleToChar[bytes[i] >> 4] + nibbleToChar[bytes[i] & 0x0F];
		}

		return str;
	}

	function ByteArrayToShortArray(byteArray) {
		var shortArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
		var i;
		for (i = 0; i < 16; i++) {
			shortArray[i] = byteArray[i * 2] | byteArray[i * 2 + 1] << 8;
		}
		return shortArray;
	}

	function ByteArrayToSignedInt32(bytes, opt_startIndex) {
		var index = this.CheckBytesToIntInput(bytes, 4, opt_startIndex);
		value = bytes[index];
		value += bytes[index + 1] << 8;
		value += bytes[index + 2] << 16;
		value += bytes[index + 3] << 24;
		return value;
	}

	function ByteArrayToSignedInt64(bytes, opt_startIndex) {
		var index = this.CheckBytesToIntInput(bytes, 8, opt_startIndex);
		value = bytes[index];
		value += bytes[index + 1] << 8;
		value += bytes[index + 2] << 16;
		value += bytes[index + 3] << 24;
		value += bytes[index + 4] << 32;
		value += bytes[index + 5] << 40;
		value += bytes[index + 6] << 48;
		//value += bytes[index + 7] << 56; - todo
		return value;
	}

	function ByteArrayToSignedShort(bytes, opt_startIndex) {
		var index = this.CheckBytesToIntInput(bytes, 2, opt_startIndex);
		var value = bytes[index];
		value += bytes[index + 1] << 8;
		return value;
	}

	function ByteArrayToString(bytes, opt_startIndex, length) {
		if (length == 0) {
			return "";
		}

		if (opt_startIndex && length) {
			var index = this.CheckBytesToIntInput(bytes, parseInt(length, 10), parseInt(opt_startIndex, 10));

			bytes = bytes.slice(opt_startIndex, opt_startIndex + length);
		}

		return decodeURIComponent(escape(String.fromCharCode.apply(null, bytes)));
	}

	// create a wordArray that is Big-Endian
	function ByteArrayToWordArray(byteArray) {
		var i = 0,
			offset = 0,
			word = 0,
			len = byteArray.length;
		var words = new Uint32Array(((len / 4) | 0) + (len % 4 == 0 ? 0 : 1));

		while (i < (len - (len % 4))) {
			words[offset++] = (byteArray[i++] << 24) | (byteArray[i++] << 16) | (byteArray[i++] << 8) | (byteArray[i++]);
		}
		if (len % 4 != 0) {
			word = byteArray[i++] << 24;
			if (len % 4 > 1) {
				word = word | byteArray[i++] << 16;
			}
			if (len % 4 > 2) {
				word = word | byteArray[i++] << 8;
			}
			words[offset] = word;
		}
		var wordArray = new Object();
		wordArray.sigBytes = len;
		wordArray.words = words;

		return wordArray;
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

	function CheckBytesToIntInput(bytes, numBytes, opt_startIndex) {
		var startIndex = opt_startIndex || 0;
		if (startIndex < 0) {
			throw new Error('Start index should not be negative');
		}

		if (bytes.length < startIndex + numBytes) {
			throw new Error('Need at least ' + (numBytes) + ' bytes to convert to an integer');
		}
		return startIndex;
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

	function HexStringToByteArray(str) {
		var bytes = [];
		var i = 0;
		if (0 !== str.length % 2) {
			bytes.push(charToNibble[str.charAt(0)]);
			++i;
		}

		for (; i < str.length - 1; i += 2)
			bytes.push((charToNibble[str.charAt(i)] << 4) + charToNibble[str.charAt(i + 1)]);

		return bytes;
	}

	function HexStringToString(hex) {
		return this.ByteArrayToString(this.HexStringToByteArray(hex));
	}

	function Int32ToBytes(x, opt_bigEndian) {
		/**
		 * Produces an array of the specified number of bytes to represent the integer
		 * value. Default output encodes ints in little endian format. Handles signed
		 * as well as unsigned integers. Due to limitations in JavaScript's number
		 * format, x cannot be a true 64 bit integer (8 bytes).
		 */
		function intToBytes(x, numBytes, unsignedMax, opt_bigEndian) {
			var signedMax = Math.floor(unsignedMax / 2);
			var negativeMax = (signedMax + 1) * -1;
			if (x != Math.floor(x) || x < negativeMax || x > unsignedMax) {
				throw new Error(
					x + ' is not a ' + (numBytes * 8) + ' bit integer');
			}
			var bytes = [];
			var current;
			// Number type 0 is in the positive int range, 1 is larger than signed int,
			// and 2 is negative int.
			var numberType = x >= 0 && x <= signedMax ? 0 :
				x > signedMax && x <= unsignedMax ? 1 : 2;
			if (numberType == 2) {
				x = (x * -1) - 1;
			}
			for (var i = 0; i < numBytes; i++) {
				if (numberType == 2) {
					current = 255 - (x % 256);
				} else {
					current = x % 256;
				}

				if (opt_bigEndian) {
					bytes.unshift(current);
				} else {
					bytes.push(current);
				}

				if (numberType == 1) {
					x = Math.floor(x / 256);
				} else {
					x = x >> 8;
				}
			}
			return bytes;
		}

		return intToBytes(x, 4, 4294967295, opt_bigEndian);
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

	function ShortArrayToByteArray(shortArray) {
		var byteArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
		var i;
		for (i = 0; i < 16; i++) {
			byteArray[2 * i] = shortArray[i] & 0xff;
			byteArray[2 * i + 1] = shortArray[i] >> 8;
		}

		return byteArray;
	}

	function ShortArrayToHexString(ary) {
		var res = "";
		for (var i = 0; i < ary.length; i++) {
			res += nibbleToChar[(ary[i] >> 4) & 0x0f] + nibbleToChar[ary[i] & 0x0f] + nibbleToChar[(ary[i] >> 12) & 0x0f] + nibbleToChar[(ary[i] >> 8) & 0x0f];
		}
		return res;
	}

	function StringToArray(string) {
		var a = new Array();
		for (var i = 0; i < string.length; i++) {
			a.push(string[i]);
		}
		return a;
	}

	function StringToByteArray(str) {
		str = unescape(encodeURIComponent(str)); //temporary

		var bytes = new Array(str.length);
		for (var i = 0; i < str.length; ++i)
			bytes[i] = str.charCodeAt(i);

		return bytes;
	}

	function StringToHexString(str) {
		return this.ByteArrayToHexString(this.StringToByteArray(str));
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

	// assumes wordArray is Big-Endian
	function WordArrayToByteArray(wordArray) {
		var len = wordArray.words.length;
		if (len == 0) {
			return new Array(0);
		}
		var byteArray = new Array(wordArray.sigBytes);
		var offset = 0,
			word, i;
		for (i = 0; i < len - 1; i++) {
			word = wordArray.words[i];
			byteArray[offset++] = word >> 24;
			byteArray[offset++] = (word >> 16) & 0xff;
			byteArray[offset++] = (word >> 8) & 0xff;
			byteArray[offset++] = word & 0xff;
		}
		word = wordArray.words[len - 1];
		byteArray[offset++] = word >> 24;
		if (wordArray.sigBytes % 4 == 0) {
			byteArray[offset++] = (word >> 16) & 0xff;
			byteArray[offset++] = (word >> 8) & 0xff;
			byteArray[offset++] = word & 0xff;
		}
		if (wordArray.sigBytes % 4 > 1) {
			byteArray[offset++] = (word >> 16) & 0xff;
		}
		if (wordArray.sigBytes % 4 > 2) {
			byteArray[offset++] = (word >> 8) & 0xff;
		}
		return byteArray;
	}

	function ZeroToNull(l) {
		return l == 0 ? null : l;
	}


	return {
		BigIntToLong: BigIntToLong,
		BigIntToLongBE: BigIntToLongBE,
		BufferToLongBE: BufferToLongBE,
		BufferToLongLE: BufferToLongLE,
		ByteArrayToBigInteger: ByteArrayToBigInteger,
		ByteArrayToHexString: ByteArrayToHexString,
		ByteArrayToShortArray: ByteArrayToShortArray,
		ByteArrayToSignedInt32: ByteArrayToSignedInt32,
		ByteArrayToSignedInt64: ByteArrayToSignedInt64,
		ByteArrayToSignedShort: ByteArrayToSignedShort,
		ByteArrayToString: ByteArrayToString,
		ByteArrayToWordArray: ByteArrayToWordArray,
		BytesToDouble: BytesToDouble,
		CheckBytesToIntInput: CheckBytesToIntInput,
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
		HexStringToByteArray: HexStringToByteArray,
		HexStringToString: HexStringToString,
		Int32ToBytes: Int32ToBytes,
		IsEmptyObj: IsEmptyObj,
		LongToBigInt: LongToBigInt,
		NullToEmpty: NullToEmpty,
		NullToNumber: NullToNumber,
		NullToZero: NullToZero,
		Ord: Ord,
		ParseHexString: ParseHexString,
		ParseLm: ParseLm,
		ParseLong: ParseLong,
		ParseStringFraction: ParseStringFraction,
		ParseUnsignedLong: ParseUnsignedLong,
		ReadString: ReadString,
		RoundTo5Float: RoundTo5Float,
		SafeAbs: SafeAbs,
		SafeAdd: SafeAdd,
		SafeDivide: SafeDivide,
		SafeMultiply: SafeMultiply,
		SafeNegate: SafeNegate,
		SafeSubtract: SafeSubtract,
		ShortArrayToByteArray: ShortArrayToByteArray,
		ShortArrayToHexString: ShortArrayToHexString,
		StringToArray: StringToArray,
		StringToByteArray: StringToByteArray,
		StringToHexString: StringToHexString,
		StringToLong: StringToLong,
		ToBytes: ToBytes,
		ToHexString: ToHexString,
		ToString: ToString,
		ToUnsignedBigInt: ToUnsignedBigInt,
		ToUnsignedLong: ToUnsignedLong,
		Truncate: Truncate,
		WordArrayToByteArray: WordArrayToByteArray,
		ZeroToNull: ZeroToNull
	}
}();


// ---- String ----

String.prototype.equalsIgnoreCase = function(str) {
	return (this.toLowerCase() == str.toLowerCase());
}

String.prototype.startsWith = function(str) {
	return ( str === this.substr( 0, str.length ) );
}


if (typeof module !== "undefined") {
	module.exports = Convert;
}
