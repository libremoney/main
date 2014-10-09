/**!
 * LibreMoney CheckLoading api 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

if (typeof module !== "undefined") {
	var ResponseHelper = require(__dirname + '/../ResponseHelper');
}


function CheckLoading(req, res) {
	var Core = require(__dirname + '/../../Core');
	ResponseHelper.End200Text(res, JSON.stringify({
		loading: !Core.GetSynced()
	}));
}


module.exports = CheckLoading;
