/**!
 * LibreMoney users 0.0
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var users = new Array();


function GetLength() {
	return users.length;
}

function GetUserByIndex(index) {
	return users[index];
}

function Init() {
}


exports.GetLength = GetLength;
exports.GetUserByIndex = GetUserByIndex;
exports.Init = Init;
