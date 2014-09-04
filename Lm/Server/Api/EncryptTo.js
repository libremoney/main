/**!
 * LibreMoney EncryptTo api 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

/*
import nxt.Account;
import nxt.NxtException;
import nxt.crypto.EncryptedData;
import org.json.simple.JSONStreamAware;
import static nxt.http.JSONResponses.INCORRECT_RECIPIENT;
*/

//super(new APITag[] {APITag.MESSAGES}, "recipient", "messageToEncrypt", "messageToEncryptIsText", "secretPhrase");
function EncryptTo(req, res) {
    res.send('This is not implemented');
    /*
    Long recipientId = ParameterParser.getRecipientId(req);
    Account recipientAccount = Account.getAccount(recipientId);
    if (recipientAccount == null || recipientAccount.getPublicKey() == null) {
        return INCORRECT_RECIPIENT;
    }

    EncryptedData encryptedData = ParameterParser.getEncryptedMessage(req, recipientAccount);
    return JSONData.encryptedData(encryptedData);
    */
}

module.exports = EncryptTo;
