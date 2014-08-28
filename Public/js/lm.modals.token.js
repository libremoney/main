/**
 * @depends {lm.js}
 * @depends {lm.modals.js}
 */
var Lm = (function(Lm, $, undefined) {

	function GenerateTokenModal_OnShow(e) {
		$("#generate_token_output, #decode_token_output").html("").hide();

		$("#token_modal_generate_token").show();
		$("#token_modal_button").text($.t("generate")).data("form", "generate_token_form");
	}

	function GenerateTokenForm($modal) {
		var data = $.trim($("#generate_token_data").val());

		if (!data) {
			return {
				"error": "Data is a required field."
			};
			$("#generate_token_output").html("").hide();
		} else {
			return {};
		}
	}

	function GenerateTokenCompleteForm(response, data) {
		$("#token_modal").find(".error_message").hide();

		if (response.token) {
			$("#generate_token_output").html($.t("generated_token_is") + "<br /><br /><textarea style='width:100%' rows='3'>" + String(response.token).escapeHTML() + "</textarea>").show();
		} else {
			$.growl($.t("error_generate_token"), {
				"type": "danger"
			});
			$("#generate_token_modal").modal("hide");
		}
	}

	function GenerateTokenErrorForm() {
		$("#generate_token_output").hide();
	}

	function DecodeTokenCompleteForm(response, data) {
		$("#token_modal").find(".error_message").hide();

		if (response.valid) {
			$("#decode_token_output").html($.t("success_valid_token", {
				"account_link": Lm.GetAccountLink(response, "account"),
				"timestamp": Lm.FormatTimestamp(response.timestamp)
			})).addClass("callout-info").removeClass("callout-danger").show();
		} else {
			$("#decode_token_output").html($.t("error_invalid_token", {
				"account_link": Lm.GetAccountLink(response, "account"),
				"timestamp": Lm.FormatTimestamp(response.timestamp)
			})).addClass("callout-danger").removeClass("callout-info").show();
		}
	}

	function DecodeTokenErrorForm() {
		$("#decode_token_output").hide();
	}

	function TokenModal_Click(th, e) {
		e.preventDefault();

		var tab = th.data("tab");

		th.siblings().removeClass("active");
		th.addClass("active");

		$(".token_modal_content").hide();

		var content = $("#token_modal_" + tab);

		if (tab == "generate_token") {
			$("#token_modal_button").text($.t("generate")).data("form", "generate_token_form");
		} else {
			$("#token_modal_button").text($.t("validate")).data("form", "validate_token_form");
		}

		$("#token_modal .error_message").hide();

		content.show();
	}

	function TokenModal_OnHidden(th, e) {
		th.find(".token_modal_content").hide();
		th.find("ul.nav li.active").removeClass("active");
		$("#generate_token_nav").addClass("active");
	}


	$("#token_modal").on("show.bs.modal", function(e) {
		GenerateTokenModal_OnShow(e);
	});

	$("#token_modal ul.nav li").click(function(e) {
		TokenModal_Click($(this), e);
	});

	$("#token_modal").on("hidden.bs.modal", function(e) {
		TokenModal_OnHidden($(this), e);
	});


	Lm.Forms.GenerateToken = GenerateTokenForm;
	Lm.Forms.GenerateTokenComplete = GenerateTokenCompleteForm;
	Lm.Forms.GenerateTokenError = GenerateTokenErrorForm;
	Lm.Forms.DecodeTokenComplete = DecodeTokenCompleteForm;
	Lm.Forms.DecodeTokenError = DecodeTokenErrorForm;
	return Lm;
}(Lm || {}, jQuery));