/**!
 * LibreMoney 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */


/*
import org.bouncycastle.crypto.CipherParameters;
import org.bouncycastle.crypto.InvalidCipherTextException;
import org.bouncycastle.crypto.engines.AESEngine;
import org.bouncycastle.crypto.modes.CBCBlockCipher;
import org.bouncycastle.crypto.paddings.PaddedBufferedBlockCipher;
import org.bouncycastle.crypto.params.KeyParameter;
import org.bouncycastle.crypto.params.ParametersWithIV;
*/

var crypto = require('crypto');
var ReedSolomon = require(__dirname + '/ReedSolomon');
var Logger = require(__dirname + '/../Logger').GetLogger(module);


/*
private static final ThreadLocal<SecureRandom> secureRandom = new ThreadLocal<SecureRandom>() {
	@Override
	protected SecureRandom initialValue() {
		return new SecureRandom();
	}
}
*/

function GetMessageDigest(algorithm) {
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

function Sha256() {
	return crypto.createHash('sha256');
	//return GetMessageDigest("SHA-256");
	/*
	var hash = crypto.createHash('sha256').update(pwd).digest('base64');
	*/
}


function GetPublicKey(secretPhrase) {
	throw new Error('Not implementted');
	/*
	byte[] publicKey = new byte[32];
	Curve25519.keygen(publicKey, null, Crypto.sha256().digest(Convert.toBytes(secretPhrase)));
	return publicKey;
	*/
}

function GetPrivateKey(secretPhrase) {
	throw new Error('Not implementted');
	/*
	byte[] s = Crypto.sha256().digest(Convert.toBytes(secretPhrase));
	Curve25519.clamp(s);
	return s;
	*/
}

function Curve(Z, k, P) {
	throw new Error('Not implementted');
	/*
	Curve25519.curve(Z, k, P);
	*/
}

function Sign(message, secretPhrase) {
	throw new Error('Not implementted');
	/*
	byte[] P = new byte[32];
	byte[] s = new byte[32];
	MessageDigest digest = Crypto.sha256();
	Curve25519.keygen(P, s, digest.digest(Convert.toBytes(secretPhrase)));

	byte[] m = digest.digest(message);

	digest.update(m);
	byte[] x = digest.digest(s);

	byte[] Y = new byte[32];
	Curve25519.keygen(Y, null, x);

	digest.update(m);
	byte[] h = digest.digest(Y);

	byte[] v = new byte[32];
	Curve25519.sign(v, h, x, s);

	byte[] signature = new byte[64];
	System.arraycopy(v, 0, signature, 0, 32);
	System.arraycopy(h, 0, signature, 32, 32);

	return signature;
	*/
}

function Verify(signature, message, publicKey, enforceCanonical) {
	throw new Error('Not implementted');
	/*
	if (enforceCanonical && !Curve25519.isCanonicalSignature(signature)) {
		Logger.logDebugMessage("Rejecting non-canonical signature");
		return false;
	}

	if (enforceCanonical && !Curve25519.isCanonicalPublicKey(publicKey)) {
		Logger.logDebugMessage("Rejecting non-canonical public key");
		return false;
	}

	byte[] Y = new byte[32];
	byte[] v = new byte[32];
	System.arraycopy(signature, 0, v, 0, 32);
	byte[] h = new byte[32];
	System.arraycopy(signature, 32, h, 0, 32);
	Curve25519.verify(Y, v, h, publicKey);

	MessageDigest digest = Crypto.sha256();
	byte[] m = digest.digest(message);
	digest.update(m);
	byte[] h2 = digest.digest(Y);

	return Arrays.equals(h, h2);
	*/
}

function AesEncrypt(plaintext, myPrivateKey, theirPublicKey) {
	return AesEncrypt2(plaintext, myPrivateKey, theirPublicKey, []);
	/*
	try {
		byte[] dhSharedSecret = new byte[32];
		Curve25519.curve(dhSharedSecret, myPrivateKey, theirPublicKey);
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

function AesEncrypt2(plaintext, myPrivateKey, theirPublicKey, nonce) {
	throw new Error('Not implementted');
	/*
	try {
		byte[] dhSharedSecret = new byte[32];
		Curve25519.curve(dhSharedSecret, myPrivateKey, theirPublicKey);
		for (int i = 0; i < 32; i++) {
			dhSharedSecret[i] ^= nonce[i];
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

function AesDecrypt(ivCiphertext, myPrivateKey, theirPublicKey) {
	return AesDecrypt2(ivCiphertext, myPrivateKey, theirPublicKey, []);
}

function AesDecrypt2(ivCiphertext, myPrivateKey, theirPublicKey, nonce) {
	throw new Error('Not implementted');
	/*
	try {
		if (ivCiphertext.length < 16 || ivCiphertext.length % 16 != 0) {
			throw new InvalidCipherTextException("invalid ciphertext");
		}
		byte[] iv = Arrays.copyOfRange(ivCiphertext, 0, 16);
		byte[] ciphertext = Arrays.copyOfRange(ivCiphertext, 16, ivCiphertext.length);
		byte[] dhSharedSecret = new byte[32];
		Curve25519.curve(dhSharedSecret, myPrivateKey, theirPublicKey);
		for (int i = 0; i < 32; i++) {
			dhSharedSecret[i] ^= nonce[i];
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

function XorProcess(data, position, length, myPrivateKey, theirPublicKey, nonce) {
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

// deprecated
function XorEncrypt(data, position, length, myPrivateKey, theirPublicKey) {
	throw new Error('Not implementted');
	/*
	byte[] nonce = new byte[32];
	secureRandom.get().nextBytes(nonce); // cfb: May block as entropy is being gathered, for example, if they need to read from /dev/random on various unix-like operating systems
	xorProcess(data, position, length, myPrivateKey, theirPublicKey, nonce);
	return nonce;
	*/
}

// deprecated
function XorDecrypt(data, position, length, myPrivateKey, theirPublicKey, nonce) {
	throw new Error('Not implementted');
	/*
	xorProcess(data, position, length, myPrivateKey, theirPublicKey, nonce);
	*/
}

function GetSharedSecret(myPrivateKey, theirPublicKey) {
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

// id - BigInt
function RsEncode(id) {
	return ReedSolomon.EncodeBigInt(id);
}

function RsDecode(rsString) {
	rsString = rsString.toUpperCase();
	id = ReedSolomon.Decode(rsString);
	if (rsString != ReedSolomon.Encode(id)) {
		throw new Error("ERROR: Reed-Solomon decoding of " + rsString + " not reversible, decoded to " + id);
	}
	return id;
}


exports.AesDecrypt = AesDecrypt;
exports.AesDecrypt2 = AesDecrypt2;
exports.AesEncrypt = AesEncrypt;
exports.AesEncrypt2 = AesEncrypt2;
exports.Curve = Curve;
exports.GetMessageDigest = GetMessageDigest;
exports.GetPrivateKey = GetPrivateKey;
exports.GetPublicKey = GetPublicKey;
exports.RsDecode = RsDecode;
exports.RsEncode = RsEncode;
exports.Sha256 = Sha256;
exports.Sign = Sign;
exports.Verify = Verify;
exports.XorDecrypt = XorDecrypt;
exports.XorEncrypt = XorEncrypt;
exports.XorProcess = XorProcess;
