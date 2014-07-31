/**!
 * LibreMoney users 0.0
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var AttachmentUserCreate = require(__dirname + '/Attachment_UserCreate');
var Transactions = require(__dirname + '/../Transactions');
var User = require(__dirname + "/User");
var UserTrType = require(__dirname + '/UserTrType');


var users = new Array();


function AddNewUser(name) {
	var user = new User(name)
	users.push(user);
	return user;
}

function AddNewUserEx(data) {
	var user = AddNewUser(data.name);
	data.type = UserTrType.GetUserCreate();
	var tr = Transactions.CreateTransaction(data);
	tr.SetAttachment(AttachmentUserCreate.Create(data.name, data.description));
	user.transaction = tr;
	return user;
}

function GetLength() {
	return users.length;
}

function GetUserByIndex(index) {
	return users[index];
}

function Init() {
	UserTrType.Init();
}


exports.AddNewUser = AddNewUser;
exports.AddNewUserEx = AddNewUserEx;
exports.GetLength = GetLength;
exports.GetUserByIndex = GetUserByIndex;
exports.Init = Init;
