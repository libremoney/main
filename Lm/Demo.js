/*!
 * LibreMoney 0.1
 * Copyright(c) 2014 LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

//var LmAccount = require(__dirname + '/Account');
//var LmAlias = require(__dirname + '/LmAlias');
//var LmAliases = require(__dirname + '/LmAliases');
//var LmAttachment = require(__dirname + '/LmAttachment');
var AttachmentGroupCreate = require(__dirname + '/Groups/Attachment_GroupCreate');
var Blocks = require(__dirname + '/Blocks');
var BigInt = require(__dirname + '/Util/BigInteger');
var LmBlock = require(__dirname + '/Blocks/Block');
//var LmBlockchainProcessor = require(__dirname + '/LmBlockchainProcessor');
var Constants = require(__dirname + '/Constants');
var Convert = require(__dirname + '/Util/Convert');
var Crypto = require(__dirname + '/Crypto/Crypto');
var Db = require(__dirname + '/Db');
//var LmGenerator = require(__dirname + '/LmGenerator');
var Groups = require(__dirname + '/Groups');
var JsonResponses = require(__dirname + '/Server/JsonResponses');
var Logger = require(__dirname + '/Logger').GetLogger(module);
var ParameterParser = require(__dirname + '/Server/ParameterParser');
var Projects = require(__dirname + '/Projects');
var TransactionProcessor = require(__dirname + '/TransactionProcessor');
var Transactions = require(__dirname + '/Transactions');
//var LmTrType = require(__dirname + '/Transactions/TransactionType');
//var LmTrTypeAccountControl = require(__dirname + '/LmTransactionType_AccountControl');
//var LmTrTypeColoredCoins = require(__dirname + '/LmTransactionType_ColoredCoins');
var LmTrTypeGroup = require(__dirname + '/Groups/TransactionType_Group');
//var LmTrTypeDigitalGoods = require(__dirname + '/LmTransactionType_DigitalGoods');
//var LmTrTypeMessaging = require(__dirname + '/LmTransactionType_Messaging');
//var LmTrTypePayment = require(__dirname + '/LmTransactionType_Payment');
var Users = require(__dirname + '/Users');


/*
data.senderAccount
data.recipientId
data.amountMilliLm
data.deadline
data.referencedTransactionFullHash
data.referencedTransaction
data.publicKey
data.broadcast
data.feeMilliLm
data.attachment
data.signature = Crypto.Sign(GetBytes(), data.secretPhrase);
*/
function CreateTransaction2(data) {
	if (!data.recipientId)
		data.recipientId = Genesis.CREATOR_ID;
	if (!data.amountMilliLm)
		data.amountMilliLm = 0;

	var deadlineValue = data.deadline;
	var referencedTransactionFullHash = Convert.EmptyToNull(data.referencedTransactionFullHash);
	var referencedTransactionId = Convert.EmptyToNull(data.referencedTransaction);
	var publicKeyValue = Convert.EmptyToNull(data.publicKey);
	var broadcast = true; //!"false".equalsIgnoreCase(data.broadcast);

	if (!publicKeyValue) {
		return JsonResponses.MissingPublicKey;
	} else if (!deadlineValue) {
		return JsonResponses.MissingDeadline;
	}

	var deadline;
	try {
		deadline = parseInt(deadlineValue); // parseShort
		if (deadline < 1 || deadline > 1440) {
			return JsonResponses.IncorrectDeadline;
		}
	} catch (e) {
		Logger.error(e);
		return JsonResponses.IncorrectDeadline;
	}

	var feeValueMilliLm = Convert.EmptyToNull(data.feeMilliLm);
	var feeMilliLm = ParameterParser.ParseFeeMilliLm(feeValueMilliLm);
	if (feeMilliLm < Constants.OneLm/*minimumFeeMilliLm()*/) {
		return JsonResponses.IncorrectFee;
	}

	try {
		if (Convert.SafeAdd(data.amountMilliLm, feeMilliLm) > data.senderAccount.GetUnconfirmedBalanceMilliLm()) {
			return JsonResponses.NotEnoughFunds;
		}
	} catch (e) {
		return JsonResponses.NotEnoughFunds;
	}

	if (referencedTransactionId != null) {
		return JsonResponses.IncorrectReferencedTransaction;
	}

	// shouldn't try to get publicKey from senderAccount as it may have not been set yet
	var publicKey = Convert.ParseHexString(publicKeyValue);

	try {
		var transaction = TransactionProcessor.NewTransaction(deadline, publicKey, data.recipientId,
					data.amountMilliLm, feeMilliLm, referencedTransactionFullHash, data.attachment, data.signature);

		if (data.signature != null) {
			response.transaction = transaction.GetStringId();
			response.fullHash = transaction.GetFullHash();
			response.transactionBytes = Convert.ToHexString(transaction.GetBytes());
			response.signatureHash = Convert.ToHexString(Crypto.Sha256().digest(transaction.GetSignature()));
			if (broadcast) {
				TransactionProcessor.Broadcast(transaction);
				response.broadcasted = true;
			} else {
				response.broadcasted = false;
			}
		} else {
			response.broadcasted = false;
		}
		response.unsignedTransactionBytes = Convert.ToHexString(transaction.GetUnsignedBytes());
	} catch (e) {
		return JsonResponses.FEATURE_NOT_AVAILABLE;
	}
	return response;
}

