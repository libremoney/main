var Lm = (function(Lm, $, undefined) {
	Lm.Assets = [];
	Lm.AssetIds = [];
	Lm.ClosedGroups = [];
	Lm.AssetSearch = false;
	Lm.LastIssuerCheck = false;
	Lm.ViewingAsset = false; //viewing non-bookmarked asset


	function AssetExchangePage(callback) {
		Lm.PageLoading();

		$(".content.content-stretch:visible").width($(".page:visible").width());

		Lm.Assets = [];
		Lm.AssetIds = [];

		if (Lm.DatabaseSupport) {
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
					qs.push("assets=" + encodeURIComponent(assetBalance.asset));
				});
				qs = qs.join("&");

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
		}
	}

	function CacheAsset(asset) {
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

		return asset;
	}

	function AddAssetBookmarkForm($modal) {
		var data = Lm.GetFormData($modal.find("form:first"));

		data.id = $.trim(data.id);

		if (!data.id) {
			return {
				"error": "Asset or account ID is a required field."
			};
		}

		if (!/^\d+$/.test(data.id) && !/^NXT\-/i.test(data.id)) {
			return {
				"error": "Asset or account ID is invalid."
			};
		}

		if (/^NXT\-/i.test(data.id)) {
			Lm.SendRequest("getAssetsByIssuer", {
				"account": data.id
			}, function(response) {
				if (response.errorCode) {
					Lm.ShowModalError(response.errorDescription, $modal);
				} else {
					if (response.assets && response.assets[0] && response.assets[0].length) {
						Lm.SaveAssetBookmarks(response.assets[0], Lm.Forms.AddAssetBookmarkComplete);
					} else {
						Lm.ShowModalError("No assets found by this account.", $modal);
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
							Lm.ShowModalError(response.errorDescription, $modal);
						} else {
							if (response.assets && response.assets[0] && response.assets[0].length) {
								Lm.SaveAssetBookmarks(response.assets[0], Lm.Forms.AddAssetBookmarkComplete);
							} else {
								Lm.ShowModalError("No asset found.", $modal);
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
			$.growl((submittedAssets.length == 1 ? "Asset" : "Assets") + " already in bookmark list.", {
				"type": "danger"
			});
			$("#asset_exchange_sidebar a.active").removeClass("active");
			$("#asset_exchange_sidebar a[data-asset=" + submittedAssets[0].asset + "]").addClass("active").trigger("click");
			return;
		} else {
			Lm.CloseModal();
			$.growl((newAssets.length == 1 ? "Asset" : newAssets.length + " assets") + " added successfully.", {
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
			newAssetIds.push({
				"asset": String(asset.asset)
			});
			newAssets.push({
				"asset": String(asset.asset),
				"name": String(asset.name),
				"description": String(asset.description),
				"account": String(asset.account),
				"accountRS": String(asset.accountRS),
				"quantityQNT": String(asset.quantityQNT),
				"decimals": parseInt(asset.decimals, 10),
				"groupName": ""
			});
		});

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
		$("#asset_exchange_sidebar_content").height($(window).height() - 120);
		$("#asset_exchange_sidebar").height($(window).height() - 120);
	}

	//called on opening the asset exchange page and automatic refresh
	function LoadAssetExchangeSidebar(callback) {
		if (!Lm.Assets.length) {
			Lm.PageLoaded();
			$("#asset_exchange_sidebar_content").empty();
			$("#no_asset_selected, #loading_asset_data, #no_asset_search_results").hide();
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
					rows += "<a href='#' class='list-group-item list-group-item-header" +
						(asset.groupName == "Ignore List" ? " no-context" : "") + "'" +
						(asset.groupName != "Ignore List" ? " data-context='asset_exchange_sidebar_group_context' " : "data-context=''") +
						" data-groupname='" + asset.groupName.escapeHTML() + "' data-closed='" + isClosedGroup + "'>"+
						"<h4 class='list-group-item-heading'>" + asset.groupName.toUpperCase().escapeHTML() + "</h4>"+
						"<i class='fa fa-angle-" + (isClosedGroup ? "right" : "down") + " group_icon'></i></h4></a>";
				} else {
					ungrouped = true;
					rows += "<a href='#' class='list-group-item list-group-item-header no-context' data-closed='" + isClosedGroup + "'>"+
						"<h4 class='list-group-item-heading'>UNGROUPED <i class='fa pull-right fa-angle-" + (isClosedGroup ? "right" : "down") + "'></i></h4>"+
						"</a>";
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
				(ownsAsset ? " owns_asset" : " not_owns_asset") + "' data-cache='" + i + "' data-asset='" +
				String(asset.asset).escapeHTML() + "'" + (!ungrouped ? " data-groupname='" + asset.groupName.escapeHTML() + "'" : "") +
				(isClosedGroup ? " style='display:none'" : "") + " data-closed='" + isClosedGroup + "'><h4 class='list-group-item-heading'>" +
				asset.name.escapeHTML() + "</h4><p class='list-group-item-text'>qty: " + Lm.FormatQuantity(asset.quantityQNT, asset.decimals) + "</p></a>";
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

	function IncomingAssetExchange() {
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
					$("#asset_exchange_sidebar a.list-group-item[data-asset=" + assetBalance.asset + "]").addClass("owns_asset")
						.removeClass("not_owns_asset");
				}
			});
		}
	}

	function AssetExchangeSidebar_OnClick(e, data, th) {
		e.preventDefault();

		var assetId = th.data("asset");

		//refresh is true if data is refreshed automatically by the system (when a new block arrives)
		if (data && data.refresh) {
			var refresh = true;
		} else {
			var refresh = false;
		}

		//clicked on a group
		if (!assetId) {
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

		assetId = assetId.escapeHTML();

		if (Lm.DatabaseSupport) {
			Lm.Database.select("assets", [{
				"asset": assetId
			}], function(error, asset) {
				if (!error) {
					Lm.LoadAsset(asset[0], refresh);
				}
			});
		} else {
			Lm.SendRequest("getAsset+", {
				"asset": assetId
			}, function(response, input) {
				if (!response.errorCode) {
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

			if (nrDuplicates >= 1) {
				$("#asset_exchange_duplicates_warning span").html((nrDuplicates == 1 ? " is " : " are ") + nrDuplicates + " " +
					(nrDuplicates == 1 ? "other asset" : "other assets"));
				$("#asset_exchange_duplicates_warning").show();
			} else {
				$("#asset_exchange_duplicates_warning").hide();
			}

			if (Lm.DatabaseSupport) {
				Lm.SendRequest("getAsset", {
					"asset": assetId
				}, function(response) {
					if (!response.errorCode) {
						if (response.asset != asset.asset || response.account != asset.account || response.accountRS != asset.accountRS ||response.decimals != asset.decimals || response.description != asset.description || response.name != asset.name || response.quantityQNT != asset.quantityQNT) {
							Lm.Database.delete("assets", [{
								"asset": asset.asset
							}], function() {
								setTimeout(function() {
									Lm.Pages.AssetExchange();
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

		if (Lm.AccountInfo.unconfirmedBalanceNQT == "0") {
			$("#your_nxt_balance").html("0");
			$("#buy_automatic_price").addClass("zero").removeClass("nonzero");
		} else {
			$("#your_nxt_balance").html(Lm.FormatAmount(Lm.AccountInfo.unconfirmedBalanceNQT));
			$("#buy_automatic_price").addClass("nonzero").removeClass("zero");
		}

		if (Lm.AccountInfo.unconfirmedAssetBalances) {
			for (var i = 0; i < Lm.AccountInfo.unconfirmedAssetBalances.length; i++) {
				var balance = Lm.AccountInfo.unconfirmedAssetBalances[i];

				if (balance.asset == assetId) {
					Lm.CurrentAsset.yourBalanceNQT = balance.unconfirmedBalanceQNT;
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

		if (!Lm.CurrentAsset.yourBalanceNQT) {
			Lm.CurrentAsset.yourBalanceNQT = "0";
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
					trades[i].priceNQT = new BigInteger(trades[i].priceNQT);
					trades[i].quantityQNT = new BigInteger(trades[i].quantityQNT);
					trades[i].totalNQT = new BigInteger(Lm.CalculateOrderTotalNQT(trades[i].priceNQT, trades[i].quantityQNT));

					rows += "<tr><td>" + Lm.FormatTimestamp(trades[i].timestamp) + "</td>"+
						"<td>" + Lm.FormatQuantity(trades[i].quantityQNT, Lm.CurrentAsset.decimals) + "</td>"+
						"<td class='asset_price'>" + Lm.FormatOrderPricePerWholeQNT(trades[i].priceNQT, Lm.CurrentAsset.decimals) + "</td>"+
						"<td>" + Lm.FormatAmount(trades[i].totalNQT) + "</td>"+
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
							return new BigInteger(a.priceNQT).compareTo(new BigInteger(b.priceNQT));
						} else {
							//highest price at the top
							return new BigInteger(b.priceNQT).compareTo(new BigInteger(a.priceNQT));
						}
					});
				}
			}

			if (orders.length) {
				$("#" + (type == "ask" ? "sell" : "buy") + "_orders_count").html("(" + orders.length + (orders.length == 50 ? "+" : "") + ")");

				var rows = "";

				for (var i = 0; i < orders.length; i++) {
					var order = orders[i];

					order.priceNQT = new BigInteger(order.priceNQT);
					order.quantityQNT = new BigInteger(order.quantityQNT);
					order.totalNQT = new BigInteger(Lm.CalculateOrderTotalNQT(order.quantityQNT, order.priceNQT));

					if (i == 0 && !refresh) {
						$("#" + (type == "ask" ? "buy" : "sell") + "_asset_price").val(Lm.CalculateOrderPricePerWholeQNT(order.priceNQT, Lm.CurrentAsset.decimals));
					}

					var className = (order.account == Lm.Account ? "your-order" : "") +
						(order.unconfirmed ? " tentative" : (Lm.IsUserCancelledOrder(order) ? " tentative tentative-crossed" : ""));

					rows += "<tr class='" + className + "' data-transaction='" + String(order.order).escapeHTML() + "' data-quantity='" +
						order.quantityQNT.toString().escapeHTML() + "' data-price='" + order.priceNQT.toString().escapeHTML() + "'>"+
						"<td>" + (order.unconfirmed ? "You - <strong>Pending</strong>" :
							(order.account == Lm.Account ? "<strong>You</strong>" :
							"<a href='#' data-user='" + Lm.GetAccountFormatted(order, "account") + "' class='user_info'>" +
							(order.account == Lm.CurrentAsset.account ? "Asset Issuer" : Lm.GetAccountTitle(order, "account")) + "</a>")) +
						"</td>" +
						"<td>" + Lm.FormatQuantity(order.quantityQNT, Lm.CurrentAsset.decimals) + "</td>"+
						"<td>" + Lm.FormatOrderPricePerWholeQNT(order.priceNQT, Lm.CurrentAsset.decimals) + "</td>"+
						"<td>" + Lm.FormatAmount(order.totalNQT) + "</tr>";
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

				if (unconfirmedTransaction.type == 2 &&
						(order.type == "ask" ? unconfirmedTransaction.subtype == 4 : unconfirmedTransaction.subtype == 5) &&
						unconfirmedTransaction.attachment.order == order.order) {
					return true;
				}
			}
		}

		return false;
	}

	function AssetExchangeSearch_OnSubmit(e) {
		e.preventDefault();
		$("#asset_exchange_search input[name=q]").trigger("input");
	}

	function AssetExchangeSearchInput_OnInput(e, th) {
		var input = $.trim(th.val()).toLowerCase();

		if (!input) {
			Lm.AssetSearch = false;
			Lm.LoadAssetExchangeSidebar();
			$("#asset_exchange_clear_search").hide();
		} else {
			Lm.AssetSearch = [];

			if (/NXT\-/i.test(input)) {
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

	function AssetExchangeClearSearch_OnClick() {
		$("#asset_exchange_search input[name=q]").val("");
		$("#asset_exchange_search").trigger("submit");
	}

	function BoxHeader_OnClick(e, th) {
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
			var priceNQT = new BigInteger(String($tr.data("price")));
			var quantityQNT = new BigInteger(String($tr.data("quantity")));
			var totalNQT = new BigInteger(Lm.CalculateOrderTotalNQT(quantityQNT, priceNQT));

			$("#" + type + "_asset_price").val(Lm.CalculateOrderPricePerWholeQNT(priceNQT, Lm.CurrentAsset.decimals));
			$("#" + type + "_asset_quantity").val(Lm.ConvertToQNTf(quantityQNT, Lm.CurrentAsset.decimals));
			$("#" + type + "_asset_total").val(Lm.ConvertToNXT(totalNQT));
		} catch (err) {
			return;
		}

		if (type == "sell") {
			try {
				var balanceNQT = new BigInteger(Lm.AccountInfo.unconfirmedBalanceNQT);
			} catch (err) {
				return;
			}

			if (totalNQT.compareTo(balanceNQT) > 0) {
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

	function AutomaticPrice_OnClick(e, th) {
		try {
			var type = (th.attr("id") == "sell_automatic_price" ? "sell" : "buy");

			var price = new Big(Lm.ConvertToNQT(String($("#" + type + "_asset_price").val())));
			var balance = new Big(type == "buy" ? Lm.AccountInfo.unconfirmedBalanceNQT : Lm.CurrentAsset.yourBalanceNQT);
			var balanceNQT = new Big(Lm.AccountInfo.unconfirmedBalanceNQT);
			var maxQuantity = new Big(Lm.ConvertToQNTf(Lm.CurrentAsset.quantityQNT, Lm.CurrentAsset.decimals));

			if (balance.cmp(new Big("0")) <= 0) {
				return;
			}

			if (price.cmp(new Big("0")) <= 0) {
				//get minimum price if no offers exist, based on asset decimals..
				price = new Big("" + Math.pow(10, Lm.CurrentAsset.decimals));
				$("#" + type + "_asset_price").val(Lm.ConvertToNXT(price.toString()));
			}

			var quantity = new Big(Lm.AmountToPrecision((type == "sell" ? balanceNQT : balance).div(price).toString(), Lm.CurrentAsset.decimals));

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
			$("#" + type + "_asset_total").val(Lm.ConvertToNXT(total.toString()));

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

	function Asset_OnKeyDown(e, $(this)) {
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
				$.growl("Fractions are not allowed.", {
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
				if (isQuantityField) {
					errorMessage = "Only " + Lm.CurrentAsset.decimals + " digits after the decimal mark are allowed for this asset.";
				} else {
					errorMessage = "Only " + (8 - Lm.CurrentAsset.decimals) + " digits after the decimal mark are allowed.";
				}

				$.growl(errorMessage, {
					"type": "danger"
				});

				e.preventDefault();
				return false;
			}
		}

		//numeric characters, left/right key, backspace, delete
		if (charCode == 8 || charCode == 37 || charCode == 39 || charCode == 46 ||
				(charCode >= 48 && charCode <= 57 && !isNaN(String.fromCharCode(charCode))) || (charCode >= 96 && charCode <= 105)) {
			return;
		} else {
			//comma
			if (charCode == 188) {
				$.growl("Comma is not allowed, use a dot instead.", {
					"type": "danger"
				});
			}
			e.preventDefault();
			return false;
		}
	}

	//calculate preview price (calculated on every keypress)
	function AssetPrice_OnKeyUp(e, th) {
		var orderType = th.data("type").toLowerCase();

		try {
			var quantityQNT = new BigInteger(Lm.ConvertToQNT(String($("#" + orderType + "_asset_quantity").val()), Lm.CurrentAsset.decimals));
			var priceNQT = new BigInteger(Lm.CalculatePricePerWholeQNT(Lm.ConvertToNQT(String($("#" + orderType + "_asset_price").val())),
					Lm.CurrentAsset.decimals));

			if (priceNQT.toString() == "0" || quantityQNT.toString() == "0") {
				$("#" + orderType + "_asset_total").val("0");
			} else {
				var total = Lm.CalculateOrderTotal(quantityQNT, priceNQT, Lm.CurrentAsset.decimals);
				$("#" + orderType + "_asset_total").val(total.toString());
			}
		} catch (err) {
			$("#" + orderType + "_asset_total").val("0");
		}
	}

	function AssetOrderModal_OnShow(e) {
		var $invoker = $(e.relatedTarget);

		var orderType = $invoker.data("type");
		var assetId = $invoker.data("asset");

		$("#asset_order_modal_button").html(orderType + " Asset").data("resetText", orderType + " Asset");

		orderType = orderType.toLowerCase();

		try {
			//TODO
			var quantity = String($("#" + orderType + "_asset_quantity").val());
			var quantityQNT = new BigInteger(Lm.ConvertToQNT(quantity, Lm.CurrentAsset.decimals));
			var priceNQT = new BigInteger(Lm.CalculatePricePerWholeQNT(Lm.ConvertToNQT(String($("#" + orderType + "_asset_price").val())),
				Lm.CurrentAsset.decimals));
			var feeNQT = new BigInteger(Lm.ConvertToNQT(String($("#" + orderType + "_asset_fee").val())));
			var totalNXT = Lm.FormatAmount(Lm.CalculateOrderTotalNQT(quantityQNT, priceNQT, Lm.CurrentAsset.decimals), false, true);
		} catch (err) {
			$.growl("Invalid input.", {
				"type": "danger"
			});
			return e.preventDefault();
		}

		if (priceNQT.toString() == "0" || quantityQNT.toString() == "0") {
			$.growl("Please fill in an amount and price.", {
				"type": "danger"
			});
			return e.preventDefault();
		}

		if (feeNQT.toString() == "0") {
			feeNQT = new BigInteger("100000000");
		}

		var priceNQTPerWholeQNT = priceNQT.multiply(new BigInteger("" + Math.pow(10, Lm.CurrentAsset.decimals)));

		if (orderType == "buy") {
			var description = "Buy <strong>" + Lm.FormatQuantity(quantityQNT, Lm.CurrentAsset.decimals, true) + " " +
				$("#asset_name").html() + "</strong> assets at <strong>" + Lm.FormatAmount(priceNQTPerWholeQNT, false, true) +
				" NXT</strong> each.";
			var tooltipTitle = "Per whole asset bought you will pay " + Lm.FormatAmount(priceNQTPerWholeQNT, false, true) +
				" NXT, making a total of " + totalNXT + " NXT once everything have been bought.";
		} else {
			var description = "Sell <strong>" + Lm.FormatQuantity(quantityQNT, Lm.CurrentAsset.decimals, true) + " " +
				$("#asset_name").html() + "</strong> assets at <strong>" + Lm.FormatAmount(priceNQTPerWholeQNT, false, true) +
				" NXT</strong> each.";
			var tooltipTitle = "Per whole asset sold you will receive " + Lm.FormatAmount(priceNQTPerWholeQNT, false, true) +
				" NXT, making a total of " + totalNXT + " NXT once everything has been sold.";
		}

		$("#asset_order_description").html(description);
		$("#asset_order_total").html(totalNXT + " NXT");
		$("#asset_order_fee_paid").html(Lm.FormatAmount(feeNQT) + " NXT");

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
		$("#asset_order_price").val(priceNQT.toString());
		$("#asset_order_fee").val(feeNQT.toString());
	}

	function OrderAssetForm($modal) {
		var orderType = $("#asset_order_type").val();

		return {
			"requestType": orderType,
			"successMessage": $modal.find("input[name=success_message]").val().replace("__", (orderType == "placeBidOrder" ? "buy" : "sell"))
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
		data.priceNQT = new BigInteger(data.priceNQT);
		data.totalNQT = new BigInteger(Lm.CalculateOrderTotalNQT(data.quantityQNT, data.priceNQT));

		var rowToAdd = "<tr class='tentative' data-transaction='" + String(response.transaction).escapeHTML() + "' data-quantity='" +
			data.quantityQNT.toString().escapeHTML() + "' data-price='" + data.priceNQT.toString().escapeHTML() + "'>"+
			"<td>You - <strong>Pending</strong></td>"+
			"<td>" + Lm.FormatQuantity(data.quantityQNT, Lm.CurrentAsset.decimals) + "</td>"+
			"<td>" + Lm.FormatOrderPricePerWholeQNT(data.priceNQT, Lm.CurrentAsset.decimals) + "</td>"+
			"<td>" + Lm.FormatAmount(data.totalNQT) + "</td></tr>";

		var rowAdded = false;

		if ($rows.length) {
			$rows.each(function() {
				var rowPrice = new BigInteger(String($(this).data("price")));

				if (data.requestType == "placeBidOrder" && data.priceNQT.compareTo(rowPrice) > 0) {
					$(this).before(rowToAdd);
					rowAdded = true;
					return false;
				} else if (data.requestType == "placeAskOrder" && data.priceNQT.compareTo(rowPrice) < 0) {
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
				"error": "Description is a required field."
			};
		} else if (!/^\d+$/.test(data.quantity)) {
			return {
				"error": "Quantity must be a whole numbrer."
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

	function AssetExchangeSidebarGroupContext_OnClick(e, th) {
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
				"error": "Only alphanumerical characters can be used in the group name."
			};
		}

		Lm.Database.update("assets", {
			"groupName": newGroupName
		}, [{
			"groupName": oldGroupName
		}], function() {
			setTimeout(function() {
				Lm.Pages.AssetExchange();
				$.growl("Group name updated successfully.", {
					"type": "success"
				});
			}, 50);
		});

		return {
			"stop": true
		};
	}

	function AssetExchangeSidebarContext_OnClick(e, th) {
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
						groupSelect.append("<option value='" + groupName.escapeHTML() + "'" +
							(asset.groupName && asset.groupName.toLowerCase() == groupName.toLowerCase() ? " selected='selected'" : "") + ">" +
							groupName.escapeHTML() + "</option>");
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
					Lm.Pages.AssetExchange();
					$.growl("Asset removed from group successfully.", {
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
				$.growl("Asset cannot be removed (you own it).", {
					"type": "danger"
				});
			} else {
				//todo save delteed asset ids from accountissuers
				Lm.Database.delete("assets", [{
					"asset": assetId
				}], function(error, affected) {
					setTimeout(function() {
						Lm.Pages.AssetExchange();
						$.growl("Asset removed from bookmarks successfully.", {
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
				Lm.Pages.AssetExchange();
				if (!groupName) {
					$.growl("Asset removed from group successfully.", {
						"type": "success"
					});
				} else {
					$.growl("Asset added to group successfully.", {
						"type": "success"
					});
				}
			}, 50);
		});

		return {
			"stop": true
		};
	}

	function AssetExchangeGroupModal_OnHidden(e) {
		$("#asset_exchange_group_new_group_div").val("").hide();
	}

	/* MY ASSETS PAGE */
	function MyAssetsPage() {
		Lm.PageLoading();

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

							response.priceNQT = new BigInteger(response.priceNQT);

							result.ask_orders[input["_extra"].asset] = response.priceNQT;
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

							response.priceNQT = new BigInteger(response.priceNQT);

							result.bid_orders[input["_extra"].asset] = response.priceNQT;
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

				if (Lm.CurrentPage != "my_assets") {
					return;
				}
			}
		} else {
			$("#my_assets_table tbody").empty();
			Lm.DataLoadFinished($("#my_assets_table"));
			Lm.PageLoaded();
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
				var total = new BigInteger(Lm.CalculateOrderTotalNQT(asset.balanceQNT, highestBidOrder, asset.decimals));
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
				var totalNQT = new BigInteger(Lm.CalculateOrderTotalNQT(asset.balanceQNT, highestBidOrder));
			}

			var sign = "+";

			if (tentative != -1 && tentative.compareTo(BigInteger.ZERO) < 0) {
				tentative = tentative.abs();
				sign = "-";
			}

			rows += "<tr" + (tentative != -1 ? " class='tentative tentative-allow-links'" : "") + " data-asset='" +
				String(asset.asset).escapeHTML() + "'>"+
				"<td><a href='#' data-goto-asset='" +
				String(asset.asset).escapeHTML() + "'>" + String(asset.name).escapeHTML() + "</a></td>"+
				"<td class='quantity'>" + Lm.FormatQuantity(asset.balanceQNT, asset.decimals) +
				(tentative != -1 ? " " + sign + " <span class='added_quantity'>" + Lm.FormatQuantity(tentative, asset.decimals) + "</span>" : "") + "</td>"+
				"<td>" + Lm.FormatQuantity(asset.quantityQNT, asset.decimals) + "</td>"+
				"<td>" + percentageAsset + "%</td>"+
				"<td>" + (lowestAskOrder != -1 ? Lm.FormatOrderPricePerWholeQNT(lowestAskOrder, asset.decimals) : "/") + "</td>"+
				"<td>" + (highestBidOrder != -1 ? Lm.FormatOrderPricePerWholeQNT(highestBidOrder, asset.decimals) : "/") + "</td>"+
				"<td>" + (highestBidOrder != -1 ? Lm.FormatAmount(totalNQT) : "/") + "</td>"+
				"<td><a href='#' data-toggle='modal' data-target='#transfer_asset_modal' data-asset='" +
				String(asset.asset).escapeHTML() + "' data-name='" + String(asset.name).escapeHTML() + "' data-decimals='" +
				String(asset.decimals).escapeHTML() + "'>Transfer</a></td></tr>";
		}

		$("#my_assets_table tbody").empty().append(rows);
		Lm.DataLoadFinished($("#my_assets_table"));

		Lm.PageLoaded();
	}

	function IncomingMyAssets() {
		Lm.Pages.MyAssets();
	}

	function TransferAssetModal_OnShow(e) {
		var $invoker = $(e.relatedTarget);

		var assetId = $invoker.data("asset");
		var assetName = $invoker.data("name");
		var decimals = $invoker.data("decimals");

		$("#transfer_asset_asset").val(assetId);
		$("#transfer_asset_decimals").val(decimals);
		$("#transfer_asset_name").html(String(assetName).escapeHTML());
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
			availableAssetsMessage = " - " + Lm.FormatQuantity(confirmedBalance, decimals) + " available for transfer";
		} else {
			availableAssetsMessage = " - " + Lm.FormatQuantity(unconfirmedBalance, decimals) + " available for transfer (" +
				Lm.FormatQuantity(confirmedBalance, decimals) + " total)";
		}

		$("#transfer_asset_available").html(availableAssetsMessage);
	});

	function TransferAssetForm($modal) {
		var data = Lm.GetFormData($modal.find("form:first"));

		if (!Lm.ShowedFormWarning) {
			if (Lm.Settings["asset_transfer_warning"] && Lm.Settings["asset_transfer_warning"] != 0) {
				if (new Big(data.quantity).cmp(new Big(Lm.Settings["asset_transfer_warning"])) > 0) {
					Lm.ShowedFormWarning = true;
					return {
						"error": "Quantity specified is higher than " + String(Lm.Settings["asset_transfer_warning"]).escapeHTML() +
							". Are you sure you want to continue? Click the submit button again to confirm."
					};
				}
			}
		}

		try {
			data.quantityQNT = Lm.ConvertToQNT(data.quantity, data.decimals);
		} catch (e) {
			return {
				"error": "Incorrect quantity: " + e
			};
		}

		delete data.quantity;
		delete data.decimals;

		return {
			"data": data
		};
	}

	function TransferAssetCompleteForm(response, data) {
		Lm.Pages.MyAssets();
	}

	function Body_OnClick(e, th) {
		e.preventDefault();

		var $visible_modal = $(".modal.in");

		if ($visible_modal.length) {
			$visible_modal.modal("hide");
		}

		Lm.GoToAsset(th.data("goto-asset"));
	});

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
							$.growl("Could not find asset.", {
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

		Lm.PageLoading();

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
						"priceNQT": unconfirmedTransaction.attachment.priceNQT,
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

					if (unconfirmedTransaction.type == 2 && unconfirmedTransaction.subtype == (type == "ask" ? 4 : 5) &&
							unconfirmedTransaction.attachment.order == completeOrder.order) {
						cancelled = true;
						break;
					}
				}
			}

			completeOrder.priceNQT = new BigInteger(completeOrder.priceNQT);
			completeOrder.quantityQNT = new BigInteger(completeOrder.quantityQNT);
			completeOrder.totalNQT = new BigInteger(Lm.CalculateOrderTotalNQT(completeOrder.quantityQNT, completeOrder.priceNQT));

			rows += "<tr data-order='" + String(completeOrder.order).escapeHTML() + "'" + (cancelled ? " class='tentative tentative-crossed'" :
				(completeOrder.tentative ? " class='tentative'" : "")) + ">"+
				"<td><a href='#' data-goto-asset='" + String(completeOrder.asset).escapeHTML() + "'>" + completeOrder.assetName.escapeHTML() + "</a></td>"+
				"<td>" + Lm.FormatQuantity(completeOrder.quantityQNT, completeOrder.decimals) + "</td>"+
				"<td>" + Lm.FormatOrderPricePerWholeQNT(completeOrder.priceNQT, completeOrder.decimals) + "</td>"+
				"<td>" + Lm.FormatAmount(completeOrder.totalNQT) + "</td>"+
				"<td class='cancel'>" + (cancelled || completeOrder.tentative ? "/" :
					"<a href='#' data-toggle='modal' data-target='#cancel_order_modal' data-order='" +
					String(completeOrder.order).escapeHTML() + "' data-type='" + type + "'>Cancel</a>") +
				"</td></tr>";
		}

		$("#open_" + type + "_orders_table tbody").empty().append(rows);

		Lm.DataLoadFinished($("#open_" + type + "_orders_table"));
		orders = {};

		callback();
	}

	function IncomingOpenOrders(transactions) {
		if (transactions || Lm.UnconfirmedTransactionsChange || Lm.State.isScanning) {
			Lm.Pages.OpenOrders();
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
	});

	function CancelOrderForm($modal) {
		var orderType = $("#cancel_order_type").val();

		return {
			"requestType": orderType,
			"successMessage": $modal.find("input[name=success_message]").val().replace("__", (orderType == "cancelBidOrder" ? "buy" : "sell"))
		};
	}

	function CancelOrderCompleteForm(response, data) {
		if (response.alreadyProcessed) {
			return;
		}
		$("#open_orders_page tr[data-order=" + String(data.order).escapeHTML() + "]").addClass("tentative tentative-crossed").find("td.cancel").html("/");
	}


	$("#asset_exchange_bookmark_this_asset").on("click", function() {
		AssetExchangeBookmarkThisAsset_OnClick();
	});

	$("#asset_exchange_sidebar").on("click", "a", function(e, data) {
		AssetExchangeSidebar_OnClick(e, data, $(this));
	});

	$("#asset_exchange_search").on("submit", function(e) {
		AssetExchangeSearch_OnSubmit(e);
	});

	$("#asset_exchange_search input[name=q]").on("input", function(e) {
		AssetExchangeSearchInput_OnInput(e, $(this));
	});

	$("#asset_exchange_clear_search").on("click", function() {
		AssetExchangeClearSearch_OnClick();
	});

	$("#buy_asset_box .box-header, #sell_asset_box .box-header").click(function(e) {
		BoxHeader_OnClick(e, $(this));
	});

	$("#asset_exchange_bid_orders_table tbody, #asset_exchange_ask_orders_table tbody").on("click", "td", function(e) {
		AssetExchangeOrderTable_OnClick(e);
	});

	$("#sell_automatic_price, #buy_automatic_price").on("click", function(e) {
		Lm.AutomaticPrice_OnClick(e, $(this));
	});

	$("#buy_asset_quantity, #buy_asset_price, #sell_asset_quantity, #sell_asset_price, #buy_asset_fee, #sell_asset_fee").keydown(function(e) {
		Asset_OnKeyDown(e);
	});

	$("#sell_asset_quantity, #sell_asset_price, #buy_asset_quantity, #buy_asset_price").keyup(function(e) {
		AssetPrice_OnKeyUp(e, $(this));
	});

	$("#asset_order_modal").on("show.bs.modal", function(e) {
		AssetOrderModal_OnShow(e);
	});

	$("#asset_exchange_sidebar_group_context").on("click", "a", function(e) {
		AssetExchangeSidebarGroupContext_OnClick(e, $(this));
	});

	$("#asset_exchange_sidebar_context").on("click", "a", function(e) {
		AssetExchangeSidebarContext_OnClick(e, $(this));
	});

	$("#asset_exchange_group_group").on("change", function() {
		AssetExchangeGroupGroup_OnChange($(this));
	});

	$("#asset_exchange_group_modal").on("hidden.bs.modal", function(e) {
		AssetExchangeGroupModal_OnHidden();
	});

	$("#transfer_asset_modal").on("show.bs.modal", function(e) {
		TransferAssetModal_OnShow(e);
	});

	$("body").on("click", "a[data-goto-asset]", function(e) {
		Body_OnClick(e, $(this));
	});

	$("#cancel_order_modal").on("show.bs.modal", function(e) {
		CancelOrderModal_OnShow(e);
	});


	//Lm.Pages.asset_exchange = AssetExchangePage; // deprecated
	Lm.Pages.AssetExchange = AssetExchangePage;
	Lm.CacheAsset = CacheAsset;
	Lm.Forms.AddAssetBookmark = AddAssetBookmarkForm;
	Lm.Forms.AddAssetBookmarkComplete = AddAssetBookmarkCompleteFrom;
	Lm.SaveAssetBookmarks = SaveAssetBookmarks;
	Lm.PositionAssetSidebar = PositionAssetSidebar;
	Lm.LoadAssetExchangeSidebar = LoadAssetExchangeSidebar;
	//Lm.Incoming.asset_exchange = IncomingAssetExchange; // deprecated
	Lm.Incoming.AssetExchange = IncomingAssetExchange;
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
	Lm.Incoming.my_assets = IncomingMyAssets; // deprecated
	Lm.Incoming.MyAssets = IncomingMyAssets;
	Lm.Forms.TransferAsset = TransferAssetForm;
	Lm.Forms.TransferAssetComplete = TransferAssetCompleteForm;
	Lm.GoToAsset = GoToAsset;
	//Lm.Pages.open_orders = OpenOrdersPage; // deprecated
	Lm.Pages.OpenOrders = OpenOrdersPage;
	Lm.GetOpenOrders = GetOpenOrders;
	Lm.GetUnconfirmedOrders = GetUnconfirmedOrders;
	Lm.OpenOrdersLoaded = OpenOrdersLoaded;
	//Lm.Incoming.open_orders = IncomingOpenOrders; // deprecated
	Lm.Incoming.OpenOrders = IncomingOpenOrders;
	Lm.Forms.CancelOrder = CancelOrderForm;
	Lm.Forms.CancelOrderComplete = CancelOrderCompleteForm;
	return Lm;
}(Lm || {}, jQuery));