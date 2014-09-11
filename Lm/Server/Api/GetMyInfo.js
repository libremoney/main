/**!
 * LibreMoney GetMyInfo api 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

//super(new APITag[] {APITag.INFO});
function GetMyInfo(req, res) {
	var response = {};
	response.host = req.getRemoteHost();
	response.address = req.getRemoteAddr();
	res.send(response);
	return true;
}


module.exports = GetMyInfo;
