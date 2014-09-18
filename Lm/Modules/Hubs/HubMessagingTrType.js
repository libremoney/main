/**!
 * LibreMoney 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var Constants = require(__dirname + '/../Constants');
var Messaging = require(__dirname + '/../Messages/MessagingTrType');
var TransactionType = require(__dirname + '/../Transactions/TransactionType');


/*
public static final TransactionType HUB_ANNOUNCEMENT = new Messaging() {

	public final byte getSubtype() {
		return TransactionType.SUBTYPE_MESSAGING_HUB_ANNOUNCEMENT;
	}

	Attachment.MessagingHubAnnouncement parseAttachment(ByteBuffer buffer, byte transactionVersion) throws NxtException.NotValidException {
		return new Attachment.MessagingHubAnnouncement(buffer, transactionVersion);
	}

	Attachment.MessagingHubAnnouncement parseAttachment(JSONObject attachmentData) throws NxtException.NotValidException {
		return new Attachment.MessagingHubAnnouncement(attachmentData);
	}

	void applyAttachment(Transaction transaction, Account senderAccount, Account recipientAccount) {
		Attachment.MessagingHubAnnouncement attachment = (Attachment.MessagingHubAnnouncement) transaction.getAttachment();
		Hub.addOrUpdateHub(senderAccount.getId(), attachment.getMinFeePerByteNQT(), attachment.getUris());
	}

	void undoAttachment(Transaction transaction, Account senderAccount, Account recipientAccount) throws UndoNotSupportedException {
		Hub.removeHub(senderAccount.getId());
	}

	void validateAttachment(Transaction transaction) throws NxtException.ValidationException {
		if (Nxt.getBlockchain().getLastBlock().getHeight() < Constants.TRANSPARENT_FORGING_BLOCK_7) {
			throw new NxtException.NotYetEnabledException("Hub terminal announcement not yet enabled at height " + Nxt.getBlockchain().getLastBlock().getHeight());
		}
		Attachment.MessagingHubAnnouncement attachment = (Attachment.MessagingHubAnnouncement) transaction.getAttachment();
		if (attachment.getMinFeePerByteNQT() < 0 || attachment.getMinFeePerByteNQT() > Constants.MAX_BALANCE_NQT
				|| attachment.getUris().length > Constants.MAX_HUB_ANNOUNCEMENT_URIS) {
			// cfb: "0" is allowed to show that another way to determine the min fee should be used
			throw new NxtException.NotValidException("Invalid hub terminal announcement: " + attachment.getJSONObject());
		}
		for (String uri : attachment.getUris()) {
			if (uri.length() > Constants.MAX_HUB_ANNOUNCEMENT_URI_LENGTH) {
				throw new NxtException.NotValidException("Invalid URI length: " + uri.length());
			}
			//TODO: also check URI validity here?
		}
	}

	public boolean hasRecipient() {
		return false;
	}
};
*/

function Init() {
	// xxxx
}


exports.Init = Init;
