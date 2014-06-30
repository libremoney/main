/*!
 * LibreMoney Core Library
 *
 * Copyright(c) 2014 Prof1983 <prof1983@yandex.ru>
 * CC0 license
 *
 */

var rootpath = process.cwd() + '/';
//var path = require('path');
//var fs = require('fs');
//var events = require('events');

Lang = require(__dirname + '/../locale/ru');
//console.log('User='+Lang['User']);

Logger = require(__dirname + '/../lib/logger')(module);
LmAccount = require(__dirname + '/LmAccount');
LmAlias = require(__dirname + '/LmAlias');
LmAliases = require(__dirname + '/LmAliases');
LmAttachment = require(__dirname + '/LmAttachment');
LmAttachmentCommunityCreate = require(__dirname + '/LmAttachment_CommunityCreate');
LmAttachmentUserCreate = require(__dirname + '/LmAttachment_UserCreate');
LmBlock = require(__dirname + '/LmBlock');
LmCommunity = require(__dirname + '/LmCommunity');
LmConstants = require(__dirname + '/LmConstants');
LmDb = require(__dirname + '/LmDb');
LmDbVersion = require(__dirname + '/LmDbVersion');
LmGenerator = require(__dirname + '/LmGenerator');
LmProject = require(__dirname + '/LmProject');
LmTransaction = require(__dirname + '/LmTransaction');
LmTrType = require(__dirname + '/LmTransactionType');
LmTrTypeAccountControl = require(__dirname + '/LmTransactionType_AccountControl');
LmTrTypeColoredCoins = require(__dirname + '/LmTransactionType_ColoredCoins');
LmTrTypeCommunity = require(__dirname + '/LmTransactionType_Community');
LmTrTypeDigitalGoods = require(__dirname + '/LmTransactionType_DigitalGoods');
LmTrTypeMessaging = require(__dirname + '/LmTransactionType_Messaging');
LmTrTypePayment = require(__dirname + '/LmTransactionType_Payment');
LmTrTypeUser = require(__dirname + '/LmTransactionType_User');
LmUser = require(__dirname + '/LmUser');


var Account0 = new LmAccount();

function Log(msg) {
	Logger.info(msg);
}

Log("Account0 is created. Account0.a=" + Account0.a);

/*var User0 = new LmUser('Вася1');
Log("User0 is created. User0.Name=" + User0.Name);
var User1 = new LmUser('Петя1');
Log("User1 is created. User1.Name=" + User1.Name);
User0.ChangeName("Вася2");
Log("User0 name changed. User0.Name=" + User0.Name);
User1.ChangeName("Петя2");
Log("User1 name changed. User1.Name=" + User1.Name);*/

//console.log(module);

// Core object
var Lm = module.exports = {

	// Router and initialisation
	//routingFn:routingFn,
	Init:Init,

	// Configuration exposed
	//reloadConfig:reloadConfig,

	// Core objects - themes, data, modules
	//theme:{},
	//data:{},
	Lang:Lang,
	Modules:{}

};

/*
// Load libraries in the core folder
loadCore(calipso);

function loadCore(calipso) {

	fs.readdirSync(__dirname + '/core').forEach(function (library) {
		var isLibrary = library.split(".").length > 0 && library.split(".")[1] === 'js',
			libName = library.split(".")[0].toLowerCase();
		if (isLibrary) {
			calipso[libName] = require(__dirname + '/core/' + library);
		}
	});

}
module.exports.loaded = true;
*/


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


