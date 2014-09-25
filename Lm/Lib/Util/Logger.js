/*!
 * LibreMoney Logger 0.2
 * Copyright(c) 2014 LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

if (typeof module !== "undefined") {
	var winston = require('winston');
	var Listeners = require(__dirname + '/Listeners');
}


var Logger = function() {
	// Our logger instance
	var log;

	// Log event types
	var Event = {
		MESSAGE:0,
		EXCEPTION:1
	}

	// Log levels enum
	var Level = {
		None: 0,
		Error: 1,
		Warn: 2,
		Info: 3,
		Debug: 4
	}

	var messageListeners = new Listeners();
	var exceptionListeners = new Listeners();


	function GetLogger(module) {
		if (!module)
			var path = ''
		else
			var path = module.filename.split('/').slice(-2).join('/');
		return new winston.Logger({
			transports : [
				new winston.transports.Console({
					colorize: true,
					level: 'debug',
					label: path,
					timestamp: true
				})
			]
		});
	}

	/**
	 * Add a message listener
	 *
	 * @param listener Listener
	 * @param eventType Notification event type
	 * @return TRUE if listener added
	 */
	function AddMessageListener(eventType, listener) {
		return messageListeners.AddListener(eventType, listener);
	}

	/**
	 * Add an exception listener
	 *
	 * @param listener Listener
	 * @param eventType Notification event type
	 * @return TRUE if listener added
	 */
	function AddExceptionListener(eventType, listener) {
		return exceptionListeners.AddListener(eventType, listener);
	}

	/**
	 * Remove a message listener
	 *
	 * @param listener Listener
	 * @param eventType Notification event type
	 * @return TRUE if listener removed
	 */
	function RemoveMessageListener(eventType, listener) {
		return messageListeners.RemoveListener(eventType, listener);
	}

	/**
	 * Remove an exception listener
	 *
	 * @param listener Listener
	 * @param eventType Notification event type
	 * @return TRUE if listener removed
	 */
	function RemoveExceptionListener(eventType, listener) {
		return exceptionListeners.RemoveListener(eventType, listener);
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
			DoLog(Level.Warn, message, null);
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
			exceptionListeners.Notify(Event.EXCEPTION, exc);
		else
			messageListeners.Notify(Event.MESSAGE, message);
		*/
		//throw new Error('Not implementted');
	}


	log = GetLogger();

	return {
		AddMessageListener: AddMessageListener,
		AddExceptionListener: AddExceptionListener,
		DoLog: DoLog,
		GetLogger: GetLogger,
		LogErrorMessage: LogErrorMessage,
		LogDebugMessage: LogDebugMessage,
		LogInfoMessage: LogInfoMessage,
		LogMessage: LogMessage,
		LogWarningMessage: LogWarningMessage,
		RemoveExceptionListener: RemoveExceptionListener
	}
}();


if (typeof module !== "undefined") {
	module.exports = Logger;
}