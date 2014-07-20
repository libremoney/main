/*
import nxt.Account;
import nxt.Attachment;
import nxt.Constants;
import nxt.NxtException;
import nxt.util.Convert;
import static nxt.http.JSONResponses.INCORRECT_ACCOUNT_DESCRIPTION_LENGTH;
import static nxt.http.JSONResponses.INCORRECT_ACCOUNT_NAME_LENGTH;
*/

function Main(req, res) {
	var obj = CreateTransaction();
	res.send('This is not implemented');
	/*
	static final SetAccountInfo instance = new SetAccountInfo();

	private SetAccountInfo() {
		super("name", "description");
	}

	JSONStreamAware processRequest(HttpServletRequest req) throws NxtException {

		String name = Convert.nullToEmpty(req.getParameter("name")).trim();
		String description = Convert.nullToEmpty(req.getParameter("description")).trim();

		if (name.length() > Constants.MaxAccountNameLength) {
			return INCORRECT_ACCOUNT_NAME_LENGTH;
		}

		if (description.length() > Constants.MaxAccountDescriptionLength) {
			return INCORRECT_ACCOUNT_DESCRIPTION_LENGTH;
		}

		Account account = ParameterParser.getSenderAccount(req);
		Attachment attachment = new Attachment.MessagingAccountInfo(name, description);
		return createTransaction(req, account, attachment);
	}
	*/
}

module.exports = Main;
