
var aliases = new Array(); //private static final ConcurrentMap<String, Alias> aliases = new ConcurrentHashMap<>();
//private static final ConcurrentMap<Long, Alias> aliasIdToAliasMappings = new ConcurrentHashMap<>();
var allAliases = new Array(); //private static final Collection<Alias> allAliases = Collections.unmodifiableCollection(aliases.values());


function AddOrUpdateAlias(account, transactionId, aliasName, aliasUri, timestamp) {
    throw 'Not';
    /*
    String normalizedAlias = aliasName.toLowerCase();
    Alias newAlias = new Alias(account, transactionId, aliasName, aliasURI, timestamp);
    Alias oldAlias = aliases.putIfAbsent(normalizedAlias, newAlias);
    if (oldAlias == null) {
        aliasIdToAliasMappings.putIfAbsent(transactionId, newAlias);
    } else {
        oldAlias.aliasURI = aliasURI.intern();
        oldAlias.timestamp = timestamp;
    }
    */
}

function Clear() {
    aliases = new Array();
    //aliasIdToAliasMappings.clear();
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

function Init() {
}

function Remove(Alias) {
    throw 'Not';
    //aliases.remove(alias.getAliasName().toLowerCase());
    //aliasIdToAliasMappings.remove(alias.getId());
}


exports.AddOrUpdateAlias = AddOrUpdateAlias;
exports.Clear = Clear;
exports.GetAllAliases = GetAllAliases;
exports.GetAliasByName = GetAliasByName;
exports.GetAliasById = GetAliasById;
exports.Init = Init;
exports.Remove = Remove;
