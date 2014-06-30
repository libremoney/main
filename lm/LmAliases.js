
var aliases = []; //private static final ConcurrentMap<String, Alias> aliases = new ConcurrentHashMap<>();
//private static final ConcurrentMap<Long, Alias> aliasIdToAliasMappings = new ConcurrentHashMap<>();
var allAliases = []; //private static final Collection<Alias> allAliases = Collections.unmodifiableCollection(aliases.values());

// ========

function Clear() {
    //aliases.clear();
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

/*
static void addOrUpdateAlias(Account account, Long transactionId, String aliasName, String aliasURI, int timestamp) {
    String normalizedAlias = aliasName.toLowerCase();
    Alias newAlias = new Alias(account, transactionId, aliasName, aliasURI, timestamp);
    Alias oldAlias = aliases.putIfAbsent(normalizedAlias, newAlias);
    if (oldAlias == null) {
        aliasIdToAliasMappings.putIfAbsent(transactionId, newAlias);
    } else {
        oldAlias.aliasURI = aliasURI.intern();
        oldAlias.timestamp = timestamp;
    }
}
*/

function Remove(Alias) {
    //aliases.remove(alias.getAliasName().toLowerCase());
    //aliasIdToAliasMappings.remove(alias.getId());
}


module.exports.GetAllAliases = GetAllAliases;
module.exports.GetAliasByName = GetAliasByName;
module.exports.GetAliasById = GetAliasById;
module.exports.Remove = Remove;
module.exports.Clear = Clear;
