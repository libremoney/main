/**!
 * LibreMoney 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var ArbitraryMessageTrType = require(__dirname + '/ArbitraryMessageTrType');
var MessagingTrType = require(__dirname + '/MessagingTrType');


var arbitraryMessage;


function Init() {
	arbitraryMessageTrType = new ArbitraryMessageTrType();
	MessagingTrType.Init();
}


exports.ArbitraryMessage = arbitraryMessage;

exports.Init = Init;
