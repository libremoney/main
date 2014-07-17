var Lm = (function(Lm, $, undefined) {

	function AccountInfoModal_OnShow(e) {
		$("#account_info_name").val(Lm.AccountInfo.name);
		$("#account_info_description").val(Lm.AccountInfo.description);
	}

	function SetAccountInfoCompleteForm(response, data) {
		var name = $.trim(String(data.name));
		if (name) {
			$("#account_name").html(name.escapeHTML());
		} else {
			$("#account_name").html("No name set");
		}
	}


	$("#account_info_modal").on("show.bs.modal", function(e) {
		AccountInfoModal_OnShow();
	});


	Lm.Forms.SetAccountInfoComplete = SetAccountInfoCompleteForm;
	return Lm;
}(Lm || {}, jQuery));