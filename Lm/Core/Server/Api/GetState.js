/**!
 * LibreMoney GetState api 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var Blockchain = require(__dirname + '/../../Blockchain');
var BlockchainProcessor = require(__dirname + '/../../BlockchainProcessor');
var Convert = require(__dirname + '/../../../Lib/Util/Convert');
var Core = require(__dirname + '/../../Core');
var Logger = require(__dirname + '/../../../Lib/Util/Logger').GetLogger(module);


//super(new APITag[] {APITag.INFO});
function GetState(req, res) {
	var response = {};

	response.application = Core.GetApplication();
	response.version = Core.GetVersion();
	response.time = Convert.GetEpochTime();
	response.lastBlock = Blockchain.GetLastBlock().GetStringId();
	response.cumulativeDifficulty = Blockchain.GetLastBlock().GetCumulativeDifficulty().toString();
	response.numberOfBlocks = Blockchain.GetHeight() + 1;
	response.numberOfTransactions = Blockchain.GetTransactionCount(function(err, count) {
		if (err) {
			res.send('Error');
			Logger.warn('Error');
			return;
		}

		Core.DoGetState(response);

		var lastBlockchainFeeder = BlockchainProcessor.GetLastBlockchainFeeder();
		response.lastBlockchainFeeder = (lastBlockchainFeeder == null ? null : lastBlockchainFeeder.GetAnnouncedAddress());
		response.lastBlockchainFeederHeight = BlockchainProcessor.GetLastBlockchainFeederHeight();
		response.isScanning = BlockchainProcessor.IsScanning();
		response.availableProcessors = 1; //Runtime.getRuntime().availableProcessors();
		response.maxMemory = 1; //Runtime.getRuntime().maxMemory();
		response.totalMemory = 1; //Runtime.getRuntime().totalMemory();
		response.freeMemory = 1; //Runtime.getRuntime().freeMemory();

		res.send(response);
	});
	return true;
}


module.exports = GetState;
