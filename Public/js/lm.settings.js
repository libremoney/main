/**
 * @depends {lm.js}
 */
var Lm = (function(Lm, $, undefined) {
	Lm.DefaultSettings = {
		"submit_on_enter": 0,
		"animate_forging": 1,
		"news": -1,
		"console_log": 0,
		"fee_warning": "1000",
		"amount_warning": "100000",
		"asset_transfer_warning": "10000",
		"24_hour_format": 1,
		"remember_passphrase": 0,
		"language": "en"
	};

	Lm.DefaultColors = {
		"header": "#084F6C",
		"sidebar": "#F4F4F4",
		"boxes": "#3E96BB"
	};

	var userStyles = {};

	userStyles.header = {
		"blue": {
			"header_bg": "#3c8dbc",
			"logo_bg": "#367fa9",
			"link_bg_hover": "#357ca5"
		},
		"green": {
			"header_bg": "#29BB9C",
			"logo_bg": "#26AE91",
			"link_bg_hover": "#1F8E77"
		},
		"red": {
			"header_bg": "#cb4040",
			"logo_bg": "#9e2b2b",
			"link_bg_hover": "#9e2b2b",
			"toggle_icon": "#d97474"
		},
		"brown": {
			"header_bg": "#ba5d32",
			"logo_bg": "#864324",
			"link_bg_hover": "#864324",
			"toggle_icon": "#d3815b"
		},
		"purple": {
			"header_bg": "#86618f",
			"logo_bg": "#614667",
			"link_bg_hover": "#614667",
			"toggle_icon": "#a586ad"
		},
		"gray": {
			"header_bg": "#575757",
			"logo_bg": "#363636",
			"link_bg_hover": "#363636",
			"toggle_icon": "#787878"
		},
		"pink": {
			"header_bg": "#b94b6f",
			"logo_bg": "#8b3652",
			"link_bg_hover": "#8b3652",
			"toggle_icon": "#cc7b95"
		},
		"bright-blue": {
			"header_bg": "#2494F2",
			"logo_bg": "#2380cf",
			"link_bg_hover": "#36a3ff",
			"toggle_icon": "#AEBECD"
		},
		"dark-blue": {
			"header_bg": "#25313e",
			"logo_bg": "#1b252e",
			"link_txt": "#AEBECD",
			"link_bg_hover": "#1b252e",
			"link_txt_hover": "#fff",
			"toggle_icon": "#AEBECD"
		}
	};

	userStyles.sidebar = {
		"dark-gray": {
			"sidebar_bg": "#272930",
			"user_panel_txt": "#fff",
			"sidebar_top_border": "#1a1c20",
			"sidebar_bottom_border": "#2f323a",
			"menu_item_top_border": "#32353e",
			"menu_item_bottom_border": "#1a1c20",
			"menu_item_txt": "#c9d4f6",
			"menu_item_bg_hover": "#2a2c34",
			"menu_item_border_active": "#2494F2",
			"submenu_item_bg": "#2A2A2A",
			"submenu_item_txt": "#fff",
			"submenu_item_bg_hover": "#222222"
		},
		"dark-blue": {
			"sidebar_bg": "#34495e",
			"user_panel_txt": "#fff",
			"sidebar_top_border": "#142638",
			"sidebar_bottom_border": "#54677a",
			"menu_item_top_border": "#54677a",
			"menu_item_bottom_border": "#142638",
			"menu_item_txt": "#fff",
			"menu_item_bg_hover": "#3d566e",
			"menu_item_bg_active": "#2c3e50",
			"submenu_item_bg": "#ECF0F1",
			"submenu_item_bg_hover": "#E0E7E8",
			"submenu_item_txt": "#333333"
		}
	};

	userStyles.boxes = {
		"green": {
			"bg": "#34d2b1",
			"bg_gradient": "#87e5d1"
		},
		"red": {
			"bg": "#d25b5b",
			"bg_gradient": "#da7575"
		},
		"brown": {
			"bg": "#c76436",
			"bg_gradient": "#d3825d"
		},
		"purple": {
			"bg": "#8f6899",
			"bg_gradient": "#a687ad"
		},
		"gray": {
			"bg": "#5f5f5f",
			"bg_gradient": "#797979"
		},
		"pink": {
			"bg": "#be5779",
			"bg_gradient": "#cc7c96"
		},
		"bright-blue": {
			"bg": "#349cf3",
			"bg_gradient": "#64b3f6"
		},
		"dark-blue": {
			"bg": "#2b3949",
			"bg_gradient": "#3e5369"
		}
	};

	function SettingsPage() {
		for (var style in userStyles) {
			var $dropdown = $("#" + style + "_color_scheme");

			$dropdown.empty();

			$dropdown.append("<li><a href='#' data-color=''><span class='color' style='background-color:" + Lm.DefaultColors[style] + ";border:1px solid black;'></span>Default</a></li>");

			$.each(userStyles[style], function(key, value) {
				var bg = "";
				if (value.bg) {
					bg = value.bg;
				} else if (value.header_bg) {
					bg = value.header_bg;
				} else if (value.sidebar_bg) {
					bg = value.sidebar_bg;
				}

				$dropdown.append("<li><a href='#' data-color='" + key + "'><span class='color' style='background-color: " + bg + ";border:1px solid black;'></span> " + key.replace("-", " ") + "</a></li>");
			});

			var $span = $dropdown.closest(".btn-group.colors").find("span.text");

			var color = Lm.Settings[style + "_color"];

			if (!color) {
				colorTitle = "Default";
			} else {
				var colorTitle = color.replace(/-/g, " ");
				colorTitle = colorTitle.replace(/\w\S*/g, function(txt) {
					return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
				});
			}

			$span.html(colorTitle);
		}

		for (var key in Lm.Settings) {
			if (/_warning/i.test(key) && key != "asset_transfer_warning") {
				if ($("#settings_" + key).length) {
					$("#settings_" + key).val(Lm.ConvertToNXT(Lm.Settings[key]));
				}
			} else if (!/_color/i.test(key)) {
				if ($("#settings_" + key).length) {
					$("#settings_" + key).val(Lm.Settings[key]);
				}
			}
		}

		if (Lm.Settings["news"] != -1) {
			$("#settings_news_initial").remove();
		}

		if (Lm.InApp) {
			$("#settings_console_log_div").hide();
		}

		Lm.PageLoaded();
	}

	function GetCssGradientStyle(start, stop, vertical) {
		var output = "";

		var startPosition = (vertical ? "left" : "top");

		output += "background-image: -moz-linear-gradient(" + startPosition + ", " + start + ", " + stop + ");";
		output += "background-image: -ms-linear-gradient(" + startPosition + ", " + start + ", " + stop + ");";
		output += "background-image: -webkit-gradient(linear, " + (vertical ? "left top, right top" : "0 0, 0 100%") + ", from(" + start + "), to(" + stop + "));";
		output += "background-image: -webkit-linear-gradient(" + startPosition + ", " + start + ", " + stop + ");";
		output += "background-image: -o-linear-gradient(" + startPosition + ", " + start + ", " + stop + ");";
		output += "background-image: linear-gradient(" + startPosition + ", " + start + ", " + stop + ");";
		output += "filter: progid:dximagetransform.microsoft.gradient(startColorstr='" + start + "', endColorstr='" + stop + "', GradientType=" + (vertical ? "1" : "0") + ");";
		return output;
	}

	function UpdateStyle(type, color) {
		var css = "";

		if ($.isPlainObject(color)) {
			var colors = color;
		} else {
			var colors = userStyles[type][color];
		}

		if (colors) {
			switch (type) {
				case "boxes":
					css += ".small-box { background: " + colors.bg + "; " + GetCssGradientStyle(colors.bg, colors.bg_gradient, true) + " }";

					break;
				case "header":
					if (!colors.link_txt) {
						colors.link_txt = "#fff";
					}
					if (!colors.toggle_icon) {
						colors.toggle_icon = "#fff";
					}
					if (!colors.toggle_icon_hover) {
						colors.toggle_icon_hover = "#fff";
					}
					if (!colors.link_txt_hover) {
						colors.link_txt_hover = colors.link_txt;
					}
					if (!colors.link_bg_hover && colors.link_bg) {
						colors.link_bg_hover = colors.link_bg;
					}

					if (!colors.logo_bg) {
						css += ".header { background:" + colors.header_bg + " }";
						if (colors.header_bg_gradient) {
							css += ".header { " + GetCssGradientStyle(colors.header_bg, colors.header_bg_gradient) + " }";
						}
						css += ".header .navbar { background: inherit }";
						css += ".header .logo { background: inherit }";
					} else {
						css += ".header .navbar { background:" + colors.header_bg + " }";

						if (colors.header_bg_gradient) {
							css += ".header .navbar { " + GetCssGradientStyle(colors.header_bg, colors.header_bg_gradient) + " }";
						}

						css += ".header .logo { background: " + colors.logo_bg + " }";

						if (colors.logo_bg_gradient) {
							css += ".header .logo { " + GetCssGradientStyle(colors.logo_bg, colors.logo_bg_gradient) + " }";
						}
					}

					css += ".header .navbar .nav a { color: " + colors.link_txt + (colors.link_bg ? "; background:" + colors.link_bg : "") + " }";
					css += ".header .navbar .nav > li > a:hover, .header .navbar .nav > li > a:focus, .header .navbar .nav > li > a:focus { color: " + colors.link_txt_hover + (colors.link_bg_hover ? "; background:" + colors.link_bg_hover : "") + " }";

					if (colors.link_bg_hover) {
						css += ".header .navbar .nav > li > a:hover { " + GetCssGradientStyle(colors.link_bg_hover, colors.link_bg_hover_gradient) + " }";
					}

					css += ".header .navbar .nav > li > ul a { color: #444444; }";
					css += ".header .navbar .nav > li > ul a:hover {  color: " + colors.link_txt_hover + (colors.link_bg_hover ? "; background:" + colors.link_bg_hover : "") + " }";

					css += ".header .navbar .sidebar-toggle .icon-bar { background: " + colors.toggle_icon + " }";
					css += ".header .navbar .sidebar-toggle:hover .icon-bar { background: " + colors.toggle_icon_hover + " }";

					if (colors.link_border) {
						css += ".header .navbar .nav > li { border-left: 1px solid " + colors.link_border + " }";
					}

					if (colors.link_border_inset) {
						css += ".header .navbar .nav > li { border-right: 1px solid " + colors.link_border_inset + " }";
						css += ".header .navbar .nav > li:last-child { border-right:none }";
						css += ".header .navbar .nav { border-left: 1px solid " + colors.link_border_inset + " }";
					}

					if (colors.header_border) {
						css += ".header { border-bottom: 1px solid " + colors.header_border + " }";
					}
					break;
				case "sidebar":
					if (!colors.user_panel_link) {
						colors.user_panel_link = colors.user_panel_txt;
					}
					if (!colors.menu_item_bg) {
						colors.menu_item_bg = colors.sidebar_bg;
					}
					if (!colors.menu_item_bg_active) {
						colors.menu_item_bg_active = colors.menu_item_bg_hover;
					}
					if (!colors.menu_item_txt_hover) {
						colors.menu_item_txt_hover = colors.menu_item_txt;
					}
					if (!colors.menu_item_txt_active) {
						colors.menu_item_txt_active = colors.menu_item_txt_hover;
					}
					if (!colors.menu_item_border_active && colors.menu_item_border_hover) {
						colors.menu_item_border_active = colors.menu_item_border_hover;
					}
					if (!colors.menu_item_border_size) {
						colors.menu_item_border_size = 1;
					}

					css += ".left-side { background: " + colors.sidebar_bg + " }";

					css += ".left-side .user-panel > .info { color: " + colors.user_panel_txt + " }";

					if (colors.user_panel_bg) {
						css += ".left-side .user-panel { background: " + colors.user_panel_bg + " }";
						if (colors.user_panel_bg_gradient) {
							css += ".left-side .user-panel { " + GetCssGradientStyle(colors.user_panel_bg, colors.user_panel_bg_gradient) + " }";
						}
					}

					css += ".left-side .user-panel a { color:" + colors.user_panel_link + " }";

					if (colors.sidebar_top_border || colors.sidebar_bottom_border) {
						css += ".left-side .sidebar > .sidebar-menu { " + (colors.sidebar_top_border ? "border-top: 1px solid " + colors.sidebar_top_border + "; " : "") + (colors.sidebar_bottom_border ? "border-bottom: 1px solid " + colors.sidebar_bottom_border : "") + " }";
					}

					css += ".left-side .sidebar > .sidebar-menu > li > a { background: " + colors.menu_item_bg + "; color: " + colors.menu_item_txt + (colors.menu_item_top_border ? "; border-top:1px solid " + colors.menu_item_top_border : "") + (colors.menu_item_bottom_border ? "; border-bottom: 1px solid " + colors.menu_item_bottom_border : "") + " }";

					if (colors.menu_item_bg_gradient) {
						css += ".left-side .sidebar > .sidebar-menu > li > a { " + GetCssGradientStyle(colors.menu_item_bg, colors.menu_item_bg_gradient) + " }";
					}

					css += ".left-side .sidebar > .sidebar-menu > li.active > a { background: " + colors.menu_item_bg_active + "; color: " + colors.menu_item_txt_active + (colors.menu_item_border_active ? "; border-left: " + colors.menu_item_border_size + "px solid " + colors.menu_item_border_active : "") + " }";

					if (colors.menu_item_border_hover || colors.menu_item_border_active) {
						css += ".left-side .sidebar > .sidebar-menu > li > a { border-left: " + colors.menu_item_border_size + "px solid transparent }";
					}

					if (colors.menu_item_bg_active_gradient) {
						css += ".left-side .sidebar > .sidebar-menu > li.active > a { " + GetCssGradientStyle(colors.menu_item_bg_active, colors.menu_item_bg_active_gradient) + " }";
					}

					css += ".left-side .sidebar > .sidebar-menu > li > a:hover { background: " + colors.menu_item_bg_hover + "; color: " + colors.menu_item_txt_hover + (colors.menu_item_border_hover ? "; border-left: " + colors.menu_item_border_size + "px solid " + colors.menu_item_border_hover : "") + " }";

					if (colors.menu_item_bg_hover_gradient) {
						css += ".left-side .sidebar > .sidebar-menu > li > a:hover { " + GetCssGradientStyle(colors.menu_item_bg_hover, colors.menu_item_bg_hover_gradient) + " }";
					}

					css += ".sidebar .sidebar-menu .treeview-menu > li > a { background: " + colors.submenu_item_bg + "; color: " + colors.submenu_item_txt + (colors.submenu_item_top_border ? "; border-top:1px solid " + colors.submenu_item_top_border : "") + (colors.submenu_item_bottom_border ? "; border-bottom: 1px solid " + colors.submenu_item_bottom_border : "") + " }";

					if (colors.submenu_item_bg_gradient) {
						css += ".sidebar .sidebar-menu .treeview-menu > li > a { " + GetCssGradientStyle(colors.submenu_item_bg, colors.submenu_item_bg_gradient) + " }";
					}

					css += ".sidebar .sidebar-menu .treeview-menu > li > a:hover { background: " + colors.submenu_item_bg_hover + "; color: " + colors.submenu_item_txt_hover + " }";

					if (colors.submenu_item_bg_hover_gradient) {
						css += ".sidebar .sidebar-menu .treeview-menu > li > a:hover { " + GetCssGradientStyle(colors.submenu_item_bg_hover, colors.submenu_item_bg_hover_gradient) + " }";
					}

					break;
			}
		}

		var $style = $("#user_" + type + "_style");

		if ($style[0].styleSheet) {
			$style[0].styleSheet.cssText = css;
		} else {
			$style.text(css);
		}
	}

	function ColorSchemeEditor_OnClick(th, e) {
		e.preventDefault();

		var color = th.data("color");

		var scheme = th.closest("ul").data("scheme");

		var $span = th.closest(".btn-group.colors").find("span.text");

		if (!color) {
			colorTitle = "Default";
		} else {
			var colorTitle = color.replace(/-/g, " ");
			colorTitle = colorTitle.replace(/\w\S*/g, function(txt) {
				return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
			});
		}

		$span.html(colorTitle);

		if (color) {
			Lm.UpdateSettings(scheme + "_color", color);
			Lm.UpdateStyle(scheme, color);
		} else {
			Lm.UpdateSettings(scheme + "_color");
			Lm.UpdateStyle(scheme);
		}
	}

	function GetSettings() {
		if (Lm.DatabaseSupport) {
			Lm.Database.select("data", [{
				"id": "settings"
			}], function(error, result) {
				if (result && result.length) {
					Lm.Settings = $.extend({}, Lm.DefaultSettings, JSON.parse(result[0].contents));
				} else {
					Lm.Database.insert("data", {
						id: "settings",
						contents: "{}"
					});
					Lm.Settings = Lm.DefaultSettings;
				}
				Lm.ApplySettings();
			});
		} else {
			if (Lm.HasLocalStorage) {
				Lm.Settings = $.extend({}, Lm.DefaultSettings, JSON.parse(localStorage.getItem("settings")));
			} else {
				Lm.Settings = Lm.DefaultSettings;
			}
			Lm.ApplySettings();
		}
	}

	function ApplySettings(key) {
		if (!key || key == "language") {
			if ($.i18n.lng() != Lm.Settings["language"]) {
				$.i18n.setLng(Lm.Settings["language"], null, function() {
					$("[data-i18n]").i18n();
				});
				if (key && window.localstorage) {
					window.localStorage.setItem('i18next_lng', Lm.Settings["language"]);
				}
				if (Lm.InApp) {
					parent.postMessage({
						"type": "language",
						"version": Lm.Settings["language"]
					}, "*");
				}
			}
		}

		if (!key || key == "submit_on_enter") {
			if (Lm.Settings["submit_on_enter"]) {
				$(".modal form:not('#decrypt_note_form_container')").on("submit.onEnter", function(e) {
					e.preventDefault();
					Lm.SubmitForm($(this).closest(".modal"));
				});
			} else {
				$(".modal form").off("submit.onEnter");
			}
		}

		if (!key || key == "animate_forging") {
			if (Lm.Settings["animate_forging"]) {
				$("#forging_indicator").addClass("animated");
			} else {
				$("#forging_indicator").removeClass("animated");
			}
		}

		if (!key || key == "news") {
			if (Lm.Settings["news"] == 0) {
				$("#news_link").hide();
			} else if (Lm.Settings["news"] == 1) {
				$("#news_link").show();
			}
		}

		if (!Lm.InApp && !Lm.DownloadingBlockchain) {
			if (!key || key == "console_log") {
				if (Lm.Settings["console_log"] == 0) {
					$("#show_console").hide();
				} else {
					$("#show_console").show();
				}
			}
		} else if (Lm.InApp) {
			$("#show_console").hide();
		}

		if (key == "24_hour_format") {
			var $dashboard_dates = $("#dashboard_transactions_table a[data-timestamp], #dashboard_blocks_table td[data-timestamp]");

			$.each($dashboard_dates, function(key, value) {
				$(this).html(Lm.FormatTimestamp($(this).data("timestamp")));
			});
		}

		if (!key || key == "remember_passphrase") {
			if (Lm.Settings["remember_passphrase"]) {
				Lm.SetCookie("remember_passphrase", 1, 1000);
			} else {
				Lm.DeleteCookie("remember_passphrase");
			}
		}
	}

	function UpdateSettings(key, value) {
		if (key) {
			Lm.Settings[key] = value;
		}

		if (Lm.DatabaseSupport) {
			Lm.Database.update("data", {
				contents: JSON.stringify(Lm.Settings)
			}, [{
				id: "settings"
			}]);
		} else if (Lm.HasLocalStorage) {
			localStorage.setItem("settings", JSON.stringify(Lm.Settings));
		}

		Lm.ApplySettings(key);
	}

	$("#settings_box select").on("change", function(e) {
		e.preventDefault();

		var key = $(this).attr("name");
		var value = $(this).val();

		Lm.UpdateSettings(key, value);
	});

	$("#settings_box input[type=text]").on("input", function(e) {
		var key = $(this).attr("name");
		var value = $(this).val();

		if (/_warning/i.test(key) && key != "asset_transfer_warning") {
			value = Lm.ConvertToNQT(value);
		}
		Lm.UpdateSettings(key, value);
	});


	$("ul.color_scheme_editor").on("click", "li a", function(e) {
		ColorSchemeEditor_OnClick($(this), e);
	});


	Lm.Pages.Settings = SettingsPage;
	Lm.UpdateStyle = UpdateStyle;
	Lm.GetSettings = GetSettings;
	Lm.ApplySettings = ApplySettings;
	Lm.UpdateSettings = UpdateSettings;
	return Lm;
}(Lm || {}, jQuery));