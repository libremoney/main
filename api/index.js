/*
from nxt/http/API.java

import nxt.Constants;
import nxt.Nxt;
import nxt.util.Logger;
import nxt.util.ThreadPool;
import org.eclipse.jetty.server.HttpConfiguration;
import org.eclipse.jetty.server.HttpConnectionFactory;
import org.eclipse.jetty.server.SecureRequestCustomizer;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.server.ServerConnector;
import org.eclipse.jetty.server.SslConnectionFactory;
import org.eclipse.jetty.server.handler.ContextHandler;
import org.eclipse.jetty.server.handler.DefaultHandler;
import org.eclipse.jetty.server.handler.HandlerList;
import org.eclipse.jetty.server.handler.ResourceHandler;
import org.eclipse.jetty.servlet.FilterHolder;
import org.eclipse.jetty.servlet.FilterMapping;
import org.eclipse.jetty.servlet.ServletHandler;
import org.eclipse.jetty.servlets.CrossOriginFilter;
import org.eclipse.jetty.util.ssl.SslContextFactory;

from nxt/http/APIServlet.java

import nxt.Constants;
import nxt.Nxt;
import nxt.NxtException;
import nxt.util.JSON;
import nxt.util.Logger;
import org.json.simple.JSONStreamAware;
import static nxt.http.JSONResponses.ERROR_INCORRECT_REQUEST;
import static nxt.http.JSONResponses.ERROR_NOT_ALLOWED;
import static nxt.http.JSONResponses.POST_REQUIRED;
*/


function DeleteUser(req, res) {
	res.send('This is not implemented now /api/user/:id');
}

function GetMain(req, res) {
	var S = '';
	for(var i = 0; i <= req.length; i++) {
		S = S + req[i];
	}
	res.send('<!DOCTYPE html><html><body>LibreMoney API<br/>'+S+'</body></html>');
	//res.send('<html><body>users, user/:id</body></html>');
}

function GetUser(req, res) {
	res.send('This is not implemented now /api/user/:id');
}

function GetUsers(req, res) {
	res.send('This is not implemented now /api/users');
}

function PostUsers(req, res) {
	res.send('This is not implemented now /api/users');
}

function PutUser(req, res) {
	res.send('This is not implemented now /api/user/:id');
}