function Init(App, InitCallback) {
	Lm.App = App;

	// Load the calipso package.json into app.about
	//Lm.module.LoadAbout(App, rootpath, 'package.json');

	// config is the actual instance of loaded config, configuration is the library.
	Lm.Config = App.config;

	// Store the callback function for later
	Lm.InitCallback = function () {
		InitCallback();
	};

	/*
	// Create our calipso event emitter
	calipso.e = new calipso.event.CalipsoEventEmitter({maxListeners:Number(calipso.config.get('server:events:maxListeners'))});
	*/

	LmDb.Connect();

	var UserProf1983 = new LmUser('Prof1983');

	Lm.Users = new Array();
	Lm.Users.push(UserProf1983);

	Lm.Community = new Array();
	Lm.Community.push(new LmCommunity('LibreMoney Team', 'LibreMoney developer team', 'Prof1983'));

	// ---- LmTransaction ----

	LmTrType.Init();

	var ORDINARY = LmTrTypePayment.GetOrdinary();
	Log('ORDINARY: Type='+ORDINARY.GetType()+' Subtype='+ORDINARY.GetSubtype());

	// First emmitting (1 MLm)
	var Tr0 = new LmTransaction(LmTrTypePayment.GetOrdinary(), 1400000000, 255, 0/*SenderPublicKey*/, 0/*RecipientId*/,
		1000000000/*AmountMilliLm*/, 1/*FeeMilliLm*/, 0/*ReferencedTransactionFullHash*/, 0/*Signature*/,
		0/*BlockId*/, 0/*Height*/, 0/*Id*/, 0/*SenderId*/, 0/*BlockTimestamp*/, 0/*FullHash*/);

	PrintTrInfo(Tr0);

	// Create user "LibreMoney"
	var Tr1 = new LmTransaction(LmTrTypeUser.GetUserCreate(), 1400000001, 255, 0/*SenderPublicKey*/, 0/*RecipientId*/,
		1/*AmountMilliLm*/, 1/*FeeMilliLm*/, 0/*ReferencedTransactionFullHash*/, 0/*Signature*/,
		0/*BlockId*/, 0/*Height*/, 0/*Id*/, 0/*SenderId*/, 0/*BlockTimestamp*/, 0/*FullHash*/);
	Tr1.SetAttachment(LmAttachmentUserCreate.Create('LibreMoney', '{"uri": "http://libremoney.org/"}'));

	PrintTrInfo(Tr1);

	// Create community "LibreMoney Team"
	var Tr2 = new LmTransaction(LmTrTypeCommunity.GetCommunityCreate(), 1400000002, 255, 0/*SenderPublicKey*/, 0/*RecipientId*/,
		1/*AmountMilliLm*/, 1/*FeeMilliLm*/, 0/*ReferencedTransactionFullHash*/, 0/*Signature*/,
		0/*BlockId*/, 0/*Height*/, 0/*Id*/, 0/*SenderId*/, 0/*BlockTimestamp*/, 0/*FullHash*/);
	Tr2.SetAttachment(LmAttachmentCommunityCreate.Create('LibreMoney Team', '{"uri": "http://libremoney.org/"}'));

	PrintTrInfo(Tr2);

	Lm.Transactions = new Array();
	Lm.Transactions.push(Tr0);
	Lm.Transactions.push(Tr1);
	Lm.Transactions.push(Tr2);

	Log('Transaction #0 is created');

	// ---- LmBlock ----

	var Transactions0 = new Array();
	Transactions0.push(Tr0);

	var Block0 = new LmBlock(0/*Version*/, 1400000000/*Timestamp*/, 0/*PreviousBlockId*/, 1000000000/*TotalAmountMilliLm*/,
		0/*TotalFeeMilliLm*/, 0/*PayloadLength*/, 0/*PayloadHash*/,
		0/*GeneratorPublicKey*/, 0/*GenerationSignature*/, 0/*BlockSignature*/, 0/*PreviousBlockHash*/, Transactions0);

	Log('Block #0 is created');

	Lm.Projects = new Array();
	Lm.Projects.push(new LmProject('LibreMoney:Start1', 'Доменные имена, Хостинг, Движок сайта', UserProf1983, 3, '2 000', '2 000', 0, 0, 0, 0));
	Lm.Projects.push(new LmProject('LibreMoney:Start2', 'Наполнение сайта первичной информацией', UserProf1983, 3, '3 000', '3 000', 0, 0, 0, 0));
	Lm.Projects.push(new LmProject('LibreMoney:Design1', 'Создание дизайн-проекта libremoney.com v.0.1', UserProf1983, 3, '3 000', '3 000', 0, 0, 0, 0));
	Lm.Projects.push(new LmProject('LibreMoney:BusinessPlan1', 'Разработка бизнес-плана v.0.1', UserProf1983, 3, '3 000', '3 000', 0, 0, 0, 0));
	Lm.Projects.push(new LmProject('LibreMoney:Announce1', 'Анонс на форумах и блогах', UserProf1983, 3, '2 000', '2 000', 0, 0, 0, 0));
	Lm.Projects.push(new LmProject('LibreMoney:TZ01', 'Разработка технического задания v.0.1', UserProf1983, 2, '2 000', '2 000', 0, 0, 0, 0));
	Lm.Projects.push(new LmProject('LibreMoney:DevProtocol01', 'Разработка первичного протокола v.0.1', UserProf1983, 1, '0', '10 000', 0, 0, 0, 0));
	Lm.Projects.push(new LmProject('LibreMoney:DevDb01', 'Разработка структуры БД v.0.1', UserProf1983, 1, '0', '10 000', 0, 0, 0, 0));
	Lm.Projects.push(new LmProject('LibreMoney:DevTransaction01', 'Разработка механизма транзакций v.0.1', UserProf1983, 1, '0', '10 000', 0, 0, 0, 0));
	Lm.Projects.push(new LmProject('LibreMoney:DevSynk01', 'Разработка механизма синхронизации v.0.1', UserProf1983, 1, '0', '10 000', 0, 0, 0, 0));
	Lm.Projects.push(new LmProject('LibreMoney:DevUsers01', 'Разработка механизма регистрации и логина v.0.1', UserProf1983, 1, '0', '10 000', 0, 0, 0, 0));
	Lm.Projects.push(new LmProject('LibreMoney:Test01', 'Тестирование системы v.0.1', UserProf1983, 1, '0', '10 000', 0, 0, 0, 0));
	Lm.Projects.push(new LmProject('LibreMoney:TZ02', 'Разработка технического задания v.0.2', UserProf1983, 0, '0', '10 000', 0, 0, 0, 0));
	Lm.Projects.push(new LmProject('LibreMoney:Community02', 'Разработка механизма сообществ, проектов, расчет коэффициентов v.0.2', UserProf1983, 0, '0', '20 000', 0, 0, 0, 0));
	Lm.Projects.push(new LmProject('LibreMoney:Design2', 'Создание дизайн-проекта libremoney.com v.0.2', UserProf1983, 0, '10 000', '10 000', 0, 0, 0, 0));
	Lm.Projects.push(new LmProject('LibreMoney:BusinessPlan2', 'Разработка бизнес-плана v.0.2', UserProf1983, 0, '10 000', '10 000', 0, 0, 0, 0));

	// Load configuration
	//InitialiseLm();

	InitCallback();
}

