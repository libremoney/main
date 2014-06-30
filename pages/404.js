function main(response) {
	console.log("404 Not foud.");
	response.writeHead(404, {"Content-Type":"text/html; charset=utf-8"});
	response.write("<html>");
	response.write("<body>");
	response.write("");
	response.write("");
	response.write("");
	response.write("<h1>404 Not found</h1>");
	response.write("");
	response.write("");
	response.write("");
	response.write("</body>");
	response.write("</html>");
	response.end();
}

exports.main = main;
