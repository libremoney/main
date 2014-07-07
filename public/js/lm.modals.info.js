var Lm = (function(Lm, $, undefined) {

	function ModalShowModal(e) {
		if (Lm.FetchingModalData) {
			return;
		}

		Lm.FetchingModalData = true;

		Lm.SendRequest("getState", function(state) {
			for (var key in state) {
				var el = $("#nrs_node_state_" + key);
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
			$("#nrs_modal_state").show();

			Lm.FetchingModalData = false;
		});
	});

	function ModalHideModal(e, th) {
		$("body").off("dragover.nrs, drop.nrs");
		$("#lm_update_drop_zone, #lm_update_result, #lm_update_hashes, #lm_update_hash_progress").hide();
		th.find("ul.nav li.active").removeClass("active");
		$("#nrs_modal_state_nav").addClass("active");
		$(".nrs_modal_content").hide();
	});

	function ModalNavLiClick(e) {
		e.preventDefault();
		var tab = th.data("tab");
		th.siblings().removeClass("active");
		th.addClass("active");
		$(".nrs_modal_content").hide();
		var content = $("#nrs_modal_" + tab);
		content.show();
	});


	$("#nrs_modal").on("show.bs.modal", function(e) {
		Lm.ModalShowModal(e);
	});

	$("#nrs_modal").on("hide.bs.modal", function(e) {
		Lm.ModalHideModal(e, $(this));
	});

	$("#nrs_modal ul.nav li").click(function(e) {
		Lm.ModalNavLiClick(e, $(this));
	});


	Lm.ModalShowModal = ModalShowModal;
	Lm.ModalHideModal = ModalHideModal;
	Lm.ModalNavLiClick = ModalNavLiClick;
	return Lm;
}(Lm || {}, jQuery));