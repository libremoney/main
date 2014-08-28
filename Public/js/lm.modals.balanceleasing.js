/**
 * @depends {lm.js}
 * @depends {lm.modals.js}
 */
var Lm = (function(Lm, $, undefined) {

	function LeaseBalanceCompleteForm(response, data) {
		Lm.GetAccountInfo();
	}

	$("#lease_balance_modal").on("show.bs.modal", function() {
		$("#lease_balance_help").html($.t("lease_balance_help_2"));
	});

	$("#lease_balance_period").on("change", function() {
		if ($(this).val() > 32767) {
			$("#lease_balance_help").html($.t("error_lease_balance_period"));
		} else {
			var days = Math.round($(this).val() / 900);
			$("#lease_balance_help").html($.t("lease_balance_help_var", {
				"blocks": String($(this).val()).escapeHTML(),
				"days": String(Math.round(days)).escapeHTML()
			}));
		}
	});


	Lm.Forms.LeaseBalanceComplete = LeaseBalanceCompleteForm;
	return Lm;
}(Lm || {}, jQuery));