/**
 * @depends {lm.js}
 */
var Lm = (function(Lm, $, undefined) {
	Lm.NewlyCreatedAccount = false;


	function AccountPhraseCustomPanel_OnSubmit(event) {
		event.preventDefault()

		var password = $("#registration_password").val();
		var repeat = $("#registration_password_repeat").val();

		var error = "";

		if (password.length < 35) {
			error = $.t("error_passphrase_length");
		} else if (password.length < 50 && (!password.match(/[A-Z]/) || !password.match(/[0-9]/))) {
			error = $.t("error_passphrase_strength");
		} else if (password != repeat) {
			error = $.t("error_passphrase_match");
		}

		if (error) {
			$("#account_phrase_custom_panel .callout").first().removeClass("callout-info").addClass("callout-danger").html(error);
		} else {
			$("#registration_password, #registration_password_repeat").val("");
			Lm.Login(password);
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
		if (!password.length) {
			$.growl($.t("error_passphrase_required_login"), {
				"type": "danger",
				"offset": 10
			});
			return;
		} else if (!Lm.IsTestNet && password.length < 12 && $("#login_check_password_length").val() == 1) {
			$("#login_check_password_length").val(0);
			$("#login_error .callout").html($.t("error_passphrase_login_length"));
			$("#login_error").show();
			return;
		}

		$("#login_password, #registration_password, #registration_password_repeat").val("");
		$("#login_check_password_length").val(1);

		Lm.SendRequest("getBlockchainStatus", function(response) {
			Login_GetBlockchainStatus_On(response, password, callback);
		});
	}

	function Login_GetBlockchainStatus_On(response, password, callback) {
		if (response.errorCode) {
			$.growl($.t("error_server_connect"), {
				"type": "danger",
				"offset": 10
			});

			return;
		}

		Lm.State = response;

		//this is done locally..
		Lm.SendRequest("getAccountId", {
			"secretPhrase": password
		}, function(response) {
			Login_GetAccountId_On(response, password, callback);
		});
	}

	function Login_GetAccountId_On(response, password, callback) {
		if (!response.errorCode) {
			Lm.Account = String(response.account).escapeHTML();
			Lm.AccountRS = String(response.accountRS).escapeHTML();
			Lm.PublicKey = Lm.GetPublicKey(converters.stringToHexString(password));
		}

		if (!Lm.Account) {
			$.growl($.t("error_find_account_id"), {
				"type": "danger",
				"offset": 10
			});
			return;
		} else if (!Lm.AccountRS) {
			$.growl($.t("error_generate_account_id"), {
				"type": "danger",
				"offset": 10
			});
			return;
		}

		Lm.SendRequest("getAccountPublicKey", {
			"account": Lm.Account
		}, function(response) {
			Login_GetAccountPublicKey_On(response, password, callback);
		});
	}

	function Login_GetAccountPublicKey_On(response, password, callback) {
		if (response && response.publicKey && response.publicKey != Lm.GeneratePublicKey(password)) {
			$.growl($.t("error_account_taken"), {
				"type": "danger",
				"offset": 10
			});
			return;
		}

		if ($("#remember_password").is(":checked")) {
			Lm.RememberPassword = true;
			$("#remember_password").prop("checked", false);
			Lm.SetPassword(password);
			$(".secret_phrase, .show_secret_phrase").hide();
			$(".hide_secret_phrase").show();
		}

		$("#account_id").html(String(Lm.AccountRS).escapeHTML()).css("font-size", "12px");

		var passwordNotice = "";

		if (password.length < 35) {
			passwordNotice = $.t("error_passphrase_length_secure");
		} else if (password.length < 50 && (!password.match(/[A-Z]/) || !password.match(/[0-9]/))) {
			passwordNotice = $.t("error_passphrase_strength_secure");
		}

		if (passwordNotice) {
			$.growl("<strong>" + $.t("warning") + "</strong>: " + passwordNotice, {
				"type": "danger"
			});
		}

		if (Lm.State) {
			Lm.CheckBlockHeight();
		}

		Lm.GetAccountInfo(true, function() {
			Login_GetAccountInfo_On(response);
		});

		Lm.Unlock();

		if (Lm.IsOutdated) {
			$.growl($.t("lm_update_available"), {
				"type": "danger"
			});
		}

		if (!Lm.DownloadingBlockchain) {
			Lm.CheckIfOnAFork();
		}

		Lm.SetupClipboardFunctionality();

		if (callback) {
			callback();
		}

		Lm.CheckLocationHash(password);

		$(window).on("hashchange", Lm.CheckLocationHash);

		Lm.GetInitialTransactions();
	}

	function Login_GetAccountInfo_On(response) {
		if (Lm.AccountInfo.currentLeasingHeightFrom) {
			Lm.IsLeased = (Lm.LastBlockHeight >= Lm.AccountInfo.currentLeasingHeightFrom && Lm.LastBlockHeight <= Lm.AccountInfo.currentLeasingHeightTo);
		} else {
			Lm.IsLeased = false;
		}

		//forging requires password to be sent to the server, so we don't do it automatically if not localhost
		if (!Lm.AccountInfo.publicKey || Lm.AccountInfo.effectiveBalanceLm == 0 || !Lm.IsLocalHost || Lm.DownloadingBlockchain || Lm.IsLeased) {
			$("#forging_indicator").removeClass("forging");
			$("#forging_indicator span").html($.t("not_forging")).attr("data-i18n", "not_forging");
			$("#forging_indicator").show();
			Lm.IsForging = false;
		} else if (Lm.IsLocalHost) {
			Lm.SendRequest("startForging", {
				"secretPhrase": password
			}, function(response) {
				if ("deadline" in response) {
					$("#forging_indicator").addClass("forging");
					$("#forging_indicator span").html($.t("forging")).attr("data-i18n", "forging");
					Lm.IsForging = true;
				} else {
					$("#forging_indicator").removeClass("forging");
					$("#forging_indicator span").html($.t("not_forging")).attr("data-i18n", "not_forging");
					Lm.IsForging = false;
				}
				$("#forging_indicator").show();
			});
		}
	}

	function Logout(stopForging) {
		if (stopForging && Lm.IsForging) {
			$("#stop_forging_modal .show_logout").show();
			$("#stop_forging_modal").modal("show");
		} else {
			Lm.SetDecryptionPassword("");
			Lm.SetPassword("");
			window.location.reload();
		}
	}

	function RegisterAccount() {
		$("#login_panel, #welcome_panel").hide();
		$("#account_phrase_generator_panel").show();
		$("#account_phrase_generator_panel step_3 .callout").hide();

		var $loading = $("#account_phrase_generator_loading");
		var $loaded = $("#account_phrase_generator_loaded");

		if (window.crypto || window.msCrypto) {
			$loading.find("span.loading_text").html($.t("generating_passphrase_wait"));
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
				alert($.t("error_word_list"));
			});
		} else {
			$loading.hide();
			$loaded.show();

			PassPhraseGenerator.generatePassPhrase("#account_phrase_generator_panel");
		}
	}

	function RegisterUserDefinedAccount() {
		$("#account_phrase_generator_panel, #login_panel, #welcome_panel, #custom_passphrase_link").hide();
		$("#account_phrase_custom_panel :input:not(:button):not([type=submit])").val("");
		$("#account_phrase_generator_panel :input:not(:button):not([type=submit])").val("");
		$("#account_phrase_custom_panel").show();
		$("#registration_password").focus();
	}

	function SetPassword(password) {
		Lm.SetEncryptionPassword(password);
		Lm.SetServerPassword(password);
	}

	function ShowLockscreen() {
		if (Lm.HasLocalStorage && localStorage.getItem("logged_in")) {
			setTimeout(function() {
				$("#login_password").focus()
			}, 10);
		} else {
			Lm.ShowWelcomeScreen();
		}

		$("#center").show();
	}

	function ShowLoginOrWelcomeScreen() {
		if (Lm.HasLocalStorage && localStorage.getItem("logged_in")) {
			Lm.ShowLoginScreen();
		} else {
			Lm.ShowWelcomeScreen();
		}
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
		$("#login_panel, account_phrase_custom_panel, #account_phrase_generator_panel, #account_phrase_custom_panel, #welcome_panel, #custom_passphrase_link").hide();
		$("#welcome_panel").show();
	}

	function Unlock() {
		if (Lm.HasLocalStorage && !localStorage.getItem("logged_in")) {
			localStorage.setItem("logged_in", true);
		}

		var userStyles = ["header", "sidebar", "boxes"];

		for (var i = 0; i < userStyles.length; i++) {
			var color = Lm.Settings[userStyles[i] + "_color"];
			if (color) {
				Lm.UpdateStyle(userStyles[i], color);
			}
		}

		var contentHeaderHeight = $(".content-header").height();
		var navBarHeight = $("nav.navbar").height();

		//	$(".content-splitter-right").css("bottom", (contentHeaderHeight + navBarHeight + 10) + "px");

		$("#lockscreen").hide();
		$("body, html").removeClass("lockscreen");

		$("#login_error").html("").hide();

		$(document.documentElement).scrollTop(0);
	}

	function VerifyGeneratedPassphrase() {
		var password = $.trim($("#account_phrase_generator_panel .step_3 textarea").val());

		if (password != PassPhraseGenerator.passPhrase) {
			$("#account_phrase_generator_panel .step_3 .callout").show();
		} else {
			Lm.NewlyCreatedAccount = true;
			Lm.Login(password);
			PassPhraseGenerator.reset();
			$("#account_phrase_generator_panel textarea").val("");
			$("#account_phrase_generator_panel .step_3 .callout").hide();
		}
	}


	$("#account_phrase_custom_panel form").submit(AccountPhraseCustomPanel_OnSubmit);

	$("#logout_button_container").on("show.bs.dropdown", function(e) {
		if (!Lm.IsForging) {
			e.preventDefault();
		}
	});

	$("#logout_button").click(function(e) {
		if (!Lm.IsForging) {
			e.preventDefault();
			Lm.Logout();
		}
	});


	Lm.AllowLoginViaEnter = AllowLoginViaEnter;
	Lm.ShowLoginOrWelcomeScreen = ShowLoginOrWelcomeScreen;
	Lm.ShowLoginScreen = ShowLoginScreen;
	Lm.ShowWelcomeScreen = ShowWelcomeScreen;
	Lm.RegisterUserDefinedAccount = RegisterUserDefinedAccount;
	Lm.RegisterAccount = RegisterAccount;
	Lm.VerifyGeneratedPassphrase = VerifyGeneratedPassphrase;
	Lm.Login = Login;
	Lm.ShowLockscreen = ShowLockscreen;
	Lm.Unlock = Unlock;
	Lm.Logout = Logout;
	Lm.SetPassword = SetPassword;
	return Lm;
}(Lm || {}, jQuery));