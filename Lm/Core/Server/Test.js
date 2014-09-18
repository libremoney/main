/**!
 * LibreMoney test 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var Convert = require(__dirname + '/../../Util/Convert');


var header =
	'<!DOCTYPE html>\n' +
	'<html>\n' +
	'<head>\n' +
	'    <meta charset="UTF-8"/>\n' +
	'    <meta http-equiv="X-UA-Compatible" content="IE=edge">' +
	'    <meta name="viewport" content="width=device-width, initial-scale=1">' + 
	'    <title>LibreMoney http API</title>\n' +
	'    <link href="css/bootstrap.min.css" rel="stylesheet" type="text/css" />' +
	'    <style type="text/css">\n' +
	'        table {border-collapse: collapse;}\n' +
	'        td {padding: 10px;}\n' +
	'        .result {white-space: pre; font-family: monospace;}\n' +
	'    </style>\n' +
	'    <script type="text/javascript">\n' +
	'        function submitForm(form) {\n' +
	'            var url = "api";\n' +
	'            var params = "";\n' +
	'            for (i = 0; i < form.elements.length; i++) {\n' +
	'                if (! form.elements[i].name) {\n' +
	'                    continue;\n' +
	'                }\n' +
	'                if (i > 0) {\n' +
	'                    params += "&";\n' +
	'                }\n' +
	'                params += encodeURIComponent(form.elements[i].name);\n' +
	'                params += "=";\n' +
	'                params += encodeURIComponent(form.elements[i].value);\n' +
	'            }\n' +
	'            var request = new XMLHttpRequest();\n' +
	'            request.open("POST", url, false);\n' +
	'            request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");\n' +
	'            request.send(params);\n' +
	'            var result = JSON.stringify(JSON.parse(request.responseText), null, 4);\n' +
	'            form.getElementsByClassName("result")[0].textContent = result;\n' +
	'            return false;\n' +
	'        }\n' +
	'    </script>\n' +
	'</head>\n' +
	'<body>\n' +
	'<div class="navbar navbar-default" role="navigation">' +
	'   <div class="container">' + 
	'       <div class="navbar-header">' +
	'           <a class="navbar-brand" href="#">LibreMoney http API</a>' + 
	'       </div>' +
	'       <div class="navbar-collapse collapse">' +
	'           <ul class="nav navbar-nav navbar-right">' +
	'               <li><a href="https://wiki.nxtcrypto.org/wiki/Nxt_API" target="_blank">Docs</a></li>' +
	'           </ul>' +
	'       </div>' +
	'   </div>' + 
	'</div>' +
	'<div class="container">' +
	'<div class="row">' +
	'<div class="col-xs-12">' +
	'<div class="panel-group" id="accordion">';

var footer =
	'</div> <!-- panel-group -->' +
	'<br/><br/>' +
	'</div> <!-- col -->' +
	'</div> <!-- row -->' +
	'</div> <!-- container -->' +
	'<script src="js/3rdparty/jquery-2.1.0.js"></script>' +
	'<script src="js/3rdparty/bootstrap.js" type="text/javascript"></script>' +
	'</body>\n' +
	'</html>\n';

/*
private static final List<String> requestTypes = new ArrayList<>(APIServlet.apiRequestHandlers.keySet());
static {
	Collections.sort(requestTypes);
}
*/


function Test(req, res) {
	//res.send('This is not implemented');

	//res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate, private");
	//res.setHeader("Pragma", "no-cache");
	//res.setDateHeader("Expires", 0);
	//res.setContentType("text/html; charset=UTF-8");

	var writer = header;
	/*
	var requestType = Convert.NullToEmpty(req.search.requestType);
	var requestHandler = requestType; //APIServlet.apiRequestHandlers.get(requestType);
	if (requestHandler != null) {
		writer += Form(requestType, requestHandler.getParameters()));
	} else {
		for (var type in requestTypes) {
			writer += Form(type, APIServlet.apiRequestHandlers.get(type).getParameters()));
		}
	}
	*/
	writer += footer;
	res.send(writer);
}

function Form(requestType, parameters) {
	var buf = "";
	buf += "<div class=\"panel panel-default\">";
	buf += "<div class=\"panel-heading\">";
	buf += "<h4 class=\"panel-title\">";
	buf += "<a data-toggle=\"collapse\" data-parent=\"#accordion\" href=\"#collapse";
	buf += requestType + "\">";
	buf += requestType;
	buf += "</a>";
	buf += "</h4>";
	buf += "</div> <!-- panel-heading -->";
	buf += "<div id=\"collapse" + requestType + "\" class=\"panel-collapse collapse\">";
	buf += "<div class=\"panel-body\">";
	buf += "<form action=\"/nxt\" method=\"POST\" onsubmit=\"return submitForm(this);\">";
	buf += "<pre class=\"result\" style=\"float:right;width:50%;\">JSON response</pre>";
	buf += "<input type=\"hidden\" name=\"requestType\" value=\"" + requestType + "\"/>";
	buf += "<table class=\"table\" style=\"width:46%;\">";
	for (var parameter in parameters) {
		buf += "<tr>";
		buf += "<td>" + parameter + ":</td>";
		buf += "<td><input type=\"";
		buf += (parameter == "secretPhrase" ? "password" : "text");
		buf += "\" name=\"" + parameter + "\" style=\"width:200px;\"/></td>";
		buf += "</tr>";
	}
	buf += "<tr>";
	buf += "<td colspan=\"2\"><input type=\"submit\" class=\"btn btn-default\" value=\"submit\"/></td>";
	buf += "</tr>";
	buf += "</table>";
	buf += "</form>";
	buf += "</div> <!-- panel-body -->";
	buf += "</div> <!-- panel-collapse -->";
	buf += "</div> <!-- panel -->";
	return buf;
}


module.exports = Test;
