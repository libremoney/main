/**!
 * LibreMoney GetBlockchainStatus api 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var Blockchain = require(__dirname + '/../../Blockchain');
var BlockchainProcessor = require(__dirname + '/../../BlockchainProcessor');
var Convert = require(__dirname + '/../../Util/Convert');
var Core = require(__dirname + '/../../Core');

//super(new APITag[] {APITag.BLOCKS, APITag.INFO});
function GetBlockchainStatus(req, res) {
	var lastBlock = Blockchain.GetLastBlock();
	var lastBlockchainFeeder = BlockchainProcessor.GetLastBlockchainFeeder();
	response = {
		application: Core.GetApplication(),
		version: Core.GetVersion(),
		time: "0", //Convert.getEpochTime()
		lastBlock: "", //lastBlock.GetStringId()
		cumulativeDifficulty: "", //lastBlock.GetCumulativeDifficulty().ToString()
		numberOfBlocks: 1, //lastBlock.GetHeight() + 1
		lastBlockchainFeeder: "", //lastBlockchainFeeder == null ? null : lastBlockchainFeeder.getAnnouncedAddress()
		lastBlockchainFeederHeight: "", //BlockchainProcessor.GetLastBlockchainFeederHeight()
		IsScanning: "" //BlockchainProcessor.IsScanning()
	};

	//console.log(response);
	res.send(response);
	//res.send('{"version": "0"}');
	//res.send('This is not implemented');
}

module.exports = GetBlockchainStatus;
