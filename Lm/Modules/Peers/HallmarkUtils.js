/**!
 * LibreMoney Hallmark 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */


var HallmarkUtils = function() {
	function GenerateHallmark(secretPhrase, host, weight, date) {
		/*
		if (host.length() == 0 || host.length() > 100) {
			throw new IllegalArgumentException("Hostname length should be between 1 and 100");
		}
		if (weight <= 0 || weight > Constants.MAX_BALANCE_NXT) {
			throw new IllegalArgumentException("Weight should be between 1 and " + Constants.MAX_BALANCE_NXT);
		}

		byte[] publicKey = Crypto.getPublicKey(secretPhrase);
		byte[] hostBytes = Convert.toBytes(host);

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
		String host = Convert.toString(hostBytes);
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
		*/
	}


	return {
		GenerateHallmark: GenerateHallmark,
		ParseDate: ParseDate,
		ParseHallmark: ParseHallmark
	}
}();


if (typeof module !== "undefined") {
	module.exports = HallmarkUtils;
}