/*
private static final int TESTNET_API_PORT = 6876;

static final Set<String> allowedBotHosts;

private static final Server apiServer;

static {
	List<String> allowedBotHostsList = Nxt.getStringListProperty("nxt.allowedBotHosts");
	if (! allowedBotHostsList.contains("*")) {
		allowedBotHosts = Collections.unmodifiableSet(new HashSet<>(allowedBotHostsList));
	} else {
		allowedBotHosts = null;
	}

	boolean enableAPIServer = Nxt.getBooleanProperty("nxt.enableAPIServer");
	if (enableAPIServer) {
		final int port = Constants.isTestnet ? TESTNET_API_PORT : Nxt.getIntProperty("nxt.apiServerPort");
		final String host = Nxt.getStringProperty("nxt.apiServerHost");
		apiServer = new Server();
		ServerConnector connector;

		boolean enableSSL = Nxt.getBooleanProperty("nxt.apiSSL");
		if (enableSSL) {
			Logger.logMessage("Using SSL (https) for the API server");
			HttpConfiguration https_config = new HttpConfiguration();
			https_config.setSecureScheme("https");
			https_config.setSecurePort(port);
			https_config.addCustomizer(new SecureRequestCustomizer());
			SslContextFactory sslContextFactory = new SslContextFactory();
			sslContextFactory.setKeyStorePath(Nxt.getStringProperty("nxt.keyStorePath"));
			sslContextFactory.setKeyStorePassword(Nxt.getStringProperty("nxt.keyStorePassword"));
			sslContextFactory.setExcludeCipherSuites("SSL_RSA_WITH_DES_CBC_SHA", "SSL_DHE_RSA_WITH_DES_CBC_SHA",
					"SSL_DHE_DSS_WITH_DES_CBC_SHA", "SSL_RSA_EXPORT_WITH_RC4_40_MD5", "SSL_RSA_EXPORT_WITH_DES40_CBC_SHA",
					"SSL_DHE_RSA_EXPORT_WITH_DES40_CBC_SHA", "SSL_DHE_DSS_EXPORT_WITH_DES40_CBC_SHA");
			connector = new ServerConnector(apiServer, new SslConnectionFactory(sslContextFactory, "http/1.1"),
					new HttpConnectionFactory(https_config));
		} else {
			connector = new ServerConnector(apiServer);
		}

		connector.setPort(port);
		connector.setHost(host);
		connector.setIdleTimeout(Nxt.getIntProperty("nxt.apiServerIdleTimeout"));
		apiServer.addConnector(connector);

		HandlerList apiHandlers = new HandlerList();

		String apiResourceBase = Nxt.getStringProperty("nxt.apiResourceBase");
		if (apiResourceBase != null) {
			ResourceHandler apiFileHandler = new ResourceHandler();
			apiFileHandler.setDirectoriesListed(true);
			apiFileHandler.setWelcomeFiles(new String[]{"index.html"});
			apiFileHandler.setResourceBase(apiResourceBase);
			apiHandlers.addHandler(apiFileHandler);
		}

		String javadocResourceBase = Nxt.getStringProperty("nxt.javadocResourceBase");
		if (javadocResourceBase != null) {
			ContextHandler contextHandler = new ContextHandler("/doc");
			ResourceHandler docFileHandler = new ResourceHandler();
			docFileHandler.setDirectoriesListed(false);
			docFileHandler.setWelcomeFiles(new String[]{"index.html"});
			docFileHandler.setResourceBase(javadocResourceBase);
			contextHandler.setHandler(docFileHandler);
			apiHandlers.addHandler(contextHandler);
		}

		ServletHandler apiHandler = new ServletHandler();
		apiHandler.addServletWithMapping(APIServlet.class, "/nxt");
		apiHandler.addServletWithMapping(APITestServlet.class, "/test");

		if (Nxt.getBooleanProperty("nxt.apiServerCORS")) {
			FilterHolder filterHolder = apiHandler.addFilterWithMapping(CrossOriginFilter.class, "/*", FilterMapping.DEFAULT);
			filterHolder.setInitParameter("allowedHeaders", "*");
			filterHolder.setAsyncSupported(true);
		}

		apiHandlers.addHandler(apiHandler);
		apiHandlers.addHandler(new DefaultHandler());

		apiServer.setHandler(apiHandlers);
		apiServer.setStopAtShutdown(true);

		ThreadPool.runBeforeStart(new Runnable() {
			@Override
			public void run() {
				try {
					apiServer.start();
					Logger.logMessage("Started API server at " + host + ":" + port);
				} catch (Exception e) {
					Logger.logDebugMessage("Failed to start API server", e);
					throw new RuntimeException(e.toString(), e);
				}

			}
		});

	} else {
		apiServer = null;
		Logger.logMessage("API server not enabled");
	}

}

public static void init() {}

public static void shutdown() {
	if (apiServer != null) {
		try {
			apiServer.stop();
		} catch (Exception e) {
			Logger.logDebugMessage("Failed to stop API server", e);
		}
	}
}
*/








