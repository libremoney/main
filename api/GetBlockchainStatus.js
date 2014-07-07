/*
import nxt.Block;
import nxt.BlockchainProcessor;
import nxt.Nxt;
import nxt.peer.Peer;
import nxt.util.Convert;
*/

function Main(req, res) {
	//static final GetBlockchainStatus instance = new GetBlockchainStatus();

	//var lastBlock = Lm.GetBlockchain().GetLastBlock();
	//var blockchainProcessor = Lm.GetBlockchainProcessor();
	//var lastBlockchainFeeder = blockchainProcessor.GetLastBlockchainFeeder();
	response = {
		version: "0",
		time: "0", //Convert.getEpochTime()
		lastBlock: "", //lastBlock.GetStringId()
		cumulativeDifficulty: "", //lastBlock.GetCumulativeDifficulty().ToString()
		numberOfBlocks: 1, //lastBlock.GetHeight() + 1
		lastBlockchainFeeder: "", //lastBlockchainFeeder == null ? null : lastBlockchainFeeder.getAnnouncedAddress()
		lastBlockchainFeederHeight: "", //blockchainProcessor.getLastBlockchainFeederHeight()
		IsScanning: "" //blockchainProcessor.IsScanning()
	};

	//console.log(response);
	res.send(response);
	//res.send('{"version": "0"}');
	//res.send('This is not implemented');
}

module.exports = Main;
