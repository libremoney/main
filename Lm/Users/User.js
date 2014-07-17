
function User(UserName) {
	return {
		Name: UserName,
		ChangeName: ChangeName
	}
}

function ChangeName(NewUserName) {
	this.Name = NewUserName;
}

// ==== Exports ====

module.exports = User;
