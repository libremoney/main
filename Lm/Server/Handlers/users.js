/**!
 * LibreMoney 0.0.1
 * Author: Prof1983 <prof1983@yandex.ru>
 * License: CC0
 */

var mongoose = require('mongoose');
var Db = require('../lib/db');

var modelName = 'users';

// Список документов (GET)
function list(req, res, next) {
	Db.Model(modelName).find({}, function (err, data) {
		if (err) next(err);
		S = '<html><body><h1>Users list</h1>';
		data.forEach(function(User){
			S = S + '1';
		});
		S = S + '<br/>' + data;
		S = S + '<hr/><form method="POST" action="/users"><input type="text" name="name"/><br/><input type="text" name="account_id"/><br/><input type="submit"/></form></body></html>';
		return res.send(S);
	});
};

// Один документ (GET)
function get(req, res, next) {
	try {
		var id = mongoose.Types.ObjectId(req.params.id)
	} catch (e) {
		res.send(400)
	}

	Db.Model(modelName).find({_id: id}, function (err, data) {
		if (err) next(err);
		if (data) {
			res.send(data);
		} else {
			res.send(404);
		}
	});

	/*
    return ArticleModel.findById(req.params.id, function (err, article) {
        if(!article) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }
        if (!err) {
            return res.send({ status: 'OK', article:article });
        } else {
            res.statusCode = 500;
            log.error('Internal error(%d): %s',res.statusCode,err.message);
            return res.send({ error: 'Server error' });
        }
    });
	*/
	//res.send('community: get ' + req.params.id);
};

// Создаем документ (POST)
function create(req, res, next) {
	Db.Model(modelName).create(req.body, function (err, data) {
		if (err) {
			next(err);
		}
		res.send(data);
	});
	/*
    var user = new UserModel({
        title: req.body.title,
        author: req.body.author,
        description: req.body.description,
        images: req.body.images
    });

    article.save(function (err) {
        if (!err) {
            log.info("article created");
            return res.send({ status: 'OK', article:article });
        } else {
            console.log(err);
            if(err.name == 'ValidationError') {
                res.statusCode = 400;
                res.send({ error: 'Validation error' });
            } else {
                res.statusCode = 500;
                res.send({ error: 'Server error' });
            }
            log.error('Internal error(%d): %s',res.statusCode,err.message);
        }
    });
	*/
};

// Обновляем документ
function update(req, res, next) {
	try {
		var id = mongoose.Types.ObjectId(req.params.id)
	} catch (e) {
		res.send(400)
	}

	Db.Model(modelName).update({_id: id}, {$set: req.body}, function (err, numberAffected, data) {
		if (err) next(err);
		if (numberAffected) {
			res.send(200);
		} else {
			res.send(404);
		}
	});
};

// Удаляем документ
function remove(req, res, next) {
	try {
		var id = mongoose.Types.ObjectId(req.params.id)
	} catch (e) {
		res.send(400)
	}

	Db.Model(modelName).remove({_id: id}, function (err, data) {
		if (err) next(err);
		res.send(data ? req.params.id : 404);
	});
};


module.exports = {
	list: list,
	get: get,
	create: create,
	update: update,
	remove: remove
}
