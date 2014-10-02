/**!
 * LibreMoney Crypto 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

if (typeof module !== "undefined") {
	var crypto = require('crypto');
	var Curve = require(__dirname + '/curve25519');
	var Logger = require(__dirname + '/../Util/Logger').GetLogger(module);
	var JsSha256 = require(__dirname + '/jssha256');
} else {
	var Curve = curve25519;
	var JsSha256 = {
		Init: SHA256_init,
		Update: SHA256_write,
		GetBytes: SHA256_finalize
	};
}


var Crypto = function() {
}

Crypto.AesDecrypt = function(ivCiphertext, options) {
	if (ivCiphertext.length < 16 || ivCiphertext.length % 16 != 0) {
		throw {
			name: "invalid ciphertext"
		};
	}

	var iv = Convert.ByteArrayToWordArray(ivCiphertext.slice(0, 16));
	var ciphertext = Convert.ByteArrayToWordArray(ivCiphertext.slice(16));

	if (!options.sharedKey) {
		var sharedKey = GetSharedKey(options.privateKey, options.publicKey);
	} else {
		var sharedKey = options.sharedKey.slice(0); //clone
	}

	for (var i = 0; i < 32; i++) {
		sharedKey[i] ^= options.nonce[i];
	}

	var key = CryptoJS.SHA256(Convert.ByteArrayToWordArray(sharedKey));

	var encrypted = CryptoJS.lib.CipherParams.create({
		ciphertext: ciphertext,
		iv: iv,
		key: key
	});

	var decrypted = CryptoJS.AES.decrypt(encrypted, key, {
		iv: iv
	});

	var plaintext = Convert.WordArrayToByteArray(decrypted);

	return plaintext;
	/*
	try {
		if (ivCiphertext.length < 16 || ivCiphertext.length % 16 != 0) {
			throw new InvalidCipherTextException("invalid ciphertext");
		}
		byte[] iv = Arrays.copyOfRange(ivCiphertext, 0, 16);
		byte[] ciphertext = Arrays.copyOfRange(ivCiphertext, 16, ivCiphertext.length);
		byte[] dhSharedSecret = new byte[32];
		Curve25519.curve(dhSharedSecret, options.privateKey, options.publicKey);
		for (int i = 0; i < 32; i++) {
			dhSharedSecret[i] ^= options.nonce[i];
		}
		byte[] key = sha256().digest(dhSharedSecret);
		PaddedBufferedBlockCipher aes = new PaddedBufferedBlockCipher(new CBCBlockCipher(
				new AESEngine()));
		CipherParameters ivAndKey = new ParametersWithIV(new KeyParameter(key), iv);
		aes.init(false, ivAndKey);
		byte[] output = new byte[aes.getOutputSize(ciphertext.length)];
		int plaintextLength = aes.processBytes(ciphertext, 0, ciphertext.length, output, 0);
		plaintextLength += aes.doFinal(output, plaintextLength);
		byte[] result = new byte[plaintextLength];
		System.arraycopy(output, 0, result, 0, result.length);
		return result;
	} catch (InvalidCipherTextException e) {
		throw new RuntimeException(e.getMessage(), e);
	}
	*/
}

Crypto.AesDecrypt1 = function(ivCiphertext, myPrivateKey, theirPublicKey) {
	var options = {
		privateKey: myPrivateKey,
		publicKey: theirPublicKey,
		sharedKey: null,
		nonce: new Array(32)
	};
	return AesDecrypt(ivCiphertext, options);
}