/**
 * Core router function.
 *
 * Returns a connect middleware function that manages the roucting
 * of requests to modules.
 *
 * Expects Calipso to be initialised.
 */
/*
function routingFn() {

	// Return the function that manages the routing
	// Ok being non-synchro
	return function (req, res, next) {

		// Default menus and blocks for each request
		// More of these can be added in modules, these are jsut the defaults
		res.menu = {
			admin:new calipso.menu('admin', 'weight', 'root', {
				cls:'admin'
			}),
			adminToolbar:new calipso.menu('adminToolbar', 'weight', 'root', {
				cls:'admin-toolbar toolbar'
			}),
			// TODO - Configurable!
			userToolbar:new calipso.menu('userToolbar', 'weight', 'root', {
				cls:'user-toolbar toolbar'
			}),
			primary:new calipso.menu('primary', 'name', 'root', {
				cls:'primary'
			}),
			secondary:new calipso.menu('secondary', 'name', 'root', {
				cls:'secondary'
			})
		};


		// Initialise our clientJS library linked to this request
		var Client = require('./client/Client');
		res.client = new Client();

		// Initialise helpers - first pass
		calipso.helpers.getDynamicHelpers(req, res, calipso);

		// Route the modules
		calipso.module.eventRouteModules(req, res, next);

	};

}
*/

/**
 * Load the application configuration
 * Configure the logging
 * Configure the theme
 * Load the modules
 * Initialise the modules
 *
 * @argument config
 *
 */
function InitialiseLm(reloadConfig) {
	// Check if we need to reload the config from disk (e.g. from cluster mode)
	if (reloadConfig) {
		return; //calipso.config.load(finish);
	} else {
		/*
		// Clear Event listeners
		calipso.e.init();

		// Configure the logging
		calipso.logging.configureLogging();

		// Check / Connect Mongo
		calipso.storage.mongoConnect(process.env.MONGO_URI || calipso.config.get('database:uri'), false, function (err, connected) {

			if (err) {
				console.log("There was an error connecting to the database: " + err.message);
				process.exit();
			}

			// Load all the themes
			loadThemes(function () {

				// Initialise the modules and  theming engine
				configureTheme(function () {

					// Load all the modules
					calipso.module.loadModules(function () {

						// Initialise, callback via calipso.initCallback
						calipso.module.initModules();

					});

				});

			});
		});
		*/
	}
}

