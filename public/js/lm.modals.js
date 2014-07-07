var Lm = (function(Lm, $, undefined) {
	Lm.FetchingModalData = false;

	// save the original function object
	var _superModal = $.fn.modal;

	// add locked as a new option
	$.extend(_superModal.Constructor.DEFAULTS, {
		locked: false
	});

	// capture the original hide
	var _hide = _superModal.Constructor.prototype.hide;

	// add the lock, unlock and override the hide of modal
	$.extend(_superModal.Constructor.prototype, {
		// locks the dialog so that it cannot be hidden
		lock: function() {
			this.options.locked = true;
		}
		// unlocks the dialog so that it can be hidden by 'esc' or clicking on the backdrop (if not static)
		,
		unlock: function() {
			this.options.locked = false;
		}
		// override the original hide so that the original is only called if the modal is unlocked
		,
		hide: function() {
			if (this.options.locked) return;

			_hide.apply(this, arguments);
		}
	});


	//Reset scroll position of tab when shown.
	function Tab_OnShown(e) {
		var target = $(e.target).attr("href");
		$(target).scrollTop(0);
	}

	//hide modal when another one is activated.
	function Modal_OnShow(e) {
		var $visible_modal = $(".modal.in");
		if ($visible_modal.length) {
			$visible_modal.modal("hide");
		}
	}

	function Modal_OnShown(th) {
		th.find("input[type=text]:first, input[type=password]:first").first().focus();
		th.find("input[name=converted_account_id]").val("");
		Lm.ShowedFormWarning = false; //maybe not the best place... we assume forms are only in modals?
	}

	//Reset form to initial state when modal is closed
	function Modal_OnHidden(e, th) {
		t.find(":input:not([type=hidden],button)").each(function(index) {
			var default_value = th.data("default");
			var type = th.attr("type");

			if (type == "checkbox") {
				if (default_value == "checked") {
					th.prop("checked", true);
				} else {
					th.prop("checked", false);
				}
			} else {
				if (default_value) {
					th.val(default_value);
				} else {
					th.val("");
				}
			}
		});

		//Hidden form field
		th.find("input[name=converted_account_id]").val("");

		//Hide/Reset any possible error messages
		th.find(".callout-danger:not(.never_hide), .error_message, .account_info").html("").hide();

		Lm.ShowedFormWarning = false;
	}

	function ShowModalError(errorMessage, $modal) {
		var $btn = $modal.find("button.btn-primary:not([data-dismiss=modal], .ignore)");
		$modal.find("button").prop("disabled", false);
		$modal.find(".error_message").html(String(errorMessage).escapeHTML()).show();
		$btn.button("reset");
		$modal.modal("unlock");
	}

	function CloseModal($modal) {
		if (!$modal) {
			$modal = $("div.modal.in:first");
		}
		$modal.find("button").prop("disabled", false);
		var $btn = $modal.find("button.btn-primary:not([data-dismiss=modal], .ignore)");
		$btn.button("reset");
		$modal.modal("unlock");
		$modal.modal("hide");
	}


	$('a[data-toggle="tab"]').on("shown.bs.tab", function(e) {
		Tab_OnShown(e);
	});

	$(".modal").on("show.bs.modal", function(e) {
		Modal_OnShow(e);
	});

	$(".modal").on("shown.bs.modal", function() {
		Modal_OnShown($(this));
	});

	$(".modal").on("hidden.bs.modal", function(e) {
		Modal_OnHidden(e, $(this));
	});


	Lm.ShowModalError = ShowModalError;
	Lm.CloseModal = CloseModal;
	return Lm;
}(Lm || {}, jQuery));