Crypto.AesEncrypt = function(plaintext, options) {
	if (!window.crypto && !window.msCrypto) {
		throw {
			"errorCode": -1,
			"message": $.t("error_encryption_browser_support")
		};
	}

	// CryptoJS likes WordArray parameters
	var text = Convert.ByteArrayToWordArray(plaintext);

	if (!options.sharedKey) {
		var sharedKey = GetSharedKey(options.privateKey, options.publicKey);
	} else {
		var sharedKey = options.sharedKey.slice(0); //clone
	}

	for (var i = 0; i < 32; i++) {
		sharedKey[i] ^= options.nonce[i];
	}

	var key = CryptoJS.SHA256(Convert.ByteArrayToWordArray(sharedKey));

	var tmp = new Uint8Array(16);

	if (window.crypto) {
		window.crypto.getRandomValues(tmp);
	} else {
		window.msCrypto.getRandomValues(tmp);
	}

	var iv = Convert.ByteArrayToWordArray(tmp);
	var encrypted = CryptoJS.AES.encrypt(text, key, {
		iv: iv
	});

	var ivOut = Convert.WordArrayToByteArray(encrypted.iv);

	var ciphertextOut = Convert.WordArrayToByteArray(encrypted.ciphertext);

	return ivOut.concat(ciphertextOut);
	/*
	try {
		byte[] dhSharedSecret = new byte[32];
		Curve25519.curve(dhSharedSecret, options.privateKey, options.publicKey);
		for (int i = 0; i < 32; i++) {
			dhSharedSecret[i] ^= options.nonce[i];
		}
		byte[] key = sha256().digest(dhSharedSecret);
		byte[] iv = new byte[16];
		secureRandom.get().nextBytes(iv);
		PaddedBufferedBlockCipher aes = new PaddedBufferedBlockCipher(new CBCBlockCipher(
				new AESEngine()));
		CipherParameters ivAndKey = new ParametersWithIV(new KeyParameter(key), iv);
		aes.init(true, ivAndKey);
		byte[] output = new byte[aes.getOutputSize(plaintext.length)];
		int ciphertextLength = aes.processBytes(plaintext, 0, plaintext.length, output, 0);
		ciphertextLength += aes.doFinal(output, ciphertextLength);
		byte[] result = new byte[iv.length + ciphertextLength];
		System.arraycopy(iv, 0, result, 0, iv.length);
		System.arraycopy(output, 0, result, iv.length, ciphertextLength);
		return result;
	} catch (InvalidCipherTextException e) {
		throw new RuntimeException(e.getMessage(), e);
	}
	*/
}

Crypto.AesEncrypt1 = function(plaintext, myPrivateKey, theirPublicKey) {
	var options = {
		privateKey:myPrivateKey,
		publicKey: theirPublicKey,
		nonce: new Array(32)
	};
	return AesEncrypt(plaintext, options);
}

Crypto.AreByteArraysEqual = function(bytes1, bytes2) {
	if (bytes1.length !== bytes2.length)
		return false;

	for (var i = 0; i < bytes1.length; ++i) {
		if (bytes1[i] !== bytes2[i])
			return false;
	}

	return true;
}

Crypto.Curve = function(Z, k, P) {
	Curve.curve(Z, k, P);
}

Crypto.GetAccountId = function(secretPhrase) {
	return GetAccountIdFromPublicKey(GetPublicKey(Convert.StringToHexString(secretPhrase)));
}

Crypto.GetAccountIdFromPublicKey = function(publicKey, RsFormat) {
	var hex = Convert.HexStringToByteArray(publicKey);

	JsSha256.Init();
	JsSha256.Update(hex);

	var account = JsSha256.GetBytes();

	account = Convert.ByteArrayToHexString(account);

	var slice = (Convert.HexStringToByteArray(account)).slice(0, 8);

	var accountId = Convert.ByteArrayToBigInteger(slice).toString();

	if (RsFormat) {
		var address = new LmAddress();

		if (address.set(accountId)) {
			return address.toString();
		} else {
			return "";
		}
	} else {
		return accountId;
	}
}

Crypto.GetMessageDigest = function(algorithm) {
	/*
	try {
		return MessageDigest.getInstance(algorithm);
	} catch (NoSuchAlgorithmException e) {
		Logger.logMessage("Missing message digest algorithm: " + algorithm);
		throw new RuntimeException(e.getMessage(), e);
	}
	*/
	throw new Error('Not implementted');
}

Crypto.GetPublicKey = function(secretPhrase, isAccountNumber) {
	if (isAccountNumber) {
		var accountNumber = secretPhrase;
		var publicKey = "";

		//synchronous!
		Lm.SendRequest("getAccountPublicKey", {
			"account": accountNumber
		}, function(response) {
			if (!response.publicKey) {
				throw $.t("error_no_public_key");
			} else {
				publicKey = response.publicKey;
			}
		}, false);

		return publicKey;
	} else {
		var secretPhraseBytes = Convert.HexStringToByteArray(secretPhrase);
		var digest = SimpleHash(secretPhraseBytes);
		return Convert.ByteArrayToHexString(Curve.keygen(digest).p);
	}
}

Crypto.GetPrivateKey = function(secretPhrase) {
	function Curve25519_clamp(curve) {
		curve[0] &= 0xFFF8;
		curve[15] &= 0x7FFF;
		curve[15] |= 0x4000;
		return curve;
	}

	JsSha256.Init();
	JsSha256.Update(Convert.StringToByteArray(secretPhrase));
	return Convert.ShortArrayToHexString(Curve25519_clamp(Convert.ByteArrayToShortArray(JsSha256.GetBytes())));
}

