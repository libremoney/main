var mongoose = require('mongoose');
var db = require('./db');

module.exports = function (modelName) {

  // Список документов
  var list = function (req, res, next) {
    Db.GetModel(modelName).find({}, function (err, data) {
      if (err) next(err);
      res.send(data);
    });
  };

  // Один документ
  var get = function (req, res, next) {
    try{var id = mongoose.Types.ObjectId(req.params.id)}
    catch (e){res.send(400)}

    Db.GetModel(modelName).find({_id: id}, function (err, data) {
      if (err) next(err);
      if (data) {
        res.send(data);
      } else {
        res.send(404);
      }
    })
  };

  // Создаем документ
  var create = function (req, res, next) {

    Db.GetModel(modelName).create(req.body, function (err, data) {
      if (err) {
        next(err);
      }
      res.send(data);
    });
  };

  // Обновляем документ
  var update = function (req, res, next) {
    try{var id = mongoose.Types.ObjectId(req.params.id)}
    catch (e){res.send(400)}

    Db.GetModel(modelName).update({_id: id}, {$set: req.body}, function (err, numberAffected, data) {
      if (err) next(err);

      if (numberAffected) {
        res.send(200);
      } else {
        res.send(404);
      }

    })
  };

  // Удаляем документ
  var remove = function (req, res, next) {
    try{var id = mongoose.Types.ObjectId(req.params.id)}
    catch (e){res.send(400)}

    Db.GetModel(modelName).remove({_id: id}, function (err, data) {
      if (err) next(err);
      res.send(data ? req.params.id : 404);
    });
  };

  return {
    list  : list,
    get   : get,
    create: create,
    update: update,
    remove: remove
  }
};
