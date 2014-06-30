var mongoose = require('mongoose');
var fs = require('fs');
var path = require('path');
var async = require('async');
var config = require('./config');

mongoose.connect(config.get('mongoose:uri'));
var db = mongoose.connection;

db.on('error', function (err) {
	// Обрабатываем ошибку
});
db.once('open', function callback() {
	// Соединение прошло успешно
});

var models = {};

// Инициализируем все схемы
function Init(modelsDirectory, callback) {
	// Считываем список файлов из modelsDirectory
	var schemaList = fs.readdirSync(modelsDirectory);
	// Создаем модели Mongoose и вызываем callback, когда все закончим
	async.each(schemaList, function (item, cb) {
		var modelName = path.basename(item, '.js');
		models[modelName] = require(path.join(modelsDirectory, modelName))(mongoose);
		cb();
	}, callback);
};

// Возвращаем уже созданные модели из списка
function Model(modelName) {
	var name = modelName.toLowerCase();
	if (typeof models[name] == "undefined") {
		// Если модель на найдена, то создаем ошибку
		throw "Model '" + name + "' is not exist";
	}
	return models[name];
};

/*
function getModel (db) {
    var name = 'Test';
    return db.model(name) || db.model(name, Test, 'test');
}
*/


exports.Init = Init;
exports.Model = Model;
exports.Models = models;
