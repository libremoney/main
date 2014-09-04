/**!
 * LibreMoney CastVote api 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var Convert = require(__dirname + '/../../Util/Convert');
var JsonResponses = require(__dirname + '/../JsonResponses');
var Logger = require(__dirname + '/../../Logger').GetLogger(module);
var ParameterParser = require(__dirname + '/../ParameterParser');
var Polls = require(__dirname + '/../../Polls');


//super(new APITag[] {APITag.VS, APITag.CREATE_TRANSACTION}, "poll", "vote1", "vote2", "vote3"); // hardcoded to 3 votes for testing
function CastVote(req, res) {
	//var obj = CreateTransaction();

	var pollValue = req.queey.poll;
	if (!pollValue) {
		res.send(JsonResponses.MissingPoll);
		return;
	}

	var pollData;
	var numberOfOptions = 0;
	try {
		pollData = Poll.GetPoll(Convert.ParseUnsignedLong(pollValue));
		if (pollData != null) {
			numberOfOptions = pollData.GetOptions().length;
		} else {
			res.send(JsonResponses.IncorrectPoll);
			return;
		}
	} catch (e) {
		Logger.error(e);
		res.send(JsonResponses.IncorrectPoll);
		return;
	}

	var vote = new Array(numberOfOptions);
	try {
		for (var i = 0; i < numberOfOptions; i++) {
			var voteValue = req.query["vote" + i];
			if (voteValue) {
				vote[i] = parseInt(voteValue); // parseByte
			}
		}
	} catch (e) {
		Logger.error(e);
		res.send(JsonResponses.IncorrectVote);
		return;
	}

	var account = ParameterParser.GetSenderAccount(req);

	/*
	var attachment = new Attachment.MessagingVoteCasting(pollData.getId(), vote);
	return createTransaction(req, account, attachment);
	*/

	res.send('This is not implemented');
}

module.exports = CastVote;
