/**!
 * LibreMoney AccountControl 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

if (typeof module !== "undefined") {
	var Core = require(__dirname + '/../Core');
	var AccountControlTrType = require(__dirname + '/AccountControlTrType');
}


function Init() {
	Core.AddListaner(Core.Event.InitServer, OnInitServer);
	AccountControlTrType.Init();
}

function OnInitServer() {
	var Api = require(__dirname + "/Api");
	app.get("/api/setAccountInfo", Api.SetAccountInfo);
}


exports.Init = Init;

exports.SUBTYPE_ACCOUNT_CONTROL_EFFECTIVE_BALANCE_LEASING = 0;
exports.SUBTYPE_MESSAGING_ACCOUNT_INFO = 5;
