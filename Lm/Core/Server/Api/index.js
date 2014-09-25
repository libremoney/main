/**!
 * LibreMoney api 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

function GetMain(req, res) {
	var S = '';
	for(var i = 0; i <= req.length; i++) {
		S = S + req[i];
	}
	res.send('<!DOCTYPE html><html><body>LibreMoney API<br/>'+S+'</body></html>');
	//res.send('<html><body>users, user/:id</body></html>');
}


exports.GetMain = GetMain;

exports.BroadcastTransaction = require(__dirname + '/BroadcastTransaction');
exports.CalculateFullHash = require(__dirname + '/CalculateFullHash');
exports.DecryptFrom = require(__dirname + '/DecryptFrom');
exports.EncryptTo = require(__dirname + '/EncryptTo');
exports.GetAccountBlockIds = require(__dirname + '/GetAccountBlockIds');
exports.GetAccountTransactionIds = require(__dirname + '/GetAccountTransactionIds');
exports.GetAccountTransactions = require(__dirname + '/GetAccountTransactions');
exports.GetBlock = require(__dirname + '/GetBlock');
exports.GetBlockchainStatus = require(__dirname + '/GetBlockchainStatus');
exports.GetBlockId = require(__dirname + '/GetBlockId');
exports.GetConstants = require(__dirname + '/GetConstants');
exports.GetMyInfo = require(__dirname + '/GetMyInfo');
exports.GetState = require(__dirname + '/GetState');
exports.GetTime = require(__dirname + '/GetTime');
exports.GetTransaction = require(__dirname + '/GetTransaction');
exports.GetTransactionBytes = require(__dirname + '/GetTransactionBytes');
exports.GetVersion = require(__dirname + '/GetVersion');
exports.GetUnconfirmedTransactionIds = require(__dirname + '/GetUnconfirmedTransactionIds');
exports.GetUnconfirmedTransactions = require(__dirname + '/GetUnconfirmedTransactions');
exports.ParseTransaction = require(__dirname + '/ParseTransaction');
exports.RsConvert = require(__dirname + '/RsConvert');
exports.SignTransaction = require(__dirname + '/SignTransaction');
