/**!
 * LibreMoney 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var AbstractAppendix = require(__dirname + '/../Appendix/AbstractAppendix');


function AbstractAttachment(version) { /*attachmentData*/ /*buffer, transactionVersion*/
	var obj = new AbstractAppendix(version); //(attachmentData); //(buffer, transactionVersion); //implements Attachment

	function Apply(transaction, senderAccount, recipientAccount) {
		this.GetTransactionType().Apply(transaction, senderAccount, recipientAccount);
	}

	function Undo(transaction, senderAccount, recipientAccount) {
		this.GetTransactionType().Undo(transaction, senderAccount, recipientAccount);
	}

	function Validate(transaction) {
		this.GetTransactionType().ValidateAttachment(transaction);
	}

	obj.Apply = Apply;
	obj.Undo = Undo;
	obj.Validate = Validate;
	return obj;
}


module.exports = AbstractAttachment;
