/**!
 * LibreMoney Listeners 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */


function Listeners() {
	this.listenersMap = new Array();
	return this;
}


Listeners.prototype.addListener = function(eventType, listener) {
	return this.AddListener(eventType, listener);
}

Listeners.prototype.AddListener = function(eventType, listener) {
	var listeners = this.listenersMap[eventType];
	if (listeners == null) {
		listeners = new Array(); //CopyOnWriteArrayList<>();
		this.listenersMap[eventType] = listeners;
	}
	return listeners.push(listener);
}

Listeners.prototype.emit = function(eventType, data) {
	return this.Notify(eventType, data);
}

Listeners.prototype.Notify = function(eventType, data) {
	var listeners = this.listenersMap[eventType];
	if (listeners != null) {
		for (var i in listeners) {
			listener = listeners[i];
			if (typeof listener === "function")
				listener(data);
		}
	}
}

Listeners.prototype.on = function(eventType, listener) {
	return this.AddListener(eventType, listener);
}

Listeners.prototype.RemoveListener = function(eventType, listener) {
	var listeners = listenersMap[eventType];
	if (listeners != null) {
		var i = listeners.indexOf(listener);
		if (i >= 0) {
			listeners[i] = null;
			return true;
		}
	}
	return false;
}


if (typeof module !== "undefined") {
	module.exports = Listeners;
}