function PrintTrInfo(Tr) {
	Logger.info('---- Transaction info begin ----');
	Logger.info('Время жизни (Deadline) = '+Tr.GetDeadline());
	Logger.info('Отправитель (SenderId) = '+Tr.GetSenderId()+' (SenderPublicKey) = '+Tr.GetSenderPublicKey());
	Logger.info('Получатель (RecipientId) = '+Tr.GetRecipientId());
	Logger.info('Сумма (AmountMilliLm) = '+Tr.GetAmountMilliLm()+' mLm = '+Tr.GetAmountMilliLm()/1000+' Lm');
	Logger.info('Комиссия (FeeMilliLm) = '+Tr.GetFeeMilliLm()+' mLm = '+Tr.GetFeeMilliLm()/1000+' Lm');
	Logger.info('ReferencedTransactionFullHash = '+Tr.GetReferencedTransactionFullHash());
	Logger.info('Тип транзакции (Type) = '+Tr.GetType().GetName());
	Logger.info('Высота (Height) = '+Tr.GetHeight());
	Logger.info('Блок (BlockId) = '+Tr.GetBlockId());
	Logger.info('Сигнатура (Signature) = '+Tr.GetSignature());
	Logger.info('Время транзакции (Timestamp) = '+Tr.GetTimestamp());
	Logger.info('Время блока (BlockTimestamp) = '+Tr.GetBlockTimestamp());
	Logger.info('Приложение (Attachment) = '+Tr.GetAttachment());
	Logger.info('Идентификатор (Id) = '+Tr.GetId());
	//this.StringId = null;
	Logger.info('Хеш (FullHash) = '+Tr.GetFullHash());
	Logger.info('---- Transaction info end ----');
}

function Init(callback) {
	var UserProf1983 = Users.AddNewUser('Prof1983');
	Groups.AddNewGroup('LibreMoney Team', 'LibreMoney developer team', 'Prof1983');


	// ---- LmTransaction ----

	Init0(function(err) {
		Init1(function(err, genesisTr0) {
			console.log('err='+err+' genesisTr0='+genesisTr0);
			Init2(function(err, genesisUser) {
				console.log('err='+err+' genesisUser='+genesisUser);
				Init3(function(err) {
					console.log(err);
					// ---- LmBlock ----

					var Transactions0 = new Array();
					Transactions0.push(genesisTr0);

					var Block0 = Blocks.AddNewBlock(0/*Version*/, 1400000000/*Timestamp*/, 0/*PreviousBlockId*/, 1000000000/*TotalAmountMilliLm*/,
						0/*TotalFeeMilliLm*/, 0/*PayloadLength*/, 0/*PayloadHash*/,
						0/*GeneratorPublicKey*/, 0/*GenerationSignature*/, 0/*BlockSignature*/, 0/*PreviousBlockHash*/, Transactions0);

					Logger.info('Block #0 is created');

					InitProjects(UserProf1983, function(err) {
						if (err) callback(err);
						InitTr06(function(err) {
							if (err) callback(err);
							InitTr07(function(err) {
								InitTr08(function(err) {
									if (callback)
										callback(err);
								});
							});
						});
					});
				});
			});
		});
	});
}

