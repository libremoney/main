/**
 * @depends {lm.js}
 */
var Lm = (function(Lm, $, undefined) {
	function AliasesPage() {
		Lm.SendRequest("getAliases+", {
			"account": Lm.Account,
			"timestamp": 0
		}, function(response) {
			if (response.aliases && response.aliases.length) {
				var aliases = response.aliases;

				if (Lm.UnconfirmedTransactions.length) {
					for (var i = 0; i < Lm.UnconfirmedTransactions.length; i++) {
						var unconfirmedTransaction = Lm.UnconfirmedTransactions[i];

						if (unconfirmedTransaction.type == 1 && (unconfirmedTransaction.subtype == 1 || unconfirmedTransaction.subtype == 7)) {
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
									"aliasURI": (unconfirmedTransaction.attachment.uri ? unconfirmedTransaction.attachment.uri : ""),
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

					alias.status = "/";

					var unconfirmedTransaction = Lm.GetUnconfirmedTransactionFromCache(1, 6, {
						"alias": alias.aliasName
					});

					if (unconfirmedTransaction) {
						alias.tentative = true;
						if (unconfirmedTransaction.recipient) {
							alias.buyer = unconfirmedTransaction.recipient;
						}
						alias.priceMilliLm = unconfirmedTransaction.priceMilliLm;
					}

					if (!alias.aliasURI) {
						alias.aliasURI = "";
					}

					if (alias.aliasURI.length > 100) {
						alias.shortAliasURI = alias.aliasURI.substring(0, 100) + "...";
						alias.shortAliasURI = alias.shortAliasURI.escapeHTML();
					} else {
						alias.shortAliasURI = alias.aliasURI.escapeHTML();
					}

					alias.aliasURI = alias.aliasURI.escapeHTML();

					var allowCancel = false;

					if ("priceMilliLm" in alias) {
						if (alias.priceMilliLm == "0") {
							if (alias.buyer == Lm.Account) {
								alias.status = $.t("cancelling_sale");
							} else {
								alias.status = $.t("transfer_in_progress");
							}
						} else {
							if (!alias.tentative) {
								allowCancel = true;
							}

							if (typeof alias.buyer != "undefined") {
								alias.status = $.t("for_sale_direct");
							} else {
								alias.status = $.t("for_sale_indirect");
							}
						}
					}

					if (alias.status != "/") {
						alias.status = "<span class='label label-small label-info'>" + alias.status + "</span>";
					}

					rows += "<tr" + (alias.tentative ? " class='tentative'" : "") + " data-alias='" + String(alias.aliasName).toLowerCase().escapeHTML() +
						"'><td class='alias'>" + String(alias.aliasName).escapeHTML() + "</td>"+
						"<td class='uri'>" + (alias.aliasURI.indexOf("http") === 0 ? "<a href='" + alias.aliasURI + "' target='_blank'>" +
						alias.shortAliasURI + "</a>" : alias.shortAliasURI) + "</td>"+
						"<td class='status'>" + alias.status + "</td>"+
						"<td style='white-space:nowrap'><a class='btn btn-xs btn-default' href='#' data-toggle='modal' "+
						"data-target='#register_alias_modal' data-alias='" + String(alias.aliasName).escapeHTML() + "'>" + $.t("edit") + "</a>" +
						(Lm.DgsBlockPassed ? " <a class='btn btn-xs btn-default' href='#' data-toggle='modal' data-target='#transfer_alias_modal' "+
						"data-alias='" + String(alias.aliasName).escapeHTML() + "'>" + $.t("transfer") + "</a> "+
						"<a class='btn btn-xs btn-default' href='#' data-toggle='modal' data-target='#sell_alias_modal' data-alias='" +
						String(alias.aliasName).escapeHTML() + "'>" + $.t("sell") + "</a>" +
						(allowCancel ? " <a class='btn btn-xs btn-default cancel_alias_sale' href='#' data-toggle='modal' "+
						"data-target='#cancel_alias_sale_modal' data-alias='" + String(alias.aliasName).escapeHTML() + "'>" + $.t("cancel_sale") + "</a>" : "") : "") +
						"</td></tr>";

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

	function AliasModal_OnShow(th, e) {
		var $invoker = $(e.relatedTarget);

		var alias = String($invoker.data("alias"));

		th.find("input[name=aliasName]").val(alias.escapeHTML());
		th.find(".alias_name_display").html(alias.escapeHTML());

		if (th.attr("id") == "sell_alias_modal") {
			th.find("ul.nav-pills li").removeClass("active");
			th.find("ul.nav-pills li:first-child").addClass("active");
			$("#sell_alias_recipient_div").show();
		}
	}

	function SellAliasForm($modal) {
		var data = Lm.GetFormData($modal.find("form:first"));

		var successMessage = "";
		var errorMessage = "";

		if (data.modal == "cancel_alias_sale") {
			data.priceLm = "0";
			data.recipient = Lm.AccountRS;

			successMessage = $.t("success_cancel_alias");
			errorMessage = $.t("error_cancel_alias");
		} else if (data.modal == "transfer_alias") {
			data.priceLm = "0";

			successMessage = $.t("success_transfer_alias");
			errorMessage = $.t("error_transfer_alias");
		} else {
			if (!data.recipient) {
				return {
					"error": $.t("error_not_specified", {
						"name": $.t("recipient").toLowerCase()
					}).capitalize()
				};
			}

			successMessage = $.t("success_sell_alias");
			errorMessage = $.t("error_sell_alias");

			if (data.recipient == Lm.GenesisRS) {
				if (!data.priceLm || data.priceLm == "0") {
					return {
						"error": $.t("error_not_specified", {
							"name": $.t("price").toLowerCase()
						}).capitalize()
					};
				}

				delete data.add_message;
				delete data.encrypt_message;
				delete data.message;
				delete data.recipient;
			}
		}

		delete data.modal;

		return {
			"data": data,
			"successMessage": successMessage,
			"errorMessage": errorMessage
		};
	}

	function SellAliasCompleteForm(response, data) {
		if (response.alreadyProcessed) {
			return;
		}

		var $row = $("#aliases_table tr[data-alias=" + String(data.aliasName).toLowerCase().escapeHTML() + "]");

		$row.addClass("tentative");

		//transfer
		if (data.priceMilliLm == "0") {
			if (data.recipient == Lm.Account) {
				$row.find("td.status").html("<span class='label label-small label-info'>" + $.t("cancelling_sale") + "</span>");
				$row.find("a.cancel_alias_sale").remove();
			} else {
				$row.find("td.status").html("<span class='label label-small label-info'>" + $.t("transfer_in_progress") + "</span>");
			}
		} else {
			if (data.recipient != Lm.Genesis) {
				$row.find("td.status").html("<span class='label label-small label-info'>" + $.t("for_sale_direct") + "</span>");
			} else {
				$row.find("td.status").html("<span class='label label-small label-info'>" + $.t("for_sale_indirect") + "</span>");
			}
		}
	}

	function Alias_OnClick(th, e) {
		e.preventDefault();

		th.closest("ul").find("li").removeClass("active");
		th.parent().addClass("active");

		var $modal = th.closest(".modal");

		if (th.attr("id") == "sell_alias_to_anyone") {
			$modal.find("input[name=recipient]").val(Lm.GenesisRS);
			$("#sell_alias_recipient_div").hide();
			$modal.find(".add_message_container, .optional_message").hide();
		} else {
			$modal.find("input[name=recipient]").val("");
			$("#sell_alias_recipient_div").show();
			$modal.find(".add_message_container").show();

			if ($("#sell_alias_add_message").is(":checked")) {
				$modal.find(".optional_message").show();
			} else {
				$modal.find(".optional_message").hide();
			}
		}

		$modal.find("input[name=converted_account_id]").val("");
		$modal.find(".callout").hide();
	}

	function BuyAliasModal_OnShow(th, e) {
		var $modal = th;

		var $invoker = $(e.relatedTarget);

		Lm.FetchingModalData = true;

		var alias = String($invoker.data("alias"));

		Lm.SendRequest("getAlias", {
			"aliasName": alias
		}, function(response) {
			Lm.FetchingModalData = false;

			if (response.errorCode) {
				e.preventDefault();
				$.growl($.t("error_alias_not_found"), {
					"type": "danger"
				});
			} else {
				if (!("priceMilliLm" in response)) {
					e.preventDefault();
					$.growl($.t("error_alias_not_for_sale"), {
						"type": "danger"
					});
				} else if (typeof response.buyer != "undefined" && response.buyer != Lm.Account) {
					e.preventDefault();
					$.growl($.t("error_alias_sale_different_account"), {
						"type": "danger"
					});
				} else {
					$modal.find("input[name=recipient]").val(String(response.accountRS).escapeHTML());
					$modal.find("input[name=aliasName]").val(alias.escapeHTML());
					$modal.find(".alias_name_display").html(alias.escapeHTML());
					$modal.find("input[name=amountLm]").val(Lm.ConvertToLm(response.priceMilliLm)).prop("readonly", true);
				}
			}
		}, false);
	}

	function BuyAliasErrorForm() {
		$("#buy_alias_modal").find("input[name=priceLm]").prop("readonly", false);
	}

	function BuyAliasCompleteForm(response, data) {
		if (response.alreadyProcessed) {
			return;
		}

		if (Lm.CurrentPage != "aliases") {
			return;
		}

		data.aliasName = String(data.aliasName).escapeHTML();
		data.aliasURI = "";

		$("#aliases_table tbody").prepend("<tr class='tentative' data-alias='" + data.aliasName.toLowerCase() + "'>"+
			"<td class='alias'>" + data.aliasName + "</td>"+
			"<td class='uri'>" + (data.aliasURI && data.aliasURI.indexOf("http") === 0 ?
				"<a href='" + data.aliasURI + "' target='_blank'>" + data.aliasURI + "</a>" : data.aliasURI) + "</td>"+
			"<td>/</td>"+
			"<td style='white-space:nowrap'><a class='btn btn-xs btn-default' href='#'>" + $.t("edit") + "</a>" +
			(Lm.DgsBlockPassed ? " <a class='btn btn-xs btn-default' href='#'>" + $.t("transfer") + "</a> "+
				"<a class='btn btn-xs btn-default' href='#'>" + $.t("sell") + "</a>" : "") + "</td></tr>");

		if ($("#aliases_table").parent().hasClass("data-empty")) {
			$("#aliases_table").parent().removeClass("data-empty");
		}
	}

	function RegisterAliasModal_OnShow(e) {
		var $invoker = $(e.relatedTarget);

		var alias = $invoker.data("alias");

		if (alias) {
			Lm.FetchingModalData = true;

			alias = String(alias);

			Lm.SendRequest("getAlias", {
				"aliasName": alias
			}, function(response) {
				if (response.errorCode) {
					e.preventDefault();
					$.growl($.t("error_alias_not_found"), {
						"type": "danger"
					});
					Lm.FetchingModalData = false;
				} else {
					var aliasURI;

					if (/http:\/\//i.test(response.aliasURI)) {
						SetAliasType("uri", response.aliasURI);
					} else if ((aliasURI = /acct:(.*)@lm/.exec(response.aliasURI)) || (aliasURI = /nacc:(.*)/.exec(response.aliasURI))) {
						SetAliasType("account", response.aliasURI);
						response.aliasURI = String(aliasURI[1]).toUpperCase();
					} else {
						SetAliasType("general", response.aliasURI);
					}

					$("#register_alias_modal h4.modal-title").html($.t("update_alias"));
					$("#register_alias_modal .btn-primary").html($.t("update"));
					$("#register_alias_alias").val(alias.escapeHTML()).hide();
					$("#register_alias_alias_noneditable").html(alias.escapeHTML()).show();
					$("#register_alias_alias_update").val(1);
				}
			}, false);
		} else {
			$("#register_alias_modal h4.modal-title").html($.t("register_alias"));
			$("#register_alias_modal .btn-primary").html($.t("register"));

			var prefill = $invoker.data("prefill-alias");

			if (prefill) {
				$("#register_alias_alias").val(prefill).show();
			} else {
				$("#register_alias_alias").val("").show();
			}
			$("#register_alias_alias_noneditable").html("").hide();
			$("#register_alias_alias_update").val(0);
			SetAliasType("uri", "");
		}
	}

	function AliasesIncoming(transactions) {
		if (Lm.HasTransactionUpdates(transactions)) {
			Lm.LoadPage("aliases");
		}
	}

	function SetAliasForm($modal) {
		var data = Lm.GetFormData($modal.find("form:first"));

		data.aliasURI = $.trim(data.aliasURI).toLowerCase();

		if (data.type == "account") {
			if (!(/acct:(.*)@lm/.test(data.aliasURI)) && !(/nacc:(.*)/.test(data.aliasURI))) {
				if (/^(LMA\-)/i.test(data.aliasURI)) {
					var address = new LmAddress();

					if (!address.set(data.aliasURI)) {
						return {
							"error": $.t("error_invalid_account_id")
						};
					} else {
						data.aliasURI = "acct:" + data.aliasURI + "@lm";
					}
				} else if (/^\d+$/.test(data.aliasURI)) {
					return {
						"error": $.t("error_numeric_ids_not_allowed")
					};
				} else {
					return {
						"error": $.t("error_invalid_account_id")
					};
				}
			}
		}

		delete data["type"];

		return {
			"data": data
		};
	}

	function SetAliasType(type, uri) {
		$("#register_alias_type").val(type);

		if (type == "uri") {
			$("#register_alias_uri.masked").trigger("unmask", true);
			$("#register_alias_uri_label").html($.t("uri"));
			$("#register_alias_uri").prop("placeholder", $.t("uri"));
			if (uri) {
				if (uri == Lm.AccountRS) {
					$("#register_alias_uri").val("http://");
				} else if (!/https?:\/\//i.test(uri)) {
					$("#register_alias_uri").val("http://" + uri);
				} else {
					$("#register_alias_uri").val(uri);
				}
			} else {
				$("#register_alias_uri").val("http://");
			}
			$("#register_alias_help").hide();
		} else if (type == "account") {
			$("#register_alias_uri_label").html($.t("account_id"));
			$("#register_alias_uri").prop("placeholder", $.t("account_id"));
			$("#register_alias_uri").val("").mask("LMA-****-****-****-*****");

			if (uri) {
				var match = uri.match(/acct:(.*)@lm/i);
				if (!match) {
					match = uri.match(/nacc:(.*)/i);
				}

				if (match && match[1]) {
					uri = match[1];
				}

				if (/^\d+$/.test(uri)) {
					var address = new LmAddress();

					if (address.set(uri)) {
						uri = address.toString();
					} else {
						uri = "";
					}
				} else if (!/^LMA\-[A-Z0-9]{4}\-[A-Z0-9]{4}\-[A-Z0-9]{4}\-[A-Z0-9]{5}/i.test(uri)) {
					uri = Lm.AccountRS;
				}

				uri = uri.toUpperCase();

				$("#register_alias_uri").val(uri);
			} else {
				$("#register_alias_uri").val(Lm.AccountRS);
			}
			$("#register_alias_help").html($.t("alias_account_help")).show();
		} else {
			$("#register_alias_uri.masked").trigger("unmask", true);
			$("#register_alias_uri_label").html($.t("data"));
			$("#register_alias_uri").prop("placeholder", $.t("data"));
			if (uri) {
				if (uri == Lm.AccountRS) {
					$("#register_alias_uri").val("");
				} else if (uri == "http://") {
					$("#register_alias_uri").val("");
				} else {
					$("#register_alias_uri").val(uri);
				}
			}
			$("#register_alias_help").html($.t("alias_data_help")).show();
		}
	}

	function RegisterAliasType_OnChange(th) {
		var type = th.val();
		SetAliasType(type, $("#register_alias_uri").val());
	}

	function SetAliasErrorForm(response, data) {
		if (response && response.errorCode && response.errorCode == 8) {
			var errorDescription = response.errorDescription.escapeHTML();

			Lm.SendRequest("getAlias", {
				"aliasName": data.aliasName
			}, function(response) {
				var message;

				if (!response.errorCode) {
					if ("priceMilliLm" in response) {
						if (response.buyer == Lm.Account) {
							message = $.t("alias_sale_direct_offer", {
								"lm": Lm.FormatAmount(response.priceMilliLm)
							}) + " <a href='#' data-alias='" + String(response.aliasName).escapeHTML() + "' data-toggle='modal' data-target='#buy_alias_modal'>" + $.t("buy_it_q") + "</a>";
						} else if (typeof response.buyer == "undefined") {
							message = $.t("alias_sale_indirect_offer", {
								"lm": Lm.FormatAmount(response.priceMilliLm)
							}) + " <a href='#' data-alias='" + String(response.aliasName).escapeHTML() + "' data-toggle='modal' data-target='#buy_alias_modal'>" + $.t("buy_it_q") + "</a>";
						} else {
							message = $.t("error_alias_sale_different_account");
						}
					} else {
						message = "<a href='#' data-user='" + Lm.GetAccountFormatted(response, "account") + "'>" + $.t("view_owner_info_q") + "</a>";
					}

					$("#register_alias_modal").find(".error_message").html(errorDescription + ". " + message);
				}
			}, false);
		}
	}

	function SetAliasCompleteForm(response, data) {
		if (response.alreadyProcessed) {
			return;
		}

		if (Lm.CurrentPage == "aliases") {
			data.aliasName = String(data.aliasName).escapeHTML();
			data.aliasURI = String(data.aliasURI);

			if (data.aliasURI.length > 100) {
				data.shortAliasURI = data.aliasURI.substring(0, 100) + "...";
				data.shortAliasURI = data.shortAliasURI.escapeHTML();
			} else {
				data.shortAliasURI = data.aliasURI.escapeHTML();
			}

			data.aliasURI = data.aliasURI.escapeHTML();

			var $table = $("#aliases_table tbody");

			var $row = $table.find("tr[data-alias=" + data.aliasName.toLowerCase() + "]");

			if ($row.length) {
				$row.addClass("tentative");
				$row.find("td.alias").html(data.aliasName);

				if (data.aliasURI && data.aliasURI.indexOf("http") === 0) {
					$row.find("td.uri").html("<a href='" + data.aliasURI + "' target='_blank'>" + data.shortAliasURI + "</a>");
				} else {
					$row.find("td.uri").html(data.shortAliasURI);
				}

				$.growl($.t("success_alias_update"), {
					"type": "success"
				});
			} else {
				var $rows = $table.find("tr");

				var rowToAdd = "<tr class='tentative' data-alias='" + data.aliasName.toLowerCase() + "'>"+
				"<td class='alias'>" + data.aliasName + "</td>"+
				"<td class='uri'>" + (data.aliasURI && data.aliasURI.indexOf("http") === 0 ? "<a href='" + data.aliasURI + "' target='_blank'>" +
					data.shortAliasURI + "</a>" : data.shortAliasURI) + "</td>"+
				"<td>/</td>"+
				"<td style='white-space:nowrap'><a class='btn btn-xs btn-default' href='#'>" + $.t("edit") + "</a>" +
				(Lm.DgsBlockPassed ? " <a class='btn btn-xs btn-default' href='#'>" + $.t("transfer") +
					"</a> <a class='btn btn-xs btn-default' href='#'>" + $.t("sell") + "</a>" : "") + "</td></tr>";

				var rowAdded = false;

				var newAlias = data.aliasName.toLowerCase();

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

				$.growl($.t("success_alias_register"), {
					"type": "success"
				});
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
				$.growl($.t("error_alias_not_found") + " <a href='#' data-toggle='modal' data-target='#register_alias_modal' data-prefill-alias='" + String(alias).escapeHTML() + "'>" + $.t("register_q") + "</a>", {
					"type": "danger"
				});
				Lm.FetchingModalData = false;
			} else {
				$("#alias_info_modal_alias").html(String(response.aliasName).escapeHTML());

				var data = {
					"account": Lm.GetAccountTitle(response, "account"),
					"last_updated": Lm.FormatTimestamp(response.timestamp),
					"data_formatted_html": String(response.aliasURI).autoLink()
				}

				if ("priceMilliLm" in response) {
					if (response.buyer == Lm.Account) {
						$("#alias_sale_callout").html($.t("alias_sale_direct_offer", {
							"lm": Lm.FormatAmount(response.priceMilliLm)
						}) + " <a href='#' data-alias='" + String(response.aliasName).escapeHTML() + "' data-toggle='modal' data-target='#buy_alias_modal'>" + $.t("buy_it_q") + "</a>").show();
					} else if (typeof response.buyer == "undefined") {
						$("#alias_sale_callout").html($.t("alias_sale_indirect_offer", {
							"lm": Lm.FormatAmount(response.priceMilliLm)
						}) + " <a href='#' data-alias='" + String(response.aliasName).escapeHTML() + "' data-toggle='modal' data-target='#buy_alias_modal'>" + $.t("buy_it_q") + "</a>").show();
					} else {
						$("#alias_sale_callout").html($.t("error_alias_sale_different_account")).show();
					}
				} else {
					$("#alias_sale_callout").hide();
				}

				$("#alias_info_table tbody").append(Lm.CreateInfoTable(data));

				$("#alias_info_modal").modal("show");
				Lm.FetchingModalData = false;
			}
		});
	}


	$("#transfer_alias_modal, #sell_alias_modal, #cancel_alias_sale_modal").on("show.bs.modal", function AliasModal_OnShow(e) { AliasModal_OnShow($(this), e); });
	$("#sell_alias_to_specific_account, #sell_alias_to_anyone").on("click", function (e) { Alias_OnClick($(this), e); });
	$("#buy_alias_modal").on("show.bs.modal", function (e) { BuyAliasModal_OnShow($(this), e); });
	$("#register_alias_modal").on("show.bs.modal", RegisterAliasModal_OnShow);
	$("#register_alias_type").on("change", function RegisterAliasType_OnChange() { RegisterAliasType_OnChange($(this)); });
	$("#alias_search").on("submit", AliasSearch_OnSubmit);


	Lm.Pages.Aliases = AliasesPage;
	Lm.Forms.SellAlias = SellAliasForm;
	Lm.Forms.SellAliasComplete = SellAliasCompleteForm;
	Lm.Forms.BuyAliasError = BuyAliasErrorForm;
	Lm.Forms.BuyAliasComplete = BuyAliasCompleteForm;
	Lm.Incoming.Aliases = AliasesIncoming;
	Lm.Forms.SetAlias = SetAliasForm;
	Lm.Forms.SetAliasError = SetAliasErrorForm;
	Lm.Forms.SetAliasComplete = SetAliasCompleteForm;

	return Lm;
}(Lm || {}, jQuery));