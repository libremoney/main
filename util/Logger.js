/**
 * Handle logging for the Nxt node server
 */

var winston = require('winston');

/*
// Log event types
public static enum Event {
	MESSAGE, EXCEPTION
}
*/

// Log levels enum
var Level = {
	None: 0,
	Error: 1,
	Warn: 2,
	Info: 3,
	Debug: 4
}

/*
// Message listeners
private static final Listeners<String, Event> messageListeners = new Listeners<>();

// Exception listeners
private static final Listeners<Exception, Event> exceptionListeners = new Listeners<>();
*/

/**
 * Initialize the JDK log manager using the Java logging configuration files
 * nxt/conf/logging-default.properties and nxt/conf/logging.properties.  The
 * values specified in logging.properties will override the values specified in
 * logging-default.properties.  The system-wide Java logging configuration file
 * jre/lib/logging.properties will be used if no Nxt configuration file is found.
 *
 * We will provide our own LogManager extension to delay log handler shutdown
 * until we no longer need logging services.
 */
/*
static {
	System.setProperty("java.util.logging.manager", "nxt.util.NxtLogManager");
	try {
		boolean foundProperties = false;
		Properties loggingProperties = new Properties();
		try (InputStream is = ClassLoader.getSystemResourceAsStream("logging-default.properties")) {
			if (is != null) {
				loggingProperties.load(is);
				foundProperties = true;
			}
		}
		try (InputStream is = ClassLoader.getSystemResourceAsStream("logging.properties")) {
			if (is != null) {
				loggingProperties.load(is);
				foundProperties = true;
			}
		}
		if (foundProperties) {
			ByteArrayOutputStream outStream = new ByteArrayOutputStream();
			loggingProperties.store(outStream, "logging properties");
			ByteArrayInputStream inStream = new ByteArrayInputStream(outStream.toByteArray());
			java.util.logging.LogManager.getLogManager().readConfiguration(inStream);
			inStream.close();
			outStream.close();
		}
	} catch (IOException e) {
		throw new RuntimeException("Error loading logging properties", e);
	}
	BriefLogFormatter.init();
}
*/

function getLogger() {
	return new winston.Logger({
		transports : [
			new winston.transports.Console({
				colorize: true,
				level: 'debug',
				label: 'Lm',
				timestamp: true
			})
		]
	});
}

// Our logger instance
var log = getLogger();

/*
// Enable stack traces
private static final boolean enableStackTraces = Nxt.getBooleanProperty("lm.enableStackTraces");

// Enable log traceback
private static final boolean enableLogTraceback = Nxt.getBooleanProperty("lm.enableLogTraceback");

// Logger shutdown
public static void shutdown() {
	((NxtLogManager)LogManager.getLogManager()).nxtShutdown();
}
*/

/**
 * Add a message listener
 *
 * @param listener Listener
 * @param eventType Notification event type
 * @return TRUE if listener added
 */
function AddMessageListener(listener, eventType) {
	throw new Error('Not implementted');
	/*
	return messageListeners.addListener(listener, eventType);
	*/
}

/**
 * Add an exception listener
 *
 * @param listener Listener
 * @param eventType Notification event type
 * @return TRUE if listener added
 */
function AddExceptionListener(listener, eventType) {
	throw new Error('Not implementted');
	/*
	return exceptionListeners.addListener(listener, eventType);
	*/
}

/**
 * Remove a message listener
 *
 * @param listener Listener
 * @param eventType Notification event type
 * @return TRUE if listener removed
 */
function RemoveMessageListener(listener, eventType) {
	throw new Error('Not implementted');
	/*
	return messageListeners.removeListener(listener, eventType);
	*/
}

/**
 * Remove an exception listener
 *
 * @param listener Listener
 * @param eventType Notification event type
 * @return TRUE if listener removed
 */
function RemoveExceptionListener(listener, eventType) {
	throw new Error('Not implementted');
	/*
	return exceptionListeners.removeListener(listener, eventType);
	*/
}

/**
 * Log a message (map to INFO)
 * Log an exception (map to ERROR if exc not is null)
 *
 * @param message Message
 * @param exc Exception
 */
function LogMessage(message, exc) {
	if (!exc) {
		DoLog(Level.Info, message, null);
	} else {
		DoLog(Level.Error, message, exc);
	}
}

/**
 * Log an ERROR message
 *
 * @param message Message
 * @param exc Exception
 */
function LogErrorMessage(message, exc) {
	if (!exc) {
		DoLog(Level.Error, message, null);
	} else {
		DoLog(Level.Error, message, exc);
	}
}

/**
 * Log a WARNING message
 *
 * @param message Message
 * @param exc Exception
 */
function LogWarningMessage(message, exc) {
	if (!exc) {
		doLog(Level.Warn, message, null);
	} else {
		DoLog(Level.Warn, message, exc);
	}
}

/**
 * Log an INFO message
 *
 * @param message Message
 * @param exc Exception
 */
function LogInfoMessage(message, exc) {
	if (!exc) {
		DoLog(Level.Info, message, null);
	} else {
		DoLog(Level.Info, message, exc);
	}
}

/**
 * Log a debug message
 *
 * @param message Message
 * @param exc Exception
 */
function LogDebugMessage(message, exc) {
	if (!exc) {
		DoLog(Level.Debug, message, null);
	} else {
		DoLog(Level.Debug, message, exc);
	}
}


/**
 * Log the event
 *
 * @param level Level
 * @param message Message
 * @param exc Exception
 */
function DoLog(level, message, exc) {
	var logMessage = message;
	var e = exc;

	/*
	// Add caller class and method if enabled
	if (enableLogTraceback) {
		StackTraceElement caller = Thread.currentThread().getStackTrace()[3];
		String className = caller.getClassName();
		int index = className.lastIndexOf('.');
		if (index != -1)
			className = className.substring(index+1);
		logMessage = className + "." + caller.getMethodName() + ": " + logMessage;
	}

	// Format the stack trace if enabled
	if (e != null) {
		if (!enableStackTraces) {
			logMessage = logMessage + "\n" + exc.toString();
			e = null;
		}
	}
	*/

	// Log the event
	switch (level) {
		case Level.Debug:
			log.info(logMessage);
			break;
		case Level.Info:
			log.info(logMessage);
			break;
		case Level.Warn:
			log.warn(logMessage);
			break;
		case Level.Error:
			log.error(logMessage);
			break;
		default:
			log.error(logMessage);
	}

	/*
	// Notify listeners
	if (exc != null)
		exceptionListeners.notify(exc, Event.EXCEPTION);
	else
		messageListeners.notify(message, Event.MESSAGE);
	*/
	//throw new Error('Not implementted');
}


exports.AddMessageListener = AddMessageListener;
exports.AddExceptionListener = AddExceptionListener;
exports.RemoveExceptionListener = RemoveExceptionListener;
exports.LogMessage = LogMessage;
exports.LogErrorMessage = LogErrorMessage;
exports.LogWarningMessage = LogWarningMessage;
exports.LogInfoMessage = LogInfoMessage;
exports.LogDebugMessage = LogDebugMessage;
exports.DoLog = DoLog;