function Init0(callback) {
	var trModel = Db.GetModel('transaction');
	trModel.find().exec(function(err, data) {
		if (!err) {
			for (var i in data) {
				console.log('Remove transaction id='+data[i].id);
				data[i].remove();
			}
		}
		callback(err);
	});
}

function Init1(callback) {
	// First emmitting (1 MLm)
	var genesisTr0 = Transactions.CreateTransaction({
		type: Transactions.Types.Payment.Ordinary,
		timestamp: 0,
		deadline: 255,
		senderPublicKey: [],
		recipientId: 0,
		amountMilliLm: 1000000000,
		feeMilliLm: 1,
		referencedTransactionFullHash: 0,
		signature: null,
		blockId: 0,
		height: 0,
		id: 1,
		senderId: 0,
		blockTimestamp: 0,
		fullHash: 0
	});
	//PrintTrInfo(genesisTr0);
	Transactions.SaveTransaction(genesisTr0, function(err) {
		callback(err, genesisTr0);
	});
}

function Init2(callback) {
	// Create user "LibreMoney"
	var genesisUser = Users.AddNewUserEx({
		name: 'LibreMoney',
		description: '{"uri": "http://libremoney.org/"}',
		timestamp: 1000,
		deadline: 255,
		senderPublicKey: new Array(),
		recipientId: 0,
		amountMilliLm: 1,
		feeMilliLm: 1,
		referencedTransactionFullHash: 0,
		signature: null,
		blockId: 0,
		height: 0,
		id: 2,
		senderId: 0,
		blockTimestamp: 0,
		fullHash: 0
		});
	var tr1 = genesisUser.transaction;
	//PrintTrInfo(tr1);
	Transactions.SaveTransaction(tr1, function(err) {
		callback(err, genesisUser);
	});
}

function Init3(callback) {
	// Create community "LibreMoney Team"
	var tr2 = Transactions.CreateTransaction({
		type: LmTrTypeGroup.GetGroupCreate(),
		timestamp: 2000,
		deadline: 255,
		senderPublicKey: new Array(),
		recipientId: 0,
		amountMilliLm: 1,
		feeMilliLm: 1,
		referencedTransactionFullHash: 0,
		signature: null,
		blockId: 0,
		height: 0,
		id: 3,
		senderId: 0,
		blockTimestamp: 0,
		fullHash: 0
	});
	tr2.SetAttachment(AttachmentGroupCreate.Create('LibreMoney Team', '{"uri": "http://libremoney.org/"}'));
	//PrintTrInfo(tr2);
	Transactions.SaveTransaction(tr2, function(err) {
		callback(err, tr2);
	});
}

