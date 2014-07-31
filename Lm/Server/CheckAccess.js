/**!
 * LibreMoney server 0.0
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
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
*/

/*
static final Map<String,APIRequestHandler> apiRequestHandlers;
*/

function Process(req, res) {
	/*
	res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate, private");
	res.setHeader("Pragma", "no-cache");
	res.setDateHeader("Expires", 0);

	JSONStreamAware response = JSON.emptyJSON;

	try {

		if (API.allowedBotHosts != null && ! API.allowedBotHosts.contains(req.getRemoteHost())) {
			response = JsonResponses.ERROR_NOT_ALLOWED;
			return;
		}

		String requestType = req.getParameter("requestType");
		if (requestType == null) {
			response = JsonResponses.ERROR_INCORRECT_REQUEST;
			return;
		}

		APIRequestHandler apiRequestHandler = apiRequestHandlers.get(requestType);
		if (apiRequestHandler == null) {
			response = JsonResponses.ERROR_INCORRECT_REQUEST;
			return;
		}

		if (Server.enforcePost1 && apiRequestHandler.requirePost() && ! "POST".equals(req.getMethod())) {
			response = JsonResponses.POST_REQUIRED;
			return;
		}

		try {
			response = apiRequestHandler.processRequest(req);
		} catch (ParameterException e) {
			response = e.getErrorResponse();
		} catch (NxtException |RuntimeException e) {
			Logger.logDebugMessage("Error processing API request", e);
			response = JsonResponses.ERROR_INCORRECT_REQUEST;
		}

	} finally {
		res.setContentType("text/plain; charset=UTF-8");
		try (Writer writer = res.getWriter()) {
			response.writeJSONString(writer);
		}
	}
	*/
	throw new Error('This is not implemented');
}


module.exports = Process;
