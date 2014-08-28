/**
 * @depends {lm.js}
 * @depends {lm.modals.js}
 */
var Lm = (function(Lm, $, undefined) {

	function AccountDetailsModal_OnShow(e) {
		$("#account_details_modal_qr_code").empty().qrcode({
			"text": Lm.AccountRS,
			"width": 128,
			"height": 128
		});

		$("#account_details_modal_balance").show();

		if (Lm.AccountInfo.errorCode && Lm.AccountInfo.errorCode != 5) {
			$("#account_balance_table").hide();
			//todo
			$("#account_balance_warning").html(String(Lm.AccountInfo.errorDescription).escapeHTML()).show();
		} else {
			$("#account_balance_warning").hide();

			if (Lm.AccountInfo.errorCode && Lm.AccountInfo.errorCode == 5) {
				$("#account_balance_balance, #account_balance_unconfirmed_balance, #account_balance_effective_balance, #account_balance_guaranteed_balance").html("0 Lm");
				$("#account_balance_public_key").html(String(Lm.PublicKey).escapeHTML());
				$("#account_balance_account_rs").html(String(Lm.AccountRS).escapeHTML());
				$("#account_balance_account").html(String(Lm.Account).escapeHTML());
			} else {
				$("#account_balance_balance").html(Lm.FormatAmount(new BigInteger(Lm.AccountInfo.balanceMilliLm)) + " Lm");
				$("#account_balance_unconfirmed_balance").html(Lm.FormatAmount(new BigInteger(Lm.AccountInfo.unconfirmedBalanceMilliLm)) + " Lm");
				$("#account_balance_effective_balance").html(Lm.FormatAmount(Lm.AccountInfo.effectiveBalanceLm) + " Lm");
				$("#account_balance_guaranteed_balance").html(Lm.FormatAmount(new BigInteger(Lm.AccountInfo.guaranteedBalanceMilliLm)) + " Lm");

				$("#account_balance_public_key").html(String(Lm.AccountInfo.publicKey).escapeHTML());
				$("#account_balance_account_rs").html(String(Lm.AccountInfo.accountRS).escapeHTML());
				$("#account_balance_account").html(String(Lm.Account).escapeHTML());

				if (!Lm.AccountInfo.publicKey) {
					$("#account_balance_public_key").html("/");
					$("#account_balance_warning").html($.t("no_public_key_warning") + " " + $.t("public_key_actions")).show();
				}
			}
		}
	}

	function AccountDetailsModalNavLi_OnClick(th, e) {
		e.preventDefault();

		var tab = th.data("tab");

		th.siblings().removeClass("active");
		th.addClass("active");

		$(".account_details_modal_content").hide();

		var content = $("#account_details_modal_" + tab);

		content.show();
	}

	function AccountDetailsModal_OnHidden(th, e) {
		th.find(".account_details_modal_content").hide();
		th.find("ul.nav li.active").removeClass("active");
		$("#account_details_balance_nav").addClass("active");
		$("#account_details_modal_qr_code").empty();
	}


	$("#account_details_modal").on("show.bs.modal", function(e) {
		AccountDetailsModal_OnShow(e);
	});

	$("#account_details_modal ul.nav li").click(function(e) {
		AccountDetailsModalNavLi_OnClick($(this), e);
	});

	$("#account_details_modal").on("hidden.bs.modal", function(e) {
		AccountDetailsModal_OnHidden($(this), e);
	});


	return Lm;
}(Lm || {}, jQuery));