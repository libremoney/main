/**!
 * LibreMoney GetVersion api 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */


function GetVersion(req, res) {
	var Core = require(__dirname + '/../../Core');
	var response = {};
	response.version = Core.GetVersion();
	res.send(response);
	return true;
}


module.exports = GetVersion;
