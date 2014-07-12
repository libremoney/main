/*
import nxt.Constants;
import nxt.crypto.Crypto;
*/

BigInteger = require(__dirname + '/../util/BigInteger');


var hexChars = new Array('0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f');
var multipliers = new Array(1, 10, 100, 1000, 10000, 100000, 1000000, 10000000, 100000000);
var two64 = new BigInteger("18446744073709551616");


function Chr(ascii) {
	return String.fromCharCode(ascii);
}

function EmptyToNull(value) {
	if (typeof value == 'string') {
		return ((typeof s == 'undefined' || s == null || s.length() == 0) ? null : s);
	} else {
		throw new Error('Not implementted');
		/*
		if (bytes == null) {
			return null;
		}
		for (byte b : bytes) {
			if (b != 0) {
				return bytes;
			}
		}
		return null;
		*/
	}
}

function FromEpochTime(epochTime) {
	throw new Error('Not implementted');
	/*
	return new Date(epochTime * 1000L + Constants.EPOCH_BEGINNING - 500L);
	*/
}

function FullHashToId(hash) {
	if (typeof hash == 'string') {
		throw new Error('Not implementted');
		/*
		if (hash == null) {
			return null;
		}
		return fullHashToId(Convert.parseHexString(hash));
		*/
	} else {
		throw new Error('Not implementted');
		/*
		if (hash == null || hash.length < 8) {
			throw new IllegalArgumentException("Invalid hash: " + Arrays.toString(hash));
		}
		BigInteger bigInteger = new BigInteger(1, new byte[] {hash[7], hash[6], hash[5], hash[4], hash[3], hash[2], hash[1], hash[0]});
		return bigInteger.longValue();
		*/
	}
}

function GetEpochTime() {
	throw new Error('Not implementted');
	/*
	return (int)((System.currentTimeMillis() - Constants.EPOCH_BEGINNING + 500) / 1000);
	*/
}

function NullToEmpty(s) {
	throw new Error('Not implementted');
	/*
	return s == null ? "" : s;
	*/
}

function NullToZero(i) {
	throw new Error('Not implementted');
	/*
	return i == null ? 0 : i;
	*/
}

function Ord(string) {
	return string.charCodeAt(0);
}

function ParseAccountId(account) {
	throw new Error('Not implementted');
	/*
	if (account == null) {
		return null;
	}
	account = account.toUpperCase();
	if (account.startsWith("NXT-")) {
		return zeroToNull(Crypto.rsDecode(account.substring(4)));
	} else {
		return parseUnsignedLong(account);
	}
	*/
}

function ParseHexString(hex) {
	throw new Error('Not implementted');
	/*
	byte[] bytes = new byte[hex.length() / 2];
	for (int i = 0; i < bytes.length; i++) {
		int char1 = hex.charAt(i * 2);
		char1 = char1 > 0x60 ? char1 - 0x57 : char1 - 0x30;
		int char2 = hex.charAt(i * 2 + 1);
		char2 = char2 > 0x60 ? char2 - 0x57 : char2 - 0x30;
		if (char1 < 0 || char2 < 0 || char1 > 15 || char2 > 15) {
			throw new NumberFormatException("Invalid hex number: " + hex);
		}
		bytes[i] = (byte)((char1 << 4) + char2);
	}
	return bytes;
	*/
}

// ParseNXT
function ParseMilliLm(nxt) {
	throw new Error('Not implementted');
	/*
	return parseStringFraction(nxt, 8, Constants.MAX_BALANCE_NXT);
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
	throw new Error('Not implementted');
	/*
	if (number == null) {
		return null;
	}
	BigInteger bigInt = new BigInteger(number.trim());
	if (bigInt.signum() < 0 || bigInt.compareTo(two64) != -1) {
		throw new IllegalArgumentException("overflow: " + number);
	}
	return zeroToNull(bigInt.longValue());
	*/
}

function RsAccount(accountId) {
	throw new Error('Not implementted');
	/*
	return "NXT-" + Crypto.rsEncode(nullToZero(accountId));
	*/
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

function ToHexString(bytes) {
	throw new Error('Not implementted');
	/*
	char[] chars = new char[bytes.length * 2];
	for (int i = 0; i < bytes.length; i++) {
		chars[i * 2] = hexChars[((bytes[i] >> 4) & 0xF)];
		chars[i * 2 + 1] = hexChars[(bytes[i] & 0xF)];
	}
	return String.valueOf(chars);
	*/
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
	throw new Error('Not implementted');
}

function Truncate(s, replaceNull, limit, dots) {
	throw new Error('Not implementted');
	/*
	return s == null ? replaceNull : s.length() > limit ? (s.substring(0, dots ? limit - 3 : limit) + (dots ? "..." : "")) : s;
	*/
}

function ZeroToNull(l) {
	throw new Error('Not implementted');
	/*
	return l == 0 ? null : l;
	*/
}

exports.Chr = Chr;
exports.EmptyToNull = EmptyToNull;
exports.FromEpochTime = FromEpochTime;
exports.FullHashToId = FullHashToId;
exports.GetEpochTime = GetEpochTime;
exports.NullToEmpty = NullToEmpty;
exports.NullToZero = NullToZero;
exports.Ord = Ord;
exports.ParseAccountId = ParseAccountId;
exports.ParseHexString = ParseHexString;
exports.ParseMilliLm = ParseMilliLm;
exports.ParseStringFraction = ParseStringFraction;
exports.ParseUnsignedLong = ParseUnsignedLong;
exports.RsAccount = RsAccount;
exports.SafeAbs = SafeAbs;
exports.SafeAdd = SafeAdd;
exports.SafeDivide = SafeDivide;
exports.SafeMultiply = SafeMultiply;
exports.SafeNegate = SafeNegate;
exports.SafeSubtract = SafeSubtract;
exports.StringToArray = StringToArray;
exports.ToHexString = ToHexString;
exports.ToUnsignedLong = ToUnsignedLong;
exports.Truncate = Truncate;
exports.ZeroToNull = ZeroToNull;
