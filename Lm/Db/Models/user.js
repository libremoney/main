/**!
 * LibreMoney 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

function InitUsersModel(mongoose, modelName) {
	var UserSchema = new mongoose.Schema({
		//properties:
		name: { type: String, required: true },
		account_id: { type: String, required: true }
	});

	// validation
	UserSchema.path('name').validate(function (v) {
		return v.length > 4 && v.length < 32;
	});

	var UserModel = mongoose.model(modelName, UserSchema);

	return UserModel;
}


module.exports = InitUsersModel;
