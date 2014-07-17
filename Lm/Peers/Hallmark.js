/*
import nxt.Account;
import nxt.Constants;
import nxt.crypto.Crypto;
import nxt.util.Convert;
*/


function FormatDate(date) {
	/*
	int year = date / 10000;
	int month = (date % 10000) / 100;
	int day = date % 100;
	return (year < 10 ? "000" : (year < 100 ? "00" : (year < 1000 ? "0" : ""))) + year + "-" + (month < 10 ? "0" : "") + month + "-" + (day < 10 ? "0" : "") + day;
	*/
}

function GenerateHallmark(secretPhrase, host, weight, date) {
	/*
	try {
		if (host.length() == 0 || host.length() > 100) {
			throw new IllegalArgumentException("Hostname length should be between 1 and 100");
		}
		if (weight <= 0 || weight > Constants.MAX_BALANCE_NXT) {
			throw new IllegalArgumentException("Weight should be between 1 and " + Constants.MAX_BALANCE_NXT);
		}

		byte[] publicKey = Crypto.getPublicKey(secretPhrase);
		byte[] hostBytes = host.getBytes("UTF-8");

		ByteBuffer buffer = ByteBuffer.allocate(32 + 2 + hostBytes.length + 4 + 4 + 1);
		buffer.order(ByteOrder.LITTLE_ENDIAN);
		buffer.put(publicKey);
		buffer.putShort((short)hostBytes.length);
		buffer.put(hostBytes);
		buffer.putInt(weight);
		buffer.putInt(date);

		byte[] data = buffer.array();
		data[data.length - 1] = (byte) ThreadLocalRandom.current().nextInt();
		byte[] signature = Crypto.sign(data, secretPhrase);

		return Convert.toHexString(data) + Convert.toHexString(signature);
	} catch (UnsupportedEncodingException e) {
		throw new RuntimeException(e.toString(), e);
	}
	*/
}

function ParseDate(dateValue) {
	/*
	return Integer.parseInt(dateValue.substring(0, 4)) * 10000
			+ Integer.parseInt(dateValue.substring(5, 7)) * 100
			+ Integer.parseInt(dateValue.substring(8, 10));
	*/
}

function ParseHallmark(hallmarkString) {
	/*
	try {
		byte[] hallmarkBytes = Convert.parseHexString(hallmarkString);

		ByteBuffer buffer = ByteBuffer.wrap(hallmarkBytes);
		buffer.order(ByteOrder.LITTLE_ENDIAN);

		byte[] publicKey = new byte[32];
		buffer.get(publicKey);
		int hostLength = buffer.getShort();
		if (hostLength > 300) {
			throw new IllegalArgumentException("Invalid host length");
		}
		byte[] hostBytes = new byte[hostLength];
		buffer.get(hostBytes);
		String host = new String(hostBytes, "UTF-8");
		int weight = buffer.getInt();
		int date = buffer.getInt();
		buffer.get();
		byte[] signature = new byte[64];
		buffer.get(signature);

		byte[] data = new byte[hallmarkBytes.length - 64];
		System.arraycopy(hallmarkBytes, 0, data, 0, data.length);

		boolean isValid = host.length() < 100 && weight > 0 && weight <= Constants.MAX_BALANCE_NXT
				&& Crypto.verify(signature, data, publicKey, true);

		return new Hallmark(hallmarkString, publicKey, signature, host, weight, date, isValid);
	} catch (UnsupportedEncodingException e) {
		throw new RuntimeException(e.toString(), e);
	}
	*/
}


/*
private final String hallmarkString;
private final String host;
private final int weight;
private final int date;
private final byte[] publicKey;
private final Long accountId;
private final byte[] signature;
private final boolean isValid;
*/

function Hallmark(hallmarkString, publicKey, signature, host, weight, date, isValid) {
	this.hallmarkString = hallmarkString;
	this.host = host;
	this.publicKey = publicKey;
	this.accountId = Account.getId(publicKey);
	this.signature = signature;
	this.weight = weight;
	this.date = date;
	this.isValid = isValid;
	return this;
}

function GetAccountId() {
	/*
	return accountId;
	*/
}

function GetDate() {
	/*
	return date;
	*/
}

function GetHallmarkString() {
	/*
	return hallmarkString;
	*/
}

function GetHost() {
	/*
	return host;
	*/
}

function GetPublicKey() {
	/*
	return publicKey;
	*/
}

function GetSignature() {
	/*
	return signature;
	*/
}

function GetWeight() {
	/*
	return weight;
	*/
}

function IsValid() {
	/*
	return isValid;
	*/
}


Hallmark.prototype.GetHallmarkString = GetHallmarkString;
Hallmark.prototype.GetHost = GetHost;
Hallmark.prototype.GetWeight = GetWeight;
Hallmarl.prototype.GetDate = GetDate;
Hallmark.prototype.GetSignature = GetSignature;
Hallmark.prototype.GetPublicKey = GetPublicKey;
Hallmark.prototype.GetAccountId = GetAccountId;
Hallmark.prototype.IsValid = IsValid;


exports.Create = Hallmark;
exports.FormatDate = FormatDate;
exports.GenerateHallmark = GenerateHallmark;
exports.ParseDate = ParseDate;
exports.ParseHallmark = ParseHallmark;
