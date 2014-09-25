/**!
 * LibreMoney Messages 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var ArbitraryMessageTrType = require(__dirname + '/ArbitraryMessageTrType');
var Core = require(__dirname + "/../Core");
var MessagingTrType = require(__dirname + '/MessagingTrType');


var arbitraryMessage;


function Init() {
	Core.AddListener(Core.Event.InitServer, OnInitServer);
	arbitraryMessageTrType = new ArbitraryMessageTrType();
	MessagingTrType.Init();
}

function OnInitServer(app) {
	var Api = require(__dirname + "/Api");
	app.get("/api/readMessage", Api.ReadMessage);
	app.get("/api/sendMessage", Api.SendMessage);
}


exports.ArbitraryMessage = arbitraryMessage;

exports.Init = Init;

exports.SUBTYPE_MESSAGING_ARBITRARY_MESSAGE = 0;
