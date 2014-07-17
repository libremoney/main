/**!
 * LibreMoney config 0.0
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */


var nconf = require('nconf');


function Get(paramName) {
	return nconf.get(paramName);
}

function GetBooleanProperty(name) {
	throw new Error('Not implementted');
	/*
	String value = properties.getProperty(name);
	if (Boolean.TRUE.toString().equals(value)) {
		Logger.logMessage(name + " = \"true\"");
		return true;
	} else if (Boolean.FALSE.toString().equals(value)) {
		Logger.logMessage(name + " = \"false\"");
		return false;
	}
	Logger.logMessage(name + " not defined, assuming false");
	return false;
	*/
}

function GetIntProperty(name) {
	throw new Error('Not implemented');
	/*
	try {
		int result = Integer.parseInt(properties.getProperty(name));
		Logger.logMessage(name + " = \"" + result + "\"");
		return result;
	} catch (NumberFormatException e) {
		Logger.logMessage(name + " not defined, assuming 0");
		return 0;
	}
	*/
}

function GetStringListProperty(name) {
	throw new Error('Not implementted');
	/*
	String value = getStringProperty(name);
	if (value == null || value.length() == 0) {
		return Collections.emptyList();
	}
	List<String> result = new ArrayList<>();
	for (String s : value.split(";")) {
		s = s.trim();
		if (s.length() > 0) {
			result.add(s);
		}
	}
	return result;
	*/
}

function GetStringProperty(name, defaultValue) {
	throw new Error('Not implementted');
	/*
	String value = properties.getProperty(name);
	if (value != null && ! "".equals(value)) {
		Logger.logMessage(name + " = \"" + value + "\"");
		return value;
	} else {
		Logger.logMessage(name + " not defined");
		return defaultValue;
	}
	*/
}

function Init(fileName, callback) {
	nconf.argv()
		.env()
		.file({ file: fileName });
	if (callback)
		callback();
}


Lm.GetIntProperty = GetIntProperty;
Lm.GetStringProperty = GetStringProperty;
Lm.GetStringListProperty = GetStringListProperty;
Lm.GetBooleanProperty = GetBooleanProperty;


//module.exports = nconf;
exports.Get = Get;
exports.get = Get;
exports.GetIntProperty = GetIntProperty;
exports.GetStringProperty = GetStringProperty;
exports.GetStringListProperty = GetStringListProperty;
exports.GetBooleanProperty = GetBooleanProperty;
exports.Init = Init;