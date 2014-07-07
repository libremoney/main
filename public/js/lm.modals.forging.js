var Lm = (function(Lm, $, undefined) {
	
	ErrorMessages_StartForging = {
		"5": "You cannot forge. Either your balance is 0 or your account is too new (you must wait a day or so)."
	};

	function StartForgingCompleteForm(response, data) {
		if ("deadline" in response) {
			$("#forging_indicator").addClass("forging");
			$("#forging_indicator span").html("Forging");
			Lm.IsForging = true;
			$.growl("Forging started successfully.", {
				type: "success"
			});
		} else {
			Lm.IsForging = false;
			$.growl("Couldn't start forging, unknown error.", {
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
		$("#forging_indicator span").html("Not forging");

		Lm.IsForging = false;

		if (response.foundAndStopped) {
			$.growl("Forging stopped successfully.", {
				type: 'success'
			});
		} else {
			$.growl("You weren't forging to begin with.", {
				type: 'danger'
			});
		}
	}

	function ForgingIndicator_OnClick(e, th) {
		e.preventDefault();

		if (Lm.DownloadingBlockchain) {
			$.growl("The blockchain is busy downloading, you cannot forge during this time. Please try again when the blockchain is fully synced.", {
				"type": "danger"
			});
		} else if (Lm.State.isScanning) {
			$.growl("The blockchain is currently being rescanned, you cannot forge during this time. Please try again in a minute.", {
				"type": "danger"
			});
		} else if (!Lm.AccountInfo.publicKey) {
			$.growl("You cannot forge because your account has no public key. Please make an outgoing transaction first.", {
				"type": "danger"
			});
		} else if (Lm.AccountInfo.effectiveBalanceNXT == 0) {
			if (Lm.LastBlockHeight >= Lm.AccountInfo.currentLeasingHeightFrom && Lm.LastBlockHeight <= Lm.AccountInfo.currentLeasingHeightTo) {
				$.growl("Your effective balance is leased out, you cannot forge at the moment.", {
					"type": "danger"
				});
			} else {
				$.growl("Your effective balance is zero, you cannot forge.", {
					"type": "danger"
				});
			}
		} else if (th.hasClass("forging")) {
			$("#stop_forging_modal").modal("show");
		} else {
			$("#start_forging_modal").modal("show");
		}
	});


	$("#forging_indicator").click(function(e) {
		ForgingIndicator_OnClick(e, $(this));
	});


	Lm.Forms.ErrorMessages.StartForging = ErrorMessages_StartForging;
	Lm.Forms.StartForgingComplete = StartForgingCompleteForm;
	Lm.Forms.StopForgingComplete = StopForgingCompleteForm;
	return Lm;
}(Lm || {}, jQuery));