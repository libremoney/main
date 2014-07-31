/**!
 * LibreMoney 0.0.1
 * Author: Prof1983 <prof1983@yandex.ru>
 * License: CC0
 */

var mongoose = require('mongoose');
var Db = require('../lib/db');

var modelName = 'community';

// Список документов
function list(req, res, next) {
	Db.GetModel(modelName).find({}, function (err, data) {
		if (err) next(err);
		S = '<html><body><h1>Community list</h1>';
		data.forEach(function(Community){
			S = S + '1';
		})
		S = S + '</body></html>';
		res.send(S);
	});
	//res.send('community: list');
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
	res.send('community: get ' + req.params.id);
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
	res.send('community: create');
};


module.exports = {
	list: list,
	get: get,
	create: create
}
