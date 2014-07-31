var Lm = (function(Lm, $, undefined) {
	"use strict";

	Lm.Server = "";
	Lm.State = {};
	Lm.Blocks = [];
	Lm.Genesis = "1739068987193023818";

	Lm.Account = "";
	Lm.AccountRS = ""
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
	Lm.Pages = {};
	Lm.Incoming = {};

	Lm.HasLocalStorage = true;
	Lm.InApp = false;
	Lm.AssetTableKeys = [];

	Lm.DebugLevelEnum = {
		None: 0,
		Error: 1,
		Warn: 2,
		Info: 3,
		Sql: 4,
		Comment: 5
	};
	Lm.DebugLevel = Lm.DebugLevelEnum.None;


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
				previous_balances_[previous_balances[k].Asset] = previous_balances[k].BalanceMilliLm;
			}
		}

		if (current_balances.length) {
			for (var k in current_balances) {
				current_balances_[current_balances[k].Asset] = current_balances[k].BalanceMilliLm;
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

						$.growl("You received <a href='#' data-goto-asset='" + String(asset.asset).escapeHTML() + "'>" + quantity + " " + String(asset.name).escapeHTML() + (quantity == "1" ? " asset" : " assets") + "</a>.", {
							"type": "success"
						});
					} else {
						asset.difference = asset.difference.substring(1);

						var quantity = Lm.FormatQuantity(asset.difference, asset.decimals)

						$.growl("You sold or transferred <a href='#' data-goto-asset='" + String(asset.asset).escapeHTML() + "'>" + quantity + " " + String(asset.name).escapeHTML() + (quantity == "1" ? " asset" : " assets") + "</a>.", {
							"type": "success"
						});
					}
				});
			}
		} else {
			$.growl("Multiple different assets have been sold and/or bought.", {
				"type": "success"
			});
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
			Lm.Database = new WebDB("LM_USER_DB", schema, 1, 4, function(error, db) {
				if (!error) {
					Lm.DatabaseSupport = true;

					Lm.LoadContacts();

					Lm.Database.select("data", [{
						"id": "asset_exchange_version"
					}], function(error, result) {
						if (!result.length) {
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
						if (result.length) {
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
				}
			});
		} catch (err) {
			Lm.Database = null;
			Lm.DatabaseSupport = false;
		}
	}

	function GetAccountInfo(firstRun, callback) {
		Lm.SendRequest("getAccount", {
			"account": Lm.Account
		}, function(response) {
			var previousAccountInfo = Lm.AccountInfo;

			Lm.AccountInfo = response;

			var preferredAccountFormat = (Lm.Settings["reed_solomon"] ? Lm.AccountRS : Lm.Account);
			if (!preferredAccountFormat) {
				preferredAccountFormat = Lm.Account;
			}
			if (response.errorCode) {
				$("#account_balance, #account_forged_balance").html("0");
				$("#account_nr_assets").html("0");

				if (Lm.AccountInfo.errorCode == 5) {
					if (Lm.DownloadingBlockchain) {
						$("#dashboard_message").addClass("alert-success").removeClass("alert-danger").html(
							"The blockchain is currently downloading. Please wait until it is up to date." + 
							(Lm.NewlyCreatedAccount ? " Your account ID is: <strong>" + String(preferredAccountFormat).escapeHTML() + "</strong>" : "")
						).show();
					} else if (Lm.State && Lm.State.isScanning) {
						$("#dashboard_message").addClass("alert-danger").removeClass("alert-success").html(
							"The blockchain is currently rescanning. Please wait until that has completed."
						).show();
					} else {
						$("#dashboard_message").addClass("alert-success").removeClass("alert-danger").html(
							"Welcome to your brand new account. You should fund it with some coins. Your account ID is: <strong>" + String(preferredAccountFormat).escapeHTML() + "</strong>"
						).show();
					}
				} else {
					$("#dashboard_message").addClass("alert-danger").removeClass("alert-success").html(
						Lm.AccountInfo.errorDescription ? Lm.AccountInfo.errorDescription.escapeHTML() : "An unknown error occured."
					).show();
				}
			} else {
				if (Lm.AccountRS && Lm.AccountInfo.accountRS != Lm.AccountRS) {
					$.growl("Generated Reed Solomon address different from the one in the blockchain!", {
						"type": "danger"
					});
					Lm.AccountRS = Lm.AccountInfo.accountRS;
				}

				if (Lm.DownloadingBlockchain) {
					$("#dashboard_message").addClass("alert-success").removeClass("alert-danger").html(
						"The blockchain is currently downloading. Please wait until it is up to date." +
						(Lm.NewlyCreatedAccount ? " Your account ID is: <strong>" + String(preferredAccountFormat).escapeHTML() + "</strong>" : "")
					).show();
				} else if (Lm.State && Lm.State.isScanning) {
					$("#dashboard_message").addClass("alert-danger").removeClass("alert-success").html(
						"The blockchain is currently rescanning. Please wait until that has completed."
					).show();
				} else if (!Lm.AccountInfo.publicKey) {
					$("#dashboard_message").addClass("alert-danger").removeClass("alert-success").html(
						"<b>Warning!</b>: Your account does not have a public key! This means it's not as protected as other accounts. "+
						"You must make an outgoing transaction to fix this issue. "+
						"(<a href='#' data-toggle='modal' data-target='#send_message_modal'>send a message</a>, "+
						"<a href='#' data-toggle='modal' data-target='#register_alias_modal'>buy an alias</a>, "+
						"<a href='#' data-toggle='modal' data-target='#send_money_modal'>send Lm</a>, ...)"
					).show();
				} else {
					$("#dashboard_message").hide();
				}

				//only show if happened within last week
				var showAssetDifference = (!Lm.DownloadingBlockchain || (Lm.Blocks && Lm.Blocks[0] && Lm.State && Lm.State.time - Lm.Blocks[0].timestamp < 1000 * 60 * 60 * 24 * 7));

				if (Lm.DatabaseSupport) {
					Lm.Database.select("data", [{
						"id": "asset_balances_" + Lm.Account
					}], function(error, asset_balance) {
						if (!error && asset_balance.length) {
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

				$("#account_balance").html(Lm.FormatStyledAmount(response.UnconfirmedBalanceMilliLm));
				$("#account_forged_balance").html(Lm.FormatStyledAmount(response.ForgedBalanceMilliLm));

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
					$("#account_name").html(response.name.escapeHTML());
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
				if (!("lastBlock" in Lm.State)) {
					//first time...
					Lm.State = response;

					$("#lm_version").html(Lm.State.version).removeClass("loading_dots");

					Lm.GetBlock(Lm.State.lastBlock, Lm.handleInitialBlocks);
				} else if (Lm.State.isScanning) {
					Lm.Blocks = [];
					Lm.TempBlocks = [];
					Lm.GetBlock(Lm.State.lastBlock, Lm.handleInitialBlocks);
					LM.GetInitialTransactions();
					if (Lm.Account) {
						Lm.GetAccountInfo();
					}
				} else if (Lm.State.lastBlock != response.lastBlock) {
					Lm.TempBlocks = [];
					Lm.State = response;
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

	function GoToPage(page) {
		var $link = $("ul.sidebar-menu a[data-page=" + page + "]");

		if ($link.length) {
			$link.trigger("click");
		} else {
			Lm.CurrentPage = page;
			$("ul.sidebar-menu a.active").removeClass("active");
			$(".page").hide();
			$("#" + page + "_page").show();
			if (Lm.Pages[page]) {
				Lm.Pages[page]();
			}
		}
	}

	function Init() {
		if (location.port && location.port != "6876") {
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

		Lm.CreateDatabase(function() {
			Lm.GetSettings();
		});

		Lm.GetState(function() {
			Lm.CheckAliasVersions();
		});

		Lm.ShowLockscreen();

		if (window.parent && window.location.href.indexOf("?app") != -1) {
			Lm.InApp = true;

			$("#show_console").hide();

			parent.postMessage("loaded", "*");

			window.addEventListener("message", receiveMessage, false);
		}

		//every 30 seconds check for new block..
		setInterval(function() {
			Lm.GetState();
		}, 1000 * 30);

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

		$(window).on("resize.asset", function() {
			if (Lm.CurrentPage == "asset_exchange") {
				Lm.PositionAssetSidebar();
			}
		});
	}

	function PageLoaded(Callback) {
		$("#" + Lm.CurrentPage + "_page .content-header h1").find(".loading_dots").remove();
		if (Callback) {
			Callback();
		}
	}

	function PageLoading() {
		var $pageHeader = $("#" + Lm.CurrentPage + "_page .content-header h1");
		$pageHeader.find(".loading_dots").remove();
		$pageHeader.append("<span class='loading_dots'><span>.</span><span>.</span><span>.</span></span>");
	}

	function SearchSubmit(Element) {
		Element.preventDefault();

		var id = $.trim($("#id_search input[name=q]").val());

		if (/LMA\-/i.test(id)) {
			Lm.SendRequest("getAccount", {
				"account": id
			}, function(response, input) {
				if (!response.errorCode) {
					response.account = input.account;
					Lm.ShowAccountModal(response);
				} else {
					$.growl("Nothing found, please try another query.", {
						"type": "danger"
					});
				}
			});
		} else {
			if (!/^\d+$/.test(id)) {
				$.growl("Invalid input. Search by ID or reed solomon account number.", {
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
									$.growl("Nothing found, please try another query.", {
										"type": "danger"
									});
								}
							});
						}
					});
				}
			});
		}
	}

	function ShowPage(Element, Event, Data) {
		if (Element.hasClass("ignore")) {
			Element.removeClass("ignore");
			return;
		}

		Event.preventDefault();

		if (Element.data("toggle") == "modal") {
			return;
		}

		var page = Element.data("page");

		if (page == Lm.CurrentPage) {
			$(".page").hide();
			$(document.documentElement).scrollTop(0);
			$("#" + page + "_page").show();
			if (Data && Data.callback) {
				Data.callback();
			}
			return;
		}

		$(".page").hide();

		$(document.documentElement).scrollTop(0);

		$("#" + page + "_page").show();

		// Prof1983
		if (page == 'transactions')
			Lm.Pages.Transactions();

		$(".content-header h1").find(".loading_dots").remove();

		var changeActive = !(Element.closest("ul").hasClass("treeview-menu"));

		if (changeActive) {
			var currentActive = $("ul.sidebar-menu > li.active");

			if (currentActive.hasClass("treeview")) {
				currentActive.children("a").first().addClass("ignore").click();
			} else {
				currentActive.removeClass("active");
			}

			if (Element.attr("id") && Element.attr("id") == "logo") {
				$("#dashboard_link").addClass("active");
			} else {
				Element.parent().addClass("active");
			}
		}

		if (Lm.CurrentPage != "messages") {
			$("#inline_message_password").val("");
		}

		//Lm.PreviousPage = Lm.CurrentPage;
		Lm.CurrentPage = page;
		Lm.CurrentSubPage = "";

		if (Lm.Pages[page]) {
			if (Data && Data.callback) {
				Lm.Pages[page](Data.callback);
			} else if (Data) {
				Lm.Pages[page](Data);
			} else {
				Lm.Pages[page]();
			}
		}
	}

	function UpdateAccountLeasingStatus() {
		var accountLeasingLabel = "";
		var accountLeasingStatus = "";

		if (Lm.LastBlockHeight >= Lm.AccountInfo.currentLeasingHeightFrom) {
			accountLeasingLabel = "Leased Out";
			accountLeasingStatus = "Your account effective balance is leased out starting from block " +
				String(Lm.AccountInfo.currentLeasingHeightFrom).escapeHTML() + " until block " +
				String(Lm.AccountInfo.currentLeasingHeightTo).escapeHTML() + " to account <a href='#' data-user='" +
				String(Lm.AccountInfo.currentLessee).escapeHTML() + "' class='user_info'>" +
				String(Lm.AccountInfo.currentLessee).escapeHTML() + "</a>";
			$("#lease_balance_message").html("<strong>Remember</strong>: This lease will take effect after the current lease has ended.");

		} else if (Lm.LastBlockHeight < Lm.AccountInfo.currentLeasingHeightTo) {
			accountLeasingLabel = "Leased Soon";
			accountLeasingStatus = "Your account effective balance will be leased out starting from block " +
			String(Lm.AccountInfo.currentLeasingHeightFrom).escapeHTML() + " until block " +
			String(Lm.AccountInfo.currentLeasingHeightTo).escapeHTML() + " to account <a href='#' data-user='" +
			String(Lm.AccountInfo.currentLessee).escapeHTML() + "' class='user_info'>" +
			String(Lm.AccountInfo.currentLessee).escapeHTML() + "</a>";
			$("#lease_balance_message").html("<strong>Remember</strong>: This lease will take effect after the current lease has ended.");
		} else {
			accountLeasingStatus = "Your account effective balance is not leased out.";
			$("#lease_balance_message").html("<strong>Remember</strong>: Once submitted the lease cannot be cancelled.");
		}

		if (Lm.AccountInfo.EffectiveBalanceLm == 0) {
			$("#forging_indicator").removeClass("forging");
			$("#forging_indicator span").html("Not Forging");
			$("#forging_indicator").show();
			Lm.IsForging = false;
		}

		//no reed solomon available? do it myself? todo
		if (Lm.AccountInfo.lessors) {
			if (accountLeasingLabel) {
				accountLeasingLabel += ", ";
				accountLeasingStatus += "<br /><br />";
			}
			accountLeasingLabel += Lm.AccountInfo.lessors.length + (Lm.AccountInfo.lessors.length == 1 ? " lessor" : "lessors");
			accountLeasingStatus += Lm.AccountInfo.lessors.length + " " + (Lm.AccountInfo.lessors.length == 1 ? "lessor has" : "lessors have") + " leased their effective balance to your account.";

			var rows = "";

			for (var i = 0; i < Lm.AccountInfo.lessors.length; i++) {
				var lessor = Lm.AccountInfo.lessors[i];

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
			$("#downloading_blockchain .progress-bar").css("width", percentage + "%").prop("aria-valuenow", percentage);
			$("#downloading_blockchain .sr-only").html(percentage + "% Complete");
		}
	}


	$("#logo, .sidebar-menu a").click(function(event, data) {
		Lm.ShowPage($(this), event, data);
	});

	$("button.goto-page, a.goto-page").click(function(event) {
		event.preventDefault();
		Lm.GoToPage($(this).data("page"));
	});

	$("#id_search").on("submit", function(e) {
		SearchSubmit(e);
	});


	Lm.AddToLog = AddToLog;
	Lm.AlertObj = AlertObj;
	Lm.CheckAssetDifferences = CheckAssetDifferences;
	Lm.CheckLocationHash = CheckLocationHash;
	Lm.CreateDatabase = CreateDatabase;
	Lm.GetAccountInfo = GetAccountInfo;
	Lm.GetState = GetState;
	Lm.GetVersion = GetVersion;
	Lm.GoToPage = GoToPage;
	Lm.Init = Init;
	Lm.PageLoaded = PageLoaded;
	Lm.PageLoading = PageLoading;
	Lm.SearchSubmit = SearchSubmit;
	Lm.ShowPage = ShowPage;
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