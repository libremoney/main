/**!
 * LibreMoney GetGroup api 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var Groups = require(__dirname + "/../Groups");


function GetGroup(req, res) {
	res.send({
		errorCode:100,
		errorDescription:'Not implementted'
	});
}


module.exports = GetGroup;
