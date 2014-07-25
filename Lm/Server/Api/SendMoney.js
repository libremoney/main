/**!
 * LibreMoney 0.0
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

/*
import nxt.Account;
import nxt.NxtException;
*/

function Main(req, res) {
	var obj = CreateTransaction();
	res.send('This is not implemented');
	/*
	static final SendMoney instance = new SendMoney();

	private SendMoney() {
		super("recipient", "amountNQT");
	}

	JSONStreamAware processRequest(HttpServletRequest req) throws NxtException {
		Long recipient = ParameterParser.getRecipientId(req);
		long amountNQT = ParameterParser.getAmountNQT(req);
		Account account = ParameterParser.getSenderAccount(req);
		return createTransaction(req, account, recipient, amountNQT, null);
	}
	*/
}

module.exports = Main;
