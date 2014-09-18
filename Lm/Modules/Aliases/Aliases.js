/*!
 * LibreMoney Aliases 0.1
 * Copyright(c) 2014 LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var Core = require(__dirname + '/../Core');


var aliases = new Array();
//private static final ConcurrentMap<Long, Alias> aliasIdToAliasMappings = new ConcurrentHashMap<>();
var allAliases = new Array();
var aliasesToSell = new Array();


function AddOrUpdateAlias(account, transactionId, aliasName, aliasUri, timestamp) {
	throw new Error('Not implementted');
	/*
	String normalizedAlias = aliasName.toLowerCase();
	Alias oldAlias = aliases.get(normalizedAlias);
	if (oldAlias == null) {
		Alias newAlias = new Alias(account, transactionId, aliasName, aliasURI, timestamp);
		aliases.put(normalizedAlias, newAlias);
		aliasIdToAliasMappings.put(transactionId, newAlias);
	} else {
		oldAlias.aliasURI = aliasURI.intern();
		oldAlias.timestamp = timestamp;
	}
	*/
}

function AddSellOffer(aliasName, priceMilliLm, buyerAccount) {
	throw new Error('Not implementted');
	/*
	aliasesToSell.put(aliasName.toLowerCase(), new Offer(priceNQT, buyerAccount != null ? buyerAccount.getId() : null));
	*/
}

function ChangeOwner(newOwner, aliasName, timestamp) {
	throw new Error('Not implementted');
	/*
	String normalizedName = aliasName.toLowerCase();
	Alias oldAlias = aliases.get(normalizedName);
	Long id = oldAlias.getId();
	Alias newAlias = new Alias(newOwner, id, aliasName, oldAlias.aliasURI, timestamp);
	aliasesToSell.remove(normalizedName);
	aliases.put(normalizedName, newAlias);
	aliasIdToAliasMappings.put(id, newAlias);
	*/
}

function Clear() {
	aliases.length = 0;
	//aliasIdToAliasMappings.length = 0;
	aliasesToSell.length = 0;
}

function GetAllAliases() {
	return allAliases;
}

function GetAliasById(Id) {
	//return aliasIdToAliasMappings.get(id);
	return false;
}

function GetAliasByName(AliasName) {
	//return aliases.get(aliasName.toLowerCase());
	return false;
}

function GetAliasesByOwner(accountId) {
	throw new Error('Not implementted');
	/*
	List<Alias> filtered = new ArrayList<>();
	for (Alias alias : Alias.getAllAliases()) {
		if (alias.getAccountId().equals(accountId)) {
			filtered.add(alias);
		}
	}
	return filtered;
	*/
}

function GetOffer(aliasName) {
	return aliasesToSell[aliasName.toLowerCase()];
}

function Init() {
	Core.AddListener(Core.Event.Clear, function() {
		Clear();
	});
	Core.AddListener(Core.Event.GetState, OnGetState);
	Core.AddListener(Core.Event.InitServer, OnInitServer);
}

function OnGetState(response) {
	response.numberOfAliases = allAliases.length;
}

function OnInitServer() {
	var Api = require(__dirname + "/Api");
	app.get("/api/buyAlias", Api.BuyAlias);
	app.get("/api/getAlias", Api.GetAlias);
	app.get("/api/getAliases", Api.GetAliases);
	app.get("/api/sellAlias", Api.SellAlias);
	app.get("/api/setAlias", Api.SetAlias);
}

function Remove(Alias) {
	throw new Error('Not implementted');
	//aliases.remove(alias.getAliasName().toLowerCase());
	//aliasIdToAliasMappings.remove(alias.getId());
}


exports.AddOrUpdateAlias = AddOrUpdateAlias;
exports.AddSellOffer = AddSellOffer;
exports.ChangeOwner = ChangeOwner;
exports.Clear = Clear;
exports.GetAllAliases = GetAllAliases;
exports.GetAliasByName = GetAliasByName;
exports.GetAliasById = GetAliasById;
exports.GetAliasesByOwner = GetAliasesByOwner;
exports.GetOffer = GetOffer;
exports.Init = Init;
exports.Remove = Remove;

exports.SUBTYPE_MESSAGING_ALIAS_ASSIGNMENT = 1;
exports.SUBTYPE_MESSAGING_ALIAS_SELL = 6;
exports.SUBTYPE_MESSAGING_ALIAS_BUY = 7;
