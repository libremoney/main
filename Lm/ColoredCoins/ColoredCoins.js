/**!
 * LibreMoney 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */


//var LmTrTypeColoredCoins = require(__dirname + '/TransactionType_ColoredCoins');
var ColoredCoinsAskOrderCancellationAttachment = require(__dirname + '/Attachment_ColoredCoinsAskOrderCancellation');


function CreateColoredCoinsAskOrderCancellationAttachment() {
	return new ColoredCoinsAskOrderCancellationAttachment();
}

function Init() {
	//LmTrTypeColoredCoins.Init();
}


exports.CreateColoredCoinsAskOrderCancellationAttachment = CreateColoredCoinsAskOrderCancellationAttachment;
exports.Init = Init;
