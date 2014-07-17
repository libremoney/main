/*
import org.json.simple.JSONStreamAware;
import static nxt.user.JSONResponses.LOCK_ACCOUNT;
*/

/*
static final LockAccount instance = new LockAccount();
*/

function LockAccount() {
	return UserRequestHandler.Create();
}

function ProcessRequest(req, user) {
	/*
	user.lockAccount();
	return LOCK_ACCOUNT;
	*/
}

LockAccount.prototype.ProcessRequest = ProcessRequest;


exports.Create = LockAccount;
