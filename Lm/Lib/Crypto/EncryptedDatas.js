/**!
 * LibreMoney 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

/*
private static final ThreadLocal<SecureRandom> secureRandom = new ThreadLocal<SecureRandom>() {
	@Override
	protected SecureRandom initialValue() {
		return new SecureRandom();
	}
};
*/

/*
public static final EncryptedData EMPTY_DATA = new EncryptedData(new byte[0], new byte[0]);
*/

function Encrypt(plaintext, myPrivateKey, theirPublicKey) {
	throw new Error('Not implementted');
	/*
	if (plaintext.length == 0) {
		return EMPTY_DATA;
	}
	try (ByteArrayOutputStream bos = new ByteArrayOutputStream();
		 GZIPOutputStream gzip = new GZIPOutputStream(bos)) {
		gzip.write(plaintext);
		gzip.flush();
		gzip.close();
		byte[] compressedPlaintext = bos.toByteArray();
		byte[] nonce = new byte[32];
		secureRandom.get().nextBytes(nonce);
		byte[] data = Crypto.aesEncrypt(compressedPlaintext, myPrivateKey, theirPublicKey, nonce);
		return new EncryptedData(data, nonce);
	} catch (IOException e) {
		throw new RuntimeException(e.getMessage(), e);
	}
	*/
}

function ReadEncryptedData(buffer, length, maxLength)
	throw new Error('Not implementted');
	/*
		throws NxtException.NotValidException {
	if (length == 0) {
		return EMPTY_DATA;
	}
	if (length > maxLength) {
		throw new NxtException.NotValidException("Max encrypted data length exceeded: " + length);
	}
	byte[] noteBytes = new byte[length];
	buffer.get(noteBytes);
	byte[] noteNonceBytes = new byte[32];
	buffer.get(noteNonceBytes);
	return new EncryptedData(noteBytes, noteNonceBytes);
	*/
}


exports.Encrypt = Encrypt;
exports.ReadEncryptedData = ReadEncryptedData;