function InitProjects(UserProf1983, callback) {
	// ==== Stage 0 (06.2014) ====
	// ---- Develop ----
	Projects.AddNewProject(1, 1, 'LibreMoney:Start0', 'Доменные имена, Хостинг, Движок сайта', UserProf1983, 3, '2 000', '2 000', 0, 0, 0, 0);
	Projects.AddNewProject(1, 1, 'LibreMoney:Design1', 'Создание дизайн-проекта libremoney.com v.0.1', UserProf1983, 3, '3 000', '3 000', 0, 0, 0, 0);
	Projects.AddNewProject(1, 1, 'LibreMoney:Tz0', 'Разработка технического задания (плана работ) v.0.1', UserProf1983, 3, '2 000', '2 000', 0, 0, 0, 0);
	Projects.AddNewProject(1, 1, 'LibreMoney:DevProtocol01', 'Разработка первичного протокола v.0.1', UserProf1983, 3, '10 000', '10 000', 0, 0, 0, 0);
	Projects.AddNewProject(1, 1, 'LibreMoney:DevDb01', 'Разработка структуры БД v.0.1', UserProf1983, 3, '10 000', '10 000', 0, 0, 0, 0);
	Projects.AddNewProject(1, 1, 'LibreMoney:DevTransaction01', 'Разработка механизма транзакций v.0.1', UserProf1983, 3, '10 000', '10 000', 0, 0, 0, 0);
	Projects.AddNewProject(1, 1, 'LibreMoney:DevProto1', 'Разработка прототипа v.0.1', UserProf1983, 3, '10 000', '10 000', 0, 0, 0, 0);
	Projects.AddNewProject(1, 1, 'LibreMoney:ReleaseAlpha0', 'Подготовка и публикование исходников LibreMoney v.0.0.1 (Alpha0)', UserProf1983, 3, '3 000', '3 000', 0, 0, 0, 0);
	// ---- Marketing ----
	Projects.AddNewProject(1, 2, 'LibreMoney:Start1', 'Наполнение сайта первичной информацией', UserProf1983, 3, '3 000', '3 000', 0, 0, 0, 0);
	Projects.AddNewProject(1, 2, 'LibreMoney:Announce1', 'Анонс на форумах и блогах', UserProf1983, 3, '2 000', '2 000', 0, 0, 0, 0);
	Projects.AddNewProject(1, 2, 'LibreMoney:Logo1', 'Создание логотипа LibreMoney v.0.1', UserProf1983, 0, '2 000', '2 000', 0, 0, 0, 0);
	Projects.AddNewProject(1, 2, 'LibreMoney:BusinessPlan1', 'Разработка бизнес-плана v.0.1', UserProf1983, 3, '3 000', '3 000', 0, 0, 0, 0);
	Projects.AddNewProject(1, 2, 'LibreMoney:Invest1', 'Заполнение заявок в несколько инвестиционных фондов', UserProf1983, 3, '5 000', '5 000', 0, 0, 0, 0);
	Projects.AddNewProject(1, 2, 'LibreMoney:FinModel1', 'Составление начальной финансовой модели (v.0.1)', UserProf1983, 3, '5 000', '5 000', 0, 0, 0, 0);
	Projects.AddNewProject(1, 2, 'LibreMoney:BizProcess1', 'Описание бизнес процесса (v.0.1)', UserProf1983, 3, '5 000', '5 000', 0, 0, 0, 0);
	Projects.AddNewProject(1, 2, 'LibreMoney:Presentation1', 'Разработка презентации проекта', UserProf1983, 3, '10 000', '10 000', 0, 0, 0, 0);
	Projects.AddNewProject(1, 2, 'LibreMoney:VideoPresentation1', 'Создание видео-презентации проекта', UserProf1983, 3, '15 000', '15 000', 0, 0, 0, 0);
	// ==== Stage 1 (07.2014) ====
	// ---- Develop ----
	Projects.AddNewProject(1, 3, 'LibreMoney:DevTz1', 'Составление плана работ, составление ТЗ, написание документации', UserProf1983, 1, '0', '5 000', 0, 0, 0, 0);
	Projects.AddNewProject(1, 3, 'LibreMoney:DevClientLogin', 'Реализовать вход в систему (логин)', UserProf1983, 1, '0', '5 000', 0, 0, 0, 0);
	Projects.AddNewProject(1, 3, 'LibreMoney:DevClientWalletCreate', 'Реализовать создание кошелька', UserProf1983, 1, '0', '5 000', 0, 0, 0, 0);
	Projects.AddNewProject(1, 3, 'LibreMoney:DevClientTransactionList', 'Реализовать просмотр списка транзакций', UserProf1983, 1, '0', '5 000', 0, 0, 0, 0);
	Projects.AddNewProject(1, 3, 'LibreMoney:DevClientTransactionModal', 'Реализовать просмотр транзакции (модально)', UserProf1983, 1, '0', '5 000', 0, 0, 0, 0);
	Projects.AddNewProject(1, 3, 'LibreMoney:DevClientBlockList', 'Реализовать просмотр списка блоков', UserProf1983, 1, '0', '5 000', 0, 0, 0, 0);
	Projects.AddNewProject(1, 3, 'LibreMoney:DevClientDashboard', 'Реализовать просмотр кошелька (dashboard)', UserProf1983, 1, '0', '5 000', 0, 0, 0, 0);
	Projects.AddNewProject(1, 3, 'LibreMoney:DevClientTransactionCreate', 'Реализовать создание транзакций', UserProf1983, 1, '0', '5 000', 0, 0, 0, 0);
	Projects.AddNewProject(1, 3, 'LibreMoney:DevTrCommunity', 'Реализовать транзакции создания сообщества', UserProf1983, 1, '0', '5 000', 0, 0, 0, 0);
	Projects.AddNewProject(1, 3, 'LibreMoney:DevTrUser', 'Реализовать транзакции создания пользователя', UserProf1983, 1, '0', '5 000', 0, 0, 0, 0);
	// ---- Marketing ----
	Projects.AddNewProject(1, 4, 'LibreMoney:Announce2', 'Анонс на форумах и блогах 2 (отчет о проделанной работе, ответы на вопросы и пр)', UserProf1983, 3, '1 000', '1 000', 0, 0, 0, 0);
	Projects.AddNewProject(1, 4, 'LibreMoney:Doc1', 'Написание статьи о внутреннем устройстве Lm (архитектура)', UserProf1983, 3, '1 800', '1 800', 0, 0, 0, 0);
	Projects.AddNewProject(1, 4, 'LibreMoney:Translation1', 'Перевод основной информации на англ. язык', UserProf1983, 3, '1 200', '1 200', 0, 0, 0, 0);
	Projects.AddNewProject(1, 4, 'LibreMoney:Video1', 'Создание видеопада на рус. и англ. языках', UserProf1983, 3, '5 000', '5 000', 0, 0, 0, 0);
	Projects.AddNewProject(1, 4, 'LibreMoney:Reclame1', 'Реклама "Свободные деньги"', UserProf1983, 3, '2 500', '2 500', 0, 0, 0, 0);
	Projects.AddNewProject(1, 4, 'LibreMoney:Reclame2', 'Реклама группы в FB', UserProf1983, 3, '1 000', '1 000', 0, 0, 0, 0);
	Projects.AddNewProject(1, 4, 'LibreMoney:Reclame3', 'Общение с инвесторами, бизнес-ангелами', UserProf1983, 3, '2 500', '2 500', 0, 0, 0, 0);
	Projects.AddNewProject(1, 4, 'LibreMoney:Reclame4', 'Написание расширенных и более понятных заявок в фонды', UserProf1983, 3, '2 500', '2 500', 0, 0, 0, 0);
	Projects.AddNewProject(1, 4, 'LibreMoney:Reclame5', 'Написание более понятного предложения для инвесторов', UserProf1983, 3, '2 500', '2 500', 0, 0, 0, 0);
	Projects.AddNewProject(1, 4, 'LibreMoney:Reclame6', 'Написание более понятного предложения для авторов крауд-проектов', UserProf1983, 3, '2 500', '2 500', 0, 0, 0, 0);
	Projects.AddNewProject(1, 4, 'LibreMoney:BizModel', 'Создание презентабельной бизнес модели (бизнес-модель остервальдера)', UserProf1983, 3, '2 500', '2 500', 0, 0, 0, 0);
	Projects.AddNewProject(1, 4, 'LibreMoney:Reclame7', 'Реклама на форумах', UserProf1983, 3, '10 000', '10 000', 0, 0, 0, 0);
	Projects.AddNewProject(1, 4, 'LibreMoney:Design2', 'Создание дизайн-проекта libremoney.com v.0.2', UserProf1983, 0, '5 000', '5 000', 0, 0, 0, 0);
	Projects.AddNewProject(1, 4, 'LibreMoney:BusinessPlan2', 'Разработка бизнес-плана v.0.2', UserProf1983, 0, '5 000', '5 000', 0, 0, 0, 0);
	// ==== Stage 2 (08.2014) ====
	/*
	Projects.AddNewProject(1, 'LibreMoney:DevSynk01', 'Разработка механизма синхронизации v.0.1', UserProf1983, 1, '0', '10 000', 0, 0, 0, 0);
	Projects.AddNewProject(1, 'LibreMoney:DevUsers01', 'Разработка механизма регистрации и логина v.0.1', UserProf1983, 1, '0', '10 000', 0, 0, 0, 0);
	Projects.AddNewProject(1, 'LibreMoney:Test01', 'Тестирование системы v.0.1', UserProf1983, 1, '0', '10 000', 0, 0, 0, 0);
	Projects.AddNewProject(1, 'LibreMoney:TZ02', 'Разработка технического задания v.0.2', UserProf1983, 0, '0', '10 000', 0, 0, 0, 0);
	Projects.AddNewProject(1, 'LibreMoney:Community02', 'Разработка механизма сообществ, проектов, расчет коэффициентов v.0.2', UserProf1983, 0, '0', '20 000', 0, 0, 0, 0);
	ArtInGlass
	*/

	callback(null);
}

