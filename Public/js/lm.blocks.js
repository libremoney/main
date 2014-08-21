/**
 * @depends {lm.js}
 */
var Lm = (function(Lm, $, undefined) {
	Lm.BlocksPageType = null;
	Lm.TempBlocks = [];
	var trackBlockchain = false;


	function GetBlock(blockID, callback, pageRequest) {
		Lm.SendRequest("getBlock" + (pageRequest ? "+" : ""), {
			"block": blockID
		}, function(response) {
			if (response.errorCode && response.errorCode == -1) {
				Lm.GetBlock(blockID, callback, pageRequest);
			} else {
				if (callback) {
					response.block = blockID;
					callback(response);
				}
			}
		}, true);
	}

	function HandleInitialBlocks(response) {
		if (response.errorCode) {
			Lm.DataLoadFinished($("#dashboard_blocks_table"));
			return;
		}

		Lm.Blocks.push(response);

		if (Lm.Blocks.length < 10 && response.previousBlock) {
			Lm.GetBlock(response.previousBlock, Lm.HandleInitialBlocks);
		} else {
			Lm.CheckBlockHeight(Lm.Blocks[0].height);

			if (Lm.State) {
				//if no new blocks in 6 hours, show blockchain download progress..
				var timeDiff = Lm.State.time - Lm.Blocks[0].timestamp;
				if (timeDiff > 60 * 60 * 18) {
					if (timeDiff > 60 * 60 * 24 * 14) {
						Lm.SetStateInterval(30);
					} else if (timeDiff > 60 * 60 * 24 * 7) {
						//second to last week
						Lm.SetStateInterval(15);
					} else {
						//last week
						Lm.SetStateInterval(10);
					}
					Lm.DownloadingBlockchain = true;
					$("#lm_update_explanation span").hide();
					$("#lm_update_explanation_wait").attr("style", "display: none !important");
					$("#downloading_blockchain, #lm_update_explanation_blockchain_sync").show();
					$("#show_console").hide();
					Lm.UpdateBlockchainDownloadProgress();
				} else {
					//continue with faster state intervals if we still haven't reached current block from within 1 hour
					if (timeDiff < 60 * 60) {
						Lm.SetStateInterval(30);
						trackBlockchain = false;
					} else {
						Lm.SetStateInterval(10);
						trackBlockchain = true;
					}
				}
			}

			var rows = "";

			for (var i = 0; i < Lm.Blocks.length; i++) {
				var block = Lm.Blocks[i];

				rows += "<tr><td><a href='#' data-block='" + String(block.height).escapeHTML() + "' data-blockid='" +
					String(block.block).escapeHTML() + "' class='block'" + (block.numberOfTransactions > 0 ? " style='font-weight:bold'" : "") + ">" +
					String(block.height).escapeHTML() + "</a></td>"+
					"<td data-timestamp='" + String(block.timestamp).escapeHTML() + "'>" + Lm.FormatTimestamp(block.timestamp) + "</td>"+
					"<td>" + Lm.FormatAmount(block.totalAmountMilliLm) + " + " + Lm.FormatAmount(block.totalFeeMilliLm) + "</td>"+
					"<td>" + Lm.FormatAmount(block.numberOfTransactions) + "</td></tr>";
			}

			$("#dashboard_blocks_table tbody").empty().append(rows);
			Lm.DataLoadFinished($("#dashboard_blocks_table"));
		}
	}

	function HandleNewBlocks(response) {
		if (Lm.DownloadingBlockchain) {
			//new round started...
			if (Lm.TempBlocks.length == 0 && Lm.State.lastBlock != response.block) {
				return;
			}
		}

		//we have all blocks 	
		if (response.height - 1 == Lm.LastBlockHeight || Lm.TempBlocks.length == 99) {
			var newBlocks = [];

			//there was only 1 new block (response)
			if (Lm.TempBlocks.length == 0) {
				//remove oldest block, add newest block
				Lm.Blocks.unshift(response);
				newBlocks.push(response);
			} else {
				Lm.TempBlocks.push(response);
				//remove oldest blocks, add newest blocks
				[].unshift.apply(Lm.Blocks, Lm.TempBlocks);
				newBlocks = Lm.TempBlocks;
				Lm.TempBlocks = [];
			}

			if (Lm.Blocks.length > 100) {
				Lm.Blocks = Lm.Blocks.slice(0, 100);
			}

			Lm.CheckBlockHeight(Lm.Blocks[0].height);

			Lm.Incoming.updateDashboardBlocks(newBlocks);
		} else {
			Lm.TempBlocks.push(response);
			Lm.GetBlock(response.previousBlock, Lm.HandleNewBlocks);
		}
	}

	function CheckBlockHeight(blockHeight) {
		if (blockHeight) {
			Lm.LastBlockHeight = blockHeight;
		}

		if (!Lm.DgsBlockPassed) {
			if ((!Lm.IsTestNet && (Lm.LastBlockHeight >= 213000 || (Lm.DownloadingBlockchain && Lm.State.lastBlockchainFeederHeight >= 213000))) ||
					(Lm.IsTestNet && Lm.LastBlockHeight >= 117910)) {
				Lm.DgsBlockPassed = true;
				$(".dgs_block").not(".advanced, .optional_message, .optional_note").show();
			}
		}
		if (!Lm.PKAnnouncementBlockPassed) {
			if ((!Lm.IsTestNet && (Lm.LastBlockHeight >= 215000 || (Lm.DownloadingBlockchain && Lm.State.lastBlockchainFeederHeight >= 215000))) ||
					(Lm.IsTestNet && Lm.LastBlockHeight >= 117910)) {
				Lm.PKAnnouncementBlockPassed = true;
			}
		}
	}

	//we always update the dashboard page..
	function UpdateDashboardBlocksIncoming(newBlocks) {
		var newBlockCount = newBlocks.length;

		if (newBlockCount > 10) {
			newBlocks = newBlocks.slice(0, 10);
			newBlockCount = newBlocks.length;
		}

		if (Lm.DownloadingBlockchain) {
			if (Lm.State) {
				var timeDiff = Lm.State.time - Lm.Blocks[0].timestamp;
				if (timeDiff < 60 * 60 * 18) {
					if (timeDiff < 60 * 60) {
						Lm.SetStateInterval(30);
					} else {
						Lm.SetStateInterval(10);
						trackBlockchain = true;
					}
					Lm.DownloadingBlockchain = false;
					$("#dashboard_message").hide();
					$("#downloading_blockchain, #lm_update_explanation_blockchain_sync").hide();
					$("#lm_update_explanation_wait").removeAttr("style");
					if (Lm.Settings["console_log"] && !Lm.InApp) {
						$("#show_console").show();
					}
					$.growl($.t("success_blockchain_up_to_date"), {
						"type": "success"
					});
					Lm.CheckAliasVersions();
					Lm.CheckIfOnAFork();
				} else {
					if (timeDiff > 60 * 60 * 24 * 14) {
						Lm.SetStateInterval(30);
					} else if (timeDiff > 60 * 60 * 24 * 7) {
						//second to last week
						Lm.SetStateInterval(15);
					} else {
						//last week
						Lm.SetStateInterval(10);
					}

					Lm.UpdateBlockchainDownloadProgress();
				}
			}
		} else if (trackBlockchain) {
			var timeDiff = Lm.State.time - Lm.Blocks[0].timestamp;

			//continue with faster state intervals if we still haven't reached current block from within 1 hour
			if (timeDiff < 60 * 60) {
				Lm.SetStateInterval(30);
				trackBlockchain = false;
			} else {
				Lm.SetStateInterval(10);
			}
		}

		var rows = "";

		for (var i = 0; i < newBlockCount; i++) {
			var block = newBlocks[i];

			rows += "<tr><td><a href='#' data-block='" + String(block.height).escapeHTML() + "' data-blockid='" +
				String(block.block).escapeHTML() + "' class='block'" + (block.numberOfTransactions > 0 ? " style='font-weight:bold'" : "") + ">" +
				String(block.height).escapeHTML() + "</a></td>"+
				"<td data-timestamp='" + String(block.timestamp).escapeHTML() + "'>" + Lm.FormatTimestamp(block.timestamp) + "</td>"+
				"<td>" + Lm.FormatAmount(block.totalAmountMilliLm) + " + " + Lm.FormatAmount(block.totalFeeMilliLm) + "</td>"+
				"<td>" + Lm.FormatAmount(block.numberOfTransactions) + "</td></tr>";
		}

		if (newBlockCount == 1) {
			$("#dashboard_blocks_table tbody tr:last").remove();
		} else if (newBlockCount == 10) {
			$("#dashboard_blocks_table tbody").empty();
		} else {
			$("#dashboard_blocks_table tbody tr").slice(10 - newBlockCount).remove();
		}

		$("#dashboard_blocks_table tbody").prepend(rows);

		//update number of confirmations... perhaps we should also update it in tne Lm.Transactions array
		$("#dashboard_transactions_table tr.confirmed td.confirmations").each(function() {
			if ($(this).data("incoming")) {
				$(this).removeData("incoming");
				return true;
			}

			var confirmations = parseInt($(this).data("confirmations"), 10);

			var nrConfirmations = confirmations + newBlocks.length;

			if (confirmations <= 10) {
				$(this).data("confirmations", nrConfirmations);
				$(this).attr("data-content", $.t("x_confirmations", {
					"x": Lm.FormatAmount(nrConfirmations, false, true)
				}));

				if (nrConfirmations > 10) {
					nrConfirmations = '10+';
				}
				$(this).html(nrConfirmations);
			} else {
				$(this).attr("data-content", $.t("x_confirmations", {
					"x": Lm.FormatAmount(nrConfirmations, false, true)
				}));
			}
		});
	}

	function BlocksPage() {
		if (Lm.BlocksPageType == "forged_blocks") {
			$("#forged_fees_total_box, #forged_blocks_total_box").show();
			$("#blocks_transactions_per_hour_box, #blocks_generation_time_box").hide();

			Lm.SendRequest("getAccountBlockIds+", {
				"account": Lm.Account,
				"timestamp": 0
			}, function(response) {
				if (response.blockIds && response.blockIds.length) {
					var blocks = [];
					var nrBlocks = 0;

					var blockIds = response.blockIds.reverse().slice(0, 100);

					if (response.blockIds.length > 100) {
						$("#blocks_page_forged_warning").show();
					}

					for (var i = 0; i < blockIds.length; i++) {
						Lm.SendRequest("getBlock+", {
							"block": blockIds[i],
							"_extra": {
								"nr": i
							}
						}, function(block, input) {
							if (Lm.CurrentPage != "blocks") {
								blocks = {};
								return;
							}

							block["block"] = input.block;
							blocks[input["_extra"].nr] = block;
							nrBlocks++;

							if (nrBlocks == blockIds.length) {
								Lm.BlocksPageLoaded(blocks);
							}
						});
					}
				} else {
					Lm.BlocksPageLoaded([]);
				}
			});
		} else {
			$("#forged_fees_total_box, #forged_blocks_total_box").hide();
			$("#blocks_transactions_per_hour_box, #blocks_generation_time_box").show();

			if (Lm.Blocks.length < 100) {
				if (Lm.DownloadingBlockchain) {
					Lm.BlocksPageLoaded(Lm.Blocks);
				} else {
					if (Lm.Blocks && Lm.Blocks.length) {
						var previousBlock = Lm.Blocks[Lm.Blocks.length - 1].previousBlock;
						//if previous block is undefined, dont try add it
						if (typeof previousBlock !== "undefined") {
							Lm.GetBlock(previousBlock, Lm.Finish100Blocks, true);
						}
					} else {
						Lm.BlocksPageLoaded([]);
					}
				}
			} else {
				Lm.BlocksPageLoaded(Lm.Blocks);
			}
		}
	}

	function BlocksIncoming() {
		Lm.LoadPage("blocks");
	}

	function Finish100Blocks(response) {
		Lm.Blocks.push(response);
		if (Lm.Blocks.length < 100 && typeof response.previousBlock !== "undefined") {
			Lm.GetBlock(response.previousBlock, Lm.Finish100Blocks, true);
		} else {
			Lm.BlocksPageLoaded(Lm.Blocks);
		}
	}

	function BlocksPageLoaded(blocks) {
		var rows = "";
		var totalAmount = new BigInteger("0");
		var totalFees = new BigInteger("0");
		var totalTransactions = 0;

		for (var i = 0; i < blocks.length; i++) {
			var block = blocks[i];

			totalAmount = totalAmount.add(new BigInteger(block.totalAmountMilliLm));

			totalFees = totalFees.add(new BigInteger(block.totalFeeMilliLm));

			totalTransactions += block.numberOfTransactions;

			rows += "<tr><td><a href='#' data-block='" + String(block.height).escapeHTML() + "' data-blockid='" + String(block.block).escapeHTML() +
				"' class='block'" + (block.numberOfTransactions > 0 ? " style='font-weight:bold'" : "") + ">" + String(block.height).escapeHTML() + "</a></td>"+
				"<td>" + Lm.FormatTimestamp(block.timestamp) + "</td>" +
				"<td>" + Lm.FormatAmount(block.totalAmountMilliLm) + "</td>" +
				"<td>" + Lm.FormatAmount(block.totalFeeMilliLm) + "</td>" +
				"<td>" + Lm.FormatAmount(block.numberOfTransactions) + "</td>" +
				"<td>" + (block.generator != Lm.Genesis ? "<a href='#' data-user='" + Lm.GetAccountFormatted(block, "generator") +
					"' class='user_info'>" + Lm.GetAccountTitle(block, "generator") + "</a>" : $.t("genesis")) + "</td>" +
				"<td>" + Lm.FormatVolume(block.payloadLength) + "</td>" +
				"<td>" + Math.round(block.baseTarget / 153722867 * 100).pad(4) + " %</td></tr>";
		}

		if (blocks.length) {
			var startingTime = blocks[blocks.length - 1].timestamp;
			var endingTime = blocks[0].timestamp;
			var time = endingTime - startingTime;
		} else {
			var startingTime = endingTime = time = 0;
		}

		if (blocks.length) {
			var averageFee = new Big(totalFees.toString()).div(new Big("100000000")).div(new Big(String(blocks.length))).toFixed(2);
			var averageAmount = new Big(totalAmount.toString()).div(new Big("100000000")).div(new Big(String(blocks.length))).toFixed(2);
		} else {
			var averageFee = 0;
			var averageAmount = 0;
		}

		averageFee = Lm.ConvertToMilliLm(averageFee);
		averageAmount = Lm.ConvertToMilliLm(averageAmount);

		$("#blocks_average_fee").html(Lm.FormatStyledAmount(averageFee)).removeClass("loading_dots");
		$("#blocks_average_amount").html(Lm.FormatStyledAmount(averageAmount)).removeClass("loading_dots");

		if (Lm.BlocksPageType == "forged_blocks") {
			if (blocks.length == 100) {
				var blockCount = blocks.length + "+";
			} else {
				var blockCount = blocks.length;
			}

			$("#forged_blocks_total").html(blockCount).removeClass("loading_dots");
			$("#forged_fees_total").html(Lm.FormatStyledAmount(Lm.AccountInfo.forgedBalanceMilliLm)).removeClass("loading_dots");
		} else {
			if (time == 0) {
				$("#blocks_transactions_per_hour").html("0").removeClass("loading_dots");
			} else {
				$("#blocks_transactions_per_hour").html(Math.round(totalTransactions / (time / 60) * 60)).removeClass("loading_dots");
			}
			$("#blocks_average_generation_time").html(Math.round(time / 100) + "s").removeClass("loading_dots");
		}

		Lm.DataLoaded(rows);
	}

	function BlocksPageTypeBtn_OnClick(th, e) {
		//	$("#blocks_page_type li a").click(function(e) {
		e.preventDefault();

		Lm.BlocksPageType = th.data("type");

		$("#blocks_average_amount, #blocks_average_fee, #blocks_transactions_per_hour, #blocks_average_generation_time, #forged_blocks_total, #forged_fees_total").html("<span>.</span><span>.</span><span>.</span></span>").addClass("loading_dots");
		$("#blocks_table tbody").empty();
		$("#blocks_table").parent().addClass("data-loading").removeClass("data-empty");

		Lm.LoadPage("blocks");
	}

	function GotoForgetBlocks_OnClick(e) {
		e.preventDefault();

		$("#blocks_page_type").find(".btn:last").button("toggle");
		Lm.BlocksPageType = "forged_blocks";
		Lm.GoToPage("blocks");
	}


	$("#blocks_page_type .btn").click(function(e) {
		BlocksPageTypeBtn_OnClick($(this), e);
	});

	$("#goto_forged_blocks").click(function(e) {
		GotoForgetBlocks_OnClick(e);
	});


	Lm.GetBlock = GetBlock;
	Lm.HandleInitialBlocks = HandleInitialBlocks;
	Lm.HandleNewBlocks = HandleNewBlocks;
	Lm.CheckBlockHeight = CheckBlockHeight;
	Lm.Incoming.UpdateDashboardBlocks = UpdateDashboardBlocksIncoming;
	Lm.Pages.Blocks = BlocksPage;
	Lm.Incoming.Blocks = BlocksIncoming;
	Lm.Finish100Blocks = Finish100Blocks;
	Lm.BlocksPageLoaded = BlocksPageLoaded;
	return Lm;
}(Lm || {}, jQuery));