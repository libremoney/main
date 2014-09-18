/**!
 * LibreMoney 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */


var express = require("express");
var logfmt = require("logfmt");

var Boot = require('./Lm/Boot');


// ==== Main ====

var app = express();
var port = Number(process.env.PORT);

app.use(logfmt.requestLogger());


Boot(app, port);
