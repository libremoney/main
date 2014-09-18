/**!
 * LibreMoney AccountControl 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var Core = require(__dirname + '/../Core');


function Init() {
	Core.AddListaner(Core.Event.InitServer, OnInitServer);
}

function OnInitServer() {
	var Api = require(__dirname + "/Api");
	app.get("/api/setAccountInfo", Api.SetAccountInfo);
}


exports.Init = Init;

exports.SUBTYPE_ACCOUNT_CONTROL_EFFECTIVE_BALANCE_LEASING = 0;
exports.SUBTYPE_MESSAGING_ACCOUNT_INFO = 5;
