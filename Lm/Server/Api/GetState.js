/**!
 * LibreMoney GetState api 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var Aliases = require(__dirname + '/../../Aliases');
var Assets = require(__dirname + '/../../Assets');
var Blockchain = require(__dirname + '/../../Blockchain');
var BlockchainProcessor = require(__dirname + '/../../BlockchainProcessor');
var Convert = require(__dirname + '/../../Util/Convert');
var Core = require(__dirname + '/../../Core');
var Generators = require(__dirname + '/../../Generators');
var Logger = require(__dirname + '/../../Logger').GetLogger(module);
var Orders = require(__dirname + '/../../Orders');
var Peers = require(__dirname + '/../../Peers');
var Trades = require(__dirname + '/../../Trades');
var Votes = require(__dirname + '/../../Votes');


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

		response.numberOfAssets = Assets.GetAllAssets().length;
		response.numberOfOrders = Orders.Ask.GetAllAskOrders().length + Orders.Bid.GetAllBidOrders().length;
		var numberOfTrades = 0;
		for (var assetTrades in Trades.GetAllTrades()) {
			numberOfTrades += assetTrades.length;
		}
		response.numberOfTrades = numberOfTrades;
		response.numberOfAliases = Aliases.GetAllAliases().length;
		response.numberOfVotes = Votes.GetVotes().length;
		response.numberOfPeers = Peers.GetAllPeers().length;
		response.numberOfUnlockedAccounts = Generators.GetAllGenerators().length;
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
