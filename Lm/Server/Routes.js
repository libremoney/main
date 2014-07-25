/**!
 * LibreMoney 0.0.1
 * Author: Prof1983 <prof1983@yandex.ru>
 * License: CC0
 */

/*
var apiHandlers = [
	{addr:'', func:Api.GetMain);
	{addr:'/user/:id', func:Api.GetUser);
	{addr:'/users', func:Api.GetUsers);
	{addr:"/broadcastTransaction", func:Api.BroadcastTransaction);
	{addr:"/calculateFullHash", func:Api.CalculateFullHash);
	{addr:"/cancelAskOrder", func:Api.CancelAskOrder);
	{addr:"/cancelBidOrder", func:Api.CancelBidOrder);
	{addr:"/castVote", func:Api.CastVote);
	{addr:"/createPoll", func:Api.CreatePoll);
	{addr:"/createTransaction", func:Api.CreateTransaction); // !!!!
	{addr:"/decodeHallmark", func:Api.DecodeHallmark);
	{addr:"/decodeToken", func:Api.DecodeToken);
	{addr:"/generateToken", func:Api.GenerateToken);
	{addr:"/getAccount", func:Api.GetAccount);
	{addr:"/getAccountBlockIds", func:Api.GetAccountBlockIds);
	{addr:"/getAccountId", func:Api.GetAccountId);
	{addr:"/getAccountPublicKey", func:Api.GetAccountPublicKey);
	{addr:"/getAccountTransactionIds", func:Api.GetAccountTransactionIds);
	{addr:"/getAlias", func:Api.GetAlias);
	{addr:"/getAliases", func:Api.GetAliases);
	{addr:"/getAllAssets", func:Api.GetAllAssets);
	{addr:"/getAsset", func:Api.GetAsset);
	{addr:"/getAssets", func:Api.GetAssets);
	{addr:"/getAssetIds", func:Api.GetAssetIds);
	{addr:"/getAssetsByIssuer", func:Api.GetAssetsByIssuer);
	{addr:"/getBalance", func:Api.GetBalance);
	{addr:"/getBlock", func:Api.GetBlock);
	{addr:"/getBlockchainStatus", func:Api.GetBlockchainStatus);
	{addr:"/getConstants", func:Api.GetConstants);
	{addr:"/getGuaranteedBalance", func:Api.GetGuaranteedBalance);
	{addr:"/getMyInfo", func:Api.GetMyInfo);
	{addr:"/getNextBlockGenerators", func:Api.GetNextBlockGenerators); // isTestnet
	{addr:"/getPeer", func:Api.GetPeer);
	{addr:"/getPeers", func:Api.GetPeers);
	{addr:"/getPoll", func:Api.GetPoll);
	{addr:"/getPollIds", func:Api.GetPollIds);
	{addr:"/getProjectList", func:Api.GetProjectList);
	{addr:"/getProjectListHtml", func:Api.GetProjectListHtml);
	{addr:"/getState", func:Api.GetState);
	{addr:"/getTime", func:Api.GetTime);
	{addr:"/getTrades", func:Api.GetTrades);
	{addr:"/getAllTrades", func:Api.GetAllTrades);
	{addr:"/getTransaction", func:Api.GetTransaction);
	{addr:"/getTransactionBytes", func:Api.GetTransactionBytes);
	{addr:"/getUnconfirmedTransactionIds", func:Api.GetUnconfirmedTransactionIds);
	{addr:"/getUnconfirmedTransactions", func:Api.GetUnconfirmedTransactions);
	{addr:"/getAccountCurrentAskOrderIds", func:Api.GetAccountCurrentAskOrderIds);
	{addr:"/getAccountCurrentBidOrderIds", func:Api.GetAccountCurrentBidOrderIds);
	{addr:"/getAllOpenOrders", func:Api.GetAllOpenOrders);
	{addr:"/getAskOrder", func:Api.GetAskOrder);
	{addr:"/getAskOrderIds", func:Api.GetAskOrderIds);
	{addr:"/getAskOrders", func:Api.GetAskOrders);
	{addr:"/getBidOrder", func:Api.GetBidOrder);
	{addr:"/getBidOrderIds", func:Api.GetBidOrderIds);
	{addr:"/getBidOrders", func:Api.GetBidOrders);
	{addr:"/issueAsset", func:Api.IssueAsset);
	{addr:"/leaseBalance", func:Api.LeaseBalance);
	{addr:"/markHost", func:Api.MarkHost);
	{addr:"/parseTransaction", func:Api.ParseTransaction);
	{addr:"/placeAskOrder", func:Api.PlaceAskOrder);
	{addr:"/placeBidOrder", func:Api.PlaceBidOrder);
	{addr:"/sendMessage", func:Api.SendMessage);
	{addr:"/sendMoney", func:Api.SendMoney);
	{addr:"/setAccountInfo", func:Api.SetAccountInfo);
	{addr:"/setAlias", func:Api.SetAlias);
	{addr:"/signTransaction", func:Api.SignTransaction);
	{addr:"/startForging", func:Api.StartForging);
	{addr:"/stopForging", func:Api.StopForging);
	{addr:"/getForging", func:Api.GetForging);
	{addr:"/transferAsset", func:Api.TransferAsset);
	];
*/


function Setup(app) {
	/*
	// Инициализируем Handlers
	var handlers = {
		//community: require('./handlers/community'),
		//users: require('./handlers/users'),
		entities: require('./handlers/entities')
	}


	app.get('/community', handlers.community.list);
	app.get('/community/:id', handlers.community.get);
	app.post('/community', handlers.community.create);
	app.get('/user/:id', handlers.users.get);
	app.put('/user/:id', handlers.users.update);
	app.delete('/user/:id', handlers.users.remove);
	app.get('/users', handlers.users.list);
	app.post('/users', handlers.users.create);
	app.get('/v1/entities', handlers.entities.list);
	app.get('/v1/entities/:id', handlers.entities.get);
	app.post('/v1/entities', handlers.entities.create);
	//app.put('/v1/entities/:id', handlers.entities.update);
	//app.delete('/v1/entities/:id', handlers.entities.remove);
	*/
};

module.exports.Setup = Setup;
