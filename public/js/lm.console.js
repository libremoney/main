var Lm = (function(Lm, $, undefined) {

	function ShowConsole() {
		Lm.Console = window.open("", "console", "width=750,height=400,menubar=no,scrollbars=yes,status=no,toolbar=no,resizable=yes");
		$(Lm.Console.document.head).html("<title>Console</title><style type='text/css'>body { background:black; color:white; font-family:courier-new,courier;font-size:14px; } pre { font-size:14px; } #console { padding-top:15px; }</style>");
		$(Lm.Console.document.body).html("<div style='position:fixed;top:0;left:0;right:0;padding:5px;background:#efefef;color:black;'>Console opened. Logging started...<div style='float:right;text-decoration:underline;color:blue;font-weight:bold;cursor:pointer;' onclick='document.getElementById(\"console\").innerHTML=\"\"'>clear</div></div><div id='console'></div>");
	}

	function AddToConsole(url, type, data, response, error) {
		if (!Lm.Console) {
			return;
		}

		if (!Lm.Console.document || !Lm.Console.document.body) {
			Lm.Console = null;
			return;
		}

		url = url.replace(/&random=[\.\d]+/, "", url);

		Lm.AddToConsoleBody(url + " (" + type + ") " + new Date().toString(), "url");

		if (data) {
			if (typeof data == "string") {
				var d = Lm.QueryStringToObject(data);
				Lm.AddToConsoleBody(JSON.stringify(d, null, "\t"), "post");
			} else {
				Lm.AddToConsoleBody(JSON.stringify(data, null, "\t"), "post");
			}
		}

		if (error) {
			Lm.AddToConsoleBody(response, "error");
		} else {
			Lm.AddToConsoleBody(JSON.stringify(response, null, "\t"), (response.errorCode ? "error" : ""));
		}
	}

	function AddToConsoleBody(text, type) {
		var color = "";

		switch (type) {
			case "url":
				color = "#29FD2F";
				break;
			case "post":
				color = "lightgray";
				break;
			case "error":
				color = "red";
				break;
		}

		$(Lm.Console.document.body).find("#console").append("<pre" + (color ? " style='color:" + color + "'" : "") + ">" + text.escapeHTML() + "</pre>");
	}

	function QueryStringToObject(qs) {
		qs = qs.split("&");

		if (!qs) {
			return {};
		}

		var obj = {};

		for (var i = 0; i < qs.length; ++i) {
			var p = qs[i].split('=');

			if (p.length != 2) {
				continue;
			}

			obj[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
		}

		if ("secretPhrase" in obj) {
			obj.secretPhrase = "***";
		}

		return obj;
	}


	Lm.ShowConsole = ShowConsole;
	Lm.AddToConsole = AddToConsole;
	Lm.AddToConsoleBody = AddToConsoleBody;
	Lm.QueryStringToObject = QueryStringToObject;
	return Lm;
}(Lm || {}, jQuery));