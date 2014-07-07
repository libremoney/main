var hash = {
	init: SHA256_init,
	update: SHA256_write,
	getBytes: SHA256_finalize
};

var lmCrypto = function(curve25519, hash, converters) {

	function SimpleHash(message) {
		hash.init();
		hash.update(message);
		return hash.getBytes();
	}

	function AreByteArraysEqual(bytes1, bytes2) {
		if (bytes1.length !== bytes2.length)
			return false;

		for (var i = 0; i < bytes1.length; ++i) {
			if (bytes1[i] !== bytes2[i])
				return false;
		}

		return true;
	}

	//adjusted by wesley
	function GetPublicKey(secretPhrase) {
		var secretPhraseBytes = converters.hexStringToByteArray(secretPhrase);
		var digest = simpleHash(secretPhraseBytes);
		return converters.byteArrayToHexString(curve25519.keygen(digest).p);
	}

	function GetPrivateKey(secretPhrase) {
		SHA256_init();
		SHA256_write(converters.stringToByteArray(secretPhrase));
		return converters.shortArrayToHexString(curve25519_clamp(converters.byteArrayToShortArray(SHA256_finalize())));
	}

	function Curve25519_clamp(curve) {
		curve[0] &= 0xFFF8;
		curve[15] &= 0x7FFF;
		curve[15] |= 0x4000;
		return curve;
	}

	function GetAccountId(secretPhrase) {
		var publicKey = getPublicKey(converters.stringToHexString(secretPhrase));
		var hex = converters.hexStringToByteArray(publicKey);

		hash.init();
		hash.update(hex);

		var account = hash.getBytes();

		account = converters.byteArrayToHexString(account);

		var slice = (converters.hexStringToByteArray(account)).slice(0, 8);

		return byteArrayToBigInteger(slice).toString();
	}

	function ByteArrayToBigInteger(byteArray, startIndex) {
		var value = new BigInteger("0", 10);
		var temp1, temp2;
		for (var i = byteArray.length - 1; i >= 0; i--) {
			temp1 = value.multiply(new BigInteger("256", 10));
			temp2 = temp1.add(new BigInteger(byteArray[i].toString(10), 10));
			value = temp2;
		}

		return value;
	}


	function Sign(message, secretPhrase) {
		var messageBytes = converters.hexStringToByteArray(message);
		var secretPhraseBytes = converters.hexStringToByteArray(secretPhrase);

		var digest = simpleHash(secretPhraseBytes);
		var s = curve25519.keygen(digest).s;

		var m = simpleHash(messageBytes);

		hash.init();
		hash.update(m);
		hash.update(s);
		var x = hash.getBytes();

		var y = curve25519.keygen(x).p;

		hash.init();
		hash.update(m);
		hash.update(y);
		var h = hash.getBytes();

		var v = curve25519.sign(h, x, s);

		return converters.byteArrayToHexString(v.concat(h));
	}

	function Verify(signature, message, publicKey) {
		var signatureBytes = converters.hexStringToByteArray(signature);
		var messageBytes = converters.hexStringToByteArray(message);
		var publicKeyBytes = converters.hexStringToByteArray(publicKey);
		var v = signatureBytes.slice(0, 32);
		var h = signatureBytes.slice(32);
		var y = curve25519.verify(v, h, publicKeyBytes);

		var m = simpleHash(messageBytes);

		hash.init();
		hash.update(m);
		hash.update(y);
		var h2 = hash.getBytes();

		return areByteArraysEqual(h, h2);
	}

	return {
		GetPublicKey: GetPublicKey,
		GetPrivateKey: GetPrivateKey,
		GetAccountId: GetAccountId,
		Sign: Sign,
		Verify: Verify
	};

}(curve25519, hash, converters);