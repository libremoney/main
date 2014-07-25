/**!
 * LibreMoney config 0.0
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */


var nconf = require('nconf');
var Logger = require(__dirname + '/Logger').GetLogger(module);


function Get(paramName) {
	return nconf.get(paramName);
}

function GetBooleanProperty(name) {
	var value = Get(name);
	if (value == "true") { //if (true.toString().equals(value)) {
		Logger.info(name + " = \"true\"");
		return true;
	} else if (value == "false") { //if (Boolean.FALSE.toString().equals(value)) {
		Logger.info(name + " = \"false\"");
		return false;
	}
	Logger.warn(name + " not defined, assuming false");
	return false;
}

function GetIntProperty(name) {
	try {
		var result = parseInt(Get(name));
		Logger.info(name + " = \"" + result + "\"");
		return result;
	} catch (e) {
		Logger.warn(name + " not defined, assuming 0");
		return 0;
	}
}

function GetStringListProperty(name) {
	var value = GetStringProperty(name);
	if (value == null || value.length() == 0) {
		return null;
	}
	var result = new Array();
	for (var s in value.split(";")) {
		s = s.trim();
		if (s.length() > 0) {
			result.push(s);
		}
	}
	return result;
}

function GetStringProperty(name, defaultValue) {
	var value = Get(name);
	if (value != null && value != "") {
		Logger.info(name + " = \"" + value + "\"");
		return value;
	} else {
		Logger.warn(name + " not defined");
		return defaultValue;
	}
}

function Init(fileName, callback) {
	nconf.argv()
		.env()
		.file({ file: fileName });
	if (callback)
		callback();
}


exports.Get = Get;
exports.get = Get;
exports.GetIntProperty = GetIntProperty;
exports.GetStringProperty = GetStringProperty;
exports.GetStringListProperty = GetStringListProperty;
exports.GetBooleanProperty = GetBooleanProperty;
exports.Init = Init;
