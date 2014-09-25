/**!
 * LibreMoney Listeners 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */


function Listeners() {
	this.listenersMap = new Array();
	return this;
}


function Listeners_AddListener(eventType, listener) {
	var listeners = this.listenersMap[eventType];
	if (listeners == null) {
		listeners = new Array(); //CopyOnWriteArrayList<>();
		this.listenersMap[eventType] = listeners;
	}
	return listeners.push(listener);
}

function Listeners_Notify(eventType, t) {
	var listeners = this.listenersMap[eventType];
	if (listeners != null) {
		for (var i in listeners) {
			listener = listeners[i];
			if (listener)
				listener(t);
		}
	}
}

function Listeners_RemoveListener(eventType, listener) {
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


Listeners.prototype.AddListener = Listeners_AddListener;
Listeners.prototype.Notify = Listeners_Notify;
Listeners.prototype.RemoveListener = Listeners_RemoveListener;


if (typeof module !== "undefined") {
	module.exports = Listeners;
}
