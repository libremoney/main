/**!
 * LibreMoney 0.0
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

/*
import nxt.Account;
import nxt.Attachment;
*/

var Constants = require(__dirname + '/../../Constants');
var JsonResponses = require(__dirname + '/../JsonResponses');
var Logger = require(__dirname + '/../../Logger').GetLogger(module);
var ParameterParser = require(__dirname + '/../ParameterParser');


// super("name", "description", "minNumberOfOptions", "maxNumberOfOptions", "optionsAreBinary", "option1", "option2", "option3");
// hardcoded to 3 options for testing
function CreatePoll(req, res) {
	//var obj = CreateTransaction();

	var nameValue = req.query.name;
	var descriptionValue = req.query.description;
	var minNumberOfOptionsValue = req.query.minNumberOfOptions;
	var maxNumberOfOptionsValue = req.query.maxNumberOfOptions;
	var optionsAreBinaryValue = req.query.optionsAreBinary;

	if (!nameValue) {
		return JsonResponses.MissingName;
	} else if (!descriptionValue) {
		return JsonResponses.MissingDescription;
	} else if (!minNumberOfOptionsValue) {
		return JsonResponses.MissingMinNumberOfOptions;
	} else if (!maxNumberOfOptionsValue) {
		return JsonResponses.MissingMaxNumberOfOptions;
	} else if (!optionsAreBinaryValue) {
		return JsonResponses.MissingOptionsAreBinary;
	}

	if (nameValue.length > Constants.MaxPollNameLength) {
		res.send(JsonResponses.IncorrectPollNameLength);
		return;
	}

	if (descriptionValue.length > Constants.MaxPollDescriptionLength) {
		res.send(JsonResponses.IncorrectPollDescriptionLength);
		return;
	}

	var options = new Array();
	while (options.length < 100) {
		var optionValue = req.query["option" + options.length];
		if (!optionValue) {
			break;
		}
		if (optionValue.length > Constants.MaxPollOptionLength) {
			return JsonResponses.IncorrectPollOptionLength;
		}
		options.push(optionValue.trim());
	}

	var minNumberOfOptions;
	try {
		minNumberOfOptions = parseInt(minNumberOfOptionsValue); // parseByte
	} catch (e) {
		Logger.error(e);
		res.send(JsonResponses.IncorrectMinNumberOfOptions);
		return;
	}

	var maxNumberOfOptions;
	try {
		maxNumberOfOptions = parseInt(maxNumberOfOptionsValue); // parseByte
	} catch (e) {
		res.send(JsonResponses.IncorrectMaxNumberOfOptions);
		return;
	}

	var optionsAreBinary;
	try {
		optionsAreBinary = parseInt(optionsAreBinaryValue); // parseBoolean
	} catch (e) {
		res.send(JsonResponses.IncorrectOptionsAreBinary);
		return;
	}

	var account = ParameterParser.GetSenderAccount(req);

	/*
	var attachment = new Attachment.MessagingPollCreation(nameValue.trim(), descriptionValue.trim(),
			options.toArray(new String[options.size()]), minNumberOfOptions, maxNumberOfOptions, optionsAreBinary);
	return createTransaction(req, account, attachment);
	*/
	res.send('This is not implemented');
}

module.exports = CreatePoll;
