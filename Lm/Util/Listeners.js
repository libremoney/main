/**!
 * LibreMoney Listeners 0.0
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */


function Listeners() {
	this.listenersMap = new Array();
	return this;
}


function AddListener(eventType, listener) {
	var listeners = this.listenersMap[eventType];
	if (listeners == null) {
		listeners = new Array(); //CopyOnWriteArrayList<>();
		this.listenersMap[eventType] = listeners;
	}
	return listeners.push(listener);
}

function Notify(eventType, t) {
	var listeners = this.listenersMap[eventType];
	if (listeners != null) {
		for (var i in listeners) {
			listener = listeners[i];
			if (listener)
				listener(t);
		}
	}
}

function RemoveListener(eventType, listener) {
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


Listeners.prototype.AddListener = AddListener;
Listeners.prototype.Notify = Notify;
Listeners.prototype.RemoveListener = RemoveListener;


module.exports = Listeners;
