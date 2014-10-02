/**!
 * LibreMoney ThreadPool 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

if (typeof module !== "undefined") {
	var Logger = require(__dirname + '/../Lib/Util/Logger').GetLogger(module);
}


// ----

function Sheduler(job) {
	this.job = job;
	this.NewInterval();
	return this;
}

Sheduler.prototype.NewInterval = function() {
	var s = this;
	this.interval = new setInterval(function() {
		s.job.runnable();
		s.interval = this.NewInterval;
	}, this.job.delay);
	return this;
}

Sheduler.prototype.Shutdown = function() {
	clearInterval(this.interval);
}

// ----

var ThreadPool = function() {
	this.scheduledThreadPool;
	this.backgroundJobs = new Array();
	this.beforeStartJobs = new Array();
	this.lastBeforeStartJobs = new Array();
	return this;
}();

ThreadPool.RunAll = function(jobs) {
	for (var i = 0; jobs.length > i; i++) {
		jobs[i].runnable();
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

ThreadPool.RunBeforeStart = function(runnable, runLast) {
	if (scheduledThreadPool) {
		throw new Error("IllegalStateException: Executor service already started");
	}
	if (runLast) {
		this.lastBeforeStartJobs.push({
			runnable: runnable,
			delay: 100
		});
	} else {
		this.beforeStartJobs.push({
			runnable: runnable,
			dalay: 100
		});
	}
}

ThreadPool.ScheduleThread = function(runnable, delay, name) {
	if (this.scheduledThreadPool) {
		throw new Error("Executor service already started, no new jobs accepted");
	}
	this.backgroundJobs.push({
		runnable: runnable,
		delay: delay,
		name: name
	});
}

ThreadPool.Shutdown = function() {
	if (this.scheduledThreadPool != null) {
		Logger.debug("Stopping background jobs...");
		this.ShutdownExecutor(scheduledThreadPool);
		this.scheduledThreadPool.length = 0;
		Logger.debug("...Done");
	}
}

ThreadPool.ShutdownExecutor = function(executor) {
	for (var i in executor) {
		executor[i].Shutdown();
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

ThreadPool.Start = function() {
	if (this.scheduledThreadPool) {
		throw new Error("Executor service already started");
	}

	Logger.debug("Running " + this.beforeStartJobs.length + " final tasks...");
	this.RunAll(this.beforeStartJobs);
	this.beforeStartJobs.length = 0;

	Logger.debug("Running " + this.lastBeforeStartJobs.length + " final tasks...");
	this.RunAll(this.lastBeforeStartJobs);
	this.lastBeforeStartJobs.length = 0;

	Logger.debug("Starting " + this.backgroundJobs.length + " background jobs");
	this.scheduledThreadPool = [];
	for (var i = 0; this.backgroundJobs.length > i; i++) {
		var sheduler = new Sheduler(this.backgroundJobs[i]);
		this.scheduledThreadPool.push(sheduler);
	}
	// TODO
	/*
	scheduledThreadPool = Executors.newScheduledThreadPool(backgroundJobs.size());
	for (Map.Entry<Runnable,Integer> entry : backgroundJobs.entrySet()) {
		scheduledThreadPool.scheduleWithFixedDelay(entry.getKey(), 0, entry.getValue(), TimeUnit.MILLISECONDS);
	}
	*/
	this.backgroundJobs.length = 0;
}


if (typeof module !== "undefined") {
	module.exports = ThreadPool;
}
