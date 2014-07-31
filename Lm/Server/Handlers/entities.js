/**!
 * LibreMoney 0.0.1
 * Author: Prof1983 <prof1983@yandex.ru>
 * License: CC0
 */

//var mongoose = require('../lib/mongoose');
var mongoose = require('mongoose');
var db = require('../lib/db');

// Выставляем modelName
var modelName = 'entities';

// Подгружаем стандартные методы для CRUD документов
//var handlers = require('../libs/crudHandlers')(modelName);
//module.exports = handlers;


// Список документов
function list(req, res, next) {
	/*
	Db.GetModel(modelName).find({}, function (err, data) {
		if (err) next(err);
		res.send(data);
	});
	*/
	res.send('list');
};

// Один документ
function get(req, res, next) {
	/*
	try {
		var id = mongoose.Types.ObjectId(req.params.id)
	} catch (e) {
		res.send(400)
	}

	Db.GetModel(modelName).find({_id: id}, function (err, data) {
		if (err) next(err);
		if (data) {
			res.send(data);
		} else {
			res.send(404);
		}
	})
	*/
	res.send('get ' + req.params.id);
};

// Создаем документ
function create(req, res, next) {
	/*
	Db.GetModel(modelName).create(req.body, function (err, data) {
		if (err) {
			next(err);
		}
		res.send(data);
	});
	*/
	res.send('create');
};

// Обновляем документ
function update(req, res, next) {
	/*
	try {
		var id = mongoose.Types.ObjectId(req.params.id)
	} catch (e){
		res.send(400)
	}

	Db.GetModel(modelName).update({_id: id}, {$set: req.body}, function (err, numberAffected, data) {
		if (err) next(err);

		if (numberAffected) {
			res.send(200);
		} else {
			res.send(404);
		}

	})
	*/
	res.send('update '+req.params.id);
};

// Удаляем документ
function remove(req, res, next) {
	/*
	try {
		var id = mongoose.Types.ObjectId(req.params.id)
	} catch (e) {
		res.send(400)
	}

	Db.GetModel(modelName).remove({_id: id}, function (err, data) {
		if (err) next(err);
		res.send(data ? req.params.id : 404);
	});
	*/
	res.send('remove '+req.params.id);
};

function Entities() {
	return {
		list: list,
		get: get,
		create: create,
		update: update,
		remove: remove
	}
};


//module.exports = Entities;
module.exports = {
	list: list,
	get: get,
	create: create,
	update: update,
	remove: remove
}
