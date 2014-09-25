/**!
 * LibreMoney Users 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var AttachmentUserCreate = require(__dirname + '/Attachment_UserCreate');
var Core = require(__dirname + '/../../Core');
var Transactions = require(__dirname + '/../../Core/Transactions');
var User = require(__dirname + "/User");
var UserPage = require(__dirname + "/Pages/User");
var UsersPage = require(__dirname + "/Pages/Users");
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

function Clear() {
	users.length = 0;
}

function GetLength() {
	return users.length;
}

function GetUserByIndex(index) {
	return users[index];
}

function Init() {
	Core.AddListener(Core.Event.Clear, OnClear);
	Core.AddListener(Core.Event.InitServer, OnInitServer);
	UserTrType.Init();
}

function OnClear() {
	Clear();
}

function OnInitServer() {
	var Api = require(__dirname + "/Api");
	app.get('/api/user/:id', Api.GetUser);
	app.get('/api/users', Api.GetUsers);
	app.get('/users', UsersPage);
	app.get('/user/1', UserPage);
	app.delete('/api/v0/user/:id', Api.DeleteUser);
	app.post('/api/v0/users', Api.PostUsers);
	app.put('/api/v0/user/:id', Api.PutUser);
}


exports.AddNewUser = AddNewUser;
exports.AddNewUserEx = AddNewUserEx;
exports.GetLength = GetLength;
exports.GetUserByIndex = GetUserByIndex;
exports.Init = Init;
