/**!
 * LibreMoney api 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var Logger = require(__dirname + '/../../Logger').GetLogger(module);


function DeleteUser(req, res) {
	res.send('This is not implemented now /api/user/:id');
}

function GetMain(req, res) {
	var S = '';
	for(var i = 0; i <= req.length; i++) {
		S = S + req[i];
	}
	res.send('<!DOCTYPE html><html><body>LibreMoney API<br/>'+S+'</body></html>');
	//res.send('<html><body>users, user/:id</body></html>');
}

function GetUser(req, res) {
	res.send('This is not implemented now /api/user/:id');
}

function GetUsers(req, res) {
	res.send('This is not implemented now /api/users');
}

function PostMain(req, res) {
}

function PostUsers(req, res) {
	res.send('This is not implemented now /api/users');
}

function PutUser(req, res) {
	res.send('This is not implemented now /api/user/:id');
}


exports.DeleteUser = DeleteUser;
exports.GetMain = GetMain;
exports.GetUser = GetUser;
exports.GetUsers = GetUsers;
exports.Main = require(__dirname + '/Main'); // POST
exports.PostUsers = PostUsers;
exports.PutUser = PutUser;

exports.BroadcastTransaction = require(__dirname + '/BroadcastTransaction');
exports.BuyAlias = require(__dirname + '/BuyAlias');
exports.CalculateFullHash = require(__dirname + '/CalculateFullHash');
exports.CancelAskOrder = require(__dirname + '/CancelAskOrder');
exports.CancelBidOrder = require(__dirname + '/CancelBidOrder');
exports.CastVote = require(__dirname + '/CastVote');
exports.CreatePoll = require(__dirname + '/CreatePoll');
//exports.CreateTransaction = require(__dirname + '/CreateTransaction'); // !!!!
exports.DecodeHallmark = require(__dirname + '/DecodeHallmark');
exports.DecodeToken = require(__dirname + '/DecodeToken');
exports.DecryptFrom = require(__dirname + '/DecryptFrom');
exports.DgsDelisting = require(__dirname + '/DgsDelisting');
exports.DgsDelivery = require(__dirname + '/DgsDelivery');
exports.DgsFeedback = require(__dirname + '/DgsFeedback');
exports.DgsListing = require(__dirname + '/DgsListing');
exports.DgsPriceChange = require(__dirname + '/DgsPriceChange');
exports.DgsPurchase = require(__dirname + '/DgsPurchase');
exports.DgsQuantityChange = require(__dirname + '/DgsQuantityChange');
exports.DgsRefund = require(__dirname + '/DgsRefund');
exports.EncryptTo = require(__dirname + '/EncryptTo');
exports.GenerateToken = require(__dirname + '/GenerateToken');
exports.GetAccount = require(__dirname + '/GetAccount');
exports.GetAccountBlockIds = require(__dirname + '/GetAccountBlockIds');
exports.GetAccountCurrentAskOrderIds = require(__dirname + '/GetAccountCurrentAskOrderIds');
exports.GetAccountCurrentBidOrderIds = require(__dirname + '/GetAccountCurrentBidOrderIds');
exports.GetAccountId = require(__dirname + '/GetAccountId');
exports.GetAccountPublicKey = require(__dirname + '/GetAccountPublicKey');
exports.GetAccountTransactionIds = require(__dirname + '/GetAccountTransactionIds');
exports.GetAccountTransactions = require(__dirname + '/GetAccountTransactions');
exports.GetAlias = require(__dirname + '/GetAlias');
exports.GetAliases = require(__dirname + '/GetAliases');
exports.GetAllAssets = require(__dirname + '/GetAllAssets');
exports.GetAllOpenOrders = require(__dirname + '/GetAllOpenOrders');
exports.GetAllTrades = require(__dirname + '/GetAllTrades');
exports.GetAskOrder = require(__dirname + '/GetAskOrder');
exports.GetAskOrderIds = require(__dirname + '/GetAskOrderIds');
exports.GetAskOrders = require(__dirname + '/GetAskOrders');
exports.GetAsset = require(__dirname + '/GetAsset');
exports.GetAssetIds = require(__dirname + '/GetAssetIds');
exports.GetAssets = require(__dirname + '/GetAssets');
exports.GetAssetsByIssuer = require(__dirname + '/GetAssetsByIssuer');
exports.GetBalance = require(__dirname + '/GetBalance');
exports.GetBidOrder = require(__dirname + '/GetBidOrder');
exports.GetBidOrderIds = require(__dirname + '/GetBidOrderIds');
exports.GetBidOrders = require(__dirname + '/GetBidOrders');
exports.GetBlock = require(__dirname + '/GetBlock');
exports.GetBlockchainStatus = require(__dirname + '/GetBlockchainStatus');
exports.GetBlockId = require(__dirname + '/GetBlockId');
exports.GetConstants = require(__dirname + '/GetConstants');
exports.GetForging = require(__dirname + '/GetForging');
exports.GetGuaranteedBalance = require(__dirname + '/GetGuaranteedBalance');
exports.GetMyInfo = require(__dirname + '/GetMyInfo');
exports.GetNextBlockGenerators = require(__dirname + '/GetNextBlockGenerators');
exports.GetPeer = require(__dirname + '/GetPeer');
exports.GetPeers = require(__dirname + '/GetPeers');
exports.GetPoll = require(__dirname + '/GetPoll');
exports.GetPollIds = require(__dirname + '/GetPollIds');
exports.GetProjectList = require(__dirname + '/GetProjectList');
exports.GetProjectListHtml = require(__dirname + '/GetProjectListHtml');
exports.GetState = require(__dirname + '/GetState');
exports.GetTime = require(__dirname + '/GetTime');
exports.GetTrades = require(__dirname + '/GetTrades');
exports.GetTransaction = require(__dirname + '/GetTransaction');
exports.GetTransactionBytes = require(__dirname + '/GetTransactionBytes');
exports.GetVersion = require(__dirname + '/GetVersion');
exports.GetUnconfirmedTransactionIds = require(__dirname + '/GetUnconfirmedTransactionIds');
exports.GetUnconfirmedTransactions = require(__dirname + '/GetUnconfirmedTransactions');
exports.IssueAsset = require(__dirname + '/IssueAsset');
exports.LeaseBalance = require(__dirname + '/LeaseBalance');
exports.MarkHost = require(__dirname + '/MarkHost');
exports.ParseTransaction = require(__dirname + '/ParseTransaction');
exports.PlaceAskOrder = require(__dirname + '/PlaceAskOrder');
exports.PlaceBidOrder = require(__dirname + '/PlaceBidOrder');
exports.SellAlias = require(__dirname + '/SellAlias');
exports.SendMessage = require(__dirname + '/SendMessage');
exports.SendMoney = require(__dirname + '/SendMoney');
exports.SetAccountInfo = require(__dirname + '/SetAccountInfo');
exports.SetAlias = require(__dirname + '/SetAlias');
exports.SignTransaction = require(__dirname + '/SignTransaction');
exports.StartForging = require(__dirname + '/StartForging');
exports.StopForging = require(__dirname + '/StopForging');
exports.TransferAsset = require(__dirname + '/TransferAsset');
