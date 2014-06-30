/*
import nxt.Block;
import nxt.BlockchainProcessor;
import nxt.Nxt;
import nxt.peer.Peer;
import nxt.util.Convert;
*/

function Main(req, res) {
	//static final GetBlockchainStatus instance = new GetBlockchainStatus();
	res.send('This is not implemented');
	/*
	private GetBlockchainStatus() {}

	JSONStreamAware processRequest(HttpServletRequest req) {
		JSONObject response = new JSONObject();
		response.put("version", Nxt.VERSION);
		response.put("time", Convert.getEpochTime());
		Block lastBlock = Nxt.getBlockchain().getLastBlock();
		response.put("lastBlock", lastBlock.getStringId());
		response.put("cumulativeDifficulty", lastBlock.getCumulativeDifficulty().toString());
		response.put("numberOfBlocks", lastBlock.getHeight() + 1);
		BlockchainProcessor blockchainProcessor = Nxt.getBlockchainProcessor();
		Peer lastBlockchainFeeder = blockchainProcessor.getLastBlockchainFeeder();
		response.put("lastBlockchainFeeder", lastBlockchainFeeder == null ? null : lastBlockchainFeeder.getAnnouncedAddress());
		response.put("lastBlockchainFeederHeight", blockchainProcessor.getLastBlockchainFeederHeight());
		response.put("isScanning", blockchainProcessor.isScanning());
		return response;
	}
	*/
}

module.exports = Main;