/*
abstract static class APIRequestHandler {

	private final List<String> parameters;

	APIRequestHandler(String... parameters) {
		this.parameters = Collections.unmodifiableList(Arrays.asList(parameters));
	}

	final List<String> getParameters() {
		return parameters;
	}

	abstract JSONStreamAware processRequest(HttpServletRequest request) throws NxtException;

	boolean requirePost() {
		return false;
	}

}

private static final boolean enforcePost = Nxt.getBooleanProperty("nxt.apiServerEnforcePOST");

static final Map<String,APIRequestHandler> apiRequestHandlers;

protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
	process(req, resp);
}

protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
	process(req, resp);
}

private void process(HttpServletRequest req, HttpServletResponse resp) throws IOException {

	resp.setHeader("Cache-Control", "no-cache, no-store, must-revalidate, private");
	resp.setHeader("Pragma", "no-cache");
	resp.setDateHeader("Expires", 0);

	JSONStreamAware response = JSON.emptyJSON;

	try {

		if (API.allowedBotHosts != null && ! API.allowedBotHosts.contains(req.getRemoteHost())) {
			response = ERROR_NOT_ALLOWED;
			return;
		}

		String requestType = req.getParameter("requestType");
		if (requestType == null) {
			response = ERROR_INCORRECT_REQUEST;
			return;
		}

		APIRequestHandler apiRequestHandler = apiRequestHandlers.get(requestType);
		if (apiRequestHandler == null) {
			response = ERROR_INCORRECT_REQUEST;
			return;
		}

		if (enforcePost && apiRequestHandler.requirePost() && ! "POST".equals(req.getMethod())) {
			response = POST_REQUIRED;
			return;
		}

		try {
			response = apiRequestHandler.processRequest(req);
		} catch (ParameterException e) {
			response = e.getErrorResponse();
		} catch (NxtException |RuntimeException e) {
			Logger.logDebugMessage("Error processing API request", e);
			response = ERROR_INCORRECT_REQUEST;
		}

	} finally {
		resp.setContentType("text/plain; charset=UTF-8");
		try (Writer writer = resp.getWriter()) {
			response.writeJSONString(writer);
		}
	}
}
*/








