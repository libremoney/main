/**!
 * LibreMoney 0.0
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

//stmt.executeUpdate("INSERT INTO version VALUES (1)");


function InitBlockModel(mongoose, modelName) {
	var schema = new mongoose.Schema({
		next_update: { type: Number, required: true } //INT
	});
	return mongoose.model(modelName, schema);
};


module.exports = InitBlockModel;
