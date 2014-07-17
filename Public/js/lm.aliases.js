var Lm = (function(Lm, $, undefined) {

	function AliasesPage() {
		Lm.PageLoading();

		Lm.SendRequest("getAliases+", {
			"account": Lm.Account,
			"timestamp": 0
		}, function(response) {
			if (response.aliases && response.aliases.length) {
				var aliases = response.aliases;

				if (Lm.UnconfirmedTransactions.length) {
					for (var i = 0; i < Lm.UnconfirmedTransactions.length; i++) {
						var unconfirmedTransaction = Lm.UnconfirmedTransactions[i];

						if (unconfirmedTransaction.type == 1 && unconfirmedTransaction.subtype == 1) {
							var found = false;

							for (var j = 0; j < aliases.length; j++) {
								if (aliases[j].aliasName == unconfirmedTransaction.attachment.alias) {
									aliases[j].aliasURI = unconfirmedTransaction.attachment.uri;
									aliases[j].tentative = true;
									found = true;
									break;
								}
							}

							if (!found) {
								aliases.push({
									"aliasName": unconfirmedTransaction.attachment.alias,
									"aliasURI": unconfirmedTransaction.attachment.uri,
									"tentative": true
								});
							}
						}
					}
				}

				aliases.sort(function(a, b) {
					if (a.aliasName.toLowerCase() > b.aliasName.toLowerCase()) {
						return 1;
					} else if (a.aliasName.toLowerCase() < b.aliasName.toLowerCase()) {
						return -1;
					} else {
						return 0;
					}
				});

				var rows = "";

				var alias_account_count = 0,
					alias_uri_count = 0,
					empty_alias_count = 0,
					alias_count = aliases.length;

				for (var i = 0; i < alias_count; i++) {
					var alias = aliases[i];

					rows += "<tr" + (alias.tentative ? " class='tentative'" : "") + " data-alias='" +
						String(alias.aliasName).toLowerCase().escapeHTML() + "'>"+
						"<td class='alias'>" +
						String(alias.aliasName).escapeHTML() + (alias.tentative ? " -  <strong>Pending</strong>" : "") + "</td>"+
						"<td>" + (alias.aliasURI.indexOf("http") === 0 ?
							"<a href='" + String(alias.aliasURI).escapeHTML() + "' target='_blank'>" + String(alias.aliasURI).escapeHTML() + "</a>" :
							String(alias.aliasURI).escapeHTML()) +
						"</td>" +
						"<td><a href='#' data-toggle='modal' data-alias='" + String(alias.aliasName).escapeHTML() +
							"' data-target='#register_alias_modal'>Edit</a></td></tr>";
					if (!alias.aliasURI) {
						empty_alias_count++;
					} else if (alias.aliasURI.indexOf("http") === 0) {
						alias_uri_count++;
					} else if (alias.aliasURI.indexOf("acct:") === 0 || alias.aliasURI.indexOf("nacc:") === 0) {
						alias_account_count++;
					}
				}

				$("#aliases_table tbody").empty().append(rows);
				Lm.DataLoadFinished($("#aliases_table"));

				$("#alias_account_count").html(alias_account_count).removeClass("loading_dots");
				$("#alias_uri_count").html(alias_uri_count).removeClass("loading_dots");
				$("#empty_alias_count").html(empty_alias_count).removeClass("loading_dots");
				$("#alias_count").html(alias_count).removeClass("loading_dots");
			} else {
				$("#aliases_table tbody").empty();
				Lm.DataLoadFinished($("#aliases_table"));

				$("#alias_account_count, #alias_uri_count, #empty_alias_count, #alias_count").html("0").removeClass("loading_dots");
			}

			Lm.PageLoaded();
		});
	}

	function RegisterAliasModal_OnShow(e) {
		var $invoker = $(e.relatedTarget);

		var alias = $invoker.data("alias");

		if (alias) {
			alias = String(alias);

			Lm.SendRequest("getAlias", {
				"aliasName": alias
			}, function(response) {
				if (/http:\/\//i.test(response.aliasURI)) {
					Lm.Forms.setAliasType("uri");
				} else if (/acct:(\d+)@nxt/.test(response.aliasURI) || /nacc:(\d+)/.test(response.aliasURI)) {
					Lm.Forms.setAliasType("account");
				} else {
					Lm.Forms.setAliasType("general");
				}

				$("#register_alias_modal h4.modal-title").html("Update Alias");
				$("#register_alias_modal .btn-primary").html("Update");
				$("#register_alias_alias").val(alias.escapeHTML()).hide();
				$("#register_alias_alias_noneditable").html(alias.escapeHTML()).show();
				$("#register_alias_alias_update").val(1);
				$("#register_alias_uri").val(response.aliasURI);
			});
		} else {
			$("#register_alias_modal h4.modal-title").html("Register Alias");
			$("#register_alias_modal .btn-primary").html("Register");
			$("#register_alias_alias").val("").show();
			$("#register_alias_alias_noneditable").html("").hide();
			$("#register_alias_alias_update").val(0);
			Lm.Forms.setAliasType("uri");
		}
	});

	function IncomingAliases(transactions) {
		if (transactions || Lm.UnconfirmedTransactionsChange || Lm.State.isScanning) {
			Lm.Pages.aliases();
		}
	}

	function SetAliasForm($modal) {
		var data = Lm.GetFormData($modal.find("form:first"));

		data.uri = $.trim(data.uri);

		if (data.type == "account") {
			if (!(/acct:(\d+)@nxt/.test(data.uri)) && !(/nacc:(\d+)/.test(data.uri))) {
				if (/^\d+$/.test(data.uri)) {
					data.uri = "acct:" + data.uri + "@nxt";
				} else {
					return {
						"error": "Invalid account ID."
					};
				}
			}

		}
		delete data["type"];

		if ($("#register_alias_alias_update").val() == 1) {
			return {
				"data": data,
				"successMessage": "Alias updated successfully"
			};
		} else {
			return {
				"data": data
			};
		}
	}

	function SetAliasTypeForm(type, uri) {
		$("#register_alias_type").val(type);

		if (type == "uri") {
			$("#register_alias_uri_label").html("URI");
			$("#register_alias_uri").prop("placeholder", "URI");
			if (uri) {
				if (!/https?:\/\//i.test(uri)) {
					$("#register_alias_uri").val("http://" + uri);
				} else {
					$("#register_alias_uri").val(uri);
				}
			} else {
				$("#register_alias_uri").val("http://");
			}
			$("#register_alias_help").hide();
		} else if (type == "account") {
			$("#register_alias_uri_label").html("Account ID");
			$("#register_alias_uri").prop("placeholder", "Account ID");
			$("#register_alias_uri").val("");
			if (uri) {
				if (!(/acct:(\d+)@nxt/.test(uri)) && !(/nacc:(\d+)/.test(uri))) {
					if (/^\d+$/.test(uri)) {
						$("#register_alias_uri").val("acct:" + uri + "@nxt");
					} else {
						$("#register_alias_uri").val("");
					}
				} else {
					$("#register_alias_uri").val("");
				}
			} else {
				$("#register_alias_uri").val("");
			}
			$("#register_alias_help").html("The alias will reference the account number entered and can be used to send Lm to, messages, etc..").show();
		} else {
			$("#register_alias_uri_label").html("Data");
			$("#register_alias_uri").prop("placeholder", "Data");
			if (uri) {
				$("#register_alias_uri").val(uri);
			} else {
				$("#register_alias_uri").val("");
			}
			$("#register_alias_help").html("The alias can contain any data you want.").show();
		}
	}

	function RegisterAliasType_OnChange(th) {
		var type = th.val();
		Lm.Forms.SetAliasType(type, $("#register_alias_uri").val());
	});

	function SetAliasCompleteForm(response, data) {
		if (response.alreadyProcessed) {
			return;
		}

		if (Lm.CurrentPage == "aliases") {
			var $table = $("#aliases_table tbody");

			var $row = $table.find("tr[data-alias=" + String(data.alias).toLowerCase().escapeHTML() + "]");

			if ($row.length) {
				$row.addClass("tentative");
				$row.find("td.alias").html(data.alias.escapeHTML() + " - <strong>Pending</strong>");

				if (data.uri && data.uri.indexOf("http") === 0) {
					$row.find("td.uri").html("<a href='" + String(data.uri).escapeHTML() + "' target='_blank'>" + String(data.uri).escapeHTML() + "</a>");
				} else {
					$row.find("td.uri").html(String(data.uri).escapeHTML());
				}
			} else {
				var $rows = $table.find("tr");

				var rowToAdd = "<tr class='tentative' data-alias='" + String(data.alias).toLowerCase().escapeHTML() + "'>"+
					"<td class='alias'>" + data.alias.escapeHTML() + " -  <strong>Pending</strong></td>"+
					"<td class='uri'>" + (data.uri && data.uri.indexOf("http") === 0 ?
						"<a href='" + String(data.uri).escapeHTML() + "' target='_blank'>" + data.uri.escapeHTML() + "</a>" :
						String(data.uri).escapeHTML()) + "</td><td>Edit</td>"+
					"</tr>";

				var rowAdded = false;

				var newAlias = String(data.alias).toLowerCase();

				if ($rows.length) {
					$rows.each(function() {
						var alias = $(this).data("alias");

						if (newAlias < alias) {
							$(this).before(rowToAdd);
							rowAdded = true;
							return false;
						}
					});
				}

				if (!rowAdded) {
					$table.append(rowToAdd);
				}

				if ($("#aliases_table").parent().hasClass("data-empty")) {
					$("#aliases_table").parent().removeClass("data-empty");
				}
			}
		}
	}

	function AliasSearch_OnSubmit(e) {
		e.preventDefault();

		if (Lm.FetchingModalData) {
			return;
		}

		Lm.FetchingModalData = true;

		var alias = $.trim($("#alias_search input[name=q]").val());

		$("#alias_info_table tbody").empty();

		Lm.SendRequest("getAlias", {
			"aliasName": alias
		}, function(response, input) {
			if (response.errorCode) {
				$.growl("Could not find alias.", {
					"type": "danger"
				});
				Lm.FetchingModalData = false;
			} else {
				$("#alias_info_modal_alias").html(String(response.aliasName).escapeHTML());

				var data = {
					"Account": Lm.GetAccountTitle(response, "account"),
					"Last Updated": Lm.FormatTimestamp(response.timestamp),
					"DataFormattedHTML": String(response.aliasURI).autoLink()
				}

				$("#alias_info_table tbody").append(Lm.CreateInfoTable(data));

				$("#alias_info_modal").modal("show");
				Lm.FetchingModalData = false;
			}
		});
	}


	$("#register_alias_modal").on("show.bs.modal", function(e) {
		Lm.RegisterAliasModal_OnShow(e);
	});

	$("#register_alias_type").on("change", function() {
		Lm.RegisterAliasType_OnChange($(this));
	});

	$("#alias_search").on("submit", function(e) {
		Lm.AliasSearch_OnSubmit(e);
	});


	Lm.Pages.Aliases = AliasesPage;
	Lm.RegisterAliasModal_OnShow = RegisterAliasModal_OnShow;
	Lm.Incoming.Aliases = IncomingAliases;
	Lm.Forms.SetAlias = SetAliasForm;
	Lm.Forms.SetAliasType = SetAliasTypeForm;
	Lm.RegisterAliasType_OnChange = RegisterAliasType_OnChange;
	Lm.Forms.SetAliasComplete = SetAliasCompleteForm;
	Lm.AliasSearch_OnSubmit = AliasSearch_OnSubmit;
	return Lm;
}(Lm || {}, jQuery));