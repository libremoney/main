/**
 * @depends {lm.js}
 * @depends {lm.modals.js}
 */
var Lm = (function(Lm, $, undefined) {

	function ModalShowModal(e) {
		if (Lm.FetchingModalData) {
			return;
		}

		Lm.FetchingModalData = true;

		Lm.SendRequest("getState", function(state) {
			for (var key in state) {
				var el = $("#lm_node_state_" + key);
				if (el.length) {
					if (key.indexOf("number") != -1) {
						el.html(Lm.FormatAmount(state[key]));
					} else if (key.indexOf("Memory") != -1) {
						el.html(Lm.FormatVolume(state[key]));
					} else if (key == "time") {
						el.html(Lm.FormatTimestamp(state[key]));
					} else {
						el.html(String(state[key]).escapeHTML());
					}
				}
			}

			$("#lm_update_explanation").show();
			$("#lm_modal_state").show();

			Lm.FetchingModalData = false;
		});
	}

	function ModalHideModal(th, e) {
		$("body").off("dragover.lm, drop.lm");

		$("#lm_update_drop_zone, #lm_update_result, #lm_update_hashes, #lm_update_hash_progress").hide();

		th.find("ul.nav li.active").removeClass("active");
		$("#lm_modal_state_nav").addClass("active");

		$(".lm_modal_content").hide();
	}

	function ModalNavLiClick(th, e) {
		e.preventDefault();

		var tab = th.data("tab");

		th.siblings().removeClass("active");
		th.addClass("active");

		$(".lm_modal_content").hide();

		var content = $("#lm_modal_" + tab);

		content.show();
	}


	$("#lm_modal").on("show.bs.modal", function(e) {
		ModalShowModal(e);
	});

	$("#lm_modal").on("hide.bs.modal", function(e) {
		ModalHideModal($(this), e);
	});

	$("#lm_modal ul.nav li").click(function(e) {
		ModalNavLiClick($(this), e);
	});


	return Lm;
}(Lm || {}, jQuery));