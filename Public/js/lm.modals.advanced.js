/**
 * @depends {lm.js}
 * @depends {lm.modals.js}
 */
var Lm = (function(Lm, $, undefined) {

	function ShowRawTransactionModal(transaction) {
		$("#raw_transaction_modal_unsigned_transaction_bytes").val(transaction.unsignedTransactionBytes);
		$("#raw_transaction_modal_transaction_bytes").val(transaction.transactionBytes);

		if (transaction.fullHash) {
			$("#raw_transaction_modal_full_hash").val(transaction.fullHash);
			$("#raw_transaction_modal_full_hash_container").show();
		} else {
			$("#raw_transaction_modal_full_hash_container").hide();
		}

		if (transaction.signatureHash) {
			$("#raw_transaction_modal_signature_hash").val(transaction.signatureHash);
			$("#raw_transaction_modal_signature_hash_container").show();
		} else {
			$("#raw_transaction_modal_signature_hash_container").hide();
		}

		$("#raw_transaction_modal").modal("show");
	}

	$("#transaction_operations_modal").on("show.bs.modal", function(e) {
		$(this).find(".output_table tbody").empty();
		$(this).find(".output").hide();

		$(this).find(".tab_content:first").show();
		$("#transaction_operations_modal_button").text($.t("broadcast")).data("resetText", $.t("broadcast")).data("form", "broadcast_transaction_form");
	});

	$("#transaction_operations_modal").on("hidden.bs.modal", function(e) {
		$(this).find(".tab_content").hide();
		$(this).find("ul.nav li.active").removeClass("active");
		$(this).find("ul.nav li:first").addClass("active");

		$(this).find(".output_table tbody").empty();
		$(this).find(".output").hide();
	});

	$("#transaction_operations_modal ul.nav li").click(function(e) {
		e.preventDefault();

		var tab = $(this).data("tab");

		$(this).siblings().removeClass("active");
		$(this).addClass("active");

		$(this).closest(".modal").find(".tab_content").hide();

		if (tab == "broadcast_transaction") {
			$("#transaction_operations_modal_button").text($.t("broadcast")).data("resetText", $.t("broadcast")).data("form", "broadcast_transaction_form");
		} else if (tab == "parse_transaction") {
			$("#transaction_operations_modal_button").text($.t("parse_transaction_bytes")).data("resetText", $.t("parse_transaction_bytes")).data("form", "parse_transaction_form");
		} else {
			$("#transaction_operations_modal_button").text($.t("calculate_full_hash")).data("resetText", $.t("calculate_full_hash")).data("form", "calculate_full_hash_form");
		}

		$("#transaction_operations_modal_" + tab).show();
	});

	function BroadcastTransactionCompleteForm(response, data) {
		$("#parse_transaction_form").find(".error_message").hide();
		$("#transaction_operations_modal").modal("hide");
	}

	function ParseTransactionCompleteForm(response, data) {
		$("#parse_transaction_form").find(".error_message").hide();
		$("#parse_transaction_output_table tbody").empty().append(Lm.CreateInfoTable(response, true));
		$("#parse_transaction_output").show();
	}

	function ParseTransactionErrorForm() {
		$("#parse_transaction_output_table tbody").empty();
		$("#parse_transaction_output").hide();
	}

	function CalculateFullHashCompleteForm(response, data) {
		$("#calculate_full_hash_form").find(".error_message").hide();
		$("#calculate_full_hash_output_table tbody").empty().append(Lm.CreateInfoTable(response, true));
		$("#calculate_full_hash_output").show();
	}

	function CalculateFullHashErrorForm() {
		$("#calculate_full_hash_output_table tbody").empty();
		$("#calculate_full_hash_output").hide();
	}


	Lm.ShowRawTransactionModal = ShowRawTransactionModal;
	Lm.Forms.BroadcastTransactionComplete = BroadcastTransactionCompleteForm;
	Lm.Forms.ParseTransactionComplete = ParseTransactionCompleteForm;
	Lm.Forms.ParseTransactionError = ParseTransactionErrorForm;
	Lm.Forms.CalculateFullHashComplete = CalculateFullHashCompleteForm;
	Lm.Forms.CalculateFullHashError = CalculateFullHashErrorForm;
	return Lm;
}(Lm || {}, jQuery));