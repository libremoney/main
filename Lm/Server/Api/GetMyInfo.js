/**!
 * LibreMoney 0.0
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */


function GetMyInfo(req, res) {
	var response = {};
	response.host = req.getRemoteHost();
	response.address = req.getRemoteAddr();
	res.send(response);
	return true;
}


module.exports = GetMyInfo;
