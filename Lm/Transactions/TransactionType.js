
//var LmGenesis = require(__dirname + '/LmGenesis');
var LmTrTypePayment = require(__dirname + '/TransactionType_Payment');
//var LmTrTypeUser = require(__dirname + '/TransactionType_User');
//var LmTrTypeColoredCoins = require(__dirname + '/TransactionType_ColoredCoins');


var Payment = {};


// return TransactionType
// Type - byte, Subtype - byte
function FindTransactionType(Type, Subtype) {
	switch (Type) {
		case TYPE_PAYMENT:
			switch (Subtype) {
				case SUBTYPE_PAYMENT_ORDINARY_PAYMENT:
					return LmTrTypePayment.GetOrdinary();
				default:
					return null;
			}
			break;
		case TYPE_MESSAGING:
			switch (Subtype) {
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
				*/
				default:
					return null;
			}
			break;
		case TYPE_COLORED_COINS:
			switch (Subtype) {
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
				*/
				default:
					return null;
			}
			break;
		case TYPE_DIGITAL_GOODS:
			switch (Subtype) {
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
				*/
				default:
					return null;
			}
			break;
		case TYPE_ACCOUNT_CONTROL:
			switch (Subtype) {
				/*
				case SUBTYPE_ACCOUNT_CONTROL_EFFECTIVE_BALANCE_LEASING:
					return AccountControl.EFFECTIVE_BALANCE_LEASING;
				*/
				default:
					return null;
			}
			break;
		case TYPE_EMIT:
			// xxxx
			break;
		case TYPE_USER:
			// xxxx
			break;
		case TYPE_PROJECT:
			// xxxx
			break;
		case TYPE_GROUP:
			// xxxx
			break;
		case TYPE_COMMUNITY:
			// xxxx
			break;
		default:
			return null;
	}
}

