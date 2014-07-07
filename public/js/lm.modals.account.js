var Lm = (function(Lm, $, undefined) {

	Lm.UserInfoModal = {
		"user": 0
	};

	$("#blocks_table, #polls_table, #contacts_table, #transactions_table, #dashboard_transactions_table, #asset_account, #asset_exchange_ask_orders_table, #asset_exchange_bid_orders_table, #account_details_modal, #transaction_info_modal, #alias_info_table").on("click", "a[data-user]", function(e) {
		e.preventDefault();

		var account = $(this).data("user");

		Lm.ShowAccountModal(account);
	});

	function ShowAccountModal(account) {
		if (Lm.FetchingModalData) {
			return;
		}

		if (typeof account == "object") {
			Lm.UserInfoModal.user = account.account;
		} else {
			Lm.UserInfoModal.user = account;
			Lm.FetchingModalData = true;
		}

		$("#user_info_modal_account").html(Lm.GetAccountFormatted(Lm.UserInfoModal.user));

		$("#user_info_modal_actions button").data("account", Lm.UserInfoModal.user);

		if (Lm.UserInfoModal.user in Lm.Contacts) {
			$("#user_info_modal_add_as_contact").hide();
		} else {
			$("#user_info_modal_add_as_contact").show();
		}

		if (Lm.FetchingModalData) {
			Lm.SendRequest("getAccount", {
				"account": Lm.UserInfoModal.user
			}, function(response) {
				Lm.ProcessAccountModalData(response);
				Lm.FetchingModalData = false;
			});
		} else {
			Lm.ProcessAccountModalData(account);
		}

		$("#user_info_modal_transactions").show();

		Lm.UserInfoModal.transactions();
	}

	function ProcessAccountModalData(account) {
		if (account.unconfirmedBalanceNQT == "0") {
			$("#user_info_modal_account_balance").html("0");
		} else {
			$("#user_info_modal_account_balance").html(Lm.FormatAmount(account.unconfirmedBalanceNQT) + " Lm");
		}

		if (account.name) {
			$("#user_info_modal_account_name").html(String(account.name).escapeHTML());
			$("#user_info_modal_account_name_container").show();
		} else {
			$("#user_info_modal_account_name_container").hide();
		}

		if (account.description) {
			$("#user_info_description").show();
			$("#user_info_modal_description").html(String(account.description).escapeHTML().nl2br());
		} else {
			$("#user_info_description").hide();
		}

		$("#user_info_modal").modal("show");
	}

	function UserInfoModal_OnHidden(e, th) {
		th.find(".user_info_modal_content").hide();
		th.find(".user_info_modal_content table tbody").empty();
		th.find(".user_info_modal_content:not(.data-loading,.data-never-loading)").addClass("data-loading");
		th.find("ul.nav li.active").removeClass("active");
		$("#user_info_transactions").addClass("active");
		Lm.UserInfoModal.user = 0;
	}

	function UserInfoModalNav_OnClick(e, th) {
		e.preventDefault();

		var tab = th.data("tab");

		th.siblings().removeClass("active");
		th.addClass("active");

		$(".user_info_modal_content").hide();

		var content = $("#user_info_modal_" + tab);

		content.show();

		if (content.hasClass("data-loading")) {
			Lm.UserInfoModal[tab]();
		}
	}

	/*some duplicate methods here...*/
	function UserInfoModal_Transactions(type) {
		Lm.SendRequest("getAccountTransactionIds", {
			"account": Lm.UserInfoModal.user,
			"timestamp": 0
		}, function(response) {
			if (response.transactionIds && response.transactionIds.length) {
				var transactions = {};
				var nr_transactions = 0;

				var transactionIds = response.transactionIds.reverse().slice(0, 100);

				for (var i = 0; i < transactionIds.length; i++) {
					Lm.SendRequest("getTransaction", {
						"transaction": transactionIds[i]
					}, function(transaction, input) {
						transactions[input.transaction] = transaction;
						nr_transactions++;

						if (nr_transactions == transactionIds.length) {
							var rows = "";

							for (var i = 0; i < nr_transactions; i++) {
								var transaction = transactions[transactionIds[i]];

								var transactionType = "Unknown";

								if (transaction.type == 0) {
									transactionType = "Ordinary payment";
								} else if (transaction.type == 1) {
									switch (transaction.subtype) {
										case 0:
											transactionType = "Arbitrary message";
											break;
										case 1:
											transactionType = "Alias assignment";
											break;
										case 2:
											transactionType = "Poll creation";
											break;
										case 3:
											transactionType = "Vote casting";
											break;
										case 4:
											transactionType = "Hub Announcement";
											break;
										case 5:
											transactionType = "Account Info";
											break;
									}
								} else if (transaction.type == 2) {
									switch (transaction.subtype) {
										case 0:
											transactionType = "Asset issuance";
											break;
										case 1:
											transactionType = "Asset transfer";
											break;
										case 2:
											transactionType = "Ask order placement";
											break;
										case 3:
											transactionType = "Bid order placement";
											break;
										case 4:
											transactionType = "Ask order cancellation";
											break;
										case 5:
											transactionType = "Bid order cancellation";
											break;
									}
								} else if (transaction.type == 3) {
									switch (transaction.subtype) {
										case 0:
											transactionType = "Digital Goods Listing";
											break;
										case 1:
											transactionType = "Digital Goods Delisting";
											break;
										case 2:
											transactionType = "Digtal Goods Price Change";
											break;
										case 3:
											transactionType = "Digital Goods Quantity Change";
											break;
										case 4:
											transactionType = "Digital Goods Purchase";
											break;
										case 5:
											transactionType = "Digital Goods Delivery";
											break;
										case 6:
											transactionType = "Digital Goods Feedback";
											break;
										case 7:
											transactionType = "Digital Goods Refund";
											break;
									}
								} else if (transaction.type == 4) {
									switch (transaction.subtype) {
										case 0:
											transactionType = "Balance Leasing";
											break;
									}
								}

								if (/^NXT\-/i.test(Lm.UserInfoModal.user)) {
									var receiving = (transaction.recipientRS == Lm.UserInfoModal.user);
								} else {
									var receiving = (transaction.recipient == Lm.UserInfoModal.user);
								}

								if (transaction.amountNQT) {
									transaction.amount = new BigInteger(transaction.amountNQT);
									transaction.fee = new BigInteger(transaction.feeNQT);
								}

								var account = (receiving ? "sender" : "recipient");

								rows += "<tr><td>" + Lm.FormatTimestamp(transaction.timestamp) + "</td>"+
									"<td>" + transactionType + "</td>"+
									"<td style='width:5px;padding-right:0;'>" + (transaction.type == 0 ? (receiving ?
										"<i class='fa fa-plus-circle' style='color:#65C62E'></i>" :
										"<i class='fa fa-minus-circle' style='color:#E04434'></i>") : "") + "</td>"+
									"<td " + (transaction.type == 0 && receiving ? " style='color:#006400;'" :
										(!receiving && transaction.amount > 0 ? " style='color:red'" : "")) + ">" +
									Lm.FormatAmount(transaction.amount) + "</td>"+
									"<td " + (!receiving ? " style='color:red'" : "") + ">" + Lm.FormatAmount(transaction.fee) + "</td>"+
									"<td>" + Lm.GetAccountTitle(transaction, account) + "</td></tr>";
							}

							$("#user_info_modal_transactions_table tbody").empty().append(rows);
							Lm.DataLoadFinished($("#user_info_modal_transactions_table"));
						}
					});
				}
			} else {
				$("#user_info_modal_transactions_table tbody").empty();
				Lm.DataLoadFinished($("#user_info_modal_transactions_table"));
			}
		});
	}

	function UserInfoModal_Aliases() {
		Lm.SendRequest("getAliases", {
			"account": Lm.UserInfoModal.user,
			"timestamp": 0
		}, function(response) {
			if (response.aliases && response.aliases.length) {
				var aliases = response.aliases;

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

					rows += "<tr data-alias='" + String(alias.aliasName).toLowerCase().escapeHTML() + "'>"+
						"<td class='alias'>" + String(alias.aliasName).escapeHTML() + "</td>"+
						"<td class='uri'>" + (alias.aliasURI.indexOf("http") === 0 ? "<a href='" + String(alias.aliasURI).escapeHTML() +
							"' target='_blank'>" + String(alias.aliasURI).escapeHTML() + "</a>" : String(alias.aliasURI).escapeHTML()) + "</td></tr>";
					if (!alias.uri) {
						empty_alias_count++;
					} else if (alias.aliasURI.indexOf("http") === 0) {
						alias_uri_count++;
					} else if (alias.aliasURI.indexOf("acct:") === 0 || alias.aliasURI.indexOf("nacc:") === 0) {
						alias_account_count++;
					}
				}

				$("#user_info_modal_aliases_table tbody").empty().append(rows);
				Lm.DataLoadFinished($("#user_info_modal_aliases_table"));
			} else {
				$("#user_info_modal_aliases_table tbody").empty();
				Lm.DataLoadFinished($("#user_info_modal_aliases_table"));
			}
		});
	}

	function UserInfoModal_Assets() {
		Lm.SendRequest("getAccount", {
			"account": Lm.UserInfoModal.user
		}, function(response) {
			if (response.assetBalances && response.assetBalances.length) {
				var assets = {};
				var nrAssets = 0;
				var ignoredAssets = 0;

				for (var i = 0; i < response.assetBalances.length; i++) {
					if (response.assetBalances[i].balanceQNT == "0") {
						ignoredAssets++;

						if (nrAssets + ignoredAssets == response.assetBalances.length) {
							Lm.UserInfoModal.addIssuedAssets(assets);
						}
						continue;
					}

					Lm.SendRequest("getAsset", {
						"asset": response.assetBalances[i].asset,
						"_extra": {
							"balanceQNT": response.assetBalances[i].balanceQNT
						}
					}, function(asset, input) {
						asset.asset = input.asset;
						asset.balanceQNT = input["_extra"].balanceQNT;

						assets[asset.asset] = asset;
						nrAssets++;

						if (nrAssets + ignoredAssets == response.assetBalances.length) {
							Lm.UserInfoModal.addIssuedAssets(assets);
						}
					});
				}
			} else {
				Lm.UserInfoModal.addIssuedAssets({});
			}
		});
	}

	function UserInfoModal_AddIssuedAssets(assets) {
		Lm.SendRequest("getAssetsByIssuer", {
			"account": Lm.UserInfoModal.user
		}, function(response) {
			if (response.assets && response.assets[0] && response.assets[0].length) {
				$.each(response.assets[0], function(key, issuedAsset) {
					if (assets[issuedAsset.asset]) {
						assets[issuedAsset.asset].issued = true;
					} else {
						issuedAsset.balanceQNT = "0";
						issuedAsset.issued = true;
						assets[issuedAsset.asset] = issuedAsset;
					}
				});

				Lm.UserInfoModal.assetsLoaded(assets);
			} else if (!$.isEmptyObject(assets)) {
				Lm.UserInfoModal.assetsLoaded(assets);
			} else {
				$("#user_info_modal_assets_table tbody").empty();
				Lm.DataLoadFinished($("#user_info_modal_assets_table"));
			}
		});
	}

	function UserInfoModal_AssetsLoaded(assets) {
		var assetArray = [];
		var rows = "";

		$.each(assets, function(key, asset) {
			assetArray.push(asset);
		});

		assetArray.sort(function(a, b) {
			if (a.issued && b.issued) {
				if (a.name.toLowerCase() > b.name.toLowerCase()) {
					return 1;
				} else if (a.name.toLowerCase() < b.name.toLowerCase()) {
					return -1;
				} else {
					return 0;
				}
			} else if (a.issued) {
				return -1;
			} else if (b.issued) {
				return 1;
			} else {
				if (a.name.toLowerCase() > b.name.toLowerCase()) {
					return 1;
				} else if (a.name.toLowerCase() < b.name.toLowerCase()) {
					return -1;
				} else {
					return 0;
				}
			}
		});

		for (var i = 0; i < assetArray.length; i++) {
			var asset = assetArray[i];

			var percentageAsset = Lm.CalculatePercentage(asset.balanceQNT, asset.quantityQNT);

			rows += "<tr" + (asset.issued ? " class='asset_owner'" : "") + "><td><a href='#' data-goto-asset='" +
				String(asset.asset).escapeHTML() + "'" + (asset.issued ? " style='font-weight:bold'" : "") + ">" +
				String(asset.name).escapeHTML() + "</a></td>"+
				"<td class='quantity'>" + Lm.FormatQuantity(asset.balanceQNT, asset.decimals) + "</td>"+
				"<td>" + Lm.FormatQuantity(asset.quantityQNT, asset.decimals) + "</td>"+
				"<td>" + percentageAsset + "%</td></tr>";
		}

		$("#user_info_modal_assets_table tbody").empty().append(rows);

		Lm.DataLoadFinished($("#user_info_modal_assets_table"));
	}


	$("#user_info_modal").on("hidden.bs.modal", function(e) {
		UserInfoModal_OnHidden(e, $(this));
	});

	$("#user_info_modal ul.nav li").click(function(e) {
		UserInfoModalNav_OnClick(e, $(this))
	});


	Lm.ShowAccountModal = ShowAccountModal;
	Lm.ProcessAccountModalData = ProcessAccountModalData;
	Lm.UserInfoModal.Transactions = UserInfoModal_Transactions;
	Lm.UserInfoModal.Aliases = UserInfoModal_Aliases;
	Lm.UserInfoModal.Assets = UserInfoModal_Assets;
	Lm.UserInfoModal.AddIssuedAssets = UserInfoModal_AddIssuedAssets;
	Lm.UserInfoModal.AssetsLoaded = UserInfoModal_AssetsLoaded;
	return Lm;
}(Lm || {}, jQuery));