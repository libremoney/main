/**
 * @depends {lm.js}
 * @depends {lm.modals.js}
 */
var Lm = (function(Lm, $, undefined) {
	
	function AccountInfoModal_OnShow() {
		$("#account_info_name").val(Lm.AccountInfo.name);
		$("#account_info_description").val(Lm.AccountInfo.description);
	}

	function SetAccountInfoCompleteForm(response, data) {
		var name = $.trim(String(data.name));
		if (name) {
			$("#account_name").html(name.escapeHTML()).removeAttr("data-i18n");
		} else {
			$("#account_name").html($.t("no_name_set")).attr("data-i18n", "no_name_set");
		}

		var description = $.trim(String(data.description));

		setTimeout(function() {
			Lm.AccountInfo.description = description;
			Lm.AccountInfo.name = name;
		}, 1000);
	}


	$("#account_info_modal").on("show.bs.modal", function(e) {
		AccountInfoModal_OnShow();
	});


	Lm.Forms.SetAccountInfoComplete = SetAccountInfoCompleteForm;
	return Lm;
}(Lm || {}, jQuery));