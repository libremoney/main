/*
import nxt.Account;
import nxt.Attachment;
import nxt.Constants;
import nxt.NxtException;
import nxt.util.Convert;
import static nxt.http.JSONResponses.INCORRECT_ARBITRARY_MESSAGE;
import static nxt.http.JSONResponses.MISSING_MESSAGE;
*/

function Main(req, res) {
	var obj = CreateTransaction();
	//static final SendMessage instance = new SendMessage();
	res.send('This is not implemented');
	/*
	private SendMessage() {
		super("recipient", "message");
	}

	JSONStreamAware processRequest(HttpServletRequest req) throws NxtException {

		Long recipient = ParameterParser.getRecipientId(req);

		String messageValue = req.getParameter("message");
		if (messageValue == null) {
			return MISSING_MESSAGE;
		}

		byte[] message;
		try {
			message = Convert.parseHexString(messageValue);
		} catch (RuntimeException e) {
			return INCORRECT_ARBITRARY_MESSAGE;
		}
		if (message.length > Constants.MAX_ARBITRARY_MESSAGE_LENGTH) {
			return INCORRECT_ARBITRARY_MESSAGE;
		}

		Account account = ParameterParser.getSenderAccount(req);

		Attachment attachment = new Attachment.MessagingArbitraryMessage(message);
		return createTransaction(req, account, recipient, 0, attachment);
	}
	*/
}

module.exports = Main;
