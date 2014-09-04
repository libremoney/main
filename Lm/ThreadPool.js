/**!
 * LibreMoney ThreadPool 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var Logger = require(__dirname + '/Logger').GetLogger(module);


var scheduledThreadPool;
var backgroundJobs = new Array();
var beforeStartJobs = new Array();
var lastBeforeStartJobs = new Array();


// ----

function RunAll(jobs) {
	for (var i = 0; jobs.length > i; i++) {
		jobs[i]();
	}
	// TODO
	/*
	List<Thread> threads = new ArrayList<>();
	final StringBuffer errors = new StringBuffer();
	for (final Runnable runnable : jobs) {
		Thread thread = new Thread() {
			@Override
			public void run() {
				try {
					runnable.run();
				} catch (Throwable t) {
					errors.append(t.getMessage()).append('\n');
					throw t;
				}
			}
		};
		thread.setDaemon(true);
		thread.start();
		threads.add(thread);
	}
	for (Thread thread : threads) {
		try {
			thread.join();
		} catch (InterruptedException e) {
			Thread.currentThread().interrupt();
		}
	}
	if (errors.length() > 0) {
		throw new RuntimeException("Errors running startup tasks:\n" + errors.toString());
	}
	*/
}

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

function RunBeforeStart(runnable, runLast) {
	if (scheduledThreadPool) {
		throw new Error("IllegalStateException: Executor service already started");
	}
	if (runLast) {
		lastBeforeStartJobs.push(runnable);
	} else {
		beforeStartJobs.push(runnable);
	}
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
	runAll(beforeStartJobs);
	runBeforeStartJobs.length = 0;

	Logger.debug("Running " + lastBeforeStartJobs.size() + " final tasks...");
	runAll(lastBeforeStartJobs);
	lastBeforeStartJobs.length = 0;

	Logger.debug("Starting " + backgroundJobs.length + " background jobs");
	scheduledThreadPool = [];
	for (var i = 0; backgroundJobs.length > i; i++) {
		var sheduler = new Sheduler(backgroundJobs[i]);
		scheduledThreadPool.push(sheduler);
	}
	// TODO
	/*
	scheduledThreadPool = Executors.newScheduledThreadPool(backgroundJobs.size());
	for (Map.Entry<Runnable,Integer> entry : backgroundJobs.entrySet()) {
		scheduledThreadPool.scheduleWithFixedDelay(entry.getKey(), 0, entry.getValue(), TimeUnit.MILLISECONDS);
	}
	*/
	backgroundJobs.length = 0;
}

function Shutdown() {
	if (scheduledThreadPool != null) {
		Logger.debug("Stopping background jobs...");
		ShutdownExecutor(scheduledThreadPool);
		scheduledThreadPool.length = 0;
		Logger.debug("...Done");
	}
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


exports.RunAll = RunAll;
exports.RunBeforeStart = RunBeforeStart;
exports.ScheduleThread = ScheduleThread;
exports.Shutdown = Shutdown;
exports.ShutdownExecutor = ShutdownExecutor;
exports.Start = Start;
