/**
 * @depends {lm.js}
 */
var Lm = (function(Lm, $, undefined) {

	function PollsPage() {
		Lm.SendRequest("getPollIds+", function(response) {
			if (response.pollIds && response.pollIds.length) {
				var polls = {};
				var nrPolls = 0;

				for (var i = 0; i < response.pollIds.length; i++) {
					Lm.SendRequest("getTransaction+", {
						"transaction": response.pollIds[i]
					}, function(poll, input) {
						if (Lm.CurrentPage != "polls") {
							polls = {};
							return;
						}

						if (!poll.errorCode) {
							polls[input.transaction] = poll;
						}

						nrPolls++;

						if (nrPolls == response.pollIds.length) {
							var rows = "";

							if (Lm.UnconfirmedTransactions.length) {
								for (var i = 0; i < Lm.UnconfirmedTransactions.length; i++) {
									var unconfirmedTransaction = Lm.UnconfirmedTransactions[i];

									if (unconfirmedTransaction.type == 1 && unconfirmedTransaction.subType == 2) {
										var pollDescription = String(unconfirmedTransaction.attachment.description);

										if (pollDescription.length > 100) {
											pollDescription = pollDescription.substring(0, 100) + "...";
										}

										rows += "<tr class='tentative'><td>" + String(unconfirmedTransaction.attachment.name).escapeHTML() + "</td>" +
											"<td>" + pollDescription.escapeHTML() + "</td>" +
											"<td>" + (unconfirmedTransaction.sender != Lm.Genesis ? "<a href='#' data-user='" +
												Lm.GetAccountFormatted(unconfirmedTransaction, "sender") + "' class='user_info'>" +
												Lm.GetAccountTitle(unconfirmedTransaction, "sender") + "</a>" : "Genesis") + "</td>" +
											"<td>" + Lm.FormatTimestamp(unconfirmedTransaction.timestamp) + "</td>" +
											"<td><a href='#'>Vote (todo)</td></tr>";
									}
								}
							}

							for (var i = 0; i < nrPolls; i++) {
								var poll = polls[response.pollIds[i]];

								if (!poll) {
									continue;
								}

								var pollDescription = String(poll.attachment.description);

								if (pollDescription.length > 100) {
									pollDescription = pollDescription.substring(0, 100) + "...";
								}

								rows += "<tr><td>" + String(poll.attachment.name).escapeHTML() + "</td>" +
									"<td>" + pollDescription.escapeHTML() + "</td>" +
									"<td>" + (poll.sender != Lm.Genesis ? "<a href='#' data-user='" + Lm.GetAccountFormatted(poll, "sender") +
										"' class='user_info'>" + Lm.GetAccountTitle(poll, "sender") + "</a>" : "Genesis") + "</td>" +
									"<td>" + Lm.FormatTimestamp(poll.timestamp) + "</td>" +
									"<td><a href='#'>Vote (todo)</td></tr>";
							}

							Lm.DataLoaded(rows);
						}
					});
				}
			} else {
				Lm.DataLoaded();
			}
		});
	}

	function PollsIncoming() {
		Lm.LoadPage("polls");
	}

	function CreatePollAnswers_OnClick(th, e) {
		e.preventDefault();

		if ($("#create_poll_answers > .form-group").length == 1) {
			return;
		}

		th.closest("div.form-group").remove();
	}

	function CreatePollAnswersAdd_OnClick() {
		var $clone = $("#create_poll_answers > .form-group").first().clone();
		$clone.find("input").val("");
		$clone.appendTo("#create_poll_answers");
	}

	function CreatePollForm($modal) {
		var options = new Array();

		$("#create_poll_answers input.create_poll_answers").each(function() {
			var option = $.trim($(this).val());

			if (option) {
				options.push(option);
			}
		});

		if (!options.length) {
			//...
		}

		var data = {
			"name": $("#create_poll_name").val(),
			"description": $("#create_poll_description").val(),
			"optionsAreBinary": "0",
			"minNumberOfOptions": $("#create_poll_min_options").val(),
			"maxNumberOfOptions": $("#create_poll_max_options").val(),
			"feeLm": "1",
			"deadline": "24",
			"secretPhrase": $("#create_poll_password").val()
		};

		for (var i = 0; i < options.length; i++) {
			data["option" + i] = options[i];
		}

		return {
			"requestType": "createPoll",
			"data": data
		};
	}

	function CreatePollCompleteForm(response, data) {
		if (Lm.CurrentPage == "polls") {
			var $table = $("#polls_table tbody");

			var date = new Date(Date.UTC(2013, 10, 24, 12, 0, 0, 0)).getTime();

			var now = parseInt(((new Date().getTime()) - date) / 1000, 10);

			var rowToAdd = "<tr class='tentative'><td>" + String(data.name).escapeHTML() + " - <strong>" + $.t("pending") + "</strong></td>" +
				"<td>" + String(data.description).escapeHTML() + "</td>" +
				"<td><a href='#' data-user='" + Lm.GetAccountFormatted(Lm.AccountRS) + "' class='user_info'>" + Lm.GetAccountTitle(Lm.AccountRS) + "</a></td>" +
				"<td>" + Lm.FormatTimestamp(now) + "</td><td>/</td></tr>";

			$table.prepend(rowToAdd);

			if ($("#polls_table").parent().hasClass("data-empty")) {
				$("#polls_table").parent().removeClass("data-empty");
			}
		}
	}

	function CastVoteForm($modal) {
	}


	$("#create_poll_answers").on("click", "button.btn.remove_answer", function(e) {
		CreatePollAnswers_OnClick($(this), e);
	});

	$("#create_poll_answers_add").click(function(e) {
		CreatePollAnswersAdd_OnClick();
	});


	Lm.Pages.Polls = PollsPage;
	Lm.Incoming.Polls = PollsIncoming;
	Lm.Forms.CreatePoll = CreatePollForm;
	Lm.Forms.CreatePollComplete = CreatePollCompleteForm;
	Lm.Forms.CastVote = CastVoteForm;
	return Lm;
}(Lm || {}, jQuery));