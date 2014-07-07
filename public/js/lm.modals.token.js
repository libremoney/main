var Lm = (function(Lm, $, undefined) {

	function GenerateTokenModal_OnShow() {
		$("#generate_token_website").val("http://");
		$("#generate_token_token").html("").hide();
	}

	function GenerateTokenForm($modal) {
		var url = $.trim($("#generate_token_website").val());

		if (!url || url == "http://") {
			return {
				"error": "Website is a required field."
			};
			$("#generate_token_token").html("").hide();
		} else {
			return {};
		}
	}

	function GenerateTokenCompleteForm(response, data) {
		$("#generate_token_modal").find(".error_message").hide();

		if (response.token) {
			$("#generate_token_token").html("The generated token for <strong>" + data.website.escapeHTML() + "</strong> is: <br /><br />"+
				"<textarea style='width:100%' rows='3'>" + response.token.escapeHTML() + "</textarea>").show();
		} else {
			$.growl("Could not generate token.", {
				"type": "danger"
			});
			$("#generate_token_modal").modal("hide");
		}
	}


	$("#generate_token_modal").on("show.bs.modal", function(e) {
		GenerateTokenModal_OnShow();
	});


	Lm.Forms.GenerateToken = GenerateTokenForm;
	Lm.Forms.GenerateTokenComplete = GenerateTokenCompleteForm;
	return Lm;
}(Lm || {}, jQuery));