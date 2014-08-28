/**
 * @depends {lm.js}
 */
var Lm = (function(Lm, $, undefined) {
	Lm.Assets = [];
	Lm.AssetIds = [];
	Lm.ClosedGroups = [];
	Lm.AssetSearch = false;
	Lm.LastIssuerCheck = false;
	Lm.ViewingAsset = false; //viewing non-bookmarked asset
	Lm.CurrentAsset = {};
	var currentAssetID = 0;

	function AssetExchangePage(callback) {
		$(".content.content-stretch:visible").width($(".page:visible").width());

		if (Lm.DatabaseSupport) {
			Lm.Assets = [];
			Lm.AssetIds = [];

			Lm.Database.select("assets", null, function(error, assets) {
				//select already bookmarked assets
				$.each(assets, function(index, asset) {
					Lm.CacheAsset(asset);
				});

				//check owned assets, see if any are not yet in bookmarked assets
				if (Lm.AccountInfo.unconfirmedAssetBalances) {
					var newAssetIds = [];

					$.each(Lm.AccountInfo.unconfirmedAssetBalances, function(key, assetBalance) {
						if (Lm.AssetIds.indexOf(assetBalance.asset) == -1) {
							newAssetIds.push(assetBalance.asset);
							Lm.AssetIds.push(assetBalance.asset);
						}
					});

					//add to bookmarked assets
					if (newAssetIds.length) {
						var qs = [];

						for (var i = 0; i < newAssetIds.length; i++) {
							qs.push("assets=" + encodeURIComponent(newAssetIds[i]));
						}

						qs = qs.join("&");
						//first get the assets info
						Lm.SendRequest("getAssets+", {
							//special request.. ugly hack.. also does POST due to URL max length
							"querystring": qs
						}, function(response) {
							if (response.assets && response.assets.length) {
								Lm.SaveAssetBookmarks(response.assets, function() {
									Lm.LoadAssetExchangeSidebar(callback);
								});
							} else {
								Lm.LoadAssetExchangeSidebar(callback);
							}
						});
					} else {
						Lm.LoadAssetExchangeSidebar(callback);
					}
				} else {
					Lm.LoadAssetExchangeSidebar(callback);
				}
			});
		} else {
			//for users without db support, we only need to fetch owned assets
			if (Lm.AccountInfo.unconfirmedAssetBalances) {
				var qs = [];

				$.each(Lm.AccountInfo.unconfirmedAssetBalances, function(key, assetBalance) {
					if (Lm.AssetIds.indexOf(assetBalance.asset) == -1) {
						qs.push("assets=" + encodeURIComponent(assetBalance.asset));
					}
				});

				qs = qs.join("&");

				if (qs) {
					Lm.SendRequest("getAssets+", {
						"querystring": qs
					}, function(response) {
						if (response.assets && response.assets.length) {
							$.each(response.assets, function(key, asset) {
								Lm.CacheAsset(asset);
							});
						}
						Lm.LoadAssetExchangeSidebar(callback);
					});
				} else {
					Lm.LoadAssetExchangeSidebar(callback);
 				}
			} else {
				Lm.LoadAssetExchangeSidebar(callback);
			}
		}
	}

	function CacheAsset(asset) {
		if (Lm.AssetIds.indexOf(asset.asset) != -1) {
			return;
		}

		Lm.AssetIds.push(asset.asset);

		if (!asset.groupName) {
			asset.groupName = "";
		}

		var asset = {
			"asset": String(asset.asset),
			"name": String(asset.name).toLowerCase(),
			"description": String(asset.description),
			"groupName": String(asset.groupName).toLowerCase(),
			"account": String(asset.account),
			"accountRS": String(asset.accountRS),
			"quantityQNT": String(asset.quantityQNT),
			"decimals": parseInt(asset.decimals, 10)
		};

		Lm.Assets.push(asset);
	}

	function AddAssetBookmarkForm($modal) {
		var data = Lm.GetFormData($modal.find("form:first"));

		data.id = $.trim(data.id);

		if (!data.id) {
			return {
				"error": $.t("error_asset_or_account_id_required")
			};
		}

		if (!/^\d+$/.test(data.id) && !/^LMA\-/i.test(data.id)) {
			return {
				"error": $.t("error_asset_or_account_id_invalid")
			};
		}

		if (/^LMA\-/i.test(data.id)) {
			Lm.SendRequest("getAssetsByIssuer", {
				"account": data.id
			}, function(response) {
				if (response.errorCode) {
					Lm.ShowModalError(Lm.TranslateServerError(response), $modal);
				} else {
					if (response.assets && response.assets[0] && response.assets[0].length) {
						Lm.SaveAssetBookmarks(response.assets[0], Lm.Forms.AddAssetBookmarkComplete);
					} else {
						Lm.ShowModalError($.t("account_no_assets"), $modal);
					}
				}
			});
		} else {
			Lm.SendRequest("getAsset", {
				"asset": data.id
			}, function(response) {
				if (response.errorCode) {
					Lm.SendRequest("getAssetsByIssuer", {
						"account": data.id
					}, function(response) {
						if (response.errorCode) {
							Lm.ShowModalError(Lm.TranslateServerError(response), $modal);
						} else {
							if (response.assets && response.assets[0] && response.assets[0].length) {
								Lm.SaveAssetBookmarks(response.assets[0], Lm.Forms.AddAssetBookmarkComplete);
							} else {
								Lm.ShowModalError($.t("no_asset_found"), $modal);
							}
						}
					});
				} else {
					Lm.SaveAssetBookmarks(new Array(response), Lm.Forms.AddAssetBookmarkComplete);
				}
			});
		}
	}

	function AssetExchangeBookmarkThisAsset_OnClick() {
		if (Lm.ViewingAsset) {
			Lm.SaveAssetBookmarks(new Array(Lm.ViewingAsset), function(newAssets) {
				Lm.ViewingAsset = false;
				Lm.LoadAssetExchangeSidebar(function() {
					$("#asset_exchange_sidebar a[data-asset=" + newAssets[0].asset + "]").addClass("active").trigger("click");
				});
			});
		}
	}

	function AddAssetBookmarkCompleteForm(newAssets, submittedAssets) {
		Lm.AssetSearch = false;

		if (newAssets.length == 0) {
			Lm.CloseModal();
			$.growl($.t("error_asset_already_bookmarked", {
				"count": submittedAssets.length
			}), {
				"type": "danger"
			});
			$("#asset_exchange_sidebar a.active").removeClass("active");
			$("#asset_exchange_sidebar a[data-asset=" + submittedAssets[0].asset + "]").addClass("active").trigger("click");
			return;
		} else {
			Lm.CloseModal();

			var message = $.t("success_asset_bookmarked", {
				"count": newAssets.length
			});

			if (!Lm.DatabaseSupport) {
				message += " " + $.t("error_assets_save_db");
			}

			$.growl(message, {
				"type": "success"
			});

			Lm.LoadAssetExchangeSidebar(function(callback) {
				$("#asset_exchange_sidebar a.active").removeClass("active");
				$("#asset_exchange_sidebar a[data-asset=" + newAssets[0].asset + "]").addClass("active").trigger("click");
			});
		}
	}

	function SaveAssetBookmarks(assets, callback) {
		var newAssetIds = [];
		var newAssets = [];

		$.each(assets, function(key, asset) {
			var newAsset = {
				"asset": String(asset.asset),
				"name": String(asset.name),
				"description": String(asset.description),
				"account": String(asset.account),
				"accountRS": String(asset.accountRS),
				"quantityQNT": String(asset.quantityQNT),
				"decimals": parseInt(asset.decimals, 10),
				"groupName": ""
			};

			newAssets.push(newAsset);

			if (Lm.DatabaseSupport) {
				newAssetIds.push({
					"asset": String(asset.asset)
				});
			} else if (Lm.AssetIds.indexOf(asset.asset) == -1) {
				Lm.AssetIds.push(asset.asset);
				newAsset.name = newAsset.name.toLowerCase();
				Lm.Assets.push(newAsset);
			}
		});

		if (!Lm.DatabaseSupport) {
			if (callback) {
				callback(newAssets, assets);
			}
			return;
		}

		Lm.Database.select("assets", newAssetIds, function(error, existingAssets) {
			var existingIds = [];

			if (existingAssets.length) {
				$.each(existingAssets, function(index, asset) {
					existingIds.push(asset.asset);
				});

				newAssets = $.grep(newAssets, function(v) {
					return (existingIds.indexOf(v.asset) === -1);
				});
			}

			if (newAssets.length == 0) {
				if (callback) {
					callback([], assets);
				}
			} else {
				Lm.Database.insert("assets", newAssets, function(error) {
					$.each(newAssets, function(key, asset) {
						asset.name = asset.name.toLowerCase();
						Lm.AssetIds.push(asset.asset);
						Lm.Assets.push(asset);
					});

					if (callback) {
						//for some reason we need to wait a little or DB won't be able to fetch inserted record yet..
						setTimeout(function() {
							callback(newAssets, assets);
						}, 50);
					}
				});
			}
		});
	}

	function PositionAssetSidebar() {
		$("#asset_exchange_sidebar").parent().css("position", "relative");
		$("#asset_exchange_sidebar").parent().css("padding-bottom", "5px");
		//$("#asset_exchange_sidebar_content").height($(window).height() - 120);
		$("#asset_exchange_sidebar").height($(window).height() - 120);
	}

	//called on opening the asset exchange page and automatic refresh
	function LoadAssetExchangeSidebar(callback) {
		if (!Lm.Assets.length) {
			Lm.PageLoaded(callback);
			$("#asset_exchange_sidebar_content").empty();
			$("#no_asset_selected, #loading_asset_data, #no_asset_search_results, #asset_details").hide();
			$("#no_assets_available").show();
			$("#asset_exchange_page").addClass("no_assets");
			return;
		}

		var rows = "";

		$("#asset_exchange_page").removeClass("no_assets");

		Lm.PositionAssetSidebar();

		Lm.Assets.sort(function(a, b) {
			if (!a.groupName && !b.groupName) {
				if (a.name > b.name) {
					return 1;
				} else if (a.name < b.name) {
					return -1;
				} else {
					return 0;
				}
			} else if (!a.groupName) {
				return 1;
			} else if (!b.groupName) {
				return -1;
			} else if (a.groupName > b.groupName) {
				return 1;
			} else if (a.groupName < b.groupName) {
				return -1;
			} else {
				if (a.name > b.name) {
					return 1;
				} else if (a.name < b.name) {
					return -1;
				} else {
					return 0;
				}
			}
		});

		var lastGroup = "";
		var ungrouped = true;
		var isClosedGroup = false;

		var isSearch = Lm.AssetSearch !== false;
		var searchResults = 0;

		for (var i = 0; i < Lm.Assets.length; i++) {
			var asset = Lm.Assets[i];

			if (isSearch) {
				if (Lm.AssetSearch.indexOf(asset.asset) == -1) {
					continue;
				} else {
					searchResults++;
				}
			}

			if (asset.groupName.toLowerCase() != lastGroup) {
				var to_check = (asset.groupName ? asset.groupName : "undefined");

				if (Lm.ClosedGroups.indexOf(to_check) != -1) {
					isClosedGroup = true;
				} else {
					isClosedGroup = false;
				}

				if (asset.groupName) {
					ungrouped = false;
					rows += "<a href='#' class='list-group-item list-group-item-header" + (asset.groupName == "Ignore List" ? " no-context" : "") + "'" + (asset.groupName != "Ignore List" ? " data-context='asset_exchange_sidebar_group_context' " : "data-context=''") + " data-groupname='" + asset.groupName.escapeHTML() + "' data-closed='" + isClosedGroup + "'><h4 class='list-group-item-heading'>" + asset.groupName.toUpperCase().escapeHTML() + "</h4><i class='fa fa-angle-" + (isClosedGroup ? "right" : "down") + " group_icon'></i></h4></a>";
				} else {
					ungrouped = true;
					rows += "<a href='#' class='list-group-item list-group-item-header no-context' data-closed='" + isClosedGroup + "'><h4 class='list-group-item-heading'>UNGROUPED <i class='fa pull-right fa-angle-" + (isClosedGroup ? "right" : "down") + "'></i></h4></a>";
				}

				lastGroup = asset.groupName.toLowerCase();
			}

			var ownsAsset = false;

			if (Lm.AccountInfo.assetBalances) {
				$.each(Lm.AccountInfo.assetBalances, function(key, assetBalance) {
					if (assetBalance.asset == asset.asset && assetBalance.balanceQNT != "0") {
						ownsAsset = true;
						return false;
					}
				});
			}

			rows += "<a href='#' class='list-group-item list-group-item-" + (ungrouped ? "ungrouped" : "grouped") +
			(ownsAsset ? " owns_asset" : " not_owns_asset") + "' data-cache='" + i + "' data-asset='" + String(asset.asset).escapeHTML()
			+ "'" + (!ungrouped ? " data-groupname='" + asset.groupName.escapeHTML() + "'" : "") +
			(isClosedGroup ? " style='display:none'" : "") + " data-closed='" + isClosedGroup + "'>"+
			"<h4 class='list-group-item-heading'>" + asset.name.escapeHTML() + "</h4>"+
			"<p class='list-group-item-text'>qty: " + Lm.FormatQuantity(asset.quantityQNT, asset.decimals) + "</p></a>";
		}

		var active = $("#asset_exchange_sidebar a.active");


		if (active.length) {
			active = active.data("asset");
		} else {
			active = false;
		}

		$("#asset_exchange_sidebar_content").empty().append(rows);
		$("#asset_exchange_sidebar_search").show();

		if (isSearch) {
			if (active && Lm.AssetSearch.indexOf(active) != -1) {
				//check if currently selected asset is in search results, if so keep it at that
				$("#asset_exchange_sidebar a[data-asset=" + active + "]").addClass("active");
			} else if (Lm.AssetSearch.length == 1) {
				//if there is only 1 search result, click it
				$("#asset_exchange_sidebar a[data-asset=" + Lm.AssetSearch[0] + "]").addClass("active").trigger("click");
			}
		} else if (active) {
			$("#asset_exchange_sidebar a[data-asset=" + active + "]").addClass("active");
		}

		if (isSearch || Lm.Assets.length >= 10) {
			$("#asset_exchange_sidebar_search").show();
		} else {
			$("#asset_exchange_sidebar_search").hide();
		}

		if (isSearch && Lm.AssetSearch.length == 0) {
			$("#no_asset_search_results").show();
			$("#asset_details, #no_asset_selected, #no_assets_available").hide();
		} else if (!$("#asset_exchange_sidebar a.active").length) {
			$("#no_asset_selected").show();
			$("#asset_details, #no_assets_available, #no_asset_search_results").hide();
		} else if (active) {
			$("#no_assets_available, #no_asset_selected, #no_asset_search_results").hide();
		}

		if (Lm.ViewingAsset) {
			$("#asset_exchange_bookmark_this_asset").show();
		} else {
			$("#asset_exchange_bookmark_this_asset").hide();
		}

		Lm.PageLoaded(callback);
	}

	function AssetExchangeIncoming() {
		if (!Lm.ViewingAsset) {
			//refresh active asset
			var $active = $("#asset_exchange_sidebar a.active");

			if ($active.length) {
				$active.trigger("click", [{
					"refresh": true
				}]);
			}
		} else {
			Lm.LoadAsset(Lm.ViewingAsset, true);
		}

		//update assets owned (colored)
		$("#asset_exchange_sidebar a.list-group-item.owns_asset").removeClass("owns_asset").addClass("not_owns_asset");

		if (Lm.AccountInfo.assetBalances) {
			$.each(Lm.AccountInfo.assetBalances, function(key, assetBalance) {
				if (assetBalance.balanceQNT != "0") {
					$("#asset_exchange_sidebar a.list-group-item[data-asset=" + assetBalance.asset + "]").addClass("owns_asset").removeClass("not_owns_asset");
				}
			});
		}
	}

	function AssetExchangeSidebar_OnClick(th, e, data) {
		e.preventDefault();

		currentAssetID = String(th.data("asset")).escapeHTML();

		//refresh is true if data is refreshed automatically by the system (when a new block arrives)
		if (data && data.refresh) {
			var refresh = true;
		} else {
			var refresh = false;
		}

		//clicked on a group
		if (!currentAssetID) {
			if (Lm.DatabaseSupport) {
				var group = th.data("groupname");
				var closed = th.data("closed");

				if (!group) {
					var $links = $("#asset_exchange_sidebar a.list-group-item-ungrouped");
				} else {
					var $links = $("#asset_exchange_sidebar a.list-group-item-grouped[data-groupname='" + group.escapeHTML() + "']");
				}

				if (!group) {
					group = "undefined";
				}

				if (closed) {
					var pos = Lm.ClosedGroups.indexOf(group);
					if (pos >= 0) {
						Lm.ClosedGroups.splice(pos);
					}
					th.data("closed", "");
					th.find("i").removeClass("fa-angle-right").addClass("fa-angle-down");
					$links.show();
				} else {
					Lm.ClosedGroups.push(group);
					th.data("closed", true);
					th.find("i").removeClass("fa-angle-down").addClass("fa-angle-right");
					$links.hide();
				}

				Lm.Database.update("data", {
					"contents": Lm.ClosedGroups.join("#")
				}, [{
					"id": "closed_groups"
				}]);
			}

			return;
		}

		if (Lm.DatabaseSupport) {
			Lm.Database.select("assets", [{
				"asset": currentAssetID
			}], function(error, asset) {
				if (asset && asset.length && asset[0].asset == currentAssetID) {
					Lm.LoadAsset(asset[0], refresh);
				}
			});
		} else {
			Lm.SendRequest("getAsset+", {
				"asset": currentAssetID
			}, function(response, input) {
				if (!response.errorCode && response.asset == currentAssetID) {
					Lm.LoadAsset(response, refresh);
				}
			});
		}
	}

	function LoadAsset(asset, refresh) {
		var assetId = asset.asset;

		Lm.CurrentAsset = asset;
		Lm.CurrentSubPage = assetId;

		if (!refresh) {
			$("#asset_exchange_sidebar a.active").removeClass("active");
			$("#asset_exchange_sidebar a[data-asset=" + assetId + "]").addClass("active");

			$("#no_asset_selected, #loading_asset_data, #no_assets_available, #no_asset_search_results").hide();
			$("#asset_details").show().parent().animate({
				"scrollTop": 0
			}, 0);

			$("#asset_account").html("<a href='#' data-user='" + Lm.GetAccountFormatted(asset, "account") + "' class='user_info'>" +
				Lm.GetAccountTitle(asset, "account") + "</a>");
			$("#asset_id").html(assetId.escapeHTML());
			$("#asset_decimals").html(String(asset.decimals).escapeHTML());
			$("#asset_name").html(String(asset.name).escapeHTML());
			$("#asset_description").html(String(asset.description).autoLink());
			$("#asset_quantity").html(Lm.FormatQuantity(asset.quantityQNT, asset.decimals));

			$(".asset_name").html(String(asset.name).escapeHTML());
			$("#sell_asset_button").data("asset", assetId);
			$("#buy_asset_button").data("asset", assetId);
			$("#sell_asset_for_lm").html($.t("sell_asset_for_lm", {
				"assetName": String(asset.name).escapeHTML()
			}));
			$("#buy_asset_with_lm").html($.t("buy_asset_with_lm", {
				"assetName": String(asset.name).escapeHTML()
			}));
			$("#sell_asset_price, #buy_asset_price").val("");
			$("#sell_asset_quantity, #sell_asset_total, #buy_asset_quantity, #buy_asset_total").val("0");

			$("#asset_exchange_ask_orders_table tbody").empty();
			$("#asset_exchange_bid_orders_table tbody").empty();
			$("#asset_exchange_trade_history_table tbody").empty();
			$("#asset_exchange_ask_orders_table").parent().addClass("data-loading").removeClass("data-empty");
			$("#asset_exchange_bid_orders_table").parent().addClass("data-loading").removeClass("data-empty");
			$("#asset_exchange_trade_history_table").parent().addClass("data-loading").removeClass("data-empty");

			$(".data-loading img.loading").hide();

			setTimeout(function() {
				$(".data-loading img.loading").fadeIn(200);
			}, 200);

			var nrDuplicates = 0;

			$.each(Lm.Assets, function(key, singleAsset) {
				if (String(singleAsset.name).toLowerCase() == String(asset.name).toLowerCase() && singleAsset.asset != assetId) {
					nrDuplicates++;
				}
			});

			$("#asset_exchange_duplicates_warning").html($.t("asset_exchange_duplicates_warning", {
				"count": nrDuplicates
			}));

			if (Lm.DatabaseSupport) {
				Lm.SendRequest("getAsset", {
					"asset": assetId
				}, function(response) {
					if (!response.errorCode) {
						if (response.asset != asset.asset || response.account != asset.account || response.accountRS != asset.accountRS || response.decimals != asset.decimals || response.description != asset.description || response.name != asset.name || response.quantityQNT != asset.quantityQNT) {
							Lm.Database.delete("assets", [{
								"asset": asset.asset
							}], function() {
								setTimeout(function() {
									Lm.LoadPage("asset_exchange");
									$.growl("Invalid asset.", {
										"type": "danger"
									});
								}, 50);
							});
						}
					}
				});
			}

			if (asset.viewingAsset) {
				$("#asset_exchange_bookmark_this_asset").show();
				Lm.ViewingAsset = asset;
			} else {
				$("#asset_exchange_bookmark_this_asset").hide();
				Lm.ViewingAsset = false;
			}
		}

		if (Lm.AccountInfo.unconfirmedBalanceMilliLm == "0") {
			$("#your_lm_balance").html("0");
			$("#buy_automatic_price").addClass("zero").removeClass("nonzero");
		} else {
			$("#your_lm_balance").html(Lm.FormatAmount(Lm.AccountInfo.unconfirmedBalanceMilliLm));
			$("#buy_automatic_price").addClass("nonzero").removeClass("zero");
		}

		if (Lm.AccountInfo.unconfirmedAssetBalances) {
			for (var i = 0; i < Lm.AccountInfo.unconfirmedAssetBalances.length; i++) {
				var balance = Lm.AccountInfo.unconfirmedAssetBalances[i];

				if (balance.asset == assetId) {
					Lm.CurrentAsset.yourBalanceMilliLm = balance.unconfirmedBalanceQNT;
					$("#your_asset_balance").html(Lm.FormatQuantity(balance.unconfirmedBalanceQNT, Lm.CurrentAsset.decimals));
					if (balance.unconfirmedBalanceQNT == "0") {
						$("#sell_automatic_price").addClass("zero").removeClass("nonzero");
					} else {
						$("#sell_automatic_price").addClass("nonzero").removeClass("zero");
					}
					break;
				}
			}
		}

		if (!Lm.CurrentAsset.yourBalanceMilliLm) {
			Lm.CurrentAsset.yourBalanceMilliLm = "0";
			$("#your_asset_balance").html("0");
		}

		Lm.LoadAssetOrders("ask", assetId, refresh);
		Lm.LoadAssetOrders("bid", assetId, refresh);

		//todo Lm.CurrentSubPageID ??...
		Lm.SendRequest("getTrades+" + assetId, {
			"asset": assetId,
			"firstIndex": 0,
			"lastIndex": 50
		}, function(response, input) {
			if (response.trades && response.trades.length) {
				var trades = response.trades;

				var rows = "";

				for (var i = 0; i < trades.length; i++) {
					trades[i].priceMilliLm = new BigInteger(trades[i].priceMilliLm);
					trades[i].quantityQNT = new BigInteger(trades[i].quantityQNT);
					trades[i].totalMilliLm = new BigInteger(Lm.CalculateOrderTotalMilliLm(trades[i].priceMilliLm, trades[i].quantityQNT));

					rows += "<tr><td>" + Lm.FormatTimestamp(trades[i].timestamp) + "</td><td>" +
						Lm.FormatQuantity(trades[i].quantityQNT, Lm.CurrentAsset.decimals) + "</td>"+
						"<td class='asset_price'>" + Lm.FormatOrderPricePerWholeQNT(trades[i].priceMilliLm, Lm.CurrentAsset.decimals) + "</td>"+
						"<td>" + Lm.FormatAmount(trades[i].totalMilliLm) + "</td>"+
						"<td>" + String(trades[i].askOrder).escapeHTML() + "</td>"+
						"<td>" + String(trades[i].bidOrder).escapeHTML() + "</td></tr>";
				}

				$("#asset_exchange_trade_history_table tbody").empty().append(rows);
				Lm.DataLoadFinished($("#asset_exchange_trade_history_table"), !refresh);
			} else {
				$("#asset_exchange_trade_history_table tbody").empty();
				Lm.DataLoadFinished($("#asset_exchange_trade_history_table"), !refresh);
			}
		});
	}

	function LoadAssetOrders(type, assetId, refresh) {
		type = type.toLowerCase();

		Lm.SendRequest("get" + type.capitalize() + "Orders+" + assetId, {
			"asset": assetId,
			"timestamp": 0,
			"limit": 50
		}, function(response, input) {
			var orders = response[type + "Orders"];

			if (!orders) {
				orders = [];
			}

			if (Lm.UnconfirmedTransactions.length) {
				var added = false;

				for (var i = 0; i < Lm.UnconfirmedTransactions.length; i++) {
					var unconfirmedTransaction = Lm.UnconfirmedTransactions[i];
					unconfirmedTransaction.order = unconfirmedTransaction.transaction;

					if (unconfirmedTransaction.type == 2 && (type == "ask" ? unconfirmedTransaction.subtype == 2 : unconfirmedTransaction.subtype == 3) && unconfirmedTransaction.asset == assetId) {
						orders.push($.extend(true, {}, unconfirmedTransaction)); //make sure it's a deep copy
						added = true;
					}
				}

				if (added) {
					orders.sort(function(a, b) {
						if (type == "ask") {
							//lowest price at the top
							return new BigInteger(a.priceMilliLm).compareTo(new BigInteger(b.priceMilliLm));
						} else {
							//highest price at the top
							return new BigInteger(b.priceMilliLm).compareTo(new BigInteger(a.priceMilliLm));
						}
					});
				}
			}

			if (orders.length) {
				$("#" + (type == "ask" ? "sell" : "buy") + "_orders_count").html("(" + orders.length + (orders.length == 50 ? "+" : "") + ")");

				var rows = "";

				for (var i = 0; i < orders.length; i++) {
					var order = orders[i];

					order.priceMilliLm = new BigInteger(order.priceMilliLm);
					order.quantityQNT = new BigInteger(order.quantityQNT);
					order.totalMilliLm = new BigInteger(Lm.CalculateOrderTotalMilliLm(order.quantityQNT, order.priceMilliLm));

					if (i == 0 && !refresh) {
						$("#" + (type == "ask" ? "buy" : "sell") + "_asset_price").val(Lm.CalculateOrderPricePerWholeQNT(order.priceMilliLm, Lm.CurrentAsset.decimals));
					}

					var className = (order.account == Lm.Account ? "your-order" : "") + (order.unconfirmed ? " tentative" : (Lm.IsUserCancelledOrder(order) ? " tentative tentative-crossed" : ""));

					rows += "<tr class='" + className + "' data-transaction='" + String(order.order).escapeHTML() + "' data-quantity='" +
						order.quantityQNT.toString().escapeHTML() + "' data-price='" + order.priceMilliLm.toString().escapeHTML() + "'>"+
						"<td>" + (order.unconfirmed ? "You - <strong>Pending</strong>" :
							(order.account == Lm.Account ? "<strong>You</strong>" : "<a href='#' data-user='" + Lm.GetAccountFormatted(order, "account") +
							"' class='user_info'>" + (order.account == Lm.CurrentAsset.account ? "Asset Issuer" : Lm.GetAccountTitle(order, "account")) +
							"</a>")) + "</td>"+
						"<td>" + Lm.FormatQuantity(order.quantityQNT, Lm.CurrentAsset.decimals) + "</td>"+
						"<td>" + Lm.FormatOrderPricePerWholeQNT(order.priceMilliLm, Lm.CurrentAsset.decimals) + "</td>"+
						"<td>" + Lm.FormatAmount(order.totalMilliLm) + "</tr>";
				}

				$("#asset_exchange_" + type + "_orders_table tbody").empty().append(rows);
			} else {
				$("#asset_exchange_" + type + "_orders_table tbody").empty();
				if (!refresh) {
					$("#" + (type == "ask" ? "buy" : "sell") + "_asset_price").val("0");
				}
				$("#" + (type == "ask" ? "sell" : "buy") + "_orders_count").html("");
			}

			Lm.DataLoadFinished($("#asset_exchange_" + type + "_orders_table"), !refresh);
		});
	}

	function IsUserCancelledOrder(order) {
		if (Lm.UnconfirmedTransactions.length) {
			for (var i = 0; i < Lm.UnconfirmedTransactions.length; i++) {
				var unconfirmedTransaction = Lm.UnconfirmedTransactions[i];

				if (unconfirmedTransaction.type == 2 && (order.type == "ask" ? unconfirmedTransaction.subtype == 4 : unconfirmedTransaction.subtype == 5) && unconfirmedTransaction.attachment.order == order.order) {
					return true;
				}
			}
		}

		return false;
	}

	function AssetExchangeClearSearch_OnClick(e) {
		e.preventDefault();
		$("#asset_exchange_search input[name=q]").trigger("input");
	}

	function AssetExchangeSearchInput_OnInput(th, e) {
		var input = $.trim(th.val()).toLowerCase();

		if (!input) {
			Lm.AssetSearch = false;
			Lm.LoadAssetExchangeSidebar();
			$("#asset_exchange_clear_search").hide();
		} else {
			Lm.AssetSearch = [];

			if (/LMA\-/i.test(input)) {
				$.each(Lm.Assets, function(key, asset) {
					if (asset.accountRS.toLowerCase() == input || asset.accountRS.toLowerCase().indexOf(input) !== -1) {
						Lm.AssetSearch.push(asset.asset);
					}
				});
			} else {
				$.each(Lm.Assets, function(key, asset) {
					if (asset.account == input || asset.asset == input || asset.name.toLowerCase().indexOf(input) !== -1) {
						Lm.AssetSearch.push(asset.asset);
					}
				});
			}

			Lm.LoadAssetExchangeSidebar();
			$("#asset_exchange_clear_search").show();
			$("#asset_exchange_show_type").hide();
		}
	}

	$("#asset_exchange_clear_search").on("click", function() {
		$("#asset_exchange_search input[name=q]").val("");
		$("#asset_exchange_search").trigger("submit");
	});

	function BoxHeader_OnClick(th, e) {
		e.preventDefault();
		//Find the box parent        
		var box = th.parents(".box").first();
		//Find the body and the footer
		var bf = box.find(".box-body, .box-footer");
		if (!box.hasClass("collapsed-box")) {
			box.addClass("collapsed-box");
			th.find(".btn i.fa").removeClass("fa-minus").addClass("fa-plus");
			bf.slideUp();
		} else {
			box.removeClass("collapsed-box");
			bf.slideDown();
			th.find(".btn i.fa").removeClass("fa-plus").addClass("fa-minus");
		}
	}

	function AssetExchangeOrderTable_OnClick(e) {
		var $target = $(e.target);

		if ($target.prop("tagName").toLowerCase() == "a") {
			return;
		}

		var type = ($target.closest("table").attr("id") == "asset_exchange_bid_orders_table" ? "sell" : "buy");

		var $tr = $target.closest("tr");

		try {
			var priceMilliLm = new BigInteger(String($tr.data("price")));
			var quantityQNT = new BigInteger(String($tr.data("quantity")));
			var totalMilliLm = new BigInteger(Lm.CalculateOrderTotalMilliLm(quantityQNT, priceMilliLm));

			$("#" + type + "_asset_price").val(Lm.CalculateOrderPricePerWholeQNT(priceMilliLm, Lm.CurrentAsset.decimals));
			$("#" + type + "_asset_quantity").val(Lm.ConvertToQNTf(quantityQNT, Lm.CurrentAsset.decimals));
			$("#" + type + "_asset_total").val(Lm.ConvertToLm(totalMilliLm));
		} catch (err) {
			return;
		}

		if (type == "sell") {
			try {
				var balanceMilliLm = new BigInteger(Lm.AccountInfo.unconfirmedBalanceMilliLm);
			} catch (err) {
				return;
			}

			if (totalMilliLm.compareTo(balanceMilliLm) > 0) {
				$("#" + type + "_asset_total").css({
					"background": "#ED4348",
					"color": "white"
				});
			} else {
				$("#" + type + "_asset_total").css({
					"background": "",
					"color": ""
				});
			}
		}

		var box = $("#" + type + "_asset_box");

		if (box.hasClass("collapsed-box")) {
			box.removeClass("collapsed-box");
			box.find(".box-body").slideDown();
		}
	}

	function AutomaticPrice_OnClick(th, e) {
		try {
			var type = (th.attr("id") == "sell_automatic_price" ? "sell" : "buy");

			var price = new Big(Lm.ConvertToMilliLm(String($("#" + type + "_asset_price").val())));
			var balance = new Big(type == "buy" ? Lm.AccountInfo.unconfirmedBalanceMilliLm : Lm.CurrentAsset.yourBalanceMilliLm);
			var balanceMilliLm = new Big(Lm.AccountInfo.unconfirmedBalanceMilliLm);
			var maxQuantity = new Big(Lm.ConvertToQNTf(Lm.CurrentAsset.quantityQNT, Lm.CurrentAsset.decimals));

			if (balance.cmp(new Big("0")) <= 0) {
				return;
			}

			if (price.cmp(new Big("0")) <= 0) {
				//get minimum price if no offers exist, based on asset decimals..
				price = new Big("" + Math.pow(10, Lm.CurrentAsset.decimals));
				$("#" + type + "_asset_price").val(Lm.ConvertToLm(price.toString()));
			}

			var quantity = new Big(Lm.AmountToPrecision((type == "sell" ? balanceMilliLm : balance).div(price).toString(), Lm.CurrentAsset.decimals));

			var total = quantity.times(price);

			//proposed quantity is bigger than available quantity
			if (quantity.cmp(maxQuantity) == 1) {
				quantity = maxQuantity;
				total = quantity.times(price);
			}

			if (type == "sell") {
				var maxUserQuantity = new Big(Lm.ConvertToQNTf(balance, Lm.CurrentAsset.decimals));
				if (quantity.cmp(maxUserQuantity) == 1) {
					quantity = maxUserQuantity;
					total = quantity.times(price);
				}
			}

			$("#" + type + "_asset_quantity").val(quantity.toString());
			$("#" + type + "_asset_total").val(Lm.ConvertToLm(total.toString()));

			$("#" + type + "_asset_total").css({
				"background": "",
				"color": ""
			});
		} catch (err) {}
	}

	function IsControlKey(charCode) {
		if (charCode >= 32)
			return false;
		if (charCode == 10)
			return false;
		if (charCode == 13)
			return false;

		return true;
	}

	function Asset_OnKeyDown(th, e) {
		var charCode = !e.charCode ? e.which : e.charCode;

		if (IsControlKey(charCode) || e.ctrlKey || e.metaKey) {
			return;
		}

		var isQuantityField = /_quantity/i.test(th.attr("id"));

		var maxFractionLength = (isQuantityField ? Lm.CurrentAsset.decimals : 8 - Lm.CurrentAsset.decimals);

		if (maxFractionLength) {
			//allow 1 single period character
			if (charCode == 110 || charCode == 190) {
				if (th.val().indexOf(".") != -1) {
					e.preventDefault();
					return false;
				} else {
					return;
				}
			}
		} else {
			//do not allow period
			if (charCode == 110 || charCode == 190 || charCode == 188) {
				$.growl($.t("error_fractions"), {
					"type": "danger"
				});
				e.preventDefault();
				return false;
			}
		}

		var input = th.val() + String.fromCharCode(charCode);

		var afterComma = input.match(/\.(\d*)$/);

		//only allow as many as there are decimals allowed..
		if (afterComma && afterComma[1].length > maxFractionLength) {
			var selectedText = Lm.GetSelectedText();

			if (selectedText != th.val()) {
				var errorMessage;

				if (isQuantityField) {
					errorMessage = $.t("error_asset_decimals", {
						"count": (0 + Lm.CurrentAsset.decimals)
					});
				} else {
					errorMessage = $.t("error_decimals", {
						"count": (8 - Lm.CurrentAsset.decimals)
					});
				}

				$.growl(errorMessage, {
					"type": "danger"
				});

				e.preventDefault();
				return false;
			}
		}

		//numeric characters, left/right key, backspace, delete
		if (charCode == 8 || charCode == 37 || charCode == 39 || charCode == 46 || (charCode >= 48 && charCode <= 57 && !isNaN(String.fromCharCode(charCode))) || (charCode >= 96 && charCode <= 105)) {
			return;
		} else {
			//comma
			if (charCode == 188) {
				$.growl($.t("error_comma_not_allowed"), {
					"type": "danger"
				});
			}
			e.preventDefault();
			return false;
		}
	}

	//calculate preview price (calculated on every keypress)
	function AssetPrice_OnKeyUp(th, e) {
		var orderType = th.data("type").toLowerCase();

		try {
			var quantityQNT = new BigInteger(Lm.ConvertToQNT(String($("#" + orderType + "_asset_quantity").val()), Lm.CurrentAsset.decimals));
			var priceMilliLm = new BigInteger(Lm.CalculatePricePerWholeQNT(Lm.ConvertToMilliLm(String($("#" + orderType + "_asset_price").val())), Lm.CurrentAsset.decimals));

			if (priceMilliLm.toString() == "0" || quantityQNT.toString() == "0") {
				$("#" + orderType + "_asset_total").val("0");
			} else {
				var total = Lm.CalculateOrderTotal(quantityQNT, priceMilliLm, Lm.CurrentAsset.decimals);
				$("#" + orderType + "_asset_total").val(total.toString());
			}
		} catch (err) {
			$("#" + orderType + "_asset_total").val("0");
		}
	}

	function AssetOrderModal_OnShow(th, e) {
		var $invoker = $(e.relatedTarget);

		var orderType = $invoker.data("type");
		var assetId = $invoker.data("asset");

		$("#asset_order_modal_button").html(orderType + " Asset").data("resetText", orderType + " Asset");

		orderType = orderType.toLowerCase();

		try {
			//TODO
			var quantity = String($("#" + orderType + "_asset_quantity").val());
			var quantityQNT = new BigInteger(Lm.ConvertToQNT(quantity, Lm.CurrentAsset.decimals));
			var priceMilliLm = new BigInteger(Lm.CalculatePricePerWholeQNT(Lm.ConvertToMilliLm(String($("#" + orderType + "_asset_price").val())), Lm.CurrentAsset.decimals));
			var feeMilliLm = new BigInteger(Lm.ConvertToMilliLm(String($("#" + orderType + "_asset_fee").val())));
			var totalLm = Lm.FormatAmount(Lm.CalculateOrderTotalMilliLm(quantityQNT, priceMilliLm, Lm.CurrentAsset.decimals), false, true);
		} catch (err) {
			$.growl("Invalid input.", {
				"type": "danger"
			});
			return e.preventDefault();
		}

		if (priceMilliLm.toString() == "0" || quantityQNT.toString() == "0") {
			$.growl($.t("error_amount_price_required"), {
				"type": "danger"
			});
			return e.preventDefault();
		}

		if (feeMilliLm.toString() == "0") {
			feeMilliLm = new BigInteger("100000000");
		}

		var priceMilliLmPerWholeQNT = priceMilliLm.multiply(new BigInteger("" + Math.pow(10, Lm.CurrentAsset.decimals)));

		if (orderType == "buy") {
			var description = $.t("buy_order_description", {
				"quantity": Lm.FormatQuantity(quantityQNT, Lm.CurrentAsset.decimals, true),
				"asset_name": $("#asset_name").html().escapeHTML(),
				"lm": Lm.FormatAmount(priceMilliLmPerWholeQNT)
			});
			var tooltipTitle = $.t("buy_order_description_help", {
				"lm": Lm.FormatAmount(priceMilliLmPerWholeQNT, false, true),
				"total_lm": totalLm
			});
		} else {
			var description = $.t("sell_order_description", {
				"quantity": Lm.FormatQuantity(quantityQNT, Lm.CurrentAsset.decimals, true),
				"asset_name": $("#asset_name").html().escapeHTML(),
				"lm": Lm.FormatAmount(priceMilliLmPerWholeQNT)
			});
			var tooltipTitle = $.t("sell_order_description_help", {
				"lm": Lm.FormatAmount(priceMilliLmPerWholeQNT, false, true),
				"total_lm": totalLm
			});
		}

		$("#asset_order_description").html(description);
		$("#asset_order_total").html(totalLm + " Lm");
		$("#asset_order_fee_paid").html(Lm.FormatAmount(feeMilliLm) + " Lm");

		if (quantity != "1") {
			$("#asset_order_total_tooltip").show();
			$("#asset_order_total_tooltip").popover("destroy");
			$("#asset_order_total_tooltip").data("content", tooltipTitle);
			$("#asset_order_total_tooltip").popover({
				"content": tooltipTitle,
				"trigger": "hover"
			});
		} else {
			$("#asset_order_total_tooltip").hide();
		}

		$("#asset_order_type").val((orderType == "buy" ? "placeBidOrder" : "placeAskOrder"));
		$("#asset_order_asset").val(assetId);
		$("#asset_order_quantity").val(quantityQNT.toString());
		$("#asset_order_price").val(priceMilliLm.toString());
		$("#asset_order_fee").val(feeMilliLm.toString());
	}

	function OrderAssetForm($modal) {
		var orderType = $("#asset_order_type").val();

		return {
			"requestType": orderType,
			"successMessage": (orderType == "placeBidOrder" ? $.t("success_buy_order_asset") : $.t("success_sell_order_asset")),
			"errorMessage": $.t("error_order_asset")
		};
	}

	function OrderAssetCompleteForm(response, data) {
		if (response.alreadyProcessed) {
			return;
		}

		if (data.requestType == "placeBidOrder") {
			var $table = $("#asset_exchange_bid_orders_table tbody");
		} else {
			var $table = $("#asset_exchange_ask_orders_table tbody");
		}

		if ($table.find("tr[data-transaction='" + String(response.transaction).escapeHTML() + "']").length) {
			return;
		}

		var $rows = $table.find("tr");

		data.quantityQNT = new BigInteger(data.quantityQNT);
		data.priceMilliLm = new BigInteger(data.priceMilliLm);
		data.totalMilliLm = new BigInteger(Lm.CalculateOrderTotalMilliLm(data.quantityQNT, data.priceMilliLm));

		var rowToAdd = "<tr class='tentative' data-transaction='" + String(response.transaction).escapeHTML() + "' data-quantity='" +
			data.quantityQNT.toString().escapeHTML() + "' data-price='" + data.priceMilliLm.toString().escapeHTML() + "'>"+
			"<td>You - <strong>Pending</strong></td>"+
			"<td>" + Lm.FormatQuantity(data.quantityQNT, Lm.CurrentAsset.decimals) + "</td>"+
			"<td>" + Lm.FormatOrderPricePerWholeQNT(data.priceMilliLm, Lm.CurrentAsset.decimals) + "</td>"+
			"<td>" + Lm.FormatAmount(data.totalMilliLm) + "</td></tr>";

		var rowAdded = false;

		if ($rows.length) {
			$rows.each(function() {
				var rowPrice = new BigInteger(String($(this).data("price")));

				if (data.requestType == "placeBidOrder" && data.priceMilliLm.compareTo(rowPrice) > 0) {
					$(this).before(rowToAdd);
					rowAdded = true;
					return false;
				} else if (data.requestType == "placeAskOrder" && data.priceMilliLm.compareTo(rowPrice) < 0) {
					$(this).before(rowToAdd);
					rowAdded = true;
					return false;
				}
			});
		}

		if (!rowAdded) {
			$table.append(rowToAdd);
			$table.parent().parent().removeClass("data-empty").parent().addClass("no-padding");
		}
	}

	function IssueAssetForm($modal) {
		var data = Lm.GetFormData($modal.find("form:first"));

		data.description = $.trim(data.description);

		if (!data.description) {
			return {
				"error": $.t("error_description_required")
			};
		} else if (!/^\d+$/.test(data.quantity)) {
			return {
				"error": $.t("error_whole_quantity")
			};
		} else {
			data.quantityQNT = String(data.quantity);

			if (data.decimals > 0) {
				for (var i = 0; i < data.decimals; i++) {
					data.quantityQNT += "0";
				}
			}

			delete data.quantity;

			return {
				"data": data
			};
		}
	}

	function AssetExchangeSidebarGroupContext_OnClick(th, e) {
		e.preventDefault();

		var groupName = Lm.SelectedContext.data("groupname");
		var option = th.data("option");

		if (option == "change_group_name") {
			$("#asset_exchange_change_group_name_old_display").html(groupName.escapeHTML());
			$("#asset_exchange_change_group_name_old").val(groupName);
			$("#asset_exchange_change_group_name_new").val("");
			$("#asset_exchange_change_group_name_modal").modal("show");
		}
	}

	function AssetExchangeChangeGroupNameForm($modal) {
		var oldGroupName = $("#asset_exchange_change_group_name_old").val();
		var newGroupName = $("#asset_exchange_change_group_name_new").val();

		if (!newGroupName.match(/^[a-z0-9 ]+$/i)) {
			return {
				"error": $.t("error_group_name")
			};
		}

		Lm.Database.update("assets", {
			"groupName": newGroupName
		}, [{
			"groupName": oldGroupName
		}], function() {
			setTimeout(function() {
				Lm.LoadPage("asset_exchange");
				$.growl($.t("success_group_name_update"), {
					"type": "success"
				});
			}, 50);
		});

		return {
			"stop": true
		};
	}

	function AssetExchangeSidebarContext_OnClick(th, e) {
		e.preventDefault();

		var assetId = Lm.SelectedContext.data("asset");
		var option = th.data("option");

		Lm.CloseContextMenu();

		if (option == "add_to_group") {
			$("#asset_exchange_group_asset").val(assetId);

			Lm.Database.select("assets", [{
				"asset": assetId
			}], function(error, asset) {
				asset = asset[0];

				$("#asset_exchange_group_title").html(String(asset.name).escapeHTML());

				Lm.Database.select("assets", [], function(error, assets) {
					//Lm.Database.execute("SELECT DISTINCT groupName FROM assets", [], function(groupNames) {					
					var groupNames = [];

					$.each(assets, function(index, asset) {
						if (asset.groupName && $.inArray(asset.groupName, groupNames) == -1) {
							groupNames.push(asset.groupName);
						}
					});

					assets = [];

					groupNames.sort(function(a, b) {
						if (a.toLowerCase() > b.toLowerCase()) {
							return 1;
						} else if (a.toLowerCase() < b.toLowerCase()) {
							return -1;
						} else {
							return 0;
						}
					});

					var groupSelect = $("#asset_exchange_group_group");

					groupSelect.empty();

					$.each(groupNames, function(index, groupName) {
						groupSelect.append("<option value='" + groupName.escapeHTML() + "'" + (asset.groupName && asset.groupName.toLowerCase() == groupName.toLowerCase() ? " selected='selected'" : "") + ">" + groupName.escapeHTML() + "</option>");
					});

					groupSelect.append("<option value='0'" + (!asset.groupName ? " selected='selected'" : "") + ">None</option>");
					groupSelect.append("<option value='-1'>New group</option>");

					$("#asset_exchange_group_modal").modal("show");
				});
			});
		} else if (option == "remove_from_group") {
			Lm.Database.update("assets", {
				"groupName": ""
			}, [{
				"asset": assetId
			}], function() {
				setTimeout(function() {
					Lm.LoadPage("asset_exchange");
					$.growl($.t("success_asset_group_removal"), {
						"type": "success"
					});
				}, 50);
			});
		} else if (option == "remove_from_bookmarks") {
			var ownsAsset = false;

			if (Lm.AccountInfo.unconfirmedAssetBalances) {
				$.each(Lm.AccountInfo.unconfirmedAssetBalances, function(key, assetBalance) {
					if (assetBalance.asset == assetId) {
						ownsAsset = true;
						return false;
					}
				});
			}

			if (ownsAsset) {
				$.growl($.t("error_owned_asset_no_removal"), {
					"type": "danger"
				});
			} else {
				//todo save delteed asset ids from accountissuers
				Lm.Database.delete("assets", [{
					"asset": assetId
				}], function(error, affected) {
					setTimeout(function() {
						Lm.LoadPage("asset_exchange");
						$.growl($.t("success_asset_bookmark_removal"), {
							"type": "success"
						});
					}, 50);
				});
			}
		}
	}

	function AssetExchangeGroupGroup_OnChange(th) {
		var value = th.val();

		if (value == -1) {
			$("#asset_exchange_group_new_group_div").show();
		} else {
			$("#asset_exchange_group_new_group_div").hide();
		}
	}

	function AssetExchangeGroupForm($modal) {
		var assetId = $("#asset_exchange_group_asset").val();
		var groupName = $("#asset_exchange_group_group").val();

		if (groupName == 0) {
			groupName = "";
		} else if (groupName == -1) {
			groupName = $("#asset_exchange_group_new_group").val();
		}

		Lm.Database.update("assets", {
			"groupName": groupName
		}, [{
			"asset": assetId
		}], function() {
			setTimeout(function() {
				Lm.LoadPage("asset_exchange");
				if (!groupName) {
					$.growl($.t("success_asset_group_removal"), {
						"type": "success"
					});
				} else {
					$.growl($.t("sucess_asset_group_add"), {
						"type": "success"
					});
				}
			}, 50);
		});

		return {
			"stop": true
		};
	}

	$("#asset_exchange_group_modal").on("hidden.bs.modal", function(e) {
		$("#asset_exchange_group_new_group_div").val("").hide();
	});

	/* MY ASSETS PAGE */
	function MyAssetsPage() {
		if (Lm.AccountInfo.assetBalances && Lm.AccountInfo.assetBalances.length) {
			var result = {
				"assets": [],
				"bid_orders": {},
				"ask_orders": {}
			};
			var count = {
				"total_assets": Lm.AccountInfo.assetBalances.length,
				"assets": 0,
				"ignored_assets": 0,
				"ask_orders": 0,
				"bid_orders": 0
			};

			for (var i = 0; i < Lm.AccountInfo.assetBalances.length; i++) {
				if (Lm.AccountInfo.assetBalances[i].balanceQNT == "0") {
					count.ignored_assets++;
					if (Lm.CheckMyAssetsPageLoaded(count)) {
						Lm.MyAssetsPageLoaded(result);
					}
					continue;
				}

				Lm.SendRequest("getAskOrderIds+", {
					"asset": Lm.AccountInfo.assetBalances[i].asset,
					"limit": 1,
					"timestamp": 0
				}, function(response, input) {
					if (Lm.CurrentPage != "my_assets") {
						return;
					}

					if (response.askOrderIds && response.askOrderIds.length) {
						Lm.SendRequest("getAskOrder+", {
							"order": response.askOrderIds[0],
							"_extra": {
								"asset": input.asset
							}
						}, function(response, input) {
							if (Lm.CurrentPage != "my_assets") {
								return;
							}

							response.priceMilliLm = new BigInteger(response.priceMilliLm);

							result.ask_orders[input["_extra"].asset] = response.priceMilliLm;
							count.ask_orders++;
							if (Lm.CheckMyAssetsPageLoaded(count)) {
								Lm.MyAssetsPageLoaded(result);
							}
						});
					} else {
						result.ask_orders[input.asset] = -1;
						count.ask_orders++;
						if (Lm.CheckMyAssetsPageLoaded(count)) {
							Lm.MyAssetsPageLoaded(result);
						}
					}
				});

				Lm.SendRequest("getBidOrderIds+", {
					"asset": Lm.AccountInfo.assetBalances[i].asset,
					"limit": 1,
					"timestamp": 0
				}, function(response, input) {
					if (Lm.CurrentPage != "my_assets") {
						return;
					}

					if (response.bidOrderIds && response.bidOrderIds.length) {
						Lm.SendRequest("getBidOrder+", {
							"order": response.bidOrderIds[0],
							"_extra": {
								"asset": input.asset
							}
						}, function(response, input) {
							if (Lm.CurrentPage != "my_assets") {
								return;
							}

							response.priceMilliLm = new BigInteger(response.priceMilliLm);

							result.bid_orders[input["_extra"].asset] = response.priceMilliLm;
							count.bid_orders++;
							if (Lm.CheckMyAssetsPageLoaded(count)) {
								Lm.MyAssetsPageLoaded(result);
							}
						});
					} else {
						result.bid_orders[input.asset] = -1;
						count.bid_orders++;
						if (Lm.CheckMyAssetsPageLoaded(count)) {
							Lm.MyAssetsPageLoaded(result);
						}
					}
				});

				Lm.SendRequest("getAsset+", {
					"asset": Lm.AccountInfo.assetBalances[i].asset,
					"_extra": {
						"balanceQNT": Lm.AccountInfo.assetBalances[i].balanceQNT
					}
				}, function(asset, input) {
					if (Lm.CurrentPage != "my_assets") {
						return;
					}

					asset.asset = input.asset;
					asset.balanceQNT = new BigInteger(input["_extra"].balanceQNT);
					asset.quantityQNT = new BigInteger(asset.quantityQNT);

					result.assets[count.assets] = asset;
					count.assets++;

					if (Lm.CheckMyAssetsPageLoaded(count)) {
						Lm.MyAssetsPageLoaded(result);
					}
				});
			}
		} else {
			Lm.DataLoaded();
		}
	}

	function CheckMyAssetsPageLoaded(count) {
		if ((count.assets + count.ignored_assets == count.total_assets) && (count.assets == count.ask_orders) && (count.assets == count.bid_orders)) {
			return true;
		} else {
			return false;
		}
	}

	function MyAssetsPageLoaded(result) {
		var rows = "";

		result.assets.sort(function(a, b) {
			if (a.name.toLowerCase() > b.name.toLowerCase()) {
				return 1;
			} else if (a.name.toLowerCase() < b.name.toLowerCase()) {
				return -1;
			} else {
				return 0;
			}
		});

		for (var i = 0; i < result.assets.length; i++) {
			var asset = result.assets[i];

			var lowestAskOrder = result.ask_orders[asset.asset];
			var highestBidOrder = result.bid_orders[asset.asset];

			var percentageAsset = Lm.CalculatePercentage(asset.balanceQNT, asset.quantityQNT);

			if (highestBidOrder != -1) {
				var total = new BigInteger(Lm.CalculateOrderTotalMilliLm(asset.balanceQNT, highestBidOrder, asset.decimals));
			} else {
				var total = 0;
			}

			var tentative = -1;

			if (Lm.UnconfirmedTransactions.length) {
				for (var j = 0; j < Lm.UnconfirmedTransactions.length; j++) {
					var unconfirmedTransaction = Lm.UnconfirmedTransactions[j];

					if (unconfirmedTransaction.type == 2 && unconfirmedTransaction.subtype == 1 && unconfirmedTransaction.attachment.asset == asset.asset) {
						if (tentative == -1) {
							if (unconfirmedTransaction.recipient == Lm.Account) {
								tentative = new BigInteger(unconfirmedTransaction.attachment.quantityQNT);
							} else {
								tentative = new BigInteger("-" + unconfirmedTransaction.attachment.quantityQNT);
							}
						} else {
							if (unconfirmedTransaction.recipient == Lm.Account) {
								tentative = tentative.add(new BigInteger(unconfirmedTransaction.attachment.quantityQNT));
							} else {
								tentative = tentative.add(new BigInteger("-" + unconfirmedTransaction.attachment.quantityQNT));
							}
						}
					}
				}
			}

			if (highestBidOrder != -1) {
				var totalMilliLm = new BigInteger(Lm.CalculateOrderTotalMilliLm(asset.balanceQNT, highestBidOrder));
			}

			var sign = "+";

			if (tentative != -1 && tentative.compareTo(BigInteger.ZERO) < 0) {
				tentative = tentative.abs();
				sign = "-";
			}

			rows += "<tr" + (tentative != -1 ? " class='tentative tentative-allow-links'" : "") + " data-asset='" + String(asset.asset).escapeHTML() + "'>"+
			"<td><a href='#' data-goto-asset='" + String(asset.asset).escapeHTML() + "'>" + String(asset.name).escapeHTML() + "</a></td>"+
			"<td class='quantity'>" + Lm.FormatQuantity(asset.balanceQNT, asset.decimals) + (tentative != -1 ? " " + sign +
				" <span class='added_quantity'>" + Lm.FormatQuantity(tentative, asset.decimals) + "</span>" : "") + "</td>"+
			"<td>" + Lm.FormatQuantity(asset.quantityQNT, asset.decimals) + "</td>"+
			"<td>" + percentageAsset + "%</td>"+
			"<td>" + (lowestAskOrder != -1 ? Lm.FormatOrderPricePerWholeQNT(lowestAskOrder, asset.decimals) : "/") + "</td>"+
			"<td>" + (highestBidOrder != -1 ? Lm.FormatOrderPricePerWholeQNT(highestBidOrder, asset.decimals) : "/") + "</td>"+
			"<td>" + (highestBidOrder != -1 ? Lm.FormatAmount(totalMilliLm) : "/") + "</td>"+
			"<td><a href='#' data-toggle='modal' data-target='#transfer_asset_modal' data-asset='" + String(asset.asset).escapeHTML() +
			"' data-name='" + String(asset.name).escapeHTML() + "' data-decimals='" + String(asset.decimals).escapeHTML() + "'>" +
			$.t("transfer") + "</a></td></tr>";
		}

		Lm.DataLoaded(rows);
	}

	function MyAssetsIncoming() {
		Lm.LoadPage("my_assets");
	}

	function TransferAssetModal_OnShow(e) {
		var $invoker = $(e.relatedTarget);

		var assetId = $invoker.data("asset");
		var assetName = $invoker.data("name");
		var decimals = $invoker.data("decimals");

		$("#transfer_asset_asset").val(assetId);
		$("#transfer_asset_decimals").val(decimals);
		$("#transfer_asset_name, #transfer_asset_quantity_name").html(String(assetName).escapeHTML());
		$("#transer_asset_available").html("");

		var confirmedBalance = 0;
		var unconfirmedBalance = 0;

		if (Lm.AccountInfo.assetBalances) {
			$.each(Lm.AccountInfo.assetBalances, function(key, assetBalance) {
				if (assetBalance.asset == assetId) {
					confirmedBalance = assetBalance.balanceQNT;
					return false;
				}
			});
		}

		if (Lm.AccountInfo.unconfirmedAssetBalances) {
			$.each(Lm.AccountInfo.unconfirmedAssetBalances, function(key, assetBalance) {
				if (assetBalance.asset == assetId) {
					unconfirmedBalance = assetBalance.unconfirmedBalanceQNT;
					return false;
				}
			});
		}

		var availableAssetsMessage = "";

		if (confirmedBalance == unconfirmedBalance) {
			availableAssetsMessage = " - " + $.t("available_for_transfer", {
				"qty": Lm.FormatQuantity(confirmedBalance, decimals)
			});
		} else {
			availableAssetsMessage = " - " + $.t("available_for_transfer", {
				"qty": Lm.FormatQuantity(unconfirmedBalance, decimals)
			}) + " (" + Lm.FormatQuantity(confirmedBalance, decimals) + " " + $.t("total_lowercase") + ")";
		}

		$("#transfer_asset_available").html(availableAssetsMessage);
	}

	function TransferAssetForm($modal) {
		var data = Lm.GetFormData($modal.find("form:first"));

		if (!data.quantity) {
			return {
				"error": $.t("error_not_specified", {
					"name": Lm.GetTranslatedFieldName("quantity").toLowerCase()
				}).capitalize()
			};
		}

		if (!Lm.ShowedFormWarning) {
			if (Lm.Settings["asset_transfer_warning"] && Lm.Settings["asset_transfer_warning"] != 0) {
				if (new Big(data.quantity).cmp(new Big(Lm.Settings["asset_transfer_warning"])) > 0) {
					Lm.ShowedFormWarning = true;
					return {
						"error": $.t("error_max_asset_transfer_warning", {
							"qty": String(Lm.Settings["asset_transfer_warning"]).escapeHTML()
						})
					};
				}
			}
		}

		try {
			data.quantityQNT = Lm.ConvertToQNT(data.quantity, data.decimals);
		} catch (e) {
			return {
				"error": $.t("error_incorrect_quantity_plus", {
					"err": e.escapeHTML()
				})
			};
		}

		delete data.quantity;
		delete data.decimals;

		if (!data.add_message) {
			delete data.add_message;
			delete data.message;
			delete data.encrypt_message;
		}

		return {
			"data": data
		};
	}

	function TransferAssetCompleteForm(response, data) {
		Lm.LoadPage("my_assets");
	}

	function Body_OnClick(th, e) {
		e.preventDefault();

		var $visible_modal = $(".modal.in");

		if ($visible_modal.length) {
			$visible_modal.modal("hide");
		}

		Lm.GoToAsset(th.data("goto-asset"));
	}

	function GoToAsset(asset) {
		Lm.AssetSearch = false;
		$("#asset_exchange_sidebar_search input[name=q]").val("");
		$("#asset_exchange_clear_search").hide();

		$("#asset_exchange_sidebar a.list-group-item.active").removeClass("active");
		$("#no_asset_selected, #asset_details, #no_assets_available, #no_asset_search_results").hide();
		$("#loading_asset_data").show();

		$("ul.sidebar-menu a[data-page=asset_exchange]").last().trigger("click", [{
			callback: function() {
				var assetLink = $("#asset_exchange_sidebar a[data-asset=" + asset + "]");

				if (assetLink.length) {
					assetLink.click();
				} else {
					Lm.SendRequest("getAsset", {
						"asset": asset
					}, function(response) {
						if (!response.errorCode) {
							Lm.LoadAssetExchangeSidebar(function() {
								response.groupName = "";
								response.viewingAsset = true;
								Lm.LoadAsset(response);
							});
						} else {
							$.growl($.t("error_asset_not_found"), {
								"type": "danger"
							});
						}
					});
				}
			}
		}]);
	}

	/* OPEN ORDERS PAGE */
	function OpenOrdersPage() {
		var loaded = 0;

		Lm.GetOpenOrders("ask", function() {
			loaded++;
			if (loaded == 2) {
				Lm.PageLoaded();
			}
		});

		Lm.GetOpenOrders("bid", function() {
			loaded++;
			if (loaded == 2) {
				Lm.PageLoaded();
			}
		});
	}

	function GetOpenOrders(type, callback) {
		var uppercase = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
		var lowercase = type.toLowerCase();

		var getCurrentOrderIds = "getAccountCurrent" + uppercase + "OrderIds+";
		var orderIds = lowercase + "OrderIds";
		var getOrder = "get" + uppercase + "Order+";

		var orders = [];

		Lm.SendRequest(getCurrentOrderIds, {
			"account": Lm.Account,
			"timestamp": 0
		}, function(response) {
			if (response[orderIds] && response[orderIds].length) {
				var nr_orders = 0;

				for (var i = 0; i < response[orderIds].length; i++) {
					Lm.SendRequest(getOrder, {
						"order": response[orderIds][i]
					}, function(order, input) {
						if (Lm.CurrentPage != "open_orders") {
							return;
						}

						order.order = input.order;
						orders.push(order);

						nr_orders++;

						if (nr_orders == response[orderIds].length) {
							var nr_orders_complete = 0;

							for (var i = 0; i < nr_orders; i++) {
								var order = orders[i];

								Lm.SendRequest("getAsset+", {
									"asset": order.asset,
									"_extra": {
										"id": i
									}
								}, function(asset, input) {
									if (Lm.CurrentPage != "open_orders") {
										return;
									}

									orders[input["_extra"].id].assetName = asset.name;
									orders[input["_extra"].id].decimals = asset.decimals;

									nr_orders_complete++;

									if (nr_orders_complete == nr_orders) {
										Lm.GetUnconfirmedOrders(type, function(unconfirmedOrders) {
											Lm.OpenOrdersLoaded(orders.concat(unconfirmedOrders), lowercase, callback);
										});
									}
								});

								if (Lm.CurrentPage != "open_orders") {
									return;
								}
							}
						}
					});

					if (Lm.CurrentPage != "open_orders") {
						return;
					}
				}
			} else {
				Lm.GetUnconfirmedOrders(type, function(unconfirmedOrders) {
					Lm.OpenOrdersLoaded(unconfirmedOrders, lowercase, callback);
				});
			}
		});
	}

	function GetUnconfirmedOrders(type, callback) {
		if (Lm.UnconfirmedTransactions.length) {
			var unconfirmedOrders = [];

			for (var i = 0; i < Lm.UnconfirmedTransactions.length; i++) {
				var unconfirmedTransaction = Lm.UnconfirmedTransactions[i];

				if (unconfirmedTransaction.type == 2 && unconfirmedTransaction.subtype == (type == "ask" ? 2 : 3)) {
					unconfirmedOrders.push({
						"account": unconfirmedTransaction.sender,
						"asset": unconfirmedTransaction.attachment.asset,
						"assetName": "",
						"decimals": 0,
						"height": 0,
						"order": unconfirmedTransaction.transaction,
						"priceMilliLm": unconfirmedTransaction.attachment.priceMilliLm,
						"quantityQNT": unconfirmedTransaction.attachment.quantityQNT,
						"tentative": true
					})
				}
			}

			if (unconfirmedOrders.length == 0) {
				callback([]);
			} else {
				var nr_orders = 0;

				for (var i = 0; i < unconfirmedOrders.length; i++) {
					Lm.SendRequest("getAsset+", {
						"asset": unconfirmedOrders[i].asset,
						"_extra": {
							"id": i
						}
					}, function(asset, input) {
						unconfirmedOrders[input["_extra"].id].assetName = asset.name;
						unconfirmedOrders[input["_extra"].id].decimals = asset.decimals;

						nr_orders++;

						if (nr_orders == unconfirmedOrders.length) {
							callback(unconfirmedOrders);
						}
					});
				}
			}
		} else {
			callback([]);
		}
	}

	function OpenOrdersLoaded(orders, type, callback) {
		if (!orders.length) {
			$("#open_" + type + "_orders_table tbody").empty();
			Lm.DataLoadFinished($("#open_" + type + "_orders_table"));

			callback();

			return;
		}

		orders.sort(function(a, b) {
			if (a.assetName.toLowerCase() > b.assetName.toLowerCase()) {
				return 1;
			} else if (a.assetName.toLowerCase() < b.assetName.toLowerCase()) {
				return -1;
			} else {
				if (a.quantity * a.price > b.quantity * b.price) {
					return 1;
				} else if (a.quantity * a.price < b.quantity * b.price) {
					return -1;
				} else {
					return 0;
				}
			}
		});

		var rows = "";

		for (var i = 0; i < orders.length; i++) {
			var completeOrder = orders[i];

			var cancelled = false;

			if (Lm.UnconfirmedTransactions.length) {
				for (var j = 0; j < Lm.UnconfirmedTransactions.length; j++) {
					var unconfirmedTransaction = Lm.UnconfirmedTransactions[j];

					if (unconfirmedTransaction.type == 2 && unconfirmedTransaction.subtype == (type == "ask" ? 4 : 5) && unconfirmedTransaction.attachment.order == completeOrder.order) {
						cancelled = true;
						break;
					}
				}
			}

			completeOrder.priceMilliLm = new BigInteger(completeOrder.priceMilliLm);
			completeOrder.quantityQNT = new BigInteger(completeOrder.quantityQNT);
			completeOrder.totalMilliLm = new BigInteger(Lm.CalculateOrderTotalMilliLm(completeOrder.quantityQNT, completeOrder.priceMilliLm));

			rows += "<tr data-order='" + String(completeOrder.order).escapeHTML() + "'" +
				(cancelled ? " class='tentative tentative-crossed'" : (completeOrder.tentative ? " class='tentative'" : "")) + ">"+
				"<td><a href='#' data-goto-asset='" + String(completeOrder.asset).escapeHTML() + "'>" + completeOrder.assetName.escapeHTML() + "</a></td>"+
				"<td>" + Lm.FormatQuantity(completeOrder.quantityQNT, completeOrder.decimals) + "</td>"+
				"<td>" + Lm.FormatOrderPricePerWholeQNT(completeOrder.priceMilliLm, completeOrder.decimals) + "</td>"+
				"<td>" + Lm.FormatAmount(completeOrder.totalMilliLm) + "</td>"+
				"<td class='cancel'>" + (cancelled || completeOrder.tentative ? "/" :
					"<a href='#' data-toggle='modal' data-target='#cancel_order_modal' data-order='" + String(completeOrder.order).escapeHTML() +
					"' data-type='" + type + "'>" + $.t("cancel") + "</a>") + "</td></tr>";
		}

		$("#open_" + type + "_orders_table tbody").empty().append(rows);

		Lm.DataLoadFinished($("#open_" + type + "_orders_table"));
		orders = {};

		callback();
	}

	function OpenOrdersIncoming(transactions) {
		if (Lm.HasTransactionUpdates(transactions)) {
			Lm.LoadPage("open_orders");
		}
	}

	function CancelOrderModal_OnShow(e) {
		var $invoker = $(e.relatedTarget);

		var orderType = $invoker.data("type");
		var orderId = $invoker.data("order");

		if (orderType == "bid") {
			$("#cancel_order_type").val("cancelBidOrder");
		} else {
			$("#cancel_order_type").val("cancelAskOrder");
		}

		$("#cancel_order_order").val(orderId);
	}

	function CancelOrderForm($modal) {
		var data = Lm.GetFormData($modal.find("form:first"));

		var requestType = data.cancel_order_type;

		delete data.cancel_order_type;

		return {
			"data": data,
			"requestType": requestType
		};
	}

	function CancelOrderCompleteForm(response, data) {
		if (data.requestType == "cancelAskOrder") {
			$.growl($.t("success_cancel_sell_order"), {
				"type": "success"
			});
		} else {
			$.growl($.t("success_cancel_buy_order"), {
				"type": "success"
			});
		}

		if (response.alreadyProcessed) {
			return;
		}

		$("#open_orders_page tr[data-order=" + String(data.order).escapeHTML() + "]").addClass("tentative tentative-crossed").find("td.cancel").html("/");
	}


	$("#asset_exchange_bookmark_this_asset").on("click", AssetExchangeBookmarkThisAsset_OnClick);
	$("#asset_exchange_sidebar").on("click", "a", function(e, data) { AssetExchangeSidebar_OnClick($(this), e, data); });
	$("#asset_exchange_search").on("submit", AssetExchangeClearSearch_OnClick);
	$("#asset_exchange_search input[name=q]").on("input", function(e) { AssetExchangeSearchInput_OnInput($(this), e); });
	$("#buy_asset_box .box-header, #sell_asset_box .box-header").click(function(e) { BoxHeader_OnClick($(this), e); });
	$("#asset_exchange_bid_orders_table tbody, #asset_exchange_ask_orders_table tbody").on("click", "td", AssetExchangeOrderTable_OnClick);
	$("#sell_automatic_price, #buy_automatic_price").on("click", function(e) { AutomaticPrice_OnClick($(this), e); });
	$("#buy_asset_quantity, #buy_asset_price, #sell_asset_quantity, #sell_asset_price, #buy_asset_fee, #sell_asset_fee").keydown(function(e) { Asset_OnKeyDown($(this), e); });
	$("#sell_asset_quantity, #sell_asset_price, #buy_asset_quantity, #buy_asset_price").keyup(function(e) { AssetPrice_OnKeyUp($(this), e); });
	$("#asset_order_modal").on("show.bs.modal", function(e) { AssetOrderModal_OnShow($(this), e); });
	$("#asset_exchange_sidebar_group_context").on("click", "a", function(e) { AssetExchangeSidebarGroupContext_OnClick($(this), e); });
	$("#asset_exchange_sidebar_context").on("click", "a", function(e) { AssetExchangeSidebarContext_OnClick($(this), e); });
	$("#asset_exchange_group_group").on("change", function() { AssetExchangeGroupGroup_OnChange($(this)); });
	$("#transfer_asset_modal").on("show.bs.modal", TransferAssetModal_OnShow);
	$("body").on("click", "a[data-goto-asset]", function(e) { Body_OnClick($(this), e); });
	$("#cancel_order_modal").on("show.bs.modal", function(e) { CancelOrderModal_OnShow(e); });


	Lm.Pages.AssetExchange = AssetExchangePage;
	Lm.CacheAsset = CacheAsset;
	Lm.Forms.AddAssetBookmark = AddAssetBookmarkForm;
	Lm.Forms.AddAssetBookmarkComplete = AddAssetBookmarkCompleteForm;
	Lm.SaveAssetBookmarks = SaveAssetBookmarks;
	Lm.PositionAssetSidebar = PositionAssetSidebar;
	Lm.LoadAssetExchangeSidebar = LoadAssetExchangeSidebar;
	Lm.Incoming.AssetExchange = AssetExchangeIncoming;
	Lm.LoadAsset = LoadAsset;
	Lm.LoadAssetOrders = LoadAssetOrders;
	Lm.IsUserCancelledOrder = IsUserCancelledOrder;
	Lm.Forms.OrderAsset = OrderAssetForm;
	Lm.Forms.OrderAssetComplete = OrderAssetCompleteForm;
	Lm.Forms.IssueAsset = IssueAssetForm;
	Lm.Forms.AssetExchangeChangeGroupName = AssetExchangeChangeGroupNameForm;
	Lm.Forms.AssetExchangeGroup = AssetExchangeGroupForm;
	Lm.Pages.MyAssets = MyAssetsPage;
	Lm.CheckMyAssetsPageLoaded = CheckMyAssetsPageLoaded;
	Lm.MyAssetsPageLoaded = MyAssetsPageLoaded;
	Lm.Incoming.MyAssets = MyAssetsIncoming;
	Lm.Forms.TransferAsset = TransferAssetForm;
	Lm.Forms.TransferAssetComplete = TransferAssetCompleteForm;
	Lm.GoToAsset = GoToAsset;
	Lm.Pages.OpenOrders = OpenOrdersPage;
	Lm.GetOpenOrders = GetOpenOrders;
	Lm.GetUnconfirmedOrders = GetUnconfirmedOrders;
	Lm.OpenOrdersLoaded = OpenOrdersLoaded;
	Lm.Incoming.OpenOrders = OpenOrdersIncoming;
	Lm.Forms.CancelOrder = CancelOrderForm;
	Lm.Forms.CancelOrderComplete = CancelOrderCompleteForm;
	return Lm;
}(Lm || {}, jQuery));