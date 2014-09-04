/**!
 * LibreMoney 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

function EncryptedData(data, nonce) {
	this.data = data;
	this.nonce = nonce;
}

function Decrypt(myPrivateKey, theirPublicKey) {
	throw new Error('Not implementted');
	/*
	if (data.length == 0) {
		return data;
	}
	byte[] compressedPlaintext = Crypto.aesDecrypt(data, myPrivateKey, theirPublicKey, nonce);
	try (ByteArrayInputStream bis = new ByteArrayInputStream(compressedPlaintext);
		 GZIPInputStream gzip = new GZIPInputStream(bis);
		 ByteArrayOutputStream bos = new ByteArrayOutputStream()) {
		byte[] buffer = new byte[1024];
		int nRead;
		while ((nRead = gzip.read(buffer, 0, buffer.length)) > 0) {
			bos.write(buffer, 0, nRead);
		}
		bos.flush();
		return bos.toByteArray();
	} catch (IOException e) {
		throw new RuntimeException(e.getMessage(), e);
	}
	*/
}

function GetData() {
	return this.data;
}

function GetNonce() {
	return this.nonce;
}

function GetSize() {
	return this.data.length + this.nonce.length;
}


EncryptedData.prototype.Decrypt = Decrypt;
EncryptedData.prototype.GetData = GetData;
EncryptedData.prototype.GetNonce = GetNonce;
EncryptedData.prototype.GetSize = GetSize;


module.exports = EncryptedData;
