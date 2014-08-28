/**
 * @depends {lm.js}
 * @depends {lm.modals.js}
 */
var Lm = (function(Lm, $, undefined) {
	//todo: use a startForgingError function instaed!

	function StartForgingCompleteForm(response, data) {
		if ("deadline" in response) {
			$("#forging_indicator").addClass("forging");
			$("#forging_indicator span").html($.t("forging")).attr("data-i18n", "forging");
			Lm.IsForging = true;
			$.growl($.t("success_start_forging"), {
				type: "success"
			});
		} else {
			Lm.IsForging = false;
			$.growl($.t("error_start_forging"), {
				type: 'danger'
			});
		}
	}

	function StopForgingCompleteForm(response, data) {
		if ($("#stop_forging_modal .show_logout").css("display") == "inline") {
			Lm.Logout();
			return;
		}

		$("#forging_indicator").removeClass("forging");
		$("#forging_indicator span").html($.t("not_forging")).attr("data-i18n", "not_forging");

		Lm.IsForging = false;

		if (response.foundAndStopped) {
			$.growl($.t("success_stop_forging"), {
				type: 'success'
			});
		} else {
			$.growl($.t("error_stop_forging"), {
				type: 'danger'
			});
		}
	}

	function ForgingIndicator_OnClick(th, e) {
		e.preventDefault();

		if (Lm.DownloadingBlockchain) {
			$.growl($.t("error_forging_blockchain_downloading"), {
				"type": "danger"
			});
		} else if (Lm.State.isScanning) {
			$.growl($.t("error_forging_blockchain_rescanning"), {
				"type": "danger"
			});
		} else if (!Lm.AccountInfo.publicKey) {
			$.growl($.t("error_forging_no_public_key"), {
				"type": "danger"
			});
		} else if (Lm.AccountInfo.effectiveBalanceLm == 0) {
			if (Lm.LastBlockHeight >= Lm.AccountInfo.currentLeasingHeightFrom && Lm.LastBlockHeight <= Lm.AccountInfo.currentLeasingHeightTo) {
				$.growl($.t("error_forging_lease"), {
					"type": "danger"
				});
			} else {
				$.growl($.t("error_forging_effective_balance"), {
					"type": "danger"
				});
			}
		} else if (th.hasClass("forging")) {
			$("#stop_forging_modal").modal("show");
		} else {
			$("#start_forging_modal").modal("show");
		}
	}


	$("#forging_indicator").click(function(e) {
		ForgingIndicator_OnClick($(this), e);
	});

	Lm.Forms.StartForgingComplete = StartForgingCompleteForm;
	Lm.Forms.StopForgingComplete = StopForgingCompleteForm;
	return Lm;
}(Lm || {}, jQuery));