function CreateTransactionType() {
	var obj = {};

	function GetName() {
		return '';
	}

	function GetType() {}

	function GetSubtype() {}

	function DoLoadAttachment_Buf(Transaction, Buffer) {}

	function DoLoadAttachment_Json(Transaction, AttachmentData) {}

	function LoadAttachment_Buf(Transaction, Buffer) {
		DoLoadAttachment_Buf(Transaction, Buffer);
		//validateAttachment(transaction);
	}

	function LoadAttachment_Json(Transaction, AttachmentData) {
		DoLoadAttachment_Json(Transaction, AttachmentData);
		//validateAttachment(transaction);
	}

	function ValidateAttachment(Transaction) {}

	// return false iff double spending
	function ApplyUnconfirmed(Transaction, SenderAccount) {
		/*
		long totalAmountNQT = Convert.safeAdd(transaction.getAmountNQT(), transaction.getFeeNQT());
		if (transaction.getReferencedTransactionFullHash() != null
				&& transaction.getTimestamp() > Constants.REFERENCED_TRANSACTION_FULL_HASH_BLOCK_TIMESTAMP) {
			totalAmountNQT = Convert.safeAdd(totalAmountNQT, Constants.UNCONFIRMED_POOL_DEPOSIT_NQT);
		}
		if (senderAccount.getUnconfirmedBalanceNQT() < totalAmountNQT
				&& ! (transaction.getTimestamp() == 0 && Arrays.equals(senderAccount.getPublicKey(), LmGenesis.CreatorPublicKey))) {
			return false;
		}
		senderAccount.addToUnconfirmedBalanceNQT(- totalAmountNQT);
		if (! applyAttachmentUnconfirmed(transaction, senderAccount)) {
			senderAccount.addToUnconfirmedBalanceNQT(totalAmountNQT);
			return false;
		}
		return true;
		*/
	}

	function ApplyAttachmentUnconfirmed(Transaction, SenderAccount) {}

	function Apply(Transaction, SenderAccount, RecipientAccount) {
		/*
		senderAccount.addToBalanceNQT(- (Convert.safeAdd(transaction.getAmountNQT(), transaction.getFeeNQT())));
		if (transaction.getReferencedTransactionFullHash() != null
				&& transaction.getTimestamp() > Constants.REFERENCED_TRANSACTION_FULL_HASH_BLOCK_TIMESTAMP) {
			senderAccount.addToUnconfirmedBalanceNQT(Constants.UNCONFIRMED_POOL_DEPOSIT_NQT);
		}
		applyAttachment(transaction, senderAccount, recipientAccount);
		*/
	}

	function ApplyAttachment(Transaction, SenderAccount, RecipientAccount) {}

	function UndoUnconfirmed(Transaction, SenderAccount) {
		/*
		senderAccount.addToUnconfirmedBalanceNQT(Convert.safeAdd(transaction.getAmountNQT(), transaction.getFeeNQT()));
		if (transaction.getReferencedTransactionFullHash() != null
				&& transaction.getTimestamp() > Constants.REFERENCED_TRANSACTION_FULL_HASH_BLOCK_TIMESTAMP) {
			senderAccount.addToUnconfirmedBalanceNQT(Constants.UNCONFIRMED_POOL_DEPOSIT_NQT);
		}
		undoAttachmentUnconfirmed(transaction, senderAccount);
		*/
	}

	function UndoAttachmentUnconfirmed(Transaction, SenderAccount) {}

	function Undo(Transaction, SenderAccount, RecipientAccount) {
		/*
		senderAccount.addToBalanceNQT(Convert.safeAdd(transaction.getAmountNQT(), transaction.getFeeNQT()));
		if (transaction.getReferencedTransactionFullHash() != null
				&& transaction.getTimestamp() > Constants.REFERENCED_TRANSACTION_FULL_HASH_BLOCK_TIMESTAMP) {
			senderAccount.addToUnconfirmedBalanceNQT(- Constants.UNCONFIRMED_POOL_DEPOSIT_NQT);
		}
		undoAttachment(transaction, senderAccount, recipientAccount);
		*/
	}

	function UndoAttachment(Transaction, SenderAccount, RecipientAccount) {}

	function IsDuplicate(Transaction, Duplicates) {
		return false;
	}

	obj.GetName = GetName;
	obj.GetType = GetType;
	obj.GetSubtype = GetSubtype;
	obj.DoLoadAttachment_Buf = DoLoadAttachment_Buf;
	obj.DoLoadAttachment_Json = DoLoadAttachment_Json;
	obj.LoadAttachment_Buf = LoadAttachment_Buf;
	obj.LoadAttachment_Json = LoadAttachment_Json;
	obj.ValidateAttachment = ValidateAttachment;
	obj.ApplyUnconfirmed = ApplyUnconfirmed;
	obj.ApplyAttachmentUnconfirmed = ApplyAttachmentUnconfirmed;
	obj.Apply = Apply;
	obj.ApplyAttachment = ApplyAttachment;
	obj.UndoUnconfirmed = UndoUnconfirmed;
	obj.UndoAttachmentUnconfirmed = UndoAttachmentUnconfirmed;
	obj.Undo = Undo;
	obj.UndoAttachment = UndoAttachment;
	obj.IsDuplicate = IsDuplicate;
	return obj;
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

function Init() {
	LmTrTypeColoredCoins.Init();
	Payment.Ordinary = LmTrTypePayment.GetOrdinary();
}



exports.TYPE_PAYMENT = 0;
exports.TYPE_MESSAGING = 1;
exports.TYPE_COLORED_COINS = 2;
exports.TYPE_DIGITAL_GOODS = 3;
exports.TYPE_ACCOUNT_CONTROL = 4;
exports.TYPE_EMIT = 16;
exports.TYPE_USER = 17;
exports.TYPE_PROJECT = 18;
exports.TYPE_COMMUNITY = 19;

exports.SUBTYPE_PAYMENT_ORDINARY_PAYMENT = 0;

exports.SUBTYPE_MESSAGING_ARBITRARY_MESSAGE = 0;
exports.SUBTYPE_MESSAGING_ALIAS_ASSIGNMENT = 1;
exports.SUBTYPE_MESSAGING_POLL_CREATION = 2;
exports.SUBTYPE_MESSAGING_VOTE_CASTING = 3;
exports.SUBTYPE_MESSAGING_HUB_ANNOUNCEMENT = 4;
exports.SUBTYPE_MESSAGING_ACCOUNT_INFO = 5;

exports.SUBTYPE_COLORED_COINS_ASSET_ISSUANCE = 0;
exports.SUBTYPE_COLORED_COINS_ASSET_TRANSFER = 1;
exports.SUBTYPE_COLORED_COINS_ASK_ORDER_PLACEMENT = 2;
exports.SUBTYPE_COLORED_COINS_BID_ORDER_PLACEMENT = 3;
exports.SUBTYPE_COLORED_COINS_ASK_ORDER_CANCELLATION = 4;
exports.SUBTYPE_COLORED_COINS_BID_ORDER_CANCELLATION = 5;

exports.SUBTYPE_DIGITAL_GOODS_LISTING = 0;
exports.SUBTYPE_DIGITAL_GOODS_DELISTING = 1;
exports.SUBTYPE_DIGITAL_GOODS_PRICE_CHANGE = 2;
exports.SUBTYPE_DIGITAL_GOODS_QUANTITY_CHANGE = 3;
exports.SUBTYPE_DIGITAL_GOODS_PURCHASE = 4;
exports.SUBTYPE_DIGITAL_GOODS_DELIVERY = 5;
exports.SUBTYPE_DIGITAL_GOODS_FEEDBACK = 6;
exports.SUBTYPE_DIGITAL_GOODS_REFUND = 7;

exports.SUBTYPE_ACCOUNT_CONTROL_EFFECTIVE_BALANCE_LEASING = 0;

exports.SUBTYPE_EMIT_EMISSION = 0;

exports.SUBTYPE_USER_CREATE = 0;

exports.SUBTYPE_PROJECT_CREATE = 0;
exports.SUBTYPE_PROJECT_ANNOUNCE = 1;
exports.SUBTYPE_PROJECT_EDIT = 2;
exports.SUBTYPE_PROJECT_BEGIN = 3;

exports.SUBTYPE_COMMUNITY_CREATE = 0;


exports.Payment = Payment;

exports.FindTransactionType = FindTransactionType;
exports.CreateTransactionType = CreateTransactionType;
exports.Init = Init;
