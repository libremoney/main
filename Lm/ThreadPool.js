/**!
 * LibreMoney ThreadPool 0.0
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var Logger = require(__dirname + '/Logger').GetLogger(module);


var scheduledThreadPool;
var backgroundJobs = new Array();
var runBeforeStartJobs = new Array();


// ----

function Sheduler(job) {
	this.job = job;
	this.NewInterval();
	return this;
}

function Sheduler_NewInterval() {
	var s = this;
	this.interval = new setInterval(function() {
		s.job.runnable();
		s.interval = Sheduler_NewInterval;
	}, this.job.delay);
	return this;
}

function Sheduler_Shutdown() {
	clearInterval(this.interval);
}

Sheduler.prototype.NewInterval = Sheduler_NewInterval;
Sheduler.prototype.Shutdown = Sheduler_Shutdown;

// ----

function RunBeforeStart(runnable) {
	if (scheduledThreadPool) {
		throw new Error("IllegalStateException: Executor service already started");
	}
	runBeforeStartJobs.push(runnable);
}

function ScheduleThread(runnable, delay, name) {
	if (scheduledThreadPool) {
		throw new Error("Executor service already started, no new jobs accepted");
	}
	backgroundJobs.push({
		runnable: runnable,
		delay: delay,
		name: name
	});
}

function Start() {
	if (scheduledThreadPool) {
		throw new Error("Executor service already started");
	}

	Logger.debug("Running " + runBeforeStartJobs.length + " final tasks...");
	for (var i = 0;  runBeforeStartJobs.length > i; i++) {
		runBeforeStartJobs[i]();
	}
	runBeforeStartJobs.length = 0;
	Logger.debug("Starting " + backgroundJobs.length + " background jobs");
	scheduledThreadPool = [];
	for (var i = 0; backgroundJobs.length > i; i++) {
		var sheduler = new Sheduler(backgroundJobs[i]);
		scheduledThreadPool.push(sheduler);
	}
	/*
	scheduledThreadPool = Executors.newScheduledThreadPool(backgroundJobs.size());
	for (Map.Entry<Runnable,Integer> entry : backgroundJobs.entrySet()) {
		scheduledThreadPool.scheduleWithFixedDelay(entry.getKey(), 0, entry.getValue(), TimeUnit.SECONDS);
	}
	*/
	backgroundJobs = null;
}

function Shutdown() {
	Logger.debug("Stopping background jobs...");
	ShutdownExecutor(scheduledThreadPool);
	scheduledThreadPool = null;
	Logger.debug("...Done");
}

function ShutdownExecutor(executor) {
	for (exec in executor) {
		exec.Shutdown();
	}
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
