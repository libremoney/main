var Lm = (function(Lm, $, undefined) {
	Lm.NewlyCreatedAccount = false;


	function AccountPhraseSubmit(event) {
		event.preventDefault()

		var password = $("#registration_password").val();
		var repeat = $("#registration_password_repeat").val();

		var error = "";

		if (password.length < 35) {
			error = "Secret phrase must be at least 35 characters long.";
		} else if (password.length < 50 && (!password.match(/[A-Z]/) || !password.match(/[0-9]/))) {
			error = "Since your secret phrase is less than 50 characters long, it must contain numbers and uppercase letters.";
		} else if (password != repeat) {
			error = "Secret phrases do not match.";
		}

		if (error) {
			$("#account_phrase_custom_panel .callout").first().removeClass("callout-info").addClass("callout-danger").html(error);
		} else {
			$("#registration_password, #registration_password_repeat").val("");
			Lm.Login(password, function() {
				$.growl("Secret phrase confirmed successfully, you are now logged in.", {
					"type": "success"
				});
			});
		}
	}

	function AllowLoginViaEnter() {
		$("#login_password").keypress(function(e) {
			if (e.which == '13') {
				e.preventDefault();
				var password = $("#login_password").val();
				Lm.Login(password);
			}
		});
	}

	function Login(password, callback) {
		$("#login_password, #registration_password, #registration_password_repeat").val("");

		if (!password.length) {
			$.growl("You must enter your secret phrase. If you don't have one, click the registration button below.", {
				"type": "danger",
				"offset": 60
			});
			return;
		}

		Lm.SendRequest("getBlockchainStatus", function(response) {
			Login_GetBlockchainStatus_On(response, password);
		});
	}

	function Login_GetBlockchainStatus_On(response, password) {
		if (response.errorCode) {
			Lm.AddToLog(1, 'response.errorCode='+response.errorCode);
			$.growl("Could not connect to server.", {
				"type": "danger",
				"offset": 60
			});

			return;
		}

		Lm.State = response;

		//this is done locally..
		Lm.SendRequest("getAccountId", {
			"secretPhrase": password
		}, function(response) {
			if (!response.errorCode) {
				Lm.Account = String(response.accountId).escapeHTML();
			}

			if (!Lm.Account) {
				return;
			}

			var nxtAddress = new NxtAddress();

			if (nxtAddress.set(Lm.Account)) {
				Lm.AccountRS = nxtAddress.toString();
			} else {
				$.growl("Could not generate Reed Solomon address.", {
					"type": "danger"
				});
			}

			Lm.SendRequest("getAccountPublicKey", {
				"account": Lm.Account
			}, function(response) {
				if (response && response.publicKey && response.publicKey != Lm.GeneratePublicKey(password)) {
					$.growl("This account is already taken. Please choose another pass phrase.", {
						"type": "danger",
						"offset": 60
					});
					return;
				}

				if ($("#remember_password").is(":checked")) {
					Lm.RememberPassword = true;
					$("#remember_password").prop("checked", false);
					sessionStorage.setItem("secret", password);
					$.growl("Remember to log out at the end of your session so as to clear the password from memory.", {
						"type": "danger",
						"offset": 60
					});
					$(".secret_phrase, .show_secret_phrase").hide();
					$(".hide_secret_phrase").show();
				}

				if (Lm.Settings["reed_solomon"]) {
					$("#account_id").html(String(Lm.AccountRS).escapeHTML()).css("font-size", "12px");
				} else {
					$("#account_id").html(String(Lm.Account).escapeHTML()).css("font-size", "14px");
				}

				var passwordNotice = "";

				if (password.length < 35) {
					passwordNotice = "Your secret phrase is less than 35 characters long. This is not secure.";
				} else if (password.length < 50 && (!password.match(/[A-Z]/) || !password.match(/[0-9]/))) {
					passwordNotice = "Your secret phrase does not contain numbers and uppercase letters. This is not secure.";
				}

				if (passwordNotice) {
					$.growl("<strong>Warning</strong>: " + passwordNotice, {
						"type": "danger",
						"offset": 60
					});
				}

				Lm.GetAccountInfo(true, function() {
					if (Lm.AccountInfo.currentLeasingHeightFrom) {
						Lm.IsLeased = (Lm.LastBlockHeight >= Lm.AccountInfo.currentLeasingHeightFrom &&
							Lm.LastBlockHeight <= Lm.AccountInfo.currentLeasingHeightTo);
					} else {
						Lm.IsLeased = false;
					}

					//forging requires password to be sent to the server, so we don't do it automatically if not localhost
					if (!Lm.AccountInfo.publicKey || Lm.AccountInfo.effectiveBalanceNXT == 0 || !Lm.IsLocalHost ||
							Lm.DownloadingBlockchain || Lm.IsLeased) {
						$("#forging_indicator").removeClass("forging");
						$("#forging_indicator span").html("Not Forging");
						$("#forging_indicator").show();
						Lm.IsForging = false;
					} else if (Lm.IsLocalHost) {
						Lm.SendRequest("startForging", {
							"secretPhrase": password
						}, function(response) {
							if ("deadline" in response) {
								$("#forging_indicator").addClass("forging");
								$("#forging_indicator span").html("Forging");
								Lm.IsForging = true;
							} else {
								$("#forging_indicator").removeClass("forging");
								$("#forging_indicator span").html("Not Forging");
								Lm.IsForging = false;
							}
							$("#forging_indicator").show();
						});
					}
				});

				//Lm.GetAccountAliases();

				Lm.Unlock();

				if (Lm.IsOutdated) {
					$.growl("A new LibreMoney release is available. It is recommended that you update.", {
						"type": "danger",
						"offset": 60
					});
				}

				Lm.SetupClipboardFunctionality();

				if (callback) {
					callback();
				}

				Lm.CheckLocationHash(password);

				$(window).on("hashchange", Lm.CheckLocationHash);

				Lm.GetInitialTransactions();
			});
		});
	}

	function Logout(stopForging) {
		if (stopForging && Lm.IsForging) {
			$("#stop_forging_modal .show_logout").show();
			$("#stop_forging_modal").modal("show");
		} else {
			if (Lm.RememberPassword) {
				sessionStorage.removeItem("secret");
			}
			window.location.reload();
		}
	}

	function LogoutClick(e) {
		if (!Lm.IsForging) {
			e.preventDefault();
			Lm.Logout();
		}
	}

	function LogoutDropdown(e) {
		if (!Lm.IsForging) {
			e.preventDefault();
		}
	}

	function RegisterUserDefinedAccount() {
		$("#account_phrase_generator_panel, #login_panel, #welcome_panel, #custom_passphrase_link").hide();
		$("#account_phrase_custom_panel :input:not(:button):not([type=submit])").val("");
		$("#account_phrase_generator_panel :input:not(:button):not([type=submit])").val("");
		$("#account_phrase_custom_panel").show();
		$("#registration_password").focus();
	}

	function ShowLoginOrWelcomeScreen() {
		if (Lm.HasLocalStorage && localStorage.getItem("logged_in")) {
			Lm.ShowLoginScreen();
		} else {
			Lm.ShowWelcomeScreen();
		}
	}

	function ShowLockscreen() {
		Lm.AddToLog(Lm.DebugLevelEnum.Comment, 'Login.ShowLockscreen - begin');
		Lm.AddToLog(Lm.DebugLevelEnum.Comment, 'Lm.HasLocalStorage='+Lm.HasLocalStorage);
		Lm.AddToLog(Lm.DebugLevelEnum.Comment, 'localStorage.getItem(logged_in)='+localStorage.getItem("logged_in"));

		Lm.GoToPage("login"); // Prof1983

		if (Lm.HasLocalStorage && localStorage.getItem("logged_in")) {
			setTimeout(function() {
				$("#login_password").focus()
			}, 10);
		} else {
			Lm.ShowWelcomeScreen();
		}

		$("#center").show();
	}

	function ShowLoginScreen() {
		$("#account_phrase_custom_panel, #account_phrase_generator_panel, #welcome_panel, #custom_passphrase_link").hide();
		$("#account_phrase_custom_panel :input:not(:button):not([type=submit])").val("");
		$("#account_phrase_generator_panel :input:not(:button):not([type=submit])").val("");
		$("#login_panel").show();
		setTimeout(function() {
			$("#login_password").focus()
		}, 10);
	}

	function ShowWelcomeScreen() {
		Lm.AddToLog(Lm.DebugLevelEnum.Comment, 'Login.ShowWelcomeScreen - begin');
		$("#login_panel, account_phrase_custom_panel, #account_phrase_generator_panel, #account_phrase_custom_panel, #welcome_panel, #custom_passphrase_link").hide();
		$("#welcome_panel").show();
	}

	function RegisterAccount() {
		$("#login_panel, #welcome_panel").hide();
		$("#account_phrase_generator_panel").show();
		$("#account_phrase_generator_panel step_3 .callout").hide();

		var $loading = $("#account_phrase_generator_loading");
		var $loaded = $("#account_phrase_generator_loaded");

		if (window.crypto || window.msCrypto) {
			$loading.find("span.loading_text").html("Generating your secret phrase. Please wait");
		}

		$loading.show();
		$loaded.hide();

		if (typeof PassPhraseGenerator == "undefined") {
			$.when(
				$.getScript("js/crypto/3rdparty/seedrandom.js"),
				$.getScript("js/crypto/passphrasegenerator.js")
			).done(function() {
				$loading.hide();
				$loaded.show();

				PassPhraseGenerator.generatePassPhrase("#account_phrase_generator_panel");
			}).fail(function(jqxhr, settings, exception) {
				alert("Could not load word list...");
			});
		} else {
			$loading.hide();
			$loaded.show();

			PassPhraseGenerator.generatePassPhrase("#account_phrase_generator_panel");
		}
	}

	function VerifyGeneratedPassphrase() {
		var password = $.trim($("#account_phrase_generator_panel .step_3 textarea").val());

		if (password != PassPhraseGenerator.passPhrase) {
			$("#account_phrase_generator_panel .step_3 .callout").show();
		} else {
			Lm.NewlyCreatedAccount = true;
			Lm.Login(password, function() {
				$.growl("Secret phrase confirmed successfully, you are now logged in.", {
					"type": "success"
				});
			});
			PassPhraseGenerator.reset();
			$("#account_phrase_generator_panel textarea").val("");
			$("#account_phrase_generator_panel .step_3 .callout").hide();
		}
	}

	function Unlock() {
		if (Lm.HasLocalStorage && !localStorage.getItem("logged_in")) {
			localStorage.setItem("logged_in", true);
		}

		var userStyles = ["header", "sidebar", "page_header"];

		for (var i = 0; i < userStyles.length; i++) {
			var color = Lm.Settings[userStyles[i] + "_color"];
			if (color) {
				Lm.UpdateStyle(userStyles[i], color);
			}
		}

		var contentHeaderHeight = $(".content-header").height();
		var navBarHeight = $("nav.navbar").height();

		$(".content-splitter-right").css("bottom", (contentHeaderHeight + navBarHeight + 10) + "px");

		$("#lockscreen").hide();
		$("body, html").removeClass("lockscreen");

		$(document.documentElement).scrollTop(0);
	}


	$("#account_phrase_custom_panel form").submit(function(event) {
		Lm.AccountPhraseSubmit(event);
	});

	$("#logout_button_container").on("show.bs.dropdown", function(e) {
		Lm.LogoutDropdown(e);
	});

	$("#logout_button").click(function(e) {
		Lm.LogoutClick(e);
	});


	Lm.AllowLoginViaEnter = AllowLoginViaEnter;
	Lm.ShowLoginOrWelcomeScreen = ShowLoginOrWelcomeScreen;
	Lm.ShowLoginScreen = ShowLoginScreen;
	Lm.ShowWelcomeScreen = ShowWelcomeScreen;
	Lm.RegisterUserDefinedAccount = RegisterUserDefinedAccount;
	Lm.RegisterAccount = RegisterAccount;
	Lm.VerifyGeneratedPassphrase = VerifyGeneratedPassphrase;
	Lm.AccountPhraseSubmit = AccountPhraseSubmit;
	Lm.Login = Login;
	Lm.LogoutClick = LogoutClick;
	Lm.LogoutDropdown = LogoutDropdown;
	Lm.ShowLockscreen = ShowLockscreen;
	Lm.Unlock = Unlock;
	Lm.Logout = Logout;
	return Lm;
}(Lm || {}, jQuery));