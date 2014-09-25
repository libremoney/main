/**!
 * LibreMoney Reed Solomon Encoding and Decoding 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 * Version: 1.0, license: Public Domain, coder: NxtChg (admin@nxtchg.com)
 * Java Version: ChuckOne (ChuckOne@mail.de).
 */

if (typeof module !== "undefined") {
	var BigInteger = require(__dirname + '/../Util/BigInteger');
	var Convert = require(__dirname + '/../Util/Convert');
}


var ReedSolomon = function() {
	var initial_codeword = new Array(1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
	var gexp = new Array(1, 2, 4, 8, 16, 5, 10, 20, 13, 26, 17, 7, 14, 28, 29, 31, 27, 19, 3, 6, 12, 24, 21, 15, 30, 25, 23, 11, 22, 9, 18, 1);
	var glog = new Array(0, 0, 1, 18, 2, 5, 19, 11, 3, 29, 6, 27, 20, 8, 12, 23, 4, 10, 30, 17, 7, 22, 28, 26, 21, 25, 9, 16, 13, 14, 24, 15);
	var codeword_map = new Array(3, 2, 1, 0, 7, 6, 5, 4, 13, 14, 15, 16, 12, 8, 9, 10, 11);
	var alphabet = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";

	var base_32_length = 13;
	var base_10_length = 20;


	function Encode(plain) {
		var plain_string = Convert.ToUnsignedLong(plain);
		return EncodeStr(plain_string);
	}

	// plain - BigInt
	function EncodeBigInt(plain) {
		var plain_string = Convert.ToUnsignedBigInt(plain);
		return EncodeStr(plain_string);
	}

	function EncodeStr(plain) {
		var plain_string = Convert.ToUnsignedLong(plain);
		var length = plain_string.length;
		plain_string_10 = new Array(); //[ReedSolomon.base_10_length];
		for (var i = 0; i < base_10_length; i++) {
			plain_string_10.push(0);
		}
		for (var i = 0; i < length; i++) {
			plain_string_10[i] = Convert.Ord(plain_string.charAt(i)) - Convert.Ord('0');
		}

		var codeword_length = 0;
		var codeword = new Array(); //[initial_codeword.length];
		for (var i = 0; i < initial_codeword.length; i++) {
			codeword.push(0);
		}

		while(true) { // base 10 to base 32 conversion
			var new_length = 0;
			var digit_32 = 0;
			for (var i = 0; i < length; i++) {
				digit_32 = digit_32 * 10 + plain_string_10[i];
				if (digit_32 >= 32) {
					plain_string_10[new_length] = digit_32 >> 5;
					digit_32 &= 31;
					new_length += 1;
				} else if (new_length > 0) {
					plain_string_10[new_length] = 0;
					new_length += 1;
				}
			}
			length = new_length;
			codeword[codeword_length] = digit_32;
			codeword_length += 1;
			if (length <= 0) break;
		}

		var p = new Array(0, 0, 0, 0);
		for (var i = base_32_length - 1; i >= 0; i--) {
			var fb = codeword[i] ^ p[3];
			p[3] = p[2] ^ Gmult(30, fb);
			p[2] = p[1] ^ Gmult(6, fb);
			p[1] = p[0] ^ Gmult(9, fb);
			p[0] =        Gmult(17, fb);
		}

		//System.arraycopy(p, 0, codeword, base_32_length, initial_codeword.length - base_32_length); - Java
		for (var i = base_32_length; i < initial_codeword.length - base_32_length; i++) {
			codeword[i] = p[i-base_32_length];
		}

		var cypher_string_builder = '';
		for (var i = 0; i < 17; i++) {
			var codework_index = codeword_map[i];
			var alphabet_index = codeword[codework_index];
			cypher_string_builder += alphabet[alphabet_index];
			if ((i & 3) == 3 && i < 13) {
				cypher_string_builder += '-';
			}
		}
		return cypher_string_builder;
	}

	// return BigInt
	function Decode(cypher_string) {
		var codeword = new Array(); //int[initial_codeword.length];
		for (var i = 0; i < initial_codeword.length; i++) {
			codeword.push(0);
		}
		//System.arraycopy(ReedSolomon.initial_codeword, 0, codeword, 0, ReedSolomon.initial_codeword.length);
		for (var i = 0; i < initial_codeword.length; i++) {
			codeword[i] = initial_codeword[i];
		}

		var codeword_length = 0;
		for (var i = 0; i < cypher_string.length; i++) {
			var position_in_alphabet = alphabet.indexOf(cypher_string[i]);
			if (position_in_alphabet <= -1 || position_in_alphabet > alphabet.length) {
				continue;
			}
			if (codeword_length > 16) {
				throw new Error('CodewordTooLongException');
			}

			var codework_index = codeword_map[codeword_length];
			codeword[codework_index] = position_in_alphabet;
			codeword_length += 1;
		}

		if (codeword_length == 17 && !IsCodewordValid(codeword) || codeword_length != 17) {
			throw new Error('CodewordInvalidException');
		}

		var length = base_32_length;
		var cypher_string_32 = new Array();
		for (var i = 0; i < length; i++) {
			cypher_string_32[i] = codeword[length - i - 1];
		}

		var plain_string_builder = '';
		do { // base 32 to base 10 conversion
			var new_length = 0;
			var digit_10 = 0;

			for (var i = 0; i < length; i++) {
				digit_10 = digit_10 * 32 + cypher_string_32[i];

				if (digit_10 >= 10) {
					cypher_string_32[new_length] = digit_10 / 10;
					digit_10 %= 10;
					new_length += 1;
				} else if (new_length > 0) {
					cypher_string_32[new_length] = 0;
					new_length += 1;
				}
			}
			length = new_length;
			plain_string_builder += Convert.Chr(digit_10 + Convert.Ord('0'));
		} while (length > 0);

		var a = Convert.StringToArray(plain_string_builder);
		var bigInt = BigInteger(a.reverse().toString());
		return bigInt;
	}

	function Gmult(a, b) {
		if (a == 0 || b == 0) {
			return 0;
		}
		var idx = (glog[a] + glog[b]) % 31;
		return gexp[idx];
	}

	function IsCodewordValid(codeword) {
		var sum = 0;

		for (var i = 1; i < 5; i++) {
			var t = 0;
			for (var j = 0; j < 31; j++) {
				if (j > 12 && j < 27) {
					continue;
				}
				var pos = j;
				if (j > 26) {
					pos -= 14;
				}
				t ^= Gmult(codeword[pos], gexp[(i * j) % 31]);
			}
			sum |= t;
		}

		return sum == 0;
	}


	return {
		Encode: Encode,
		EncodeBigInt: EncodeBigInt,
		Decode: Decode,
		Gmult: Gmult,
		IsCodewordValid: IsCodewordValid
	}
}();


if (typeof module !== "undefined") {
	module.exports = ReedSolomon;
}
