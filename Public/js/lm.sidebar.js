/**
 * @depends {lm.js}
 */
var Lm = (function(Lm, $, undefined) {

	function SidebarContext_OnContextmenu(th, e) {
		e.preventDefault();

		if (!Lm.DatabaseSupport) {
			return;
		}

		Lm.CloseContextMenu();

		if (th.hasClass("no-context")) {
			return;
		}

		Lm.SelectedContext = th;

		Lm.SelectedContext.addClass("context");

		$(document).on("click.contextmenu", Lm.CloseContextMenu);

		var contextMenu = th.data("context");

		if (!contextMenu) {
			contextMenu = th.closest(".list-group").attr("id") + "_context";
		}

		var $contextMenu = $("#" + contextMenu);

		if ($contextMenu.length) {
			var $options = $contextMenu.find("ul.dropdown-menu a");

			$.each($options, function() {
				var requiredClass = th.data("class");

				if (!requiredClass) {
					th.show();
				} else if (Lm.SelectedContext.hasClass(requiredClass)) {
					th.show();
				} else {
					th.hide();
				}
			});

			$contextMenu.css({
				display: "block",
				left: e.pageX,
				top: e.pageY
			});
		}

		return false;
	}

	function CloseContextMenu(e) {
		if (e && e.which == 3) {
			return;
		}

		$(".context_menu").hide();

		if (Lm.SelectedContext) {
			Lm.SelectedContext.removeClass("context");
		}

		$(document).off("click.contextmenu");
	}


	$(".sidebar_context").on("contextmenu", "a", function(e) {
		SidebarContext_OnContextmenu($(this), e);
	});


	Lm.CloseContextMenu = CloseContextMenu;
	return Lm;
}(Lm || {}, jQuery));