/**!
 * LibreMoney ThreadPool 0.0
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var scheduledThreadPool;
var backgroundJobs = new Array(); //HashMap<>();
var runBeforeStartJobs = new Array();


function RunBeforeStart(runnable) {
	if (scheduledThreadPool != null) {
		throw new Error("IllegalStateException: Executor service already started");
	}
	runBeforeStartJobs.push(runnable);
}

function ScheduleThread(runnable, delay) {
	if (scheduledThreadPool) {
		throw new Error("Executor service already started, no new jobs accepted");
	}
	backgroundJobs.push({
		runnable:runnable,
		delay:delay
	});
}

function Start() {
	throw new Error('Not implemented');
	/*
	if (scheduledThreadPool != null) {
		throw new IllegalStateException("Executor service already started");
	}
	Logger.logDebugMessage("Running " + runBeforeStartJobs.size() + " final tasks...");
	for (Runnable runnable : runBeforeStartJobs) {
		runnable.run(); // run them all sequentially within the current thread
	}
	runBeforeStartJobs = null;
	Logger.logDebugMessage("Starting " + backgroundJobs.size() + " background jobs");
	scheduledThreadPool = Executors.newScheduledThreadPool(backgroundJobs.size());
	for (Map.Entry<Runnable,Integer> entry : backgroundJobs.entrySet()) {
		scheduledThreadPool.scheduleWithFixedDelay(entry.getKey(), 0, entry.getValue(), TimeUnit.SECONDS);
	}
	backgroundJobs = null;
	*/
}

function Shutdown() {
	throw new Error('Not implemented');
	/*
	Logger.logDebugMessage("Stopping background jobs...");
	shutdownExecutor(scheduledThreadPool);
	scheduledThreadPool = null;
	Logger.logDebugMessage("...Done");
	*/
}

function ShutdownExecutor(executor) {
	throw new Error('Not implemented');
	/*
	executor.shutdown();
	try {
		executor.awaitTermination(10, TimeUnit.SECONDS);
	} catch (InterruptedException e) {
		Thread.currentThread().interrupt();
	}
	if (! executor.isTerminated()) {
		Logger.logMessage("some threads didn't terminate, forcing shutdown");
		executor.shutdownNow();
	}
	*/
}


exports.RunBeforeStart = RunBeforeStart;
exports.ScheduleThread = ScheduleThread;
exports.Start = Start;
exports.Shutdown = Shutdown;
exports.ShutdownExecutor = ShutdownExecutor;
