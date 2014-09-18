/**!
 * LibreMoney 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

//var Constants = require(__dirname + '/../../Constants');


var types = [];


function Add(typ) {
	types.push(typ);
	return true;
}

// return TransactionType
// type - byte, subtype - byte
function Find(type, subtype) {
	for (var i = 0; types.length > i; i++) {
		t = types[i].GetType();
		s = types[i].GetSubtype();
		if ((t == type) && (s == subtype)) {
			return types[i];
		}
	}
	return null;

	/*
	switch (type) {
		case Constants.TYPE_PAYMENT:
			switch (subtype) {
				case Constants.SUBTYPE_PAYMENT_ORDINARY_PAYMENT:
					return LmTrTypePayment.GetOrdinary();
				default:
					return null;
			}
			break;
		case Constants.TYPE_MESSAGING:
			switch (subtype) {
				/*
				case SUBTYPE_MESSAGING_ARBITRARY_MESSAGE:
					return Messaging.ARBITRARY_MESSAGE;
				case SUBTYPE_MESSAGING_ALIAS_ASSIGNMENT:
					return Messaging.ALIAS_ASSIGNMENT;
				case SUBTYPE_MESSAGING_POLL_CREATION:
					return Messaging.POLL_CREATION;
				case SUBTYPE_MESSAGING_VOTE_CASTING:
					return Messaging.VOTE_CASTING;
				case SUBTYPE_MESSAGING_HUB_ANNOUNCEMENT:
					return Messaging.HUB_ANNOUNCEMENT;
				case SUBTYPE_MESSAGING_ACCOUNT_INFO:
					return Messaging.ACCOUNT_INFO;
				case SUBTYPE_MESSAGING_ALIAS_SELL:
					return Messaging.ALIAS_SELL;
				case SUBTYPE_MESSAGING_ALIAS_BUY:
					return Messaging.ALIAS_BUY;
				default:
					return null;
			}
			break;
		case Constants.TYPE_COLORED_COINS:
			switch (subtype) {
				/*
				case SUBTYPE_COLORED_COINS_ASSET_ISSUANCE:
					return ColoredCoins.ASSET_ISSUANCE;
				case SUBTYPE_COLORED_COINS_ASSET_TRANSFER:
					return ColoredCoins.ASSET_TRANSFER;
				case SUBTYPE_COLORED_COINS_ASK_ORDER_PLACEMENT:
					return ColoredCoins.ASK_ORDER_PLACEMENT;
				case SUBTYPE_COLORED_COINS_BID_ORDER_PLACEMENT:
					return ColoredCoins.BID_ORDER_PLACEMENT;
				case SUBTYPE_COLORED_COINS_ASK_ORDER_CANCELLATION:
					return ColoredCoins.ASK_ORDER_CANCELLATION;
				case SUBTYPE_COLORED_COINS_BID_ORDER_CANCELLATION:
					return ColoredCoins.BID_ORDER_CANCELLATION;
				*
				default:
					return null;
			}
			break;
		case Constants.TYPE_DIGITAL_GOODS:
			switch (subtype) {
				/*
				case SUBTYPE_DIGITAL_GOODS_LISTING:
					return DigitalGoods.LISTING;
				case SUBTYPE_DIGITAL_GOODS_DELISTING:
					return DigitalGoods.DELISTING;
				case SUBTYPE_DIGITAL_GOODS_PRICE_CHANGE:
					return DigitalGoods.PRICE_CHANGE;
				case SUBTYPE_DIGITAL_GOODS_QUANTITY_CHANGE:
					return DigitalGoods.QUANTITY_CHANGE;
				case SUBTYPE_DIGITAL_GOODS_PURCHASE:
					return DigitalGoods.PURCHASE;
				case SUBTYPE_DIGITAL_GOODS_DELIVERY:
					return DigitalGoods.DELIVERY;
				case SUBTYPE_DIGITAL_GOODS_FEEDBACK:
					return DigitalGoods.FEEDBACK;
				case SUBTYPE_DIGITAL_GOODS_REFUND:
					return DigitalGoods.REFUND;
				*
				default:
					return null;
			}
			break;
		case Constants.TYPE_ACCOUNT_CONTROL:
			switch (subtype) {
				/*
				case SUBTYPE_ACCOUNT_CONTROL_EFFECTIVE_BALANCE_LEASING:
					return AccountControl.EFFECTIVE_BALANCE_LEASING;
				*
				default:
					return null;
			}
			break;
		case Constants.TYPE_EMIT:
			// xxxx
			break;
		case Constants.TYPE_USER:
			// xxxx
			break;
		case Constants.TYPE_PROJECT:
			// xxxx
			break;
		case Constants.TYPE_GROUP:
			// xxxx
			break;
		default:
			return null;
	}
	*/
}

function IsDuplicate(uniqueType, key, duplicates) {
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


exports.Add = Add;
exports.Find = Find;
exports.FindTransactionType = Find; // deprecated
