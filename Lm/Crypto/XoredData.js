/**!
 * LibreMoney XoredData 0.0
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

function XoredData(data, nonce) {
	this.data = data;
	this.nonce = nonce;
	return this;
}

function Encrypt(plaintext, myPrivateKey, theirPublicKey) {
	throw new Error('Not implementted');
	/*
	byte[] nonce = Crypto.xorEncrypt(plaintext, 0, plaintext.length, myPrivateKey, theirPublicKey);
	return new XoredData(plaintext, nonce);
	*/
}

function Decrypt(myPrivateKey, theirPublicKey) {
	throw new Error('Not implementted');
	/*
	byte[] ciphertext = new byte[getData().length];
	System.arraycopy(getData(), 0, ciphertext, 0, ciphertext.length);
	Crypto.xorDecrypt(ciphertext, 0, ciphertext.length, myPrivateKey, theirPublicKey, getNonce());
	return ciphertext;
	*/
}

function GetData() {
	return this.data;
}

function GetNonce() {
	return this.nonce;
}


XoredData.prototype.Decrypt = Decrypt;
XoredData.prototype.Encrypt = Encrypt;
XoredData.prototype.GetData = GetData;
XoredData.prototype.GetNonce = GetNonce;


module.exports = XoredData;
