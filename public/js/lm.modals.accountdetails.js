var Lm = (function(Lm, $, undefined) {

	function AccountDetailsModal_OnShow(e) {
		$("#account_details_modal_balance").show();

		if (Lm.AccountInfo.errorCode) {
			$("#account_balance_table").hide();

			if (Lm.AccountInfo.errorCode == 5) {
				$("#account_balance_warning").html("Your account is brand new. You should fund it with some coins. Your account ID is <strong>" +
					Lm.Account + "</strong>").show();
			} else {
				$("#account_balance_warning").html(Lm.AccountInfo.errorDescription.escapeHTML()).show();
			}
		} else {
			$("#account_balance_warning").hide();

			$("#account_balance_balance").html(Lm.FormatAmount(new BigInteger(Lm.AccountInfo.balanceNQT)) + " Lm");
			$("#account_balance_unconfirmed_balance").html(Lm.FormatAmount(new BigInteger(Lm.AccountInfo.unconfirmedBalanceNQT)) + " Lm");
			$("#account_balance_effective_balance").html(Lm.FormatAmount(Lm.AccountInfo.effectiveBalanceNXT) + " NXT");
			$("#account_balance_guaranteed_balance").html(Lm.FormatAmount(new BigInteger(Lm.AccountInfo.guaranteedBalanceNQT)) + " Lm");

			$("#account_balance_public_key").html(String(Lm.AccountInfo.publicKey).escapeHTML());
			$("#account_balance_account_id").html(String(Lm.Account).escapeHTML());
			$("#account_balance_account_rs").html(String(Lm.AccountInfo.accountRS).escapeHTML());

			if (!Lm.AccountInfo.publicKey) {
				$("#account_balance_public_key").html("/");
				$("#account_balance_warning").html("Your account does not have a public key! This means it's not as protected as other accounts. "+
						"You must make an outgoing transaction to fix this issue. "+
						"(<a href='#' data-toggle='modal' data-target='#send_message_modal'>send a message</a>, "+
						"<a href='#' data-toggle='modal' data-target='#register_alias_modal'>buy an alias</a>, "+
						"<a href='#' data-toggle='modal' data-target='#send_money_modal'>send Nxt</a>, ...)").show();
			}
		}
	}

	function AccountDetailsModalNavLi_OnClick(e, th) {
		e.preventDefault();

		var tab = th.data("tab");

		th.siblings().removeClass("active");
		th.addClass("active");

		$(".account_details_modal_content").hide();

		var content = $("#account_details_modal_" + tab);

		content.show();
	}

	function AccountDetailsModal_OnHidden(e, th) {
		th.find(".account_details_modal_content").hide();
		th.find("ul.nav li.active").removeClass("active");
		$("#account_details_balance_nav").addClass("active");
	}


	$("#account_details_modal").on("show.bs.modal", function(e) {
		AccountDetailsModal_OnShow(e);
	});

	$("#account_details_modal ul.nav li").click(function(e) {
		AccountDetailsModalNavLi_OnClick(e, $(this));
	});

	$("#account_details_modal").on("hidden.bs.modal", function(e) {
		AccountDetailsModal_OnHidden(e, $(this));
	});


	return Lm;
}(Lm || {}, jQuery));