/**
 * Called both via a hook.io event as
 * well as via the server that initiated it.
 */
/*
function reloadConfig(event, data, next) {

	// Create a callback
	calipso.initCallback = function (err) {
		// If called via event emitter rather than hook
		if (typeof next === "function") {
			next(err);
		}
	};
	return InitialiseLm(true);

}
*/

/**
 * Load the available themes into the calipso.themes object
 */

/*
function loadThemes(next) {

	var themeBasePath = calipso.config.get('server:themePath'),
		themePath, legacyTheme, themes;

	// Load the available themes
	calipso.availableThemes = calipso.availableThemes || {};

	calipso.lib.fs.readdirSync(calipso.lib.path.join(rootpath, themeBasePath)).forEach(function (folder) {

		if (folder != "README" && folder[0] != '.') {

			themes = calipso.lib.fs.readdirSync(calipso.lib.path.join(rootpath, themeBasePath, folder));

			// First scan for legacy themes
			legacyTheme = false;
			themes.forEach(function (theme) {
				if (theme === "theme.json") {
					legacyTheme = true;
					console.log("Themes are now stored in sub-folders under the themes folder, please move: " + folder + " (e.g. to custom/" + folder + ").\r\n");
				}
			});

			// Process
			if (!legacyTheme) {
				themes.forEach(function (theme) {

					if (theme != "README" && theme[0] != '.') {
						themePath = calipso.lib.path.join(rootpath, themeBasePath, folder, theme);
						// Create the theme object
						calipso.availableThemes[theme] = {
							name:theme,
							path:themePath
						};
						// Load the about info from package.json
						calipso.module.loadAbout(calipso.availableThemes[theme], themePath, 'theme.json');
					}
				});
			}
		}
	});

	next();

}
*/

/**
 * Configure a theme using the theme library.
 */

/*
function configureTheme(next, overrideTheme) {

	var defaultTheme = calipso.config.get("theme:default");
	var themeName = overrideTheme ? overrideTheme : calipso.config.get('theme:front');
	var themeConfig = calipso.availableThemes[themeName]; // Reference to theme.json
	if (themeConfig) {

		// Themes is the library
		calipso.themes.Theme(themeConfig, function (err, loadedTheme) {

			// Current theme is always in calipso.theme
			calipso.theme = loadedTheme;

			if (err) {
				calipso.error(err.message);
			}

			if (!calipso.theme) {

				if (loadedTheme.name === defaultTheme) {
					calipso.error('There has been a failure loading the default theme, calipso cannot start until this is fixed, terminating.');
					process.exit();
					return;
				} else {
					calipso.error('The `' + themeName + '` theme failed to load, attempting to use the default theme: `' + defaultTheme + '`');
					configureTheme(next, defaultTheme);
					return;
				}

			} else {

				calipso.debug('beggining to deal with \'stack\'');
				// Search for middleware that already has themeStatic tag
				var foundMiddleware = false,
					mw;
				calipso.app.stack.forEach(function (middleware, key) {
					if (middleware.handle.tag === 'theme.stylus') {
						calipso.debug('calipso.app.stack found theme.stylus');
						foundMiddleware = true;
						if ((fs.existsSync || path.existsSync)(themeConfig.path + '/stylus')) {
							mw = calipso.app.mwHelpers.stylusMiddleware(themeConfig.path);
						} else {
							mw = {tag:'theme.stylus'};
						}
						calipso.app.stack[key].handle = mw;
					}

					if (middleware.handle.tag === 'theme.static') {
						calipso.debug('calipso.app.stack found theme.static');
						foundMiddleware = true;
						mw = calipso.app.mwHelpers.staticMiddleware(themeConfig.path);
						mw.tag = 'theme.static';
						calipso.app.stack[key].handle = mw;
					}

				});

				calipso.debug('calipso.app.stack WITH THEME = ' + require('util').inspect(calipso.app.stack));

				next();

			}

		});

	} else {

		if (themeName === defaultTheme) {
			console.error("Unable to locate the theme: " + themeName + ", terminating.");
			process.exit();
		} else {
			calipso.error('The `' + themeName + '` theme is missing, trying the default theme: `' + defaultTheme + '`');
			configureTheme(next, defaultTheme);
		}

	}

}
*/