/*
---- APITestServlet ----

private static final String header =
		"<!DOCTYPE html>\n" +
		"<html>\n" +
		"<head>\n" +
		"    <meta charset=\"UTF-8\"/>\n" +
		"    <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">" +
		"    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">" + 
		"    <title>Nxt http API</title>\n" +
		"    <link href=\"css/bootstrap.min.css\" rel=\"stylesheet\" type=\"text/css\" />" +
		"    <style type=\"text/css\">\n" +
		"        table {border-collapse: collapse;}\n" +
		"        td {padding: 10px;}\n" +
		"        .result {white-space: pre; font-family: monospace;}\n" +
		"    </style>\n" +
		"    <script type=\"text/javascript\">\n" +
		"        function submitForm(form) {\n" +
		"            var url = '/nxt';\n" +
		"            var params = '';\n" +
		"            for (i = 0; i < form.elements.length; i++) {\n" +
		"                if (! form.elements[i].name) {\n" +
		"                    continue;\n" +
		"                }\n" +
		"                if (i > 0) {\n" +
		"                    params += '&';\n" +
		"                }\n" +
		"                params += encodeURIComponent(form.elements[i].name);\n" +
		"                params += '=';\n" +
		"                params += encodeURIComponent(form.elements[i].value);\n" +
		"            }\n" +
		"            var request = new XMLHttpRequest();\n" +
		"            request.open(\"POST\", url, false);\n" +
		"            request.setRequestHeader(\"Content-type\", \"application/x-www-form-urlencoded\");\n" +
		"            request.send(params);\n" +
		"            var result = JSON.stringify(JSON.parse(request.responseText), null, 4);\n" +
		"            form.getElementsByClassName(\"result\")[0].textContent = result;\n" +
		"            return false;\n" +
		"        }\n" +
		"    </script>\n" +
		"</head>\n" +
		"<body>\n" +
		"<div class=\"navbar navbar-default\" role=\"navigation\">" +
		"   <div class=\"container\">" + 
		"       <div class=\"navbar-header\">" +
		"           <a class=\"navbar-brand\" href=\"#\">Nxt http API</a>" + 
		"       </div>" +
		"       <div class=\"navbar-collapse collapse\">" +
		"           <ul class=\"nav navbar-nav navbar-right\">" +
		"               <li><a href=\"https://wiki.nxtcrypto.org/wiki/Nxt_API\" target=\"_blank\">Docs</a></li>" +
		"           </ul>" +
		"       </div>" +
		"   </div>" + 
		"</div>" +
		"<div class=\"container\">" +
		"<div class=\"row\">" +
		"<div class=\"col-xs-12\">" +
		"<div class=\"panel-group\" id=\"accordion\">";

private static final String footer =
		"</div> <!-- panel-group -->" +
		"<br/><br/>" +
		"</div> <!-- col -->" +
		"</div> <!-- row -->" +
		"</div> <!-- container -->" +
		"<script src=\"js/3rdparty/jquery-2.1.0.js\"></script>" +
		"<script src=\"js/3rdparty/bootstrap.js\" type=\"text/javascript\"></script>" +
		"</body>\n" +
		"</html>\n";

private static final List<String> requestTypes = new ArrayList<>(APIServlet.apiRequestHandlers.keySet());
static {
	Collections.sort(requestTypes);
}

protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

	resp.setHeader("Cache-Control", "no-cache, no-store, must-revalidate, private");
	resp.setHeader("Pragma", "no-cache");
	resp.setDateHeader("Expires", 0);
	resp.setContentType("text/html; charset=UTF-8");

	try (PrintWriter writer = resp.getWriter()) {
		writer.print(header);
		String requestType = Convert.nullToEmpty(req.getParameter("requestType"));
		APIServlet.APIRequestHandler requestHandler = APIServlet.apiRequestHandlers.get(requestType);
		if (requestHandler != null) {
			writer.print(form(requestType, requestHandler.getParameters()));
		} else {
			for (String type : requestTypes) {
				writer.print(form(type, APIServlet.apiRequestHandlers.get(type).getParameters()));
			}
		}
		writer.print(footer);
	}

}

private static String form(String requestType, List<String> parameters) {
	StringBuilder buf = new StringBuilder();
	buf.append("<div class=\"panel panel-default\">");
	buf.append("<div class=\"panel-heading\">");
	buf.append("<h4 class=\"panel-title\">");
	buf.append("<a data-toggle=\"collapse\" data-parent=\"#accordion\" href=\"#collapse");
	buf.append(requestType).append("\">");
	buf.append(requestType);
	buf.append("</a>");
	buf.append("</h4>");
	buf.append("</div> <!-- panel-heading -->");
	buf.append("<div id=\"collapse").append(requestType).append("\" class=\"panel-collapse collapse\">");
	buf.append("<div class=\"panel-body\">");
	buf.append("<form action=\"/nxt\" method=\"POST\" onsubmit=\"return submitForm(this);\">");
	buf.append("<pre class=\"result\" style=\"float:right;width:50%;\">JSON response</pre>");
	buf.append("<input type=\"hidden\" name=\"requestType\" value=\"").append(requestType).append("\"/>");
	buf.append("<table class=\"table\" style=\"width:46%;\">");
	for (String parameter : parameters) {
		buf.append("<tr>");
		buf.append("<td>").append(parameter).append(":</td>");
		buf.append("<td><input type=\"");
		buf.append("secretPhrase".equals(parameter) ? "password" : "text");
		buf.append("\" name=\"").append(parameter).append("\" style=\"width:200px;\"/></td>");
		buf.append("</tr>");
	}
	buf.append("<tr>");
	buf.append("<td colspan=\"2\"><input type=\"submit\" class=\"btn btn-default\" value=\"submit\"/></td>");
	buf.append("</tr>");
	buf.append("</table>");
	buf.append("</form>");
	buf.append("</div> <!-- panel-body -->");
	buf.append("</div> <!-- panel-collapse -->");
	buf.append("</div> <!-- panel -->");
	return buf.toString();
}
*/






exports.DeleteUser = DeleteUser;
exports.GetMain = GetMain;
exports.GetUser = GetUser;
exports.GetUsers = GetUsers;
exports.PostUsers = PostUsers;
exports.PutUser = PutUser;

