/**!
 * LibreMoney Payments 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var Core = require(__dirname + '/../../Core');
var Logger = require(__dirname + '/../../Util/Logger').GetLogger(module);
var Ordinary = require(__dirname + '/OrdinaryTrType');
var Transactions = require(__dirname + '/../../Core/Transactions');


var ordinary;


function GetOrdinary() {
	return ordinary;
}

function Init() {
	Core.AddListener(Core.Event.InitServer, OnInitServer);
	ordinary = new Ordinary();
	if (!Transactions.Types.Payment)
		Transactions.Types.Payment = {};
	if (!Transactions.Types.Payment.Ordinary)
		Transactions.Types.Payment.Ordinary = ordinary;
	Transactions.Types.Add(ordinary);
	Logger.info('Ordinary payment type is created');
}

/*
deadline,
senderPublicKey,
recipientId,
amountMilliLm,
feeMilliLm,
referencedTransactionFullHash,
attachment,
signature
*/
function NewOrdinaryPaymentTransaction(data) {
	var transaction = Transactions.CreateTransaction({
		type: ordinary,
		timestamp: 0, //Convert.GetEpochTime(),
		deadline: data.deadline,
		senderPublicKey: data.senderPublicKey,
		recipientId: data.recipientId,
		amountMilliLm: data.amountMilliLm,
		feeMilliLm: data.feeMilliLm,
		referencedTransactionFullHash: data.referencedTransactionFullHash,
		signature: data.signature
		/*blockId,
		height,
		id,
		senderId,
		blockTimestamp,
		fullHash*/
	});
	if (data.attachment) {
		transaction.SetAttachment(data.attachment);
	} else {
		transaction.SetAttachment(Attachments.GetOrdinaryPayment);
	}
	transaction.Validate();
	return transaction;
}

function OnInitServer(app) {
	var Api = require(__dirname + "/Api");
	app.get("/api/sendMoney", Api.SendMoney);
}


exports.Ordinary = ordinary;

exports.GetOrdinary = GetOrdinary;
exports.Init = Init;
exports.NewOrdinaryPaymentTransaction = NewOrdinaryPaymentTransaction;

exports.SUBTYPE_PAYMENT_ORDINARY_PAYMENT = 0;