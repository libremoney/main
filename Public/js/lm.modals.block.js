/**
 * @depends {lm.js}
 * @depends {lm.modals.js}
 */
var Lm = (function(Lm, $, undefined) {

	function BlocksTable_OnClick(th, event) {
		event.preventDefault();

		if (Lm.FetchingModalData) {
			return;
		}

		Lm.FetchingModalData = true;

		var blockHeight = $(th).data("block");

		Lm.SendRequest("getBlock+", {
			"height": blockHeight,
			"includeTransactions": "true"
		}, function(response) {
			Lm.ShowBlockModal(response);
		});
	}

	function ShowBlockModal(block) {
		$("#block_info_modal_block").html(String(block.block).escapeHTML());

		$("#block_info_transactions_tab_link").tab("show");

		var blockDetails = $.extend({}, block);
		delete blockDetails.transactions;
		delete blockDetails.previousBlockHash;
		delete blockDetails.nextBlockHash;
		delete blockDetails.generationSignature;
		delete blockDetails.payloadHash;
		delete blockDetails.block;

		$("#block_info_details_table tbody").empty().append(Lm.CreateInfoTable(blockDetails));
		$("#block_info_details_table").show();

		if (block.transactions.length) {
			$("#block_info_transactions_none").hide();
			$("#block_info_transactions_table").show();

			var rows = "";

			block.transactions.sort(function(a, b) {
				return a.timestamp - b.timestamp;
			});

			for (var i = 0; i < block.transactions.length; i++) {
				var transaction = block.transactions[i];

				if (transaction.amountMilliLm) {
					transaction.amount = new BigInteger(transaction.amountMilliLm);
					transaction.fee = new BigInteger(transaction.feeMilliLm);
				}

				rows += "<tr><td>" + Lm.FormatTime(transaction.timestamp) + "</td>" +
					"<td>" + Lm.FormatAmount(transaction.amount) + "</td>" +
					"<td>" + Lm.FormatAmount(transaction.fee) + "</td>" +
					"<td>" + Lm.GetAccountTitle(transaction, "recipient") + "</td>" +
					"<td>" + Lm.GetAccountTitle(transaction, "sender") + "</td></tr>";
			}

			$("#block_info_transactions_table tbody").empty().append(rows);
			$("#block_info_modal").modal("show");

			Lm.FetchingModalData = false;
		} else {
			$("#block_info_transactions_none").show();
			$("#block_info_transactions_table").hide();
			$("#block_info_modal").modal("show");

			Lm.FetchingModalData = false;
		}
	}


	$("#blocks_table, #dashboard_blocks_table").on("click", "a[data-block]", function(event) {
		BlocksTable_OnClick(this, event);
	});


	Lm.ShowBlockModal = ShowBlockModal;
	return Lm;
}(Lm || {}, jQuery));