exports.BroadcastTransaction = require(__dirname + '/BroadcastTransaction');
exports.CalculateFullHash = require(__dirname + '/CalculateFullHash');
exports.CancelAskOrder = require(__dirname + '/CancelAskOrder');
exports.CancelBidOrder = require(__dirname + '/CancelBidOrder');
exports.CastVote = require(__dirname + '/CastVote');
exports.CreatePoll = require(__dirname + '/CreatePoll');
exports.CreateTransaction = require(__dirname + '/CreateTransaction'); // !!!!
exports.DecodeHallmark = require(__dirname + '/DecodeHallmark');
exports.DecodeToken = require(__dirname + '/DecodeToken');
exports.GenerateToken = require(__dirname + '/GenerateToken');
exports.GetAccount = require(__dirname + '/GetAccount');
exports.GetAccountBlockIds = require(__dirname + '/GetAccountBlockIds');
exports.GetAccountCurrentAskOrderIds = require(__dirname + '/GetAccountCurrentAskOrderIds');
exports.GetAccountCurrentBidOrderIds = require(__dirname + '/GetAccountCurrentBidOrderIds');
exports.GetAccountId = require(__dirname + '/GetAccountId');
exports.GetAccountPublicKey = require(__dirname + '/GetAccountPublicKey');
exports.GetAccountTransactionIds = require(__dirname + '/GetAccountTransactionIds');
exports.GetAlias = require(__dirname + '/GetAlias');
exports.GetAliases = require(__dirname + '/GetAliases');
exports.GetAllAssets = require(__dirname + '/GetAllAssets');
exports.GetAllOpenOrders = require(__dirname + '/GetAllOpenOrders');
exports.GetAllTrades = require(__dirname + '/GetAllTrades');
exports.GetAskOrder = require(__dirname + '/GetAskOrder');
exports.GetAskOrderIds = require(__dirname + '/GetAskOrderIds');
exports.GetAskOrders = require(__dirname + '/GetAskOrders');
exports.GetAsset = require(__dirname + '/GetAsset');
exports.GetAssetIds = require(__dirname + '/GetAssetIds');
exports.GetAssets = require(__dirname + '/GetAssets');
exports.GetAssetsByIssuer = require(__dirname + '/GetAssetsByIssuer');
exports.GetBalance = require(__dirname + '/GetBalance');
exports.GetBidOrder = require(__dirname + '/GetBidOrder');
exports.GetBidOrderIds = require(__dirname + '/GetBidOrderIds');
exports.GetBidOrders = require(__dirname + '/GetBidOrders');
exports.GetBlock = require(__dirname + '/GetBlock');
exports.GetBlockchainStatus = require(__dirname + '/GetBlockchainStatus');
exports.GetConstants = require(__dirname + '/GetConstants');
exports.GetForging = require(__dirname + '/GetForging');
exports.GetGuaranteedBalance = require(__dirname + '/GetGuaranteedBalance');
exports.GetMyInfo = require(__dirname + '/GetMyInfo');
exports.GetNextBlockGenerators = require(__dirname + '/GetNextBlockGenerators');
exports.GetPeer = require(__dirname + '/GetPeer');
exports.GetPeers = require(__dirname + '/GetPeers');
exports.GetPoll = require(__dirname + '/GetPoll');
exports.GetPollIds = require(__dirname + '/GetPollIds');
exports.GetProjectList = require(__dirname + '/GetProjectList');
exports.GetProjectListHtml = require(__dirname + '/GetProjectListHtml');
exports.GetState = require(__dirname + '/GetState');
exports.GetTime = require(__dirname + '/GetTime');
exports.GetTrades = require(__dirname + '/GetTrades');
exports.GetTransaction = require(__dirname + '/GetTransaction');
exports.GetTransactionBytes = require(__dirname + '/GetTransactionBytes');
exports.GetUnconfirmedTransactionIds = require(__dirname + '/GetUnconfirmedTransactionIds');
exports.GetUnconfirmedTransactions = require(__dirname + '/GetUnconfirmedTransactions');
exports.IssueAsset = require(__dirname + '/IssueAsset');
exports.LeaseBalance = require(__dirname + '/LeaseBalance');
exports.MarkHost = require(__dirname + '/MarkHost');
exports.ParseTransaction = require(__dirname + '/ParseTransaction');
exports.PlaceAskOrder = require(__dirname + '/PlaceAskOrder');
exports.PlaceBidOrder = require(__dirname + '/PlaceBidOrder');
exports.SendMessage = require(__dirname + '/SendMessage');
exports.SendMoney = require(__dirname + '/SendMoney');
exports.SetAccountInfo = require(__dirname + '/SetAccountInfo');
exports.SetAlias = require(__dirname + '/SetAlias');
exports.SignTransaction = require(__dirname + '/SignTransaction');
exports.StartForging = require(__dirname + '/StartForging');
exports.StopForging = require(__dirname + '/StopForging');
exports.TransferAsset = require(__dirname + '/TransferAsset');
