/**!
 * LibreMoney 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

function User(userName) {
	this.name = userName;
	return this;
}

function ChangeName(newUserName) {
	this.name = newUserName;
}


User.prototype.ChangeName = ChangeName;


module.exports = User;
