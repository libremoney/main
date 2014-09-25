/**!
 * LibreMoney CastVote api 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var Convert = require(__dirname + '/../../Util/Convert');
var CreateTransaction = require(__dirname + '/../../Server/CreateTransaction');
var JsonResponses = require(__dirname + '/../../Server/JsonResponses');
var Logger = require(__dirname + '/../../Logger').GetLogger(module);
var Attachment_MessagingVoteCasting = require(__dirname + '/../Attachment/MessagingVoteCasting');
var ParameterParser = require(__dirname + '/../../Server/ParameterParser');
var Polls = require(__dirname + '/../Polls');


//super(new APITag[] {APITag.VS, APITag.CREATE_TRANSACTION}, "poll", "vote1", "vote2", "vote3"); // hardcoded to 3 votes for testing
function CastVote(req, res) {
	var pollValue = req.queey.poll;
	if (!pollValue) {
		res.send(JsonResponses.MissingPoll);
		return;
	}

	var pollData;
	var numberOfOptions = 0;
	try {
		pollData = Polls.GetPoll(Convert.ParseUnsignedLong(pollValue));
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

	var attachment = new Attachment_MessagingVoteCasting(pollData.GetId(), vote);
	res.send(CreateTransaction(req, account, attachment));
}

module.exports = CastVote;
