/**
 * @depends {lm.js}
 */
var Lm = (function(Lm, $, undefined) {
	var _goodsToShow;
	var _currentSeller;

	function GetMarketplaceItemHtml(good) {
		return "<div style='float:right;color: #999999;background:white;padding:5px;border:1px solid #ccc;border-radius:3px'>" +
			"<strong>" + $.t("seller") + "</strong>: <span><a href='#' data-user='" + Lm.GetAccountFormatted(good, "seller") + "' class='user_info'>" + Lm.GetAccountTitle(good, "seller") + "</a></span><br>" +
			"<strong>" + $.t("product_id") + "</strong>: &nbsp;<a href='#'' data-toggle='modal' data-target='#dgs_product_modal' data-goods='" + String(good.goods).escapeHTML() + "'>" + String(good.goods).escapeHTML() + "</a>" +
			"</div>" +
			"<h3 class='title'><a href='#' data-goods='" + String(good.goods).escapeHTML() + "' data-toggle='modal' data-target='#dgs_purchase_modal'>" + String(good.name).escapeHTML() + "</a></h3>" +
			"<div class='price'><strong>" + Lm.FormatAmount(good.priceMilliLm) + " Lm</strong></div>" +
			"<div class='showmore'><div class='moreblock description'>" + String(good.description).escapeHTML().nl2br() + "</div></div>" +
			"<span class='quantity'><strong>" + $.t("quantity") + "</strong>: " + Lm.Format(good.quantity) + "</span> <span class='tags'><strong>" + $.t("tags") + "</strong>: " + String(good.tags).escapeHTML() + "</span><hr />";
	}

	function GetMarketplacePurchaseHtml(purchase, showBuyer) {
		var status, statusHTML, modal;

		if (purchase.unconfirmed) {
			status = $.t("tentative");
		} else if (purchase.pending) {
			status = $.t("pending");
			statusHTML = "<span class='label label-warning'>" + $.t("pending") + "</span>";
		} else if (purchase.refundMilliLm) {
			status = $.t("refunded");
			modal = "#dgs_view_refund_modal";
		} else if (!purchase.goodsData) {
			var currentTime = (new Date() - Date.UTC(2013, 10, 24, 12, 0, 0, 0)) / 1000;
			if (purchase.deliveryDeadlineTimestamp < currentTime) {
				status = $.t("not_delivered_in_time");
			} else {
				status = $.t("failed");
			}
		} else {
			status = $.t("complete");
		}

		return "<div data-purchase='" + String(purchase.purchase).escapeHTML() + "'" + (purchase.unconfirmed ? " class='tentative'" : "") + "><div style='float:right;color: #999999;background:white;padding:5px;border:1px solid #ccc;border-radius:3px'>" +
			(showBuyer ? "<strong>" + $.t("buyer") + "</strong>: <span><a href='#' data-user='" + Lm.GetAccountFormatted(purchase, "buyer") + "' class='user_info'>" + Lm.GetAccountTitle(purchase, "buyer") + "</a></span><br>" :
			"<strong>" + $.t("seller") + "</strong>: <span><a href='#' data-user='" + Lm.GetAccountFormatted(purchase, "seller") + "' class='user_info'>" + Lm.GetAccountTitle(purchase, "seller") + "</a></span><br>") +
			"<strong>" + $.t("product_id") + "</strong>: &nbsp;<a href='#'' data-toggle='modal' data-target='#dgs_product_modal' data-goods='" + String(purchase.goods).escapeHTML() + "'>" + String(purchase.goods).escapeHTML() + "</a>" +
			"</div>" +
			"<h3 class='title'><a href='#' data-purchase='" + String(purchase.purchase).escapeHTML() + "' data-toggle='modal' data-target='" + (modal ? modal : "#dgs_view_delivery_modal") + "'>" + String(purchase.name).escapeHTML() + "</a></h3>" +
			"<table>" +
			"<tr><td style='width:150px'><strong>" + $.t("order_date") + "</strong>:</td><td>" + Lm.FormatTimestamp(purchase.timestamp) + "</td></tr>" +
			"<tr><td><strong>" + $.t("order_status") + "</strong>:</td><td><span class='order_status'>" + (statusHTML ? statusHTML : status) + "</span></td></tr>" +
			(purchase.pending ? "<tr><td><strong>" + $.t("delivery_deadline") + "</strong>:</td><td>" + Lm.FormatTimestamp(purchase.deliveryDeadlineTimestamp) + "</td></tr>" : "") +
			"<tr><td><strong>" + $.t("price") + "</strong>:</td><td>" + Lm.FormatAmount(purchase.priceMilliLm) + " Lm</td></tr>" +
			"<tr><td><strong>" + $.t("quantity") + "</strong>:</td><td>" + Lm.Format(purchase.quantity) + "</td></tr>" +
			(purchase.seller == Lm.Account && purchase.feedbackNote ? "<tr><td><strong>" + $.t("feedback") + "</strong>:</td><td>" + $.t("includes_feedback") + "</td></tr>" : "") +
			"</table></div>" +
			"<hr />";
	}

	function GetMarketplacePendingOrderHtml(purchase) {
		var delivered = Lm.GetUnconfirmedTransactionsFromCache(3, [5, 7], {
			"purchase": purchase.purchase
		});

		return "<div data-purchase='" + String(purchase.purchase).escapeHTML() + "'" + (delivered ? " class='tentative'" : "") + "><div style='float:right;color: #999999;background:white;padding:5px;border:1px solid #ccc;border-radius:3px'>" +
			"<strong>" + $.t("buyer") + "</strong>: <span><a href='#' data-user='" + Lm.GetAccountFormatted(purchase, "buyer") + "' class='user_info'>" + Lm.GetAccountTitle(purchase, "buyer") + "</a></span><br>" +
			"<strong>" + $.t("product_id") + "</strong>: &nbsp;<a href='#'' data-toggle='modal' data-target='#dgs_product_modal' data-goods='" + String(purchase.goods).escapeHTML() + "'>" + String(purchase.goods).escapeHTML() + "</a>" +
			"</div>" +
			"<h3 class='title'><a href='#' data-purchase='" + String(purchase.purchase).escapeHTML() + "' data-toggle='modal' data-target='#dgs_view_purchase_modal'>" + String(purchase.name).escapeHTML() + "</a></h3>" +
			"<table class='purchase' style='margin-bottom:5px'>" +
			"<tr><td style='width:150px'><strong>Order Date</strong>:</td><td>" + Lm.FormatTimestamp(purchase.timestamp) + "</td></tr>" +
			"<tr><td><strong>" + $.t("delivery_deadline") + "</strong>:</td><td>" + Lm.FormatTimestamp(purchase.deliveryDeadlineTimestamp) + "</td></tr>" +
			"<tr><td><strong>" + $.t("price") + "</strong>:</td><td>" + Lm.FormatAmount(purchase.priceMilliLm) + " Lm</td></tr>" +
			"<tr><td><strong>" + $.t("quantity") + "</strong>:</td><td>" + Lm.Format(purchase.quantity) + "</td></tr>" +
			"</table>" +
			"<span class='delivery'>" + (!delivered ? "<button type='button' class='btn btn-default btn-deliver' data-toggle='modal' data-target='#dgs_delivery_modal' data-purchase='" + String(purchase.purchase).escapeHTML() + "'>" + $.t("deliver_goods") + "</button>" : $.t("delivered")) + "</span>" +
			"</div><hr />";
	}

	function DgsSearchPage(callback) {
		var content = "";

		var seller = $.trim($(".dgs_search input[name=q]").val());

		if (seller) {
			if (seller != _currentSeller) {
				$("#dgs_search_contents").empty();
				_currentSeller = seller;
			}

			$("#dgs_search_results").show();
			$("#dgs_search_center").hide();
			$("#dgs_search_top").show();

			Lm.SendRequest("getDGSGoods+", {
				"seller": seller,
				"firstIndex": Lm.PageNumber * Lm.ItemsPerPage - Lm.ItemsPerPage,
				"lastIndex": Lm.PageNumber * Lm.ItemsPerPage
			}, function(response) {
				$("#dgs_search_contents").empty();

				if (response.goods && response.goods.length) {
					if (response.goods.length > Lm.ItemsPerPage) {
						Lm.HasMorePages = true;
						response.goods.pop();
					}

					var content = "";

					for (var i = 0; i < response.goods.length; i++) {
						content += GetMarketplaceItemHtml(response.goods[i]);
					}
				}

				Lm.DataLoaded(content);
				Lm.ShowMore();

				if (callback) {
					callback();
				}
			});
		} else {
			$("#dgs_search_center").show();
			$("#dgs_search_top").hide();
			$("#dgs_search_results").hide();
			$("#dgs_search_contents").empty();
			Lm.PageLoaded();
		}
	}

	function PurchasedDgsPage() {
		var content = "";

		if (Lm.PageNumber == 1) {

			var unconfirmedTransactions = Lm.GetUnconfirmedTransactionsFromCache(3, 4, {
				"sender": Lm.Account
			});

			if (unconfirmedTransactions) {
				for (var i = 0; i < unconfirmedTransactions.length; i++) {
					var unconfirmedTransaction = unconfirmedTransactions[i];
					content += GetMarketplacePurchaseHtml(unconfirmedTransaction);
				}
			}
		}

		Lm.SendRequest("getDGSPurchases+", {
			"buyer": Lm.Account,
			"firstIndex": Lm.PageNumber * Lm.ItemsPerPage - Lm.ItemsPerPage,
			"lastIndex": Lm.PageNumber * Lm.ItemsPerPage
		}, function(response) {
			if (response.purchases && response.purchases.length) {
				if (response.purchases.length > Lm.ItemsPerPage) {
					Lm.HasMorePages = true;
					response.purchases.pop();
				}

				for (var i = 0; i < response.purchases.length; i++) {
					content += GetMarketplacePurchaseHtml(response.purchases[i]);
				}
			}

			Lm.DataLoaded(content);
		});
	}

	function PurchasedDgsIncoming(transactions) {
		if (Lm.HasTransactionUpdates(transactions)) {
			Lm.LoadPage("purchased_dgs");
		}
	}

	function CompletedOrdersDgsPage() {
		Lm.SendRequest("getDGSPurchases+", {
			"seller": Lm.Account,
			"completed": true,
			"firstIndex": Lm.PageNumber * Lm.ItemsPerPage - Lm.ItemsPerPage,
			"lastIndex": Lm.PageNumber * Lm.ItemsPerPage
		}, function(response) {
			var content = "";

			if (response.purchases && response.purchases.length) {
				if (response.purchases.length > Lm.ItemsPerPage) {
					Lm.HasMorePages = true;
					response.purchases.pop();
				}

				for (var i = 0; i < response.purchases.length; i++) {
					content += GetMarketplacePurchaseHtml(response.purchases[i], true);
				}
			}

			Lm.DataLoaded(content);
		});
	}

	function CompletedOrdersDgsIncoming() {
		Lm.LoadPage("completed_orders_dgs");
	}

	function PendingOrdersDgsPage() {
		Lm.SendRequest("getDGSPendingPurchases+", {
			"seller": Lm.Account,
			"firstIndex": Lm.PageNumber * Lm.ItemsPerPage - Lm.ItemsPerPage,
			"lastIndex": Lm.PageNumber * Lm.ItemsPerPage
		}, function(response) {
			var content = "";

			if (response.purchases && response.purchases.length) {
				if (response.purchases.length > Lm.ItemsPerPage) {
					Lm.HasMorePages = true;
					response.purchases.pop();
				}

				for (var i = 0; i < response.purchases.length; i++) {
					content += GetMarketplacePendingOrderHtml(response.purchases[i]);
				}
			}

			Lm.DataLoaded(content);
		});
	}

	function PendingOrdersDgsIncoming() {
		Lm.LoadPage("pending_orders_dgs");
	}

	function MyDgsListingsPage() {
		var rows = "";

		var unconfirmedTransactions = Lm.GetUnconfirmedTransactionsFromCache(3, 0);

		if (unconfirmedTransactions) {
			for (var i = 0; i < unconfirmedTransactions.length; i++) {
				var unconfirmedTransaction = unconfirmedTransactions[i];

				rows += "<tr class='tentative' data-goods='" + String(unconfirmedTransaction.goods).escapeHTML() + "'>" +
					"<td><a href='#' data-toggle='modal' data-target='#dgs_listing_modal' data-goods='" +
					String(unconfirmedTransaction.goods).escapeHTML() + "'>" + String(unconfirmedTransaction.name).escapeHTML() + "</a></td>" +
					"<td class='quantity'>" + Lm.Format(unconfirmedTransaction.quantity) + "</td>" +
					"<td class='price'>" + Lm.FormatAmount(unconfirmedTransaction.priceMilliLm) + " Lm</td>" +
					"<td style='white-space:nowrap'><a class='btn btn-xs btn-default' href='#' data-toggle='modal' " +
					"data-target='#dgs_price_change_modal' data-goods='" + String(unconfirmedTransaction.goods).escapeHTML() + "'>" +
					$.t("change_price") + "</a> <a class='btn btn-xs btn-default' href='#' data-toggle='modal' " +
					"data-target='#dgs_quantity_change_modal' data-goods='" + String(unconfirmedTransaction.goods).escapeHTML() + "'>" +
					$.t("change_qty") + "</a> <a class='btn btn-xs btn-default' href='#' data-toggle='modal' " +
					"data-target='#dgs_delisting_modal' data-goods='" + String(unconfirmedTransaction.goods).escapeHTML() + "'>" +
					$.t("delete") + "</a></td></tr>";
			}
		}

		Lm.SendRequest("getDGSGoods+", {
			"seller": Lm.Account,
			"firstIndex": Lm.PageNumber * Lm.ItemsPerPage - Lm.ItemsPerPage,
			"lastIndex": Lm.PageNumber * Lm.ItemsPerPage,
			"inStockOnly": "false"
		}, function(response) {
			if (response.goods && response.goods.length) {
				if (response.goods.length > Lm.ItemsPerPage) {
					Lm.HasMorePages = true;
					response.goods.pop();
				}

				for (var i = 0; i < response.goods.length; i++) {
					var good = response.goods[i];

					var deleted = false;
					var tentative = false;
					var quantityFormatted = false;

					var unconfirmedTransaction = Lm.GetUnconfirmedTransactionFromCache(3, [1, 2, 3], {
						"goods": good.goods
					});

					if (unconfirmedTransaction) {
						if (unconfirmedTransaction.subtype == 1) {
							deleted = tentative = true;
						} else if (unconfirmedTransaction.subtype == 2) {
							good.priceMilliLm = unconfirmedTransaction.priceMilliLm;
							tentative = true;
						} else {
							good.quantity = Lm.Format(good.quantity) + (String(unconfirmedTransaction.deltaQuantity).charAt(0) != "-" ? "+" : "") +
								Lm.Format(unconfirmedTransaction.deltaQuantity);
							tentative = true;
							quantityFormatted = true;
						}
					}

					rows += "<tr class='" + (tentative ? "tentative" : "") + (deleted ? " tentative-crossed" : "") + "' data-goods='" +
						String(good.goods).escapeHTML() + "'><td><a href='#' data-toggle='modal' data-target='#dgs_product_modal' data-goods='" +
						String(good.goods).escapeHTML() + "'>" + String(good.name).escapeHTML() + "</a></td>" +
						"<td class='quantity'>" + (quantityFormatted ? good.quantity : Lm.Format(good.quantity)) + "</td>" +
						"<td class='price'>" + Lm.FormatAmount(good.priceMilliLm) + " Lm</td>" +
						"<td style='white-space:nowrap'><a class='btn btn-xs btn-default' href='#' data-toggle='modal' " +
						"data-target='#dgs_price_change_modal' data-goods='" + String(good.goods).escapeHTML() + "'>" +
						$.t("change_price") + "</a> <a class='btn btn-xs btn-default' href='#' data-toggle='modal' " +
						"data-target='#dgs_quantity_change_modal' data-goods='" + String(good.goods).escapeHTML() + "'>" +
						$.t("change_qty") + "</a> <a class='btn btn-xs btn-default' href='#' data-toggle='modal' " +
						"data-target='#dgs_delisting_modal' data-goods='" + String(good.goods).escapeHTML() + "'>" +
						$.t("delete") + "</a></td></tr>";
				}
			}

			Lm.DataLoaded(rows);
		});
	}

	function MyDgsListingsIncoming(transactions) {
		Lm.LoadPage("my_dgs_listings");
	}

	function DgsListingForm($modal) {
		var data = Lm.GetFormData($modal.find("form:first"));

		$.each(data, function(key, value) {
			data[key] = $.trim(value);
		});

		if (!data.description) {
			return {
				"error": $.t("error_description_required")
			};
		}

		if (data.tags) {
			data.tags = data.tags.toLowerCase();

			var tags = data.tags.split(",");

			if (tags.length > 3) {
				return {
					"error": $.t("error_max_tags", {
						"nr": 3
					})
				};
			} else {
				var clean_tags = [];

				for (var i = 0; i < tags.length; i++) {
					var tag = $.trim(tags[i]);

					if (tag.length < 3 || tag.length > 20) {
						return {
							"error": $.t("error_incorrect_tag_length", {
								"min": 3,
								"max": 20
							})
						};
					} else if (!tag.match(/^[a-z]+$/i)) {
						return {
							"error": $.t("error_incorrect_tag_alpha")
						};
					} else if (clean_tags.indexOf(tag) > -1) {
						return {
							"error": $.t("error_duplicate_tags")
						};
					} else {
						clean_tags.push(tag);
					}
				}

				data.tags = clean_tags.join(",")
			}
		}

		return {
			"data": data
		};
	}

	function DgsListingCompleteForm(response, data) {
		if (response.alreadyProcessed) {
			return;
		}

		if (Lm.CurrentPage == "my_dgs_listings") {
			var $table = $("#my_dgs_listings_table tbody");

			var rowToAdd = "<tr class='tentative' data-goods='" + String(response.transaction).escapeHTML() + "'>" +
				"<td><a href='#' data-toggle='modal' data-target='#dgs_listing_modal' data-goods='" + String(response.transaction).escapeHTML() + "'>" +
				String(data.name).escapeHTML() + "</a></td>" +
				"<td class='quantity'>" + Lm.Format(data.quantity) + "</td>" +
				"<td class='price'>" + Lm.FormatAmount(data.priceMilliLm) + " Lm</td>" +
				"<td style='white-space:nowrap'><a class='btn btn-xs btn-default' href='#' data-toggle='modal' " +
				"data-target='#dgs_price_change_modal' data-goods='" + String(response.transaction).escapeHTML() + "'>" +
				$.t("change_price") + "</a> <a class='btn btn-xs btn-default' href='#' data-toggle='modal' " +
				"data-target='#dgs_quantity_change_modal' data-goods='" + String(response.transaction).escapeHTML() + "'>" +
				$.t("change_qty") + "</a> <a class='btn btn-xs btn-default' href='#' data-toggle='modal' " +
				"data-target='#dgs_delisting_modal' data-goods='" + String(response.transaction).escapeHTML() + "'>" +
				$.t("delete") + "</a></td></tr>";

			$table.prepend(rowToAdd);

			if ($("#my_dgs_listings_table").parent().hasClass("data-empty")) {
				$("#my_dgs_listings_table").parent().removeClass("data-empty");
			}
		}
	}

	function DgsDelistingCompleteForm(response, data) {
		if (response.alreadyProcessed) {
			return;
		}

		$("#my_dgs_listings_table tr[data-goods=" + String(data.goods).escapeHTML() + "]").addClass("tentative tentative-crossed");
	}

	function DgsFeedbackForm($modal) {
		var data = Lm.GetFormData($modal.find("form:first"));

		Lm.SendRequest("getDGSPurchase", {
			"purchase": data.purchase
		}, function(response) {
			if (response.errorCode) {
				return {
					"error": $.t("error_purchase")
				};
			} else {
				data.seller = response.seller;
			}
		}, false);

		data.add_message = true;

		if (data.feedback_type == "public") {
			data.encrypt_message = false;
		} else {
			data.encrypt_message = true;
		}

		delete data.seller;
		delete data.feedback_type;

		return {
			"data": data
		};
	}

	function DgsPurchaseForm($modal) {
		var data = Lm.GetFormData($modal.find("form:first"));

		Lm.SendRequest("getDGSGood", {
			"goods": data.goods
		}, function(response) {
			if (response.errorCode) {
				return {
					"error": $.t("error_goods")
				};
			} else {
				data.seller = response.seller;
			}
		}, false);

		data.deliveryDeadlineTimestamp = String(Math.floor((new Date() - Date.UTC(2013, 10, 24, 12, 0, 0, 0)) / 1000) + (60 * 60 * data.deliveryDeadlineTimestamp));

		delete data.seller;

		return {
			"data": data
		};
	}

	function DgsRefundForm($modal) {
		var data = Lm.GetFormData($modal.find("form:first"));

		Lm.SendRequest("getDGSPurchase", {
			"purchase": data.purchase
		}, function(response) {
			if (!response.errorCode) {
				data.buyer = response.buyer;
			} else {
				data.buyer = false;
			}
		}, false);

		if (data.buyer === false) {
			return {
				"error": $.t("error_purchase")
			};
		}

		if (data.message) {
			data.add_message = true;
			data.encrypt_message = true;
		}

		delete data.buyer;

		return {
			"data": data
		};
	}

	function DgsDeliveryForm($modal) {
		var data = Lm.GetFormData($modal.find("form:first"));

		Lm.SendRequest("getDGSPurchase", {
			"purchase": data.purchase
		}, function(response) {
			if (!response.errorCode) {
				data.buyer = response.buyer;
			} else {
				data.buyer = false;
			}
		}, false);

		if (data.buyer === false) {
			return {
				"error": $.t("error_purchase")
			};
		}

		if (data.data) {
			try {
				var encrypted = Lm.EncryptNote(data.data, {
					"account": data.buyer
				}, data.secretPhrase);

				data.goodsData = encrypted.message;
				data.goodsNonce = encrypted.nonce;
				data.goodsIsText = "true";
			} catch (err) {
				return {
					"error": err.message
				};
			}
		}

		delete data.buyer;
		delete data.data;

		return {
			"data": data
		};
	}

	function DgsQuantityChangeForm($modal) {
		var data = Lm.GetFormData($modal.find("form:first"));

		Lm.SendRequest("getDGSGood", {
			"goods": data.goods
		}, function(response) {
			if (!response.errorCode) {
				if (data.quantity == response.quantity) {
					data.deltaQuantity = "0";
				} else {
					var quantityA = new BigInteger(String(data.quantity));
					var quantityB = new BigInteger(String(response.quantity));

					if (quantityA.compareTo(quantityB) > 0) {
						data.deltaQuantity = quantityA.subtract(quantityB).toString();
					} else {
						data.deltaQuantity = "-" + quantityB.subtract(quantityA).toString();
					}
				}
			} else {
				data.deltaQuantity = false;
			}
		}, false);

		if (data.deltaQuantity === false) {
			return {
				"error": $.t("error_goods")
			};
		}

		if (data.deltaQuantity == "0") {
			return {
				"error": $.t("error_quantity_no_change")
			};
		}

		delete data.quantity;

		return {
			"data": data
		};
	}

	function DgsQuantityChangeCompleteForm(response, data) {
		if (response.alreadyProcessed) {
			return;
		}

		var quantityField = $("#my_dgs_listings_table tr[data-goods=" + String(data.goods).escapeHTML() + "]").addClass("tentative").find(".quantity");

		quantityField.html(quantityField.html() + (String(data.deltaQuantity).charAt(0) != "-" ? "+" : "") + Lm.Format(data.deltaQuantity));
	}

	function DgsPriceChangeCompleteForm(response, data) {
		if (response.alreadyProcessed) {
			return;
		}

		$("#my_dgs_listings_table tr[data-goods=" + String(data.goods).escapeHTML() + "]").addClass("tentative").find(".price").html(Lm.FormatAmount(data.priceMilliLm) + " Lm");
	}

	function DgsRefundCompleteForm(response, data) {
		if (response.alreadyProcessed) {
			return;
		}

		if (Lm.CurrentPage == "completed_orders_dgs") {
			var $row = $("#completed_orders_dgs_contents div[data-purchase=" + String(data.purchase).escapeHTML() + "]");
			if ($row.length) {
				$row.addClass("tentative");
				$row.find("span.order_status").html($.t("refunded"));
			}
		}
	}

	function DgsDeliveryCompleteForm(response, data) {
		if (response.alreadyProcessed) {
			return;
		}

		if (Lm.CurrentPage == "pending_orders_dgs") {
			$("#pending_orders_dgs_contents div[data-purchase=" + String(data.purchase).escapeHTML() + "]").addClass("tentative").find("span.delivery").html($.t("delivered"));
		}
	}

	function DgsModal1_OnShow(th, e) {
		var $modal = th;
		var $invoker = $(e.relatedTarget);

		var type = $modal.attr("id");

		var purchase = $invoker.data("purchase");

		$modal.find("input[name=purchase]").val(purchase);

		Lm.SendRequest("getDGSPurchase", {
			"purchase": purchase
		}, function(response) {
			if (response.errorCode) {
				e.preventDefault();
				$.growl($.t("error_purchase"), {
					"type": "danger"
				});
			} else {
				Lm.SendRequest("getDGSGood", {
					"goods": response.goods
				}, function(good) {
					if (response.errorCode) {
						e.preventDefault();
						$.growl($.t("error_products"), {
							"type": "danger"
						});
					} else {
						var output = "<table>";
						output += "<tr><th style='width:85px;'><strong>" + $.t("product") + "</strong>:</th><td>" + String(good.name).escapeHTML() + "</td></tr>";
						output += "<tr><th><strong>" + $.t("price") + "</strong>:</th><td>" + Lm.FormatAmount(response.priceMilliLm) + " Lm</td></tr>";
						output += "<tr><th><strong>" + $.t("quantity") + "</strong>:</th><td>" + Lm.Format(response.quantity) + "</td></tr>";

						if (type == "dgs_refund_modal" || type == "dgs_delivery_modal" || type == "dgs_feedback_modal") {
							if (response.seller == Lm.Account) {
								$modal.find("input[name=recipient]").val(response.buyerRS);
							} else {
								$modal.find("input[name=recipient]").val(response.sellerRS);
							}
							if (response.quantity != "1") {
								var orderTotal = Lm.FormatAmount(new BigInteger(String(response.quantity)).multiply(new BigInteger(String(response.priceMilliLm))));
								output += "<tr><th><strong>" + $.t("total") + "</strong>:</th><td>" + orderTotal + " Lm</td></tr>";
							}
							if (response.discountMilliLm && (type == "dgs_refund_modal" || type == "dgs_feedback_modal")) {
								output += "<tr><th><strong>" + $.t("discount") + "</strong>:</th><td>" + Lm.FormatAmount(response.discountMilliLm) + " Lm</td></tr>";
							}
						}

						if (response.seller == Lm.Account) {
							output += "<tr><th><strong>" + $.t("buyer") + "</strong>:</th><td><a href='#' data-user='" +
								Lm.GetAccountFormatted(response, "buyer") + "' class='user_info'>" +
								Lm.GetAccountTitle(response, "buyer") + "</a></td></tr>";
						} else {
							output += "<tr><th><strong>" + $.t("seller") + "</strong>:</th><td><a href='#' data-user='" +
								Lm.GetAccountFormatted(response, "seller") + "' class='user_info'>" +
								Lm.GetAccountTitle(response, "seller") + "</a></td></tr>";
						}

						if (type == "dgs_view_refund_modal") {
							output += "<tr><th><strong>" + $.t("refund_price") + "</strong>:</th><td>" +
								Lm.FormatAmount(response.refundMilliLm) + " Lm</td></tr>";
						}

						if (response.note && (type == "dgs_view_purchase_modal" || type == "dgs_delivery_modal")) {
							output += "<tr><th><strong>" + $.t("note") + "</strong>:</th><td id='" + type + "_note'></td></tr>";
						}

						output += "</table>";

						$modal.find(".purchase_info").html(output);

						if (response.note && (type == "dgs_view_purchase_modal" || type == "dgs_delivery_modal")) {
							try {
								Lm.TryToDecrypt(response, {
									"note": ""
								}, (response.buyer == Lm.Account ? response.seller : response.buyer), {
									"identifier": "purchase",
									"formEl": "#" + type + "_note",
									"outputEl": "#" + type + "_note",
									"showFormOnClick": true
								});
							} catch (err) {
								response.note = String(err.message);
							}
						}

						if (type == "dgs_refund_modal") {
							var orderTotal = new BigInteger(String(response.quantity)).multiply(new BigInteger(String(response.priceMilliLm)));
							var refund = orderTotal.subtract(new BigInteger(String(response.discountMilliLm)));

							$("#dgs_refund_purchase").val(response.purchase);
							$("#dgs_refund_refund").val(Lm.ConvertToLm(refund));
						} else if (type == "dgs_view_purchase_modal") {
							var $btn = $modal.find("button.btn-primary");
							$btn.data("purchase", response.purchase);
						} else if (type == "dgs_view_refund_modal") {
							Lm.TryToDecrypt(response, {
								"refundNote": $.t("Refund Note")
							}, (response.buyer == Lm.Account ? response.seller : response.buyer), {
								"identifier": "purchase",
								"noPadding": true,
								"formEl": "#dgs_view_refund_output",
								"outputEl": "#dgs_view_refund_output"
							});
						} else if (type == "dgs_view_delivery_modal") {
							if (response.pending) {
								e.preventDefault();
								$.growl($.t("error_goods_not_yet_delivered"), {
									"type": "warning"
								});
								return;
							}

							var fieldsToDecrypt = {
								"goodsData": "Data"
							};

							if (response.feedbackNote) {
								fieldsToDecrypt["feedbackNote"] = $.t("feedback_given");
							}

							if (response.refundNote) {
								fieldsToDecrypt["refundNote"] = $.t("refund_note");
							}

							Lm.TryToDecrypt(response, fieldsToDecrypt, (response.buyer == Lm.Account ? response.seller : response.buyer), {
								"identifier": "purchase",
								"noPadding": true,
								"formEl": "#dgs_view_delivery_output",
								"outputEl": "#dgs_view_delivery_output"
							});

							if (type == "dgs_view_delivery_modal") {
								if (!response.pending && !response.goodsData) {
									var currentTime = (new Date() - Date.UTC(2013, 10, 24, 12, 0, 0, 0)) / 1000;
									if (response.deliveryDeadlineTimestamp < currentTime) {
										$("#dgs_view_delivery_output").append("<div class='callout callout-danger' style='margin-bottom:0'>" + $.t("purchase_not_delivered_in_time") + "</div>");
									} else {
										$("#dgs_view_delivery_output").append("<div class='callout callout-danger' style='margin-bottom:0'>" + $.t("purchase_failed") + "</div>");
									}
								}
							}

							var $btn = $modal.find("button.btn-primary:not([data-ignore=true])");

							if (!response.feedbackNote) {
								if (Lm.Account == response.buyer) {
									$btn.data("purchase", response.purchase);
									$btn.attr("data-target", "#dgs_feedback_modal");
									$btn.html($.t("give_feedback"));
									$btn.show();
								} else {
									$btn.hide();
								}
							} else {
								$btn.hide();
							}

							if (!response.refundNote && Lm.Account == response.seller) {
								$btn.data("purchase", response.purchase);
								$btn.attr("data-target", "#dgs_refund_modal");
								$btn.html($.t("refund_purchase"));
								$btn.show();
							}
						}
					}
				}, false);
			}
		}, false);
	}
	
	function DgsModal1_OnHidden(th, e) {
		var type = th.attr("id");

		Lm.RemoveDecryptionForm(th);

		th.find(".purchase_info").html($.t("loading"));

		if (type == "dgs_refund_modal") {
			$("#dgs_refund_purchase").val("");
		} else if (type == "dgs_view_delivery_modal") {
			$("#dgs_delivery_purchase").val("");
			$("#dgs_view_delivery_output").empty();
			th.find("button.btn-primary").data("purchase", "");
		}
	}

	function DgsModal2_OnShow(th, e) {
		var $modal = th;
		var $invoker = $(e.relatedTarget);

		var type = $modal.attr("id");

		if (!$invoker.length) {
			var goods = _goodsToShow;
			_goodsToShow = 0;
		} else {
			var goods = $invoker.data("goods");
		}

		$modal.find("input[name=goods]").val(goods);

		Lm.SendRequest("getDGSGood", {
			"goods": goods
		}, function(response) {
			if (response.errorCode) {
				e.preventDefault();
				$.growl($.t("error_goods"), {
					"type": "danger"
				});
			} else {
				var output = "<table>";
				output += "<tr><th style='width:85px'><strong>" + $.t("product") + "</strong>:</th><td>" + String(response.name).escapeHTML() + "</td></tr>";
				output += "<tr><th><strong>" + $.t("price") + "</strong>:</th><td>" + Lm.FormatAmount(response.priceMilliLm) + " Lm</td></tr>";
				output += "<tr><th><strong>" + $.t("seller") + "</strong>:</th>" +
					"<td><a href='#' data-user='" + Lm.GetAccountFormatted(response, "seller") + "' class='user_info'>" +
					Lm.GetAccountTitle(response, "seller") + "</a></td></tr>";
				output += "<tr><th><strong>" + $.t("quantity") + "</strong>:</th><td>" + Lm.Format(response.quantity) + "</td></tr>";

				if (type == "dgs_purchase_modal" || type == "dgs_product_modal") {
					output += "<tr><td colspan='2'><div style='max-height:150px;overflow:auto;'>" + String(response.description).escapeHTML().nl2br() + "</div></td></tr>";
				}

				output += "</table>";
			}

			$modal.find(".goods_info").html(output);

			if (type == "dgs_quantity_change_modal") {
				$("#dgs_quantity_change_current_quantity, #dgs_quantity_change_quantity").val(String(response.quantity).escapeHTML());
			} else if (type == "dgs_price_change_modal") {
				$("#dgs_price_change_current_price, #dgs_price_change_price").val(Lm.ConvertToLm(response.priceMilliLm).escapeHTML());
			} else if (type == "dgs_purchase_modal") {
				$modal.find("input[name=recipient]").val(response.sellerRS);

				$("#dgs_purchase_price").val(String(response.priceMilliLm).escapeHTML());
				$("#dgs_total_purchase_price").html(Lm.FormatAmount(response.priceMilliLm) + " Lm");

				$("#dgs_purchase_quantity").on("change", function() {
					var totalMilliLm = new BigInteger(response.priceMilliLm).multiply(new BigInteger(String(th.val()))).toString();
					$("#dgs_total_purchase_price").html(Lm.FormatAmount(totalMilliLm) + " Lm");
				});
			}
		}, false);
	}

	function DgsModal2_OnHidden(th, e) {
		$("#dgs_purchase_quantity").off("change");

		Lm.RemoveDecryptionForm(th);

		th.find(".goods_info").html($.t("loading"));
		$("#dgs_quantity_change_current_quantity, #dgs_price_change_current_price, #dgs_quantity_change_quantity, #dgs_price_change_price").val("0");
	}

	function DgsSearch_OnSubmit(th, e) {
		e.preventDefault();

		var seller = $.trim(th.find("input[name=q]").val());

		$(".dgs_search input[name=q]").val(seller);

		if (seller == "") {
			Lm.Pages.DgsSearch();
		} else if (/^(LMA\-)/i.test(seller)) {
			var address = new LmAddress();

			if (!address.set(seller)) {
				$.growl($.t("error_invalid_seller"), {
					"type": "danger"
				});
			} else {
				Lm.Pages.DgsSearch();
			}
		} else {
			$.growl($.t("error_invalid_seller"), {
				"type": "danger"
			});
		}
	}

	function DgsClearResults_OnClick(e) {
		e.preventDefault();

		$(".dgs_search input[name=q]").val("").trigger("unmask").mask("LMA-****-****-****-*****", {
			"unmask": false
		});

		Lm.Pages.DgsSearch();
	}

	function UserInfoModal_OnClick(th, e) {
		e.preventDefault();

		var $visible_modal = $(".modal.in");

		if ($visible_modal.length) {
			$visible_modal.modal("hide");
		}

		Lm.GoToGoods(th.data("seller"), th.data("goto-goods"));
	}

	function GoToGoods(seller, goods) {
		$(".dgs_search input[name=q]").val(seller);

		Lm.GoToPage("dgs_search", function() {
			_goodsToShow = goods;
			$("#dgs_purchase_modal").modal("show");
		});
	}


	$("#dgs_refund_modal, #dgs_delivery_modal, #dgs_feedback_modal, #dgs_view_purchase_modal, #dgs_view_delivery_modal, #dgs_view_refund_modal").on("show.bs.modal", function(e) {
		DgsModal1_OnShow($(this), e);
	}).on("hidden.bs.modal", function(e) {
		DgsModal1_OnHidden($(this), e);
	});

	$("#dgs_product_modal, #dgs_delisting_modal, #dgs_quantity_change_modal, #dgs_price_change_modal, #dgs_purchase_modal").on("show.bs.modal", function(e) {
		DgsModal2_OnShow($(this), e);
	}).on("hidden.bs.modal", function(e) {
		DgsModal2_OnHidden($(this), e);
	});

	$(".dgs_search").on("submit", function(e) {
		DgsSearch_OnSubmit($(this), e);
	});

	$("#dgs_clear_results").on("click", DgsClearResults_OnClick);

	$("#user_info_modal").on("click", "a[data-goto-goods]", function(e) {
		UserInfoModal_OnClick($(this), e);
	});


	Lm.GetMarketplaceItemHTML = GetMarketplaceItemHtml;
	Lm.GetMarketplacePurchaseHTML = GetMarketplacePurchaseHtml;
	Lm.GetMarketplacePendingOrderHTML = GetMarketplacePendingOrderHtml;
	Lm.Pages.DgsSearch = DgsSearchPage;
	Lm.Pages.PurchasedDgs = PurchasedDgsPage;
	Lm.Incoming.PurchasedDgs = PurchasedDgsIncoming;
	Lm.Pages.CompletedOrdersDgs = CompletedOrdersDgsPage;
	Lm.Incoming.CompletedOrdersDgs = CompletedOrdersDgsIncoming;
	Lm.Pages.PendingOrdersDgs = PendingOrdersDgsPage;
	Lm.Incoming.PendingOrdersDgs = PendingOrdersDgsIncoming;
	Lm.Pages.MyDgsListings = MyDgsListingsPage;
	Lm.Incoming.My_dgs_listings = MyDgsListingsIncoming;
	Lm.Forms.DgsListing = DgsListingForm;
	Lm.Forms.DgsListingComplete = DgsListingCompleteForm;
	Lm.Forms.DgsDelistingComplete = DgsDelistingCompleteForm;
	Lm.Forms.DgsFeedback = DgsFeedbackForm;
	Lm.Forms.DgsPurchase = DgsPurchaseForm;
	Lm.Forms.DgsRefund = DgsRefundForm;
	Lm.Forms.DgsDelivery = DgsDeliveryForm;
	Lm.Forms.DgsQuantityChange = DgsQuantityChangeForm;
	Lm.Forms.DgsQuantityChangeComplete = DgsQuantityChangeCompleteForm;
	Lm.Forms.DgsPriceChangeComplete = DgsPriceChangeCompleteForm;
	Lm.Forms.DgsRefundComplete = DgsRefundCompleteForm;
	Lm.Forms.DgsDeliveryComplete = DgsDeliveryCompleteForm;
	Lm.GoToGoods = GoToGoods;
	return Lm;
}(Lm || {}, jQuery));