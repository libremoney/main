/*
import nxt.crypto.Crypto;
import nxt.util.Convert;
import org.json.simple.JSONObject;
import org.json.simple.JSONStreamAware;
import static nxt.http.JSONResponses.MISSING_SIGNATURE_HASH;
import static nxt.http.JSONResponses.MISSING_UNSIGNED_BYTES;
*/

function Main(req, res) {
	//static final CalculateFullHash instance = new CalculateFullHash();
	res.send('This is not implemented');    

	/*
	private CalculateFullHash() {
		super("unsignedTransactionBytes", "signatureHash");
	}

	JSONStreamAware processRequest(HttpServletRequest req) {
		String unsignedBytesString = Convert.emptyToNull(req.getParameter("unsignedTransactionBytes"));
		String signatureHashString = Convert.emptyToNull(req.getParameter("signatureHash"));

		if (unsignedBytesString == null) {
			return MISSING_UNSIGNED_BYTES;
		} else if (signatureHashString == null) {
			return MISSING_SIGNATURE_HASH;
		}
		MessageDigest digest = Crypto.sha256();
		digest.update(Convert.parseHexString(unsignedBytesString));
		byte[] fullHash = digest.digest(Convert.parseHexString(signatureHashString));
		JSONObject response = new JSONObject();
		response.put("fullHash", Convert.toHexString(fullHash));
		return response;
	}
	*/
}

module.exports = Main;
