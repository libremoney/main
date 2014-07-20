/**!
 * LibreMoney users 0.0
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */


var User = require(__dirname + "/User");


var users = new Array();


function AddNewUser(name) {
	var user = new User(name)
	users.push(user);
	return user;
}

function GetLength() {
	return users.length;
}

function GetUserByIndex(index) {
	return users[index];
}

function Init() {
}


exports.AddNewUser = AddNewUser;
exports.GetLength = GetLength;
exports.GetUserByIndex = GetUserByIndex;
exports.Init = Init;