function InitTr06(callback) {
	// 100KLm from LMA-TVZT-PRDS-FB8M-4P3E4 (2391470422895685625) to LMA-CTB9-KKFC-YCFK-5S3MJ (4056679539821339943)
	var tr = Transactions.CreateTransaction({
		type: Transactions.Types.Payment.Ordinary,
		timestamp: 4172799000, // 30.06.2014 23:59:59
		deadline: 255,
		senderPublicKey: new Array(),
		recipientId: '4056679539821339943',
		amountMilliLm: 100000000,
		feeMilliLm: 1,
		referencedTransactionFullHash: 0,
		signature: null,
		blockId: 0,
		height: 0,
		id: 11,
		senderId: '2391470422895685625',
		blockTimestamp: 0,
		fullHash: 0
	});
	Transactions.SaveTransaction(tr, function(err) {
		callback(err, tr);
	});
}

function InitTr07(callback) {
	// 50KLm from LMA-TVZT-PRDS-FB8M-4P3E4 (2391470422895685625) to LMA-CTB9-KKFC-YCFK-5S3MJ (4056679539821339943)
	var tr = Transactions.CreateTransaction({
		type: Transactions.Types.Payment.Ordinary,
		timestamp: 6851199000, // 31.07.2014 23:59:59
		deadline: 255,
		senderPublicKey: new Array(),
		recipientId: '4056679539821339943',
		amountMilliLm: 50000000,
		feeMilliLm: 1,
		referencedTransactionFullHash: 0,
		signature: null,
		blockId: 0,
		height: 0,
		id: 12,
		senderId: '2391470422895685625',
		blockTimestamp: 0,
		fullHash: 0
	});
	Transactions.SaveTransaction(tr, function(err) {
		// 50KLm from LMA-TVZT-PRDS-FB8M-4P3E4 (2391470422895685625) to (16837332202370815306)
		var tr = Transactions.CreateTransaction({
			type: Transactions.Types.Payment.Ordinary,
			timestamp: 6851199000, // 31.07.2014 23:59:59
			deadline: 255,
			senderPublicKey: new Array(),
			recipientId: '16837332202370815306',
			amountMilliLm: 50000000,
			feeMilliLm: 1,
			referencedTransactionFullHash: 0,
			signature: null,
			blockId: 0,
			height: 0,
			id: 13,
			senderId: '2391470422895685625',
			blockTimestamp: 0,
			fullHash: 0
		});
		Transactions.SaveTransaction(tr, function(err) {
			callback(err, tr);
		});
	});
}

function InitTr08(callback) {
	// 100Lm from LMA-CTB9-KKFC-YCFK-5S3MJ (4056679539821339943) to LMA-6UL7-FJV2-X5V3-AVNDE (alextattooist)
	//https://forum.btcsec.com/index.php?/topic/8176-libremoney/page-2#entry188067
	var tr = Transactions.CreateTransaction({
		type: Transactions.Types.Payment.Ordinary,
		timestamp: 6851200000, // 01.08.2014 00:00:00
		deadline: 255,
		senderPublicKey: new Array(),
		recipientId: '0',
		amountMilliLm: 100000,
		feeMilliLm: 1,
		referencedTransactionFullHash: 0,
		signature: null,
		blockId: 0,
		height: 0,
		id: 14,
		senderId: '4056679539821339943',
		blockTimestamp: 0,
		fullHash: 0
	});
	Transactions.SaveTransaction(tr, function(err) {
		callback(err, tr);
	});
}


exports.Init = Init;
