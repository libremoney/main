
function Main(mongoose) {
	var UserSchema = new mongoose.Schema({
		name: { type: String, required: true },
		account_id: { type: String, required: true }
	});

	// validation
	UserSchema.path('name').validate(function (v) {
		return v.length > 4 && v.length < 32;
	});

	var UserModel = mongoose.model('User', UserSchema);

	return UserModel;
}

module.exports = Main;
