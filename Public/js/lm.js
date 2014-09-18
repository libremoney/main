/**
 * @depends {jquery.js}
 * @depends {bootstrap.js}
 * @depends {big.js}
 * @depends {jsbn.js}
 * @depends {jsbn2.js}
 * @depends {pako.js}
 * @depends {webdb.js}
 * @depends {ajaxmultiqueue.js}
 * @depends {growl.js}
 * @depends {crypto/curve25519.js}
 * @depends {crypto/curve25519_.js}
 * @depends {crypto/passphrasegenerator.js}
 * @depends {crypto/sha256worker.js}
 * @depends {crypto/aes.js}
 * @depends {crypto/sha256.js}
 * @depends {crypto/jssha256.js}
 * @depends {crypto/seedrandom.js}
 * @depends {util/converters.js}
 * @depends {util/extensions.js}
 * @depends {util/lmaddress.js}
 */
var Lm = (function(Lm, $, undefined) {
	"use strict";

	Lm.Server = "";
	Lm.State = {};
	Lm.Blocks = [];
	Lm.Genesis = "2391470422895685625";
	Lm.GenesisRS = "LMA-TVZT-PRDS-FB8M-4P3E4";

	Lm.Account = "";
	Lm.AccountRS = ""
	Lm.PublicKey = "";
	Lm.AccountInfo = {};

	Lm.Database = null;
	Lm.DatabaseSupport = false;

	Lm.Settings = {};
	Lm.Contacts = {};

	Lm.IsTestNet = false;
	Lm.IsLocalHost = false;
	Lm.IsForging = false;
	Lm.IsLeased = false;

	Lm.LastBlockHeight = 0;
	Lm.DownloadingBlockchain = false;

	Lm.RememberPassword = false;
	Lm.SelectedContext = null;

	Lm.CurrentPage = "dashboard";
	Lm.CurrentSubPage = "";
	Lm.PageNumber = 1;
	Lm.ItemsPerPage = 50;

	Lm.Pages = {};
	Lm.Incoming = {};

	Lm.HasLocalStorage = true;
	Lm.InApp = false;
	Lm.AppVersion = "";
	Lm.AppPlatform = "";
	Lm.AssetTableKeys = [];

	Lm.DgsBlockPassed = false;
	Lm.PKAnnouncementBlockPassed = false;

	Lm.DebugLevelEnum = {
		None: 0,
		Error: 1,
		Warn: 2,
		Info: 3,
		Sql: 4,
		Comment: 5
	};
	Lm.DebugLevel = Lm.DebugLevelEnum.None;

	var stateInterval;
	var stateIntervalSeconds = 30;
	var isScanning = false;


	function AddPagination(section) {
		var output = "";

		if (Lm.PageNumber == 2) {
			output += "<a href='#' data-page='1'>&laquo; " + $.t("previous_page") + "</a>";
		} else if (Lm.PageNumber > 2) {
			//output += "<a href='#' data-page='1'>&laquo; First Page</a>";
			output += " <a href='#' data-page='" + (Lm.PageNumber - 1) + "'>&laquo; " + $.t("previous_page") + "</a>";
		}
		if (Lm.HasMorePages) {
			if (Lm.PageNumber > 1) {
				output += "&nbsp;&nbsp;&nbsp;";
			}
			output += " <a href='#' data-page='" + (Lm.PageNumber + 1) + "'>" + $.t("next_page") + " &raquo;</a>";
		}

		var $paginationContainer = $("#" + Lm.CurrentPage + "_page .data-pagination");

		if ($paginationContainer.length) {
			$paginationContainer.html(output);
		}
	}

	function AddToLog(DebLevel, Text) {
		if (DebLevel <= Lm.DebugLevel) {
			var div = document.createElement('div');
			$(div).html(Text);
			$('#log').append(div);
		}
	}

	function AlertObj(obj) {
		var str = "";
		var k;
		for (k in obj) {
			str += k+": "+ obj[k]+"\r\n";
		}
		alert(str);
	}

	function CheckAssetDifferences(current_balances, previous_balances) {
		var current_balances_ = {};
		var previous_balances_ = {};

		if (previous_balances.length) {
			for (var k in previous_balances) {
				previous_balances_[previous_balances[k].asset] = previous_balances[k].balanceQNT;
			}
		}

		if (current_balances.length) {
			for (var k in current_balances) {
				current_balances_[current_balances[k].asset] = current_balances[k].balanceQNT;
			}
		}

		var diff = {};

		for (var k in previous_balances_) {
			if (!(k in current_balances_)) {
				diff[k] = "-" + previous_balances_[k];
			} else if (previous_balances_[k] !== current_balances_[k]) {
				var change = (new BigInteger(current_balances_[k]).subtract(new BigInteger(previous_balances_[k]))).toString();
				diff[k] = change;
			}
		}

		for (k in current_balances_) {
			if (!(k in previous_balances_)) {
				diff[k] = current_balances_[k]; // property is new
			}
		}

		var nr = Object.keys(diff).length;

		if (nr == 0) {
			return;
		} else if (nr <= 3) {
			for (k in diff) {
				Lm.SendRequest("getAsset", {
					"asset": k,
					"_extra": {
						"asset": k,
						"difference": diff[k]
					}
				}, function(asset, input) {
					if (asset.errorCode) {
						return;
					}
					asset.difference = input["_extra"].difference;
					asset.asset = input["_extra"].asset;

					if (asset.difference.charAt(0) != "-") {
						var quantity = Lm.FormatQuantity(asset.difference, asset.decimals)

						if (quantity != "0") {
							$.growl($.t("you_received_assets", {
								"asset": String(asset.asset).escapeHTML(),
								"name": String(asset.name).escapeHTML(),
								"count": quantity
							}), {
								"type": "success"
							});
						}
					} else {
						asset.difference = asset.difference.substring(1);

						var quantity = Lm.FormatQuantity(asset.difference, asset.decimals)

						if (quantity != "0") {
							$.growl($.t("you_sold_assets", {
								"asset": String(asset.asset).escapeHTML(),
								"name": String(asset.name).escapeHTML(),
								"count": quantity
							}), {
								"type": "success"
							});
						}
					}
				});
			}
		} else {
			$.growl($.t("multiple_assets_differences"), {
				"type": "success"
			});
		}
	}

	function CheckIfOnAFork() {
		if (!Lm.DownloadingBlockchain) {
			var onAFork = true;

			if (Lm.Blocks && Lm.Blocks.length >= 10) {
				for (var i = 0; i < 10; i++) {
					if (Lm.Blocks[i].generator != Lm.Account) {
						onAFork = false;
						break;
					}
				}
			}

			if (onAFork) {
				$.growl($.t("fork_warning"), {
					"type": "danger"
				});
			}
		}
	}

	function CheckLocationHash(password) {
		if (window.location.hash) {
			var hash = window.location.hash.replace("#", "").split(":")

			if (hash.length == 2) {
				if (hash[0] == "message") {
					var $modal = $("#send_message_modal");
				} else if (hash[0] == "send") {
					var $modal = $("#send_money_modal");
				} else if (hash[0] == "asset") {
					Lm.GoToAsset(hash[1]);
					return;
				} else {
					var $modal = "";
				}

				if ($modal) {
					var account_id = String($.trim(hash[1]));
					if (!/^\d+$/.test(account_id) && account_id.indexOf("@") !== 0) {
						account_id = "@" + account_id;
					}

					$modal.find("input[name=recipient]").val(account_id.unescapeHTML()).trigger("blur");
					if (password && typeof password == "string") {
						$modal.find("input[name=secretPhrase]").val(password);
					}
					$modal.modal("show");
				}
			}

			window.location.hash = "#";
		}
	}

	function CreateDatabase(callback) {
		var schema = {
			contacts: {
				id: {
					"primary": true,
					"autoincrement": true,
					"type": "NUMBER"
				},
				name: "VARCHAR(100) COLLATE NOCASE",
				email: "VARCHAR(200)",
				account: "VARCHAR(25)",
				accountRS: "VARCHAR(25)",
				description: "TEXT"
			},
			assets: {
				account: "VARCHAR(25)",
				accountRS: "VARCHAR(25)",
				asset: {
					"primary": true,
					"type": "VARCHAR(25)"
				},
				description: "TEXT",
				name: "VARCHAR(10)",
				decimals: "NUMBER",
				quantityQNT: "VARCHAR(15)",
				groupName: "VARCHAR(30) COLLATE NOCASE"
			},
			data: {
				id: {
					"primary": true,
					"type": "VARCHAR(40)"
				},
				contents: "TEXT"
			}
		};

		Lm.AssetTableKeys = ["account", "accountRS", "asset", "description", "name", "position", "decimals", "quantityQNT", "groupName"];

		try {
			Lm.Database = new WebDB("LM_USER_DB", schema, 2, 4, function(error, db) {
				if (!error) {
					Lm.DatabaseSupport = true;

					Lm.LoadContacts();

					Lm.Database.select("data", [{
						"id": "asset_exchange_version"
					}], function(error, result) {
						if (!result || !result.length) {
							Lm.Database.delete("assets", [], function(error, affected) {
								if (!error) {
									Lm.Database.insert("data", {
										"id": "asset_exchange_version",
										"contents": 2
									});
								}
							});
						}
					});

					Lm.Database.select("data", [{
						"id": "closed_groups"
					}], function(error, result) {
						if (result && result.length) {
							Lm.ClosedGroups = result[0].contents.split("#");
						} else {
							Lm.Database.insert("data", {
								id: "closed_groups",
								contents: ""
							});
						}
					});
					if (callback) {
						callback();
					}
				} else {
					if (callback) {
						callback();
					}
				}
			});
		} catch (err) {
			Lm.Database = null;
			Lm.DatabaseSupport = false;
			if (callback) {
				callback();
			}
		}
	}

	function GetAccountInfo(firstRun, callback) {
		Lm.SendRequest("getAccount", {
			"account": Lm.Account
		}, function(response) {
			var previousAccountInfo = Lm.AccountInfo;

			Lm.AccountInfo = response;

			if (response.errorCode) {
				$("#account_balance, #account_forged_balance").html("0");
				$("#account_nr_assets").html("0");

				if (Lm.AccountInfo.errorCode == 5) {
					if (Lm.DownloadingBlockchain) {
						if (Lm.NewlyCreatedAccount) {
							$("#dashboard_message").addClass("alert-success").removeClass("alert-danger").html($.t("status_new_account", {
								"account_id": String(Lm.AccountRS).escapeHTML(),
								"public_key": String(Lm.PublicKey).escapeHTML()
							}) + "<br /><br />" + $.t("status_blockchain_downloading")).show();
						} else {
							$("#dashboard_message").addClass("alert-success").removeClass("alert-danger").html($.t("status_blockchain_downloading")).show();
						}
					} else if (Lm.State && Lm.State.isScanning) {
						$("#dashboard_message").addClass("alert-danger").removeClass("alert-success").html($.t("status_blockchain_rescanning")).show();
					} else {
						$("#dashboard_message").addClass("alert-success").removeClass("alert-danger").html($.t("status_new_account", {
							"account_id": String(Lm.AccountRS).escapeHTML(),
							"public_key": String(Lm.PublicKey).escapeHTML()
						})).show();
					}
				} else {
					$("#dashboard_message").addClass("alert-danger").removeClass("alert-success").html(Lm.AccountInfo.errorDescription ? Lm.AccountInfo.errorDescription.escapeHTML() : $.t("error_unknown")).show();
				}
			} else {
				if (Lm.AccountRS && Lm.AccountInfo.accountRS != Lm.AccountRS) {
					$.growl("Generated Reed Solomon address different from the one in the blockchain!", {
						"type": "danger"
					});
					Lm.AccountRS = Lm.AccountInfo.accountRS;
				}

				if (Lm.DownloadingBlockchain) {
					$("#dashboard_message").addClass("alert-success").removeClass("alert-danger").html($.t("status_blockchain_downloading")).show();
				} else if (Lm.State && Lm.State.isScanning) {
					$("#dashboard_message").addClass("alert-danger").removeClass("alert-success").html($.t("status_blockchain_rescanning")).show();
				} else if (!Lm.AccountInfo.publicKey) {
					$("#dashboard_message").addClass("alert-danger").removeClass("alert-success").html($.t("no_public_key_warning") + " " + $.t("public_key_actions")).show();
				} else {
					$("#dashboard_message").hide();
				}

				//only show if happened within last week
				var showAssetDifference = (!Lm.DownloadingBlockchain || (Lm.Blocks && Lm.Blocks[0] && Lm.State && Lm.State.time - Lm.Blocks[0].timestamp < 60 * 60 * 24 * 7));

				if (Lm.DatabaseSupport) {
					Lm.Database.select("data", [{
						"id": "asset_balances_" + Lm.Account
					}], function(error, asset_balance) {
						if (asset_balance && asset_balance.length) {
							var previous_balances = asset_balance[0].contents;

							if (!Lm.AccountInfo.assetBalances) {
								Lm.AccountInfo.assetBalances = [];
							}

							var current_balances = JSON.stringify(Lm.AccountInfo.assetBalances);

							if (previous_balances != current_balances) {
								if (previous_balances != "undefined" && typeof previous_balances != "undefined") {
									previous_balances = JSON.parse(previous_balances);
								} else {
									previous_balances = [];
								}
								Lm.Database.update("data", {
									contents: current_balances
								}, [{
									id: "asset_balances_" + Lm.Account
								}]);
								if (showAssetDifference) {
									Lm.CheckAssetDifferences(Lm.AccountInfo.assetBalances, previous_balances);
								}
							}
						} else {
							Lm.Database.insert("data", {
								id: "asset_balances_" + Lm.Account,
								contents: JSON.stringify(Lm.AccountInfo.assetBalances)
							});
						}
					});
				} else if (showAssetDifference && previousAccountInfo && previousAccountInfo.assetBalances) {
					var previousBalances = JSON.stringify(previousAccountInfo.assetBalances);
					var currentBalances = JSON.stringify(Lm.AccountInfo.assetBalances);

					if (previousBalances != currentBalances) {
						Lm.CheckAssetDifferences(Lm.AccountInfo.assetBalances, previousAccountInfo.assetBalances);
					}
				}

				$("#account_balance").html(Lm.FormatStyledAmount(response.unconfirmedBalanceMilliLm));
				$("#account_forged_balance").html(Lm.FormatStyledAmount(response.forgedBalanceMilliLm));

				var nr_assets = 0;

				if (response.assetBalances) {
					for (var i = 0; i < response.assetBalances.length; i++) {
						if (response.assetBalances[i].balanceQNT != "0") {
							nr_assets++;
						}
					}
				}

				$("#account_nr_assets").html(nr_assets);

				if (Lm.LastBlockHeight) {
					var isLeased = Lm.LastBlockHeight >= Lm.AccountInfo.currentLeasingHeightFrom;
					if (isLeased != Lm.IsLeased) {
						var leasingChange = true;
						Lm.IsLeased = isLeased;
					}
				} else {
					var leasingChange = false;
				}

				if (leasingChange ||
					(response.currentLeasingHeightFrom != previousAccountInfo.currentLeasingHeightFrom) ||
					(response.lessors && !previousAccountInfo.lessors) ||
					(!response.lessors && previousAccountInfo.lessors) ||
					(response.lessors && previousAccountInfo.lessors && response.lessors.sort().toString() != previousAccountInfo.lessors.sort().toString())) {
					Lm.UpdateAccountLeasingStatus();
				}

				if (response.name) {
					$("#account_name").html(response.name.escapeHTML()).removeAttr("data-i18n");
				}
			}

			if (firstRun) {
				$("#account_balance, #account_forged_balance, #account_nr_assets").removeClass("loading_dots");
			}

			if (callback) {
				callback();
			}
		});
	}

	function GetState(callback) {
		Lm.SendRequest("getBlockchainStatus", function(response) {
			if (response.errorCode) {
				//todo
			} else {
				var firstTime = !("lastBlock" in Lm.State);
				var previousLastBlock = (firstTime ? "0" : Lm.State.lastBlock);

				Lm.State = response;

				if (firstTime) {
					$("#lm_version").html(Lm.State.version).removeClass("loading_dots");
					Lm.GetBlock(Lm.State.lastBlock, Lm.HandleInitialBlocks);
				} else if (Lm.State.isScanning) {
					//do nothing but reset Lm.State so that when isScanning is done, everything is reset.
					isScanning = true;
				} else if (isScanning) {
					//rescan is done, now we must reset everything...
					isScanning = false;
					Lm.Blocks = [];
					Lm.TempBlocks = [];
					Lm.GetBlock(Lm.State.lastBlock, Lm.HandleInitialBlocks);
					if (Lm.Account) {
						Lm.GetInitialTransactions();
						Lm.GetAccountInfo();
					}
				} else if (previousLastBlock != Lm.State.lastBlock) {
					Lm.TempBlocks = [];
					if (Lm.Account) {
						Lm.GetAccountInfo();
					}
					Lm.GetBlock(Lm.State.lastBlock, Lm.HandleNewBlocks);
					if (Lm.Account) {
						Lm.GetNewTransactions();
					}
				} else {
					if (Lm.Account) {
						Lm.GetUnconfirmedTransactions(function(unconfirmedTransactions) {
							Lm.HandleIncomingTransactions(unconfirmedTransactions, false);
						});
					}
					//only done so that download progress meter updates correctly based on lastFeederHeight
					if (Lm.DownloadingBlockchain) {
						Lm.UpdateBlockchainDownloadProgress();
					}
				}

				if (callback) {
					callback();
				}
			}
		});
	}

	function GetVersion(callback) {
		Lm.SendRequest("getVersion", function(response) {
			if (response.errorCode) {
				$("#lm_version_header").html('Er: '+response.errorCode);
			} else {
				var version = response.version;
				$("#lm_version_header").html('v.'+version);
				if (callback) callback();
			}
		});
	}

	function GoToPage(page, callback) {
		var $link = $("ul.sidebar-menu a[data-page=" + page + "]");

		if ($link.length > 1) {
			if ($link.last().is(":visible")) {
				$link = $link.last();
			} else {
				$link = $link.first();
			}
		}

		if ($link.length == 1) {
			if (callback) {
				$link.trigger("click", [{
					"callback": callback
				}]);
			} else {
				$link.trigger("click");
			}
		} else {
			Lm.CurrentPage = page;
			Lm.CurrentSubPage = "";
			Lm.PageNumber = 1;
			Lm.ShowPageNumbers = false;

			$("ul.sidebar-menu a.active").removeClass("active");
			$(".page").hide();
			$("#" + page + "_page").show();
			if (Lm.Pages[page]) {
				Lm.PageLoading();
				Lm.Pages[page](callback);
			}
		}
	}

	function GoToPageNumber(pageNumber) {
		Lm.PageNumber = pageNumber;
		Lm.PageLoading();
		Lm.Pages[Lm.CurrentPage]();
	}

	function Init() {
		$('.left-side').toggleClass("collapse-left");
		$(".right-side").toggleClass("strech");
		Lm.GetVersion();

		if (window.location.port && window.location.port != "6876") {
			$(".testnet_only").hide();
		} else {
			Lm.IsTestNet = true;
			$(".testnet_only, #testnet_login, #testnet_warning").show();
		}

		if (!Lm.Server) {
			var hostName = window.location.hostname.toLowerCase();
			Lm.IsLocalHost = hostName == "localhost" || hostName == "127.0.0.1" || Lm.IsPrivateIP(hostName);
		}

		if (!Lm.IsLocalHost) {
			$(".remote_warning").show();
		}

		try {
			window.localStorage;
		} catch (err) {
			Lm.HasLocalStorage = false;
		}

		if (Lm.GetCookie("remember_passphrase")) {
			$("#remember_password").prop("checked", true);
		}

		Lm.CreateDatabase(function() {
			Lm.GetSettings();
		});

		Lm.ShowLockscreen();

		if (window.parent) {
			var match = window.location.href.match(/\?app=?(win|mac|lin)?\-?([\d\.]+)?/i);

			if (match) {
				Lm.InApp = true;
				if (match[1]) {
					Lm.AppPlatform = match[1];
				}
				if (match[2]) {
					Lm.AppVersion = match[2];
				}

				if (!Lm.AppPlatform || Lm.AppPlatform == "mac") {
					var macVersion = navigator.userAgent.match(/OS X 10_([0-9]+)/i);
					if (macVersion && macVersion[1]) {
						macVersion = parseInt(macVersion[1]);

						if (macVersion < 9) {
							$(".modal").removeClass("fade");
						}
					}
				}

				$("#show_console").hide();

				parent.postMessage("loaded", "*");

				window.addEventListener("message", receiveMessage, false);
			}
		}

		Lm.SetStateInterval(30);

		if (!Lm.IsTestNet) {
			setInterval(Lm.CheckAliasVersions, 1000 * 60 * 60);
		}

		Lm.AllowLoginViaEnter();

		Lm.AutomaticallyCheckRecipient();

		$(".show_popover").popover({
			"trigger": "hover"
		});

		$("#dashboard_transactions_table, #transactions_table").on("mouseenter", "td.confirmations", function() {
			$(this).popover("show");
		}).on("mouseleave", "td.confirmations", function() {
			$(this).popover("destroy");
			$(".popover").remove();
		});

		_fix();

		$(window).on("resize", function() {
			_fix();

			if (Lm.CurrentPage == "asset_exchange") {
				Lm.PositionAssetSidebar();
			}
		});

		$("[data-toggle='tooltip']").tooltip();

		$(".sidebar .treeview").tree();

		/* Prof1983
		$("#dgs_search_account_top, #dgs_search_account_center").mask("LMA-****-****-****-*****", {
			"unmask": false
		});
		*/
	}

	function LoadPage(page, callback) {
		Lm.PageLoading();
		Lm.Pages[page](callback);
	}

	function PageLoaded(callback) {
		var $currentPage = $("#" + Lm.CurrentPage + "_page");

		$currentPage.find(".content-header h1 .loading_dots").remove();

		if ($currentPage.hasClass("paginated")) {
			Lm.AddPagination();
		}

		if (callback) {
			callback();
		}
	}

	function PageLoading() {
		Lm.HasMorePages = false;

		var $pageHeader = $("#" + Lm.CurrentPage + "_page .content-header h1");
		$pageHeader.find(".loading_dots").remove();
		$pageHeader.append("<span class='loading_dots'><span>.</span><span>.</span><span>.</span></span>");
	}

	function SetStateInterval(seconds) {
		if (seconds == stateIntervalSeconds && stateInterval) {
			return;
		}

		if (stateInterval) {
			clearInterval(stateInterval);
		}

		stateIntervalSeconds = seconds;

		stateInterval = setInterval(function() {
			Lm.GetState();
		}, 1000 * seconds);
	}

	function UpdateAccountLeasingStatus() {
		var accountLeasingLabel = "";
		var accountLeasingStatus = "";

		if (Lm.LastBlockHeight >= Lm.AccountInfo.currentLeasingHeightFrom) {
			accountLeasingLabel = $.t("leased_out");
			accountLeasingStatus = $.t("balance_is_leased_out", {
				"start": String(Lm.AccountInfo.currentLeasingHeightFrom).escapeHTML(),
				"end": String(Lm.AccountInfo.currentLeasingHeightTo).escapeHTML(),
				"account": String(Lm.AccountInfo.currentLessee).escapeHTML()
			});
			$("#lease_balance_message").html($.t("balance_leased_out_help"));
		} else if (Lm.LastBlockHeight < Lm.AccountInfo.currentLeasingHeightTo) {
			accountLeasingLabel = $.t("leased_soon");
			accountLeasingStatus = $.t("balance_will_be_leased_out", {
				"start": String(Lm.AccountInfo.currentLeasingHeightFrom).escapeHTML(),
				"end": String(Lm.AccountInfo.currentLeasingHeightTo).escapeHTML(),
				"account": String(Lm.AccountInfo.currentLessee).escapeHTML()
			});
			$("#lease_balance_message").html($.t("balance_leased_out_help"));
		} else {
			accountLeasingStatus = $.t("balance_not_leased_out");
			$("#lease_balance_message").html($.t("balance_leasing_help"));
		}

		if (Lm.AccountInfo.effectiveBalanceLm == 0) {
			$("#forging_indicator").removeClass("forging");
			$("#forging_indicator span").html($.t("not_forging")).attr("data-i18n", "not_forging");
			$("#forging_indicator").show();
			Lm.IsForging = false;
		}

		//no reed solomon available? do it myself? todo
		if (Lm.AccountInfo.lessors) {
			if (accountLeasingLabel) {
				accountLeasingLabel += ", ";
				accountLeasingStatus += "<br /><br />";
			}

			accountLeasingLabel += $.t("x_lessor", {
				"count": Lm.AccountInfo.lessors.length
			});
			accountLeasingStatus += $.t("x_lessor_lease", {
				"count": Lm.AccountInfo.lessors.length
			});

			var rows = "";

			for (var i = 0; i < Lm.AccountInfo.lessors.length; i++) {
				var lessor = Lm.ConvertNumericToRSAccountFormat(Lm.AccountInfo.lessors[i]);

				rows += "<tr><td><a href='#' data-user='" + String(lessor).escapeHTML() + "'>" + Lm.GetAccountTitle(lessor) + "</a></td></tr>";
			}

			$("#account_lessor_table tbody").empty().append(rows);
			$("#account_lessor_container").show();
		} else {
			$("#account_lessor_table tbody").empty();
			$("#account_lessor_container").hide();
		}

		if (accountLeasingLabel) {
			$("#account_leasing").html(accountLeasingLabel).show();
		} else {
			$("#account_leasing").hide();
		}

		if (accountLeasingStatus) {
			$("#account_leasing_status").html(accountLeasingStatus).show();
		} else {
			$("#account_leasing_status").hide();
		}
	}

	function UpdateBlockchainDownloadProgress() {
		if (Lm.State.lastBlockchainFeederHeight && Lm.State.numberOfBlocks < Lm.State.lastBlockchainFeederHeight) {
			var percentage = parseInt(Math.round((Lm.State.numberOfBlocks / Lm.State.lastBlockchainFeederHeight) * 100), 10);
		} else {
			var percentage = 100;
		}

		if (percentage == 100) {
			$("#downloading_blockchain .progress").hide();
		} else {
			$("#downloading_blockchain .progress").show();
			$("#downloading_blockchain .progress-bar").css("width", percentage + "%");
			$("#downloading_blockchain .sr-only").html($.t("percent_complete", {
				"percent": percentage
			}));
		}
	}

	function _fix() {
		var height = $(window).height() - $("body > .header").height();
		//$(".wrapper").css("min-height", height + "px");
		var content = $(".wrapper").height();

		$(".content.content-stretch:visible").width($(".page:visible").width());

		if (content > height) {
			$(".left-side, html, body").css("min-height", content + "px");
		} else {
			$(".left-side, html, body").css("min-height", height + "px");
		}
	}

	$("#logo, .sidebar-menu a").click(function(e, data) {
		if ($(this).hasClass("ignore")) {
			$(this).removeClass("ignore");
			return;
		}

		e.preventDefault();

		if ($(this).data("toggle") == "modal") {
			return;
		}

		var page = $(this).data("page");

		if (page == Lm.CurrentPage) {
			if (data && data.callback) {
				data.callback();
			}
			return;
		}

		$(".page").hide();

		$(document.documentElement).scrollTop(0);

		$("#" + page + "_page").show();

		$(".content-header h1").find(".loading_dots").remove();

		var changeActive = !($(this).closest("ul").hasClass("treeview-menu"));

		if (changeActive) {
			var currentActive = $("ul.sidebar-menu > li.active");

			if (currentActive.hasClass("treeview")) {
				currentActive.children("a").first().addClass("ignore").click();
			} else {
				currentActive.removeClass("active");
			}

			if ($(this).attr("id") && $(this).attr("id") == "logo") {
				$("#dashboard_link").addClass("active");
			} else {
				$(this).parent().addClass("active");
			}
		}

		if (Lm.CurrentPage != "messages") {
			$("#inline_message_password").val("");
		}

		//Lm.PreviousPage = Lm.CurrentPage;
		Lm.CurrentPage = page;
		Lm.CurrentSubPage = "";
		Lm.PageNumber = 1;
		Lm.ShowPageNumbers = false;

		if (Lm.Pages[page]) {
			Lm.PageLoading();

			if (data && data.callback) {
				Lm.Pages[page](data.callback);
			} else if (data) {
				Lm.Pages[page](data);
			} else {
				Lm.Pages[page]();
			}
		}
	});

	$("button.goto-page, a.goto-page").click(function(event) {
		event.preventDefault();

		Lm.GoToPage($(this).data("page"));
	});

	$(".data-pagination").on("click", "a", function(e) {
		e.preventDefault();

		Lm.GoToPageNumber($(this).data("page"));
	});

	$("#id_search").on("submit", function(e) {
		e.preventDefault();

		var id = $.trim($("#id_search input[name=q]").val());

		if (/LMA\-/i.test(id)) {
			Lm.SendRequest("getAccount", {
				"account": id
			}, function(response, input) {
				if (!response.errorCode) {
					response.account = input.account;
					Lm.ShowAccountModal(response);
				} else {
					$.growl($.t("error_search_no_results"), {
						"type": "danger"
					});
				}
			});
		} else {
			if (!/^\d+$/.test(id)) {
				$.growl($.t("error_search_invalid"), {
					"type": "danger"
				});
				return;
			}
			Lm.SendRequest("getTransaction", {
				"transaction": id
			}, function(response, input) {
				if (!response.errorCode) {
					response.transaction = input.transaction;
					Lm.ShowTransactionModal(response);
				} else {
					Lm.SendRequest("getAccount", {
						"account": id
					}, function(response, input) {
						if (!response.errorCode) {
							response.account = input.account;
							Lm.ShowAccountModal(response);
						} else {
							Lm.SendRequest("getBlock", {
								"block": id
							}, function(response, input) {
								if (!response.errorCode) {
									response.block = input.block;
									Lm.ShowBlockModal(response);
								} else {
									$.growl($.t("error_search_no_results"), {
										"type": "danger"
									});
								}
							});
						}
					});
				}
			});
		}
	});


	Lm.AddToLog = AddToLog;
	Lm.AlertObj = AlertObj;
	Lm.AddPagination = AddPagination;
	Lm.CheckAssetDifferences = CheckAssetDifferences;
	Lm.CheckIfOnAFork = CheckIfOnAFork;
	Lm.CheckLocationHash = CheckLocationHash;
	Lm.CreateDatabase = CreateDatabase;
	Lm.GetAccountInfo = GetAccountInfo;
	Lm.GetState = GetState;
	Lm.GetVersion = GetVersion;
	Lm.GoToPage = GoToPage;
	Lm.GoToPageNumber = GoToPageNumber;
	Lm.Init = Init;
	Lm.LoadPage = LoadPage;
	Lm.PageLoaded = PageLoaded;
	Lm.PageLoading = PageLoading;
	Lm.SetStateInterval = SetStateInterval;
	Lm.UpdateAccountLeasingStatus = UpdateAccountLeasingStatus;
	Lm.UpdateBlockchainDownloadProgress = UpdateBlockchainDownloadProgress;
	return Lm;
}(Lm || {}, jQuery));


$(document).ready(function() {
	Lm.Init();
});


function receiveMessage(event) {
	if (event.origin != "file://") {
		return;
	}
	//parent.postMessage("from iframe", "file://");
}