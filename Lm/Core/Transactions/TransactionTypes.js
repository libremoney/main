/**!
 * LibreMoney TransactionTypes 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */


var TransactionTypes = function() {
	var types = [];
	return this;
}();

TransactionTypes.Add = function(typ) {
	this.types.push(typ);
	return true;
}

// return TransactionType
// type - byte, subtype - byte
TransactionTypes.Find = function(type, subtype) {
	for (var i = 0; this.types.length > i; i++) {
		t = this.types[i].GetType();
		s = this.types[i].GetSubtype();
		if ((t == type) && (s == subtype)) {
			return this.types[i];
		}
	}
	return null;
}

// deprecated
TransactionTypes.FindTransactionType = function(type, subtype) {
	return this.Find(type, subtype);
}

TransactionTypes.IsDuplicate = function(uniqueType, key, duplicates) {
	throw new Error('Not implementted');
	/*
	Set<String> typeDuplicates = duplicates.get(uniqueType);
	if (typeDuplicates == null) {
		typeDuplicates = new HashSet<>();
		duplicates.put(uniqueType, typeDuplicates);
	}
	return ! typeDuplicates.add(key);
	*/
}

/*
public static final class UndoNotSupportedException extends NxtException {
	UndoNotSupportedException(String message) {
		super(message);
	}
}

public static final class NotYetEnabledException extends NxtException.ValidationException {
	NotYetEnabledException(String message) {
		super(message);
	}
}
*/


if (typeof module !== "undefined") {
	module.exports = TransactionTypes;
}
