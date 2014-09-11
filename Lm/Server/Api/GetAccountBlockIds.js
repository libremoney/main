/**!
 * LibreMoney GetAccountBlockIds api 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var Blockchain = require(__dirname + '/../../Blockchain');
var JsonResponses = require(__dirname + '/../JsonResponses');
var ParameterParser = require(__dirname + '/../ParameterParser');


//super(new APITag[] {APITag.ACCOUNTS}, "account", "timestamp");
function GetAccountBlockIds(req, res) {
	var account = ParameterParser.GetAccount(req);
	var timestamp = ParameterParser.GetTimestamp(req);
	var blockIds = new Array();
	var blocks = Blockchain.GetBlocks(account, timestamp)
	for (block in blocks) {
		blockIds.push(block.GetStringId());
	}
	var response = {};
	response.blockIds = blockIds;
	res.send(response);    
}

module.exports = GetAccountBlockIds;
