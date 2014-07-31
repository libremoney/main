/**!
 * LibreMoney 0.0
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var path = require('path');


function InitCommunityModel(mongoose, modelName) {
	var Schema = new mongoose.Schema({
		//properties:
		name: { type: String, required: true }
	});
	return mongoose.model(path.basename(module.filename, '.js'), Schema);
};


module.exports = InitCommunityModel;
