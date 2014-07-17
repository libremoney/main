/*!
 * LibreMoney Core Library 0.0
 * Copyright(c) 2014 LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

//var LmAccount = require(__dirname + '/Account');
//var LmAlias = require(__dirname + '/LmAlias');
//var LmAliases = require(__dirname + '/LmAliases');
//var LmAttachment = require(__dirname + '/LmAttachment');
var LmAttachmentGroupCreate = require(__dirname + '/Groups/Attachment_GroupCreate');
var LmAttachmentUserCreate = require(__dirname + '/Users/Attachment_UserCreate');
var LmBlock = require(__dirname + '/Blocks/Block');
//var LmBlockchainProcessor = require(__dirname + '/LmBlockchainProcessor');
//var LmGroup = require(__dirname + '/Groups/Group');
//var LmConstants = require(__dirname + '/LmConstants');
//var LmDb = require(__dirname + '/LmDb');
//var LmDbVersion = require(__dirname + '/LmDbVersion');
//var LmGenerator = require(__dirname + '/LmGenerator');
var LmProject = require(__dirname + '/Projects/Project');
var LmTransaction = require(__dirname + '/Transactions/Transaction');
var LmTrType = require(__dirname + '/Transactions/TransactionType');
//var LmTrTypeAccountControl = require(__dirname + '/LmTransactionType_AccountControl');
//var LmTrTypeColoredCoins = require(__dirname + '/LmTransactionType_ColoredCoins');
var LmTrTypeGroup = require(__dirname + '/Groups/TransactionType_Group');
//var LmTrTypeDigitalGoods = require(__dirname + '/LmTransactionType_DigitalGoods');
//var LmTrTypeMessaging = require(__dirname + '/LmTransactionType_Messaging');
//var LmTrTypePayment = require(__dirname + '/LmTransactionType_Payment');
var LmTrTypeUser = require(__dirname + '/Users/TransactionType_User');
var LmUser = require(__dirname + '/Users/User');


function PrintTrInfo(Tr) {
	Logger.info('---- Transaction info begin ----');
	Logger.info('Время жизни (Deadline) = '+Tr.Deadline);
	Logger.info('Отправитель (SenderId) = '+Tr.SenderId+' (SenderPublicKey) = '+Tr.SenderPublicKey);
	Logger.info('Получатель (RecipientId) = '+Tr.RecipientId);
	Logger.info('Сумма (AmountMilliLm) = '+Tr.AmountMilliLm+' mLm = '+Tr.AmountMilliLm/1000+' Lm');
	Logger.info('Комиссия (FeeMilliLm) = '+Tr.FeeMilliLm+' mLm = '+Tr.FeeMilliLm/1000+' Lm');
	Logger.info('ReferencedTransactionFullHash = '+Tr.ReferencedTransactionFullHash);
	Logger.info('Тип транзакции (Type) = '+Tr.Type.GetName());
	Logger.info('Высота (Height) = '+Tr.Height);
	Logger.info('Блок (BlockId) = '+Tr.BlockId);
	Logger.info('Сигнатура (Signature) = '+Tr.Signature);
	Logger.info('Время транзакции (Timestamp) = '+Tr.Timestamp);
	Logger.info('Время блока (BlockTimestamp) = '+Tr.BlockTimestamp);
	Logger.info('Приложение (Attachment) = '+Tr.Attachment);
	Logger.info('Идентификатор (Id) = '+Tr.Id);
	//this.StringId = null;
	Logger.info('Хеш (FullHash) = '+Tr.FullHash);
	Logger.info('---- Transaction info end ----');
}

function Init(callback) {
	var UserProf1983 = new LmUser('Prof1983');

	Lm.Users.push(UserProf1983);
	Lm.Groups.push(new LmCommunity('LibreMoney Team', 'LibreMoney developer team', 'Prof1983'));

	// ---- LmTransaction ----

	LmTrType.Init();

	// First emmitting (1 MLm)
	var Tr0 = new LmTransaction(LmTrTypePayment.GetOrdinary(), 1400000000, 255, 0/*SenderPublicKey*/, 0/*RecipientId*/,
		1000000000/*AmountMilliLm*/, 1/*FeeMilliLm*/, 0/*ReferencedTransactionFullHash*/, 0/*Signature*/,
		0/*BlockId*/, 0/*Height*/, 0/*Id*/, 0/*SenderId*/, 0/*BlockTimestamp*/, 0/*FullHash*/);

	//PrintTrInfo(Tr0);

	// Create user "LibreMoney"
	var Tr1 = new LmTransaction(LmTrTypeUser.GetUserCreate(), 1400000001, 255, 0/*SenderPublicKey*/, 0/*RecipientId*/,
		1/*AmountMilliLm*/, 1/*FeeMilliLm*/, 0/*ReferencedTransactionFullHash*/, 0/*Signature*/,
		0/*BlockId*/, 0/*Height*/, 0/*Id*/, 0/*SenderId*/, 0/*BlockTimestamp*/, 0/*FullHash*/);
	Tr1.SetAttachment(LmAttachmentUserCreate.Create('LibreMoney', '{"uri": "http://libremoney.org/"}'));

	//PrintTrInfo(Tr1);

	// Create community "LibreMoney Team"
	var Tr2 = new LmTransaction(LmTrTypeGroup.GetGroupCreate(), 1400000002, 255, 0/*SenderPublicKey*/, 0/*RecipientId*/,
		1/*AmountMilliLm*/, 1/*FeeMilliLm*/, 0/*ReferencedTransactionFullHash*/, 0/*Signature*/,
		0/*BlockId*/, 0/*Height*/, 0/*Id*/, 0/*SenderId*/, 0/*BlockTimestamp*/, 0/*FullHash*/);
	Tr2.SetAttachment(LmAttachmentGroupCreate.Create('LibreMoney Team', '{"uri": "http://libremoney.org/"}'));

	//PrintTrInfo(Tr2);

	Lm.Transactions.push(Tr0);
	Lm.Transactions.push(Tr1);
	Lm.Transactions.push(Tr2);

	// ---- LmBlock ----

	var Transactions0 = new Array();
	Transactions0.push(Tr0);

	var Block0 = LmBlock.Create(0/*Version*/, 1400000000/*Timestamp*/, 0/*PreviousBlockId*/, 1000000000/*TotalAmountMilliLm*/,
		0/*TotalFeeMilliLm*/, 0/*PayloadLength*/, 0/*PayloadHash*/,
		0/*GeneratorPublicKey*/, 0/*GenerationSignature*/, 0/*BlockSignature*/, 0/*PreviousBlockHash*/, Transactions0);

	Log('Block #0 is created');

	Lm.Projects = new Array();
	// ==== Stage 0 (06.2014) ====
	// ---- Develop ----
	Lm.Projects.push(new LmProject(1, 1, 'LibreMoney:Start0', 'Доменные имена, Хостинг, Движок сайта', UserProf1983, 3, '2 000', '2 000', 0, 0, 0, 0));
	Lm.Projects.push(new LmProject(1, 1, 'LibreMoney:Design1', 'Создание дизайн-проекта libremoney.com v.0.1', UserProf1983, 3, '3 000', '3 000', 0, 0, 0, 0));
	Lm.Projects.push(new LmProject(1, 1, 'LibreMoney:Tz0', 'Разработка технического задания (плана работ) v.0.1', UserProf1983, 3, '2 000', '2 000', 0, 0, 0, 0));
	Lm.Projects.push(new LmProject(1, 1, 'LibreMoney:DevProtocol01', 'Разработка первичного протокола v.0.1', UserProf1983, 3, '10 000', '10 000', 0, 0, 0, 0));
	Lm.Projects.push(new LmProject(1, 1, 'LibreMoney:DevDb01', 'Разработка структуры БД v.0.1', UserProf1983, 3, '10 000', '10 000', 0, 0, 0, 0));
	Lm.Projects.push(new LmProject(1, 1, 'LibreMoney:DevTransaction01', 'Разработка механизма транзакций v.0.1', UserProf1983, 3, '10 000', '10 000', 0, 0, 0, 0));
	Lm.Projects.push(new LmProject(1, 1, 'LibreMoney:DevProto1', 'Разработка прототипа v.0.1', UserProf1983, 3, '10 000', '10 000', 0, 0, 0, 0));
	Lm.Projects.push(new LmProject(1, 1, 'LibreMoney:ReleaseAlpha0', 'Подготовка и публикование исходников LibreMoney v.0.0.1 (Alpha0)', UserProf1983, 3, '3 000', '3 000', 0, 0, 0, 0));
	// ---- Marketing ----
	Lm.Projects.push(new LmProject(1, 2, 'LibreMoney:Start1', 'Наполнение сайта первичной информацией', UserProf1983, 3, '3 000', '3 000', 0, 0, 0, 0));
	Lm.Projects.push(new LmProject(1, 2, 'LibreMoney:Announce1', 'Анонс на форумах и блогах', UserProf1983, 3, '2 000', '2 000', 0, 0, 0, 0));
	Lm.Projects.push(new LmProject(1, 2, 'LibreMoney:Logo1', 'Создание логотипа LibreMoney v.0.1', UserProf1983, 0, '2 000', '2 000', 0, 0, 0, 0));
	Lm.Projects.push(new LmProject(1, 2, 'LibreMoney:BusinessPlan1', 'Разработка бизнес-плана v.0.1', UserProf1983, 3, '3 000', '3 000', 0, 0, 0, 0));
	Lm.Projects.push(new LmProject(1, 2, 'LibreMoney:Invest1', 'Заполнение заявок в несколько инвестиционных фондов', UserProf1983, 3, '5 000', '5 000', 0, 0, 0, 0));
	Lm.Projects.push(new LmProject(1, 2, 'LibreMoney:FinModel1', 'Составление начальной финансовой модели (v.0.1)', UserProf1983, 3, '5 000', '5 000', 0, 0, 0, 0));
	Lm.Projects.push(new LmProject(1, 2, 'LibreMoney:BizProcess1', 'Описание бизнес процесса (v.0.1)', UserProf1983, 3, '5 000', '5 000', 0, 0, 0, 0));
	Lm.Projects.push(new LmProject(1, 2, 'LibreMoney:Presentation1', 'Разработка презентации проекта', UserProf1983, 3, '10 000', '10 000', 0, 0, 0, 0));
	Lm.Projects.push(new LmProject(1, 2, 'LibreMoney:VideoPresentation1', 'Создание видео-презентации проекта', UserProf1983, 3, '15 000', '15 000', 0, 0, 0, 0));
	// ==== Stage 1 (07.2014) ====
	// ---- Develop ----
	Lm.Projects.push(new LmProject(1, 3, 'LibreMoney:DevTz1', 'Составление плана работ, составление ТЗ, написание документации', UserProf1983, 1, '0', '5 000', 0, 0, 0, 0));
	Lm.Projects.push(new LmProject(1, 3, 'LibreMoney:DevClientLogin', 'Реализовать вход в систему (логин)', UserProf1983, 1, '0', '5 000', 0, 0, 0, 0));
	Lm.Projects.push(new LmProject(1, 3, 'LibreMoney:DevClientWalletCreate', 'Реализовать создание кошелька', UserProf1983, 1, '0', '5 000', 0, 0, 0, 0));
	Lm.Projects.push(new LmProject(1, 3, 'LibreMoney:DevClientTransactionList', 'Реализовать просмотр списка транзакций', UserProf1983, 1, '0', '5 000', 0, 0, 0, 0));
	Lm.Projects.push(new LmProject(1, 3, 'LibreMoney:DevClientTransactionModal', 'Реализовать просмотр транзакции (модально)', UserProf1983, 1, '0', '5 000', 0, 0, 0, 0));
	Lm.Projects.push(new LmProject(1, 3, 'LibreMoney:DevClientBlockList', 'Реализовать просмотр списка блоков', UserProf1983, 1, '0', '5 000', 0, 0, 0, 0));
	Lm.Projects.push(new LmProject(1, 3, 'LibreMoney:DevClientDashboard', 'Реализовать просмотр кошелька (dashboard)', UserProf1983, 1, '0', '5 000', 0, 0, 0, 0));
	Lm.Projects.push(new LmProject(1, 3, 'LibreMoney:DevClientTransactionCreate', 'Реализовать создание транзакций', UserProf1983, 1, '0', '5 000', 0, 0, 0, 0));
	Lm.Projects.push(new LmProject(1, 3, 'LibreMoney:DevTrCommunity', 'Реализовать транзакции создания сообщества', UserProf1983, 1, '0', '5 000', 0, 0, 0, 0));
	Lm.Projects.push(new LmProject(1, 3, 'LibreMoney:DevTrUser', 'Реализовать транзакции создания пользователя', UserProf1983, 1, '0', '5 000', 0, 0, 0, 0));
	// ---- Marketing ----
	Lm.Projects.push(new LmProject(1, 4, 'LibreMoney:Announce2', 'Анонс на форумах и блогах 2 (отчет о проделанной работе, ответы на вопросы и пр)', UserProf1983, 3, '1 000', '1 000', 0, 0, 0, 0));
	Lm.Projects.push(new LmProject(1, 4, 'LibreMoney:Doc1', 'Написание статьи о внутреннем устройстве Lm (архитектура)', UserProf1983, 3, '1 800', '1 800', 0, 0, 0, 0));
	Lm.Projects.push(new LmProject(1, 4, 'LibreMoney:Translation1', 'Перевод основной информации на англ. язык', UserProf1983, 3, '1 200', '1 200', 0, 0, 0, 0));
	Lm.Projects.push(new LmProject(1, 4, 'LibreMoney:Video1', 'Создание видеопада на рус. и англ. языках', UserProf1983, 3, '5 000', '5 000', 0, 0, 0, 0));
	Lm.Projects.push(new LmProject(1, 4, 'LibreMoney:Reclame1', 'Реклама "Свободные деньги"', UserProf1983, 3, '2 500', '2 500', 0, 0, 0, 0));
	Lm.Projects.push(new LmProject(1, 4, 'LibreMoney:Reclame2', 'Реклама группы в FB', UserProf1983, 3, '1 000', '1 000', 0, 0, 0, 0));
	Lm.Projects.push(new LmProject(1, 4, 'LibreMoney:Reclame3', 'Общение с инвесторами, бизнес-ангелами', UserProf1983, 3, '2 500', '2 500', 0, 0, 0, 0));
	Lm.Projects.push(new LmProject(1, 4, 'LibreMoney:Reclame4', 'Написание расширенных и более понятных заявок в фонды', UserProf1983, 3, '2 500', '2 500', 0, 0, 0, 0));
	Lm.Projects.push(new LmProject(1, 4, 'LibreMoney:Reclame5', 'Написание более понятного предложения для инвесторов', UserProf1983, 3, '2 500', '2 500', 0, 0, 0, 0));
	Lm.Projects.push(new LmProject(1, 4, 'LibreMoney:Reclame6', 'Написание более понятного предложения для авторов крауд-проектов', UserProf1983, 3, '2 500', '2 500', 0, 0, 0, 0));
	Lm.Projects.push(new LmProject(1, 4, 'LibreMoney:BizModel', 'Создание презентабельной бизнес модели (бизнес-модель остервальдера)', UserProf1983, 3, '2 500', '2 500', 0, 0, 0, 0));
	Lm.Projects.push(new LmProject(1, 4, 'LibreMoney:Reclame7', 'Реклама на форумах', UserProf1983, 3, '10 000', '10 000', 0, 0, 0, 0));
	Lm.Projects.push(new LmProject(1, 4, 'LibreMoney:Design2', 'Создание дизайн-проекта libremoney.com v.0.2', UserProf1983, 0, '5 000', '5 000', 0, 0, 0, 0));
	Lm.Projects.push(new LmProject(1, 4, 'LibreMoney:BusinessPlan2', 'Разработка бизнес-плана v.0.2', UserProf1983, 0, '5 000', '5 000', 0, 0, 0, 0));
	// ==== Stage 2 (08.2014) ====
	/*
	Lm.Projects.push(new LmProject(1, 'LibreMoney:DevSynk01', 'Разработка механизма синхронизации v.0.1', UserProf1983, 1, '0', '10 000', 0, 0, 0, 0));
	Lm.Projects.push(new LmProject(1, 'LibreMoney:DevUsers01', 'Разработка механизма регистрации и логина v.0.1', UserProf1983, 1, '0', '10 000', 0, 0, 0, 0));
	Lm.Projects.push(new LmProject(1, 'LibreMoney:Test01', 'Тестирование системы v.0.1', UserProf1983, 1, '0', '10 000', 0, 0, 0, 0));
	Lm.Projects.push(new LmProject(1, 'LibreMoney:TZ02', 'Разработка технического задания v.0.2', UserProf1983, 0, '0', '10 000', 0, 0, 0, 0));
	Lm.Projects.push(new LmProject(1, 'LibreMoney:Community02', 'Разработка механизма сообществ, проектов, расчет коэффициентов v.0.2', UserProf1983, 0, '0', '20 000', 0, 0, 0, 0));
	ArtInGlass
	*/

	// Load configuration
	//InitialiseLm();

	if (callback)
		callback(null);
}


exports.Init = Init;