Crypto.GetSharedSecret = function(myPrivateKey, theirPublicKey) {
	throw new Error('Not implementted');
	/*
	try {
		byte[] sharedSecret = new byte[32];
		Curve25519.curve(sharedSecret, myPrivateKey, theirPublicKey);
		return sharedSecret;
	} catch (RuntimeException e) {
		Logger.logMessage("Error getting shared secret", e);
		throw e;
	}
	*/
}

Crypto.Sha256 = function() {
	return crypto.createHash('sha256');
}

Crypto.Sha256Mesage = function(message) {
	var shasum = crypto.createHash("sha256");
	shasum.update(message);
	return shasum.digest()
}

Crypto.Sign = function(message, secretPhrase) {
	var messageBytes = Convert.HexStringToByteArray(message);
	var secretPhraseBytes = Convert.HexStringToByteArray(secretPhrase);
	var digest = SimpleHash(secretPhraseBytes);
	var s = Curve.keygen(digest).s;
	var m = SimpleHash(messageBytes);
	JsSha256.Init();
	JsSha256.Update(m);
	JsSha256.Update(s);
	var x = JsSha256.GetBytes();
	var y = Curve.keygen(x).p;
	JsSha256.Init();
	JsSha256.Update(m);
	JsSha256.Update(y);
	var h = JsSha256.GetBytes();
	var v = Curve.sign(h, x, s);
	return Convert.ByteArrayToHexString(v.concat(h));
}

Crypto.SignBytes = function(message, secretPhrase) {
	return Sign(message, secretPhrase);
}

Crypto.SimpleHash = function(message) {
	JsSha256.Init();
	JsSha256.Update(message);
	return JsSha256.GetBytes();
}

Crypto.Verify = function(signature, message, publicKey, enforceCanonical) {
	/*
	if (enforceCanonical && !Curve25519.isCanonicalSignature(signature)) {
		Logger.logDebugMessage("Rejecting non-canonical signature");
		return false;
	}

	if (enforceCanonical && !Curve25519.isCanonicalPublicKey(publicKey)) {
		Logger.logDebugMessage("Rejecting non-canonical public key");
		return false;
	}
	*/
	var signatureBytes = Convert.HexStringToByteArray(signature);
	var messageBytes = Convert.HexStringToByteArray(message);
	var publicKeyBytes = Convert.HexStringToByteArray(publicKey);
	var v = signatureBytes.slice(0, 32);
	var h = signatureBytes.slice(32);
	var y = Curve.verify(v, h, publicKeyBytes);
	var m = SimpleHash(messageBytes);
	JsSha256.Init();
	JsSha256.Update(m);
	JsSha256.Update(y);
	var h2 = JsSha256.GetBytes();
	return AreByteArraysEqual(h, h2);
}

Crypto.VerifyBytes = function(signature, message, publicKey) {
	return Verify(signature, message, publicKey);
}

// deprecated
Crypto.XorDecrypt = function(data, position, length, myPrivateKey, theirPublicKey, nonce) {
	throw new Error('Not implementted');
	/*
	xorProcess(data, position, length, myPrivateKey, theirPublicKey, nonce);
	*/
}

// deprecated
Crypto.XorEncrypt = function(data, position, length, myPrivateKey, theirPublicKey) {
	throw new Error('Not implementted');
	/*
	byte[] nonce = new byte[32];
	secureRandom.get().nextBytes(nonce); // cfb: May block as entropy is being gathered, for example, if they need to read from /dev/random on various unix-like operating systems
	xorProcess(data, position, length, myPrivateKey, theirPublicKey, nonce);
	return nonce;
	*/
}

Crypto.XorProcess = function(data, position, length, myPrivateKey, theirPublicKey, nonce) {
	throw new Error('Not implementted');
	/*
	byte[] seed = new byte[32];
	Curve25519.curve(seed, myPrivateKey, theirPublicKey);
	for (int i = 0; i < 32; i++) {
		seed[i] ^= nonce[i];
	}

	MessageDigest sha256 = sha256();
	seed = sha256.digest(seed);

	for (int i = 0; i < length / 32; i++) {
		byte[] key = sha256.digest(seed);
		for (int j = 0; j < 32; j++) {
			data[position++] ^= key[j];
			seed[j] = (byte)(~seed[j]);
		}
		seed = sha256.digest(seed);
	}
	byte[] key = sha256.digest(seed);
	for (int i = 0; i < length % 32; i++) {
		data[position++] ^= key[i];
	}
	*/
}


if (typeof module !== "undefined") {
	module.exports = Crypto;
}
